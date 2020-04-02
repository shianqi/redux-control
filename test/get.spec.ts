import { applyMiddleware, createStore } from 'redux'
import thunk, { ThunkDispatch } from 'redux-thunk'

import useReduxControl, { get, autoDispatch, cancelAutoDispatch } from '../src'

test('test set object value', () => {
  const initState = { level1: { level2: { name: 'Bob' } } }
  function counter (state = initState) {
    return state
  }
  const store = createStore(useReduxControl(counter), applyMiddleware(thunk))

  const dispatch = store.dispatch as ThunkDispatch<any, void, any>
  expect(dispatch(get('level1.level2.name'))).toEqual('Bob')
})

test('test set object value', () => {
  const initState = { level1: { level2: { name: 'Bob' } } }
  function counter (state = initState) {
    return state
  }
  const store = createStore(useReduxControl(counter), applyMiddleware(thunk))
  autoDispatch(store)

  expect(get('level1.level2.name')).toEqual('Bob')
  cancelAutoDispatch()
})

test('get object value with default value', () => {
  const initState = { level1: { level2: { name: 'Bob' } } }
  function counter (state = initState) {
    return state
  }
  const store = createStore(useReduxControl(counter), applyMiddleware(thunk))
  autoDispatch(store)

  expect(get('level1.level2.age', 0)).toEqual(0)
  cancelAutoDispatch()
})
