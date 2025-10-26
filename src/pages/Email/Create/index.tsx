import React, { useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { App, theme } from 'antd';
import { history, useIntl, useParams, useRequest } from '@umijs/max';
import { ProForm, ProFormText, ProCard } from '@ant-design/pro-components';
import { BASIC_INTL } from '@/constant';
import { getEmailTemplate } from '@/services/email/getEmailTemplate';
import { updateEmailTemplate } from '@/services/email/updateEmailTemplate';

import { createEmailTemplate } from '@/services/email/createEmailTemplate';
import { listEmailTemplates } from '@/services/email/listEmailTemplates';
import MDEditor from '@uiw/react-md-editor';
import rehypeRaw from 'rehype-raw';
import { marked } from 'marked';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const INTL = {
  NAME: { id: 'email.form.name' },
  DISPLAY_NAME: { id: 'email.form.displayName' },
  SUBJECT: { id: 'email.form.subject' },
  CONTENT: { id: 'email.form.content' },
  PLACEHOLDER_CONTENT: { id: 'email.form.placeholder.content' },
  PLACEHOLDER_NAME: { id: 'email.form.placeholder.name' },
  PLACEHOLDER_DISPLAY_NAME: { id: 'email.form.placeholder.displayName' },
  PLACEHOLDER_SUBJECT: { id: 'email.form.placeholder.subject' },
  REQUIRED: { id: 'email.form.validator.required' },
  PAGE_TITLE_CREATE: { id: 'email.form.create.title' },
  PAGE_TITLE_EDIT: { id: 'email.form.edit.title' },
};

const EmailFormPage: React.FC = () => {
  const intl = useIntl();
  const { message } = App.useApp();
  const { instanceId, name } = useParams<{ instanceId?: string; name?: string }>();
  const formRef = useRef<any>();
  const { token } = theme.useToken();

  const isEdit = !!name || !!instanceId;

  const {
    data: template,
    run: runGet,
    loading: loadingGet,
  } = useRequest(getEmailTemplate, {
    manual: true,
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

  useEffect(() => {
    if (!isEdit) return;
    if (name) {
      runGet(name, { skipErrorHandler: true });
      return;
    }
    if (instanceId) {
      runQueryByInstanceId(
        { current: 1, pageSize: 1, fieldSelector: `metadata.instanceId=${instanceId}` },
        { skipErrorHandler: true },
      );
    }
  }, [isEdit, name, instanceId]);

  useEffect(() => {
    if (template && formRef.current) {
      const t = template as API.EmailTemplate;
      formRef.current?.setFieldsValue({
        name: t.metadata?.name,
        displayName: t.displayName,
        subject: t.subject,
        content: t.content,
      });
    }
  }, [template]);

  const { run: doCreate, loading: loadingCreate } = useRequest(createEmailTemplate, {
    manual: true,
    onSuccess: async () => {
      await message.success(intl.formatMessage(BASIC_INTL.CREATE_SUCCESS));
      history.push('/app-management/mail-template');
    },
  });

  const { run: doUpdate, loading: loadingUpdate } = useRequest(updateEmailTemplate, {
    manual: true,
    onSuccess: async () => {
      await message.success(intl.formatMessage(BASIC_INTL.UPDATE_SUCCESS));
    },
  });

  const handleSubmit = async (values: any) => {
    if (typeof values?.content === 'string') {
      values.content = marked.parse(values.content);
    }
    if (isEdit) {
      const targetName = name ?? formRef.current?.getFieldValue('name');
      if (targetName) {
        await doUpdate(targetName, values);
        return;
      }
    }
    await doCreate(values);
  };

  return (
    <PageContainer
      fixedHeader
      header={{
        title: isEdit
          ? intl.formatMessage(INTL.PAGE_TITLE_EDIT)
          : intl.formatMessage(INTL.PAGE_TITLE_CREATE),
      }}
      style={{ background: token.colorBgLayout }}
    >
      <ProCard
        bordered={false}
        style={{ background: token.colorBgContainer }}
        bodyStyle={{ padding: 24 }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <ProForm
            key={(template as any)?.metadata?.name || (isEdit ? 'edit' : 'create')}
            formRef={formRef}
            loading={loadingGet || loadingCreate || loadingUpdate}
            onFinish={handleSubmit}
            layout="vertical"
            grid
            rowProps={{ gutter: 16 }}
            colProps={{ span: 12 }}
            submitter={{ resetButtonProps: { style: { display: 'none' } } }}
            initialValues={
              template
                ? {
                    name: (template as any)?.metadata?.name,
                    subject: (template as any)?.subject,
                    content: (template as any)?.content,
                  }
                : undefined
            }
          >
            <ProFormText
              name="name"
              label={intl.formatMessage(INTL.NAME)}
              placeholder={intl.formatMessage(INTL.PLACEHOLDER_NAME)}
              tooltip={intl.formatMessage(BASIC_INTL.NAME_TIP)}
              rules={[{ required: !isEdit, message: intl.formatMessage(INTL.REQUIRED) }]}
              disabled={isEdit}
              colProps={{ span: 12 }}
              fieldProps={{ style: { width: '100%' } }}
            />

            <ProFormText
              name="subject"
              label={intl.formatMessage(INTL.SUBJECT)}
              placeholder={intl.formatMessage(INTL.PLACEHOLDER_SUBJECT)}
              rules={[{ required: true, message: intl.formatMessage(INTL.REQUIRED) }]}
              colProps={{ span: 12 }}
              fieldProps={{ style: { width: '100%' } }}
            />
            <ProForm.Item
              name="content"
              label={intl.formatMessage(INTL.CONTENT)}
              rules={[{ required: true, message: intl.formatMessage(INTL.REQUIRED) }]}
              valuePropName="value"
              colProps={{ span: 24 }}
            >
              <MDEditor
                key={(template as any)?.metadata?.name || (isEdit ? 'edit' : 'create')}
                height={360}
                preview="edit"
                previewOptions={{ rehypePlugins: [rehypeRaw] }}
                textareaProps={{ placeholder: intl.formatMessage(INTL.PLACEHOLDER_CONTENT) }}
              />
            </ProForm.Item>
          </ProForm>
        </div>
      </ProCard>
    </PageContainer>
  );
};

export default EmailFormPage;
