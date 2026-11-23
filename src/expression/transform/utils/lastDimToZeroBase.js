import { isCollection } from '../../../utils/is.js'
import { dimToZeroBase, isNumberOrBigNumber } from './dimToZeroBase.js'
/**
 * Change the last numeric argument (the dim) from one-based to zero-based.
 */
export function lastDimToZeroBase (args) {
  if (args.length >= 2 && isCollection(args[0])) {
    for (let i = args.length - 1; i >= 1; i--) {
      if (isNumberOrBigNumber(args[i])) {
        args = args.slice()
        args[i] = dimToZeroBase(args[i])
        break
      }
    }
  }
  return args
}
