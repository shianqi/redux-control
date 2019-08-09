import { Action } from 'redux'
import { batchActions } from 'redux-batched-actions'
import { ThunkAction } from 'redux-thunk'

import tryToDispatch from './tryToDispatch'
import { PropertyPath } from './types'
import castPath from './utils/castPath'

// TODO: 拆分文件

type SingleArgsType = [PropertyPath, any]
interface MultiArgsTypeItem {
  path: PropertyPath
  data: any
}

type MultiArgsType = [MultiArgsTypeItem[]]

type SetArgsType = SingleArgsType | MultiArgsType

export interface SetDataPayload {
  path: string[]
  data: any
}

const setData: (option: SetDataPayload) => Action = option => ({
  type: `SET_DATA_@${option.path.join('.')}`,
  payload: option
})

const set: (...args: SetArgsType) => ThunkAction<void, any, void, any> = (
  ...args
) =>
  tryToDispatch((dispatch, getState) => {
    const [arg1] = args
    if (Array.isArray(arg1) && arg1.length > 0 && typeof arg1[0] === 'object') {
      const arrayPathArgs = (args as MultiArgsType)[0].map(item => {
        const { path, data } = item
        const state = getState()
        const arrayPath = castPath(path, state)

        return {
          path: arrayPath,
          data
        }
      })
      dispatch(
        batchActions(
          arrayPathArgs.map(setData),
          `SET_MULTI_DATAS_@${arrayPathArgs.length}`
        )
      )
    } else {
      const [path, data] = args as SingleArgsType
      const state = getState()
      const arrayPath = castPath(path, state)
      dispatch(setData({ path: arrayPath, data }))
    }
  })

export default set
