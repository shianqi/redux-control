import { ThunkAction } from 'redux-thunk'

import { dispatch, isAutoDispatch } from './index'

const tryToDispatch = (thunkAction: ThunkAction<any, any, any, any>) => {
  if (isAutoDispatch()) {
    return dispatch(thunkAction)
  }
  return thunkAction
}

export default tryToDispatch
