const express = require('express')
const path = require('path')
const connectMockMiddleware = require('../')

const app = express()

app.set('jsonp callback name', 'cb')

app.use(connectMockMiddleware(path.join(__dirname, 'mock'), {
  prefix: '/api',
  callback: 'cb'
}))

app.listen(3000)
