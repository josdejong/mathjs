const signature1 = 'BigNumber'
const signature2 = 'BigNumber, BigNumber'

export function absBigNumber (a) {
  return a.abs()
}
absBigNumber.signature = signature1

export function addBigNumber (a, b) {
  return a.add(b)
}
addBigNumber.signature = signature2

export function subtractBigNumber (a, b) {
  return a.sub(b)
}
subtractBigNumber.signature = signature2

export function multiplyBigNumber (a, b) {
  return a.mul(b)
}
multiplyBigNumber.signature = signature2

export function divideBigNumber (a, b) {
  return a.div(b)
}
divideBigNumber.signature = signature2
