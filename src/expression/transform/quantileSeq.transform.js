import { factory } from '../../utils/factory.js'
import { createQuantileSeq } from '../../function/statistics/quantileSeq.js'
import { lastDimToZeroBase } from './utils/lastDimToZeroBase.js'

const name = 'quantileSeq'
const dependencies = ['typed', 'bignumber', 'add', 'subtract', 'divide', 'multiply', 'partitionSelect', 'compare', 'isInteger', 'smaller', 'smallerEq', 'larger', 'mapSlices']

/**
 * Attach a transform function to math.quantileSeq
 * Adds a property transform containing the transform function.
 *
 * This transform changed the `dim` parameter of function std
 * from one-based to zero based
 */
export const createQuantileSeqTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, bignumber, add, subtract, divide, multiply, partitionSelect, compare, isInteger, smaller, smallerEq, larger, mapSlices }) => {
  const quantileSeq = createQuantileSeq({ typed, bignumber, add, subtract, divide, multiply, partitionSelect, compare, isInteger, smaller, smallerEq, larger, mapSlices })

  return typed('quantileSeq', {
    'Array | Matrix, number | BigNumber': quantileSeq,
    'Array | Matrix, number | BigNumber, number': (arr, prob, dim) => quantileSeq(arr, prob, dimToZeroBase(dim)),
    'Array | Matrix, number | BigNumber, boolean': quantileSeq,
    'Array | Matrix, number | BigNumber, boolean, number': (arr, prob, sorted, dim) => quantileSeq(arr, prob, sorted, dimToZeroBase(dim)),
    'Array | Matrix, Array | Matrix': quantileSeq,
    'Array | Matrix, Array | Matrix, number': (data, prob, dim) => quantileSeq(data, prob, dimToZeroBase(dim)),
    'Array | Matrix, Array | Matrix, boolean': quantileSeq,
    'Array | Matrix, Array | Matrix, boolean, number': (data, prob, sorted, dim) => quantileSeq(data, prob, sorted, dimToZeroBase(dim))
  })

  function dimToZeroBase (dim) {
    // TODO: find a better way, maybe lastDimToZeroBase could apply to more cases.
    return lastDimToZeroBase([[], dim])[1]
  }
}, { isTransformFunction: true })
