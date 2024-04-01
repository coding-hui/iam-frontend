import React from 'react';
import { useIntl } from '@umijs/max';
import { Checkbox, Col, Row } from 'antd';
import { ProForm, ProFormText } from '@ant-design/pro-components';

import CallbackURL from './CallbackURL';
import { FormProps } from './_hooks';
import { getDefaultCallbackURL } from '@/services/system/oauth';

const INTL = {
  CLIENT_ID: {
    id: 'idp.form.clientID',
  },
  SCOPES: {
    id: 'idp.form.scopes',
  },
  CLIENT_SECRET: {
    id: 'idp.form.clientSecret',
  },
  CALLBACK_URL: {
    id: 'idp.form.callbackURL',
  },
  CALLBACK_URL_TIPS: {
    id: 'idp.form.callbackURL.tips',
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

export const Gitee: React.FC<FormProps> = (props: FormProps) => {
  const intl = useIntl();

  const giteeScopes = [
    { name: 'user_info', desc: '' },
    { name: 'projects', desc: '' },
    { name: 'pull_requests', desc: '' },
    { name: 'issues', desc: '' },
    { name: 'notes', desc: '' },
    { name: 'keys', desc: '' },
    { name: 'hook', desc: '' },
    { name: 'groups', desc: '' },
    { name: 'gists', desc: '' },
    { name: 'emails', desc: '' },
    { name: 'enterprises', desc: '' },
  ];

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
          initialValue={getDefaultCallbackURL()}
          label={intl.formatMessage(INTL.CALLBACK_URL)}
          tooltip={intl.formatMessage(INTL.CALLBACK_URL_TIPS)}
          placeholder={intl.formatMessage(INTL.CALLBACK_URL_PLACEHOLDER)}
        />
      </ProForm.Group>
      <ProForm.Group align="center">
        <ProForm.Item name={['config', 'scopes']} label={intl.formatMessage(INTL.SCOPES)}>
          <Checkbox.Group style={{ maxWidth: 912 }}>
            <Row gutter={[4, 8]}>
              {giteeScopes.map((act) => {
                return (
                  <Col span={6} key={`${act.name}-scope`}>
                    <Checkbox value={act.name}>
                      {act.name}
                      {act.desc ? `(${act.desc})` : ''}
                    </Checkbox>
                  </Col>
                );
              })}
            </Row>
          </Checkbox.Group>
        </ProForm.Item>
      </ProForm.Group>
      <ProForm.Group align="center">
        <CallbackURL form={props.form} />
      </ProForm.Group>
    </>
  );
};
