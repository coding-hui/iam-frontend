import { DeleteOutlined, EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useRequest } from '@umijs/max';
import { App, Button, Dropdown, message } from 'antd';
import React, { useRef } from 'react';
import { BASIC_INTL } from '@/constant';
import { transformSearchParams } from '@/utils';
import {
  listIdentityProviders,
  deleteIdentityProvider,
  ListIdentityProvidersOptions,
} from '@/services/idp';

const INTL = {
  PAGE_CONTENT: {
    id: 'idp.page.content',
  },
  TABLE_TITLE: {
    id: 'idp.table.title',
  },
  DISPLAY_NAME: {
    id: 'idp.table.displayName',
  },
  CATEGORY: {
    id: 'idp.table.category',
  },
  AUTH_URL: {
    id: 'idp.table.authURL',
  },
  DESCRIPTION: {
    id: 'idp.table.description',
  },
};

const IdentityProviderList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { modal } = App.useApp();
  const intl = useIntl();

  const reloadTable = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const { run: doDeleteIdentityProvider } = useRequest(deleteIdentityProvider, {
    manual: true,
    onSuccess: () => {
      reloadTable();
      message.success(intl.formatMessage(BASIC_INTL.DELETE_SUCCESS));
    },
  });

  const handleListIdentityProviders = async (opts: ListIdentityProvidersOptions) => {
    let finalOpts = {
      current: opts.current,
      pageSize: opts.pageSize,
      fieldSelector: '',
    };
    finalOpts.fieldSelector = transformSearchParams(opts, ['displayName']).join(',');
    const idpList = await listIdentityProviders(finalOpts);
    return {
      data: idpList.items,
      total: idpList.total,
    };
  };

  const handleEditIdentityProvider = (instanceId: string) => {
    history.push(`/authn/identity-source/social/edit/${instanceId}`);
  };

  const deleteModalConfig = (records: App.IdentityProvider[]) => {
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
        doDeleteIdentityProvider(records[0].metadata.instanceId);
      },
      okText: intl.formatMessage(BASIC_INTL.BTN_DELETE),
      okButtonProps: { danger: true },
    };
  };

  const columns: ProColumns<App.IdentityProvider>[] = [
    {
      title: <FormattedMessage {...BASIC_INTL.INSTANCE_ID} />,
      dataIndex: ['metadata', 'instanceId'],
      render: (_, record: App.IdentityProvider) => (
        <a key="instanceId" onClick={() => handleEditIdentityProvider(record.metadata.instanceId)}>
          {record.metadata.instanceId}
        </a>
      ),
      width: 120,
    },
    {
      title: <FormattedMessage {...BASIC_INTL.NAME} />,
      dataIndex: ['metadata', 'name'],
      width: 120,
    },
    {
      title: <FormattedMessage {...INTL.DISPLAY_NAME} />,
      dataIndex: 'displayName',
      order: -100,
      width: 120,
    },
    {
      title: <FormattedMessage {...INTL.CATEGORY} />,
      dataIndex: 'category',
      hideInSearch: true,
      width: 120,
    },
    {
      title: <FormattedMessage {...INTL.AUTH_URL} />,
      hideInSearch: true,
      dataIndex: ['config', 'redirectURL'],
      copyable: true,
      ellipsis: true,
    },
    {
      title: <FormattedMessage {...INTL.DESCRIPTION} />,
      dataIndex: 'description',
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
      dataIndex: 'status',
      hideInSearch: true,
      width: 90,
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
      title: <FormattedMessage {...BASIC_INTL.TITLE_OPTION} />,
      dataIndex: 'option',
      valueType: 'option',
      width: 70,
      fixed: 'right',
      render: (_, record: App.IdentityProvider) => [
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
      <ProTable<App.IdentityProvider, ListIdentityProvidersOptions>
        headerTitle={intl.formatMessage(INTL.TABLE_TITLE)}
        actionRef={actionRef}
        columns={columns}
        rowKey={(record) => record?.metadata?.instanceId ?? ''}
        search={{ labelWidth: 'auto' }}
        request={handleListIdentityProviders}
        rowSelection={{}}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 30, 50],
        }}
        toolBarRender={() => [
          <Button
            key="createBtn"
            type="primary"
            onClick={() => history.push(`/authn/identity-source/social/create`)}
          >
            <PlusOutlined />
            <FormattedMessage {...BASIC_INTL.BTN_ADD} />
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default IdentityProviderList;
