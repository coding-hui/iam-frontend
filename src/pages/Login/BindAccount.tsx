import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Avatar, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, LinkOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from '@umijs/max';
import { bindExternalAccount } from '@/services/system/login';
import { Session } from '@/utils/storage';
import { TOKEN_KEY } from '@/enums/cacheEnum';
import { useIntl } from '@@/exports';

const { Title, Text } = Typography;

interface BindAccountForm {
  username: string;
  password: string;
}

const INTL = {
  BIND_ACCOUNT_TITLE: {
    id: 'pages.bindAccount.title',
  },
  BIND_ACCOUNT_DESCRIPTION: {
    id: 'pages.bindAccount.description',
  },
  USERNAME: {
    id: 'pages.login.username',
  },
  PASSWORD: {
    id: 'pages.login.password',
  },
  BIND_BUTTON: {
    id: 'pages.bindAccount.bindButton',
  },
  SKIP_BUTTON: {
    id: 'pages.bindAccount.skipButton',
  },
  BIND_SUCCESS: {
    id: 'pages.bindAccount.success',
  },
  BIND_FAILED: {
    id: 'pages.bindAccount.failed',
  },
};

const BindAccount: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const [messageApi, contextHolder] = message.useMessage();

  // Extract external user info from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const provider = searchParams.get('provider') || '';
  const externalUID = searchParams.get('externalUID') || '';
  const externalUsername = searchParams.get('externalUsername') || '';
  const externalEmail = searchParams.get('externalEmail') || '';
  const externalAvatar = searchParams.get('externalAvatar') || '';

  const handleBind = async (values: BindAccountForm) => {
    setLoading(true);
    try {
      const result = await bindExternalAccount({
        username: values.username,
        password: values.password,
        provider,
        externalUID,
        externalInfo: {
          username: externalUsername,
          email: externalEmail,
          avatar: externalAvatar,
        },
      });

      if (result.access_token) {
        Session.set(TOKEN_KEY, result.access_token);
        messageApi.success(intl.formatMessage(INTL.BIND_SUCCESS));
        // Redirect to home page after successful binding
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } else {
        messageApi.error(intl.formatMessage(INTL.BIND_FAILED));
      }
    } catch (error: any) {
      console.error('Bind account error:', error);
      messageApi.error(error?.response?.data?.message || intl.formatMessage(INTL.BIND_FAILED));
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // For now, just redirect to login page when skipping binding
    // In the future, this could create a new account with the external info
    navigate('/login', { replace: true });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f2f5',
        padding: '20px',
      }}
    >
      {contextHolder}
      <Card
        style={{
          width: 400,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Space direction="vertical" size="middle">
            <Avatar size={64} src={externalAvatar} icon={<UserOutlined />} />
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {intl.formatMessage(INTL.BIND_ACCOUNT_TITLE)}
              </Title>
              <Text type="secondary">{intl.formatMessage(INTL.BIND_ACCOUNT_DESCRIPTION)}</Text>
            </div>
          </Space>
        </div>

        <Divider>
          <Space>
            <LinkOutlined />
            <Text type="secondary">{provider.toUpperCase()}</Text>
          </Space>
        </Divider>

        <Form form={form} name="bind-account" onFinish={handleBind} autoComplete="off" size="large">
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'pages.login.username.required' }),
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder={intl.formatMessage(INTL.USERNAME)} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'pages.login.password.required' }),
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={intl.formatMessage(INTL.PASSWORD)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%', marginBottom: 8 }}
            >
              {intl.formatMessage(INTL.BIND_BUTTON)}
            </Button>
            <Button type="default" onClick={handleSkip} style={{ width: '100%' }}>
              {intl.formatMessage(INTL.SKIP_BUTTON)}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default BindAccount;
