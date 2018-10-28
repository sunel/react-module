import { all } from 'redux-saga/effects'

export default class SagaRegistry {
    _sagas = {}

    get sagas() {
      function * rootSaga() {
        yield all(this._sagas)
      }

      return rootSaga.bind(this)
    }

    add(name, saga) {
      this._sagas[name] = saga
    }

    remove(name) {
      this._sagas[name].cancel()
      delete this._sagas[name]
    }
}
