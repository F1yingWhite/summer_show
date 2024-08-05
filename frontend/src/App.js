import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useEffect, useState, createContext } from "react";
import { initData } from "./utils/initData";
import { Spin } from 'antd';
import { IndexedDBStorage } from "./utils/indexdb";

export const ProductContext = createContext(null);

function App() {
  const [load, setLoad] = useState(true);
  const [storage, setStorage] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      await Promise.all([initData(), initStorage()]);
      setLoad(false);
    };

    const initStorage = async () => {
      let storage = new IndexedDBStorage('MyDatabase', 'products');
      await storage.init();
      setStorage(storage);
    };

    initialize();
  }, []);

  return (
    <ProductContext.Provider value={storage}>
      {
        load && <Spin spinning={load} fullscreen />
      }
      <RouterProvider router={router} />
    </ProductContext.Provider>
  );
}

export default App;
