import { history, useIntl, useParams, useRequest } from '@@/exports';
import { useEffect, useState } from 'react';
import { App, Form } from 'antd';
import { BASIC_INTL } from '@/constant';
import {
  getOrganization,
  enableOrganization,
  disableOrganization,
  deleteOrganization,
  updateOrganization,
} from '@/services/organization';

export default function useOrganizationHook() {
  const intl = useIntl();
  const { message } = App.useApp();
  const { instanceId } = useParams();
  const [orgInfoForm] = Form.useForm();
  const [currentTab, setCurrentTab] = useState('info');

  const {
    run: doGetOrgInfo,
    data: orgInfo,
    loading,
  } = useRequest(getOrganization, {
    manual: true,
    loadingDelay: 600,
    formatResult: (orgInfo) => orgInfo,
    onSuccess: (orgInfo) => {
      orgInfoForm.setFieldsValue(orgInfo);
    },
  });

  useEffect(() => {
    if (instanceId) {
      doGetOrgInfo(instanceId);
    }
  }, []);

  const { run: doUpdateOrgInfo, loading: updateOrgInfoLoading } = useRequest(updateOrganization, {
    manual: true,
    onSuccess: () => {
      message.success(intl.formatMessage(BASIC_INTL.UPDATE_SUCCESS));
    },
  });

  const handleResetOrgInfoFormValues = () => {
    orgInfoForm.setFieldsValue(orgInfo);
  };

  const handleUpdateOrgInfo = async () => {
    try {
      const values = await orgInfoForm.validateFields();
      if (orgInfo) {
        doUpdateOrgInfo(orgInfo.metadata.instanceId, values);
      }
    } catch (err) {
      //
    }
  };

  const { run: doDeleteOrg } = useRequest(deleteOrganization, {
    manual: true,
    onSuccess: () => {
      message.success(intl.formatMessage(BASIC_INTL.DELETE_SUCCESS));
      setTimeout(() => {
        history.push(`org-management/org`);
      }, 200);
    },
  });

  const handleDeleteOrg = () => {
    if (orgInfo) {
      doDeleteOrg(orgInfo.metadata.instanceId);
    }
  };

  const { run: doDisableOrg } = useRequest(disableOrganization, {
    manual: true,
    onSuccess: () => {
      if (orgInfo) {
        doGetOrgInfo(orgInfo.metadata.instanceId);
      }
      message.success(intl.formatMessage(BASIC_INTL.UPDATE_SUCCESS));
    },
  });

  const { run: doEnableOrg } = useRequest(enableOrganization, {
    manual: true,
    onSuccess: () => {
      if (orgInfo) {
        doGetOrgInfo(orgInfo.metadata.instanceId);
      }
      message.success(intl.formatMessage(BASIC_INTL.UPDATE_SUCCESS));
    },
  });

  const handleChangeOrgState = (disabled?: boolean) => {
    if (orgInfo) {
      if (disabled) {
        doDisableOrg(orgInfo.metadata.instanceId);
      } else {
        doEnableOrg(orgInfo.metadata.instanceId);
      }
    }
  };

  const states = {
    instanceId,
    loading,
    orgInfo,
    currentTab,
    orgInfoForm,
    updateOrgInfoLoading,
  };

  const actions = {
    setCurrentTab,
    handleDeleteOrg,
    handleUpdateOrgInfo,
    handleChangeOrgState,
    handleResetOrgInfoFormValues,
  };

  return {
    states,
    actions,
  } as const;
}
