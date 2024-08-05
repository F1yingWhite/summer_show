import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';

export function AlipayPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleProceedToConfirm = () => {
    navigate(`/user/dashboard/alipayConfirm/${id}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>支付宝付款</h1>
      <p style={styles.instruction}>请扫描以下二维码进行支付：</p>
      {/* 这里可以添加二维码图片 */}
      <img src={`${process.env.PUBLIC_URL}/assets/ali.png`} alt="WeChat Pay" style={styles.image} />

      <Button type="primary" onClick={handleProceedToConfirm} style={styles.button}>继续</Button>
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
    backgroundColor: 'blue',
  },
};
