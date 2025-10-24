import { history, useIntl, useParams, useRequest } from '@@/exports';
import { useEffect, useRef } from 'react';
import { ProFormInstance } from '@ant-design/pro-components';
import { createPolicy, CreatePolicyRequest } from '@/services/policy/createPolicy';
import { updatePolicy, UpdatePolicyRequest } from '@/services/policy/updatePolicy';
import { getPolicyInfo } from '@/services/policy/getPolicyInfo';
import { listResources } from '@/services/resource/listResources';
import { App } from 'antd';
import { PolicyType } from '@/enums';

const INTL = {
  CREATE_SUCCESS: {
    id: 'policy.message.create.success',
  },
  UPDATE_SUCCESS: {
    id: 'policy.message.update.success',
  },
};

const ALL_RESOURCE = {
  key: '*',
  label: 'policy.allResources',
  name: '*',
  value: '*',
  actions: [],
};

export type AdvancedStatement = API.Statement & {
  allowAll: boolean;
  selectedResource: {
    name: string;
    key: string;
    label: string;
    value: string;
  };
};

type FormType = UpdatePolicyRequest &
  CreatePolicyRequest & {
    statements: AdvancedStatement[];
  };

export default function usePolicyHook() {
  const intl = useIntl();
  const { message } = App.useApp();
  const { instanceId } = useParams();
  const formRef = useRef<ProFormInstance<FormType>>();

  const isEdit = !!instanceId;

  const setFormFieldsValue = (policyInfo: API.Policy) => {
    let statements = policyInfo.statements.map((item: API.Statement) => {
      let resource =
        item.resource === ALL_RESOURCE.value
          ? ALL_RESOURCE
          : policyInfo.resources &&
            policyInfo.resources.filter((r) => r.metadata.instanceId === item.resource).pop();
      const split = item.resourceIdentifier.split(':');
      const resourceName = split.length > 0 ? split[0] : '';
      const resourceIdentifier = split.length > 1 ? split[1] : '*';
      let selectedResource = {
        key: item.resource,
        value: item.resource,
        name: resourceName,
        label: resourceName,
        actions: resource?.actions,
      };
      return {
        ...item,
        selectedResource,
        resourceIdentifier,
        allowAll: item.actions && item.actions.length === 1 && item.actions[0] === '*',
      };
    });
    let subjects = policyInfo.subjects.map((item: string) => {
      return {
        key: item,
        value: item,
        label: item,
      };
    });
    formRef.current?.setFieldsValue(policyInfo);
    formRef.current?.setFieldValue('name', policyInfo.metadata.name);
    formRef.current?.setFieldValue('statements', statements);
    formRef.current?.setFieldValue('subjects', subjects);
  };

  const {
    run: doGetPolicyInfo,
    data: policyInfo,
    loading: getInfoLoading,
  } = useRequest(getPolicyInfo, {
    manual: true,
    loadingDelay: 600,
    formatResult: (policyInfo) => policyInfo,
    onSuccess: (policyInfo) => {
      setFormFieldsValue(policyInfo);
    },
  });

  useEffect(() => {
    if (instanceId) {
      doGetPolicyInfo(instanceId);
    }
  }, []);

  const handleSelectSubjects = async (values: string[]) => {
    const subjects = values.map((item) => {
      return {
        label: item,
        value: item,
        key: item,
      };
    });
    formRef.current?.setFieldValue('subjects', subjects);
    return true;
  };

  // @ts-ignore
  const handleSearchResources = async (params) => {
    const res = await listResources(params);
    const resources = [
      {
        key: '*',
        label: intl.formatMessage({ id: 'policy.allResources' }),
        name: '*',
        value: '*',
        actions: [{ name: '*' }],
      },
    ];
    res.items.forEach((item) => {
      resources.push({
        key: item.metadata.instanceId,
        label: item.metadata.name,
        name: item.metadata.name,
        value: item.metadata.instanceId,
        actions: item.actions,
      });
    });
    return resources;
  };

  const getSelectRoles = () => {
    let val = formRef.current?.getFieldFormatValueObject?.('subjects');
    if (val && val.subjects) {
      return val.subjects.filter((item) => {
        return item.startsWith('role');
      });
    }
    return [];
  };

  const getSelectUsers = () => {
    let val = formRef.current?.getFieldFormatValueObject?.('subjects');
    if (val && val.subjects) {
      return val.subjects.filter((item) => {
        return item.startsWith('user');
      });
    }
    return [];
  };

  const { run: doCreatePolicy, loading: createPolicyLoading } = useRequest(createPolicy, {
    manual: true,
    onSuccess: () => {
      message.success(intl.formatMessage(INTL.CREATE_SUCCESS));
      setTimeout(() => {
        history.push(`/resource/policy`);
      }, 500);
    },
  });

  const { run: doUpdatePolicy, loading: updatePolicyLoading } = useRequest(updatePolicy, {
    manual: true,
    onSuccess: () => {
      message.success(intl.formatMessage(INTL.UPDATE_SUCCESS));
    },
  });

  const handleSubmit = async () => {
    const values = await formRef.current?.validateFieldsReturnFormatValue?.();
    if (values) {
      let policy = {
        name: values.name,
        description: values.description,
        type: values.type ? values.type : PolicyType.CUSTOM,
        subjects: values.subjects,
        status: '0',
        statements: values.statements?.map((item) => {
          let statement = item as AdvancedStatement;
          return {
            effect: statement.effect,
            resource: statement.selectedResource.value,
            resourceIdentifier: `${statement.selectedResource.name}:${statement.resourceIdentifier}`,
            actions: statement.allowAll ? ['*'] : statement.actions,
          };
        }),
      };
      return instanceId ? doUpdatePolicy(instanceId, policy) : doCreatePolicy(policy);
    }
  };

  const handleReset = () => {
    if (policyInfo) {
      setFormFieldsValue(policyInfo);
    }
  };

  const states = {
    isEdit,
    policyInfo,
    formRef,
    instanceId,
    getInfoLoading,
    createPolicyLoading,
    updatePolicyLoading,
  };

  const actions = {
    handleSelectSubjects,
    handleSearchResources,
    getSelectRoles,
    getSelectUsers,
    handleSubmit,
    handleReset,
  };

  return {
    states,
    actions,
  } as const;
}
