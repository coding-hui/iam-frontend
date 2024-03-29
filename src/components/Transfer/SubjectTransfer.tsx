import React, { useState } from 'react';
import { Modal, Button, Transfer, Tabs, Spin } from 'antd';
import { useRequest } from '@umijs/max';
import { listUsers } from '@/services/user/listUsers';
import { PlusOutlined } from '@ant-design/icons';
import { useActive } from '@/hooks';
import { listRoles } from '@/services/role/listRoles';
import { TRANSFER_TYPE, TransferType } from '@/components/Transfer/typings';
import { TransferDirection } from 'antd/es/transfer';

interface Props {
  modal?: false;
  modalWidth?: string | number;
  modalTitle?: React.ReactNode;
  targetUsers?: string[];
  doGetTargetUsers?: () => string[];
  targetRoles?: string[];
  doGetTargetRoles?: () => string[];
  onOk: (values: string[]) => Promise<boolean>;
  okText?: string;
  types?: TransferType[];
}

const SubjectTransfer: React.FC<Props> = (props) => {
  const {
    okText = '分配角色',
    targetUsers,
    doGetTargetUsers,
    targetRoles,
    doGetTargetRoles,
    modalWidth = 730,
    modalTitle = '分配角色',
    types = [TRANSFER_TYPE.USER, TRANSFER_TYPE.ROLE],
    onOk,
  } = props;
  const [visible, { toggle: handleEditVisible }] = useActive(false);
  const [currentTab, setCurrentTab] = useState<string>(types[0]);
  const [userTargetKeys, setUserTargetKeys] = useState<string[]>();
  const [userSelectedKeys, setUserSelectedKeys] = useState<string[]>([]);
  const [roleTargetKeys, setRoleTargetKeys] = useState<string[]>();
  const [roleSelectedKeys, setRoleSelectedKeys] = useState<string[]>([]);

  const convertUserToRecordType = (users?: API.UserList) => {
    if (!users) {
      return;
    }
    return users.items.map((item) => {
      return {
        key: item.metadata.instanceId,
        title: item.metadata.name,
        description: item.alias,
      };
    });
  };

  const convertRoleToRecordType = (roles?: API.RoleList) => {
    if (!roles) {
      return;
    }
    return roles.items.map((item) => {
      return {
        key: item.metadata.instanceId,
        title: item.metadata.name,
        description: item.description,
      };
    });
  };

  const {
    run: doListUsers,
    data: users,
    loading: listUserLoading,
  } = useRequest(listUsers, {
    manual: true,
    debounceInterval: 500,
    formatResult: (users) => users,
    onSuccess: () => {
      let users = targetUsers;
      if (!targetUsers) {
        users = doGetTargetUsers?.();
      }
      setUserTargetKeys(users);
    },
  });

  const {
    run: doListRoles,
    data: roles,
    loading: listRoleLoading,
  } = useRequest(listRoles, {
    manual: true,
    debounceInterval: 500,
    formatResult: (roles) => roles,
    onSuccess: () => {
      let targetKeys = targetRoles;
      if (!targetKeys) {
        targetKeys = doGetTargetRoles?.();
      }
      setRoleTargetKeys(targetKeys);
    },
  });

  const handleRoleTransferChange = (nextTargetKeys: string[]) => {
    setRoleTargetKeys(nextTargetKeys);
  };

  const handleRoleTransferSelectChange = (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[],
  ) => {
    setRoleSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const handleUserTransferChange = (nextTargetKeys: string[]) => {
    setUserTargetKeys(nextTargetKeys);
  };

  const handleUserTransferSelectChange = (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[],
  ) => {
    setUserSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    if (tab === TRANSFER_TYPE.USER) {
      doListUsers({});
    } else if (tab === TRANSFER_TYPE.ROLE) {
      doListRoles({});
    }
  };

  const handleSubmit = async () => {
    let targetKeys: string[] = [];
    if (userTargetKeys) {
      targetKeys.push(...userTargetKeys);
    }
    if (roleTargetKeys) {
      targetKeys.push(...roleTargetKeys);
    }
    if (targetKeys.length === 0) {
      return true;
    }
    const success = await onOk(targetKeys);
    if (success) {
      handleEditVisible();
    }
  };

  const handleOpen = () => {
    handleTabChange(types[0]);
    handleEditVisible();
  };

  const handleSearchUser = (dir: TransferDirection, value: string) => {
    if (dir === 'left') {
      doListUsers({ fieldSelector: `name=${value}` });
    }
  };

  const handleSearchRole = (dir: TransferDirection, value: string) => {
    if (dir === 'left') {
      doListRoles({ fieldSelector: `name=${value}` });
    }
  };

  const renderUserTransfer = (
    <Spin spinning={listUserLoading}>
      <Transfer
        dataSource={convertUserToRecordType(users)}
        showSearch
        titles={['用户列表', '已选用户']}
        targetKeys={userTargetKeys}
        selectedKeys={userSelectedKeys}
        onSearch={handleSearchUser}
        onChange={handleUserTransferChange}
        onSelectChange={handleUserTransferSelectChange}
        render={(item) => item.title}
        listStyle={{
          width: '50%',
          minHeight: '420px',
          height: 'auto',
        }}
      />
    </Spin>
  );

  const renderRoleTransfer = (
    <Spin spinning={listRoleLoading}>
      <Transfer
        dataSource={convertRoleToRecordType(roles)}
        showSearch
        titles={['角色列表', '已选角色']}
        targetKeys={roleTargetKeys}
        selectedKeys={roleSelectedKeys}
        onChange={handleRoleTransferChange}
        onSearch={handleSearchRole}
        onSelectChange={handleRoleTransferSelectChange}
        render={(item) => item.title}
        listStyle={{
          width: '50%',
          minHeight: '420px',
          height: 'auto',
        }}
      />
    </Spin>
  );

  const renderTransferByType = (type: TransferType) => {
    switch (type) {
      case TRANSFER_TYPE.USER:
        return renderUserTransfer;
      case TRANSFER_TYPE.ROLE:
        return renderRoleTransfer;
    }
  };

  const tabOptions = [
    {
      label: `用户`,
      key: TRANSFER_TYPE.USER,
      children: renderUserTransfer,
    },
    {
      label: `角色`,
      key: TRANSFER_TYPE.ROLE,
      children: renderRoleTransfer,
    },
  ];

  return (
    <>
      <Button type="primary" onClick={handleOpen}>
        <PlusOutlined />
        {okText}
      </Button>
      <Modal
        width={modalWidth}
        title={modalTitle}
        open={visible}
        onCancel={handleEditVisible}
        onOk={handleSubmit}
        destroyOnClose
      >
        {types.length === 1 ? (
          renderTransferByType(types[0])
        ) : (
          <Tabs
            activeKey={currentTab}
            items={tabOptions.filter((tab) => types.some((t) => t === tab.key))}
            onChange={(tab) => handleTabChange(tab)}
          ></Tabs>
        )}
      </Modal>
    </>
  );
};

export default SubjectTransfer;
