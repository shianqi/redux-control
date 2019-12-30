import get from 'lodash.get'

import set from './set'
import tryToDispatch from './tryToDispatch'
import { PropertyPath } from './types'
import castPath from './utils/castPath'
import { isAutoDispatch } from './index'

interface TryToFetchOptionTypes {
  path: PropertyPath
  fetchFunc: () => void
  formate?: (data: any) => any
  ttl?: number
  loadingSuffix?: string
}

interface FormatedOptinoTypes {
  path: string[]
  fetchFunc: () => void
  formate: (data: any) => any
  ttl: number
  loadingSuffix: string
}

export interface LoadingStateTypes {
  loading: boolean
  loadingTime: number
  updateTime?: number
}

const getLoadingPath = (path: string[], loadingSuffix: string) => {
  return path.map((item, index) =>
    index === path.length - 1 ? `${item}${loadingSuffix}` : item
  )
}

const getDefaultOption: (
  options: TryToFetchOptionTypes,
  state: any
) => FormatedOptinoTypes = (options, state) => {
  const {
    path,
    fetchFunc,
    formate = (data: any) => data,
    ttl = 0,
    loadingSuffix = 'Loading'
  } = options

  const arrayPath = castPath(path, state)

  return {
    path: arrayPath,
    fetchFunc,
    formate,
    ttl,
    loadingSuffix
  }
}

const shouldFetch = (state: any, options: FormatedOptinoTypes) => {
  const { ttl, path, loadingSuffix } = options

  const loadingState = get(
    state,
    getLoadingPath(path, loadingSuffix),
    {}
  ) as LoadingStateTypes
  const { loading, updateTime } = loadingState

  if (loading) {
    return false
  }
  if (!updateTime) {
    return true
  }
  const now = new Date().valueOf()
  if (updateTime + ttl > now) {
    return false
  }
  return true
}

export const tryToFetch: (
  tryToFetchOption: TryToFetchOptionTypes
) => any = tryToFetchOption =>
  tryToDispatch(async (dispatch, getState) => {
    const state = getState()
    const options = getDefaultOption(tryToFetchOption, state)
    const { path, fetchFunc, formate, loadingSuffix } = options

    if (!shouldFetch(state, options)) {
      return get(state, path)
    }

    const loadingPath = getLoadingPath(path, loadingSuffix)

    const setLoadingTimeAction = set(loadingPath, {
      loading: true,
      loadingTime: new Date().valueOf()
    })
    !isAutoDispatch() && dispatch(setLoadingTimeAction)

    const res = await fetchFunc()
    const formateData = formate(res)
    const loadingState = get(getState(), loadingPath)

    const setUpdateTimeAction = set([
      {
        path,
        data: formateData
      },
      {
        path: loadingPath,
        data: {
          ...loadingState,
          loading: false,
          updateTime: new Date().valueOf()
        }
      }
    ])
    !isAutoDispatch() && dispatch(setUpdateTimeAction)

    return formateData
  })
