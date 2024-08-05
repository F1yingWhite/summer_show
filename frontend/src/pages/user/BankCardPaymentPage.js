import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';

export function BankCardPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleProceedToConfirm = () => {
    navigate(`/user/dashboard/paymentConfirm/${id}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>银行卡付款</h1>
      <p style={styles.instruction}>请填写您的银行卡信息进行支付：</p>
      <img src={`${process.env.PUBLIC_URL}/assets/bank.png`} alt="WeChat Pay" style={styles.image} />
      <Button type="primary" onClick={handleProceedToConfirm} style={styles.button}>继续</Button>
    </div>
  );
}

const styles = {
  container: {
    padding: '10px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center', // 添加此行以居中对齐内容
  },
  title: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  instruction: {
    fontSize: '18px',
    marginBottom: '20px',
  },
  image: {
    display: 'block',
    margin: '0 auto', // 添加此行以居中图片
    maxWidth: '100%', // 确保图片适应容器
  },
  button: {
    width: '100%',
    backgroundColor: 'red',
  },
};

export default BankCardPaymentPage;
