import type { DataNode } from '@/utils/tree';
import { convertToTreeData, getTreeAllKeys, updateTreeData } from '@/utils/tree';
import { DownOutlined } from '@ant-design/icons';
import { Empty, Input, Spin, Tree } from 'antd';
import type { Key } from 'react';
import React, { useState } from 'react';
import classnames from 'classnames';
import { useIntl } from '@umijs/max';
import { listDepartments } from '@/services/organization';
import { useActive } from '@/hooks';
import useStyle from './style';

const { Search } = Input;

const prefixCls = 'account-organization';

export type Props = {
  handleTitleRender: (node: DataNode) => React.ReactNode;
  onSearchChange: (search: boolean) => void;
  onSelect: (id: string, name: string) => void;
};

const INTL = {
  SEARCH_TREE_PLACEHOLDER: {
    id: 'organization.searchTree.search.placeholder',
  },
};

export default (props: Props) => {
  const intl = useIntl();
  const { styles } = useStyle(prefixCls);

  const { handleTitleRender, onSearchChange, onSelect } = props;
  const [searchOrganizationData, setSearchOrganizationData] = useState<DataNode[] | any>([]);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>();
  const [loadedKeys, setLoadedKeys] = useState<Key[]>();
  const [selectedKeys, setSelectedKeys] = useState<Key[]>();
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);

  const [loading, { active: showLoading, deactive: hideLoading }] = useActive(false);
  const [searching, { active: beginSearching, deactive: endSearching }] = useActive(false);

  const search = async (keyWord: string): Promise<DataNode[]> => {
    let finalOpts = {
      fieldSelector: `name=${keyWord}`,
    };
    const resp = await listDepartments(finalOpts);
    if (resp) {
      const list = convertToTreeData(resp.items);
      setSearchOrganizationData(list);
      setAutoExpandParent(true);
      setExpandedKeys(getTreeAllKeys(list));
      return Promise.resolve(list);
    }
    return Promise.resolve([]);
  };

  const loadData = async (key: any) => {
    showLoading();
    const childResult = await listDepartments({ fieldSelector: `parentId=${key}` });
    if (childResult) {
      setSearchOrganizationData((origin: DataNode[]) =>
        updateTreeData(origin, key, convertToTreeData(childResult.items)),
      );
    }
    hideLoading();
    return Promise.resolve();
  };

  return (
    <div className={styles}>
      <div className={classnames(`${prefixCls}`)}>
        <Spin spinning={loading}>
          <Search
            allowClear
            placeholder={intl.formatMessage(INTL.SEARCH_TREE_PLACEHOLDER)}
            onSearch={async (value) => {
              if (value) {
                showLoading();
                beginSearching();
                onSearchChange(true);
                await search(value);
                hideLoading();
                return;
              }
              endSearching();
              onSearchChange(false);
            }}
          />
          {searching && searchOrganizationData?.length > 0 ? (
            <div className={classnames(`${prefixCls}-tree`)}>
              <Tree<DataNode>
                blockNode
                fieldNames={{ key: 'id', title: 'name' }}
                titleRender={handleTitleRender}
                treeData={searchOrganizationData}
                loadData={(treeNode) => loadData(treeNode.key)}
                showLine={{ showLeafIcon: false }}
                switcherIcon={<DownOutlined />}
                selectedKeys={selectedKeys}
                loadedKeys={loadedKeys}
                onLoad={setLoadedKeys}
                onSelect={(keys_, { node }) => {
                  setSelectedKeys(keys_);
                  onSelect(node.metadata.instanceId, node.name);
                }}
                onExpand={(keys) => {
                  setExpandedKeys(keys);
                  setAutoExpandParent(false);
                }}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
              />
            </div>
          ) : (
            searching &&
            !loading &&
            searchOrganizationData?.length === 0 && (
              <Empty className={classnames(`${prefixCls}-empty`)} />
            )
          )}
        </Spin>
      </div>
    </div>
  );
};
