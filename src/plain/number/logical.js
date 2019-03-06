const n1 = 'number'
const n2 = 'number, number'

export function notNumber (x) {
  return !x
}
notNumber.signature = n1

export function orNumber (x, y) {
  return !!(x || y)
}
orNumber.signature = n2

export function xorNumber (x, y) {
  return !!x !== !!y
}
xorNumber.signature = n2

export function andNumber (x, y) {
  return !!(x && y)
}
andNumber.signature = n2
