import React, { useState } from 'react';
import { Modal, Button, Transfer, Tabs, Spin } from 'antd';
import { useRequest } from '@umijs/max';
import { listUsers } from '@/services/user/listUsers';
import { PlusOutlined } from '@ant-design/icons';
import { useActive } from '@/hooks';
import { listRoles } from '@/services/role/listRoles';
import { TRANSFER_TYPE, TransferType } from '@/components/Transfer/typings';
import { TransferDirection } from 'antd/es/transfer';
import { useIntl } from '@umijs/max';

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
  const intl = useIntl();
  const {
    okText = intl.formatMessage({ id: 'transfer.assignRole' }),
    modalTitle = intl.formatMessage({ id: 'transfer.assignRole' }),
    targetUsers,
    doGetTargetUsers,
    targetRoles,
    doGetTargetRoles,
    modalWidth = 730,
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
        titles={[
          intl.formatMessage({ id: 'transfer.userList' }),
          intl.formatMessage({ id: 'transfer.selectedUsers' }),
        ]}
        targetKeys={userTargetKeys}
        selectedKeys={userSelectedKeys}
        onSearch={handleSearchUser}
        // @ts-ignore
        onChange={handleUserTransferChange}
        // @ts-ignore
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
        titles={[
          intl.formatMessage({ id: 'transfer.roleList' }),
          intl.formatMessage({ id: 'transfer.selectedRoles' }),
        ]}
        targetKeys={roleTargetKeys}
        selectedKeys={roleSelectedKeys}
        // @ts-ignore
        onChange={handleRoleTransferChange}
        onSearch={handleSearchRole}
        // @ts-ignore
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
      label: intl.formatMessage({ id: 'transfer.user' }),
      key: TRANSFER_TYPE.USER,
      children: renderUserTransfer,
    },
    {
      label: intl.formatMessage({ id: 'transfer.role' }),
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
