import typed from 'typed-function'

import {
  addNumber,
  divideNumber,
  multiplyNumber,
  sinNumber,
  piNumber
} from './plain/number'

// arithmetic
export const add = typed(addNumber)
export const multiply = typed(multiplyNumber)
export const divide = typed(divideNumber)

// trigonometry
export const sin = typed(sinNumber)

// constants
export const pi = piNumber

// TODO: create and export all functions
