import React from 'react';
import { useIntl } from '@umijs/max';
import { ProForm, ProFormText } from '@ant-design/pro-components';

const INTL = {
  APP_ID: {
    id: 'idp.form.appID',
  },
  APP_SECRET: {
    id: 'idp.form.appSecret',
  },
  APP_ID_PLACEHOLDER: {
    id: 'idp.form.appID.placeholder',
  },
  APP_SECRET_PLACEHOLDER: {
    id: 'idp.form.appSecret.placeholder',
  },
};

export const WeChatMiniProgram = () => {
  const intl = useIntl();

  return (
    <>
      <ProForm.Group align="center">
        <ProFormText
          width="lg"
          required
          name={['config', 'appID']}
          fieldProps={{ autoComplete: 'off' }}
          label={intl.formatMessage(INTL.APP_ID)}
          placeholder={intl.formatMessage(INTL.APP_ID_PLACEHOLDER)}
          rules={[{ required: true }]}
        />
        <ProFormText.Password
          width="lg"
          name={['config', 'appSecret']}
          fieldProps={{ autoComplete: 'off' }}
          label={intl.formatMessage(INTL.APP_SECRET)}
          placeholder={intl.formatMessage(INTL.APP_SECRET_PLACEHOLDER)}
          rules={[{ required: true }]}
        />
      </ProForm.Group>
    </>
  );
};
