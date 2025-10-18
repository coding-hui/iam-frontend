import React, { useEffect } from 'react';
import { useLocation, useNavigate } from '@umijs/max';
import { Session } from '@/utils/storage';
import { TOKEN_KEY } from '@/enums/cacheEnum';
import { App, Spin } from 'antd';
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
  const { message } = App.useApp();
  const intl = useIntl();

  useEffect(() => {
    const handleCallback =  () => {
      // Parse the query parameters from the URL
      const searchParams = new URLSearchParams(location.search);
      const accessToken = searchParams.get('access_token');
      if (accessToken) {
        // Store the token
        Session.set(TOKEN_KEY, accessToken);
        message.success(intl.formatMessage(INTL.LOGIN_SUCCESS));
        // Redirect to home page
        navigate('/', { replace: true });
      } else {
        message.error(intl.formatMessage(INTL.LOGIN_FAILURE));
        // Optionally redirect to login page if no token is found
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [location, navigate, message, intl]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <Spin size="large" tip="Processing login..." />
    </div>
  );
};

export default Callback;
