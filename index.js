const fs = require('fs')
const url = require('url')
const path = require('path')
const vm = require('vm')
const Mock = require('mockjs')
const pathToRegexp = require('path-to-regexp')

module.exports = function (dirPath, { prefix = '/*', callback = 'callback' } = {}) {
  let rules, reVerify
  let isFnFilter = false
  const type = typeof prefix

  if (type === 'function') {
    isFnFilter = true
  } else if (type === 'string' || Array.isArray(prefix)) {
    rules = [].concat(prefix).join('|')
    reVerify = new RegExp(`^(?:${rules})`)
  } else {
    throw TypeError('Invalid parameter')
  }

  return function (req, res, next) {
    let isMatch

    if (isFnFilter) {
      isMatch = !!prefix(req.url)
    } else {
      isMatch = reVerify.test(req.url)
    }
    if (!isMatch) return next()

    const method = req.method.toLowerCase()
    const { pathname } = url.parse(req.url)
    const mockDir = path.join(dirPath, method)

    fs.readdir(mockDir, (err, files) => {
      if (err) return next(err)
      const isFound = files.some(file => {
        const keys = []
        const filePath = path.basename(file, path.extname(file))
        const fileUrl = filePath.replace(/_/g, '/').replace(/@/g, ':')
        const fileRe = pathToRegexp(fileUrl, keys)

        if (fileRe.test(pathname.slice(1))) {
          fs.readFile(path.join(mockDir, file), 'utf8', (err, data) => {
            if (err) return next(err)
            const sandbox = {
              module: {
                exports: {}
              }
            }
            try {
              vm.runInNewContext(data, sandbox)
            } catch (err) {
              return next(err)
            }

            const params = {}
            const values = fileRe.exec(pathname.slice(1))

            keys.forEach((key, i) => {
              params[key.name] = values[i + 1]
            })

            const query = req.query
            const mockData = sandbox.module.exports({params, query, body: req.body || {}})
            const json = Mock.mock(mockData)

            if (query[callback]) res.jsonp(json)
            else res.json(json)
          })
          return true
        }
      })
      if (!isFound) next()
    })
  }
}
