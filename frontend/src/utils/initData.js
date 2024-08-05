import CryptoJS from "crypto-js";
import { getFileBase64 } from "./img2base64";
import { v4 as uuidv4 } from "uuid";
import { IndexedDBStorage } from "./indexdb";

async function initLocalStorageItem(key, defaultValue) {
  let item = JSON.parse(localStorage.getItem(key)) || [];
  if (item.length === 0) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    item = defaultValue;
  }
  return item;
}

async function initProducts(productStorage) {
  let products = await productStorage.getItem("products").then(product => product.value).catch(error => {
    console.error("没找到" + error);
    return [];
  });

  if (products.length === 0) {
    const tags = ['手机数码', '电脑办公', '汽车用品', '家用电器', '家居家装'];
    const fetchPromises = tags.map(tag =>
      fetch(`${process.env.PUBLIC_URL}/data/${tag}.json`)
        .then((response) => response.json())
        .then(async (data) => {
          for (let product of data) {
            product.name = product.product_name;
            product.id = uuidv4();
            product.seller = "seller";
            product.classification = tag;
            product.price = parseFloat(product.product_price);
            product.sales = parseInt(product.product_sales);
            product.stock = parseInt(product.product_stock);
            product.imageList = [];
            for (let image of product.carousel_images) {
              product.imageList.push(await getFileBase64(new Request(image).url));
            }
            products.push(product);
          }
        })
    );
    await Promise.all(fetchPromises)
      .then(() => productStorage.setItem("products", products))
      .catch((error) => console.error('Error fetching the data:', error));
  }
  return products;
}


export async function initData() {
  try {
    await initLocalStorageItem("user", [
      {
        username: 'admin',
        password: CryptoJS.SHA256('Admin123456').toString(),
        email: "81723334@qq.com",
        privilege: "管理员"
      },
      {
        username: 'user',
        password: CryptoJS.SHA256('User123456').toString(),
        email: "21301172@bjtu.edu.cn",
        privilege: "普通用户"
      },
      {
        username: 'seller',
        password: CryptoJS.SHA256('Seller123456').toString(),
        email: "21301173@bjtu.edu.cn",
        privilege: "商家"
      }
    ]);

    await initLocalStorageItem('privileges', [
      {
        role: '管理员',
        desc: '拥有所有权限'
      },
      {
        role: '普通用户',
        desc: '只能查看'
      },
      {
        role: "商家",
        desc: "能够管理商城商品"
      }
    ]);

    await initLocalStorageItem('menus', [
      {
        title: '权限管理',
        parent: "",
        path: "",
      },
      {
        title: '用户管理',
        parent: '权限管理',
        path: '/userControl',
        allowUser: [
          '管理员'
        ]
      },
      {
        title: '角色管理',
        parent: '权限管理',
        path: '/roleControl',
        allowUser: [
          '管理员'
        ]
      },
      {
        title: '菜单管理',
        parent: '权限管理',
        path: '/menuControl',
        allowUser: [
          '管理员'
        ]
      },
      {
        title: "商城管理",
        parent: "",
        path: ""
      },
      {
        title: "订单列表",
        parent: "商城管理",
        path: "/orderControl",
        allowUser: [
          '管理员',
          '商家'
        ]
      },
      {
        title: "商品列表",
        parent: "商城管理",
        path: "/productsControl",
        allowUser: [
          '管理员',
          '商家'
        ]
      },
      {
        title: "分类列表",
        parent: "商城管理",
        path: "/classControl",
        allowUser: [
          '管理员',
        ]
      }
    ]);

    let productStorage = new IndexedDBStorage('MyDatabase', 'products');
    await productStorage.init()
    let products = await initProducts(productStorage);

    await initLocalStorageItem('orders', [
      {
        img: products[0].imageList[0],
        id: uuidv4(),
        userId: "user",
        sellerId: "seller",
        productId: products[0].id,
        productName: products[0].name,
        address: "北京市海淀区",
        receiverName: "张三",
        receiverPhone: "13800000000",
        remark: "请尽快发货",
        time: new Date().toLocaleString(),
        amount: 1,
        price: 8848,
        status: "付款"
      }
    ]);

    await initLocalStorageItem('classifications', [
      {
        name: "手机数码",
      },
      {
        name: "家用电器",
      },
      {
        name: "家居家装",
      },
      {
        name: "汽车用品",
      },
      {
        name: "电脑办公",
      }
    ]);

    await initLocalStorageItem('shoppingCart', [
      // {
      //   id: uuidv4(),
      //   username: 'admin',
      //   productId: products[0].id,
      //   maxNumber: products[0].stock,
      //   productName: products[0].name,
      //   amount: 1,
      //   price: products[0].price,
      //   img: products[0].imageList[0]
      // }
    ]

    );
  } catch (error) {
    console.error('Error initializing data:', error);
    throw error;
  }


}
