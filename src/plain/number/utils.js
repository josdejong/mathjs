import { isInteger } from '../../utils/number'

const n1 = 'number'

export function isIntegerNumber (x) {
  return isInteger(x)
}
isIntegerNumber.signature = n1

export function isNegativeNumber (x) {
  return x < 0
}
isNegativeNumber.signature = n1

export function isPositiveNumber (x) {
  return x > 0
}
isPositiveNumber.signature = n1

export function isZeroNumber (x) {
  return x === 0
}
isZeroNumber.signature = n1

export function isNaNNumber (x) {
  return Number.isNaN(x)
}
isNaNNumber.signature = n1
