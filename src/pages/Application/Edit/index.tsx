import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import useAppHook from './_hooks';
import BasicInfo from './components/BasicInfo';
import useStyle from './style';
import { Avatar } from 'antd';
import classNames from 'classnames';
import LoginConfig from '@/pages/Application/Edit/components/LoginConfig';

const prefixCls = 'app-edit';

const TABS = {
  INFO: {
    tab: '基本配置',
    key: 'basic',
  },
  LOGIN: {
    tab: '登录配置',
    key: 'login',
  },
};

const EditApp: React.FC = () => {
  const { wrapSSR, hashId } = useStyle(prefixCls);
  const [currentTab, setCurrentTab] = useState<string>(TABS.INFO.key);

  const {
    states: { appInfo, getInfoLoading },
    actions: { handleUpdateApp, getLogoColor },
  } = useAppHook();

  const appLogoTitle = (
    <div>
      <Avatar
        src={appInfo && appInfo.logo ? appInfo.logo : null}
        style={{
          backgroundColor: getLogoColor(appInfo?.metadata.name, appInfo?.logo),
          verticalAlign: 'bottom',
        }}
        size={56}
        gap={4}
      >
        {appInfo && appInfo.metadata.name ? appInfo.metadata.name.substring(0, 5) : ''}
      </Avatar>
    </div>
  );

  const appSubTitleInfo = (
    <div>
      <div className={classNames(`${prefixCls}-app-name`, hashId)}>{appInfo?.metadata.name}</div>
      <div
        className={classNames(`${prefixCls}-app-id`, hashId)}
      >{`ID : ${appInfo?.metadata.instanceId}`}</div>
    </div>
  );

  return wrapSSR(
    <PageContainer
      fixedHeader
      title={appLogoTitle}
      subTitle={appSubTitleInfo}
      tabActiveKey={currentTab}
      onTabChange={(tab) => setCurrentTab(tab)}
      tabList={[
        {
          key: TABS.INFO.key,
          tab: TABS.INFO.tab,
        },
        {
          key: TABS.LOGIN.key,
          tab: TABS.LOGIN.tab,
        },
      ]}
    >
      {currentTab === TABS.INFO.key && (
        <BasicInfo
          appInfo={appInfo}
          appInfoLoaded={getInfoLoading}
          getLogoColor={getLogoColor}
          onUpdate={handleUpdateApp}
        />
      )}
      {currentTab === TABS.LOGIN.key && (
        <LoginConfig appInfo={appInfo} appInfoLoaded={getInfoLoading} onUpdate={handleUpdateApp} />
      )}
    </PageContainer>,
  );
};

export default EditApp;
