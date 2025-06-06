import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  BookOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import './App.css';

const { Header, Content, Footer, Sider } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);

  const handleMenuClick = (key: string) => {
    switch (key) {
      case '1':
        navigate('/dashboard');
        break;
      case '2':
        navigate('/books');
        break;
      case '3':
        navigate('/users');
        break;
      case '4':
        navigate('/borrows');
        break;
      case '5':
        navigate('/login');
        break;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo">图书管理系统</div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          onClick={({ key }) => handleMenuClick(key)}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            仪表盘
          </Menu.Item>
          <Menu.Item key="2" icon={<BookOutlined />}>
            图书管理
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            用户管理
          </Menu.Item>
          <Menu.Item key="4" icon={<ShoppingCartOutlined />}>
            借阅管理
          </Menu.Item>
          <Menu.Item key="5" icon={<LogoutOutlined />}>
            退出登录
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="header">
          <div className="header-title">图书管理系统</div>
        </Header>
        <Content className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          图书管理系统 ©{new Date().getFullYear()} Created by Your Company
        </Footer>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </Router>
  );
};

export default App; 