import { isBigNumber, isCollection, isNumber } from '../../../utils/is.js'

/**
 * Change last argument dim from one-based to zero-based.
 */
export function lastDimToZeroBase (args) {
  if (args.length === 2 && isCollection(args[0])) {
    args = args.slice()
    const dim = args[1]
    if (isNumber(dim)) {
      args[1] = dim - 1
    } else if (isBigNumber(dim)) {
      args[1] = dim.minus(1)
    }
  }
  return args
}
