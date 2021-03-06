import { applyMiddleware, createStore } from 'redux'
import thunk, { ThunkDispatch } from 'redux-thunk'

import useReduxControl, { tryToFetch, LoadingStateTypes } from '../src'

test('test tryToFetch action', async () => {
  interface T1RootState {
    level1: {
      level2: {
        name: string
      }
      level2Loading?: LoadingStateTypes
    }
  }

  const initState: T1RootState = { level1: { level2: null } }
  function counter (state = initState, action) {
    switch (action.type) {
      default:
        return state
    }
  }
  const store = createStore(useReduxControl(counter), applyMiddleware(thunk))

  const dispatch = store.dispatch as ThunkDispatch<any, void, any>

  const getDate = () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve({ name: 'redux' })
      }, 1000)
    })

  const tryToFetchData = () => dispatch => {
    return dispatch(
      tryToFetch({
        path: 'level1.level2',
        fetchFunc: getDate,
        ttl: 1000
      })
    )
  }

  await dispatch(tryToFetchData())
  const data1 = store.getState()
  expect(data1.level1.level2.name).toEqual('redux')

  await dispatch(tryToFetchData())
  const data2 = store.getState()
  expect(data2.level1.level2.name).toEqual('redux')
  expect(data1.level1.level2Loading.updateTime).toEqual(
    data2.level1.level2Loading.updateTime
  )

  expect(data1 === data2).toEqual(true)
  expect(data1.level1 === data2.level1).toEqual(true)
})
