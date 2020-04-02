# redux-control

[![npm](https://img.shields.io/npm/v/redux-control.svg)](https://www.npmjs.com/package/redux-control)
[![redux-control](https://img.shields.io/npm/dm/redux-control.svg)](https://www.npmjs.com/package/redux-control)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/shianqi/redux-control/master/LICENSE)

A modern Redux utility library delivering quick operation, loading data, & extras.

## Installation

Using npm:

```bash
$ npm i --save redux-control
```

## Documents

- [set](#set)
- [tryToFetch](#tryToFetch)

---

### set

#### Arguments

```text
[path: array | string, data: any] | [{ path: array | string, data: any }[]]
```

#### Returns

void

#### Example

```javascript
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import useReduxControl, { set } from 'redux-control'

function reducer(state = {}, action) {
  return state
}
const store = createStore(useReduxControl(reducer), applyMiddleware(thunk))

store.subscribe(() => {
  console.log(store.getState())
  // { level1: { level2: { name: "Bob" } } }
})

store.dispatch(set('level1.level2.name', 'Bob'))
```

---

### get

#### Arguments

```text
path: array | string
defaultValue?: any
```

#### Returns

any

#### Example

```javascript
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import useReduxControl, { get } from 'redux-control'

const initState = { level1: { level2: { name: 'Bob' } } }
function counter(state = initState, action) {
  return state
}
const store = createStore(useReduxControl(counter), applyMiddleware(thunk))

const name = store.dispatch(get('level1.level2.name'))
console.log(name)
// 'Bob'
```

---

### tryToFetch

#### Arguments

```text
{
  path: string[]               // The path where the return value is stored
  fetchFunc: () => void        // Function of loading data
  formate: (data: any) => any  // Function of formatting the returned data
  ttl: number                  // Valid time of the data
  loadingSuffix: string        // Store the suffix of the load information key
}
```

#### Returns

`Promise<any>` The return value of an asynchronous request

#### Example

```javascript
import { applyMiddleware, createStore } from 'redux'
import useReduxControl, { tryToFetch } from 'redux-control'
import thunk from 'redux-thunk'

function reducer(state = {}, action) {
  return state
}
const store = createStore(useReduxControl(reducer), applyMiddleware(thunk))

store.subscribe(() => {
  console.log(store.getState())
  // { level1:
  //   { level2Loading: { loading: true, loadingTime: 1565193263003 } } }
  // After ~1000m
  // { level1:
  //   {
  //     level2Loading:
  //       { loading: false,
  //         loadingTime: 1565193263003,
  //         updateTime: 1565193264020 },
  //     level2: { name: 'redux' } } }
})

const getDate = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve({ name: 'redux' })
    }, 1000)
  })

const fetch = async () => {
  await store.dispatch(
    tryToFetch({
      path: 'level1.level2',
      fetchFunc: getDate,
      ttl: 1000
    })
  )
}

fetch()
```

---

### autoDispatch / cancelAutoDispatch

#### Arguments

store: redux.Store

#### Returns

store: redux.Store

#### Example

```javascript
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import useReduxControl, { set, autoDispatch } from 'redux-control'

function reducer(state = {}, action) {
  return state
}
const store = createStore(useReduxControl(reducer), applyMiddleware(thunk))
autoDispatch(store)

store.subscribe(() => {
  console.log(store.getState())
  // { level1: { level2: { name: "Bob" } } }
})

set('level1.level2.name', 'Bob')
cancelAutoDispatch()
```
