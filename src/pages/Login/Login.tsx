import React from 'react';
import classnames from 'classnames';
import { Spin, Tabs } from 'antd';
import Footer from '@/components/Footer';
import { LoginForm, ProCard, ProFormCheckbox } from '@ant-design/pro-components';
import { FormattedMessage, Helmet, useIntl } from '@umijs/max';

import Settings from '../../../config/defaultSettings';

import useStyle from './style';
import { Lang } from './Lang';
import { Password } from './Password';
import { Captcha } from './Captcha';
import useLoginHook from './_hooks';
import { ProviderIcons } from './ProviderIcons';

const prefixCls = 'iam-login';

const INTL = {
  TITLE: {
    id: 'menu.login',
  },
  LOGIN_CARD_SUB_TITLE: {
    id: 'pages.layouts.userLayout.title',
  },
  ACCOUNT_LOGIN: {
    id: 'pages.login.accountLogin.tab',
  },
  PHONE_LOGIN: {
    id: 'pages.login.phoneLogin.tab',
  },
  REMEMBER_ME: {
    id: 'pages.login.rememberMe',
  },
  FORGOT_PASSWORD: {
    id: 'pages.login.forgotPassword',
  },
};

const Login: React.FC = () => {
  const intl = useIntl();
  const { styles } = useStyle({ prefix: prefixCls });
  const {
    states: { loginType, appConf, loadAppConfLoading },
    actions: { handleLogin, setLoginType, afterLoginSuccess },
  } = useLoginHook();

  return (
    <div className={classnames(styles.main)}>
      <div className={classnames(`${prefixCls}-wrapper`)}>
        <Lang prefixCls={prefixCls} />
        <Helmet>
          <title>
            {intl.formatMessage(INTL.TITLE)} - {Settings.title}
          </title>
        </Helmet>
        <div className={`${prefixCls}-container`}>
          <ProCard className={`${prefixCls}-login-card`}>
            <LoginForm
              className={`${prefixCls}-login-form`}
              title="WECODING"
              subTitle={intl.formatMessage(INTL.LOGIN_CARD_SUB_TITLE)}
              initialValues={{
                autoLogin: true,
              }}
              actions={[
                <Spin key="provider-icons" spinning={loadAppConfLoading}>
                  <ProviderIcons appConf={appConf} afterLoginSuccess={afterLoginSuccess} />
                </Spin>,
              ]}
              onFinish={async (values) => {
                await handleLogin(values as API.LoginParams);
              }}
            >
              <Tabs
                activeKey={loginType}
                onChange={setLoginType}
                centered
                items={[
                  {
                    key: 'account',
                    label: intl.formatMessage(INTL.ACCOUNT_LOGIN),
                    children: <Password />,
                  },
                  {
                    key: 'mobile',
                    label: intl.formatMessage(INTL.PHONE_LOGIN),
                    children: <Captcha />,
                  },
                ]}
              />
              <div style={{ marginBottom: 24 }}>
                <ProFormCheckbox noStyle name="autoLogin">
                  <FormattedMessage {...INTL.REMEMBER_ME} />
                </ProFormCheckbox>
                <a style={{ float: 'right' }}>
                  <FormattedMessage {...INTL.FORGOT_PASSWORD} />
                </a>
              </div>
            </LoginForm>
          </ProCard>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Login;
