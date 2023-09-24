import { BASIC_INTL } from '@/constant';
import { FormattedMessage } from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, Form, message } from 'antd';
import React from 'react';
import { createOrganization, CreateOrganizationRequest } from '@/services/organization';

export type FormValueType = Partial<CreateOrganizationRequest>;

export type UpdateFormProps = {
  onFinish: (values: FormValueType) => Promise<boolean>;
};

const INTL = {
  TITLE: {
    id: 'organization.form.create.title',
  },
  NAME: {
    id: 'organization.form.name',
  },
  NAME_TIP: {
    id: 'organization.form.name.tip',
  },
  PLACEHOLDER_NAME: {
    id: 'organization.form.placeholder.name',
  },
  DISPLAY_NAME: {
    id: 'organization.form.displayName',
  },
  PLACEHOLDER_DISPLAY_NAME: {
    id: 'organization.form.placeholder.displayName',
  },
  DISPLAY_NAME_TIP: {
    id: 'organization.form.displayName.tip',
  },
  DESCRIPTION: {
    id: 'organization.form.description',
  },
  PLACEHOLDER_DESCRIPTION: {
    id: 'organization.form.placeholder.description',
  },
};

const CreateOrganization: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  const [form] = Form.useForm<CreateOrganizationRequest>();

  const handleAddOrganization = async (createReq: CreateOrganizationRequest) => {
    const hide = message.loading(intl.formatMessage(BASIC_INTL.CREATING));
    try {
      await createOrganization(createReq);
      hide();
      message.success(intl.formatMessage(BASIC_INTL.CREATE_SUCCESS));
      return true;
    } catch (error) {
      hide();
      return false;
    }
  };

  const handleSubmit = async (formData: FormValueType) => {
    const success = await handleAddOrganization(formData as CreateOrganizationRequest);
    if (success) {
      return props.onFinish(formData);
    }
    return false;
  };

  return (
    <ModalForm<CreateOrganizationRequest>
      onFinish={handleSubmit}
      modalProps={{
        destroyOnClose: true,
      }}
      width="480px"
      title={intl.formatMessage(INTL.TITLE)}
      form={form}
      autoComplete="off"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          <FormattedMessage {...BASIC_INTL.BTN_ADD} defaultMessage="New" />
        </Button>
      }
    >
      <ProForm.Group align="center">
        <ProFormText
          width="lg"
          name="name"
          fieldProps={{ autoComplete: 'off' }}
          label={intl.formatMessage(INTL.NAME)}
          placeholder={intl.formatMessage(INTL.PLACEHOLDER_NAME)}
          tooltip={intl.formatMessage(INTL.NAME_TIP)}
          rules={[{ required: true }]}
        />
      </ProForm.Group>
      <ProForm.Group align="center">
        <ProFormText
          width="lg"
          name="displayName"
          fieldProps={{ autoComplete: 'off' }}
          label={intl.formatMessage(INTL.DISPLAY_NAME)}
          placeholder={intl.formatMessage(INTL.PLACEHOLDER_DISPLAY_NAME)}
          tooltip={intl.formatMessage(INTL.DISPLAY_NAME_TIP)}
          rules={[{ required: false }]}
        />
      </ProForm.Group>
      <ProForm.Group align="center">
        <ProFormTextArea
          width="lg"
          name="description"
          fieldProps={{ autoComplete: 'off' }}
          label={intl.formatMessage(INTL.DESCRIPTION)}
          placeholder={intl.formatMessage(INTL.PLACEHOLDER_DESCRIPTION)}
          rules={[{ required: false }]}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default CreateOrganization;
