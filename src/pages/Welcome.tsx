import { PageContainer } from '@ant-design/pro-components';
import { useModel, useIntl } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
}> = ({ title, href, index, desc }) => {
  const intl = useIntl();
  const { useToken } = theme;
  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'start',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <a href={href} target="_blank" rel="noreferrer">
        {intl.formatMessage({ id: 'pages.welcome.learnMore' })}
        {' >'}
      </a>
    </div>
  );
};

const Welcome: React.FC = () => {
  const intl = useIntl();
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');

  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
            }}
          >
            {intl.formatMessage({ id: 'pages.welcome.title' })}
          </div>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            {intl.formatMessage({ id: 'pages.welcome.description' })}
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              marginBottom: '24px',
            }}
          >
            <InfoCard
              index={1}
              href="https://umijs.org/docs/introduce/introduce"
              title={intl.formatMessage({ id: 'pages.welcome.gettingStarted.title' })}
              desc={intl.formatMessage({ id: 'pages.welcome.gettingStarted.desc' })}
            />
            <InfoCard
              index={2}
              title={intl.formatMessage({ id: 'pages.welcome.identitySource.title' })}
              href="https://ant.design"
              desc={intl.formatMessage({ id: 'pages.welcome.identitySource.desc' })}
            />
            <InfoCard
              index={3}
              title={intl.formatMessage({ id: 'pages.welcome.identityProvider.title' })}
              href="https://procomponents.ant.design"
              desc={intl.formatMessage({ id: 'pages.welcome.identityProvider.desc' })}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              index={4}
              title={intl.formatMessage({ id: 'pages.welcome.permissions.title' })}
              href="https://procomponents.ant.design"
              desc={intl.formatMessage({ id: 'pages.welcome.permissions.desc' })}
            />
            <InfoCard
              index={5}
              title={intl.formatMessage({ id: 'pages.welcome.systemConfig.title' })}
              href="https://procomponents.ant.design"
              desc={intl.formatMessage({ id: 'pages.welcome.systemConfig.desc' })}
            />
            <InfoCard
              index={6}
              title={intl.formatMessage({ id: 'pages.welcome.securityConfig.title' })}
              href="https://procomponents.ant.design"
              desc={intl.formatMessage({ id: 'pages.welcome.securityConfig.desc' })}
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
