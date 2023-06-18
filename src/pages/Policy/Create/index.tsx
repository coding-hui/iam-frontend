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
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { message } from 'antd';
import React, { useRef } from 'react';
import { POLICY_EFFECT, POLICY_EFFECT_VALUE_ENUM } from '@/constant';
import { listResources } from '@/services/resource/listResources';
import { SubjectTransfer } from '@/components';
import { useRequest } from '@@/exports';
import { createPolicy } from '@/services/policy/createPolicy';

const INTL = {
  TABLE_TITLE: {
    id: 'policy.table.title',
  },
  NAME: {
    id: 'policy.name',
  },
  PLACEHOLDER_NAME: {
    id: 'policy.name.placeholder',
  },
  TYPE: {
    id: 'policy.type',
  },
  PLACEHOLDER_TYPE: {
    id: 'policy.type.placeholder',
  },
  EFFECT: {
    id: 'policy.effect',
  },
  PLACEHOLDER_EFFECT: {
    id: 'policy.effect.placeholder',
  },
  ACTIONS: {
    id: 'policy.actions',
  },
  PLACEHOLDER_ACTIONS: {
    id: 'policy.actions.placeholder',
  },
  RULES: {
    id: 'policy.rules',
  },
  PLACEHOLDER_RULES: {
    id: 'policy.rules.placeholder',
  },
  DESCRIPTION: {
    id: 'policy.description',
  },
  PLACEHOLDER_DESCRIPTION: {
    id: 'policy.description.placeholder',
  },
  RESOURCES: {
    id: 'policy.resources',
  },
  PLACEHOLDER_RESOURCES: {
    id: 'policy.resources.placeholder',
  },
  SUBJECTS: {
    id: 'policy.subjects',
  },
  PLACEHOLDER_SUBJECTS: {
    id: 'policy.subjects.placeholder',
  },
  CREATE_SUCCESS: {
    id: 'policy.message.create.success',
  },
};

const EditRole: React.FC = () => {
  const intl = useIntl();
  const [messageApi, contextHolder] = message.useMessage();
  const formRef = useRef<ProFormInstance<API.Policy>>();
  const actionsActRef = useRef<FormListActionType>();

  const handleSearchResources = async () => {
    const res = await listResources({});
    return res.list.map((item) => {
      return {
        key: item.metadata.instanceId,
        label: item.metadata.name,
        value: item.metadata.instanceId,
      };
    });
  };

  const handleSelectSubjects = async (values: string[]) => {
    const subjects = values.map((item) => {
      return {
        label: item,
        value: item,
        key: item,
      };
    });
    formRef.current?.setFieldValue('subjects', subjects);
    return true;
  };

  const getSelectUsers = () => {
    let val = formRef.current?.getFieldFormatValueObject?.('subjects');
    if (val && val.subjects) {
      return val.subjects.filter((item) => {
        return item.startsWith('user');
      });
    }
    return [];
  };

  const getSelectRoles = () => {
    let val = formRef.current?.getFieldFormatValueObject?.('subjects');
    if (val && val.subjects) {
      return val.subjects.filter((item) => {
        return item.startsWith('role');
      });
    }
    return [];
  };

  const { run: doCreatePolicy, loading: createPolicyLoading } = useRequest(createPolicy, {
    manual: true,
    onSuccess: () => {
      messageApi.success(intl.formatMessage(INTL.CREATE_SUCCESS));
    },
  });

  const handleSubmit = async () => {
    const values = await formRef.current?.validateFieldsReturnFormatValue?.();
    if (values) {
      doCreatePolicy(values);
    }
  };

  return (
    <>
      {contextHolder}
      <PageContainer fixedHeader>
        <ProCard layout="center" direction="column">
          <ProForm loading={createPolicyLoading} formRef={formRef} onFinish={handleSubmit}>
            <ProForm.Group align="center">
              <ProFormText
                width="md"
                name="name"
                label={intl.formatMessage(INTL.NAME)}
                placeholder={intl.formatMessage(INTL.PLACEHOLDER_NAME)}
                rules={[{ required: true }]}
              />
              <ProFormSelect.SearchSelect
                width="sm"
                name="resources"
                mode="single"
                label={intl.formatMessage(INTL.RESOURCES)}
                placeholder={intl.formatMessage(INTL.PLACEHOLDER_RESOURCES)}
                request={(params) => handleSearchResources(params)}
                debounceTime={600}
                rules={[{ required: true }]}
                transform={(value) => {
                  return { resources: [value.value] };
                }}
              />
            </ProForm.Group>
            <ProForm.Group align="center" size="small">
              <ProFormSelect.SearchSelect
                width="xl"
                name="subjects"
                label={intl.formatMessage(INTL.SUBJECTS)}
                placeholder={intl.formatMessage(INTL.PLACEHOLDER_SUBJECTS)}
                rules={[{ required: true }]}
                showSearch
                transform={(values: { value: string }[]) => {
                  return {
                    subjects: [
                      ...values.map((item) => {
                        return item.value;
                      }),
                    ],
                  };
                }}
                addonAfter={
                  <SubjectTransfer
                    key="subjectTransfer"
                    doGetTargetUsers={() => getSelectUsers()}
                    doGetTargetRoles={() => getSelectRoles()}
                    onOk={(values) => handleSelectSubjects(values)}
                    okText="选择主体"
                  />
                }
              />
            </ProForm.Group>
            <ProForm.Group align="center">
              <ProFormRadio.Group
                name="effect"
                valueEnum={POLICY_EFFECT_VALUE_ENUM}
                initialValue={POLICY_EFFECT.ALLOW}
                label={intl.formatMessage(INTL.EFFECT)}
                placeholder={intl.formatMessage(INTL.PLACEHOLDER_EFFECT)}
                rules={[{ required: true }]}
              />
            </ProForm.Group>
            <ProForm.Group align="center">
              <ProFormRadio.Group
                name="allowAll"
                width="md"
                label={intl.formatMessage(INTL.ACTIONS)}
                initialValue={false}
                options={[
                  {
                    label: '全部操作',
                    value: true,
                  },
                  {
                    label: '特定操作',
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
            {/*<ProForm.Group align="center">*/}
            {/*  <ProFormTextArea*/}
            {/*    width="xl"*/}
            {/*    name="description"*/}
            {/*    label={intl.formatMessage(INTL.DESCRIPTION)}*/}
            {/*    placeholder={intl.formatMessage(INTL.PLACEHOLDER_DESCRIPTION)}*/}
            {/*    rules={[{ required: false }]}*/}
            {/*  />*/}
            {/*</ProForm.Group>*/}
            <ProFormDependency name={['allowAll', 'resources']}>
              {({ allowAll, resources }) => {
                const addonBeforeText = resources ? `${resources}:` : '';
                return allowAll !== undefined && !allowAll ? (
                  <ProFormList
                    label={intl.formatMessage(INTL.RULES)}
                    required
                    actionRef={actionsActRef}
                    creatorButtonProps={{ hidden: allowAll, creatorButtonText: '添加授权规则' }}
                    name="actions"
                    min={1}
                    initialValue={[{ name: '', description: '' }]}
                  >
                    <ProForm.Group align="center" size="small">
                      <ProFormText
                        addonBefore={addonBeforeText}
                        width="sm"
                        name="name"
                        placeholder="授权规则"
                        rules={[{ required: true }]}
                        allowClear={false}
                      />
                      <ProFormText
                        width="sm"
                        name="description"
                        placeholder="描述"
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

export default EditRole;
