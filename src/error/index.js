'use strict'

import { factory } from '../utils/factory'
import { ArgumentsError } from './ArgumentsError'
import { DimensionError } from './DimensionError'
import { IndexError } from './IndexError'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  factory('error.ArgumentsError', [], () => ArgumentsError),
  factory('error.DimensionError', [], () => DimensionError),
  factory('error.IndexError', [], () => IndexError)
]

// TODO: implement an InvalidValueError?
