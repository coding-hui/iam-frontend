import React from 'react';
import { message } from 'antd';
import { createStyles } from 'antd-style';
import { ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { LockOutlined, MobileOutlined } from '@ant-design/icons';
import { useIntl, FormattedMessage } from '@umijs/max';

import { getFakeCaptcha } from '@/services/system/login';

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

export const Captcha: React.FC = () => {
  const intl = useIntl();
  const { styles } = useStyle();

  return (
    <div className={styles.main}>
      <ProFormText
        fieldProps={{
          size: 'large',
          prefix: <MobileOutlined />,
        }}
        name="mobile"
        placeholder={intl.formatMessage({
          id: 'pages.login.phoneNumber.placeholder',
          defaultMessage: '手机号',
        })}
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.login.phoneNumber.required"
                defaultMessage="请输入手机号！"
              />
            ),
          },
          {
            pattern: /^1\d{10}$/,
            message: (
              <FormattedMessage
                id="pages.login.phoneNumber.invalid"
                defaultMessage="手机号格式错误！"
              />
            ),
          },
        ]}
      />
      <ProFormCaptcha
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined />,
        }}
        captchaProps={{
          size: 'large',
        }}
        placeholder={intl.formatMessage({
          id: 'pages.login.captcha.placeholder',
          defaultMessage: '请输入验证码',
        })}
        captchaTextRender={(timing, count) => {
          if (timing) {
            return `${count} ${intl.formatMessage({
              id: 'pages.getCaptchaSecondText',
              defaultMessage: '获取验证码',
            })}`;
          }
          return intl.formatMessage({
            id: 'pages.login.phoneLogin.getVerificationCode',
            defaultMessage: '获取验证码',
          });
        }}
        name="captcha"
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage id="pages.login.captcha.required" defaultMessage="请输入验证码！" />
            ),
          },
        ]}
        onGetCaptcha={async (phone) => {
          const result = await getFakeCaptcha({
            phone,
          });
          if (!result) {
            return;
          }
          message.success('获取验证码成功！验证码为：1234');
        }}
      />
    </div>
  );
};
