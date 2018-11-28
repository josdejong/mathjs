// Use case 5
// create functions yourself using factory functions

import { createTyped, createHypot } from '../src/factory'

console.log('\nuse case 5')

// Create a hypot instance that only works with numbers:
const typed = createTyped({ type: {} })
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
