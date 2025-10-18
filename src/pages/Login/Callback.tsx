import React, { useEffect } from 'react';
import { useLocation, useNavigate } from '@umijs/max';
import { Session } from '@/utils/storage';
import { TOKEN_KEY } from '@/enums/cacheEnum';
import { message, Spin } from 'antd';
import { useIntl } from '@@/exports';

const INTL = {
  LOGIN_SUCCESS: {
    id: 'pages.login.success',
  },
  LOGIN_FAILURE: {
    id: 'pages.login.failure',
  },
};

const Callback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const handleCallback = () => {
      // Parse the query parameters from the URL
      const searchParams = new URLSearchParams(location.search);
      const accessToken = searchParams.get('access_token');
      if (accessToken) {
        // Store the token
        Session.set(TOKEN_KEY, accessToken);
        messageApi.success(intl.formatMessage(INTL.LOGIN_SUCCESS));
        // Redirect to home page
        navigate('/', { replace: true });
      } else {
        messageApi.error(intl.formatMessage(INTL.LOGIN_FAILURE));
        // Optionally redirect to login page if no token is found
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [location, navigate, intl, messageApi]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      {contextHolder}
      <Spin size="large" tip="Processing login..." />
    </div>
  );
};

export default Callback;
