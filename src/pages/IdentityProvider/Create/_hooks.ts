import { Form } from 'antd';
import { message } from '@/components/EscapeAntd';
import { BASIC_INTL } from '@/constant';
import { useEffect, useRef } from 'react';
import { ProFormInstance } from '@ant-design/pro-components';
import { history, useIntl, useParams, useRequest } from '@umijs/max';

import {
  createIdentityProvider,
  CreateIdentityProviderRequest,
  getIdentityProvider,
  updateIdentityProvider,
  UpdateIdentityProviderRequest,
} from '@/services/idp';
import { IdentityProviderType, ProviderCategory } from '@/enums';

export type FormType = UpdateIdentityProviderRequest & CreateIdentityProviderRequest;

export type FormProps = {
  form?: any;
};

export default function useIdentityProviderHook() {
  const intl = useIntl();

  const { instanceId } = useParams();
  const formRef = useRef<ProFormInstance<FormType>>();
  const name = Form.useWatch('name', formRef.current);
  const category = Form.useWatch('category', formRef.current);

  const isEdit = !!instanceId;

  const idpTypes: Record<ProviderCategory, IdentityProviderType[]> = {
    [ProviderCategory.OAuth]: [
      IdentityProviderType.Gitee,
      IdentityProviderType.WeChat,
      IdentityProviderType.GitHub,
      IdentityProviderType.Coding,
      IdentityProviderType.Google,
    ],
    [ProviderCategory.Generic]: [IdentityProviderType.WeChatMiniProgram],
  };

  const setFormFieldsValue = (idpInfo: App.IdentityProvider) => {
    formRef.current?.setFieldsValue(idpInfo);
    if (isEdit) {
      formRef.current?.setFieldValue('name', idpInfo.metadata.name);
    }
  };

  const {
    run: doGetIdpInfo,
    data: idpInfo,
    loading: getInfoLoading,
  } = useRequest(getIdentityProvider, {
    manual: true,
    loadingDelay: 600,
    formatResult: (idpInfo) => idpInfo,
    onSuccess: (idpInfo) => {
      setFormFieldsValue(idpInfo);
    },
  });

  useEffect(() => {
    if (instanceId) {
      doGetIdpInfo(instanceId);
    }
  }, []);

  const { run: doCreateIdp, loading: createIdpLoading } = useRequest(createIdentityProvider, {
    manual: true,
    onSuccess: () => {
      message.success(intl.formatMessage(BASIC_INTL.CREATE_SUCCESS));
      setTimeout(() => {
        history.push(`/authn/identity-source/social`);
      }, 500);
    },
  });

  const { run: doUpdateIdp, loading: updateIdpLoading } = useRequest(updateIdentityProvider, {
    manual: true,
    onSuccess: () => {
      message.success(intl.formatMessage(BASIC_INTL.UPDATE_SUCCESS));
    },
  });

  const handleSubmit = async () => {
    const values = await formRef.current?.validateFieldsReturnFormatValue?.();
    if (values) {
      return isEdit ? doUpdateIdp(instanceId, values) : doCreateIdp(values);
    }
  };

  const handleReset = () => {
    if (idpInfo) {
      setFormFieldsValue(idpInfo);
    }
  };

  const getIdpTypesByCategory = (category: string): IdentityProviderType[] => {
    if (category === undefined || category === '') {
      return [];
    }
    return idpTypes[category as ProviderCategory];
  };

  const states = {
    name,
    category,
    isEdit,
    idpInfo,
    formRef,
    instanceId,
    getInfoLoading,
    createIdpLoading,
    updateIdpLoading,
  };

  const actions = {
    handleSubmit,
    handleReset,
    getIdpTypesByCategory,
  };

  return {
    states,
    actions,
  } as const;
}
