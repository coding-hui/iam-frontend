import React, { useRef, useState } from 'react';
import CreateUserModal from '@/pages/User/components/CreateUserModal';
import { ListUserOptions, listUsers } from '@/services/user/listUsers';
import { deleteUser } from '@/services/user/deleteUser';
import { DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useRequest } from '@umijs/max';
import {
  App,
  Button,
  Card,
  Checkbox,
  Divider,
  Dropdown,
  message,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import { BASIC_INTL } from '@/constant';
import { transformSearchParams } from '@/utils';

import useStyle from './style';

const { Text } = Typography;

export type Props = {
  organization?: { id: string; name: string };
};

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
  ONLY_DIRECT_MEMBERS: {
    id: 'users.table.onlyDirectMembers',
  },
};

const UserList: React.FC<Props> = (props) => {
  const { organization } = props;

  const { styles } = useStyle();

  const actionRef = useRef<ActionType>();
  const { modal } = App.useApp();
  const intl = useIntl();

  const [onlyDirectMembers, setOnlyDirectMembers] = useState(false);

  const reloadTable = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const { run: doDeleteUser } = useRequest(deleteUser, {
    manual: true,
    onSuccess: () => {
      reloadTable();
      message.success(intl.formatMessage(BASIC_INTL.DELETE_SUCCESS));
    },
  });

  const handleListUsers = async (opts: ListUserOptions) => {
    opts.fieldSelector = transformSearchParams(opts, ['disabled', 'alias']).join(',');
    const userList = await listUsers(opts);
    return {
      data: userList.items,
      total: userList.total,
    };
  };

  const handleEditUser = (instanceId: string) => {
    history.push(`/org-management/user/${instanceId}`);
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
      width: 160,
      search: false,
    },
    {
      title: <FormattedMessage {...BASIC_INTL.STATUS} />,
      dataIndex: 'disabled',
      hideInForm: true,
      width: 90,
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
      width: 70,
      fixed: 'right',
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
    <>
      {!organization ? (
        <Card style={{ height: 'calc(100vh - 200px)' }} bordered={false}>
          <Skeleton paragraph={{ rows: 10 }} active={true} />
        </Card>
      ) : (
        <ProTable<API.UserInfo, ListUserOptions>
          size="small"
          params={{ departmentId: organization.id, includeChildrenDepartments: !onlyDirectMembers }}
          className={styles}
          headerTitle={organization.name}
          style={{
            height: 'calc(100vh - 200px)',
            overflow: 'auto',
          }}
          cardProps={{ style: { minHeight: 'calc(100vh - 200px)' } }}
          actionRef={actionRef}
          columns={columns}
          rowKey={(record) => record?.metadata?.instanceId ?? ''}
          search={{ labelWidth: 'auto' }}
          request={handleListUsers}
          rowSelection={{}}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 30, 50],
          }}
          toolBarRender={() => [
            <Space key={'checkbox'} style={{ alignItems: 'flex-start' }}>
              <Checkbox
                checked={onlyDirectMembers}
                onChange={({ target: { checked } }) => {
                  setOnlyDirectMembers(checked);
                  actionRef.current?.reload();
                }}
              />
              <Text ellipsis>{intl.formatMessage(INTL.ONLY_DIRECT_MEMBERS)}</Text>
            </Space>,
            <Divider key="divider" type="vertical" />,
            <CreateUserModal
              key="create"
              organization={organization}
              onFinish={async () => {
                reloadTable();
                return true;
              }}
            />,
          ]}
        />
      )}
    </>
  );
};

export default UserList;
