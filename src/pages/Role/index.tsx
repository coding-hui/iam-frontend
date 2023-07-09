import CreateUserModal from '@/pages/User/components/CreateUserModal';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useRequest } from '@umijs/max';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef } from 'react';
import { listRoles } from '@/services/role/listRoles';
import { BASIC_INTL } from '@/constant';
import { deleteRole } from '@/services/role/deleteRole';

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
  const intl = useIntl();

  const reloadTable = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const { run: doDeleteResource, loading: deleteLoading } = useRequest(deleteRole, {
    manual: true,
    onSuccess: () => {
      reloadTable();
      message.success(intl.formatMessage({ ...BASIC_INTL.DELETE_SUCCESS }));
    },
  });

  const handleListRoles = async (params: { offset?: number; limit?: number }) => {
    const roleList = await listRoles(params);
    return {
      data: roleList.list,
      total: roleList.total,
    };
  };

  const handleEditRole = (instanceId: string) => {
    history.push(`/resource/role/${instanceId}`);
  };

  const columns: ProColumns<API.Role>[] = [
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
        <a key="editRole" onClick={() => handleEditRole(record.metadata.instanceId)}>
          <FormattedMessage {...BASIC_INTL.EDIT} />
        </a>,
        <Popconfirm
          key="deleteRolePopconfirm"
          title={<FormattedMessage {...INTL.DELETE_CONFIRM_TITLE} />}
          description={<FormattedMessage {...INTL.DELETE_CONFIRM_DESC} />}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          placement="left"
          onConfirm={() => doDeleteResource(record.metadata.instanceId)}
          okButtonProps={{ getInfoLoading: deleteLoading }}
        >
          <Button key="deleteRoleBtn" type="link">
            <FormattedMessage {...BASIC_INTL.DELETE} />
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Role, API.PageParams>
        headerTitle={intl.formatMessage(INTL.TABLE_TITLE)}
        actionRef={actionRef}
        columns={columns}
        rowKey={(record) => record?.metadata?.instanceId ?? ''}
        search={{ labelWidth: 90 }}
        request={handleListRoles}
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

export default RoleList;
