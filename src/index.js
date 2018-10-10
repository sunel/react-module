import Application from './Application'

export const run = (Module, isDev = false) => {
  return Application.create(Module, isDev).run()
}

export { default as RouterOutlet } from './containers/RouterOutlet'
export { default as Link } from './Link'
export { default as Module } from './Module'

export {
  onPending,
  onFulfilled,
  onRejected,
  createAsyncAction,
  asyncReducer
} from './createAsyncAction'

export {
  combineActions,
  createAction,
  createActions,
  createCurriedAction,
  handleAction,
  handleActions
} from 'redux-actions'
