import React, { useEffect, useMemo, useState } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProForm, ProFormText, FooterToolbar } from '@ant-design/pro-components';
import { App, Form, Card, Col, Row, Popover } from 'antd';
import { history, useIntl, useParams, useRequest } from '@umijs/max';
import { BASIC_INTL } from '@/constant';
import { getEmailTemplate } from '@/services/email/getEmailTemplate';
import { updateEmailTemplate } from '@/services/email/updateEmailTemplate';
import {
  createEmailTemplate,
  CreateEmailTemplateRequest,
} from '@/services/email/createEmailTemplate';
import { listEmailTemplates } from '@/services/email/listEmailTemplates';
import { listEmailTemplateCategories } from '@/services/email/listEmailTemplateCategories';
import { UpdateEmailTemplateRequest } from '@/services/email/updateEmailTemplate';
import MDEditor from '@uiw/react-md-editor';
import rehypeRaw from 'rehype-raw';
import { marked } from 'marked';
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

// 表单值类型定义
type EmailTemplateFormValues = {
  name: string;
  subject: string;
  content: string;
  displayName?: string;
  categoryId?: string;
  description?: string;
  status?: string;
};

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
  CARD_TITLE_CREATE: { id: 'email.form.create.title' },
  CARD_TITLE_EDIT: { id: 'email.form.edit.title' },
  NAME_REQUIRED: { id: 'email.form.validator.name.required' },
  CATEGORY_REQUIRED: { id: 'email.form.validator.category.required' },
  CONTENT_REQUIRED: { id: 'email.form.validator.content.required' },
  SUBJECT_REQUIRED: { id: 'email.form.validator.subject.required' },
  CREATE_FAILED: { id: 'email.operation.create.failed' },
  UPDATE_FAILED: { id: 'email.operation.update.failed' },
  VALIDATION_TITLE: { id: 'email.form.validation.title' },
};

