import { CheckCircleOutlined, DeleteOutlined, DownOutlined, StopOutlined } from '@ant-design/icons';
import {
  BetaSchemaForm,
  PageContainer,
  ProCard,
  ProColumns,
  ProFormColumnsType,
  ProTable,
} from '@ant-design/pro-components';
import { App, Avatar, Button, Dropdown } from 'antd';
import React from 'react';
import { FormattedMessage } from '@umijs/max';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import useUserHook from '@/pages/User/Edit/_hooks';
import { BASIC_INTL } from '@/constant';
import { SubjectTransfer } from '@/components';
import { TRANSFER_TYPE } from '@/components/Transfer';
import { useIntl } from '@@/exports';

const INTL = {
  ACTIVE_STATUS: 'users.table.status.active',
  DISABLED_STATUS: 'users.table.status.disabled',
  UPDATE_SUCCESS: 'message.update.success',
  REVOKE_ROLE: {
    id: 'role.revoke.user',
  },
  ENABLE_CONFIRM_TITLE: {
    id: 'users.modalconfirm.enable.title',
  },
  ENABLE_CONFIRM_CONTENT: {
    id: 'users.modalconfirm.enable.content',
  },
  DISABLE_CONFIRM_TITLE: {
    id: 'users.modalconfirm.disable.title',
  },
  DISABLE_CONFIRM_CONTENT: {
    id: 'users.modalconfirm.disable.content',
  },
  RESET_PWD_TITLE: {
    id: 'users.modalconfirm.resetPwd.title',
  },
};

const DEFAULT_PWD = '123456';

