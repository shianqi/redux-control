import thunk from 'redux-thunk'
import { applyMiddleware, createStore } from 'redux'

import {
  autoDispatch,
  cancelAutoDispatch,
  dispatch,
  getStore,
  set,
  tryToFetch,
  useReduxSetter
} from '../src'

test('test autoDispatch', () => {
  const initState = { level1: { level2: { name: '?' } } }
  function counter (state = initState) {
    return state
  }
  const store = createStore(useReduxSetter(counter), applyMiddleware(thunk))
  autoDispatch(store)

  getStore().subscribe(() => {
    expect(store.getState()).toEqual({ level1: { level2: { name: 'Bob' } } })
  })

  set('level1.level2.name', 'Bob')
  cancelAutoDispatch()
})

test('test autoDispatch', () => {
  const initState = { level1: { level2: { name: '?' } } }
  function counter (state = initState) {
    return state
  }
  createStore(useReduxSetter(counter), applyMiddleware(thunk))

  expect(() => dispatch(set('level1.level2.name', 'Bob'))).toThrowError(
    `Before using 'getStore', you need to call 'autoDispatch' after 'createStore'!`
  )
})

test(`test dispatch autoDispatch actions`, () => {
  const initState = { level1: { level2: { name: '?' } } }
  function counter (state = initState) {
    return state
  }
  const store = createStore(useReduxSetter(counter), applyMiddleware(thunk))
  autoDispatch(store)

  getStore().subscribe(() => {
    expect(store.getState()).toEqual({ level1: { level2: { name: 'Bob' } } })
  })

  dispatch(set('level1.level2.name', 'Bob'))
  cancelAutoDispatch()
})

test('test autoDispatch tryToFetch', async () => {
  const initState = { level1: { level2: null } }
  function counter (state = initState, action) {
    switch (action.type) {
      default:
        return state
    }
  }
  const store = createStore(useReduxSetter(counter), applyMiddleware(thunk))
  autoDispatch(store)

  const getDate = () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve({ name: 'redux' })
      }, 1000)
    })

  const tryToFetchData = () =>
    tryToFetch({
      path: 'level1.level2',
      fetchFunc: getDate,
      ttl: 1000
    })

  await tryToFetchData()
  const data1 = store.getState()
  expect(data1.level1.level2.name).toEqual('redux')

  await tryToFetchData()
  const data2 = store.getState()
  expect(data2.level1.level2.name).toEqual('redux')
  expect(data1.level1.level2_Loading.updateTime).toEqual(
    data2.level1.level2_Loading.updateTime
  )

  expect(data1 === data2).toEqual(true)
  expect(data1.level1 === data2.level1).toEqual(true)
  cancelAutoDispatch()
})
