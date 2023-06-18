import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useRequest } from '@umijs/max';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef } from 'react';
import { listResources } from '@/services/resource/listResources';
import { deleteResource } from '@/services/resource/deleteResource';
import { BASIC_INTL } from '@/constant';

const INTL = {
  API: {
    id: 'resource.table.api',
  },
  METHOD: {
    id: 'resource.table.method',
  },
  TYPE: {
    id: 'resource.table.type',
  },
  TABLE_TITLE: {
    id: 'resource.table.title',
  },
  DELETE_RESOURCE_CONFIRM_TITLE: {
    id: 'resource.popconfirm.delete.title',
  },
  DELETE_RESOURCE_CONFIRM_DESC: {
    id: 'resource.popconfirm.delete.description',
  },
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
      message.success(intl.formatMessage({ ...BASIC_INTL.DELETE_SUCCESS }));
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
      title: <FormattedMessage {...INTL.API} />,
      dataIndex: 'api',
    },
    {
      title: <FormattedMessage {...INTL.METHOD} />,
      dataIndex: 'method',
    },
    {
      title: <FormattedMessage {...INTL.TYPE} />,
      dataIndex: 'type',
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
      render: (_, record: API.UserInfo) => [
        <a key="edit" onClick={() => handleEditResource(record.metadata.instanceId)}>
          <FormattedMessage {...BASIC_INTL.EDIT} />
        </a>,
        <Popconfirm
          key="deletePopconfirm"
          title={<FormattedMessage {...INTL.DELETE_RESOURCE_CONFIRM_TITLE} />}
          description={<FormattedMessage {...INTL.DELETE_RESOURCE_CONFIRM_DESC} />}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          placement="left"
          onConfirm={() => doDeleteResource(record.metadata.instanceId)}
        >
          <Button key="deleteBtn" type="link">
            <FormattedMessage {...BASIC_INTL.DELETE} />
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  const renderToolBar = (
    <Button type="primary" onClick={() => history.push(`/resource/create`)}>
      <PlusOutlined />
      <FormattedMessage {...BASIC_INTL.ADD} />
    </Button>
  );

  return (
    <PageContainer>
      <ProTable<API.Resource, API.PageParams>
        headerTitle={intl.formatMessage({
          ...INTL.TABLE_TITLE,
        })}
        actionRef={actionRef}
        columns={columns}
        rowKey={(record) => record?.metadata?.instanceId ?? ''}
        search={{ labelWidth: 90 }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 30, 50],
        }}
        request={handleListResources}
        toolBarRender={() => [renderToolBar]}
      />
    </PageContainer>
  );
};

export default ResourceList;
