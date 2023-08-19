import { BASIC_INTL } from '@/constant';
import { FormattedMessage } from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { App, Button, Form } from 'antd';
import React from 'react';
import { createRole, CreateRoleRequest } from '@/services/role/createRole';

export type FormValueType = Partial<CreateRoleRequest>;

export type CreateFormProps = {
  onFinish: (values: FormValueType) => Promise<boolean>;
};

const INTL = {
  TITLE: {
    id: 'role.form.create.title',
  },
  NAME: {
    id: 'role.form.name',
  },
  DESCRIPTION: {
    id: 'role.form.description',
  },
  DESCRIPTION_PLACEHOLDER: {
    id: 'role.form.placeholder.description',
  },
  NAME_PLACEHOLDER: {
    id: 'role.form.placeholder.name',
  },
};

const CreateRoleModal: React.FC<CreateFormProps> = (props) => {
  const intl = useIntl();
  const { message } = App.useApp();
  const [form] = Form.useForm<CreateRoleRequest>();
  const { initialState } = useModel('@@initialState');

  const handleAddRole = async (createReq: CreateRoleRequest) => {
    const hide = message.loading(intl.formatMessage(BASIC_INTL.CREATING));
    try {
      createReq.owner = initialState && initialState?.currentUser?.metadata?.name;
      await createRole(createReq);
      hide();
      message.success(intl.formatMessage(BASIC_INTL.CREATE_SUCCESS));
      return true;
    } catch (error) {
      hide();
      return false;
    }
  };

  const handleSubmit = async (formData: FormValueType) => {
    const success = await handleAddRole(formData as CreateRoleRequest);
    if (success) {
      return props.onFinish(formData);
    }
    return false;
  };

  return (
    <ModalForm<CreateRoleRequest>
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
          required
          name="name"
          fieldProps={{ autoComplete: 'off' }}
          label={intl.formatMessage(INTL.NAME)}
          placeholder={intl.formatMessage(INTL.NAME_PLACEHOLDER)}
          rules={[{ required: true, message: intl.formatMessage(INTL.NAME_PLACEHOLDER) }]}
        />
      </ProForm.Group>
      <ProForm.Group align="center">
        <ProFormTextArea
          width="lg"
          name="description"
          fieldProps={{ autoComplete: 'off' }}
          label={intl.formatMessage(INTL.DESCRIPTION)}
          placeholder={intl.formatMessage(INTL.DESCRIPTION_PLACEHOLDER)}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default CreateRoleModal;
