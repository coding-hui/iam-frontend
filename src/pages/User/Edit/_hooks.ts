import { getUserRoles } from '@/services/user/getUserRoles';
import { history, useIntl, useParams, useRequest } from '@@/exports';
import { getUserInfo } from '@/services/user/getUserInfo';
import { useEffect, useRef, useState } from 'react';
import { updateUser } from '@/services/user/updateUser';
import { App, Form } from 'antd';
import { revokeRole } from '@/services/role/revokeRole';
import { ActionType } from '@ant-design/pro-components';
import { batchAssignRole } from '@/services/role/assignRole';
import { deleteUser } from '@/services/user/deleteUser';
import { BASIC_INTL } from '@/constant';
import { enableUser } from '@/services/user/enableUser';
import { disableUser } from '@/services/user/disableUser';

const INTL = {
  ACTIVE_STATUS: 'users.table.status.active',
  DISABLED_STATUS: 'users.table.status.disabled',
  UPDATE_SUCCESS: 'message.update.success',
  REVOKE_ROLE_SUCCESS: {
    id: 'role.revoke.user.success',
  },
  ASSIGN_ROLE_SUCCESS: {
    id: 'role.assign.user.success',
  },
};

const USER_TABS = {
  INFO: {
    tab: '用户信息',
    key: 'info',
  },
  ROLES: {
    tab: '角色权限',
    key: 'roles',
  },
  LOG: {
    tab: '访问日志',
    key: 'log',
    disabled: true,
  },
};

export default function useUserHook() {
  const intl = useIntl();
  const { message } = App.useApp();
  const { instanceId } = useParams();
  const [userInfoForm] = Form.useForm();
  const [accountInfoForm] = Form.useForm();
  const roleTableActionRef = useRef<ActionType>();
  const [currentTab, setCurrentTab] = useState('info');
  const [assignRoles, setAssignRoles] = useState<API.Role[]>();

  const isInfoTab = () => {
    return currentTab === USER_TABS.INFO.key;
  };

  const {
    run: doGetUserInfo,
    data: userInfo,
    loading,
  } = useRequest(getUserInfo, {
    manual: true,
    loadingDelay: 600,
    formatResult: (userInfo) => userInfo,
    onSuccess: (userInfo) => {
      userInfoForm.setFieldsValue(userInfo);
      accountInfoForm.setFieldsValue(userInfo);
    },
  });

  useEffect(() => {
    if (instanceId) {
      doGetUserInfo(instanceId);
    }
  }, []);

  const { run: doUpdateUserInfo, loading: updateUserInfoLoading } = useRequest(updateUser, {
    manual: true,
    onSuccess: () => {
      message.success(intl.formatMessage({ id: INTL.UPDATE_SUCCESS }));
    },
  });

  const handleResetUserInfoFormValues = () => {
    userInfoForm.setFieldsValue(userInfo);
    accountInfoForm.setFieldsValue(userInfo);
  };

  const handleUpdateUserInfo = async () => {
    try {
      const values = await userInfoForm.validateFields();
      if (userInfo) {
        doUpdateUserInfo(userInfo.metadata.instanceId, values);
      }
    } catch (err) {
      //
    }
  };

  const handleToEditRole = (instanceId: string) => {
    history.push(`/resource/role/${instanceId}`);
  };

  const { run: doRevokeRole, loading: revokeRoleLoading } = useRequest(revokeRole, {
    manual: true,
    onSuccess: () => {
      roleTableActionRef.current?.reload();
      message.success(intl.formatMessage(INTL.REVOKE_ROLE_SUCCESS));
    },
  });

  const handleRevokeUserRole = (role: string) => {
    if (instanceId) {
      doRevokeRole(role, { targets: [instanceId] });
    }
  };

  const { run: doAssignRole, loading: assignRoleLoading } = useRequest(batchAssignRole, {
    manual: true,
    onSuccess: () => {
      roleTableActionRef.current?.reload();
      message.success(intl.formatMessage(INTL.ASSIGN_ROLE_SUCCESS));
    },
  });

  const handleAssignUserRole = async (roles: string[]) => {
    if (instanceId) {
      doAssignRole({ instanceIds: roles, targets: [instanceId] });
    }
    return true;
  };

  const fetchUserRoles = async () => {
    if (instanceId) {
      const roles = await getUserRoles(instanceId);
      setAssignRoles(roles.list);
      return {
        data: roles.list,
        total: roles.total,
      };
    }
    return {
      data: [],
      total: 0,
    };
  };

  const getAssignRolesKeys = () => {
    if (!assignRoles) {
      return [];
    }
    return assignRoles.map((item) => {
      return item.metadata.instanceId;
    });
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  const { run: doDeleteUser } = useRequest(deleteUser, {
    manual: true,
    onSuccess: () => {
      message.success(intl.formatMessage(BASIC_INTL.DELETE_SUCCESS));
      setTimeout(() => {
        history.push(`/user/list`);
      }, 200);
    },
  });

  const handleDeleteUser = () => {
    if (userInfo) {
      doDeleteUser(userInfo.metadata.instanceId);
    }
  };

  const { run: doDisableUser } = useRequest(disableUser, {
    manual: true,
    onSuccess: () => {
      if (userInfo) {
        doGetUserInfo(userInfo.metadata.instanceId);
        roleTableActionRef.current?.reload();
      }
      message.success(intl.formatMessage(BASIC_INTL.UPDATE_SUCCESS));
    },
  });

  const { run: doEnableUser } = useRequest(enableUser, {
    manual: true,
    onSuccess: () => {
      if (userInfo) {
        doGetUserInfo(userInfo.metadata.instanceId);
        roleTableActionRef.current?.reload();
      }
      message.success(intl.formatMessage(BASIC_INTL.UPDATE_SUCCESS));
    },
  });

  const handleChangeUserState = (disabled?: boolean) => {
    if (userInfo) {
      if (disabled) {
        doDisableUser(userInfo.metadata.instanceId);
      } else {
        doEnableUser(userInfo.metadata.instanceId);
      }
    }
  };

  const states = {
    userTabs: USER_TABS,
    instanceId,
    assignRoles,
    loading,
    userInfo,
    currentTab,
    userInfoForm,
    accountInfoForm,
    roleTableActionRef,
    revokeRoleLoading,
    assignRoleLoading,
    updateUserInfoLoading,
  };

  const actions = {
    isInfoTab,
    handleTabChange,
    fetchUserRoles,
    getAssignRolesKeys,
    handleToEditRole,
    handleDeleteUser,
    handleRevokeUserRole,
    handleAssignUserRole,
    handleUpdateUserInfo,
    handleChangeUserState,
    handleResetUserInfoFormValues,
  };

  return {
    states,
    actions,
  } as const;
}
