import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col } from 'antd';

export function ProductListPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(products);
  }, []);

  const handleCardClick = (id) => {
    navigate(`/user/dashboard/product/${id}`);
  };

  return (
    <div>
      <h1>商品列表</h1>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col span={6} key={product.id}>
            <Card
              hoverable
              cover={<img alt={product.name} src={product.image} />}
              onClick={() => handleCardClick(product.id)}
            >
              <Card.Meta title={product.name} description={`价格: ￥${product.price}`} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
