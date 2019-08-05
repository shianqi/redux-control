import { Reducer, compose } from 'redux'
import { enableBatching } from 'redux-batched-actions'

import reduxSetterReducer from './reducers'

export { tryToFetch, set } from './actions'

export const useReduxSetter = (rootReducer: Reducer) =>
  enableBatching((state: any, action: any) =>
    compose(
      inState => reduxSetterReducer(inState, action),
      rootReducer
    )(state, action)
  )
