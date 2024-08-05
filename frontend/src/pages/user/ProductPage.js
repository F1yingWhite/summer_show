import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Image, Row, Col, Carousel, message } from 'antd';
import { ProductContext } from '../../App';
import { v4 as uuidv4 } from "uuid";

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const storage = useContext(ProductContext);

  useEffect(() => {
    var products = [];
    const fetchProducts = async () => {
      try {
        const storedProducts = await storage.getItem('products').then(products => products.value);
        products = storedProducts;
        const selectedProduct = products.find((product) => product.id === id);
        setProduct(selectedProduct);
      } catch (error) {
        products = [];
      }
    };
    if (storage) {
      fetchProducts();
    }
  }, [id, storage]);

  const handleBuyNow = () => {
    navigate(`/user/dashboard/createOrder/${id}`);
  };

  const handleAddCart = () => {
    const cart = localStorage.getItem('shoppingCart') ? JSON.parse(localStorage.getItem('shoppingCart')) : [];
    const username = localStorage.getItem('username');
    const existingItem = cart.find(item => item.productId === id && item.username === username);
    if (existingItem) {
      existingItem.amount += 1;
    } else {
      const newCartItem = {
        id: uuidv4(),
        productName: product.name,
        productId: product.id,
        price: product.price,
        amount: 1,
        img: product.imageList[0],
        maxNumber: product.stock,
        username,
      };
      cart.push(newCartItem);
    }
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    message.success('成功加入购物车');
  }

  if (!product) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Carousel autoplay>
            {product.imageList.map((img, index) => (
              <div key={index} style={styles.carouselImageContainer}>
                <Image src={img} alt={`${product.name} ${index + 1}`} style={styles.carouselImage} />
              </div>
            ))}
          </Carousel>
        </Col>
        <Col span={24}>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.price}>价格: ￥{product.price}</p>
          <p style={styles.stock}>库存: {product.stock}</p>
          <p style={styles.sales}>销量: {product.sales}</p>
          <Button type="primary" onClick={handleBuyNow} style={styles.buyButton}>
            立即购买
          </Button>
          <Button style={styles.cartButton} onClick={handleAddCart}>加入购物车</Button>
        </Col>
      </Row>
      <div style={styles.imagesContainer}>
        <h2 style={styles.subTitle}>商品详情</h2>
        {product.imageList.map((img, index) => (
          <Image key={index} src={img} alt={`${product.name} ${index + 1}`} style={styles.productImage} />
        ))}
      </div>
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
    marginBottom: '10px',
    color: 'red',
  },
  stock: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  sales: {
    fontSize: '16px',
    marginBottom: '20px',
  },
  buyButton: {
    width: '100%',
    marginBottom: '10px',
    backgroundColor: '#ff4d4f',
    borderColor: '#ff4d4f',
  },
  cartButton: {
    width: '100%',
  },
  carouselImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  imagesContainer: {
    marginTop: '20px',
  },
  subTitle: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  productImage: {
    width: '100%',
    marginBottom: '0px',
    marginTop: '-6px',
  },
};
