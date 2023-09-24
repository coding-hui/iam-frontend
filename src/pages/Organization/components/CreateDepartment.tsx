import React, { useEffect } from 'react';
import { App, Form } from 'antd';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { BASIC_INTL } from '@/constant';
import { DataNode } from '@/utils/tree';
import type { CreateDepartmentRequest, UpdateDepartmentRequest } from '@/services/organization';
import { createDepartment, getDepartment, updateDepartment } from '@/services/organization';
import { useActive } from '@/hooks';
import { useRequest } from '@@/exports';

export type FormValueType = Partial<CreateDepartmentRequest | UpdateDepartmentRequest>;

export type Props = {
  edit?: boolean;
  visible: boolean;
  currentNode?: DataNode | any;
  onFinish: (values: FormValueType) => Promise<boolean>;
  onCancel?: () => void;
};

const INTL = {
  ADD_TITLE: {
    id: 'organization.form.createDept.title',
  },
  EDIT_TITLE: {
    id: 'organization.form.editDept.title',
  },
  NAME: {
    id: 'organization.form.deptName',
  },
  NAME_TIP: {
    id: 'organization.form.name.tip',
  },
  PLACEHOLDER_NAME: {
    id: 'organization.form.placeholder.deptName',
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
  PARENT: {
    id: 'organization.form.parentDept',
  },
};

const CreateDepartment: React.FC<Props> = (props) => {
  const intl = useIntl();
  const { message } = App.useApp();
  const { edit, visible, currentNode, onFinish, onCancel } = props;
  const [submitLoading, { active: showSubmitLoading, deactive: hideSubmitLoading }] =
    useActive(false);

  const [form] = Form.useForm<CreateDepartmentRequest>();

  const { run: doGetDeptInfo, loading: loadingDeptInfo } = useRequest(getDepartment, {
    manual: true,
    loadingDelay: 600,
    formatResult: (orgInfo) => orgInfo,
    onSuccess: (orgInfo) => {
      form.setFieldsValue(orgInfo);
    },
  });

  const handleAddDepartment = async (createReq: CreateDepartmentRequest) => {
    showSubmitLoading();
    const hide = message.loading(intl.formatMessage(BASIC_INTL.CREATING));
    try {
      await createDepartment(createReq);
      hide();
      message.success(intl.formatMessage(BASIC_INTL.CREATE_SUCCESS));
      return true;
    } catch (error) {
      hide();
      return false;
    } finally {
      hideSubmitLoading();
    }
  };

  const handleUpdateDepartment = async (updateReq: UpdateDepartmentRequest) => {
    showSubmitLoading();
    const hide = message.loading(intl.formatMessage(BASIC_INTL.UPDATING));
    try {
      if (currentNode.id) {
        await updateDepartment(currentNode.id, updateReq);
      }
      hide();
      message.success(intl.formatMessage(BASIC_INTL.UPDATE_SUCCESS));
      return true;
    } catch (error) {
      hide();
      return false;
    } finally {
      hideSubmitLoading();
    }
  };

  const handleSubmit = async (formData: FormValueType) => {
    let success = false;
    if (edit && currentNode.id) {
      success = await handleUpdateDepartment(formData as UpdateDepartmentRequest);
    } else {
      success = await handleAddDepartment(formData as CreateDepartmentRequest);
    }
    if (success) {
      return onFinish(formData);
    }
    return false;
  };

  const handleCancel = async () => {
    if (onCancel) {
      onCancel();
    }
    form.resetFields();
  };

  const handleModalTitle = () => {
    return edit ? intl.formatMessage(INTL.EDIT_TITLE) : intl.formatMessage(INTL.ADD_TITLE);
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        organizationId: currentNode.id,
        parentId: currentNode.id,
        parentName: currentNode.name,
      });
      if (edit && currentNode.id) {
        doGetDeptInfo(currentNode.id);
      }
    }
  }, [visible, currentNode]);

  return (
    <ModalForm<CreateDepartmentRequest>
      open={visible}
      onFinish={handleSubmit}
      modalProps={{
        onCancel: handleCancel,
        destroyOnClose: true,
      }}
      width="480px"
      form={form}
      autoComplete="off"
      loading={submitLoading || loadingDeptInfo}
      title={handleModalTitle()}
    >
      <ProFormText name="organizationId" hidden />
      <ProFormText name="parentId" hidden />
      <ProFormText
        width="lg"
        name={['metadata', 'name']}
        fieldProps={{ autoComplete: 'off' }}
        label={intl.formatMessage(INTL.NAME)}
        transform={(val) => {
          return { name: val };
        }}
        disabled={edit}
      />
      <ProFormText
        width="lg"
        name="displayName"
        fieldProps={{ autoComplete: 'off' }}
        label={intl.formatMessage(INTL.DISPLAY_NAME)}
        placeholder={intl.formatMessage(INTL.PLACEHOLDER_DISPLAY_NAME)}
        tooltip={intl.formatMessage(INTL.DISPLAY_NAME_TIP)}
        rules={[{ required: false }]}
      />
      <ProFormTextArea
        width="lg"
        name="description"
        fieldProps={{ autoComplete: 'off' }}
        label={intl.formatMessage(INTL.DESCRIPTION)}
        placeholder={intl.formatMessage(INTL.PLACEHOLDER_DESCRIPTION)}
        rules={[{ required: false }]}
      />
    </ModalForm>
  );
};

export default CreateDepartment;
