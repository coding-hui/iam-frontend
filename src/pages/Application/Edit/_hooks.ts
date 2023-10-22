import { App, Form } from 'antd';
import { BASIC_INTL } from '@/constant';
import { useEffect, useRef } from 'react';
import { ProFormInstance } from '@ant-design/pro-components';
import { useIntl, useParams, useRequest } from '@umijs/max';

import {
  getApplication,
  updateApplication,
  UpdateApplicationRequest,
} from '@/services/application';

export default function useAppHook() {
  const intl = useIntl();
  const { message } = App.useApp();
  const { instanceId } = useParams();
  const formRef = useRef<ProFormInstance<UpdateApplicationRequest>>();
  const name = Form.useWatch('name', formRef.current);

  const setFormFieldsValue = (appInfo: App.Application) => {
    formRef.current?.setFieldsValue(appInfo);
  };

  const {
    run: doGetAppInfo,
    data: appInfo,
    loading: getInfoLoading,
  } = useRequest(getApplication, {
    manual: true,
    loadingDelay: 600,
    formatResult: (appInfo) => appInfo,
    onSuccess: (appInfo) => {
      setFormFieldsValue(appInfo);
    },
  });

  useEffect(() => {
    if (instanceId) {
      doGetAppInfo(instanceId);
    }
  }, []);

  const { run: doUpdateApp, loading: updateAppLoading } = useRequest(updateApplication, {
    manual: true,
    onSuccess: () => {
      message.success(intl.formatMessage(BASIC_INTL.UPDATE_SUCCESS));
    },
  });

  const handleReset = () => {
    if (appInfo) {
      setFormFieldsValue(appInfo);
    }
  };

  const logoColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

  const getLogoColor = (name?: string, avatar?: string) => {
    if (avatar) {
      return '';
    }
    if (!name) {
      return logoColorList[0];
    }
    return logoColorList[name.length % logoColorList.length];
  };

  const handleUpdateApp = async (record: UpdateApplicationRequest) => {
    if (instanceId) {
      return doUpdateApp(instanceId, record);
    }
  };

  const states = {
    name,
    appInfo,
    formRef,
    instanceId,
    getInfoLoading,
    updateAppLoading,
  };

  const actions = {
    handleUpdateApp,
    handleReset,
    getLogoColor,
  };

  return {
    states,
    actions,
  } as const;
}
