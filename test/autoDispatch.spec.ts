import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

import {
  autoDispatch,
  cancelAutoDispatch,
  dispatch,
  getStore,
  set,
  useReduxSetter
} from '../src'

test('test autoDispatch', () => {
  const initState = { level1: { level2: { name: '?' } } }
  function counter (state = initState, action) {
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
  function counter (state = initState, action) {
    return state
  }
  createStore(useReduxSetter(counter), applyMiddleware(thunk))

  expect(() => dispatch(set('level1.level2.name', 'Bob'))).toThrowError(
    `Before using 'getStore', you need to call 'autoDispatch' after 'createStore'!`
  )
})

test(`test dispatch autoDispatch actions`, () => {
  const initState = { level1: { level2: { name: '?' } } }
  function counter (state = initState, action) {
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
