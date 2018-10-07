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
    'routes', 'actions', 'reducer',
    'sagas', 'selectors'
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
      assertModule(Mod)
      const otherModule = new Mod(this.app$)
      otherModule.register()
    })
    return this
  }

  boot() {
  }

  registerRoutes() {
    this.routes(this.app$.router$)
  }

  registerActions() {
    this.actions(this.app$.router$)
  }

  registerReducer() {
    this.reducer(this.app$.router$)
  }

  registerSagas() {
    this.sagas(this.app$.router$)
  }

  registerSelectors() {
    this.selectors(this.app$.router$)
  }
}
