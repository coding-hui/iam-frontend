import CreateUserModal from '@/pages/User/components/CreateUserModal';
import { listUsers } from '@/services/user/listUsers';
import { deleteUser } from '@/services/user/deleteUser';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useRequest } from '@umijs/max';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef } from 'react';

const INTL = {
  NO: 'pages.searchTable.no',
  TITLE_OPTION: 'pages.searchTable.titleOption',
  TABLE_TITLE: 'users.table.title',
  INSTANCE_ID: 'users.table.instanceId',
  NAME: 'users.table.name',
  ALIAS: 'users.table.alias',
  PHONE: 'users.table.phone',
  EMAIL: 'users.table.email',
  LAST_LOGIN_TIME: 'users.table.lastLoginTime',
  STATUS: 'users.table.status',
  ACTIVE_STATUS: 'users.table.status.active',
  DISABLED_STATUS: 'users.table.status.disabled',
  EDIT_USER: 'users.table.edit',
  DELETE_USER: 'users.table.delete',
  DELETE_USER_CONFIRM_TITLE: 'users.popconfirm.delete.title',
  DELETE_USER_CONFIRM_DESC: 'users.popconfirm.delete.description',
  DELETE_SUCCESS: 'message.delete.success',
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
      message.success(intl.formatMessage({ id: INTL.DELETE_SUCCESS }));
    },
  });

  const handleListUsers = async (params: { offset?: number; limit?: number }) => {
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
      title: <FormattedMessage id={INTL.NO} defaultMessage="No" />,
      valueType: 'index',
    },
    {
      title: <FormattedMessage id={INTL.INSTANCE_ID} defaultMessage="ID" />,
      dataIndex: ['metadata', 'instanceId'],
    },
    {
      title: <FormattedMessage id={INTL.NAME} defaultMessage="Username" />,
      dataIndex: ['metadata', 'name'],
    },
    {
      title: <FormattedMessage id={INTL.ALIAS} defaultMessage="Alias" />,
      dataIndex: 'alias',
    },
    {
      title: <FormattedMessage id={INTL.PHONE} defaultMessage="Phone" />,
      dataIndex: 'phone',
    },
    {
      title: <FormattedMessage id={INTL.EMAIL} defaultMessage="Email" />,
      dataIndex: 'email',
    },
    {
      title: <FormattedMessage id={INTL.LAST_LOGIN_TIME} defaultMessage="Last login time" />,
      dataIndex: 'lastLoginTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: <FormattedMessage id={INTL.STATUS} defaultMessage="Status" />,
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: <FormattedMessage id={INTL.ACTIVE_STATUS} defaultMessage="Actived" />,
          status: 'Success',
        },
        1: {
          text: <FormattedMessage id={INTL.DISABLED_STATUS} defaultMessage="Disabled" />,
          status: 'Error',
        },
      },
    },
    {
      title: <FormattedMessage id={INTL.TITLE_OPTION} defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: API.UserInfo) => [
        <a key="editUser" onClick={() => handleEditUser(record.metadata.instanceId)}>
          <FormattedMessage id={INTL.EDIT_USER} defaultMessage="Edit" />
        </a>,
        <Popconfirm
          key="deleteUserPopconfirm"
          title={<FormattedMessage id={INTL.DELETE_USER_CONFIRM_TITLE} />}
          description={<FormattedMessage id={INTL.DELETE_USER_CONFIRM_DESC} />}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          placement="left"
          onConfirm={() => doDeleteUser(record.metadata.instanceId)}
        >
          <Button key="deleteUserBtn" type="link">
            <FormattedMessage id={INTL.DELETE_USER} defaultMessage="Delete" />
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserInfo, API.PageParams>
        headerTitle={intl.formatMessage({
          id: INTL.TABLE_TITLE,
        })}
        actionRef={actionRef}
        columns={columns}
        rowKey={(record) => record?.metadata?.id ?? ''}
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
