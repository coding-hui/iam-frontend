import React from 'react';
import { createStyles } from 'antd-style';
import { ProFormText } from '@ant-design/pro-components';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useIntl, FormattedMessage } from '@umijs/max';

const useStyle = createStyles(({ token }) => {
  return {
    main: {
      ['.icon']: {
        color: token.colorPrimary,
        fontSize: token.fontSize,
      },
    },
  };
});

const INTL = {
  USERNAME_PLACEHOLDER: {
    id: 'pages.login.username.placeholder',
  },
  USERNAME_REQUIRED: {
    id: 'pages.login.username.required',
  },
  PASSWORD_PLACEHOLDER: {
    id: 'pages.login.password.placeholder',
  },
  PASSWORD_REQUIRED: {
    id: 'pages.login.password.required',
  },
};

export const Password: React.FC = () => {
  const intl = useIntl();
  const { styles } = useStyle();

  return (
    <div className={styles.main}>
      <ProFormText
        name="username"
        fieldProps={{
          size: 'large',
          prefix: <UserOutlined />,
        }}
        placeholder={intl.formatMessage(INTL.USERNAME_PLACEHOLDER)}
        rules={[
          {
            required: true,
            message: <FormattedMessage {...INTL.USERNAME_REQUIRED} />,
          },
        ]}
      />
      <ProFormText.Password
        name="password"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined />,
        }}
        placeholder={intl.formatMessage(INTL.PASSWORD_PLACEHOLDER)}
        rules={[
          {
            required: true,
            message: <FormattedMessage {...INTL.PASSWORD_REQUIRED} />,
          },
        ]}
      />
    </div>
  );
};
