import React from 'react'

const FUNCTION_REGEX = /react(\d+)?./i

export const hasGetter = (obj, key) => {
  if (obj.prototype === undefined) {
    return (obj[key] !== undefined)
  }
  const found = Object.getOwnPropertyDescriptor(obj.prototype, key)
  return (found && (typeof found.get === 'function'))
}

function classComponent(component) {
  return (
    typeof component === 'function' && component.prototype && !!component.prototype.isReactComponent
  )
}

// Ensure compatability with transformed code
function functionComponent(component) {
  return (
    typeof component === 'function' &&
    String(component).includes('return') &&
    !!String(component).match(FUNCTION_REGEX) &&
    String(component).includes('.createElement')
  )
}

export const reactComponent = (component) => (classComponent(component) || functionComponent(component))

export const reactElement = (typeElement) => React.isValidElement(typeElement)

export const reactCompatible = (item) => (reactElement(item) || reactComponent(item))
