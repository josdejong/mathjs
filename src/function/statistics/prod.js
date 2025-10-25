import { factory } from '../../utils/factory.js'
import { isArray, isNumber } from '../../utils/is.js'
import { safeNumberType } from '../../utils/number.js'
import { improveErrorMessage } from './utils/improveErrorMessage.js'

const name = 'prod'
const dependencies = [
  'typed', 'config', 'multiplyScalar', 'number', 'numeric', '?Index', 'Range',
  'squeeze', 'size', 'subset', 'dotMultiply'
]

const THRESHOLD = 16 // where to stop splitting and switch to direct multiply

export const createProd = /* #__PURE__ */ factory(name, dependencies, ({
  typed, config, multiplyScalar, number, numeric, Index, Range,
  squeeze, size, subset, dotMultiply
}) => {
  /**
   * Compute the product of a matrix or a list with values.
   * In case of a multidimensional array or matrix, product of all
   * elements will be calculated, unless a second integer argument is given
   * that specifies the dimension along which to multiply.
   *
   * Syntax:
   *
   *     math.prod(a, b, c, ...)
   *     math.prod(A)
   *
   * Examples:
   *
   *     math.multiply(2, 3)           // returns 6
   *     math.prod(2, 3)               // returns 6
   *     math.prod(2, 3, 4)            // returns 24
   *     math.prod([2, 3, 4])          // returns 24
   *     math.prod([[2, 5], [4, 3]])   // returns 120
   *
   * See also:
   *
   *    mean, median, min, max, sum, std, variance
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} The product of all values
   */
  return typed(name, {
    // prod([a, b, c, d, ...])
    'Array | Matrix': _prod,

    // prod([a, b, c, d, ...], dim)
    'Array | Matrix, number | BigNumber': _prodAlongDim,

    // prod(a, b, c, d, ...)
    '...': function (args) {
      return _prod(args)
    }
  })

  /**
   * Recursively calculate the product of an n-dimensional array
   * @param {Array | Matrix} collection
   * @return {scalar} prod
   * @private
   */
  function _prod (collection) {
    let sz = size(collection)
    if (sz.length === 0 || sz.some(dim => dim === 0)) return 1
    let prod
    try {
      if (sz.every(dim => dim === 1)) prod = squeeze(collection)
      else {
        if (sz.length > 1) { // reduce to 1d
          const newColl = []
          for (let pos = 0; pos < sz[0]; ++pos) {
            newColl.push(_prod(subset(collection, pos)))
          }
          collection = newColl
          sz = [sz[0]]
        }
        if (!Index) collection = collection.valueOf()
        if (Array.isArray(collection)) {
          prod = _prodArray(collection, 0, sz[0] - 1)
        } else {
          let op = multiplyScalar
          const dt = collection.datatype()
          if (dt) op = typed.find(op, [dt, dt])
          prod = _prodVector(collection, 0, sz[0] - 1, op)
        }
      }

      if (typeof prod === 'string') {
        prod = numeric(prod, safeNumberType(prod, config))
      }
    } catch (err) {
      throw improveErrorMessage(err, 'prod', collection)
    }
    return prod
  }

  /* Product of a 1d array arr from index first to index last, inclusive. */
  function _prodArray (arr, first, last) {
    if (last - first < THRESHOLD) {
      let prod = arr[first]
      for (let idx = first + 1; idx <= last; ++idx) {
        prod = multiplyScalar(prod, arr[idx])
      }
      return prod
    }
    const cutoff = Math.floor((first + last) / 2)
    return multiplyScalar(
      _prodArray(arr, first, cutoff),
      _prodArray(arr, cutoff + 1, last))
  }

  /* Product of a 1d vector v from position first to last, using op */
  function _prodVector (v, first, last, op) {
    if (last - first < THRESHOLD) {
      let prod = v.layer(first)
      for (let idx = first + 1; idx <= last; ++idx) {
        prod = op(prod, v.layer(idx))
      }
      return prod
    }
    const cutoff = Math.floor((first + last) / 2)
    return op(
      _prodVector(v, first, cutoff, op), _prodVector(v, cutoff + 1, last, op))
  }

  function _prodAlongDim (collection, dim) {
    if (!isNumber(dim)) dim = number(dim)
    const sz = size(collection)
    if (dim >= sz.length) {
      throw new Error(
        `There is no dimension ${dim} in collection of size ${sz}.`)
    }
    if (sz.length === 1) return _prod(collection)
    if (dim === 0) {
      let result = subset(collection, 0)
      for (let i = 1; i < sz[0]; ++i) {
        result = dotMultiply(result, subset(collection, i))
      }
      return result
    }
    const data = []
    for (let i = 0; i < sz[0]; ++i) {
      data.push(_prodAlongDim(subset(collection, i), dim - 1).valueOf())
    }
    if (isArray(collection)) return data
    return collection.create(data)
  }
})
