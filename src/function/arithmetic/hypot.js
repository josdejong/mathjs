import { factory } from '../../utils/factory.js'
import { flatten } from '../../utils/array.js'
import { isComplex } from '../../utils/is.js'

const name = 'hypot'
const dependencies = [
  'typed',
  'abs',
  'addScalar',
  'divideScalar',
  'multiplyScalar',
  'sqrt'
]

export const createHypot = /* #__PURE__ */ factory(name, dependencies, ({ typed, abs, addScalar, divideScalar, multiplyScalar, sqrt }) => {
  // Exact comparison of two values, without the tolerance of the relational
  // functions like `smaller`: values smaller than config.absTol must not be
  // treated as zero here, else hypot(3e-16, 4e-16) would return 0.
  const isLarger = typed({
    'number, number': (x, y) => x > y,
    'BigNumber, BigNumber': (x, y) => x.gt(y)
  })

  /**
   * Calculate the hypotenuse of a list with values. The hypotenuse is defined as:
   *
   *     hypot(a, b, c, ...) = sqrt(a^2 + b^2 + c^2 + ...)
   *
   * For matrix input, the hypotenuse is calculated for all values in the matrix.
   *
   * Syntax:
   *
   *     math.hypot(a, b, ...)
   *     math.hypot([a, b, c, ...])
   *
   * Examples:
   *
   *     math.hypot(3, 4)      // 5
   *     math.hypot(3, 4, 5)   // 7.0710678118654755
   *     math.hypot([3, 4, 5]) // 7.0710678118654755
   *     math.hypot(-2)        // 2
   *
   * See also:
   *
   *     abs, norm
   *
   * @param {... number | BigNumber | Array | Matrix} args    A list with numeric values or an Array or Matrix.
   *                                                          Matrix and Array input is flattened and returns a
   *                                                          single number for the whole matrix.
   * @return {number | BigNumber} Returns the hypothenusa of the input values.
   */
  return typed(name, {
    '... number | BigNumber': _hypot,

    Array: _hypot,

    Matrix: M => _hypot(flatten(M.toArray(), true))
  })

  /**
   * Calculate the hypotenuse for an Array with values
   * @param {Array.<number | BigNumber>} args
   * @return {number | BigNumber} Returns the result
   * @private
   */
  function _hypot (args) {
    // code based on `hypot` from es6-shim:
    // https://github.com/paulmillr/es6-shim/blob/master/es6-shim.js#L1619-L1633
    // The values are scaled by the largest absolute value to prevent
    // overflow or underflow when squaring them.
    let result = 0
    let largest = 0

    for (let i = 0; i < args.length; i++) {
      if (isComplex(args[i])) {
        throw new TypeError('Unexpected type of argument to hypot')
      }
      const value = abs(args[i])
      if (isLarger(value, largest)) {
        const ratio = divideScalar(largest, value)
        result = addScalar(multiplyScalar(result, multiplyScalar(ratio, ratio)), 1)
        largest = value
      } else if (isLarger(largest, 0)) {
        const ratio = divideScalar(value, largest)
        result = addScalar(result, multiplyScalar(ratio, ratio))
      } else {
        // largest is zero, hence value is zero (or NaN)
        result = addScalar(result, value)
      }
    }

    return multiplyScalar(largest, sqrt(result))
  }
})
