import { acosh, asinh, atanh, cosh, sign, sinh, tanh } from '../../utils/number'

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
  return isFinite(x)
    ? (Math.log((x + 1) / x) + Math.log(x / (x - 1))) / 2
    : 0
}
acothNumber.signature = n1

export function acscNumber (x) {
  return Math.asin(1 / x)
}
acscNumber.signature = n1

export function acschNumber (x) {
  const xInv = 1 / x
  return Math.log(xInv + Math.sqrt(xInv * xInv + 1))
}
acschNumber.signature = n1

export function asecNumber (x) {
  return Math.acos(1 / x)
}
asecNumber.signature = n1

export function asechNumber (x) {
  const xInv = 1 / x
  const ret = Math.sqrt(xInv * xInv - 1)
  return Math.log(ret + xInv)
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
  const e = Math.exp(2 * x)
  return (e + 1) / (e - 1)
}
cothNumber.signature = n1

export function cscNumber (x) {
  return 1 / Math.sin(x)
}
cscNumber.signature = n1

export function cschNumber (x) {
  // consider values close to zero (+/-)
  if (x === 0) {
    return Number.POSITIVE_INFINITY
  } else {
    return Math.abs(2 / (Math.exp(x) - Math.exp(-x))) * sign(x)
  }
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
