import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Row, Col, Image, Divider, Space } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { ProductContext } from '../../App';

export function CreateOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const storage = useContext(ProductContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const storedProducts = await storage.getItem('products').then(products => products.value);
        const selectedProduct = storedProducts.find((product) => product.id === id);
        setProduct(selectedProduct);
      } catch (error) {
        console.log(error);
      }
    };

    if (storage) {
      fetchProduct();
    }
  }, [id, storage]);

  const handleFinish = async (values) => {
    const orders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
    const newOrder = {
      ...values,
      userId: localStorage.getItem('username'),
      id: uuidv4(),
      productId: product.id,
      productName: product.name,
      price: product.price,
      status: "付款",
      time: new Date().toLocaleString(),
      amount: 1,
      img: product.imageList[0]
    };
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    navigate(`/user/dashboard/selectPaymentMethod/${newOrder.id}`);
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <Card title="创建订单" style={styles.card}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Image src={product.imageList[0]} alt={product.name} style={styles.productImage} />
          </Col>
          <Col span={16}>
            <h2 style={styles.productName}>{product.name}</h2>
            <p style={styles.price}>价格: ￥{product.price}</p>
            <p style={styles.stock}>库存: {product.stock}</p>
            <p style={styles.sales}>销量: {product.sales}</p>
          </Col>
        </Row>
        <Divider />
        <Card title="收货信息" bordered={false} style={styles.innerCard}>
          <Form onFinish={handleFinish} layout="vertical">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item label="收货人姓名" name="receiverName" rules={[{ required: true, message: '请输入收货人姓名' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="收货人电话" name="receiverPhone" rules={[{ required: true, message: '请输入收货人电话' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="收货地址" name="address" rules={[{ required: true, message: '请输入收货地址' }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Card title="订单备注" bordered={false} style={styles.innerCard}>
              <Form.Item label="备注" name="remark">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Card>
            <Form.Item style={styles.formItem}>
              <Button type="primary" htmlType="submit" style={styles.button}>提交订单</Button>
            </Form.Item>
          </Form>
        </Card>
      </Card>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
  },
  card: {
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  innerCard: {
    marginBottom: '16px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: 'rgb(204, 85, 61)',
  },
  productImage: {
    width: '100%',
    height: 'auto',
  },
  productName: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  price: {
    fontSize: '18px',
    marginBottom: '10px',
    color: 'rgb(204, 85, 61)',
  },
  stock: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  sales: {
    fontSize: '16px',
    marginBottom: '20px',
  },
  form: {
    width: '100%',
  },
  formItem: {
    marginBottom: '10px',
  },
  button: {
    width: '100%',
    backgroundColor: 'rgb(204, 85, 61)',
    borderColor: 'rgb(204, 85, 61)',
  },
};

export default CreateOrderPage;
