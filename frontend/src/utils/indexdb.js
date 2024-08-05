export class IndexedDBStorage {
  constructor(dbName = 'MyDatabase', storeName = 'products') {
    this.dbName = dbName;
    this.storeName = storeName;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      let request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = event => {
        let db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };

      request.onsuccess = event => {
        this.db = event.target.result;
        console.log('Database initialized');
        resolve(); // 成功初始化，resolve Promise
      };

      request.onerror = event => {
        console.error('Database error:', event.target.error);
        reject(event.target.error); // 初始化失败，reject Promise
      };
    });
  }

  async getItem(key) {
    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction([this.storeName], 'readonly');
      let objectStore = transaction.objectStore(this.storeName);

      let request = objectStore.get(key);

      request.onsuccess = event => {
        resolve(event.target.result);
      };

      request.onerror = event => {
        reject('Error getting item:', event.target.error);
      };
    });
  }

  async setItem(key, value) {
    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction([this.storeName], 'readwrite');
      let objectStore = transaction.objectStore(this.storeName);
      let request = objectStore.put({ id: key, value: value });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = event => {
        reject('Error setting item:', event.target.error);
      };
    });
  }

  async removeItem(key) {
    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction([this.storeName], 'readwrite');
      let objectStore = transaction.objectStore(this.storeName);
      let request = objectStore.delete(key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = event => {
        reject('Error removing item:', event.target.error);
      };
    });
  }

  async clear() {
    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction([this.storeName], 'readwrite');
      let objectStore = transaction.objectStore(this.storeName);
      let request = objectStore.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = event => {
        reject('Error clearing store:', event.target.error);
      };
    });
  }
}
