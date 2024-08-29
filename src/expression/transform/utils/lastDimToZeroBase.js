import { isCollection } from '../../../utils/is.js'
import { dimToZeroBase, isNumberOrBigNumber } from './dimToZeroBase.js'
/**
 * Change last argument dim from one-based to zero-based.
 */
export function lastDimToZeroBase (args) {
  if (args.length === 2 && isCollection(args[0])) {
    args = args.slice()
    const dim = args[1]
    if (isNumberOrBigNumber(dim)) {
      args[1] = dimToZeroBase(dim)
    }
  }
  return args
}
