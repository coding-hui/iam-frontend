import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormText,
  ProFormList,
  ProFormSelect,
  ProFormRadio,
  ProFormDependency,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Checkbox, Col, Row } from 'antd';
import React from 'react';
import { POLICY_EFFECT, POLICY_EFFECT_VALUE_ENUM } from '@/constant';
import { SubjectTransfer } from '@/components';
import usePolicyHook from '@/pages/Policy/Create/_hooks';

const INTL = {
  BASIC_INFO: {
    id: 'policy.form.title.basicInfo',
  },
  SUBJECT_INFO: {
    id: 'policy.form.title.subjectInfo',
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
};

const CreatePolicy: React.FC = () => {
  const intl = useIntl();
  const {
    states: { isEdit, formRef, getInfoLoading, createPolicyLoading, updatePolicyLoading },
    actions: {
      handleSelectSubjects,
      handleSearchResources,
      getSelectUsers,
      getSelectRoles,
      handleSubmit,
      handleReset,
    },
  } = usePolicyHook();

  return (
    <PageContainer fixedHeader>
      <ProCard layout="center" direction="column">
        <ProForm
          loading={getInfoLoading || createPolicyLoading || updatePolicyLoading}
          formRef={formRef}
          onFinish={handleSubmit}
          onReset={handleReset}
        >
          <ProForm.Group
            title={intl.formatMessage(INTL.BASIC_INFO)}
            titleStyle={{ marginBottom: '14px' }}
            align="center"
            direction="vertical"
          >
            <ProFormText
              width="xl"
              name="name"
              disabled={isEdit}
              label={intl.formatMessage(INTL.NAME)}
              placeholder={intl.formatMessage(INTL.PLACEHOLDER_NAME)}
              rules={[{ required: true }]}
            />
            <ProFormTextArea
              width="xl"
              name="description"
              label={intl.formatMessage(INTL.DESCRIPTION)}
              placeholder={intl.formatMessage(INTL.PLACEHOLDER_DESCRIPTION)}
              rules={[{ required: false }]}
            />
          </ProForm.Group>
          <ProForm.Group
            title={intl.formatMessage(INTL.SUBJECT_INFO)}
            titleStyle={{ marginBottom: '14px' }}
            align="center"
          >
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
          <ProFormList
            name="statements"
            min={1}
            creatorButtonProps={{
              position: 'bottom',
              creatorButtonText: '添加授权规则',
            }}
            creatorRecord={{
              effect: POLICY_EFFECT.ALLOW,
              allowAll: true,
              resourceIdentifier: '*',
            }}
            initialValue={[{ effect: POLICY_EFFECT.ALLOW, allowAll: true }]}
            itemRender={({ listDom, action }, { index }) => (
              <ProCard
                hoverable
                bordered
                style={{ marginBlockEnd: 8 }}
                title={`#${index + 1}`}
                extra={action}
                bodyStyle={{ paddingBlockEnd: 0 }}
              >
                {listDom}
              </ProCard>
            )}
          >
            <ProForm.Group titleStyle={{ marginBottom: '14px' }} align="center">
              <ProFormRadio.Group
                name="effect"
                valueEnum={POLICY_EFFECT_VALUE_ENUM}
                initialValue={POLICY_EFFECT.ALLOW}
                label={intl.formatMessage(INTL.EFFECT)}
                placeholder={intl.formatMessage(INTL.PLACEHOLDER_EFFECT)}
                rules={[{ required: true }]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormSelect.SearchSelect
                width="sm"
                name="selectedResource"
                mode="single"
                label={intl.formatMessage(INTL.RESOURCES)}
                placeholder={intl.formatMessage(INTL.PLACEHOLDER_RESOURCES)}
                request={(params) => handleSearchResources(params)}
                debounceTime={599}
                rules={[{ required: true }]}
              />
              <ProFormDependency name={['selectedResource']}>
                {({ selectedResource }) => {
                  return (
                    selectedResource &&
                    selectedResource.name && (
                      <ProFormText
                        width="sm"
                        name="resourceIdentifier"
                        label="资源标识符"
                        initialValue="*"
                        addonBefore={`${selectedResource.value}:`}
                        placeholder={intl.formatMessage(INTL.PLACEHOLDER_NAME)}
                        rules={[{ required: true }]}
                      />
                    )
                  );
                }}
              </ProFormDependency>
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
              />
            </ProForm.Group>
            <ProFormDependency name={['selectedResource', 'allowAll']}>
              {({ selectedResource, allowAll }) => {
                if (allowAll || !selectedResource || !selectedResource.actions) {
                  return <></>;
                }
                return (
                  <ProForm.Item name="actions">
                    <Checkbox.Group style={{ width: '100%' }}>
                      <Row>
                        {selectedResource.actions.map((act: API.Action) => {
                          return (
                            <Col key={act.name} span={6}>
                              <Checkbox value={act.name} key={`${act.name}-act`}>
                                {act.name}
                              </Checkbox>
                            </Col>
                          );
                        })}
                      </Row>
                    </Checkbox.Group>
                  </ProForm.Item>
                );
              }}
            </ProFormDependency>
          </ProFormList>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};

export default CreatePolicy;
