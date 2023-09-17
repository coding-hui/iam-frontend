import { DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useRequest } from '@umijs/max';
import { App, Button, Dropdown, message } from 'antd';
import React, { useRef } from 'react';
import { BASIC_INTL } from '@/constant';
import { transformSearchParams } from '@/utils';
import { deleteOrganization } from '@/services/organization/deleteOrganization';
import CreateOrganizationModal from '@/pages/Organization/components/CreateOrganizationModal';
import {
  listOrganizations,
  ListOrganizationOptions,
} from '@/services/organization/listOrganizations';

const INTL = {
  PAGE_CONTENT: {
    id: 'organization.page.content',
  },
  TABLE_TITLE: {
    id: 'organization.table.title',
  },
  DISPLAY_NAME: {
    id: 'organization.table.displayName',
  },
  FAVICON: {
    id: 'organization.table.favicon',
  },
  WEBSITE_URL: {
    id: 'organization.table.websiteUrl',
  },
};

const OrganizationList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { modal } = App.useApp();
  const intl = useIntl();

  const reloadTable = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const { run: doDeleteOrganization } = useRequest(deleteOrganization, {
    manual: true,
    onSuccess: () => {
      reloadTable();
      message.success(intl.formatMessage(BASIC_INTL.DELETE_SUCCESS));
    },
  });

  const handleListOrganizations = async (opts: ListOrganizationOptions) => {
    let finalOpts = {
      current: opts.current,
      pageSize: opts.pageSize,
      fieldSelector: '',
    };
    finalOpts.fieldSelector = transformSearchParams(opts, ['disabled', 'displayName']).join(',');
    const orgList = await listOrganizations(finalOpts);
    return {
      data: orgList.items,
      total: orgList.total,
    };
  };

  const handleEditOrganization = (instanceId: string) => {
    history.push(`/org-management/org/${instanceId}`);
  };

  const deleteModalConfig = (records: API.Organization[]) => {
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
        doDeleteOrganization(records[0].metadata.instanceId);
      },
      okText: intl.formatMessage(BASIC_INTL.BTN_DELETE),
      okButtonProps: { danger: true },
    };
  };

  const columns: ProColumns<API.Organization>[] = [
    {
      title: <FormattedMessage {...BASIC_INTL.INSTANCE_ID} />,
      dataIndex: ['metadata', 'instanceId'],
      render: (_, record: API.Organization) => (
        <a key="instanceId" onClick={() => handleEditOrganization(record.metadata.instanceId)}>
          {record.metadata.instanceId}
        </a>
      ),
    },
    {
      title: <FormattedMessage {...BASIC_INTL.NAME} />,
      dataIndex: ['metadata', 'name'],
    },
    {
      title: <FormattedMessage {...INTL.DISPLAY_NAME} />,
      dataIndex: 'displayName',
      order: -100,
    },
    {
      title: <FormattedMessage {...INTL.FAVICON} />,
      dataIndex: 'favicon',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage {...INTL.WEBSITE_URL} />,
      dataIndex: 'websiteUrl',
      hideInSearch: true,
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
      width: 60,
      fixed: 'right',
      render: (_, record: API.Organization) => [
        <Dropdown
          key="dropdown"
          trigger={['click']}
          placement="bottom"
          menu={{
            items: [
              {
                key: 'deleteOrganization',
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
      <ProTable<API.Organization, ListOrganizationOptions>
        headerTitle={intl.formatMessage(INTL.TABLE_TITLE)}
        actionRef={actionRef}
        columns={columns}
        rowKey={(record) => record?.metadata?.instanceId ?? ''}
        search={{ labelWidth: 'auto' }}
        request={handleListOrganizations}
        rowSelection={{}}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 30, 50],
        }}
        toolBarRender={() => [
          <CreateOrganizationModal
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

export default OrganizationList;
