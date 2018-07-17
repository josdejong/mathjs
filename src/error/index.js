'use strict'

const ArgumentsError = require('./ArgumentsError')
const DimensionError = require('./DimensionError')
const IndexError = require('./IndexError')

module.exports = [
  {
    name: 'ArgumentsError',
    path: 'error',
    factory: function () {
      return ArgumentsError
    }
  },
  {
    name: 'DimensionError',
    path: 'error',
    factory: function () {
      return DimensionError
    }
  },
  {
    name: 'IndexError',
    path: 'error',
    factory: function () {
      return IndexError
    }
  }
]

// TODO: implement an InvalidValueError?
