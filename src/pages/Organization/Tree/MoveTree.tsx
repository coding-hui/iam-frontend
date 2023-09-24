import React, { Key } from 'react';
import { App, Spin, Tree } from 'antd';
import { ModalForm } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { DataNode } from '@/utils/tree';
import { DownOutlined } from '@ant-design/icons';
import useOrgTreeHook from '@/pages/Organization/Tree/_hooks';

export type Props = {
  visible: boolean;
  currentNode?: DataNode | any;
  onFinish: (newParent: string) => Promise<boolean>;
  onCancel?: () => void;
};

const INTL = {
  MOVE_TITLE: {
    id: 'organization.form.moveDept.title',
  },
  ON_SELECTED_ALERT: {
    id: 'organization.alert.moveDept.onSelected.message',
  },
};

const MoveTree: React.FC<Props> = (props) => {
  const intl = useIntl();
  const { message } = App.useApp();
  const { visible, onFinish, onCancel, currentNode } = props;

  const {
    states: {
      initLoading,
      organizationData,
      loadedKeys,
      selectedKeys,
      expandedKeys,
      autoExpandParent,
      loadRootOrgDataLoading,
      loadChildLoading,
      updateLoading,
    },
    actions: {
      loadChildren,
      setLoadedKeys,
      setExpandedKeys,
      setAutoExpandParent,
      setSelectedKeys,
      handleUpdateDepartment,
    },
  } = useOrgTreeHook({ currentKey: currentNode.id });

  const handleSubmit = async () => {
    if (selectedKeys && selectedKeys.length > 0) {
      const newParentId = selectedKeys[0] as string;
      let success = await handleUpdateDepartment(currentNode.id, {
        parentId: newParentId,
        organizationId: currentNode.organizationId,
      });
      if (success) {
        return onFinish(newParentId);
      }
    } else {
      message.warning(intl.formatMessage(INTL.ON_SELECTED_ALERT));
    }
    return false;
  };

  const handleCancel = async () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <ModalForm
      open={visible}
      onFinish={handleSubmit}
      modalProps={{
        onCancel: handleCancel,
        destroyOnClose: true,
      }}
      width="480px"
      autoComplete="off"
      loading={updateLoading}
      title={intl.formatMessage(INTL.MOVE_TITLE)}
    >
      <Spin spinning={initLoading || loadRootOrgDataLoading || loadChildLoading}>
        <Tree<DataNode>
          blockNode
          fieldNames={{ key: 'id', title: 'name' }}
          showLine={{ showLeafIcon: false }}
          switcherIcon={<DownOutlined />}
          loadData={(treeNode) => loadChildren(treeNode.key)}
          loadedKeys={loadedKeys}
          onLoad={setLoadedKeys}
          selectedKeys={selectedKeys}
          treeData={organizationData}
          onExpand={(keys) => {
            setExpandedKeys(keys);
            setAutoExpandParent(false);
          }}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onSelect={(key: Key[]) => {
            setSelectedKeys(key);
          }}
        />
      </Spin>
    </ModalForm>
  );
};

export default MoveTree;
