import React, { Component } from 'react'

import { RouterOutlet, Link } from '@react-module/react-module'

export default class App extends Component {
  render () {
    return (
      <div>
        <Link name="home">/home</Link> <br />
        <Link name="/404">/404</Link> <br />
        <RouterOutlet>
          {(handler, params) => {
             return handler(params);
          }}
        </RouterOutlet>
      </div>
    )
  }
}
