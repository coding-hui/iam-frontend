import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormText,
  ProFormList,
  ProFormSelect,
  ProFormInstance,
  FormListActionType,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { message } from 'antd';
import React, { useRef } from 'react';
import { history, useRequest } from '@@/exports';
import { createResource } from '@/services/resource/createResource';
import { METHOD_OPTIONS } from '@/constant';

const INTL = {
  NAME: {
    id: 'resource.name',
  },
  PLACEHOLDER_NAME: {
    id: 'resource.name.placeholder',
  },
  API: {
    id: 'resource.api',
  },
  PLACEHOLDER_API: {
    id: 'resource.api.placeholder',
  },
  DESCRIPTION: {
    id: 'resource.description',
  },
  PLACEHOLDER_DESCRIPTION: {
    id: 'resource.description.placeholder',
  },
  METHOD: {
    id: 'resource.method',
  },
  PLACEHOLDER_METHOD: {
    id: 'resource.method.placeholder',
  },
  ACTION_TIP: {
    id: 'resource.actions.tip',
  },
  ACTION: {
    id: 'resource.actions',
  },
  PLACEHOLDER_ACTION_NAME: {
    id: 'resource.actions.name.placeholder',
  },
  REQUIRED_ACTION_NAME: {
    id: 'resource.actions.name.requiredMsg',
  },
  PLACEHOLDER_ACTION_DESCRIPTION: {
    id: 'resource.actions.description.placeholder',
  },
  ADD_ACTION: {
    id: 'resource.actions.add',
  },
  CREATE_SUCCESS: {
    id: 'resource.message.create.success',
  },
  BASIC_INFO: {
    id: 'resource.form.basicInfo',
  },
};

const CreateResource: React.FC = () => {
  const intl = useIntl();
  const [messageApi, contextHolder] = message.useMessage();
  const formRef = useRef<ProFormInstance<API.Policy>>();
  const actionsActRef = useRef<FormListActionType>();

  const { run: doCreateResource, loading: createLoading } = useRequest(createResource, {
    manual: true,
    onSuccess: async () => {
      await messageApi.success(intl.formatMessage(INTL.CREATE_SUCCESS));
      history.push(`/resource/list`);
    },
  });

  const handleSubmit = async () => {
    const values = await formRef.current?.validateFieldsReturnFormatValue?.();
    if (values) {
      values.type = 'API';
      doCreateResource(values);
    }
  };

  return (
    <>
      {contextHolder}
      <PageContainer fixedHeader>
        <ProCard layout="center" direction="column">
          <ProForm loading={createLoading} formRef={formRef} onFinish={handleSubmit}>
            <ProForm.Group
              title={intl.formatMessage(INTL.BASIC_INFO)}
              titleStyle={{ marginBottom: '14px' }}
              align="center"
            >
              <ProFormText
                width="md"
                name="name"
                label={intl.formatMessage(INTL.NAME)}
                placeholder={intl.formatMessage(INTL.PLACEHOLDER_NAME)}
                rules={[{ required: true, message: intl.formatMessage(INTL.PLACEHOLDER_NAME) }]}
              />
              <ProFormSelect.SearchSelect
                width="sm"
                name="method"
                mode="single"
                label={intl.formatMessage(INTL.METHOD)}
                placeholder={intl.formatMessage(INTL.PLACEHOLDER_METHOD)}
                options={METHOD_OPTIONS}
                rules={[{ required: true, message: intl.formatMessage(INTL.PLACEHOLDER_METHOD) }]}
                transform={(value) => {
                  return { method: value.value };
                }}
              />
            </ProForm.Group>
            <ProForm.Group align="center">
              <ProFormText
                width="xl"
                name="api"
                label={intl.formatMessage(INTL.API)}
                placeholder={intl.formatMessage(INTL.PLACEHOLDER_API)}
                rules={[{ required: true, message: intl.formatMessage(INTL.PLACEHOLDER_API) }]}
              />
            </ProForm.Group>
            <ProForm.Group align="center">
              <ProFormTextArea
                width="xl"
                name="description"
                label={intl.formatMessage(INTL.DESCRIPTION)}
                placeholder={intl.formatMessage(INTL.PLACEHOLDER_DESCRIPTION)}
                rules={[
                  { required: true, message: intl.formatMessage(INTL.PLACEHOLDER_DESCRIPTION) },
                ]}
              />
            </ProForm.Group>
            <ProFormList
              label={intl.formatMessage(INTL.ACTION)}
              name="actions"
              actionRef={actionsActRef}
              tooltip={intl.formatMessage(INTL.ACTION_TIP)}
              creatorButtonProps={{ creatorButtonText: intl.formatMessage(INTL.ADD_ACTION) }}
            >
              <ProForm.Group align="center" size="small">
                <ProFormText
                  width="sm"
                  name="name"
                  placeholder={intl.formatMessage(INTL.PLACEHOLDER_ACTION_NAME)}
                  rules={[
                    { required: true, message: intl.formatMessage(INTL.REQUIRED_ACTION_NAME) },
                  ]}
                  allowClear={false}
                />
                <ProFormText
                  width="sm"
                  name="description"
                  placeholder={intl.formatMessage(INTL.PLACEHOLDER_ACTION_DESCRIPTION)}
                  rules={[{ required: false }]}
                />
              </ProForm.Group>
            </ProFormList>
          </ProForm>
        </ProCard>
      </PageContainer>
    </>
  );
};

export default CreateResource;
