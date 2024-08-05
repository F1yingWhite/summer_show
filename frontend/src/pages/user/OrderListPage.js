import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Button } from 'antd';

export function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(orders);
  }, []);

  const handleViewOrder = (id) => {
    navigate(`/user/dashboard/orderDetails/${id}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>订单列表</h1>
      <List
        bordered
        dataSource={orders}
        renderItem={(item) => (
          <List.Item>
            <div style={styles.listItem}>
              <span style={styles.orderId}>订单ID: {item.id}</span>
              <Button type="primary" onClick={() => handleViewOrder(item.id)} style={styles.button}>
                查看详情
              </Button>
            </div>
          </List.Item>
        )}
      />
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
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  orderId: {
    fontSize: '18px',
  },
  button: {
    marginLeft: '10px',
  },
};
