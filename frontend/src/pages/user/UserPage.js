import React from 'react';
import { Layout,List, Typography, Card } from 'antd';
import {
  ProfileOutlined,
  PayCircleOutlined,
  ShoppingOutlined,
  TagsOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  StarOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title } = Typography;

export function UserPage() {

const navigate = useNavigate();
  const handleOrder =(key)=>{
    if (key === '全部订单')
    navigate('/user/dashboard/orders');
  }
  const data = [
    { title: '全部订单', icon: <ProfileOutlined /> },
    { title: '待付款', icon: <PayCircleOutlined /> },
    { title: '待收货', icon: <ShoppingOutlined /> },
    { title: '退款/售后', icon: <TagsOutlined /> },
  ];

  const profileData = [
    { title: '地址管理', icon: <EnvironmentOutlined /> },
    { title: '我的足迹', icon: <ClockCircleOutlined /> },
    { title: '我的关注', icon: <HeartOutlined /> },
    { title: '我的收藏', icon: <StarOutlined /> },
  ];

  let username = localStorage.getItem("username");
  return (
    <Layout>
 <Header style={{ background: '#fff', padding: 0, textAlign: 'center', height: '20vh', position: 'relative' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/userback.png`}
            alt="profile"
            style={{ width: '100vh', height: '20vh'}}
          />
          <Title style={{ position: 'absolute', top: '60%', left: '30%', transform: 'translate(-50%, -50%)', color: 'white' }}>
            {username}
          </Title>
        </div>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={data}
          renderItem={item => (
            <List.Item key={item.title}>
              <Card bordered={false} style={{ textAlign: 'center' }} onClick={() => handleOrder(item.title)}>
                {item.icon}
                <p>{item.title}</p>
              </Card>
            </List.Item>
          )}
        />
        <List
          itemLayout="horizontal"
          dataSource={profileData}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={item.icon}
                title={item.title}
              />
            </List.Item>
          )}
        />
      </Content>
    </Layout>
  );
};
