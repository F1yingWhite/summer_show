import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';

export function PaymentSuccessPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleViewOrder = () => {
    navigate(`/user/dashboard/orderDetails/${id}`);
  };

  const handleBackHome = () => {
    navigate('/user/dashboard/home');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>支付成功</h1>
      <Button type="primary" onClick={handleViewOrder} style={{ ...styles.button, marginBottom: '10px' }}>查看订单</Button>
      <Button onClick={handleBackHome} style={styles.button}>返回首页</Button>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: '26px',
    marginBottom: '20px',
    color: 'rgb(204, 85, 61)',
  },
  button: {
    width: '80%',
    backgroundColor: 'rgb(204, 85, 61)',
    borderColor: 'rgb(204, 85, 61)',
    color: '#fff',
    margin: '0 auto',
  },
};
