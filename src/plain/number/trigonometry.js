import { acosh, asinh, atanh, cosh, log1p, sinh, tanh } from '../../utils/number.js'

const n1 = 'number'
const n2 = 'number, number'

export function acosNumber (x) {
  return Math.acos(x)
}
acosNumber.signature = n1

export function acoshNumber (x) {
  return acosh(x)
}
acoshNumber.signature = n1

export function acotNumber (x) {
  return Math.atan(1 / x)
}
acotNumber.signature = n1

export function acothNumber (x) {
  // acoth(x) = log1p(2 / (x - 1)) / 2 stays accurate both close to |x| = 1
  // and for large |x|. acoth is odd, so negative x reuses the positive branch.
  return x < 0 ? -acothNumber(-x) : log1p(2 / (x - 1)) / 2
}
acothNumber.signature = n1

export function acscNumber (x) {
  return Math.asin(1 / x)
}
acscNumber.signature = n1

export function acschNumber (x) {
  return asinh(1 / x)
}
acschNumber.signature = n1

export function asecNumber (x) {
  return Math.acos(1 / x)
}
asecNumber.signature = n1

export function asechNumber (x) {
  // asech(x) = log((1 + sqrt(1 - x^2)) / x), written with log1p so that it
  // neither overflows for tiny x nor loses precision close to x = 1
  return log1p((1 - x + Math.sqrt((1 - x) * (1 + x))) / x)
}
asechNumber.signature = n1

export function asinNumber (x) {
  return Math.asin(x)
}
asinNumber.signature = n1

export function asinhNumber (x) {
  return asinh(x)
}
asinhNumber.signature = n1

export function atanNumber (x) {
  return Math.atan(x)
}
atanNumber.signature = n1

export function atan2Number (y, x) {
  return Math.atan2(y, x)
}
atan2Number.signature = n2

export function atanhNumber (x) {
  return atanh(x)
}
atanhNumber.signature = n1

export function cosNumber (x) {
  return Math.cos(x)
}
cosNumber.signature = n1

export function coshNumber (x) {
  return cosh(x)
}
coshNumber.signature = n1

export function cotNumber (x) {
  return 1 / Math.tan(x)
}
cotNumber.signature = n1

export function cothNumber (x) {
  return 1 / tanh(x)
}
cothNumber.signature = n1

export function cscNumber (x) {
  return 1 / Math.sin(x)
}
cscNumber.signature = n1

export function cschNumber (x) {
  return 1 / sinh(x)
}
cschNumber.signature = n1

export function secNumber (x) {
  return 1 / Math.cos(x)
}
secNumber.signature = n1

export function sechNumber (x) {
  return 2 / (Math.exp(x) + Math.exp(-x))
}
sechNumber.signature = n1

export function sinNumber (x) {
  return Math.sin(x)
}
sinNumber.signature = n1

export function sinhNumber (x) {
  return sinh(x)
}
sinhNumber.signature = n1

export function tanNumber (x) {
  return Math.tan(x)
}
tanNumber.signature = n1

export function tanhNumber (x) {
  return tanh(x)
}
tanhNumber.signature = n1
