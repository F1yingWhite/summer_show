import React, { useState, useEffect, useContext } from 'react';
import { Input, Carousel, Card, Row, Col, Pagination } from 'antd';
import { ScanOutlined, HeartOutlined, FallOutlined, BulbOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../../App';
const { Search } = Input;

const carouselImages = [
  'https://th.bing.com/th/id/R.630e1bfe6676cd53bca93f0cd0e7b852?rik=7MJBN%2firDzd8jg&riu=http%3a%2f%2fimages.osogoo.com%2farticle%2fab15d2e31b53f9b4cd%2f201910081101509971.jpg&ehk=l1DTlIu5uXQiKdZI2pwmJ2p%2b09kNREeN0t1PkUqrz4M%3d&risl=&pid=ImgRaw&r=0',
  'https://img.zcool.cn/community/01d9e258d0ccc4a801219c77a0fa44.jpg@2o.jpg',
  'https://www.zcsj-cn.com/uploads/allimg/220902/1-220Z20933343L.jpg',
  'https://th.bing.com/th/id/R.88c8ab1c4ca82125f41a9ccd893f5441?rik=PgLMSGlZBq89MA&riu=http%3a%2f%2fimg95.699pic.com%2fphoto%2f50064%2f2743.jpg_wh860.jpg&ehk=H9HL%2bpw4Q0X6mJ1dtX971YAdFbeaHVveGmddr63AkyU%3d&risl=&pid=ImgRaw&r=0',
];

const categories = [
  { icon: <BulbOutlined style={{ fontSize: '32px' }} />, label: '专题' },
  { icon: <ScanOutlined style={{ fontSize: '32px' }} />, label: '活动' },
  { icon: <HeartOutlined style={{ fontSize: '32px' }} />, label: '优选' },
  { icon: <FallOutlined style={{ fontSize: '32px' }} />, label: '特惠' },
];

export function MainPage() {
  const [hotProducts, setHotProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const storage = useContext(ProductContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const storedProducts = await storage.getItem('products').then(products => products.value);
        setHotProducts(storedProducts);
        setAllProducts(storedProducts);
      } catch (error) {
        setAllProducts([]);
        setHotProducts([]);
      }
    };

    if (storage) {
      fetchProducts();
    }
  }, [storage]);

  const handleCardClick = (id) => {
    navigate(`/user/dashboard/product/${id}`);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = hotProducts.slice(startIndex, startIndex + pageSize);

  const handleSearch = (value) => {
    const filteredProducts = allProducts.filter(product => product.name.includes(value));
    setHotProducts(filteredProducts);
    setCurrentPage(1); // 重置到第一页
  };

  return (
    <div style={{ padding: '0px' }}>
      <div style={{ backgroundColor: "rgb(204, 85, 61)", padding: '20px' }}>
        <Search
          placeholder="搜索商品"
          enterButton="搜索"
          size="large"
          onSearch={handleSearch}
          style={{ marginBottom: '20px' }}
          addonBefore={<ScanOutlined />}
        />
        <Carousel autoplay>
          {carouselImages.map((src, index) => (
            <div key={index}>
              <img src={src} alt={`carousel-${index}`} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
            </div>
          ))}
        </Carousel>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
          {categories.map((category, index) => (
            <div key={index} style={{ textAlign: 'center', color: 'white' }}>
              {category.icon}
              <div>{category.label}</div>
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ marginTop: '20px', paddingLeft: '10px', fontSize: '24px' }}>热门商品</h2>
      <Row gutter={[16, 16]} style={{ margin: '10px' }}>
        {currentProducts.map((product, index) => (
          <Col key={index} span={12}>
            <Card
              hoverable
              cover={<img alt={product.name} src={product.imageList[0]} />}
              onClick={() => handleCardClick(product.id)}
            >
              <Card.Meta title={product.name} description={product.price + '￥'} />
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={hotProducts.length}
        onChange={handlePageChange}
        style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px' }}
      />
    </div>
  );
}
