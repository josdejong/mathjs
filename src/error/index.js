'use strict'

import { ArgumentsError } from './ArgumentsError'
import { DimensionError } from './DimensionError'
import { IndexError } from './IndexError'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  {
    name: 'ArgumentsError',
    path: 'error',
    factory: () => ArgumentsError
  },
  {
    name: 'DimensionError',
    path: 'error',
    factory: () => DimensionError
  },
  {
    name: 'IndexError',
    path: 'error',
    factory: () => IndexError
  }
]

// TODO: implement an InvalidValueError?
