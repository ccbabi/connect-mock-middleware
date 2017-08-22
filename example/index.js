const express = require('express')
const path = require('path')
const connectMockMiddle = require('../')

const app = express()

// app.use(connectMockMiddle(path.join(__dirname, 'mock'), '/api'))
// app.use(connectMockMiddle(path.join(__dirname, 'mock'), ['/api', '/bbb']))
app.use(connectMockMiddle(path.join(__dirname, 'mock'), function (url) {
  return /^\/api/.test(url)
}))

app.listen(3000)
