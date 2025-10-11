import React, { useEffect } from 'react';
import { useLocation, useSearchParams, history } from '@umijs/max';
import { App, Spin } from 'antd';
import { Session } from '@/utils/storage';
import { TOKEN_KEY } from '@/enums/cacheEnum';
import { useIntl } from '@umijs/max';

const INTL = {
  LOGIN_FAILURE: {
    id: 'pages.login.failure',
  },
  LOGIN_SUCCES: {
    id: 'pages.login.success',
  },
};

const OAuthCallback: React.FC = () => {
  const intl = useIntl();
  const { message } = App.useApp();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Extract the authorization code from the URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        
        if (error) {
          message.error(intl.formatMessage(INTL.LOGIN_FAILURE));
          // Redirect back to login page
          history.push('/login');
          return;
        }

        if (code) {
          // Exchange the code for an access token
          // This would typically be done by calling your backend API
          const response = await fetch('/api/v1/oauth/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code,
              state,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            // Store the token
            Session.set(TOKEN_KEY, data.access_token);
            message.success(intl.formatMessage(INTL.LOGIN_SUCCES));
            
            // Redirect back to the original page or to the home page
            const returnUrl = Session.get('oauth_return_url') || '/';
            Session.remove('oauth_return_url');
            window.location.href = returnUrl;
          } else {
            throw new Error('Token exchange failed');
          }
        } else {
          throw new Error('No authorization code received');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        message.error(intl.formatMessage(INTL.LOGIN_FAILURE));
        // Redirect back to login page
        history.push('/login');
      }
    };

    handleOAuthCallback();
  }, [location, searchParams, message, intl]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin size="large" tip="Processing login..." />
    </div>
  );
};

export default OAuthCallback;
