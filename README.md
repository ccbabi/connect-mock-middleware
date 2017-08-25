# connect-mock-middleware

Very easy to use mock middleware

- Support [mockjs](http://mockjs.com/examples.html) syntax
- Support json、jsonp
- Modify the mock data and do not need to restart

## Install

```sh
npm install connect-mock-middleware

```

## Usage

```js
connectMockMiddle(<dir>, [<config>])
```

### 1. add middleware
```js
const express = require('express')
const path = require('path')
const connectMockMiddle = require('connect-mock-middleware')

const app = express()

app.use(connectMockMiddle(path.join(__dirname, 'mock')))

app.listen(3000)
```

### 2. write mock file**

Suppose I have two requests

1. `get /api/xxx`
1. `post /api/<id>/123`
> `<id>` link express router `/api/:id/123`, it means that the value changes

The file structure is as follows
```
mock
  └─get
     ├─api_xxx.js
    post
     └─api_@id_xxx.js
```

example: `api_xxx.js`
```js
module.exports = function ({params, query, body}) {
  // params, the path parameter
  // query, get query parameter
  // body, post submit parameter
  
  return {
    code: 1,
    data: back,
    msg: ''
  }
}
```
## Config
- **prefix** `<string|string[]|function>`: Intercepting API prefixes, default `/*` on behalf of all

- **callback** `<string>`: jsonp callback name, default `callback`

**Notice:** you also need to configure your app
```js
app.set('jsonp callback name', 'cb')
```
