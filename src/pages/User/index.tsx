import CreateUserModal from '@/pages/User/components/CreateUserModal';
import { ListUserParams, listUsers } from '@/services/user/listUsers';
import { deleteUser } from '@/services/user/deleteUser';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useRequest } from '@umijs/max';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef } from 'react';
import { BASIC_INTL } from '@/constant';

const INTL = {
  TABLE_TITLE: {
    id: 'users.table.title',
  },
  ALIAS: {
    id: 'users.table.alias',
  },
  PHONE: {
    id: 'users.table.phone',
  },
  EMAIL: {
    id: 'users.table.email',
  },
  LAST_LOGIN_TIME: {
    id: 'users.table.lastLoginTime',
  },
  DELETE_USER_CONFIRM_TITLE: {
    id: 'users.popconfirm.delete.title',
  },
  DELETE_USER_CONFIRM_DESC: {
    id: 'users.popconfirm.delete.description',
  },
  DELETE_SUCCESS: {
    id: 'message.delete.success',
  },
};

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const reloadTable = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const { run: doDeleteUser } = useRequest(deleteUser, {
    manual: true,
    onSuccess: () => {
      reloadTable();
      message.success(intl.formatMessage(INTL.DELETE_SUCCESS));
    },
  });

  const handleListUsers = async (params: ListUserParams) => {
    const userList = await listUsers(params);
    return {
      data: userList.list,
      total: userList.total,
    };
  };

  const handleEditUser = (instanceId: string) => {
    history.push(`/user/${instanceId}`);
  };

  const columns: ProColumns<API.UserInfo>[] = [
    {
      title: <FormattedMessage {...BASIC_INTL.NO} />,
      valueType: 'index',
    },
    {
      title: <FormattedMessage {...BASIC_INTL.INSTANCE_ID} />,
      dataIndex: ['metadata', 'instanceId'],
    },
    {
      title: <FormattedMessage {...BASIC_INTL.NAME} />,
      dataIndex: ['metadata', 'name'],
    },
    {
      title: <FormattedMessage {...INTL.ALIAS} />,
      dataIndex: 'alias',
    },
    {
      title: <FormattedMessage {...INTL.PHONE} />,
      dataIndex: 'phone',
    },
    {
      title: <FormattedMessage {...INTL.EMAIL} />,
      dataIndex: 'email',
    },
    {
      title: <FormattedMessage {...INTL.LAST_LOGIN_TIME} />,
      dataIndex: 'lastLoginTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: <FormattedMessage {...BASIC_INTL.STATUS} />,
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: <FormattedMessage {...BASIC_INTL.ACTIVED} />,
          status: 'Success',
        },
        1: {
          text: <FormattedMessage {...BASIC_INTL.DISABLED} />,
          status: 'Error',
        },
      },
    },
    {
      title: <FormattedMessage {...BASIC_INTL.TITLE_OPTION} />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: API.UserInfo) => [
        <a key="editUser" onClick={() => handleEditUser(record.metadata.instanceId)}>
          <FormattedMessage {...BASIC_INTL.EDIT} />
        </a>,
        <Popconfirm
          key="deleteUserPopconfirm"
          title={<FormattedMessage {...INTL.DELETE_USER_CONFIRM_TITLE} />}
          description={<FormattedMessage {...INTL.DELETE_USER_CONFIRM_DESC} />}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          placement="left"
          onConfirm={() => doDeleteUser(record.metadata.instanceId)}
        >
          <Button key="deleteUserBtn" type="link">
            <FormattedMessage {...BASIC_INTL.DELETE} />
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserInfo, ListUserParams>
        headerTitle={intl.formatMessage(INTL.TABLE_TITLE)}
        actionRef={actionRef}
        columns={columns}
        rowKey={(record) => record?.metadata?.instanceId ?? ''}
        search={{ labelWidth: 90 }}
        request={handleListUsers}
        toolBarRender={() => [
          <CreateUserModal
            key="create"
            onFinish={async () => {
              reloadTable();
              return true;
            }}
          />,
        ]}
      />
    </PageContainer>
  );
};

export default UserList;
