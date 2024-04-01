import React, { useEffect } from 'react';
import { Form } from 'antd';
import { useIntl } from '@umijs/max';
import { getRedirectURL } from '@/services/system/oauth';
import { ProFormText } from '@ant-design/pro-components';

import { FormProps } from './_hooks';

const INTL = {
  NAME: {
    id: 'idp.form.name',
  },
  AUTH_URL: {
    id: 'idp.form.authURL',
  },
};

export const CallbackURL = (props: FormProps) => {
  const intl = useIntl();
  const { form } = props;
  const name = Form.useWatch('name', form);
  const redirectURL = getRedirectURL(`${name ? name : `{${intl.formatMessage(INTL.NAME)}}`}`);
  const oldRedirectURL = form?.current?.getFieldValue(['config', 'redirectURL']);

  useEffect(() => {
    if (!form?.current.getFieldValue(['metadata', 'instanceId'])) {
      form.current?.setFieldValue(['config', 'redirectURL'], redirectURL);
    }
  }, [name]);

  return (
    <ProFormText
      width="lg"
      label={intl.formatMessage(INTL.AUTH_URL)}
      name={['config', 'redirectURL']}
      fieldProps={{ autoComplete: 'off' }}
      initialValue={oldRedirectURL ? oldRedirectURL : redirectURL}
    ></ProFormText>
  );
};

export default CallbackURL;
