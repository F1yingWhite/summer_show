import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';

export function SelectPaymentMethodPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSelectPaymentMethod = (method) => {
    if (method === '支付宝') {
      navigate(`/user/dashboard/alipay/${id}`);
    } else if (method === '微信') {
      navigate(`/user/dashboard/wechatpay/${id}`);
    } else if (method === '银行卡') {
      navigate(`/user/dashboard/bankcardpay/${id}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>选择支付方式</h1>
      <Button onClick={() => handleSelectPaymentMethod('支付宝')} style={styles.button}>支付宝</Button>
      <Button onClick={() => handleSelectPaymentMethod('微信')} style={styles.button}>微信</Button>
      <Button onClick={() => handleSelectPaymentMethod('银行卡')} style={styles.button}>银行卡</Button>
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
  button: {
    width: '100%',
    marginBottom: '10px',
  },
};
