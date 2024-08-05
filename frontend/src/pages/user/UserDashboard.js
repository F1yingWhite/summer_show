import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { isLogin } from '../../utils/authorize';

const { Content, Footer } = Layout;

const menuItems = [
  { key: 'home', icon: <HomeOutlined style={{ fontSize: '24px' }} />, label: '主页' },
  { key: 'categories', icon: <AppstoreOutlined style={{ fontSize: '24px' }} />, label: '分类' },
  { key: 'cart', icon: <ShoppingCartOutlined style={{ fontSize: '24px' }} />, label: '购物车' },
  { key: 'profile', icon: <UserOutlined style={{ fontSize: '24px' }} />, label: '个人主页' },
];

export function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const nowKey = location.pathname.split('/').pop();
  const [selectedKey, setSelectedKey] = useState(nowKey);

  const handleMenuClick = ({ key }) => {
    if (key !== selectedKey) {
      setSelectedKey(key);
      navigate(`/user/dashboard/${key}`);
    }
  };

  useEffect(() => {
    if (!isLogin()) {
      navigate('/user/login');
    }
  }, [navigate]);

  useEffect(() => {
    const key = location.pathname.split('/').pop();
    setSelectedKey(key);
    if (location.pathname === '/user/dashboard') {
      navigate('/user/dashboard/home');
      setSelectedKey('home');
    }
  }, [location, navigate]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '0', marginBottom: '60px' }}>
        <Outlet />
      </Content>
      <Footer style={{ position: 'fixed', width: '100%', bottom: 0, padding: 0, zIndex: 1000 }}>
        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          style={{ textAlign: 'center', display: 'flex', justifyContent: 'space-around' }}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} style={{ flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', marginTop: '10px' }}>
                {item.icon}
                <span style={{ marginLeft: '0px' }}>{item.label}</span>
              </div>
            </Menu.Item>
          ))}
        </Menu>
      </Footer>
    </Layout>
  );
}
