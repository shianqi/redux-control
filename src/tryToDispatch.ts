import { ThunkAction } from 'redux-thunk'

import { dispatch, isAutoDispatch } from './index'

const tryToDispatch = (thunkAction: ThunkAction<any, any, any, any>) => {
  if (isAutoDispatch()) {
    const res = dispatch(thunkAction)
    if (res) {
      return res
    }
    // TODO: 需要再考虑一下
    return () => {}
  }
  return thunkAction
}

export default tryToDispatch
