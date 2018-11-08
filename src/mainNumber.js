import typed from 'typed-function'

import {
  addNumber,
  multiplyNumber
} from './plain/number'

export const add = typed(addNumber)
export const multiply = typed(multiplyNumber)

// TODO: create and export all functions
