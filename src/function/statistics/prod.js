import { factory } from '../../utils/factory.js'
import { isArray, isNumber, isRange } from '../../utils/is.js'
import { safeNumberType } from '../../utils/number.js'
import { improveErrorMessage } from './utils/improveErrorMessage.js'

const name = 'prod'
const dependencies = [
  'typed', 'config', 'multiplyScalar', 'number', 'numeric',
  'squeeze', 'size', 'subset', 'dotMultiply'
]

// Two tuning constants. For products of at least THRESHOLD terms, we split
// rather than directly multiply. And for products of Ranges of at least
// RANGE_THRESHOLD + 1 terms, we multiply in pairs rather than singly.
const THRESHOLD = 16
const RANGE_THRESHOLD = 5

export const createProd = /* #__PURE__ */ factory(name, dependencies, ({
  typed, config, multiplyScalar, number, numeric,
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
    const lenm1 = last - first
    if (lenm1 < THRESHOLD) {
      if (isRange(v) && lenm1 >= RANGE_THRESHOLD) {
        return _prodRange(v, first, last, op)
      }
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

  /* Product of a 1d Range r from position first to last, using op and the
     "multiply in pairs" trick.
   */
  function _prodRange (r, first, last, op) {
    const a = r.layer(first)
    const d = r.step
    const m = last - first // m+1 terms
    const even = m % 2
    const pairs = even ? (m + 1) / 2 : m / 2
    const b = even ? a : r.plus(a, d)
    const k = even ? m : m - 1 // k is always an odd number
    // So now the pairs are b*(b+kd), (b+1d)*(b+(k-1)d), (b+2d)*(b+(k-2)d), ...
    // up to (b+(pairs-1)d)*(b+(k-pairs+1)d). Their products are all
    // (b^2 + kbd + something), where the somethings go (k-1)d^2, 2(k-2)d^2,
    // 3(k-3)d, ... with differences  (k-3)d^2, (k-5)d^2, (k-7)d^2, ...
    let pair = op(b, r.layer(last)) // b^2 + kbd
    let prod = pair
    const dsq = op(d, d)
    let pairIncrement = r.times(k - 1, dsq)
    const pairIncDec = r.times(-2, dsq)
    for (let j = 1; j < pairs; ++j) {
      pair = r.plus(pair, pairIncrement)
      pairIncrement = r.plus(pairIncrement, pairIncDec)
      prod = op(prod, pair)
    }
    return even ? prod : op(a, prod)
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
