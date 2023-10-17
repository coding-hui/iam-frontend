import React from 'react';
import { Typography } from 'antd';
import { useIntl } from '@umijs/max';
import { getRedirectURL } from '@/services/system/oauth';
import { ProFormDependency, ProFormText } from '@ant-design/pro-components';

const { Paragraph } = Typography;

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
            readonly
            fieldProps={{ autoComplete: 'off' }}
            initialValue={redirectURL}
            proFieldProps={{
              render: () => {
                return (
                  <Paragraph copyable={{ text: redirectURL }} style={{ marginBottom: '0' }}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: `<span>${redirectURL}</span>`,
                      }}
                    />
                  </Paragraph>
                );
              },
            }}
          ></ProFormText>
        );
      }}
    </ProFormDependency>
  );
};

export default CallbackURL;
