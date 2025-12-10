import { deepExtend } from '../../src/utils/object.js'

/**
 * Returns a configuration options object that sets the default number type
 * to BigNumber, and the type to use for approximate results on exact inputs
 * to BigNumber, and optionally sets the BigNumber precision to the first argument,
 * if any, and incorporates additional options given by the second argument, if any.
 */
export function bigConfig (precision, more) {
  const options = { number: 'BigNumber', compute: { numberApproximate: 'BigNumber' } }
  if (precision) {
    options.compute.BigNumber = { precision }
  }
  if (more) deepExtend(options, more)
  return options
}
