import { applyMiddleware, createStore } from 'redux'
import thunk, { ThunkDispatch } from 'redux-thunk'

import { set, useReduxSetter } from '../src'

test('test set object value', () => {
  const initState = { level1: { level2: { name: '?' } } }
  function counter (state = initState, action) {
    return state
  }
  const store = createStore(useReduxSetter(counter), applyMiddleware(thunk))
  store.subscribe(() => {
    expect(store.getState()).toEqual({ level1: { level2: { name: 'Bob', age: 18 } } })
  })

  const dispatch = store.dispatch as ThunkDispatch<any, void, any>
  dispatch(
    set([
      { path: 'level1.level2.name', data: 'Bob'},
      { path: 'level1.level2.age', data: 18}
    ])
  )
})
