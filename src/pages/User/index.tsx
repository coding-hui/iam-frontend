import CreateUserModal from '@/pages/User/components/CreateUserModal';
import { ListUserOptions, listUsers } from '@/services/user/listUsers';
import { deleteUser } from '@/services/user/deleteUser';
import { DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useRequest } from '@umijs/max';
import { App, Button, Dropdown, message } from 'antd';
import React, { useRef } from 'react';
import { BASIC_INTL } from '@/constant';
import { transformSearchParams } from '@/utils';

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
  const { modal } = App.useApp();
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

  const handleListUsers = async (opts: ListUserOptions) => {
    let finalOpts = {
      current: opts.current,
      pageSize: opts.pageSize,
      fieldSelector: '',
    };
    finalOpts.fieldSelector = transformSearchParams(opts, ['disabled', 'alias']).join(',');
    const userList = await listUsers(finalOpts);
    return {
      data: userList.items,
      total: userList.total,
    };
  };

  const handleEditUser = (instanceId: string) => {
    history.push(`/user/${instanceId}`);
  };

  const deleteModalConfig = (records: API.UserInfo[]) => {
    let title =
      records.length === 1
        ? intl.formatMessage(BASIC_INTL.DELETE_CONFIRM_TITLE, {
            name: records[0].metadata.name,
          })
        : intl.formatMessage(BASIC_INTL.MULTI_DELETE_CONFIRM_TITLE, {
            count: records.length,
          });
    return {
      title: title,
      content: (
        <span>
          <FormattedMessage {...BASIC_INTL.DELETE_CONFIRM_CONTENT} />
        </span>
      ),
      centered: true,
      onOk: () => {
        doDeleteUser(records[0].metadata.instanceId);
      },
      okText: intl.formatMessage(BASIC_INTL.BTN_DELETE),
      okButtonProps: { danger: true },
    };
  };

  const columns: ProColumns<API.UserInfo>[] = [
    {
      title: <FormattedMessage {...BASIC_INTL.INSTANCE_ID} />,
      dataIndex: ['metadata', 'instanceId'],
      render: (_, record: API.UserInfo) => (
        <a key="instanceId" onClick={() => handleEditUser(record.metadata.instanceId)}>
          {record.metadata.instanceId}
        </a>
      ),
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
      hideInSearch: true,
    },
    {
      title: <FormattedMessage {...INTL.EMAIL} />,
      dataIndex: 'email',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage {...INTL.LAST_LOGIN_TIME} />,
      dataIndex: 'lastLoginTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: <FormattedMessage {...BASIC_INTL.STATUS} />,
      dataIndex: 'disabled',
      hideInForm: true,
      valueEnum: {
        false: {
          text: <FormattedMessage {...BASIC_INTL.ACTIVED} />,
          status: 'Success',
        },
        true: {
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
        <Dropdown
          key="dropdown"
          trigger={['click']}
          placement="bottom"
          menu={{
            items: [
              {
                key: 'deleteUser',
                icon: <DeleteOutlined />,
                label: intl.formatMessage(BASIC_INTL.BTN_DELETE),
                onClick: () => {
                  modal.confirm(deleteModalConfig([record]));
                },
              },
            ],
          }}
        >
          <Button shape="default" type="text" icon={<EllipsisOutlined />}></Button>
        </Dropdown>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserInfo, ListUserOptions>
        headerTitle={intl.formatMessage(INTL.TABLE_TITLE)}
        actionRef={actionRef}
        columns={columns}
        rowKey={(record) => record?.metadata?.instanceId ?? ''}
        search={{
          labelWidth: 90,
        }}
        request={handleListUsers}
        rowSelection={{}}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 30, 50],
        }}
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
