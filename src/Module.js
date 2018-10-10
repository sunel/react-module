import forEach from 'lodash.foreach'
import camelCase from 'lodash.camelcase'

import { hasGetter } from './utils'

export const assertModule = (obj) => {
  if (!(obj.prototype instanceof Module)) {
    throw new Error(`${obj.name} must be instance of Module`)
  }
}

export default class Module {
  registers = [
    'routes', 'reducer', 'sagas'
  ]

  provides = {}

  app$

  constructor(app) {
    this.app$ = app
  }

  register() {
    this.app$.markAsRegistered(this)

    forEach(this.registers, (key, index) => {
      if (hasGetter(this, key)) {
        this[camelCase(`register_${key}`)]()
      }
    })
    forEach(this.provides, (Mod, key) => {
      assertModule(Mod);
      (new Mod(this.app$)).register()
    })
    return this
  }

  boot() {
  }

  registerRoutes() {
    this.routes(this.app$.router$)
  }

  registerReducer() {
    this.reducer(this.app$.reducerReg$)
  }

  registerSagas() {
    this.sagas(this.app$.sagaReg$)
  }
}
