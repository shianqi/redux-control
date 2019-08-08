import { ThunkAction } from 'redux-thunk'

import { dispatch, isAutoDispatch } from './index'

const tryToDispatch = (thunkAction: ThunkAction<any, any, any, any>) => {
  if (isAutoDispatch()) {
    dispatch(thunkAction)
    return () => {}
  }
  return thunkAction
}

export default tryToDispatch
