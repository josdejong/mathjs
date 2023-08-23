import { factory } from '../../utils/factory.js'
import { createQuantileSeq } from '../../function/statistics/quantileSeq.js'
import { lastDimToZeroBase } from './utils/lastDimToZeroBase.js'

const name = 'quantileSeq'
const dependencies = ['typed', 'add', 'multiply', 'partitionSelect', 'compare', 'isInteger']

/**
 * Attach a transform function to math.quantileSeq
 * Adds a property transform containing the transform function.
 *
 * This transform changed the `dim` parameter of function std
 * from one-based to zero based
 */
export const createQuantileSeqTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, add, multiply, partitionSelect, compare, isInteger }) => {
  const quantileSeq = createQuantileSeq({ typed, add, multiply, partitionSelect, compare, isInteger })

  return typed('quantileSeq', {
    'Array|Matrix, number|BigNumber|Array, number': (arr, prob, dim) => quantileSeq(arr, prob, dimToZeroBase(dim)),
    'Array|Matrix, number|BigNumber|Array, boolean, number': (arr, prob, sorted, dim) => quantileSeq(arr, prob, sorted, dimToZeroBase(dim))
  })

  function dimToZeroBase (dim) {
    // TODO: find a better way, maybe lastDimToZeroBase could apply to more cases.
    return lastDimToZeroBase([[], dim])[1]
  }
}, { isTransformFunction: true })
