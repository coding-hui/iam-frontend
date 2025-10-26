import React, { useEffect, useMemo, useState } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProForm,
  ProFormSelect,
  ProFormText,
  FooterToolbar,
} from '@ant-design/pro-components';
import { App, Form, Card, Col, Row, Popover } from 'antd';
import { useIntl, useParams, useRequest } from '@umijs/max';
import { BASIC_INTL } from '@/constant';
import { getEmailTemplate } from '@/services/email/getEmailTemplate';
import { updateEmailTemplate } from '@/services/email/updateEmailTemplate';
import { listEmailTemplateCategories } from '@/services/email/listEmailTemplateCategories';
import MDEditor from '@uiw/react-md-editor';
import rehypeRaw from 'rehype-raw';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

type InternalNamePath = (string | number)[];

interface ErrorField {
  name: InternalNamePath;
  errors: string[];
}

interface FormErrorInfo {
  errorFields: ErrorField[];
  outOfDate: boolean;
  values: Record<string, unknown>;
}

const EMAIL_INTL = {
  PAGE_CONTENT: { id: 'email.page.content' },
  BASIC_INFO: { id: 'email.form.basicInfo' },
  CONTENT_INFO: { id: 'email.form.contentInfo' },
  NAME: { id: 'email.form.name' },
  DISPLAY_NAME: { id: 'email.form.displayName' },
  SUBJECT: { id: 'email.form.subject' },
  CONTENT: { id: 'email.form.content' },
  CATEGORY: { id: 'email.form.category' },
  DESCRIPTION: { id: 'email.form.description' },
  PLACEHOLDER_NAME: { id: 'email.form.placeholder.name' },
  PLACEHOLDER_DISPLAY_NAME: { id: 'email.form.placeholder.displayName' },
  PLACEHOLDER_SUBJECT: { id: 'email.form.placeholder.subject' },
  PLACEHOLDER_CONTENT: { id: 'email.form.placeholder.content' },
  PLACEHOLDER_DESCRIPTION: { id: 'email.form.placeholder.description' },
  PLACEHOLDER_CATEGORY: { id: 'email.form.placeholder.category' },
  REQUIRED: { id: 'email.form.validator.required' },
  CARD_TITLE: { id: 'email.edit.card.title' },
  NAME_REQUIRED: { id: 'email.form.validator.name.required' },
  CATEGORY_REQUIRED: { id: 'email.form.validator.category.required' },
  CONTENT_REQUIRED: { id: 'email.form.validator.content.required' },
  UPDATE_FAILED: { id: 'email.operation.update.failed' },
  VALIDATION_TITLE: { id: 'email.form.validation.title' },
};

const EditEmailTemplate: React.FC = () => {
  const intl = useIntl();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { instanceId } = useParams<{ instanceId?: string }>();
  const [error, setError] = useState<ErrorField[]>([]);

  const fieldLabels = useMemo(() => {
    return {
      name: intl.formatMessage(EMAIL_INTL.NAME),
      content: intl.formatMessage(EMAIL_INTL.CONTENT),
      category: intl.formatMessage(EMAIL_INTL.CATEGORY),
    };
  }, []);

  const { run: runGet, loading: loadingGet } = useRequest(getEmailTemplate, {
    manual: true,
    formatResult: (template) => template,
    onSuccess: (template) => {
      form.setFieldsValue(template);
    },
  });

  const { run: runUpdate } = useRequest(updateEmailTemplate, {
    manual: true,
    onSuccess: () => {
      message.success(intl.formatMessage(BASIC_INTL.UPDATE_SUCCESS));
    },
    onError: (error: Error) => {
      message.error(error.message || intl.formatMessage(EMAIL_INTL.UPDATE_FAILED));
    },
  });

  const { data: categories, run: runListCategories } = useRequest(listEmailTemplateCategories, {
    manual: true,
    formatResult: (categories) => categories,
  });

  useEffect(() => {
    if (instanceId) {
      runGet(instanceId);
      runListCategories({});
    }
  }, [instanceId, runGet, runListCategories]);

  const getErrorInfo = (errors: ErrorField[]): React.ReactNode => {
    const errorCount = errors.filter((item) => item.errors.length > 0).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }
      const key = err.name[0] as string;
      const fieldLabel = fieldLabels[key as keyof typeof fieldLabels];
      return (
        <li
          key={key}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '4px 0',
            cursor: 'pointer',
          }}
          onClick={() => scrollToField(key)}
        >
          <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
          <div style={{ flex: 1 }}>{err.errors[0]}</div>
          <div style={{ color: '#999', fontSize: '12px' }}>{fieldLabel}</div>
        </li>
      );
    });
    return (
      <span style={{ color: '#ff4d4f', display: 'flex', alignItems: 'center' }}>
        <Popover
          title={intl.formatMessage(EMAIL_INTL.VALIDATION_TITLE)}
          content={<ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>{errorList}</ul>}
          trigger="click"
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger?.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          }}
        >
          <CloseCircleOutlined style={{ marginRight: 4 }} />
        </Popover>
        {errorCount}
      </span>
    );
  };

  const onFinish = async (values: Record<string, any>) => {
    setError([]);
    try {
      await runUpdate(instanceId!, values);
    } catch {
      // Error handled in onError callback
    }
  };

  const onFinishFailed = (errorInfo: FormErrorInfo) => {
    setError(errorInfo.errorFields);
  };

  const categoryOptions =
    (categories as API.EmailTemplateCategoryList)?.items?.map((cat: API.EmailTemplateCategory) => ({
      label: cat.displayName || cat.metadata?.name,
      value: cat.metadata?.instanceId,
    })) || [];

  return (
    <ProForm
      layout="vertical"
      requiredMark
      variant="filled"
      submitter={{
        render: (_props, dom) => {
          return (
            <FooterToolbar>
              {getErrorInfo(error)}
              {dom}
            </FooterToolbar>
          );
        },
      }}
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      loading={loadingGet}
    >
      <PageContainer content={intl.formatMessage(EMAIL_INTL.PAGE_CONTENT)}>
        <Card title={intl.formatMessage(EMAIL_INTL.CARD_TITLE)} variant="borderless">
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 24px',
            }}
          >
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <ProFormText
                  label={fieldLabels.name}
                  disabled
                  name={['metadata', 'name']}
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage(EMAIL_INTL.NAME_REQUIRED),
                    },
                  ]}
                  placeholder={intl.formatMessage(EMAIL_INTL.PLACEHOLDER_NAME)}
                />
              </Col>
              <Col lg={12} md={12} sm={24}>
                <ProFormSelect
                  label={fieldLabels.category}
                  name="categoryId"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage(EMAIL_INTL.CATEGORY_REQUIRED),
                    },
                  ]}
                  options={categoryOptions}
                  placeholder={intl.formatMessage(EMAIL_INTL.PLACEHOLDER_CATEGORY)}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <ProForm.Item
                  label={fieldLabels.content}
                  name="content"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage(EMAIL_INTL.CONTENT_REQUIRED),
                    },
                  ]}
                >
                  <MDEditor
                    height={400}
                    preview="live"
                    visibleDragbar={false}
                    previewOptions={{
                      rehypePlugins: [rehypeRaw],
                    }}
                    data-color-mode="light"
                  />
                </ProForm.Item>
              </Col>
            </Row>
          </div>
        </Card>
      </PageContainer>
    </ProForm>
  );
};

export default EditEmailTemplate;
