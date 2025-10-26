import { App } from 'antd';
import { flushSync } from 'react-dom';
import { history, useIntl, useModel, useRequest } from '@umijs/max';
import { login } from '@/services/system/login';
import { Session } from '@/utils/storage';
import { TOKEN_KEY } from '@/enums/cacheEnum';
import { useState, useEffect } from 'react';

import { getApplicationPublicConfig } from '@/services/application/getApplication';
import { DEFAULT_APP } from '@/enums';

const INTL = {
  LOGIN_FAILURE: {
    id: 'pages.login.failure',
  },
  LOGIN_SUCCES: {
    id: 'pages.login.success',
  },
};

export default function useLoginHook() {
  const intl = useIntl();
  const { message } = App.useApp();
  const [appConfLoadCompleted, setAppConfLoadCompleted] = useState(false);
  const [loginType, setLoginType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const {
    run: doGetApplicationConf,
    data: appConf,
    loading: loadAppConfLoading,
  } = useRequest(getApplicationPublicConfig, {
    manual: true,
    formatResult: (appInfo) => appInfo,
    onSuccess: async () => {
      setAppConfLoadCompleted(true);
    },
  });

  useEffect(() => {
    if (!appConfLoadCompleted) {
      doGetApplicationConf(DEFAULT_APP);
    }
  }, [appConfLoadCompleted]);

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s: any) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const afterLoginSuccess = async (access_token: string) => {
    Session.set(TOKEN_KEY, access_token);
    await fetchUserInfo();
    const urlParams = new URL(window.location.href).searchParams;
    history.push(urlParams.get('redirect') || '/');
  };

  const handleLogin = async (values: API.LoginParams) => {
    try {
      // password
      const res = await login({ ...values, type: loginType });
      if (res && res.access_token) {
        message.success(intl.formatMessage(INTL.LOGIN_SUCCES));
        return afterLoginSuccess(res.access_token);
      }
    } catch (error) {
      message.error(intl.formatMessage(INTL.LOGIN_FAILURE));
    }
  };

  const states = {
    appConf,
    loginType,
    loadAppConfLoading,
  };

  const actions = {
    fetchUserInfo,
    handleLogin,
    setLoginType,
    afterLoginSuccess,
  };

  return {
    states,
    actions,
  } as const;
}
