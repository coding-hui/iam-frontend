import React from 'react';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDependency,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { BASIC_INTL } from '@/constant';
import { IdentityProviderType, ProviderCategory } from '@/enums';

import { Gitee } from './Gitee';
import { GitHub } from './GitHub';
import { WeChatMiniProgram } from './WeChatMiniProgram';
import { Coding } from './Coding';

import useIdentityProviderHook from './_hooks';

const INTL = {
  BASIC_INFO: {
    id: 'policy.form.title.basicInfo',
  },
  LOGIN_CONFIG: {
    id: 'policy.form.title.loginConfig',
  },
  NAME: {
    id: 'idp.form.name',
  },
  TYPE: {
    id: 'idp.form.type',
  },
  DISPLAY_NAME: {
    id: 'idp.form.displayName',
  },
  TYPE_PLACEHOLDER: {
    id: 'idp.form.type.placeholder',
  },
  CATEGORY: {
    id: 'idp.form.category',
  },
  CATEGORY_PLACEHOLDER: {
    id: 'idp.form.category.placeholder',
  },
  NAME_PLACEHOLDER: {
    id: 'idp.form.name.placeholder',
  },
  DISPLAY_NAME_PLACEHOLDER: {
    id: 'idp.form.displayName.placeholder',
  },
  DESCRIPTION: {
    id: 'idp.form.description',
  },
  DESCRIPTION_PLACEHOLDER: {
    id: 'idp.form.description.placeholder',
  },
  AUTH_URL: {
    id: 'idp.form.authURL',
  },
};

const CreatePolicy: React.FC = () => {
  const intl = useIntl();
  const {
    states: { isEdit, formRef, getInfoLoading, createIdpLoading, updateIdpLoading },
    actions: { handleSubmit, handleReset, getIdpTypesByCategory },
  } = useIdentityProviderHook();

  return (
    <PageContainer fixedHeader>
      <ProCard layout="center" direction="column">
        <ProForm
          loading={getInfoLoading || createIdpLoading || updateIdpLoading}
          formRef={formRef}
          onFinish={handleSubmit}
          onReset={handleReset}
        >
          <ProForm.Group
            title={intl.formatMessage(INTL.BASIC_INFO)}
            titleStyle={{ marginBottom: '14px' }}
            align="center"
          >
            <ProFormText
              width="lg"
              required
              name="name"
              disabled={isEdit}
              fieldProps={{ autoComplete: 'off' }}
              label={intl.formatMessage(INTL.NAME)}
              tooltip={intl.formatMessage(BASIC_INTL.NAME_TIP)}
              placeholder={intl.formatMessage(INTL.NAME_PLACEHOLDER)}
              rules={[{ required: true }]}
            />
            <ProFormText
              width="lg"
              name="displayName"
              fieldProps={{ autoComplete: 'off' }}
              label={intl.formatMessage(INTL.DISPLAY_NAME)}
              tooltip={intl.formatMessage(BASIC_INTL.DISPLAY_NAME_TIP)}
              placeholder={intl.formatMessage(INTL.DISPLAY_NAME_PLACEHOLDER)}
            />
          </ProForm.Group>
          <ProForm.Group align="center">
            <ProFormSelect
              required
              name="category"
              width="lg"
              valueEnum={ProviderCategory}
              initialValue={ProviderCategory.OAuth}
              label={intl.formatMessage(INTL.CATEGORY)}
              placeholder={intl.formatMessage(INTL.CATEGORY_PLACEHOLDER)}
              rules={[{ required: true }]}
            />
            <ProFormDependency name={['category']}>
              {({ category }) => {
                let types = getIdpTypesByCategory(category);
                if (!types) {
                  types = [];
                }
                const opts = types.map((item) => ({
                  value: item,
                  label: item,
                }));
                return (
                  <ProFormSelect
                    required
                    name="type"
                    width="lg"
                    options={opts}
                    initialValue={IdentityProviderType.Gitee}
                    label={intl.formatMessage(INTL.TYPE)}
                    placeholder={intl.formatMessage(INTL.TYPE_PLACEHOLDER)}
                    rules={[{ required: true }]}
                  />
                );
              }}
            </ProFormDependency>
          </ProForm.Group>
          <ProFormDependency name={['type']}>
            {({ type }) => {
              if (type === IdentityProviderType.Gitee) {
                return <Gitee key={type} />;
              }
              if (type === IdentityProviderType.GitHub) {
                return <GitHub key={type} />;
              }
              if (type === IdentityProviderType.WeChatMiniProgram) {
                return <WeChatMiniProgram key={type} />;
              }
              if (type === IdentityProviderType.Coding) {
                return <Coding key={type} />;
              }
              return null;
            }}
          </ProFormDependency>
          <ProForm.Group
            align="center"
            title={intl.formatMessage(INTL.LOGIN_CONFIG)}
            titleStyle={{ marginBottom: '14px' }}
          >
            <ProFormSwitch label={'是否自动注册'} />
          </ProForm.Group>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};

export default CreatePolicy;
