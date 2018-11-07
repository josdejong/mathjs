import typed from 'typed-function'

import {
  add as plainAdd,
  multiply as plainMultiply
} from './plain/number'

export const add = typed(plainAdd)
export const multiply = typed(plainMultiply)
