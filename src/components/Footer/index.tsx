import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: 'WeCoding',
  });
  const websiteMessage = intl.formatMessage({
    id: 'app.copyright.website',
    defaultMessage: 'WeCoding',
  });
  const helpDocMessage = intl.formatMessage({
    id: 'app.copyright.helpDoc',
    defaultMessage: 'WeCoding',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'websiteMessage',
          title: `${websiteMessage}`,
          href: 'http://authz.wecoding.top',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/coding-hui/iam',
          blankTarget: true,
        },
        {
          key: 'helpDocMessage',
          title: `${helpDocMessage}`,
          href: 'https://ant.design',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
