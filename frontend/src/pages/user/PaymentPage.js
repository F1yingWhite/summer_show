import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';

export function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handlePayment = () => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(order => order.id === id);
    if (orderIndex !== -1) {
      orders[orderIndex].status = '付款';
      localStorage.setItem('orders', JSON.stringify(orders));
      navigate(`/user/dashboard/paymentSuccess/${id}`);
    }
  };

  const order = JSON.parse(localStorage.getItem('orders')).find(order => order.id === id);
  if (!order) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>支付页面</h1>
      <p style={styles.price}>实付款: ￥{order.price}</p>
      <Button type="primary" onClick={handlePayment} style={styles.button}>确认支付</Button>
    </div>
  );
}

const styles = {
  container: {
    padding: '10px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  price: {
    fontSize: '18px',
    marginBottom: '20px',
  },
  button: {
    width: '80%',
    backgroundColor: '#ffa500',
    borderColor: '#ffa500',
    marginBottom: '10px',
  },
};
