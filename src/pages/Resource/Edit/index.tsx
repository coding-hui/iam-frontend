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
import { useIntl, useParams, useRequest } from '@umijs/max';
import { App } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getResourceInfo } from '@/services/resource/getResourceInfo';
import { updateResource } from '@/services/resource/updateResource';
import { RESOURCE_TYPES_OPTIONS } from '@/constant/options';

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
  TYPE: {
    id: 'resource.type',
  },
  PLACEHOLDER_TYPE: {
    id: 'resource.type.placeholder',
  },
  UPDATE_SUCCESS: {
    id: 'resource.message.update.success',
  },
  BASIC_INFO: {
    id: 'resource.form.basicInfo',
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
  PLACEHOLDER_ACTION_DESCRIPTION: {
    id: 'resource.actions.description.placeholder',
  },
  ADD_ACTION: {
    id: 'resource.actions.add',
  },
};

const RESOURCE_TABS = {
  INFO: {
    tab: '基本信息',
    key: 'info',
  },
  ASSIGN: {
    tab: '权限规则',
    key: 'rules',
  },
};

const CreateResource: React.FC = () => {
  const intl = useIntl();
  const [currentTab, setCurrentTab] = useState('info');
  const { message } = App.useApp();
  const formRef = useRef<ProFormInstance<API.Resource>>();
  const actionsActRef = useRef<FormListActionType>();
  const { instanceId } = useParams();

  const isInfoTab = () => {
    return currentTab === RESOURCE_TABS.INFO.key;
  };

  const {
    run: doGetResourceInfo,
    data: resourceInfo,
    loading,
  } = useRequest(getResourceInfo, {
    manual: true,
    loadingDelay: 600,
    formatResult: (resourceInfo) => resourceInfo,
    onSuccess: (resourceInfo) => {
      formRef.current?.setFieldsValue(resourceInfo);
    },
  });

  useEffect(() => {
    if (instanceId) {
      doGetResourceInfo(instanceId);
    }
  }, []);

  const { run: doUpdateResource, loading: updateLoading } = useRequest(updateResource, {
    manual: true,
    onSuccess: async () => {
      await message.success(intl.formatMessage(INTL.UPDATE_SUCCESS));
    },
  });

  const handleSubmit = async () => {
    const values = await formRef.current?.validateFieldsReturnFormatValue?.();
    if (values && instanceId) {
      values.type = 'API';
      doUpdateResource(instanceId, values);
    }
  };

  const handleReset = () => {
    if (resourceInfo) {
      formRef.current?.setFieldsValue(resourceInfo);
    }
  };

  return (
    <PageContainer
      fixedHeader
      title={resourceInfo?.metadata.name || '-'}
      tabActiveKey={currentTab}
      onTabChange={(tab) => setCurrentTab(tab)}
      tabList={[RESOURCE_TABS.INFO]}
    >
      {isInfoTab() && (
        <ProCard layout="center" direction="column">
          <ProForm
            loading={updateLoading || loading}
            formRef={formRef}
            onReset={handleReset}
            onFinish={handleSubmit}
          >
            <ProForm.Group
              title={intl.formatMessage(INTL.BASIC_INFO)}
              titleStyle={{ marginBottom: '14px' }}
              align="center"
              size="small"
            >
              <ProFormText
                width="md"
                name={['metadata', 'name']}
                label={intl.formatMessage(INTL.NAME)}
                placeholder={intl.formatMessage(INTL.PLACEHOLDER_NAME)}
                rules={[{ required: true, message: intl.formatMessage(INTL.PLACEHOLDER_NAME) }]}
                transform={(val) => {
                  return { name: val };
                }}
              />
              <ProFormSelect.SearchSelect
                width="sm"
                name="type"
                mode="single"
                label={intl.formatMessage(INTL.TYPE)}
                placeholder={intl.formatMessage(INTL.PLACEHOLDER_TYPE)}
                options={RESOURCE_TYPES_OPTIONS}
                rules={[{ required: true, message: intl.formatMessage(INTL.PLACEHOLDER_TYPE) }]}
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
                rules={[{ required: false }]}
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
                    { required: true, message: intl.formatMessage(INTL.PLACEHOLDER_ACTION_NAME) },
                  ]}
                  convertValue={(val) => val && val.split(':')[1]}
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
      )}
    </PageContainer>
  );
};

export default CreateResource;
