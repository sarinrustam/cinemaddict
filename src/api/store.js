export default class Store {
  constructor(key, localStorage) {
    this._storageKey = key;
    this._storage = localStorage;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storageKey)) || {};
    } catch (error) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
        this._storageKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  setItems(items) {
    this._storage.setItem(
        this._storageKey,
        JSON.stringify(items)
    );
  }

  removeItem(key) {
    const store = this.getItems();

    delete store[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(store)
    );
  }
}
