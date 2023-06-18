import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useRequest } from '@umijs/max';
import { Button, message, Popconfirm } from 'antd';
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
    history.push(`/resource/policy/${instanceId}`);
  };

  const columns: ProColumns<API.Policy>[] = [
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
      title: <FormattedMessage {...BASIC_INTL.TYPE} />,
      dataIndex: 'type',
    },
    {
      title: <FormattedMessage {...BASIC_INTL.STATUS} />,
      dataIndex: 'status',
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
      render: (_, record: API.Policy) => [
        <a key="edit" onClick={() => handleEditPolicy(record.metadata.instanceId)}>
          <FormattedMessage {...BASIC_INTL.EDIT} />
        </a>,
        <Popconfirm
          key="deletePopconfirm"
          title={<FormattedMessage {...INTL.DELETE_CONFIRM_TITLE} />}
          description={<FormattedMessage {...INTL.DELETE_CONFIRM_DESC} />}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          placement="left"
          onConfirm={() => doDeletePolicy(record.metadata.name)}
        >
          <Button key="deleteBtn" type="link">
            <FormattedMessage {...BASIC_INTL.DELETE} />
          </Button>
        </Popconfirm>,
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
      />
    </PageContainer>
  );
};

export default PolicyList;
