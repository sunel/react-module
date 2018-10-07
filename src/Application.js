import React from 'react'
import ApplicationContainer from './containers/ApplicationContainer'
import Router from './Router'
import { assertModule } from './Module'

export default class Application {
  rootModule
  providers = new Map()
  loadedProviders = new Map()
  app$
  router$

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
  }

  register() {
    this.rootModule.register()
    return this
  }

  boot() {
    this.providers.forEach((Mod, key) => {
      Mod.boot()
    })
    return this
  }

  run() {
    return (
      <ApplicationContainer router={this.router$} notFound={this.rootModule.notFound}>
        {this.rootModule.render()}
      </ApplicationContainer>
    )
  }

  markAsRegistered(provider) {
    this.providers.set(provider.constructor.name, provider)
    this.loadedProviders.set(provider.constructor.name, true)
  }
}
