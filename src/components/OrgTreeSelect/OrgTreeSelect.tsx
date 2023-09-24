import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect/types';
import { TreeSelect, TreeSelectProps } from 'antd';
import { useRequest } from '@@/exports';
import { listOrganizations } from '@/services/organization';
import { convertToTreeData, DataNode } from '@/utils/tree';

export type Props = Omit<TreeSelectProps, 'loadData' | 'treeData' | 'loading'>;

const { SHOW_ALL } = TreeSelect;

const OrgTreeSelect: React.FC<Props> = (props) => {
  const [organizationData, setOrganizationData] = useState<DataNode[] | any>([]);

  const { run: doGetOrgData, loading } = useRequest(listOrganizations, {
    manual: true,
    loadingDelay: 600,
    onSuccess: (res) => {
      if (res) {
        setOrganizationData(convertToTreeData((res as API.OrganizationList).items));
      }
    },
  });

  useAsyncEffect(async () => {
    doGetOrgData({});
  }, []);

  return (
    <TreeSelect
      fieldNames={{ value: 'id', label: 'name' }}
      loading={loading}
      treeData={organizationData}
      treeCheckable={true}
      showCheckedStrategy={SHOW_ALL}
      treeCheckStrictly={true}
      {...props}
    />
  );
};

export default OrgTreeSelect;
