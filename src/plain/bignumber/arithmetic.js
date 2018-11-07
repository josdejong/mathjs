const signature1 = 'BigNumber'
const signature2 = 'BigNumber, BigNumber'

export function abs (a) {
  return a.abs()
}
abs.signature = signature1

export function add (a, b) {
  return a.add(b)
}
add.signature = signature2

export function subtract (a, b) {
  return a.sub(b)
}
subtract.signature = signature2

export function multiply (a, b) {
  return a.mul(b)
}
multiply.signature = signature2

export function divide (a, b) {
  return a.div(b)
}
divide.signature = signature2
