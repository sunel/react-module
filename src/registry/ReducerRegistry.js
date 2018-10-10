import { combineReducers } from 'redux-immutable'
import reduceReducers from 'reduce-reducers'

export default class ReducerRegistry {
    _reducers = {};

    get reducers() {
      return reduceReducers(combineReducers(this._reducers))
    }

    add(name, reducer) {
      this._reducers[name] = reducer
    }

    remove(name) {
      delete this._reducers[name]
    }
}
