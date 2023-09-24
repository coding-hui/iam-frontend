import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Col, Row } from 'antd';
import OrgTree from '@/pages/Organization/Tree';
import UserList from '@/pages/User/List';

const INTL = {
  PAGE_CONTENT: {
    id: 'users.page.content',
  },
};

const OrgUser: React.FC = () => {
  const intl = useIntl();
  const leftLayout = { xxl: 5, lg: 6, md: 24, sm: 24, xs: 24 };
  const rightLayout = { xxl: 19, lg: 18, md: 24, sm: 24, xs: 24 };

  const [organization, setOrganization] = useState<{ id: string; name: string }>();

  const treeOnSelect = (id: string, name: string) => {
    setOrganization({ id: id, name: name });
  };

  return (
    <PageContainer content={intl.formatMessage(INTL.PAGE_CONTENT)}>
      <Row gutter={[16, 16]}>
        <Col {...leftLayout} style={{ minHeight: '100%', overflow: 'auto' }}>
          <OrgTree onSelect={treeOnSelect} />
        </Col>
        <Col {...rightLayout} style={{ minHeight: '100%', overflow: 'auto' }}>
          <UserList organization={organization} />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default OrgUser;
