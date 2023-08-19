import { CheckCircleOutlined, DeleteOutlined, DownOutlined, StopOutlined } from '@ant-design/icons';
import {
  ActionType,
  BetaSchemaForm,
  PageContainer,
  ProCard,
  ProColumns,
  ProFormColumnsType,
  ProTable,
} from '@ant-design/pro-components';
import { useParams, useRequest, FormattedMessage, useIntl } from '@umijs/max';
import { App, Button, Dropdown, Form } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getRoleInfo } from '@/services/role/getRoleInfo';
import { updateRole } from '@/services/role/updateRole';
import { BASIC_INTL } from '@/constant';
import { revokeRole } from '@/services/role/revokeRole';
import { SubjectTransfer } from '@/components';
import { assignRole } from '@/services/role/assignRole';
import { TRANSFER_TYPE } from '@/components/Transfer';

const INTL = {
  ALIAS: {
    id: 'users.table.alias',
  },
  PHONE: {
    id: 'users.table.phone',
  },
  EMAIL: {
    id: 'users.table.email',
  },
  REVOKE_ROLE: {
    id: 'role.revoke.user',
  },
  REVOKE_ROLE_SUCCESS: {
    id: 'role.revoke.user.success',
  },
  ASSIGN_ROLE_SUCCESS: {
    id: 'role.assign.user.success',
  },
};

const ROLE_TABS = {
  INFO: {
    tab: '角色信息',
    key: 'info',
  },
  ASSIGN: {
    tab: '角色分配',
    key: 'assign',
  },
};

