import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createTime: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      role: '管理员',
      createTime: '2024-01-01',
    },
    {
      id: '2',
      username: 'user1',
      email: 'user1@example.com',
      role: '普通用户',
      createTime: '2024-01-02',
    },
    {
      id: '3',
      username: 'librarian',
      email: 'librarian@example.com',
      role: '图书管理员',
      createTime: '2024-01-03',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = (user: User) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 ${user.username} 吗？`,
      onOk: () => {
        setUsers(users.filter(u => u.id !== user.id));
        message.success('删除成功');
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        // 编辑现有用户
        setUsers(users.map(user =>
          user.id === editingUser.id ? { ...user, ...values } : user
        ));
        message.success('更新成功');
      } else {
        // 添加新用户
        const newUser = {
          id: Date.now().toString(),
          ...values,
          createTime: new Date().toISOString().split('T')[0],
        };
        setUsers([...users, newUser]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    });
  };

  return (
    <div className="user-management">
      <Card
        title="用户管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加用户
          </Button>
        }
      >
        <Table columns={columns} dataSource={users} rowKey="id" />
      </Card>

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 