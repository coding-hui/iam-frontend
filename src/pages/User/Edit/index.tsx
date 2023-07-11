import { CheckCircleOutlined, DeleteOutlined, DownOutlined, StopOutlined } from '@ant-design/icons';
import {
  BetaSchemaForm,
  PageContainer,
  ProCard,
  ProColumns,
  ProFormColumnsType,
  ProTable,
} from '@ant-design/pro-components';
import { Avatar, Button, Dropdown } from 'antd';
import React from 'react';
import { FormattedMessage } from '@umijs/max';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import useUserHook from '@/pages/User/Edit/_hooks';
import { BASIC_INTL } from '@/constant';
import { SubjectTransfer } from '@/components';
import { TRANSFER_TYPE } from '@/components/Transfer';

const INTL = {
  ACTIVE_STATUS: 'users.table.status.active',
  DISABLED_STATUS: 'users.table.status.disabled',
  UPDATE_SUCCESS: 'message.update.success',
  REVOKE_ROLE: {
    id: 'role.revoke.user',
  },
};

const EditUser: React.FC = () => {
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
      handleRevokeUserRole,
      handleAssignUserRole,
      handleUpdateUserInfo,
      handleResetUserInfoFormValues,
    },
  } = useUserHook();

  const userInfoColumns: ProFormColumnsType<API.UserInfo>[] = [
    {
      title: '用户名',
      dataIndex: ['metadata', 'name'],
      width: 'md',
      colProps: {
        xs: 16,
        md: 8,
      },
    },
    {
      title: '昵称',
      dataIndex: 'alias',
      width: 'md',
      colProps: {
        xs: 16,
        md: 8,
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 'md',
      colProps: {
        xs: 16,
        md: 8,
      },
    },
    {
      title: '邮箱',
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
      title: '账号状态',
      dataIndex: 'status',
      width: 'md',
      readonly: true,
      colProps: {
        xs: 16,
        md: 8,
      },
      valueEnum: {
        0: {
          text: <FormattedMessage id={INTL.ACTIVE_STATUS} defaultMessage="Actived" />,
          status: 'Success',
        },
        1: {
          text: <FormattedMessage id={INTL.DISABLED_STATUS} defaultMessage="Disabled" />,
          status: 'Error',
        },
      },
    },
    {
      title: '上次登录时间',
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
      title: '创建时间',
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
      title: <FormattedMessage {...BASIC_INTL.INSTANCE_ID} />,
      dataIndex: ['metadata', 'instanceId'],
      render: (_, record: API.Role) => (
        <a key="instanceId" onClick={() => handleToEditRole(record.metadata.instanceId)}>
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

  const getAvatarColor = (name?: string) => {
    if (!name) {
      return avatarColorList[0];
    }
    return avatarColorList[name.length % avatarColorList.length];
  };

  const userAvatarTitle = (
    <div>
      <Avatar
        style={{
          backgroundColor: getAvatarColor(userInfo?.metadata.name),
          verticalAlign: 'middle',
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

  return (
    <PageContainer
      fixedHeader
      tabActiveKey={currentTab}
      onTabChange={(tab) => handleTabChange(tab)}
      tabList={[userTabs.INFO, userTabs.ROLES, userTabs.LOG]}
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
                  icon: userInfo?.status === '1' ? <CheckCircleOutlined /> : <StopOutlined />,
                  label: userInfo?.status === '1' ? '启用账号' : '禁用账号',
                  key: '1',
                },
                {
                  icon: <DeleteOutlined />,
                  label: '删除账号',
                  key: '2',
                },
              ],
            }}
          >
            <Button key="4" style={{ padding: '0 8px' }}>
              更多
              <DownOutlined />
            </Button>
          </Dropdown>,
          <Button key="3" type="primary">
            重置密码
          </Button>,
        ],
      }}
    >
      <ProCard direction="column" ghost gutter={[0, 16]}>
        {isInfoTab() ? (
          <>
            <ProCard loading={loading} title="用户信息">
              <BetaSchemaForm<API.UserInfo>
                form={userInfoForm}
                layoutType="Form"
                grid
                loading={updateUserInfoLoading}
                onReset={handleResetUserInfoFormValues}
                onFinish={handleUpdateUserInfo}
                columns={userInfoColumns}
              />
            </ProCard>
            <ProCard loading={loading} title="账号信息">
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
            headerTitle="拥有角色"
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
