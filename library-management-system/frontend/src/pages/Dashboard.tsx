import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { BookOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="总藏书量"
              value={1234}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="注册用户"
              value={567}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="借阅中"
              value={89}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 