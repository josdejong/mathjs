import { isInteger } from '../../utils/number'

const n1 = 'number'
const n2 = 'number, number'

function largerThan32Bits(x) {
  return x > 2 ** 31 - 1 || x < -(2 ** 31)
}

export function bitAndNumber (x, y) {
  if (!isInteger(x) || !isInteger(y)) {
    throw new Error('Integers expected in function bitAnd')
  }
  if (largerThan32Bits(x) || largerThan32Bits(y)) {
    const xH = x / 2 ** 32
    const yH = x / 2 ** 32
    const xL = x & 0xffffffff
    const yL = y & 0xffffffff
    return (xH & yH) * 2 ** 32 + xL & yL
  }
  return x & y
}
bitAndNumber.signature = n2

export function bitNotNumber (x) {
  if (!isInteger(x)) {
    throw new Error('Integer expected in function bitNot')
  }

  return ~x
}
bitNotNumber.signature = n1

export function bitOrNumber (x, y) {
  if (!isInteger(x) || !isInteger(y)) {
    throw new Error('Integers expected in function bitOr')
  }

  return x | y
}
bitOrNumber.signature = n2

export function bitXorNumber (x, y) {
  if (!isInteger(x) || !isInteger(y)) {
    throw new Error('Integers expected in function bitXor')
  }

  return x ^ y
}
bitXorNumber.signature = n2

export function leftShiftNumber (x, y) {
  if (!isInteger(x) || !isInteger(y)) {
    throw new Error('Integers expected in function leftShift')
  }

  return x << y
}
leftShiftNumber.signature = n2

export function rightArithShiftNumber (x, y) {
  if (!isInteger(x) || !isInteger(y)) {
    throw new Error('Integers expected in function rightArithShift')
  }

  return x >> y
}
rightArithShiftNumber.signature = n2

export function rightLogShiftNumber (x, y) {
  if (!isInteger(x) || !isInteger(y)) {
    throw new Error('Integers expected in function rightLogShift')
  }

  return x >>> y
}
rightLogShiftNumber.signature = n2
