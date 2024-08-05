import React, { useEffect, useState } from 'react';
import { Card, Button, List, InputNumber, Row, Col, Modal, Form, Input } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const [cart, setCart] = useState([]);
  const [allCart, setAllCart] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    const username = localStorage.getItem('username');
    if (storedCart.length > 0) {
      setAllCart(storedCart);
      const userCart = storedCart.filter(item => item.username === username);
      setCart(userCart);
    }
  }, []);

  const updateQuantity = (id, amount) => {
    const updatedCart = allCart.map(item => {
      if (item.id === id) {
        const newAmount = amount > item.maxNumber ? item.maxNumber : amount;
        return { ...item, amount: newAmount };
      }
      return item;
    });
    setAllCart(updatedCart);
    const userCart = updatedCart.filter(item => item.username === localStorage.getItem('username'));
    setCart(userCart);
    localStorage.setItem('shoppingCart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = allCart.filter(item => item.id !== id);
    setAllCart(updatedCart);
    const userCart = updatedCart.filter(item => item.username === localStorage.getItem('username'));
    setCart(userCart);
    localStorage.setItem('shoppingCart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    const updatedCart = allCart.filter(item => item.username !== localStorage.getItem('username'));
    setAllCart(updatedCart);
    setCart([]);
    localStorage.setItem('shoppingCart', JSON.stringify(updatedCart));
  };

  const totalAmount = cart.reduce((total, item) => total + item.price * item.amount, 0);

  const handleJiesuan = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFinish = (values) => {
    const orders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
    let navOrderId = ""
    // 每个商品创建一个订单
    for (let i = 0; i < cart.length; i++) {
      const product = cart[i];
      const newOrder = {
        ...values,
        userId: localStorage.getItem('username'),
        id: uuidv4(),
        productId: product.productId,
        productName: product.productName,
        price: product.price,
        status: "付款",
        time: new Date().toLocaleString(),
        amount: product.amount,
      };
      orders.push(newOrder);
      navOrderId = newOrder.id
    }
    localStorage.setItem('orders', JSON.stringify(orders));
    navigate(`/user/dashboard/selectPaymentMethod/${navOrderId}`);
    setIsModalVisible(false);
    clearCart();
    // const newOrder = {
    //   ...values,
    //   userId: localStorage.getItem('username'),
    //   id: uuidv4(),
    //   items: cart,
    //   price: totalAmount,
    //   status: "付款",
    //   time: new Date().toLocaleString(),
    // };
    // orders.push(newOrder);
    // localStorage.setItem('orders', JSON.stringify(orders));
    // navigate(`/user/dashboard/selectPaymentMethod/${newOrder.id}`);
    // setIsModalVisible(false);
    // clearCart();
  };

  return (
    <Card title="购物车" style={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
      <List
        itemLayout="horizontal"
        dataSource={cart}
        renderItem={item => (
          <List.Item
            actions={[
              <InputNumber
                min={1}
                max={item.maxNumber}
                value={item.amount}
                onChange={value => updateQuantity(item.id, value)}
              />,
              <Button
                type="primary"
                danger
                onClick={() => removeFromCart(item.id)}
              >
                删除
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<img src={item.img} alt={item.productName} style={{ width: 50 }} />}
              title={item.productName}
              description={`价格: ¥${item.price}`}
            />
          </List.Item>
        )}
      />
      <Row justify="space-between" style={{ marginTop: 20 }}>
        <Col>
          <Button type="default" onClick={clearCart}>清空</Button>
        </Col>
        <Col>
          <span style={{ fontSize: 16 }}>总计: ¥{totalAmount}</span>
        </Col>
        <Col>
          <Button type="primary" onClick={handleJiesuan}>去结算</Button>
        </Col>
      </Row>

      <Modal
        title="填写订单信息"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleFinish}>
          <Form.Item label="收货地址" name="address" rules={[{ required: true, message: '请输入收货地址' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="收货人姓名" name="receiverName" rules={[{ required: true, message: '请输入收货人姓名' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="收货人电话" name="receiverPhone" rules={[{ required: true, message: '请输入收货人电话' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="default" onClick={handleCancel} style={{ marginRight: 8 }}>返回</Button>
            <Button type="primary" htmlType="submit">提交订单</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ShoppingCart;
