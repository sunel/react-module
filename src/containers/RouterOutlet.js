import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { RouterConsumer } from '../context/Router'

const onlyChild = (children) => {
  return Array.isArray(children) ? children[0] : children
}

export default class RouterOutlet extends PureComponent {
    static propTypes = {
      children: PropTypes.any
    }

    render() {
      return (
        <RouterConsumer>
          {context => {
            return onlyChild(this.props.children)(context.handler, context.params)
          }}
        </RouterConsumer>
      )
    }
}
