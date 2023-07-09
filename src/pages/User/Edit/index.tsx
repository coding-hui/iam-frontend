import { getUserInfo } from '@/services/user/getUserInfo';
import { CheckCircleOutlined, DeleteOutlined, DownOutlined, StopOutlined } from '@ant-design/icons';
import {
  BetaSchemaForm,
  PageContainer,
  ProCard,
  ProFormColumnsType,
} from '@ant-design/pro-components';
import { useParams, useRequest } from '@umijs/max';
import { App, Avatar, Button, Dropdown, Form } from 'antd';
import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from '@@/exports';
import { updateUser } from '@/services/user/updateUser';
import { useEmotionCss } from '@ant-design/use-emotion-css';

const INTL = {
  ACTIVE_STATUS: 'users.table.status.active',
  DISABLED_STATUS: 'users.table.status.disabled',
  UPDATE_SUCCESS: 'message.update.success',
};

const EditUser: React.FC = () => {
  const intl = useIntl();
  const { message } = App.useApp();
  const { instanceId } = useParams();
  const [userInfoForm] = Form.useForm();
  const [accountInfoForm] = Form.useForm();

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

  const {
    run: doGetUserInfo,
    data: userInfo,
    loading,
  } = useRequest(getUserInfo, {
    manual: true,
    loadingDelay: 600,
    formatResult: (userInfo) => userInfo,
    onSuccess: (userInfo) => {
      userInfoForm.setFieldsValue(userInfo);
      accountInfoForm.setFieldsValue(userInfo);
    },
  });

  useEffect(() => {
    if (instanceId) {
      doGetUserInfo(instanceId);
    }
  }, []);

  const { run: doUpdateUserInfo, loading: updateUserInfoLoading } = useRequest(updateUser, {
    manual: true,
    onSuccess: () => {
      message.success(intl.formatMessage({ id: INTL.UPDATE_SUCCESS }));
    },
  });

  const handleResetUserInfoFormValues = () => {
    userInfoForm.setFieldsValue(userInfo);
    accountInfoForm.setFieldsValue(userInfo);
  };

  const handleUpdateUserInfo = async () => {
    try {
      const values = await userInfoForm.validateFields();
      if (userInfo) {
        doUpdateUserInfo(userInfo.metadata.instanceId, values);
      }
    } catch (err) {
      //
    }
  };

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
      tabList={[
        {
          tab: '用户信息',
          key: '1',
        },
        {
          tab: '角色权限',
          key: '2',
        },
        {
          tab: '访问日志',
          key: '3',
          disabled: true,
        },
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
      </ProCard>
    </PageContainer>
  );
};

export default EditUser;
