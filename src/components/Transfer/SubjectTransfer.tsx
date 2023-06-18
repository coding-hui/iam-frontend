import React, { useState } from 'react';
import { Modal, Button, Transfer, Tabs } from 'antd';
import { useRequest } from '@umijs/max';
import { listUsers } from '@/services/user/listUsers';
import { PlusOutlined } from '@ant-design/icons';
import { useActive } from '@/hooks';
import { listRoles } from '@/services/role/listRoles';

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
    onOk,
  } = props;
  const [visible, { toggle: handleEditVisible }] = useActive(false);
  const [currentTab, setCurrentTab] = useState('user');
  const [userTargetKeys, setUserTargetKeys] = useState<string[]>();
  const [userSelectedKeys, setUserSelectedKeys] = useState<string[]>([]);
  const [roleTargetKeys, setRoleTargetKeys] = useState<string[]>();
  const [roleSelectedKeys, setRoleSelectedKeys] = useState<string[]>([]);

  const convertUserToRecordType = (users?: API.UserList) => {
    if (!users) {
      return;
    }
    return users.list.map((item) => {
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
    return roles.list.map((item) => {
      return {
        key: item.metadata.instanceId,
        title: item.metadata.name,
        description: item.description,
      };
    });
  };

  const { run: doListUsers, data: users } = useRequest(listUsers, {
    manual: true,
    formatResult: (users) => users,
    onSuccess: () => {
      let users = targetUsers;
      if (!targetUsers) {
        users = doGetTargetUsers?.();
      }
      setUserTargetKeys(users);
    },
  });

  const { run: doListRoles, data: roles } = useRequest(listRoles, {
    manual: true,
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
    if (tab === 'user') {
      doListUsers({});
    } else if (tab === 'role') {
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
    doListUsers({});
    handleEditVisible();
  };

  const renderUserTransfer = (
    <Transfer
      dataSource={convertUserToRecordType(users)}
      titles={['用户列表', '已选用户']}
      targetKeys={userTargetKeys}
      selectedKeys={userSelectedKeys}
      onChange={handleUserTransferChange}
      onSelectChange={handleUserTransferSelectChange}
      render={(item) => item.title}
      listStyle={{
        width: '50%',
      }}
    />
  );

  const renderRoleTransfer = (
    <Transfer
      dataSource={convertRoleToRecordType(roles)}
      titles={['角色列表', '已选角色']}
      targetKeys={roleTargetKeys}
      selectedKeys={roleSelectedKeys}
      onChange={handleRoleTransferChange}
      onSelectChange={handleRoleTransferSelectChange}
      render={(item) => item.title}
      listStyle={{
        width: '50%',
      }}
    />
  );

  const tabOptions = [
    {
      label: `用户`,
      key: 'user',
      children: renderUserTransfer,
    },
    {
      label: `角色`,
      key: 'role',
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
        <Tabs
          activeKey={currentTab}
          items={tabOptions}
          onChange={(tab) => handleTabChange(tab)}
        ></Tabs>
      </Modal>
    </>
  );
};

export default SubjectTransfer;