const EditRole: React.FC = () => {
  const intl = useIntl();
  const assignTableActionRef = useRef<ActionType>();
  const { message } = App.useApp();
  const [currentTab, setCurrentTab] = useState('info');
  const [assignUsers, setAssignUsers] = useState<API.UserInfo[]>();
  const { instanceId } = useParams();
  const [roleInfoForm] = Form.useForm();

  const isInfoTab = () => {
    return currentTab === ROLE_TABS.INFO.key;
  };

  const {
    run: doGetRoleInfo,
    data: roleInfo,
    loading,
  } = useRequest(getRoleInfo, {
    manual: true,
    loadingDelay: 600,
    refreshDeps: [],
    formatResult: (roleInfo) => roleInfo,
    onSuccess: (res) => {
      roleInfoForm.setFieldsValue(res);
      setAssignUsers(res.users);
    },
  });

  useEffect(() => {
    if (instanceId) {
      doGetRoleInfo(instanceId);
    }
  }, []);

  const { run: doUpdateRoleInfo, loading: updateRoleInfoLoading } = useRequest(updateRole, {
    manual: true,
    onSuccess: () => {
      message.success(intl.formatMessage(BASIC_INTL.UPDATE_SUCCESS));
    },
  });

  const handleResetRoleInfoFormValues = () => {
    roleInfoForm.setFieldsValue(roleInfo);
  };

  const handleUpdateRoleInfo = async () => {
    try {
      const values = await roleInfoForm.validateFields();
      if (roleInfo) {
        doUpdateRoleInfo(roleInfo.metadata.instanceId, values);
      }
    } catch (err) {
      //
    }
  };

  const { run: doRevokeRole, loading: revokeRoleLoading } = useRequest(revokeRole, {
    manual: true,
    onSuccess: () => {
      assignTableActionRef.current?.reload();
      if (roleInfo) {
        doGetRoleInfo(roleInfo.metadata.instanceId);
      }
      message.success(intl.formatMessage(INTL.REVOKE_ROLE_SUCCESS));
    },
  });

  const handleRevokeRole = (targets: string[]) => {
    if (roleInfo) {
      doRevokeRole(roleInfo.metadata.instanceId, { targets });
    }
  };

  const getAssignTargetKeys = () => {
    if (!assignUsers) {
      return [];
    }
    return assignUsers.map((item) => {
      return item.metadata.instanceId;
    });
  };

  const { run: doAssignRole, loading: assignRoleLoading } = useRequest(assignRole, {
    manual: true,
    onSuccess: () => {
      assignTableActionRef.current?.reload();
      if (roleInfo) {
        doGetRoleInfo(roleInfo.metadata.instanceId);
      }
      message.success(intl.formatMessage(INTL.ASSIGN_ROLE_SUCCESS));
    },
  });

  const handleAssignRole = async (targets: string[]) => {
    if (roleInfo) {
      doAssignRole(roleInfo.metadata.instanceId, { targets });
    }
    return true;
  };

  const roleInfoColumns: ProFormColumnsType<API.Role>[] = [
    {
      title: '名称',
      dataIndex: ['metadata', 'name'],
      width: 'md',
      readonly: true,
      colProps: {
        xs: 16,
        md: 8,
      },
    },
    {
      title: '归属人',
      dataIndex: 'owner',
      width: 'md',
      colProps: {
        xs: 16,
        md: 8,
      },
    },
    {
      title: '状态',
      dataIndex: 'disabled',
      width: 'md',
      readonly: true,
      colProps: {
        xs: 16,
        md: 8,
      },
      valueEnum: {
        false: {
          text: <FormattedMessage {...BASIC_INTL.ACTIVED} />,
          status: 'Success',
        },
        true: {
          text: <FormattedMessage {...BASIC_INTL.DISABLED} />,
          status: 'Error',
        },
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 'md',
      colProps: {
        xs: 16,
        md: 8,
      },
    },
  ];

  const roleAssignColumns: ProColumns<API.UserInfo>[] = [
    {
      title: <FormattedMessage {...BASIC_INTL.NO} />,
      valueType: 'index',
    },
    {
      title: <FormattedMessage {...BASIC_INTL.INSTANCE_ID} />,
      dataIndex: ['metadata', 'instanceId'],
    },
    {
      title: <FormattedMessage {...BASIC_INTL.NAME} />,
      dataIndex: ['metadata', 'name'],
    },
    {
      title: <FormattedMessage {...INTL.ALIAS} />,
      dataIndex: 'alias',
    },
    {
      title: <FormattedMessage {...INTL.PHONE} />,
      dataIndex: 'phone',
    },
    {
      title: <FormattedMessage {...INTL.EMAIL} />,
      dataIndex: 'email',
    },
    {
      title: <FormattedMessage {...BASIC_INTL.STATUS} />,
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: <FormattedMessage {...BASIC_INTL.ACTIVED} />,
          status: 'Success',
        },
        1: {
          text: <FormattedMessage {...BASIC_INTL.DISABLED} />,
          status: 'Error',
        },
      },
    },
    {
      title: <FormattedMessage {...BASIC_INTL.TITLE_OPTION} />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: API.UserInfo) => [
        <a key="revokeRole" onClick={() => handleRevokeRole([record.metadata.instanceId])}>
          <FormattedMessage {...INTL.REVOKE_ROLE} />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer
      fixedHeader
      tabActiveKey={currentTab}
      onTabChange={(tab) => setCurrentTab(tab)}
      tabList={[ROLE_TABS.INFO, ROLE_TABS.ASSIGN]}
      header={{
        title: roleInfo?.metadata.name,
        extra: [
          <Dropdown
            key="dropdown"
            trigger={['click']}
            menu={{
              items: [
                {
                  icon: roleInfo?.disabled === true ? <CheckCircleOutlined /> : <StopOutlined />,
                  label: roleInfo?.disabled === false ? '启用角色' : '禁用角色',
                  key: '1',
                },
                {
                  icon: <DeleteOutlined />,
                  label: '删除角色',
                  key: '2',
                },
              ],
            }}
          >
            <Button key="4" style={{ padding: '0 8px' }}>
              更多
              <DownOutlined />
            </Button>
          </Dropdown>,
          <Button key="3" type="primary">
            重置密码
          </Button>,
        ],
      }}
    >
      <ProCard direction="column" ghost gutter={[0, 16]}>
        {isInfoTab() ? (
          <ProCard loading={loading} title="角色信息">
            <BetaSchemaForm<API.Role>
              form={roleInfoForm}
              layoutType="Form"
              grid
              loading={updateRoleInfoLoading}
              onReset={handleResetRoleInfoFormValues}
              onFinish={handleUpdateRoleInfo}
              columns={roleInfoColumns}
            />
          </ProCard>
        ) : (
          <ProTable
            headerTitle="已分配用户"
            loading={revokeRoleLoading || assignRoleLoading || loading}
            actionRef={assignTableActionRef}
            search={false}
            columns={roleAssignColumns}
            dataSource={assignUsers}
            rowKey={(record) => record?.metadata?.instanceId ?? ''}
            toolBarRender={() => [
              <SubjectTransfer
                key="assignRole"
                types={[TRANSFER_TYPE.USER]}
                doGetTargetUsers={() => getAssignTargetKeys()}
                onOk={(values) => handleAssignRole(values)}
              />,
            ]}
          ></ProTable>
        )}
      </ProCard>
    </PageContainer>
  );
};

export default EditRole;
