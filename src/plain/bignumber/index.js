import Decimal from 'decimal.js'

export * from './arithmetic'

// TODO: this is ugly. Instead, be able to pass your own isBigNumber function to typed?
const BigNumber = Decimal.clone()
BigNumber.prototype.isBigNumber = true

export function bignumber (x) {
  return new BigNumber(x)
}
