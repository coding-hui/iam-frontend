import React, { ReactNode } from 'react';
import { Session } from '@/utils/storage';
import { TOKEN_KEY } from '@/enums/cacheEnum';
import { Divider, message, Tooltip } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { useIntl } from '@@/exports';
import { createStyles } from 'antd-style';
import { getStateFromQueryParams } from '@/utils';
import { GiteeIcon } from '@/components/Icon/GiteeIcon';

export type Props = {
  appConf?: App.Application;
  afterLoginSuccess: (access_token: string) => void;
};

const prefixCls = 'iam-provider';

const getRedirectUri = (appConf: App.Application, idp: App.IdentityProvider) => {
  let redirectURL = `${window.location.origin}/callback`;
  const config = idp.config as App.OAuthConfig;
  if (config.redirectURL !== '') {
    redirectURL = config.redirectURL;
  }
  return redirectURL;
};

const useStyle = createStyles(({ token }) => {
  return {
    main: {
      [`.${prefixCls}`]: {
        ['&-icon']: {
          margin: '0 8px',
          color: 'rgba(0, 0, 0, 0.2)',
          fontSize: '28px',
          verticalAlign: 'middle',
          cursor: 'pointer',
          transition: 'color 0.3s',
          '&:hover': {
            color: token.colorPrimaryActive,
          },
        },
      },
    },
  };
});

const INTL = {
  LOGIN_FAILURE: {
    id: 'pages.login.failure',
  },
  LOGIN_SUCCES: {
    id: 'pages.login.success',
  },
  OTHER_LOGIN: {
    id: 'pages.login.otherLogin',
  },
};

const AuthInfo: Record<
  string,
  {
    icon: ReactNode;
    scope: string;
    endpoint: string;
    renderAuthUrl: (appConf: App.Application, idp: App.IdentityProvider) => string;
  }
> = {
  GitHub: {
    scope: 'user:email+read:user',
    endpoint: 'https://github.com/login/oauth/authorize',
    icon: <GithubOutlined className={`${prefixCls}-icon`} />,
    renderAuthUrl: (appConf: App.Application, idp: App.IdentityProvider): string => {
      const state = getStateFromQueryParams(appConf.metadata.name, idp.metadata.name);
      return `${AuthInfo.GitHub.endpoint}?client_id=${
        idp.config.clientID
      }&redirect_uri=${getRedirectUri(appConf, idp)}&scope=${
        AuthInfo.GitHub.scope
      }&response_type=code&state=${state}`;
    },
  },
  Gitee: {
    scope: 'user_info%20emails',
    endpoint: 'https://gitee.com/oauth/authorize',
    icon: <GiteeIcon className={`${prefixCls}-icon`} />,
    renderAuthUrl: (appConf: App.Application, idp: App.IdentityProvider): string => {
      const state = getStateFromQueryParams(appConf.metadata.name, idp.metadata.name);
      return `${AuthInfo.Gitee.endpoint}?client_id=${
        idp.config.clientID
      }&redirect_uri=${getRedirectUri(appConf, idp)}&scope=${
        AuthInfo.Gitee.scope
      }&response_type=code&state=${state}`;
    },
  },
};

export const ProviderIcons = (props: Props) => {
  const intl = useIntl();
  const { styles } = useStyle();
  const { appConf, afterLoginSuccess } = props;

  const handleOauthLogin = (authUrl: string) => {
    const w = window.screen.availWidth * 0.4;
    const h = window.screen.availHeight * 0.6;
    const left = (window.screen.availWidth - w) / 2;
    const top = (window.screen.availHeight - h) / 2;
    window.open(
      authUrl,
      'newwindow',
      `height=${h},width=${w},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no'`,
    );
    window.onmessage = async (e) => {
      const { success, data } = e.data;
      if (success) {
        Session.set(TOKEN_KEY, data.access_token);
        message.success(intl.formatMessage(INTL.LOGIN_SUCCES));
        return afterLoginSuccess(data.access_token);
      }
      message.error(intl.formatMessage(INTL.LOGIN_FAILURE));
    };
  };

  if (!appConf || !appConf.identityProviders || appConf.identityProviders.length <= 0) {
    return <></>;
  }

  return (
    <div className={styles.main}>
      <Divider style={{ color: 'rgb(153, 153, 153)', fontSize: '14px' }} plain>
        {intl.formatMessage(INTL.OTHER_LOGIN)}
      </Divider>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {appConf &&
          appConf.identityProviders &&
          appConf.identityProviders.map((idp) => {
            const auth = AuthInfo[idp.type];
            if (auth === null || auth === undefined) {
              return null;
            }
            return (
              <Tooltip
                key={idp.metadata.instanceId}
                title={idp.displayName || idp.metadata.name}
                placement="top"
              >
                <a onClick={() => handleOauthLogin(auth.renderAuthUrl(appConf, idp))}>
                  {auth.icon}
                </a>
              </Tooltip>
            );
          })}
      </div>
    </div>
  );
};
