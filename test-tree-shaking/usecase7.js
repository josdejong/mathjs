// Use case 7
// create functions yourself using factory functions

import { createHypot, createTyped } from '..'

// Create a hypot instance that only works with numbers:
const typed = createTyped({})
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

console.log('\nuse case 7')
console.log('hypot(3, 4) =', hypot(3, 4)) // 5
