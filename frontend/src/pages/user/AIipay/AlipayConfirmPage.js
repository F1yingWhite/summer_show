import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';

export function AlipayConfirmPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handlePaymentSuccess = () => {
    navigate(`/user/dashboard/alipaySuccess/${id}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>确认付款</h1>
      <p style={styles.instruction}>请确认您的付款已完成：</p>
      <Button type="primary" onClick={handlePaymentSuccess} style={styles.button}>确认</Button>
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
  instruction: {
    fontSize: '18px',
    marginBottom: '20px',
  },
  button: {
    width: '100%',
  },
};
