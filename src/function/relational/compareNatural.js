import naturalSort from 'javascript-natural-sort'
import { isDenseMatrix, isSparseMatrix, typeOf } from '../../utils/is'
import { factory } from '../../utils/factory'

const name = 'compareNatural'
const dependencies = [
  'typed',
  'compare'
]

export const createCompareNatural = /* #__PURE__ */ factory(name, dependencies, ({ typed, compare }) => {
  const compareBooleans = compare.signatures['boolean,boolean']

  /**
   * Compare two values of any type in a deterministic, natural way.
   *
   * For numeric values, the function works the same as `math.compare`.
   * For types of values that can't be compared mathematically,
   * the function compares in a natural way.
   *
   * For numeric values, x and y are considered equal when the relative
   * difference between x and y is smaller than the configured epsilon.
   * The function cannot be used to compare values smaller than
   * approximately 2.22e-16.
   *
   * For Complex numbers, first the real parts are compared. If equal,
   * the imaginary parts are compared.
   *
   * Strings are compared with a natural sorting algorithm, which
   * orders strings in a "logic" way following some heuristics.
   * This differs from the function `compare`, which converts the string
   * into a numeric value and compares that. The function `compareText`
   * on the other hand compares text lexically.
   *
   * Arrays and Matrices are compared value by value until there is an
   * unequal pair of values encountered. Objects are compared by sorted
   * keys until the keys or their values are unequal.
   *
   * Syntax:
   *
   *    math.compareNatural(x, y)
   *
   * Examples:
   *
   *    math.compareNatural(6, 1)              // returns 1
   *    math.compareNatural(2, 3)              // returns -1
   *    math.compareNatural(7, 7)              // returns 0
   *
   *    math.compareNatural('10', '2')         // returns 1
   *    math.compareText('10', '2')            // returns -1
   *    math.compare('10', '2')                // returns 1
   *
   *    math.compareNatural('Answer: 10', 'Answer: 2') // returns 1
   *    math.compareText('Answer: 10', 'Answer: 2')    // returns -1
   *    math.compare('Answer: 10', 'Answer: 2')
   *        // Error: Cannot convert "Answer: 10" to a number
   *
   *    const a = math.unit('5 cm')
   *    const b = math.unit('40 mm')
   *    math.compareNatural(a, b)              // returns 1
   *
   *    const c = math.complex('2 + 3i')
   *    const d = math.complex('2 + 4i')
   *    math.compareNatural(c, d)              // returns -1
   *
   *    math.compareNatural([1, 2, 4], [1, 2, 3]) // returns 1
   *    math.compareNatural([1, 2, 3], [1, 2])    // returns 1
   *    math.compareNatural([1, 5], [1, 2, 3])    // returns 1
   *    math.compareNatural([1, 2], [1, 2])       // returns 0
   *
   *    math.compareNatural({a: 2}, {a: 4})       // returns -1
   *
   * See also:
   *
   *    compare, compareText
   *
   * @param  {*} x First value to compare
   * @param  {*} y Second value to compare
   * @return {number} Returns the result of the comparison:
   *                  1 when x > y, -1 when x < y, and 0 when x == y.
   */
  return typed(name, {
    'any, any': function (x, y) {
      const typeX = typeOf(x)
      const typeY = typeOf(y)
      let c

      // numeric types
      if ((typeX === 'number' || typeX === 'BigNumber' || typeX === 'Fraction') &&
          (typeY === 'number' || typeY === 'BigNumber' || typeY === 'Fraction')) {
        c = compare(x, y)
        if (c.toString() !== '0') {
          // c can be number, BigNumber, or Fraction
          return c > 0 ? 1 : -1 // return a number
        } else {
          return naturalSort(typeX, typeY)
        }
      }

      // matrix types
      if (typeX === 'Array' || typeX === 'Matrix' ||
          typeY === 'Array' || typeY === 'Matrix') {
        c = compareMatricesAndArrays(this, x, y)
        if (c !== 0) {
          return c
        } else {
          return naturalSort(typeX, typeY)
        }
      }

      // in case of different types, order by name of type, i.e. 'BigNumber' < 'Complex'
      if (typeX !== typeY) {
        return naturalSort(typeX, typeY)
      }

      if (typeX === 'Complex') {
        return compareComplexNumbers(x, y)
      }

      if (typeX === 'Unit') {
        if (x.equalBase(y)) {
          return this(x.value, y.value)
        }

        // compare by units
        return compareArrays(this, x.formatUnits(), y.formatUnits())
      }

      if (typeX === 'boolean') {
        return compareBooleans(x, y)
      }

      if (typeX === 'string') {
        return naturalSort(x, y)
      }

      if (typeX === 'Object') {
        return compareObjects(this, x, y)
      }

      if (typeX === 'null') {
        return 0
      }

      if (typeX === 'undefined') {
        return 0
      }

      // this should not occur...
      throw new TypeError('Unsupported type of value "' + typeX + '"')
    }
  })

  /**
   * Compare mixed matrix/array types, by converting to same-shaped array.
   * This comparator is non-deterministic regarding input types.
   * @param {Array | SparseMatrix | DenseMatrix | *} x
   * @param {Array | SparseMatrix | DenseMatrix | *} y
   * @returns {number} Returns the comparison result: -1, 0, or 1
   */
  function compareMatricesAndArrays (compareNatural, x, y) {
    if (isSparseMatrix(x) && isSparseMatrix(y)) {
      return compareArrays(compareNatural, x.toJSON().values, y.toJSON().values)
    }
    if (isSparseMatrix(x)) {
      // note: convert to array is expensive
      return compareMatricesAndArrays(compareNatural, x.toArray(), y)
    }
    if (isSparseMatrix(y)) {
      // note: convert to array is expensive
      return compareMatricesAndArrays(compareNatural, x, y.toArray())
    }

    // convert DenseArray into Array
    if (isDenseMatrix(x)) {
      return compareMatricesAndArrays(compareNatural, x.toJSON().data, y)
    }
    if (isDenseMatrix(y)) {
      return compareMatricesAndArrays(compareNatural, x, y.toJSON().data)
    }

    // convert scalars to array
    if (!Array.isArray(x)) {
      return compareMatricesAndArrays(compareNatural, [x], y)
    }
    if (!Array.isArray(y)) {
      return compareMatricesAndArrays(compareNatural, x, [y])
    }

    return compareArrays(compareNatural, x, y)
  }

  /**
   * Compare two Arrays
   *
   * - First, compares value by value
   * - Next, if all corresponding values are equal,
   *   look at the length: longest array will be considered largest
   *
   * @param {Array} x
   * @param {Array} y
   * @returns {number} Returns the comparison result: -1, 0, or 1
   */
  function compareArrays (compareNatural, x, y) {
    // compare each value
    for (let i = 0, ii = Math.min(x.length, y.length); i < ii; i++) {
      const v = compareNatural(x[i], y[i])
      if (v !== 0) {
        return v
      }
    }

    // compare the size of the arrays
    if (x.length > y.length) { return 1 }
    if (x.length < y.length) { return -1 }

    // both Arrays have equal size and content
    return 0
  }

  /**
   * Compare two objects
   *
   * - First, compare sorted property names
   * - Next, compare the property values
   *
   * @param {Object} x
   * @param {Object} y
   * @returns {number} Returns the comparison result: -1, 0, or 1
   */
  function compareObjects (compareNatural, x, y) {
    const keysX = Object.keys(x)
    const keysY = Object.keys(y)

    // compare keys
    keysX.sort(naturalSort)
    keysY.sort(naturalSort)
    const c = compareArrays(compareNatural, keysX, keysY)
    if (c !== 0) {
      return c
    }

    // compare values
    for (let i = 0; i < keysX.length; i++) {
      const v = compareNatural(x[keysX[i]], y[keysY[i]])
      if (v !== 0) {
        return v
      }
    }

    return 0
  }
})

/**
 * Compare two complex numbers, `x` and `y`:
 *
 * - First, compare the real values of `x` and `y`
 * - If equal, compare the imaginary values of `x` and `y`
 *
 * @params {Complex} x
 * @params {Complex} y
 * @returns {number} Returns the comparison result: -1, 0, or 1
 */
function compareComplexNumbers (x, y) {
  if (x.re > y.re) { return 1 }
  if (x.re < y.re) { return -1 }

  if (x.im > y.im) { return 1 }
  if (x.im < y.im) { return -1 }

  return 0
}
