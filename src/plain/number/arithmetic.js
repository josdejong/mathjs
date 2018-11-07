const signature1 = 'number'
const signature2 = 'number, number'

export function absNumber (a) {
  return Math.abs(a)
}
absNumber.signature = signature1

export function addNumber (a, b) {
  return a + b
}
addNumber.signature = signature2

export function subtractNumber (a, b) {
  return a - b
}
subtractNumber.signature = signature2

export function multiplyNumber (a, b) {
  return a * b
}
multiplyNumber.signature = signature2

export function divideNumber (a, b) {
  return a / b
}
divideNumber.signature = signature2
