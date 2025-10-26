import { DeleteOutlined, EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useRequest } from '@umijs/max';
import { App, Button, Dropdown } from 'antd';
import React, { useRef } from 'react';
import { ListResourceOptions, listResources } from '@/services/resource/listResources';
import { deleteResource } from '@/services/resource/deleteResource';
import { BASIC_INTL } from '@/constant';
import { transformSearchParams } from '@/utils';
import { RESOURCE_TYPES_OPTIONS } from '@/constant/options';

const INTL = {
  PAGE_CONTENT: {
    id: 'resource.page.content',
  },
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
  ACTIONS: {
    id: 'resource.table.actions',
  },
  DESCRIPTION: {
    id: 'resource.table.description',
  },
  DELETE_RESOURCE_CONFIRM_TITLE: {
    id: 'resource.popconfirm.delete.title',
  },
  DELETE_RESOURCE_CONFIRM_DESC: {
    id: 'resource.popconfirm.delete.description',
  },
};

const ResourceList: React.FC = () => {
  const intl = useIntl();
  const { modal, message } = App.useApp();
  const actionRef = useRef<ActionType>();

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

  const handleListResources = async (opts: ListResourceOptions) => {
    let finalOpts = {
      current: opts.current,
      pageSize: opts.pageSize,
      fieldSelector: '',
    };
    finalOpts.fieldSelector = transformSearchParams(opts, ['status', 'type', 'method']).join(',');
    const resourceList = await listResources(finalOpts);
    return {
      data: resourceList.items,
      total: resourceList.total,
    };
  };

  const deleteModalConfig = (records: API.Resource[]) => {
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
        doDeleteResource(records[0].metadata.instanceId);
      },
      okText: intl.formatMessage(BASIC_INTL.BTN_DELETE),
      okButtonProps: { danger: true },
    };
  };

  const handleEditResource = (instanceId: string) => {
    history.push(`/resource/edit/${instanceId}`);
  };

  const columns: ProColumns<API.Resource>[] = [
    {
      title: <FormattedMessage {...BASIC_INTL.NAME} />,
      dataIndex: ['metadata', 'name'],
      render: (_, record: API.Resource) => (
        <a key="name" onClick={() => handleEditResource(record.metadata.instanceId)}>
          {record.metadata.name}
        </a>
      ),
    },
    {
      title: <FormattedMessage {...INTL.API} />,
      dataIndex: 'api',
      search: false,
    },
    {
      title: <FormattedMessage {...INTL.TYPE} />,
      dataIndex: 'type',
      valueType: 'select',
      fieldProps: {
        options: RESOURCE_TYPES_OPTIONS,
      },
      width: 90,
    },
    {
      title: <FormattedMessage {...INTL.ACTIONS} />,
      ellipsis: true,
      render: (_, record: API.Resource) => [
        <span key="actions">
          {record.actions
            ? record.actions
                .map((item) => {
                  return item.name;
                })
                .join(',')
            : '-'}
        </span>,
      ],
      search: false,
    },
    {
      title: <FormattedMessage {...INTL.DESCRIPTION} />,
      dataIndex: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: <FormattedMessage {...BASIC_INTL.CREATED_AT} />,
      dataIndex: ['metadata', 'createdAt'],
      valueType: 'dateTime',
      width: 160,
      search: false,
    },
    {
      title: <FormattedMessage {...BASIC_INTL.TITLE_OPTION} />,
      dataIndex: 'option',
      valueType: 'option',
      width: 70,
      fixed: 'right',
      render: (_, record: API.Resource) => [
        <Dropdown
          key="dropdown"
          trigger={['click']}
          placement="bottom"
          menu={{
            items: [
              {
                key: 'deleteResource',
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

  const renderToolBar = (
    <Button type="primary" onClick={() => history.push(`/resource/create`)}>
      <PlusOutlined />
      <FormattedMessage {...BASIC_INTL.BTN_ADD} />
    </Button>
  );

  return (
    <PageContainer content={intl.formatMessage(INTL.PAGE_CONTENT)}>
      <ProTable<API.Resource, ListResourceOptions>
        headerTitle={intl.formatMessage({
          ...INTL.TABLE_TITLE,
        })}
        rowSelection={
          {
            // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
            // 注释该行则默认不显示下拉选项
            // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          }
        }
        actionRef={actionRef}
        columns={columns}
        rowKey={(record) => record?.metadata?.instanceId ?? ''}
        search={{ labelWidth: 'auto' }}
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
