import {
  DeleteOutlined,
  PlusOutlined,
  EllipsisOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useRequest } from '@umijs/max';
import { App, Button, Dropdown } from 'antd';
import React, { useRef } from 'react';
import { BASIC_INTL } from '@/constant';
import { transformSearchParams } from '@/utils';
import { deleteEmailTemplate } from '@/services/email/deleteEmailTemplate';
import { listEmailTemplates, ListEmailTemplateOptions } from '@/services/email/listEmailTemplates';
import { listEmailTemplateCategories } from '@/services/email/listEmailTemplateCategories';
import { updateEmailTemplate } from '@/services/email/updateEmailTemplate';

const INTL = {
  PAGE_CONTENT: { id: 'email.page.content' },
  TABLE_TITLE: { id: 'email.table.title' },
  DISPLAY_NAME: { id: 'email.table.displayName' },
  SUBJECT: { id: 'email.table.subject' },
  CATEGORY: { id: 'email.table.category' },
  STATUS_ACTIVE: { id: 'email.status.active' },
  STATUS_DRAFT: { id: 'email.status.draft' },
  STATUS_DISABLED: { id: 'email.status.disabled' },
  STATUS_ARCHIVED: { id: 'email.status.archived' },
};

const EmailList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { modal, message } = App.useApp();
  const intl = useIntl();

  const reloadTable = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const { run: doDeleteTemplate } = useRequest(deleteEmailTemplate, {
    manual: true,
    onSuccess: () => {
      reloadTable();
      message.success(intl.formatMessage(BASIC_INTL.DELETE_SUCCESS));
    },
  });

  const { run: doUpdateTemplate } = useRequest(updateEmailTemplate, {
    manual: true,
    onSuccess: () => {
      reloadTable();
      message.success(intl.formatMessage(BASIC_INTL.UPDATE_SUCCESS));
    },
  });

  const handleListTemplates = async (opts: ListEmailTemplateOptions) => {
    let finalOpts: ListEmailTemplateOptions = {
      current: opts.current,
      pageSize: opts.pageSize,
      fieldSelector: '',
    };
    finalOpts.fieldSelector = transformSearchParams(opts, ['subject']).join(',');
    const list = await listEmailTemplates(finalOpts);
    return {
      data: list.items,
      total: list.total,
    };
  };

  const handleCreate = () => {
    history.push(`/app-management/mail-template/create`);
  };

  const handleEdit = (record: API.EmailTemplate) => {
    const instanceId = record?.metadata?.instanceId;
    if (instanceId) {
      history.push(`/app-management/mail-template/edit/${instanceId}`);
    }
  };

  const handleEnable = (record: API.EmailTemplate) => {
    const instanceId = record?.metadata?.instanceId;
    if (instanceId) {
      doUpdateTemplate(instanceId, { status: 'active' });
    }
  };

  const handleDisable = (record: API.EmailTemplate) => {
    const instanceId = record?.metadata?.instanceId;
    if (instanceId) {
      doUpdateTemplate(instanceId, { status: 'disabled' });
    }
  };

  const deleteModalConfig = (records: API.EmailTemplate[]) => {
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
        doDeleteTemplate(records[0].metadata.instanceId);
      },
      okText: intl.formatMessage(BASIC_INTL.BTN_DELETE),
      okButtonProps: { danger: true },
    };
  };

  const columns: ProColumns<API.EmailTemplate>[] = [
    {
      title: <FormattedMessage {...BASIC_INTL.NAME} />,
      dataIndex: ['metadata', 'name'],
      render: (_, record: API.EmailTemplate) => (
        <a key="name" onClick={() => handleEdit(record)}>
          {record.metadata.name}
        </a>
      ),
      width: 160,
    },
    {
      title: <FormattedMessage {...INTL.SUBJECT} />,
      dataIndex: 'subject',
    },
    {
      title: <FormattedMessage {...INTL.CATEGORY} />,
      dataIndex: 'categoryId',
      hideInTable: true,
      valueType: 'select',
      request: async () => {
        const res = await listEmailTemplateCategories({ current: 1, pageSize: 100 });
        return (res.items || []).map((c) => ({ label: c.metadata.name, value: c.metadata.name }));
      },
    },
    {
      title: <FormattedMessage {...INTL.CATEGORY} />,
      dataIndex: ['category', 'metadata', 'name'],
      hideInSearch: true,
      width: 140,
    },
    {
      title: <FormattedMessage {...BASIC_INTL.CREATED_AT} />,
      dataIndex: ['metadata', 'createdAt'],
      width: 160,
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage {...BASIC_INTL.STATUS} />,
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        active: {
          text: <FormattedMessage {...INTL.STATUS_ACTIVE} />,
          status: 'Success',
        },
        draft: {
          text: <FormattedMessage {...INTL.STATUS_DRAFT} />,
          status: 'Warning',
        },
        disabled: {
          text: <FormattedMessage {...INTL.STATUS_DISABLED} />,
          status: 'Error',
        },
      },
      width: 100,
    },
    {
      title: <FormattedMessage {...BASIC_INTL.TITLE_OPTION} />,
      dataIndex: 'option',
      valueType: 'option',
      width: 70,
      fixed: 'right',
      render: (_, record: API.EmailTemplate) => [
        <Dropdown
          key="dropdown"
          trigger={['click']}
          placement="bottom"
          menu={{
            items: [
              // 根据状态显示不同的操作
              ...(record.status === 'disabled' || record.status === 'draft'
                ? [
                    {
                      key: 'enable',
                      icon: <CheckCircleOutlined />,
                      label: intl.formatMessage(INTL.STATUS_ACTIVE),
                      onClick: () => handleEnable(record),
                    },
                  ]
                : []),
              ...(record.status === 'active'
                ? [
                    {
                      key: 'disable',
                      icon: <StopOutlined />,
                      label: intl.formatMessage(INTL.STATUS_DISABLED),
                      onClick: () => handleDisable(record),
                    },
                  ]
                : []),
              {
                key: 'delete',
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
    <PageContainer content={intl.formatMessage(INTL.PAGE_CONTENT)}>
      <ProTable<API.EmailTemplate, ListEmailTemplateOptions>
        headerTitle={intl.formatMessage(INTL.TABLE_TITLE)}
        actionRef={actionRef}
        columns={columns}
        rowKey={(record) => record?.metadata?.instanceId ?? ''}
        search={{ labelWidth: 'auto' }}
        request={handleListTemplates}
        rowSelection={{}}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 30, 50],
        }}
        toolBarRender={() => [
          <Button key="new" type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            <FormattedMessage {...BASIC_INTL.BTN_ADD} />
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default EmailList;
