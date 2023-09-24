import { DependencyList, Key, useEffect, useState } from 'react';
import { App } from 'antd';
import { useActive } from '@/hooks';
import { BASIC_INTL } from '@/constant';
import { useIntl, useRequest } from '@@/exports';
import { convertToTreeData, DataNode, updateTreeData } from '@/utils/tree';
import {
  deleteDepartment,
  listDepartments,
  listOrganizations,
  updateDepartment,
  UpdateDepartmentRequest,
} from '@/services/organization';

export type Props = {
  initDeps?: DependencyList;
  currentKey?: string;
  onSelect?: (id: string, name: string) => void;
};

export default function useOrgTreeHook(props: Props) {
  const { initDeps = [], onSelect, currentKey } = props;
  const intl = useIntl();
  const { message } = App.useApp();

  const [initLoading, { active: showInitLoading, deactive: hideInitLoading }] = useActive(false);
  const [searching, { active: beginSearching, deactive: endSearching }] = useActive(false);

  /* tree */
  const [selectedKeys, setSelectedKeys] = useState<Key[]>();
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);
  const [currentSelectedNode, setCurrentSelectedNode] = useState<DataNode>();
  const [loadedKeys, setLoadedKeys] = useState<Key[]>();
  const [expandedKeys, setExpandedKeys] = useState<Key[]>();
  const [organizationData, setOrganizationData] = useState<DataNode[] | any>([]);

  /* form modal */
  const [addModalVisible, { toggle: toggleAddModalVisible }] = useActive(false);
  const [editModalVisible, { toggle: toggleEditModalVisible }] = useActive(false);
  const [moveModalVisible, { toggle: toggleMoveModalVisible }] = useActive(false);

  const [updateLoading, { active: showUpdateLoading, deactive: hideUpdateLoading }] =
    useActive(false);

  const { run: getRootOrganizationData, loading: loadRootOrgDataLoading } = useRequest(
    listOrganizations,
    {
      manual: true,
      loadingDelay: 600,
      formatResult: (res) => res && res.items,
      onError: () => {
        hideInitLoading();
      },
      onSuccess: (res) => {
        hideInitLoading();
        if (!res) {
          return;
        }
        const orgList = res as API.Organization[];
        if (orgList.length > 0) {
          const root = orgList[0];
          setOrganizationData(convertToTreeData(orgList));
          setLoadedKeys([]);
          setExpandedKeys([root.metadata.instanceId]);
          setSelectedKeys([root.metadata.instanceId]);
          setAutoExpandParent(true);
          if (onSelect) {
            onSelect(root.metadata.instanceId, root.displayName);
          }
        }
      },
    },
  );

  const { run: getChildDepartments, loading: loadChildLoading } = useRequest(listDepartments, {
    manual: true,
    loadingDelay: 600,
    formatResult: (res) => res && res.items,
  });

  const loadChildren = async (key: any) => {
    if (currentKey && key === currentKey) {
      return Promise.resolve();
    }
    getChildDepartments({ fieldSelector: `parentId=${key}` }).then((childData) => {
      if (childData) {
        setOrganizationData((origin: DataNode[]) =>
          updateTreeData(origin, key, convertToTreeData(childData), currentKey),
        );
      }
    });
  };

  useEffect(() => {
    showInitLoading();
    getRootOrganizationData({});
  }, initDeps);

  const { run: doDelete } = useRequest(deleteDepartment, {
    manual: true,
    onSuccess: async () => {
      message.success(intl.formatMessage(BASIC_INTL.DELETE_SUCCESS));
      getRootOrganizationData({});
    },
  });

  const handleUpdateDepartment = async (deptId: string, updateReq: UpdateDepartmentRequest) => {
    showUpdateLoading();
    const hide = message.loading(intl.formatMessage(BASIC_INTL.UPDATING));
    try {
      if (deptId) {
        await updateDepartment(deptId, updateReq);
      }
      hide();
      message.success(intl.formatMessage(BASIC_INTL.UPDATE_SUCCESS));
      return true;
    } catch (error) {
      hide();
      return false;
    } finally {
      hideUpdateLoading();
    }
  };

  const states = {
    initLoading,
    searching,
    selectedKeys,
    autoExpandParent,
    currentSelectedNode,
    loadedKeys,
    expandedKeys,
    organizationData,
    addModalVisible,
    editModalVisible,
    moveModalVisible,
    loadRootOrgDataLoading,
    loadChildLoading,
    updateLoading,
  };

  const actions = {
    doDelete,
    loadChildren,
    showInitLoading,
    hideInitLoading,
    beginSearching,
    endSearching,
    setLoadedKeys,
    setExpandedKeys,
    setSelectedKeys,
    setAutoExpandParent,
    setCurrentSelectedNode,
    toggleAddModalVisible,
    toggleEditModalVisible,
    toggleMoveModalVisible,
    showUpdateLoading,
    hideUpdateLoading,
    handleUpdateDepartment,
    getRootOrganizationData,
  };

  return {
    states,
    actions,
  } as const;
}
