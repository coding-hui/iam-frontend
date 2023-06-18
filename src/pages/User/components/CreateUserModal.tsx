import { USER_REGEXP } from '@/constant';
import { createUser, CreateUserRequest } from '@/services/user/createUser';
import { randomPwd } from '@/utils';
import { FormattedMessage } from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProForm, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, Form, message } from 'antd';
import React from 'react';

export type FormValueType = Partial<CreateUserRequest>;

export type UpdateFormProps = {
  onFinish: (values: FormValueType) => Promise<boolean>;
};

const INTL = {
  CREATING: 'message.loading.creating',
  CREATE_SUCCESS: 'message.create.success',
  CREATE_FAILED: 'message.create.failed',
  NAME: 'users.form.name',
  ALIAS: 'users.form.alias',
  PHONE: 'users.form.phone',
  EMAIL: 'users.form.email',
  PWD: 'users.form.pwd',
  PLACEHOLDER_NAME: 'users.form.placeholder.name',
  PLACEHOLDER_ALIAS: 'users.form.placeholder.alias',
  PLACEHOLDER_PHONE: 'users.form.placeholder.phone',
  PLACEHOLDER_EMAIL: 'users.form.placeholder.email',
  PLACEHOLDER_PWD: 'users.form.placeholder.pwd',
  TITLE: 'users.form.create.title',
  VALIDATOR_PHONE_MSG: 'users.form.validator.phone.msg',
  ADD_USER_BTN: 'users.table.add',
  AUTO_GEN_PWD: 'users.form.authGenPwd',
  RESET_PASSWORD_ON_FIRST_LOGIN: 'users.form.resetPwdOnFirstLogin',
};

const CreateUserModal: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  const [form] = Form.useForm<CreateUserRequest>();

  const handleGenRandomPwd = () => {
    form.setFieldValue('password', randomPwd());
  };

  const genRandomPwd = (
    <Button type="primary" onClick={() => handleGenRandomPwd()}>
      <FormattedMessage id={INTL.AUTO_GEN_PWD} />
    </Button>
  );

  const handleAddUser = async (createReq: CreateUserRequest) => {
    const hide = message.loading(intl.formatMessage({ id: INTL.CREATING }));
    try {
      await createUser(createReq);
      hide();
      message.success(intl.formatMessage({ id: INTL.CREATE_SUCCESS }));
      return true;
    } catch (error) {
      hide();
      return false;
    }
  };

  const handleSubmit = async (formData: FormValueType) => {
    const success = await handleAddUser(formData as CreateUserRequest);
    if (success) {
      return props.onFinish(formData);
    }
    return false;
  };

  return (
    <ModalForm<CreateUserRequest>
      onFinish={handleSubmit}
      modalProps={{
        destroyOnClose: true,
      }}
      title={intl.formatMessage({ id: INTL.TITLE })}
      form={form}
      autoFocusFirstInput
      autoComplete="off"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          <FormattedMessage id={INTL.ADD_USER_BTN} defaultMessage="New" />
        </Button>
      }
    >
      <ProForm.Group align="center">
        <ProFormText
          width="md"
          required
          name="name"
          label={intl.formatMessage({ id: INTL.NAME })}
          placeholder={intl.formatMessage({ id: INTL.PLACEHOLDER_NAME })}
          rules={[{ required: true }]}
        />
        <ProFormText
          width="md"
          name="alias"
          label={intl.formatMessage({ id: INTL.ALIAS })}
          placeholder={intl.formatMessage({ id: INTL.PLACEHOLDER_ALIAS })}
        />
      </ProForm.Group>
      <ProForm.Group align="center">
        <ProFormText
          width="md"
          name="phone"
          label={intl.formatMessage({ id: INTL.PHONE })}
          placeholder={intl.formatMessage({ id: INTL.PLACEHOLDER_PHONE })}
          rules={[
            { required: false },
            {
              pattern: USER_REGEXP.PHONE,
              message: intl.formatMessage({ id: INTL.VALIDATOR_PHONE_MSG }),
            },
          ]}
        />
        <ProFormText
          width="md"
          name="email"
          label={intl.formatMessage({ id: INTL.EMAIL })}
          placeholder={intl.formatMessage({ id: INTL.PLACEHOLDER_EMAIL })}
          rules={[{ required: false }, { type: 'email' }]}
        />
      </ProForm.Group>
      <ProForm.Group align="center">
        <ProFormText.Password
          width="md"
          required
          name="password"
          label={intl.formatMessage({ id: INTL.PWD })}
          placeholder={intl.formatMessage({ id: INTL.PLACEHOLDER_PWD })}
          addonAfter={genRandomPwd}
          rules={[{ required: true }, { min: 8 }]}
        />
        <ProFormSwitch
          width="md"
          name="resetPasswordOnFirstLogin"
          label={intl.formatMessage({ id: INTL.RESET_PASSWORD_ON_FIRST_LOGIN })}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default CreateUserModal;
