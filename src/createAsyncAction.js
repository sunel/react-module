import { createAction } from 'redux-actions'

export const onPending = (type) => `${type}_PENDING`
export const onFulfilled = (type) => `${type}_FULFILLED`
export const onRejected = (type) => `${type}_REJECTED`

const identity = value => value

export const createAsyncAction = (type, payloadCreator = identity, metadataCreator) => {
  return Object.assign(
    createAction(type, payloadCreator, metadataCreator),
    {
      toString: () => {
        throw new Error(`Async action ${type} must be handled with pending, fulfilled or rejected`)
      }
    },
    {
      pending: createAction(onPending(type)),
      fulfilled: createAction(onFulfilled(type), (payload) => payload),
      rejected: createAction(onRejected(type), (payload) => payload)
    }
  )
}

export const asyncReducer = (fn) =>
  (state = {}, action) => {
    switch (action.type) {
      case String(fn.pending):
        return {
          ...state,
          pending: true
        }
      case String(fn.fulfilled):
        return {
          ...state,
          data: action.payload,
          error: undefined,
          pending: false
        }
      case String(fn.rejected):
        return {
          ...state,
          error: action.payload,
          pending: false
        }
      default:
        return state
    }
  }
