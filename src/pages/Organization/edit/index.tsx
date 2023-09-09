import {
  CheckCircleOutlined,
  DeleteOutlined,
  DownOutlined,
  LinkOutlined,
  StopOutlined,
} from '@ant-design/icons';
import {
  BetaSchemaForm,
  PageContainer,
  ProCard,
  ProFormColumnsType,
} from '@ant-design/pro-components';
import { App, Button, Dropdown } from 'antd';
import React from 'react';
import { FormattedMessage } from '@umijs/max';
import { BASIC_INTL } from '@/constant';
import { useIntl } from '@@/exports';
import useOrganizationHook from '@/pages/Organization/edit/_hooks';

const INTL = {
  TAB_INFO: {
    id: 'organization.form.tab.info',
  },
  ENABLE_CONFIRM_TITLE: {
    id: 'organization.modalconfirm.enable.title',
  },
  ENABLE_CONFIRM_CONTENT: {
    id: 'organization.modalconfirm.enable.content',
  },
  DISABLE_CONFIRM_TITLE: {
    id: 'organization.modalconfirm.disable.title',
  },
  DISABLE_CONFIRM_CONTENT: {
    id: 'organization.modalconfirm.disable.content',
  },
  DISABLE_BTN: {
    id: 'organization.form.disable.btn',
  },
  ENABLE_BTN: {
    id: 'organization.form.enable.btn',
  },
  DELETE_BTN: {
    id: 'organization.form.delete.btn',
  },
  NAME: {
    id: 'organization.form.name',
  },
  NAME_TIP: {
    id: 'organization.form.name.tip',
  },
  PLACEHOLDER_NAME: {
    id: 'organization.form.placeholder.name',
  },
  DISPLAY_NAME: {
    id: 'organization.form.displayName',
  },
  PLACEHOLDER_DISPLAY_NAME: {
    id: 'organization.form.placeholder.displayName',
  },
  DISPLAY_NAME_TIP: {
    id: 'organization.form.displayName.tip',
  },
  DESCRIPTION: {
    id: 'organization.form.description',
  },
  PLACEHOLDER_DESCRIPTION: {
    id: 'organization.form.placeholder.description',
  },
  STATUS: {
    id: 'organization.form.status',
  },
  FAVICON: {
    id: 'organization.form.favicon',
  },
  WEBSITE_URL: {
    id: 'organization.form.websiteUrl',
  },
};

const ORG_TABS = {
  INFO: {
    tab: <FormattedMessage {...INTL.TAB_INFO} />,
    key: 'info',
  },
};

const EditOrganization: React.FC = () => {
  const intl = useIntl();
  const { modal } = App.useApp();
  const {
    states: { currentTab, orgInfo, loading, updateOrgInfoLoading, orgInfoForm },
    actions: {
      setCurrentTab,
      handleDeleteOrg,
      handleUpdateOrgInfo,
      handleChangeOrgState,
      handleResetOrgInfoFormValues,
    },
  } = useOrganizationHook();

  const orgInfoColumns: ProFormColumnsType<API.Organization>[] = [
    {
      title: intl.formatMessage(INTL.NAME),
      dataIndex: ['metadata', 'name'],
      width: 'lg',
      colProps: {
        xs: 16,
        md: 8,
      },
    },
    {
      title: intl.formatMessage(INTL.DISPLAY_NAME),
      dataIndex: 'displayName',
      width: 'lg',
      colProps: {
        xs: 16,
        md: 8,
      },
    },
    {
      title: intl.formatMessage(INTL.STATUS),
      dataIndex: 'disabled',
      width: 'lg',
      readonly: true,
      colProps: {
        xs: 16,
        md: 8,
      },
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
      title: intl.formatMessage(INTL.FAVICON),
      dataIndex: 'favicon',
      width: 'lg',
      fieldProps: {
        prefix: <LinkOutlined />,
      },
      colProps: {
        xs: 16,
        md: 8,
      },
    },
    {
      title: intl.formatMessage(INTL.WEBSITE_URL),
      dataIndex: 'websiteUrl',
      width: 'lg',
      fieldProps: {
        prefix: <LinkOutlined />,
      },
      colProps: {
        xs: 16,
        md: 8,
      },
    },
    {
      title: intl.formatMessage(INTL.DESCRIPTION),
      dataIndex: 'description',
      valueType: 'textarea',
      width: 'lg',
      colProps: {
        xs: 16,
        md: 8,
      },
    },
  ];

  const deleteModalConfig = () => {
    let title = intl.formatMessage(BASIC_INTL.DELETE_CONFIRM_TITLE, {
      name: orgInfo?.metadata.name,
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
        handleDeleteOrg();
      },
      okText: intl.formatMessage(BASIC_INTL.BTN_DELETE),
      okButtonProps: { danger: true },
    };
  };

  const changeOrgStateModalConfig = () => {
    let title = intl.formatMessage(INTL.DISABLE_CONFIRM_TITLE, {
      name: orgInfo?.metadata.name,
    });
    let content = intl.formatMessage(INTL.DISABLE_CONFIRM_CONTENT, {
      name: orgInfo?.metadata.name,
    });
    let okText = intl.formatMessage(BASIC_INTL.BTN_DISABLE);
    if (orgInfo?.disabled) {
      title = intl.formatMessage(INTL.ENABLE_CONFIRM_TITLE, {
        name: orgInfo?.metadata.name,
      });
      content = intl.formatMessage(INTL.ENABLE_CONFIRM_CONTENT, {
        name: orgInfo?.metadata.name,
      });
      okText = intl.formatMessage(BASIC_INTL.BTN_ENABLE);
    }
    return {
      title: title,
      content: content,
      centered: true,
      onOk: () => {
        handleChangeOrgState(!orgInfo?.disabled);
      },
      okText: okText,
      okButtonProps: { danger: !orgInfo?.disabled },
    };
  };

  return (
    <PageContainer
      fixedHeader
      tabActiveKey={currentTab}
      onTabChange={(tab) => setCurrentTab(tab)}
      tabList={[ORG_TABS.INFO]}
      header={{
        title: orgInfo?.metadata.name,
        extra: [
          <Dropdown
            key="dropdown"
            trigger={['click']}
            menu={{
              items: [
                {
                  icon: orgInfo?.disabled ? <CheckCircleOutlined /> : <StopOutlined />,
                  label: orgInfo?.disabled
                    ? intl.formatMessage(INTL.ENABLE_BTN)
                    : intl.formatMessage(INTL.DISABLE_BTN),
                  key: '1',
                  onClick: () => {
                    modal.confirm(changeOrgStateModalConfig());
                  },
                },
                {
                  icon: <DeleteOutlined />,
                  label: intl.formatMessage(INTL.DELETE_BTN),
                  key: '2',
                  onClick: () => {
                    modal.confirm(deleteModalConfig());
                  },
                },
              ],
            }}
          >
            <Button key="4" style={{ padding: '0 8px' }}>
              <FormattedMessage {...BASIC_INTL.BTN_MORE} />
              <DownOutlined />
            </Button>
          </Dropdown>,
        ],
      }}
    >
      <ProCard direction="column" ghost gutter={[0, 16]}>
        <ProCard loading={loading} title={intl.formatMessage(INTL.TAB_INFO)}>
          <BetaSchemaForm<API.Organization>
            form={orgInfoForm}
            layoutType="Form"
            grid
            loading={updateOrgInfoLoading}
            onReset={handleResetOrgInfoFormValues}
            onFinish={() => handleUpdateOrgInfo()}
            columns={orgInfoColumns}
          />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default EditOrganization;
