import lodashGet from 'lodash.get'

import tryToDispatch from './tryToDispatch'
import { PropertyPath } from './types'
import castPath from './utils/castPath'

type SingleArgsType = [PropertyPath, any?]
type GetArgsType = SingleArgsType

const get: (...args: GetArgsType) => any = (...args) =>
  tryToDispatch((dispatch, getState) => {
    const [path, defaultValue] = args
    const state = getState()
    const arrayPath = castPath(path, state)

    return lodashGet(state, arrayPath, defaultValue)
  })

export default get
