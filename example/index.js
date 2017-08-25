const express = require('express')
const path = require('path')
const connectMockMiddle = require('../')

const app = express()

app.set('jsonp callback name', 'cb')

app.use(connectMockMiddle(path.join(__dirname, 'mock'), {
  prefix: '/api',
  callback: 'cb'
}))

app.listen(3000)
