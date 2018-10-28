import React from 'react'
import ApplicationContainer from './containers/ApplicationContainer'
import Router from './Router'
import ReducerRegistry from './registry/ReducerRegistry'
import SagaRegistry from './registry/SagaRegistry'
import configureStore from './Store'
import { assertModule } from './Module'

export default class Application {
  rootModule
  providers = new Map()
  app$
  router$
  store$
  reducerReg$
  sagaReg$

  constructor(rootModule, isDev = false) {
    assertModule(rootModule)
    this.app$ = this
    this.rootModule = new rootModule(this.app$) // eslint-disable-line new-cap
    this.init()
  }

  static create(RootModule, isDev = false) {
    return (new Application(RootModule, isDev)).register().boot()
  }

  init() {
    this.router$ = new Router()
    this.reducerReg$ = new ReducerRegistry()
    this.sagaReg$ = new SagaRegistry()
  }

  setUpStore() {
    this.store$ = configureStore({}, this.reducerReg$.reducers)
    this.store$.runSaga(this.sagaReg$.sagas)
  }

  register() {
    this.rootModule.register()
    return this
  }

  boot() {
    this.setUpStore()
    this.providers.forEach((Mod, key) => {
      Mod.boot()
    })
    return this
  }

  run() {
    return (
      <ApplicationContainer
        store={this.store$}
        router={this.router$}
        notFound={this.rootModule.notFound} >
        {this.rootModule.render()}
      </ApplicationContainer>
    )
  }

  markAsRegistered(provider) {
    this.providers.set(provider.constructor.name, provider)
  }
}
