import React, { useRef } from 'react';
import CreateApiKeyModal from '@/pages/ApiKey/components/CreateApiKeyModal';
import { ListApiKeyOptions, listApiKeys } from '@/services/apikey/listApiKeys';
import { deleteApiKey } from '@/services/apikey/deleteApiKey';
import { enableApiKey } from '@/services/apikey/enableApiKey';
import { disableApiKey } from '@/services/apikey/disableApiKey';
import {
  DeleteOutlined,
  EllipsisOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { App, Button, Dropdown, message } from 'antd';
import { BASIC_INTL } from '@/constant';
import { transformSearchParams } from '@/utils';

import useStyle from './style';

export type Props = Record<string, never>;

const INTL = {
  TABLE_TITLE: {
    id: 'apikeys.table.title',
  },
  KEY: {
    id: 'apikeys.table.key',
  },
  STATUS: {
    id: 'apikeys.table.status',
  },
  EXPIRES_AT: {
    id: 'apikeys.table.expiresAt',
  },
  ENABLE: {
    id: 'apikeys.action.enable',
  },
  DISABLE: {
    id: 'apikeys.action.disable',
  },
};

const ApiKeyList: React.FC<Props> = () => {
  const { styles } = useStyle();

  const actionRef = useRef<ActionType>();
  const { modal } = App.useApp();
  const intl = useIntl();

  const reloadTable = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const { run: doDeleteApiKey } = useRequest(deleteApiKey, {
    manual: true,
    onSuccess: () => {
      reloadTable();
      message.success(intl.formatMessage(BASIC_INTL.DELETE_SUCCESS));
    },
  });

  const { run: doEnableApiKey } = useRequest(enableApiKey, {
    manual: true,
    onSuccess: () => {
      reloadTable();
      message.success('Operation successful');
    },
  });

  const { run: doDisableApiKey } = useRequest(disableApiKey, {
    manual: true,
    onSuccess: () => {
      reloadTable();
      message.success('Operation successful');
    },
  });

  const handleListApiKeys = async (opts: ListApiKeyOptions) => {
    opts.fieldSelector = transformSearchParams(opts, ['status', 'name']).join(',');
    const apiKeyList = await listApiKeys(opts);
    return {
      data: apiKeyList.items,
      total: apiKeyList.total,
    };
  };

  const deleteModalConfig = (records: API.ApiKey[]) => {
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
        doDeleteApiKey(records[0].metadata.instanceId);
      },
      okText: intl.formatMessage(BASIC_INTL.BTN_DELETE),
      okButtonProps: { danger: true },
    };
  };

  const columns: ProColumns<API.ApiKey>[] = [
    {
      title: <FormattedMessage {...BASIC_INTL.NAME} />,
      dataIndex: ['metadata', 'name'],
      width: 200,
    },
    {
      title: <FormattedMessage {...INTL.KEY} />,
      dataIndex: 'key',
      renderText: (text: string) => {
        if (!text) return '-';
        const visibleStart = text.substring(0, 7);
        const visibleEnd = text.substring(text.length - 4);
        return `${visibleStart}***********************${visibleEnd}`;
      },
      width: 300,
    },
    {
      title: <FormattedMessage {...INTL.STATUS} />,
      dataIndex: 'status',
      valueEnum: {
        1: {
          text: <FormattedMessage {...BASIC_INTL.ACTIVED} />,
          status: 'Success',
        },
        0: {
          text: <FormattedMessage {...BASIC_INTL.DISABLED} />,
          status: 'Error',
        },
        2: {
          text: <FormattedMessage id="apikeys.status.expired" />,
          status: 'Warning',
        },
      },
      width: 100,
    },
    {
      title: <FormattedMessage {...BASIC_INTL.CREATED_AT} />,
      dataIndex: ['metadata', 'createdAt'],
      valueType: 'date',
      width: 120,
      renderText: (text: string) => {
        if (!text) return '-';
        const date = new Date(text);
        return date.toLocaleDateString(intl.locale);
      },
    },
    {
      title: <FormattedMessage {...INTL.EXPIRES_AT} />,
      dataIndex: 'expiresAt',
      valueType: 'date',
      width: 120,
      renderText: (text: string) => {
        if (!text) return intl.formatMessage({ id: 'apikeys.expiresAt.never' });
        const date = new Date(text);
        return date.toLocaleDateString(intl.locale);
      },
    },
    {
      title: <FormattedMessage {...BASIC_INTL.TITLE_OPTION} />,
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      fixed: 'right',
      render: (_, record: API.ApiKey) => [
        <Dropdown
          key="dropdown"
          trigger={['click']}
          placement="bottom"
          menu={{
            items: [
              {
                key: 'enable',
                icon: <PlayCircleOutlined />,
                label: intl.formatMessage(INTL.ENABLE),
                onClick: () => {
                  doEnableApiKey(record.metadata.instanceId);
                },
                disabled: record.status === 1,
              },
              {
                key: 'disable',
                icon: <PauseCircleOutlined />,
                label: intl.formatMessage(INTL.DISABLE),
                onClick: () => {
                  doDisableApiKey(record.metadata.instanceId);
                },
                disabled: record.status === 0 || record.status === 2,
              },
              {
                type: 'divider',
              },
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
    <div>
      <ProTable<API.ApiKey, ListApiKeyOptions>
        size="small"
        className={styles.container}
        headerTitle={intl.formatMessage(INTL.TABLE_TITLE)}
        actionRef={actionRef}
        columns={columns}
        rowKey={(record) => record?.metadata?.instanceId ?? ''}
        search={{ labelWidth: 'auto' }}
        request={handleListApiKeys}
        rowSelection={{}}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 30, 50],
        }}
        toolBarRender={() => [
          <CreateApiKeyModal
            key="create"
            onFinish={async () => {
              reloadTable();
              return true;
            }}
          />,
        ]}
      />
    </div>
  );
};

export default ApiKeyList;
