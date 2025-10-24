import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import ApiKeyList from './List';

const INTL = {
  PAGE_CONTENT: {
    id: 'apikeys.page.content',
  },
};

const ApiKey: React.FC = () => {
  const intl = useIntl();

  return (
    <PageContainer content={intl.formatMessage(INTL.PAGE_CONTENT)}>
      <ApiKeyList />
    </PageContainer>
  );
};

export default ApiKey;
