import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormText,
  ProFormList,
  ProFormSelect,
  ProFormRadio,
  ProFormDependency,
  ProFormInstance,
  FormListActionType,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { message } from 'antd';
import React, { useRef } from 'react';
import { history, useRequest } from '@@/exports';
import { createResource } from '@/services/resource/createResource';

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
  ACTIONS: {
    id: 'resource.actions',
  },
  PLACEHOLDER_ACTIONS: {
    id: 'resource.actions.placeholder',
  },
  RULES: {
    id: 'resource.rules',
  },
  PLACEHOLDER_RULES: {
    id: 'resource.rules.placeholder',
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
  ACTION_NAME: {
    id: 'resource.action.name',
  },
  ACTION_DESCRIPTION: {
    id: 'resource.action.description',
  },
  CREATE_SUCCESS: {
    id: 'resource.message.create.success',
  },
  BASIC_INFO: {
    id: 'resource.form.basicInfo',
  },
  ACTION_INFO: {
    id: 'resource.form.actionInfo',
  },
  ADD_ACTION: {
    id: 'resource.form.action.add',
  },
  ALLOW_ALL: {
    id: 'policy.type.allowAll',
  },
  SPECIFIC: {
    id: 'policy.type.specific',
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
                rules={[{ required: true }]}
              />
              <ProFormSelect.SearchSelect
                width="sm"
                name="method"
                mode="single"
                label={intl.formatMessage(INTL.METHOD)}
                placeholder={intl.formatMessage(INTL.PLACEHOLDER_METHOD)}
                options={[
                  {
                    label: 'GET',
                    value: 'GET',
                  },
                  {
                    label: 'POST',
                    value: 'POST',
                  },
                  {
                    label: 'PUT',
                    value: 'PUT',
                  },
                  {
                    label: 'DELETE',
                    value: 'DELETE',
                  },
                  {
                    label: 'ANY',
                    value: '*',
                  },
                ]}
                rules={[{ required: true }]}
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
                rules={[{ required: true }]}
              />
            </ProForm.Group>
            <ProForm.Group align="center">
              <ProFormTextArea
                width="xl"
                name="description"
                label={intl.formatMessage(INTL.DESCRIPTION)}
                placeholder={intl.formatMessage(INTL.PLACEHOLDER_DESCRIPTION)}
                rules={[{ required: false }]}
              />
            </ProForm.Group>
            <ProForm.Group
              title={intl.formatMessage(INTL.ACTION_INFO)}
              titleStyle={{ marginBottom: '14px' }}
              align="center"
            >
              <ProFormRadio.Group
                name="allowAll"
                width="md"
                label={intl.formatMessage(INTL.ACTIONS)}
                initialValue={false}
                options={[
                  {
                    label: intl.formatMessage(INTL.ALLOW_ALL),
                    value: true,
                  },
                  {
                    label: intl.formatMessage(INTL.SPECIFIC),
                    value: false,
                  },
                ]}
                rules={[{ required: true }]}
                transform={(allowAll) => {
                  if (allowAll) {
                    return { actions: [{ name: '*', description: '' }] };
                  }
                  return allowAll;
                }}
              />
            </ProForm.Group>
            <ProFormDependency name={['allowAll', 'resources']}>
              {({ allowAll, resources }) => {
                const addonBeforeText = resources ? `${resources}:` : '';
                return allowAll !== undefined && !allowAll ? (
                  <ProFormList
                    label={intl.formatMessage(INTL.RULES)}
                    name="actions"
                    required
                    actionRef={actionsActRef}
                    creatorButtonProps={{
                      hidden: allowAll,
                      creatorButtonText: intl.formatMessage(INTL.ADD_ACTION),
                    }}
                    min={1}
                    initialValue={[{ name: '', description: '' }]}
                  >
                    <ProForm.Group align="center" size="small">
                      <ProFormText
                        addonBefore={addonBeforeText}
                        width="sm"
                        name="name"
                        placeholder={intl.formatMessage(INTL.ACTION_NAME)}
                        rules={[{ required: true }]}
                        allowClear={false}
                      />
                      <ProFormText
                        width="sm"
                        name="description"
                        placeholder={intl.formatMessage(INTL.ACTION_DESCRIPTION)}
                        rules={[{ required: false }]}
                      />
                    </ProForm.Group>
                  </ProFormList>
                ) : (
                  <></>
                );
              }}
            </ProFormDependency>
          </ProForm>
        </ProCard>
      </PageContainer>
    </>
  );
};

export default CreateResource;
