import createHistory from 'history/createBrowserHistory'
import pathToRegexp from 'path-to-regexp'
import { stringify } from 'qs'
import isEmpty from 'lodash.isempty'

export default class Router {
  static get FOUND () { return 200 }
  static get NOT_FOUND () { return 404 }

  routeCollection = {}

  paramRoute = {}
  staticRoute = {}

  paramRouteRegX = {}
  staticRouteRegX = {}

  paramRouteData = []

  currentGroupPrefix = ''
  currentGroupNamePrefix = ''

  history$

  constructor() {
    this.history$ = createHistory()
  }

  buildRegexForRoute (route) {
    let paramNames = []
    const regex = pathToRegexp(route, paramNames).source
    paramNames = paramNames.map((params) => {
      return params.name
    })

    return { regex, paramNames }
  }

  generateParamsRouteData () {
    let offset = 1

    const regex = Object.keys(this.paramRoute).map((regex) => {
      const route = this.paramRoute[regex]
      this.paramRouteData[offset] = route
      offset += route.paramNames.length
      return regex
    }).join('|')

    this.paramRouteRegX = new RegExp(`^(?:${regex})$`)
  }

  generateStaticRouteData () {
    const regex = Object.keys(this.staticRoute).join('|')
    this.staticRouteRegX = new RegExp(`^(?:${regex})$`)
  }

  addParamsRoute (regex, paramNames, handler) {
    if (typeof this.paramRoute[regex] !== 'undefined') {
      throw new Error(`Cannot register two routes matching ${regex}`)
    }

    this.paramRoute[regex] = { handler, regex, paramNames }

    this.generateParamsRouteData()
  }

  addStaticRoute (route, handler) {
    if (typeof this.staticRoute[route] !== 'undefined') {
      throw new Error(`Cannot register two routes matching ${route}`)
    }

    this.staticRoute[route] = { handler, route }

    this.generateStaticRouteData()
  }

  add(path, handler, name = '') {
    path = `${this.currentGroupPrefix}${path}`
    name = `${this.currentGroupNamePrefix}${name || path}`
    this.routeCollection[name] = path

    const { regex, paramNames } = this.buildRegexForRoute(path)

    if (paramNames.length > 0) {
      this.addParamsRoute(regex, paramNames, handler)
    } else {
      this.addStaticRoute(path, handler)
    }
  }

  group(path, handler, name = '') {
    const previousGroupPrefix = this.currentGroupPrefix
    const previousGroupNamePrefix = this.currentGroupNamePrefix

    this.currentGroupPrefix = `${previousGroupPrefix}${path}`
    this.currentGroupNamePrefix = `${previousGroupNamePrefix}${name}`

    handler(this)

    this.currentGroupPrefix = previousGroupPrefix
    this.currentGroupNamePrefix = previousGroupNamePrefix
  }

  paramsDispatch (uri) {
    const matches = uri.match(this.paramRouteRegX)
    if (!matches) return { status: Router.NOT_FOUND }

    for (var i = 1; matches[i] === undefined; ++i) {}

    const params = {}
    const route = this.paramRouteData[i]
    route.paramNames.forEach((paramName) => { params[paramName] = matches[i++] })

    return { status: Router.FOUND, handler: route.handler, params }
  }

  staticDispatch (uri) {
    const route = this.staticRoute[uri]
    if (!route) return { status: Router.NOT_FOUND }
    return { status: Router.FOUND, handler: route.handler }
  }

  route(name, params = {}, query = {}) {
    const toPath = pathToRegexp.compile(this.routeCollection[name] || name)
    return isEmpty(query) ? toPath(params) : `${toPath(params)}?${stringify(query)}`
  }

  listen(callback) {
    return this.history$.listen(callback)
  }

  currentLocation() {
    return this.history$.location
  }

  dispatch (uri) {
    const staticResult = this.staticDispatch(uri)
    if (staticResult.status === Router.FOUND) return staticResult

    const paramsResult = this.paramsDispatch(uri)
    if (paramsResult.status === Router.FOUND) return paramsResult

    return { status: Router.NOT_FOUND }
  }
}
