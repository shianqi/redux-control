import isObject from 'lodash.isobject'
import { Reducer } from 'redux'

import { SetDataPayload } from './set'
import assignValue from './utils/assignValue'
import isIndex from './utils/isIndex'
import toKey from './utils/toKey'

const initialState = {} as any

function handleSetActions<RootStateTypes> (
  state: RootStateTypes,
  action: { payload: SetDataPayload }
) {
  const { path, data } = action.payload

  const length = path.length
  const lastIndex = length - 1

  let index = -1
  const newState = { ...state } as any
  let nested = newState

  while (nested != null && ++index < length) {
    const key = toKey(path[index]) as string
    let newValue = data

    if (index !== lastIndex) {
      const objValue = nested[key]
      newValue = isObject(objValue)
        ? objValue
        : isIndex(path[index + 1])
          ? []
          : {}
      if (Array.isArray(objValue)) {
        newValue = [...newValue]
      } else {
        newValue = { ...newValue }
      }
    }
    assignValue(nested, key, newValue)
    nested = nested[key]
  }

  return newState
}

const reduxSetterReducer: Reducer = (state = initialState, action) => {
  if (action.type.match(/^SET_DATA_@/)) {
    return handleSetActions(state, action as any)
  } else {
    return state
  }
}

export default reduxSetterReducer
