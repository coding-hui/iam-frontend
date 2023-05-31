import CreateUserModal from '@/pages/User/components/CreateUserModal';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useRequest } from '@umijs/max';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef } from 'react';
import { listResources } from '@/services/resource/listResources';
import { deleteResource } from '@/services/resource/deleteResource';

const INTL = {
  NO: 'pages.searchTable.no',
  TITLE_OPTION: 'pages.searchTable.titleOption',
  TABLE_TITLE: 'resource.table.title',
  INSTANCE_ID: 'resource.table.instanceId',
  NAME: 'resource.table.name',
  API: 'resource.table.api',
  METHOD: 'resource.table.method',
  TYPE: 'resource.table.type',
  DESCRIPTION: 'resource.table.description',
  STATUS: 'resource.table.status',
  ACTIVE_STATUS: 'resource.table.status.active',
  DISABLED_STATUS: 'resource.table.status.disabled',
  EDIT_EDIT: 'resource.table.edit',
  DELETE_RESOURCE: 'resource.table.delete',
  DELETE_RESOURCE_CONFIRM_TITLE: 'resource.popconfirm.delete.title',
  DELETE_RESOURCE_CONFIRM_DESC: 'resource.popconfirm.delete.description',
  DELETE_SUCCESS: 'message.delete.success',
};

const ResourceList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const reloadTable = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const { run: doDeleteResource } = useRequest(deleteResource, {
    manual: true,
    onSuccess: () => {
      reloadTable();
      message.success(intl.formatMessage({ id: INTL.DELETE_SUCCESS }));
    },
  });

  const handleListResources = async (params: { offset?: number; limit?: number }) => {
    const resourceList = await listResources(params);
    return {
      data: resourceList.list,
      total: resourceList.total,
    };
  };

  const handleEditResource = (instanceId: string) => {
    history.push(`/resource/${instanceId}`);
  };

  const columns: ProColumns<API.Resource>[] = [
    {
      title: <FormattedMessage id={INTL.NO} defaultMessage="No" />,
      valueType: 'index',
    },
    {
      title: <FormattedMessage id={INTL.INSTANCE_ID} defaultMessage="ID" />,
      dataIndex: ['metadata', 'instanceId'],
    },
    {
      title: <FormattedMessage id={INTL.NAME} defaultMessage="Resource" />,
      dataIndex: ['metadata', 'name'],
    },
    {
      title: <FormattedMessage id={INTL.API} defaultMessage="API" />,
      dataIndex: 'api',
    },
    {
      title: <FormattedMessage id={INTL.METHOD} defaultMessage="Method" />,
      dataIndex: 'method',
    },
    {
      title: <FormattedMessage id={INTL.TYPE} defaultMessage="Type" />,
      dataIndex: 'type',
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
        <a key="editUser" onClick={() => handleEditResource(record.metadata.instanceId)}>
          <FormattedMessage id={INTL.EDIT_EDIT} defaultMessage="Edit" />
        </a>,
        <Popconfirm
          key="deleteUserPopconfirm"
          title={<FormattedMessage id={INTL.DELETE_RESOURCE_CONFIRM_TITLE} />}
          description={<FormattedMessage id={INTL.DELETE_RESOURCE_CONFIRM_DESC} />}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          placement="left"
          onConfirm={() => doDeleteResource(record.metadata.instanceId)}
        >
          <Button key="deleteUserBtn" type="link">
            <FormattedMessage id={INTL.DELETE_RESOURCE} defaultMessage="Delete" />
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Resource, API.PageParams>
        headerTitle={intl.formatMessage({
          id: INTL.TABLE_TITLE,
        })}
        actionRef={actionRef}
        columns={columns}
        rowKey={(record) => record?.metadata?.id ?? ''}
        search={{ labelWidth: 90 }}
        request={handleListResources}
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

export default ResourceList;
