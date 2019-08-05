import { applyMiddleware, createStore } from 'redux'
import thunk, { ThunkDispatch } from 'redux-thunk'

import { set, tryToFetch, useReduxSetter } from '../src'

test('test set object value', () => {
  const initState = { level1: { level2: { name: '?' } } }
  function counter (state = initState, action) {
    switch (action.type) {
      default:
        return state
    }
  }
  const store = createStore(useReduxSetter(counter), applyMiddleware(thunk))
  store.subscribe(() => {
    expect(store.getState()).toEqual({ level1: { level2: { name: 'Bob' } } })
  })

  const dispatch = store.dispatch as ThunkDispatch<any, void, any>
  dispatch(set('level1.level2.name', 'Bob'))
})

test('test set object value by array path', () => {
  const initState = { level1: { level2: { name: ['Tom', 'Bob'] } } }
  function counter (state = initState, action) {
    switch (action.type) {
      default:
        return state
    }
  }
  const store = createStore(useReduxSetter(counter), applyMiddleware(thunk))
  store.subscribe(() => {
    expect(store.getState()).toEqual({
      level1: { level2: { name: ['Tom', 'Jack'] } }
    })
  })

  const dispatch = store.dispatch as ThunkDispatch<any, void, any>
  dispatch(set(['level1', 'level2', 'name', 1], 'Jack'))
})

test('test set not exist value', () => {
  const initState = { level1: {} }
  function counter (state = initState, action) {
    switch (action.type) {
      default:
        return state
    }
  }
  const store = createStore(useReduxSetter(counter), applyMiddleware(thunk))
  store.subscribe(() => {
    expect(store.getState()).toEqual({ level1: { level2: { name: 'Bob' } } })
  })

  const dispatch = store.dispatch as ThunkDispatch<any, void, any>
  dispatch(set('level1.level2.name', 'Bob'))
})

test('test set array value', () => {
  const initState = { level1: { level2: { name: ['Tom', 'Bob'] } } }
  function counter (state = initState, action) {
    switch (action.type) {
      default:
        return state
    }
  }
  const store = createStore(useReduxSetter(counter), applyMiddleware(thunk))
  const data1 = store.getState()

  store.subscribe(() => {
    const data2 = store.getState()
    expect(data2).toEqual({
      level1: { level2: { name: ['Tom', 'Jack'] } }
    })

    expect(data1 === data2).toEqual(false)
    expect(data1.level1 === data2.level1).toEqual(false)
    expect(data1.level1.level2 === data2.level1.level2).toEqual(false)
  })

  const dispatch = store.dispatch as ThunkDispatch<any, void, any>
  dispatch(set('level1.level2.name[1]', 'Jack'))
})

test('test tryToFetch action', async () => {
  const initState = { level1: { level2: null } }
  function counter (state = initState, action) {
    switch (action.type) {
      default:
        return state
    }
  }
  const store = createStore(useReduxSetter(counter), applyMiddleware(thunk))

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
  expect(data1.level1.level2_Loading.updateTime).toEqual(
    data2.level1.level2_Loading.updateTime
  )

  expect(data1 === data2).toEqual(true)
  expect(data1.level1 === data2.level1).toEqual(true)
})
