import { ClassificationPage } from "../pages/user/ClassificationPage";
import { MainPage } from "../pages/user/MainPage";
import  ShoppingCart  from "../pages/user/ShoppingCart";
import { UserDashboard } from "../pages/user/UserDashboard";
import { UserLogin } from "../pages/user/UserLogin";
import { UserPage } from "../pages/user/UserPage";
import { ProductListPage } from "../pages/user/ProductListPage";
import { ProductPage } from "../pages/user/ProductPage";
import { CreateOrderPage } from "../pages/user/CreateOrderPage";
import { PaymentPage } from "../pages/user/PaymentPage";
import { SelectPaymentMethodPage } from "../pages/user/SelectPaymentMethodPage";
import { AlipayPaymentPage } from "../pages/user/AIipay/AlipayPaymentPage";
import { AlipayConfirmPage } from "../pages/user/AIipay/AlipayConfirmPage";
import { AlipaySuccessPage } from "../pages/user/AIipay/AlipaySuccessPage";
import { BankCardPaymentPage } from "../pages/user/BankCardPaymentPage";
import { WeChatPaymentPage } from "../pages/user/AIipay/WeChatPaymentPage";
import { PaymentConfirmPage } from "../pages/user/PaymentConfirmPage";
import { PaymentSuccessPage } from "../pages/user/PaymentSuccessPage";
import { OrderDetailsPage } from "../pages/user/OrderDetailsPage";
import { OrderListPage } from "../pages/user/OrderListPage";

const userRouters = [
  {
    path: "login",
    element: <UserLogin />,
  },
  {
    path: "dashboard",
    element: <UserDashboard />,
    children: [
      {
        path: "home",
        element: <MainPage />
      },
      {
        path: "categories",
        element: <ClassificationPage />
      },
      {
        path: "cart",
        element: <ShoppingCart />
      },
      {
        path: "profile",
        element: <UserPage />
      },
      {
        path: "products",
        element: <ProductListPage />
      },
      {
        path: "product/:id",
        element: <ProductPage />
      },
      {
        path: "createOrder/:id",
        element: <CreateOrderPage />
      },
      {
        path: "payment/:id",
        element: <PaymentPage />
      },
      {
        path: "selectPaymentMethod/:id",
        element: <SelectPaymentMethodPage />
      },
      {
        path: "alipay/:id",
        element: <AlipayPaymentPage />
      },
      {
        path: "alipayConfirm/:id",
        element: <AlipayConfirmPage />
      },
      {
        path: "alipaySuccess/:id",
        element: <AlipaySuccessPage />
      },
      {
        path: "bankcardpay/:id",
        element: <BankCardPaymentPage />
      },
      {
        path: "wechatpay/:id",
        element: <WeChatPaymentPage />
      },
      {
        path: "paymentConfirm/:id",
        element: <PaymentConfirmPage />
      },
      {
        path: "paymentSuccess/:id",
        element: <PaymentSuccessPage />
      },
      {
        path: "orderDetails/:id",
        element: <OrderDetailsPage />
      },
      {
        path: "orders",
        element: <OrderListPage />
      }
    ]
  }
];

export default userRouters;
