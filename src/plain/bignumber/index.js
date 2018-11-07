import BigNumber from 'decimal.js'

export * from './arithmetic'

export function bignumber (x) {
  return new BigNumber(x)
}
