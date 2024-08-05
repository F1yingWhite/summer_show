import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Image } from 'antd';

export function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const selectedOrder = orders.find((order) => order.id === id);
    setOrder(selectedOrder);
  }, [id]);

  const handleBackHome = () => {
    navigate('/user/dashboard/home');
  };

  if (!order) return <div style={styles.loading}>加载中...</div>;

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <h1 style={styles.title}>订单详情</h1>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Image src={order.img} alt={order.productName} style={styles.productImage} />
          </Col>
          <Col span={16}>
            <p style={styles.detail}><strong>商品名称:</strong> {order.productName}</p>
            <p style={styles.detail}><strong>价格:</strong> ￥{order.price}</p>
            <p style={styles.detail}><strong>数量:</strong> {order.amount}</p>
          </Col>
        </Row>
        <p style={styles.detail}><strong>收货地址:</strong> {order.address}</p>
        <p style={styles.detail}><strong>收货人姓名:</strong> {order.receiverName}</p>
        <p style={styles.detail}><strong>收货人电话:</strong> {order.receiverPhone}</p>
        <p style={styles.detail}><strong>备注:</strong> {order.remark}</p>
        <p style={styles.detail}><strong>订单状态:</strong> {order.status}</p>
        <p style={styles.detail}><strong>订单时间:</strong> {order.time}</p>
        <Button type="primary" onClick={handleBackHome} style={styles.button}>返回首页</Button>
      </Card>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '600px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: 'rgb(204, 85, 61)',
  },
  detail: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  button: {
    width: '100%',
    marginTop: '20px',
    backgroundColor: 'rgb(204, 85, 61)',
    borderColor: 'rgb(204, 85, 61)',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '20px',
  },
  productImage: {
    width: '100%',
    height: 'auto',
  },
};

export default OrderDetailsPage;
