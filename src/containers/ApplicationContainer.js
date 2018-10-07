import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Router from '../Router'
import { RouterProvider } from '../context/Router'
import { LinkProvider } from '../context/Link'

export default class ApplicationContainer extends PureComponent {
    static propTypes = {
      router: PropTypes.object,
      notFound: PropTypes.func,
      children: PropTypes.element
    }

    router
    unlisten

    constructor(props) {
      super(props)
      this.router = this.props.router
      this.state = this.getInitialState()
    }

    getInitialState() {
      return this.dispatch(this.router.currentLocation())
    }

    componentDidMount() {
      this.unlisten = this.router.listen(location => {
        const result = this.dispatch(location)
        this.setState(result)
      })
    }

    dispatch(location) {
      const result = this.router.dispatch(location.pathname)
      switch (result.status) {
        case Router.FOUND:
          return {
            handler: result.handler,
            params: result.params || {}
          }
        case Router.NOT_FOUND:
        default:
          return {
            handler: this.props.notFound,
            params: {}
          }
      }
    }

    componentWillUnmount() {
      this.unlisten()
    }

    render() {
      return (
        <RouterProvider value={this.state}>
          <LinkProvider value={this.router}>
            {this.props.children}
          </LinkProvider>
        </RouterProvider>
      )
    }
}
