import React from 'react';
import {
  DrawerForm,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { App } from 'antd';
import { BASIC_INTL } from '@/constant';
import { createEmailTemplate } from '@/services/email/createEmailTemplate';
import { updateEmailTemplate } from '@/services/email/updateEmailTemplate';
import { listEmailTemplateCategories } from '@/services/email/listEmailTemplateCategories';
import MDEditor from '@uiw/react-md-editor';
import rehypeRaw from 'rehype-raw';
import { marked } from 'marked';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const INTL = {
  FORM_TITLE_CREATE: { id: 'email.form.create.title' },
  FORM_TITLE_EDIT: { id: 'email.form.edit.title' },
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
  REQUIRED: { id: 'email.form.validator.required' },
};

export type TemplateFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: API.EmailTemplate;
  onSuccess?: () => void;
};

const TemplateForm: React.FC<TemplateFormProps> = ({ open, onOpenChange, editing, onSuccess }) => {
  const intl = useIntl();
  const { message } = App.useApp();

  const { run: doCreate } = useRequest(createEmailTemplate, {
    manual: true,
    onSuccess: () => {
      message.success(intl.formatMessage(BASIC_INTL.CREATE_SUCCESS));
    },
  });

  const { run: doUpdate } = useRequest(updateEmailTemplate, {
    manual: true,
    onSuccess: () => {
      message.success(intl.formatMessage(BASIC_INTL.UPDATE_SUCCESS));
    },
  });

  const title = editing
    ? intl.formatMessage(INTL.FORM_TITLE_EDIT)
    : intl.formatMessage(INTL.FORM_TITLE_CREATE);

  const handleSubmit = async (values: any) => {
    // 将 Markdown 转换为 HTML（包含内嵌 HTML 原样保留）
    if (typeof values?.content === 'string') {
      values.content = marked.parse(values.content);
    }
    if (editing) {
      await doUpdate(editing.metadata.name, values);
    } else {
      await doCreate(values);
    }
    if (onSuccess) onSuccess();
  };

  return (
    <DrawerForm
      drawerProps={{ destroyOnClose: true }}
      title={title}
      open={open}
      onOpenChange={onOpenChange}
      initialValues={editing}
      onFinish={handleSubmit}
    >
      <ProFormText
        name="name"
        label={intl.formatMessage(INTL.NAME)}
        placeholder={intl.formatMessage(INTL.PLACEHOLDER_NAME)}
        rules={[{ required: !editing, message: intl.formatMessage(INTL.REQUIRED) }]}
        disabled={!!editing}
      />
      <ProFormText
        name="displayName"
        label={intl.formatMessage(INTL.DISPLAY_NAME)}
        placeholder={intl.formatMessage(INTL.PLACEHOLDER_DISPLAY_NAME)}
        rules={[{ required: true, message: intl.formatMessage(INTL.REQUIRED) }]}
      />
      <ProFormText
        name="subject"
        label={intl.formatMessage(INTL.SUBJECT)}
        placeholder={intl.formatMessage(INTL.PLACEHOLDER_SUBJECT)}
        rules={[{ required: true, message: intl.formatMessage(INTL.REQUIRED) }]}
      />
      <ProForm.Item
        name="content"
        label={intl.formatMessage(INTL.CONTENT)}
        rules={[{ required: true, message: intl.formatMessage(INTL.REQUIRED) }]}
        valuePropName="value"
      >
        <MDEditor previewOptions={{ rehypePlugins: [rehypeRaw] }} />
      </ProForm.Item>
      <ProFormSelect
        name="categoryId"
        label={intl.formatMessage(INTL.CATEGORY)}
        request={async () => {
          const res = await listEmailTemplateCategories({ current: 1, pageSize: 100 });
          return (res.items || []).map((c) => ({ label: c.displayName, value: c.metadata.name }));
        }}
      />
      <ProFormTextArea
        name="description"
        label={intl.formatMessage(INTL.DESCRIPTION)}
        placeholder={intl.formatMessage(INTL.PLACEHOLDER_DESCRIPTION)}
      />
    </DrawerForm>
  );
};

export default TemplateForm;
