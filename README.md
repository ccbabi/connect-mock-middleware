# connect-mock-middleware

Very easy to use mock middleware

- support [mockjs](http://mockjs.com/examples.html) syntax.

## Usage
- First add middleware
```
const express = require('express')
const path = require('path')
const connectMockMiddle = require('connect-mock-middleware')

const app = express()

app.use(connectMockMiddle(path.join(__dirname, 'mock'), '/api'))

// or
app.use(connectMockMiddle(path.join(__dirname, 'mock'), ['/api', '/bbb']))

// or
app.use(connectMockMiddle(path.join(__dirname, 'mock'), function (url) {
  return /^\/api/.test(url)
}))

app.listen(3000)
```

- Second write mock file

Suppose I have two requests

1. `get /api/xxx`
1. `post /api/<id>/123`
> \<id> link express router `/api/:id/123`, it means that the value changes

The file structure is as follows
```
mock
  └─get
     ├─api_xxx.js
    post
     └─api_@id_xxx.js
```

`api_xxx.js`
```
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
