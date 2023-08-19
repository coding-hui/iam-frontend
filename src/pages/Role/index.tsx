import { DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useRequest } from '@umijs/max';
import { App, Button, Dropdown } from 'antd';
import React, { useRef } from 'react';
import { ListRoleParams, listRoles } from '@/services/role/listRoles';
import { BASIC_INTL } from '@/constant';
import { deleteRole } from '@/services/role/deleteRole';
import CreateRoleModal from '@/pages/Role/components/CreateRoleModal';

const INTL = {
  TABLE_TITLE: {
    id: 'role.table.title',
  },
  DELETE_CONFIRM_TITLE: {
    id: 'role.popconfirm.delete.title',
  },
  DELETE_CONFIRM_DESC: {
    id: 'role.popconfirm.delete.description',
  },
};

const RoleList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { message, modal } = App.useApp();
  const intl = useIntl();

  const reloadTable = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const { run: doDeleteRole } = useRequest(deleteRole, {
    manual: true,
    onSuccess: () => {
      reloadTable();
      message.success(intl.formatMessage({ ...BASIC_INTL.DELETE_SUCCESS }));
    },
  });

  const handleListRoles = async (params: ListRoleParams) => {
    const roleList = await listRoles(params);
    return {
      data: roleList.list,
      total: roleList.total,
    };
  };

  const deleteModalConfig = (records: API.Role[]) => {
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
        doDeleteRole(records[0].metadata.instanceId);
      },
      okText: intl.formatMessage(BASIC_INTL.BTN_DELETE),
      okButtonProps: { danger: true },
    };
  };

  const handleEditRole = (instanceId: string) => {
    history.push(`/resource/role/${instanceId}`);
  };

  const columns: ProColumns<API.Role>[] = [
    {
      title: <FormattedMessage {...BASIC_INTL.INSTANCE_ID} />,
      dataIndex: ['metadata', 'instanceId'],
      render: (_, record: API.Role) => (
        <a key="instanceId" onClick={() => handleEditRole(record.metadata.instanceId)}>
          {record.metadata.instanceId}
        </a>
      ),
    },
    {
      title: <FormattedMessage {...BASIC_INTL.NAME} />,
      dataIndex: ['metadata', 'name'],
    },
    {
      title: <FormattedMessage {...BASIC_INTL.STATUS} />,
      dataIndex: 'disabled',
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
      title: <FormattedMessage {...BASIC_INTL.DESCRIPTION} />,
      dataIndex: 'description',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage {...BASIC_INTL.CREATED_AT} />,
      dataIndex: ['metadata', 'createdAt'],
      valueType: 'dateTime',
      width: 220,
      search: false,
    },
    {
      title: <FormattedMessage {...BASIC_INTL.TITLE_OPTION} />,
      dataIndex: 'option',
      valueType: 'option',
      width: 150,
      render: (_, record: API.Role) => [
        <Dropdown
          key="dropdown"
          trigger={['click']}
          placement="bottom"
          menu={{
            items: [
              {
                key: 'deleteRole',
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
      <ProTable<API.Role, ListRoleParams>
        headerTitle={intl.formatMessage(INTL.TABLE_TITLE)}
        actionRef={actionRef}
        columns={columns}
        rowKey={(record) => record?.metadata?.instanceId ?? ''}
        search={{ labelWidth: 90 }}
        request={handleListRoles}
        rowSelection={{}}
        toolBarRender={() => [
          <CreateRoleModal
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

export default RoleList;