const EmailFormPage: React.FC = () => {
  const intl = useIntl();
  const { message } = App.useApp();
  const { instanceId, name } = useParams<{ instanceId?: string; name?: string }>();
  const [form] = Form.useForm();
  const [error, setError] = useState<ErrorField[]>([]);

  const isEdit = !!name || !!instanceId;

  const fieldLabels = useMemo(() => {
    return {
      name: intl.formatMessage(EMAIL_INTL.NAME),
      subject: intl.formatMessage(EMAIL_INTL.SUBJECT),
      content: intl.formatMessage(EMAIL_INTL.CONTENT),
    };
  }, [intl]);

  const {
    data: template,
    run: runGet,
    loading: loadingGet,
  } = useRequest(getEmailTemplate, {
    manual: true,
    formatResult: (template) => template,
    onSuccess: (template) => {
      form.setFieldsValue(template);
    },
    onError: () => {
      // 静默处理，避免全局错误弹窗
    },
  });

  const { run: runQueryByInstanceId } = useRequest(listEmailTemplates, {
    manual: true,
    onSuccess: (list: any) => {
      const t = (list?.items || [])[0] as API.EmailTemplate | undefined;
      const targetName = t?.metadata?.name;
      if (targetName) {
        runGet(targetName, { skipErrorHandler: true });
      }
    },
  });

  const { data: categories, run: runListCategories } = useRequest(listEmailTemplateCategories, {
    manual: true,
    formatResult: (categories) => categories,
  });

  useEffect(() => {
    if (!isEdit) {
      // 对于创建页面，也需要加载分类列表
      runListCategories({});
      return;
    }
    if (name) {
      runGet(name, { skipErrorHandler: true });
      runListCategories({});
      return;
    }
    if (instanceId) {
      runQueryByInstanceId(
        { current: 1, pageSize: 1, fieldSelector: `metadata.instanceId=${instanceId}` },
        { skipErrorHandler: true },
      );
      runListCategories({});
    }
  }, [isEdit, name, instanceId, runGet, runQueryByInstanceId, runListCategories]);

  const { run: doCreate, loading: loadingCreate } = useRequest(createEmailTemplate, {
    manual: true,
    onSuccess: async () => {
      await message.success(intl.formatMessage(BASIC_INTL.CREATE_SUCCESS));
      history.push('/app-management/mail-template');
    },
    onError: (error: Error) => {
      message.error(error.message || intl.formatMessage(EMAIL_INTL.CREATE_FAILED));
    },
  });

  const { run: doUpdate, loading: loadingUpdate } = useRequest(updateEmailTemplate, {
    manual: true,
    onSuccess: async () => {
      await message.success(intl.formatMessage(BASIC_INTL.UPDATE_SUCCESS));
    },
    onError: (error: Error) => {
      message.error(error.message || intl.formatMessage(EMAIL_INTL.UPDATE_FAILED));
    },
  });

  // 获取 Custom 分类的 ID
  const customCategoryId = useMemo(() => {
    const customCategory = (categories as API.EmailTemplateCategoryList)?.items?.find(
      (cat: API.EmailTemplateCategory) => {
        const categoryName = cat.metadata?.name?.toLowerCase();
        return categoryName === 'custom';
      },
    );
    return customCategory?.metadata?.instanceId;
  }, [categories]);

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

  const onFinish = async (values: EmailTemplateFormValues) => {
    setError([]);
    try {
      // 创建一个副本来避免修改原始 values
      const processedValues = { ...values };

      // 将 Markdown 转换为 HTML（包含内嵌 HTML 原样保留）
      if (typeof processedValues.content === 'string') {
        const parsedContent = marked.parse(processedValues.content);
        processedValues.content =
          typeof parsedContent === 'string' ? parsedContent : await parsedContent;
      }

      // 对于创建操作，自动设置默认值
      if (!isEdit) {
        if (customCategoryId) {
          processedValues.categoryId = customCategoryId;
        }
        // 设置默认状态为 active
        processedValues.status = 'active';
        // 如果没有 displayName，使用 name 作为默认值
        if (!processedValues.displayName) {
          processedValues.displayName = processedValues.name;
        }

        // 确保所有必需字段都存在
        const createData: CreateEmailTemplateRequest = {
          name: processedValues.name,
          displayName: processedValues.displayName,
          subject: processedValues.subject,
          content: processedValues.content,
          categoryId: processedValues.categoryId,
          description: processedValues.description,
          status: processedValues.status,
        };

        await doCreate(createData);
      } else {
        const targetName = name ?? form.getFieldValue(['metadata', 'name']);
        if (targetName) {
          const updateData: UpdateEmailTemplateRequest = {
            displayName: processedValues.displayName,
            subject: processedValues.subject,
            content: processedValues.content,
            categoryId: processedValues.categoryId,
            description: processedValues.description,
            status: processedValues.status,
          };
          await doUpdate(targetName, updateData);
        }
      }
    } catch {
      // Error handled in onError callback
    }
  };

  const onFinishFailed = (errorInfo: FormErrorInfo) => {
    setError(errorInfo.errorFields);
  };

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
      loading={loadingGet || loadingCreate || loadingUpdate}
    >
      <PageContainer content={intl.formatMessage(EMAIL_INTL.PAGE_CONTENT)}>
        <Card
          title={
            isEdit
              ? intl.formatMessage(EMAIL_INTL.CARD_TITLE_EDIT)
              : intl.formatMessage(EMAIL_INTL.CARD_TITLE_CREATE)
          }
          variant="borderless"
        >
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
                  disabled={isEdit}
                  name={isEdit ? ['metadata', 'name'] : 'name'}
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage(EMAIL_INTL.NAME_REQUIRED),
                    },
                  ]}
                  placeholder={intl.formatMessage(EMAIL_INTL.PLACEHOLDER_NAME)}
                  tooltip={intl.formatMessage(BASIC_INTL.NAME_TIP)}
                />
              </Col>
              <Col lg={12} md={12} sm={24}>
                <ProFormText
                  label={fieldLabels.subject}
                  name="subject"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage(EMAIL_INTL.SUBJECT_REQUIRED),
                    },
                  ]}
                  placeholder={intl.formatMessage(EMAIL_INTL.PLACEHOLDER_SUBJECT)}
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
                    key={(template as any)?.metadata?.name || (isEdit ? 'edit' : 'create')}
                    height={400}
                    preview="live"
                    visibleDragbar={false}
                    previewOptions={{
                      rehypePlugins: [rehypeRaw],
                    }}
                    data-color-mode="light"
                    textareaProps={{
                      placeholder: intl.formatMessage(EMAIL_INTL.PLACEHOLDER_CONTENT),
                    }}
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

export default EmailFormPage;
