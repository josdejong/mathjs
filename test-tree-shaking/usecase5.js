// Use case 5
// create functions yourself using factory functions

import typed from 'typed-function'
import { createHypot } from '../src/factory'

typed.ignore.push('BigNumber')
typed.ignore.push('Matrix')

// Create a hypot instance that only works with numbers:
const hypot = createHypot({
  typed,
  abs: Math.abs,
  addScalar: (a, b) => a + b,
  divideScalar: (a, b) => a / b,
  multiplyScalar: (a, b) => a * b,
  sqrt: Math.sqrt,
  smaller: (a, b) => a < b,
  isPositive: a => a > 0
})

// Use the created function:
console.log('hypot(3, 4) =', hypot(3, 4)) // 5
