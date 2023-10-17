import React from 'react';
import { useIntl } from '@umijs/max';
import { ProForm, ProFormText } from '@ant-design/pro-components';

import CallbackURL from './CallbackURL';

const INTL = {
  CLIENT_ID: {
    id: 'idp.form.clientID',
  },
  CLIENT_SECRET: {
    id: 'idp.form.clientSecret',
  },
  CALLBACK_URL: {
    id: 'idp.form.callbackURL',
  },
  CALLBACK_URL_PLACEHOLDER: {
    id: 'idp.form.callbackURL.placeholder',
  },
  CLIENT_ID_PLACEHOLDER: {
    id: 'idp.form.clientID.placeholder',
  },
  CLIENT_SECRET_PLACEHOLDER: {
    id: 'idp.form.clientSecret.placeholder',
  },
};

export const GitHub = () => {
  const intl = useIntl();

  return (
    <>
      <ProForm.Group align="center">
        <ProFormText
          width="lg"
          required
          name={['config', 'clientID']}
          fieldProps={{ autoComplete: 'off' }}
          label={intl.formatMessage(INTL.CLIENT_ID)}
          placeholder={intl.formatMessage(INTL.CLIENT_ID_PLACEHOLDER)}
          rules={[{ required: true }]}
        />
        <ProFormText.Password
          width="lg"
          name={['config', 'clientSecret']}
          fieldProps={{ autoComplete: 'off' }}
          label={intl.formatMessage(INTL.CLIENT_SECRET)}
          placeholder={intl.formatMessage(INTL.CLIENT_SECRET_PLACEHOLDER)}
          rules={[{ required: true }]}
        />
      </ProForm.Group>
      <ProForm.Group align="center">
        <ProFormText
          width="lg"
          name="callbackURL"
          fieldProps={{ autoComplete: 'off' }}
          label={intl.formatMessage(INTL.CALLBACK_URL)}
          placeholder={intl.formatMessage(INTL.CALLBACK_URL_PLACEHOLDER)}
        />
      </ProForm.Group>
      <ProForm.Group align="center">
        <CallbackURL />
      </ProForm.Group>
    </>
  );
};
