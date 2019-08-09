import { applyMiddleware, createStore } from 'redux'
import thunk, { ThunkDispatch } from 'redux-thunk'

import { get, useReduxSetter, autoDispatch, cancelAutoDispatch } from '../src'

test('test set object value', () => {
  const initState = { level1: { level2: { name: 'Bob' } } }
  function counter (state = initState, action) {
    return state
  }
  const store = createStore(useReduxSetter(counter), applyMiddleware(thunk))

  const dispatch = store.dispatch as ThunkDispatch<any, void, any>
  expect(dispatch(get('level1.level2.name'))).toEqual('Bob')
})

test('test set object value', () => {
  const initState = { level1: { level2: { name: 'Bob' } } }
  function counter (state = initState, action) {
    return state
  }
  const store = createStore(useReduxSetter(counter), applyMiddleware(thunk))
  autoDispatch(store)

  expect(get('level1.level2.name')).toEqual('Bob')
  cancelAutoDispatch()
})