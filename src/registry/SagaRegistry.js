export default class SagaRegistry {
    _sagas = {};
    _store;

    get store() {
      return this._store
    }
    set store(value) {
      this._store = value
    }

    get sagas() {
      return this._sagas
    }

    add(name, saga) {
      this._sagas[name] = this.store.runSaga(saga)
    }

    remove(name) {
      this._sagas[name].cancel()
      delete this._sagas[name]
    }
}
