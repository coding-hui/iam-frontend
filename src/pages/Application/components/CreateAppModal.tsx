import React from 'react';
import { useIntl } from '@umijs/max';
import { Button, Form, message } from 'antd';
import { BASIC_INTL } from '@/constant';
import { FormattedMessage } from '@umijs/max';
import { PlusOutlined } from '@ant-design/icons';
import { createApplication, CreateApplicationRequest } from '@/services/application';
import { ModalForm, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { AppType } from '@/enums';

export type Props = {
  onFinish: (values: CreateApplicationRequest) => Promise<boolean>;
};

const INTL = {
  TITLE: {
    id: 'app.form.create.title',
  },
  LOGIN_URL: {
    id: 'app.form.loginUrl',
  },
  NAME: {
    id: 'app.form.name',
  },
  NAME_PLACEHOLDER: {
    id: 'idp.form.name.placeholder',
  },
  DISPLAY_NAME: {
    id: 'app.form.displayName',
  },
  DISPLAY_NAME_PLACEHOLDER: {
    id: 'idp.form.displayName.placeholder',
  },
  DESCRIPTION: {
    id: 'idp.form.description',
  },
  DESCRIPTION_PLACEHOLDER: {
    id: 'idp.form.description.placeholder',
  },
  TYPE: {
    id: 'idp.form.type',
  },
  TYPE_PLACEHOLDER: {
    id: 'idp.form.type.placeholder',
  },
};

const CreateAppModal: React.FC<Props> = (props) => {
  const intl = useIntl();
  const [form] = Form.useForm<CreateApplicationRequest>();

  const handleAdd = async (createReq: CreateApplicationRequest) => {
    const hide = message.loading(intl.formatMessage(BASIC_INTL.CREATING));
    try {
      await createApplication(createReq);
      hide();
      message.success(intl.formatMessage(BASIC_INTL.CREATE_SUCCESS));
      return true;
    } catch (error) {
      hide();
      return false;
    }
  };

  const handleSubmit = async (formData: CreateApplicationRequest) => {
    const success = await handleAdd(formData as CreateApplicationRequest);
    if (success) {
      return props.onFinish(formData);
    }
    return false;
  };

  return (
    <ModalForm<CreateApplicationRequest>
      onFinish={handleSubmit}
      modalProps={{
        destroyOnClose: true,
      }}
      title={intl.formatMessage(INTL.TITLE)}
      form={form}
      width="480px"
      autoComplete="off"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          <FormattedMessage {...BASIC_INTL.BTN_ADD} />
        </Button>
      }
    >
      <ProForm.Group align="center">
        <ProFormText
          width="lg"
          required
          name="name"
          fieldProps={{ autoComplete: 'off' }}
          label={intl.formatMessage(INTL.NAME)}
          tooltip={intl.formatMessage(BASIC_INTL.NAME_TIP)}
          placeholder={intl.formatMessage(INTL.NAME_PLACEHOLDER)}
          rules={[{ required: true }]}
        />
      </ProForm.Group>
      <ProForm.Group align="center">
        <ProFormText
          width="lg"
          name="displayName"
          fieldProps={{ autoComplete: 'off' }}
          label={intl.formatMessage(INTL.DISPLAY_NAME)}
          tooltip={intl.formatMessage(BASIC_INTL.DISPLAY_NAME_TIP)}
          placeholder={intl.formatMessage(INTL.DISPLAY_NAME_PLACEHOLDER)}
        />
      </ProForm.Group>
      <ProForm.Group align="center">
        <ProFormSelect
          width="lg"
          name="type"
          valueEnum={AppType}
          label={intl.formatMessage(INTL.TYPE)}
          placeholder={intl.formatMessage(INTL.TYPE_PLACEHOLDER)}
          rules={[{ required: true }]}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default CreateAppModal;
