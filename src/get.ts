import { ThunkAction } from 'redux-thunk'
import lodashGet from 'lodash.get'

import tryToDispatch from './tryToDispatch'
import { PropertyPath } from './types'
import castPath from './utils/castPath'

type SingleArgsType = [PropertyPath]
type GetArgsType = SingleArgsType

const get: (...args: GetArgsType) => ThunkAction<void, any, void, any> = (
  ...args
) =>
  tryToDispatch((dispatch, getState) => {
    const [path] = args
    const state = getState()
    const arrayPath = castPath(path, state)

    return lodashGet(state, arrayPath)
  })

export default get
