import React from 'react'

const Router = React.createContext('router')

Router.displayName = 'Router'

export const RouterProvider = Router.Provider
export const RouterConsumer = Router.Consumer
