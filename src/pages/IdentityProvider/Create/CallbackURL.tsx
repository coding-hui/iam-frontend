import React from 'react';
import { useIntl } from '@umijs/max';
import { getRedirectURL } from '@/services/system/oauth';
import { ProFormDependency, ProFormText } from '@ant-design/pro-components';

const INTL = {
  NAME: {
    id: 'idp.form.name',
  },
  AUTH_URL: {
    id: 'idp.form.authURL',
  },
};

export const CallbackURL = () => {
  const intl = useIntl();

  return (
    <ProFormDependency name={['name']}>
      {({ name }) => {
        const redirectURL = getRedirectURL(name ? name : `{${intl.formatMessage(INTL.NAME)}}`);
        return (
          <ProFormText
            width="xl"
            label={intl.formatMessage(INTL.AUTH_URL)}
            name={['config', 'redirectURL']}
            allowClear={false}
            initialValue={redirectURL}
          ></ProFormText>
        );
      }}
    </ProFormDependency>
  );
};

export default CallbackURL;
