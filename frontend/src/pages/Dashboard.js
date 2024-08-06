import React from 'react';
import { RightCircleTwoTone } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
const { Content, Sider } = Layout;

export function Dashboard() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  const pathItems = useLocation().pathname.split('/').filter(item => item);
  const pathLength = pathItems.length;
  const reallpathItems = pathItems.map((item, index) => ({
    key: index,
    title: index === pathLength - 1 ? (
      <span>{item}</span>
    ) : (
      <Link to={`/${pathItems.slice(0, index + 1).join('/')}`}>{item}</Link>
    )
  }));

  const items = [
    {
      key: '1',
      label: 'Dashboard',
      icon: <RightCircleTwoTone />,
      children: [
        {
          key: '1-1',
          label: <Link to="/dashboard/mutilmodal">Mutil Modal</Link>,
        },
        {
          key: '1-2',
          label: <Link to="/dashboard/survival_prediction">Survival Prediction</Link>,
        },
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        <Sider
          width="20%"
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['1']}
            style={{
              height: '100%',
              borderRight: 0,
            }}
            items={items}
          />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
            flex: '1 1 auto',
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '16px 0',
          }}>
            <Breadcrumb items={reallpathItems} />
            <div>
              <span style={{ marginRight: 16 }}>welcome {localStorage.getItem('username')}</span>
              <Button type="primary" shape="circle" onClick={() => {
                localStorage.removeItem('isLogin');
                navigate('/manage/login');
              }} icon={<RightCircleTwoTone />} />
            </div>
          </div>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
