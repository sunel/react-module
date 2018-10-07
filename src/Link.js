import React from 'react'
import PropTypes from 'prop-types'
import { LinkConsumer } from './context/Link'

const isModifiedEvent = (event) => {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

export default class Link extends React.Component {
    static propTypes = {
      router: PropTypes.object,
      replace: PropTypes.bool
    }

    handleClick(event, href, router) {
      if (this.props.onClick) this.props.onClick(event)
      if (
        !event.defaultPrevented && // onClick prevented default
          event.button === 0 && // ignore everything but left clicks
          !this.props.target && // let browser handle "target=_blank" etc.
          !isModifiedEvent(event) // ignore clicks with modifier keys
      ) {
        event.preventDefault()

        const method = this.props.replace
          ? router.history$.replace
          : router.history$.push

        method(href)
      }
    }

    render() {
      const { name, params, ...props } = this.props // eslint-disable-line no-unused-vars

      return (
        <LinkConsumer>
          {router => {
            const href = router.route(name, params)

            return (
              <a
                {...props}
                onClick={event => this.handleClick(event, href, router)}
                href={href}
              />
            )
          }}
        </LinkConsumer>
      )
    }
}
