import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card } from 'antd';

export function PaymentConfirmPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handlePaymentSuccess = () => {
    navigate(`/user/dashboard/paymentSuccess/${id}`);
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <h1 style={styles.title}>确认付款</h1>
        <p style={styles.instruction}>请确认您的付款已完成：</p>
        <Button type="primary" onClick={handlePaymentSuccess} style={styles.button}>确认</Button>
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
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '26px',
    marginBottom: '20px',
    color: 'rgb(204, 85, 61)',
  },
  instruction: {
    fontSize: '18px',
    marginBottom: '20px',
    color: '#555',
  },
  button: {
    width: '80%',
    backgroundColor: 'rgb(204, 85, 61)',
    borderColor: 'rgb(204, 85, 61)',
  },
};

export default PaymentConfirmPage;
