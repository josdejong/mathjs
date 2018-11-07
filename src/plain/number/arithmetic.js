const signature1 = 'number'
const signature2 = 'number, number'

export function abs (a) {
  return Math.abs(a)
}
abs.signature = signature1

export function add (a, b) {
  return a + b
}
add.signature = signature2

export function subtract (a, b) {
  return a - b
}
subtract.signature = signature2

export function multiply (a, b) {
  return a * b
}
multiply.signature = signature2

export function divide (a, b) {
  return a / b
}
divide.signature = signature2
