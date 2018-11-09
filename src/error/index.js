'use strict'

import { factory } from '../utils/factory'
import { ArgumentsError } from './ArgumentsError'
import { DimensionError } from './DimensionError'
import { IndexError } from './IndexError'

export default [
  factory('error.ArgumentsError', [], () => ArgumentsError),
  factory('error.DimensionError', [], () => DimensionError),
  factory('error.IndexError', [], () => IndexError)
]

// TODO: implement an InvalidValueError?