const EditUser: React.FC = () => {
  const intl = useIntl();
  const { modal } = App.useApp();
  const {
    states: {
      userTabs,
      currentTab,
      userInfo,
      loading,
      updateUserInfoLoading,
      userInfoForm,
      accountInfoForm,
      roleTableActionRef,
    },
    actions: {
      isInfoTab,
      fetchUserRoles,
      getAssignRolesKeys,
      handleTabChange,
      handleToEditRole,
      handleDeleteUser,
      handleRevokeUserRole,
      handleAssignUserRole,
      handleUpdateUserInfo,
      handleChangeUserState,
      handleResetUserInfoFormValues,
    },
  } = useUserHook();

  const userInfoColumns: ProFormColumnsType<API.UserInfo>[] = [
    {
      title: <FormattedMessage {...BASIC_INTL.NAME} />,
      dataIndex: ['metadata', 'name'],
      width: 'md',
      colProps: {
        xs: 16,
        md: 8,
      },
    },
    {
      title: <FormattedMessage {...BASIC_INTL.NICKNAME} />,
      dataIndex: 'alias',
      width: 'md',
      colProps: {
        xs: 16,
        md: 8,
      },
    },
    {
      title: <FormattedMessage {...BASIC_INTL.PHONE} />,
      dataIndex: 'phone',
      width: 'md',
      colProps: {
        xs: 16,
        md: 8,
      },
    },
    {
      title: <FormattedMessage {...BASIC_INTL.EMAIL} />,
      dataIndex: 'email',
      width: 'md',
      colProps: {
        xs: 16,
        md: 8,
      },
    },
  ];

  const accountInfoColumns: ProFormColumnsType<API.UserInfo>[] = [
    {
      title: <FormattedMessage {...BASIC_INTL.ACCOUNT_STATUS} />,
      dataIndex: 'disabled',
      width: 'md',
      readonly: true,
      colProps: {
        xs: 16,
        md: 8,
      },
      valueEnum: {
        false: {
          text: <FormattedMessage id={INTL.ACTIVE_STATUS} defaultMessage="Actived" />,
          status: 'Success',
        },
        true: {
          text: <FormattedMessage id={INTL.DISABLED_STATUS} defaultMessage="Disabled" />,
          status: 'Error',
        },
      },
    },
    {
      title: <FormattedMessage {...BASIC_INTL.LAST_LOGIN_TIME} />,
      dataIndex: 'lastLoginTime',
      valueType: 'dateTime',
      width: 'md',
      readonly: true,
      colProps: {
        xs: 16,
        md: 8,
      },
    },
    {
      title: <FormattedMessage {...BASIC_INTL.CREATED_AT} />,
      dataIndex: ['metadata', 'createdAt'],
      valueType: 'dateTime',
      readonly: true,
      width: 'md',
      colProps: {
        xs: 16,
        md: 8,
      },
    },
  ];

  const roleColumns: ProColumns<API.Role>[] = [
    {
      title: <FormattedMessage {...BASIC_INTL.NAME} />,
      dataIndex: ['metadata', 'name'],
      render: (_, record: API.Role) => (
        <a key="name" onClick={() => handleToEditRole(record.metadata.instanceId)}>
          {record.metadata.name}
        </a>
      ),
    },
    {
      title: <FormattedMessage {...BASIC_INTL.STATUS} />,
      dataIndex: 'disabled',
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
      render: (_, record: API.Role) => [
        <a key="revokeUserRole" onClick={() => handleRevokeUserRole(record.metadata.instanceId)}>
          <FormattedMessage {...INTL.REVOKE_ROLE} />
        </a>,
      ],
    },
  ];

  const userAvatarTitleClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'center',
      fontSize: '24px',
      fontWeight: 500,
      color: '#293350',
      marginRight: '8px',
      overflow: 'hidden',
    };
  });

  const avatarColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

  const getAvatarColor = (name?: string, avatar?: string) => {
    if (avatar) {
      return '';
    }
    if (!name) {
      return avatarColorList[0];
    }
    return avatarColorList[name.length % avatarColorList.length];
  };

  const userAvatarTitle = (
    <div>
      <Avatar
        src={userInfo && userInfo.avatar ? userInfo.avatar : null}
        style={{
          backgroundColor: getAvatarColor(userInfo?.metadata.name, userInfo?.avatar),
          verticalAlign: 'bottom',
        }}
        size={56}
        gap={4}
      >
        {userInfo && userInfo.metadata.name ? userInfo.metadata.name.substring(0, 5) : ''}
      </Avatar>
    </div>
  );

  const userSubTitleClassName = useEmotionCss(() => {
    return {
      fontFamily: 'normal',
      fontWeight: 400,
      fontSize: '14px',
      color: '#86909c',
    };
  });

  const userSubTitleInfo = (
    <div>
      <div className={userAvatarTitleClassName}>{userInfo?.metadata.name}</div>
      <div className={userSubTitleClassName}>{`ID : ${userInfo?.metadata.instanceId}`}</div>
    </div>
  );

  const deleteModalConfig = () => {
    let title = intl.formatMessage(BASIC_INTL.DELETE_CONFIRM_TITLE, {
      name: userInfo?.metadata.name,
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
        handleDeleteUser();
      },
      okText: intl.formatMessage(BASIC_INTL.BTN_DELETE),
      okButtonProps: { danger: true },
    };
  };

  const changeUserStateModalConfig = () => {
    let title = intl.formatMessage(INTL.DISABLE_CONFIRM_TITLE, {
      name: userInfo?.metadata.name,
    });
    let content = intl.formatMessage(INTL.DISABLE_CONFIRM_CONTENT, {
      name: userInfo?.metadata.name,
    });
    let okText = intl.formatMessage(BASIC_INTL.BTN_DISABLE);
    if (userInfo?.disabled) {
      title = intl.formatMessage(INTL.ENABLE_CONFIRM_TITLE, {
        name: userInfo?.metadata.name,
      });
      content = intl.formatMessage(INTL.ENABLE_CONFIRM_CONTENT, {
        name: userInfo?.metadata.name,
      });
      okText = intl.formatMessage(BASIC_INTL.BTN_ENABLE);
    }
    return {
      title: title,
      content: content,
      centered: true,
      onOk: () => {
        handleChangeUserState(!userInfo?.disabled);
      },
      okText: okText,
      okButtonProps: { danger: !userInfo?.disabled },
    };
  };

  const restartPwdModalConfig = () => {
    let title = intl.formatMessage(INTL.RESET_PWD_TITLE);
    return {
      title: title,
      centered: true,
      onOk: async () => {
        await handleUpdateUserInfo(DEFAULT_PWD);
      },
    };
  };

  return (
    <PageContainer
      fixedHeader
      tabActiveKey={currentTab}
      onTabChange={(tab) => handleTabChange(tab)}
      tabList={[
        { ...userTabs.INFO, tab: <FormattedMessage id={userTabs.INFO.tab} /> },
        { ...userTabs.ROLES, tab: <FormattedMessage id={userTabs.ROLES.tab} /> },
        { ...userTabs.LOG, tab: <FormattedMessage id={userTabs.LOG.tab} /> },
      ]}
      header={{
        title: userAvatarTitle,
        subTitle: userSubTitleInfo,
        extra: [
          <Dropdown
            key="dropdown"
            trigger={['click']}
            menu={{
              items: [
                {
                  icon: userInfo?.disabled ? <CheckCircleOutlined /> : <StopOutlined />,
                  label: userInfo?.disabled
                    ? intl.formatMessage(BASIC_INTL.BTN_ENABLE)
                    : intl.formatMessage(BASIC_INTL.BTN_DISABLE),
                  key: '1',
                  onClick: () => {
                    modal.confirm(changeUserStateModalConfig());
                  },
                },
                {
                  icon: <DeleteOutlined />,
                  label: intl.formatMessage(BASIC_INTL.BTN_DELETE),
                  key: '2',
                  onClick: () => {
                    modal.confirm(deleteModalConfig());
                  },
                },
              ],
            }}
          >
            <Button key="4" style={{ padding: '0 8px' }}>
              <FormattedMessage {...BASIC_INTL.MORE} />
              <DownOutlined />
            </Button>
          </Dropdown>,
          <Button
            key="3"
            type="primary"
            onClick={() => {
              modal.confirm(restartPwdModalConfig());
            }}
          >
            <FormattedMessage {...BASIC_INTL.RESET_PASSWORD} />
          </Button>,
        ],
      }}
    >
      <ProCard direction="column" ghost gutter={[0, 16]}>
        {isInfoTab() ? (
          <>
            <ProCard loading={loading} title={<FormattedMessage {...BASIC_INTL.USER_INFO} />}>
              <BetaSchemaForm<API.UserInfo>
                form={userInfoForm}
                layoutType="Form"
                grid
                loading={updateUserInfoLoading}
                onReset={handleResetUserInfoFormValues}
                onFinish={() => handleUpdateUserInfo()}
                columns={userInfoColumns}
              />
            </ProCard>
            <ProCard loading={loading} title={<FormattedMessage {...BASIC_INTL.ACCOUNT_INFO} />}>
              <BetaSchemaForm<API.UserInfo>
                form={accountInfoForm}
                layoutType="Form"
                grid
                readonly
                columns={accountInfoColumns}
                submitter={false}
              />
            </ProCard>
          </>
        ) : (
          <ProTable
            headerTitle={<FormattedMessage {...BASIC_INTL.ASSIGNED_ROLES} />}
            actionRef={roleTableActionRef}
            search={false}
            columns={roleColumns}
            request={fetchUserRoles}
            rowKey={(record) => record?.metadata?.instanceId ?? ''}
            toolBarRender={() => [
              <SubjectTransfer
                key="assignUserRole"
                types={[TRANSFER_TYPE.ROLE]}
                doGetTargetRoles={() => getAssignRolesKeys()}
                onOk={(values) => handleAssignUserRole(values)}
              />,
            ]}
          ></ProTable>
        )}
      </ProCard>
    </PageContainer>
  );
};

export default EditUser;
