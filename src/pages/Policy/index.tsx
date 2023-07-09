import { DeleteOutlined, EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useRequest } from '@umijs/max';
import { App, Button, Dropdown } from 'antd';
import React, { useRef } from 'react';
import { listPolicies } from '@/services/policy/listPolicies';
import { BASIC_INTL } from '@/constant';
import { deletePolicy } from '@/services/policy/deletePolicy';

const INTL = {
  TABLE_TITLE: {
    id: 'policy.table.title',
  },
  DELETE_CONFIRM_TITLE: {
    id: 'policy.popconfirm.delete.title',
  },
  DELETE_CONFIRM_DESC: {
    id: 'policy.popconfirm.delete.description',
  },
};

const PolicyList: React.FC = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const reloadTable = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const { run: doDeletePolicy } = useRequest(deletePolicy, {
    manual: true,
    onSuccess: () => {
      reloadTable();
      message.success(intl.formatMessage(BASIC_INTL.DELETE_SUCCESS));
    },
  });

  const handleListPolicies = async (params: { offset?: number; limit?: number }) => {
    const policies = await listPolicies(params);
    return {
      data: policies.list,
      total: policies.total,
    };
  };

  const renderToolBar = (
    <Button type="primary" onClick={() => history.push(`/resource/policy/create`)}>
      <PlusOutlined />
      <FormattedMessage {...BASIC_INTL.ADD} />
    </Button>
  );

  const handleEditPolicy = (instanceId: string) => {
    history.push(`/resource/policy/edit/${instanceId}`);
  };

  const deleteModalConfig = (records: API.Policy[]) => {
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
        doDeletePolicy(records[0].metadata.name);
      },
      okText: intl.formatMessage(BASIC_INTL.DELETE),
      okButtonProps: { danger: true },
    };
  };

  const columns: ProColumns<API.Policy>[] = [
    {
      title: <FormattedMessage {...BASIC_INTL.INSTANCE_ID} />,
      dataIndex: ['metadata', 'instanceId'],
      render: (_, record: API.Policy) => (
        <a key="instanceId" onClick={() => handleEditPolicy(record.metadata.instanceId)}>
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
      title: '授权主体',
      dataIndex: 'subjects',
      valueType: 'segmented',
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
      width: 60,
      fixed: 'right',
      render: (_, record: API.Policy) => [
        <Dropdown
          key="dropdown"
          trigger={['click']}
          placement="bottom"
          menu={{
            items: [
              {
                key: 'deleteResource',
                icon: <DeleteOutlined />,
                label: intl.formatMessage(BASIC_INTL.DELETE),
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
      <ProTable<API.Policy, API.PageParams>
        headerTitle={intl.formatMessage(INTL.TABLE_TITLE)}
        actionRef={actionRef}
        columns={columns}
        rowKey={(record) => record?.metadata?.instanceId ?? ''}
        search={{ labelWidth: 90 }}
        request={handleListPolicies}
        toolBarRender={() => [renderToolBar]}
        rowSelection={
          {
            // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
            // 注释该行则默认不显示下拉选项
            // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          }
        }
      />
    </PageContainer>
  );
};

export default PolicyList;
