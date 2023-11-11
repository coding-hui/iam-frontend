import React from 'react';
import { useIntl } from '@umijs/max';
import { Checkbox, Col, Row } from 'antd';
import { ProForm, ProFormText } from '@ant-design/pro-components';

import CallbackURL from './CallbackURL';
import { FormProps } from './_hooks';

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
  CALLBACK_URL_PLACEHOLDER: {
    id: 'idp.form.callbackURL.placeholder',
  },
  CODING_TEAM: {
    id: 'idp.form.codingTeam',
  },
  CODING_TEAM_PLACEHOLDER: {
    id: 'idp.form.codingTeam.placeholder',
  },
  CLIENT_ID_PLACEHOLDER: {
    id: 'idp.form.clientID.placeholder',
  },
  CLIENT_SECRET_PLACEHOLDER: {
    id: 'idp.form.clientSecret.placeholder',
  },
};

export const Coding: React.FC<FormProps> = (props: FormProps) => {
  const intl = useIntl();

  const scopes = [
    { name: 'user', desc: '' },
    { name: 'user:email', desc: '' },
    { name: 'notification', desc: '' },
    { name: 'project', desc: '' },
    { name: 'project:api_doc', desc: '' },
    { name: 'project:artifacts', desc: '' },
    { name: 'project:depot', desc: '' },
    { name: 'project:file', desc: '' },
    { name: 'project:issue', desc: '' },
    { name: 'project:key', desc: '' },
    { name: 'project:members', desc: '' },
    { name: 'project:notice', desc: '' },
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
          name={['config', 'team']}
          fieldProps={{ autoComplete: 'off' }}
          label={intl.formatMessage(INTL.CODING_TEAM)}
          placeholder={intl.formatMessage(INTL.CODING_TEAM_PLACEHOLDER)}
          rules={[{ required: true }]}
        />
        <ProFormText
          width="lg"
          name="callbackURL"
          fieldProps={{ autoComplete: 'off' }}
          label={intl.formatMessage(INTL.CALLBACK_URL)}
          placeholder={intl.formatMessage(INTL.CALLBACK_URL_PLACEHOLDER)}
        />
      </ProForm.Group>
      <ProForm.Group align="center">
        <ProForm.Item name={['config', 'scopes']} label={intl.formatMessage(INTL.SCOPES)}>
          <Checkbox.Group style={{ maxWidth: 912 }}>
            <Row gutter={[4, 8]}>
              {scopes.map((act) => {
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
