import React from 'react'

const Link = React.createContext('link')

Link.displayName = 'Link'

export const LinkProvider = Link.Provider
export const LinkConsumer = Link.Consumer
