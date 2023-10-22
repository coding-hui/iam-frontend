import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import { UpdateApplicationRequest } from '@/services/application';
import { useIntl, useRequest } from '@@/exports';

import useStyle from './style';
import { CheckCard, ProCard, ProForm, ProFormItem } from '@ant-design/pro-components';
import { listIdentityProviders } from '@/services/idp';

export type Props = {
  appInfo?: App.Application;
  appInfoLoaded?: boolean;
  onUpdate: (record: UpdateApplicationRequest) => Promise<boolean>;
};

const prefixCls = 'app-login-config';

const INTL = {
  LOGIN_AND_REGISTER: {
    id: 'app.form.loginAndRegister.title',
  },
  SOCIAL_LOGIN: {
    id: 'app.form.socialLogin.title',
  },
};

const Index: React.FC<Props> = (props) => {
  const intl = useIntl();
  const [form] = Form.useForm<UpdateApplicationRequest>();
  const { styles } = useStyle(prefixCls);
  const [identityProviderIds, setIdentityProviderIds] = useState<string[]>([]);
  const [loadIdpLoading, setLoadIdpLoading] = useState<boolean>(true);

  const { appInfo, onUpdate } = props;

  const {
    run: doGetIdpList,
    data: idpList,
    loading: loadIdpListLoading,
  } = useRequest(listIdentityProviders, {
    manual: true,
    debounceInterval: 500,
    formatResult: (idpList) => idpList,
    onSuccess: () => {
      setLoadIdpLoading(false);
    },
  });

  useEffect(() => {
    setLoadIdpLoading(true);
    if (appInfo) {
      form.setFieldsValue(appInfo);
      if (appInfo.identityProviders) {
        let identityProviderIds: string[] = [];
        appInfo.identityProviders.forEach((idp) => {
          identityProviderIds.push(idp.metadata.instanceId);
        });
        setIdentityProviderIds(identityProviderIds);
        form.setFieldValue('identityProviderIds', identityProviderIds);
      }
      doGetIdpList({});
    }
  }, [appInfo]);

  return (
    <ProCard layout="default" direction="column" className={styles.main}>
      <ProForm form={form} onFinish={onUpdate} layout="horizontal">
        <div className={`${prefixCls}-title`}>{intl.formatMessage(INTL.SOCIAL_LOGIN)}</div>
        <ProForm.Group align="center">
          <ProFormItem name="identityProviderIds">
            {loadIdpListLoading || loadIdpLoading ? (
              <>
                <CheckCard loading size="small" />
                <CheckCard loading size="small" />
                <CheckCard loading size="small" />
              </>
            ) : (
              <CheckCard.Group size="small" defaultValue={identityProviderIds} multiple>
                {idpList &&
                  idpList.items &&
                  idpList.items.map((idp) => {
                    return (
                      <CheckCard
                        key={idp.metadata.instanceId}
                        title={idp.displayName ? idp.displayName : idp.metadata.name}
                        description={idp.description ? idp.description : '-'}
                        value={idp.metadata.instanceId}
                      />
                    );
                  })}
              </CheckCard.Group>
            )}
          </ProFormItem>
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default Index;
