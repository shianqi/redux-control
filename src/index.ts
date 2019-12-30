import { Reducer, Store, compose, Action, AnyAction } from 'redux'
import { enableBatching } from 'redux-batched-actions'

import reduxSetterReducer from './reducers'
export { default as set } from './set'
export { default as get } from './get'
export * from './tryToFetch'

const useReduxControl: <S, A extends Action = AnyAction>(
  rootReducer: Reducer<S, A>
) => Reducer<S> = rootReducer =>
  enableBatching((state, action: any) =>
    compose(inState => reduxSetterReducer(inState, action), rootReducer)(
      state,
      action
    )
  )

let __REDUX_CONTROL_STORE__: Store | null = null

export const autoDispatch = (store: Store) => {
  __REDUX_CONTROL_STORE__ = store
  return store
}

export const isAutoDispatch = () => {
  if (__REDUX_CONTROL_STORE__) {
    return true
  }
  return false
}

export const cancelAutoDispatch = () => {
  __REDUX_CONTROL_STORE__ = null
}

export const getStore: () => Store = () => {
  if (!__REDUX_CONTROL_STORE__) {
    throw new Error(
      `Before using 'getStore', you need to call 'autoDispatch' after 'createStore'!`
    )
  }
  return __REDUX_CONTROL_STORE__
}

export const dispatch = (action: any) => {
  const { dispatch: _dispatch } = getStore()
  return _dispatch(action)
}

export default useReduxControl
