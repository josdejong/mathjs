import { factory } from '../../utils/factory.js'
import { parseRange } from '../../utils/collection.js'

const name = 'range'
export const dependencies = ['typed', 'config', '?Range', '?matrix', '?bignumber', 'equal', 'smaller', 'smallerEq', 'larger', 'largerEq', 'add', 'isZero', 'isPositive']

export const createRange = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, Range, matrix, bignumber, smaller, smallerEq, larger, largerEq, add, isZero, isPositive }) => {
  /**
   * Create a matrix or array containing a range of values.
   * By default, the range end is excluded. This can be customized by providing
   * an extra parameter `includeEnd`.
   *
   * Syntax:
   *
   *     math.range(str [, includeEnd])               // Create a range from a string,
   *                                                  // where the string contains the
   *                                                  // start, optional step, and end,
   *                                                  // separated by a colon.
   *     math.range(start, end [, includeEnd])        // Create a range with start and
   *                                                  // end and a step size of 1.
   *     math.range(start, end, step [, includeEnd])  // Create a range with start, step,
   *                                                  // and end.
   *
   * Where:
   *
   * - `str: string`
   *   A string 'start:end' or 'start:step:end'
   * - `start: {number | bigint | BigNumber | Fraction | Unit}`
   *   Start of the range
   * - `end: number | bigint | BigNumber | Fraction | Unit`
   *   End of the range, excluded by default, included when parameter includeEnd=true
   * - `step: number | bigint | BigNumber | Fraction | Unit`
   *   Step size. Default value is 1.
   * - `includeEnd: boolean`
   *   Option to specify whether to include the end or not. False by default.
   *
   * The function returns a `DenseMatrix` when the library is configured with
   * `config = { matrix: 'Matrix' }, and returns an Array otherwise.
   * Note that the type of the returned values is taken from the type of the
   * provided start/end value. If only one of these is a built-in `number` type,
   * it will be promoted to the type of the other endpoint. However, in the case
   * of Unit values, both endpoints must have compatible units, and the return
   * value will have compatible units as well.
   *
   * Examples:
   *
   *     math.range(2, 6)        // [2, 3, 4, 5]
   *     math.range(2, -3, -1)   // [2, 1, 0, -1, -2]
   *     math.range('2:1:6')     // [2, 3, 4, 5]
   *     math.range(2, 6, true)  // [2, 3, 4, 5, 6]
   *     math.range(2, math.fraction(8,3), math.fraction(1,3)) // [fraction(2), fraction(7,3)]
   *     math.range(math.unit(2, 'm'), math.unit(-3, 'm'), math.unit(-1, 'm')) // [2 m, 1 m, 0 m , -1 m, -2 m]
   *
   * See also:
   *
   *     ones, zeros, size, subset
   *
   * @param {*} args   Parameters describing the range's `start`, `end`, and optional `step`.
   * @return {Array | Matrix} range
   */
  const MathType = 'number|bigint|BigNumber|Fraction|Unit|Array|Matrix'
  // Is anything else needed on that list?
  let tempDebug = false
  return typed(name, {
    // TODO: simplify signatures when typed-function supports default values and optional arguments

    // string arguments just get broken up and passed back to range:
    string: typed.referToSelf(
      self => str => _redispatchStrings(self, str, false)),
    'string, boolean': typed.referToSelf(
      self => (str, includeEnd) => _redispatchStrings(self, str, includeEnd)),

    number: function (oops) {
      throw new TypeError(`Too few arguments to function range(): ${oops}`)
    },

    boolean: function (oops) {
      throw new TypeError(
        'Unexpected type of argument 1 to function range(): ' +
        `${oops}, number|bigint|BigNumber|Fraction`)
    },

    [`${MathType}, ${MathType}`]: _range,
    [`${MathType}, ${MathType}, ${MathType}`]: _range,
    [`${MathType}, ${MathType}, boolean`]:
      (start, end, includeEnd) => _range(start, end, undefined, includeEnd),
    [`${MathType}, ${MathType}, ${MathType}, boolean`]: _range
  })

  function _redispatchStrings (fullRange, str, includeEnd) {
    const fields = parseRange(str)
    if (fields === null) {
      throw new SyntaxError(`String '${str}' does not represent a range`)
    }
    const step = fields.step || '1'
    const start = fields.start || '0'
    const end = fields.end || 'Infinity'
    // let typed-function handle the strings
    console.log('Redispatching with', start, end, step, includeEnd)
    tempDebug = true
    const result = fullRange(start, end, step, includeEnd)
    tempDebug = false
    return result
  }

  /**
   * Create a range from start, step, end
   * @param {MathType} start
   * @param {MathType} end
   * @param {MathType} step
   * @param {boolean} includeEnd
   * @returns {Range | Array} range
   * @private
   */
  function _range (start, end, step, includeEnd = false) {
    if (tempDebug) {
      console.log('Arrived with', typeof start, start, typeof end, end, typeof step, step, includeEnd)
    }
    if (Range) {
      const range = new Range(
        includeEnd ? { start, step, last: end } : { start, step, end })
      return config.matrix === 'Array' ? range.toArray() : range
    }
    // Otherwise we have to make up an Array ourselves:
    const array = []
    if (isZero(step)) throw new Error('Step must be non-zero')
    const ongoing = isPositive(step)
      ? includeEnd ? smallerEq : smaller
      : includeEnd ? largerEq : larger
    let x = start
    while (ongoing(x, end)) {
      array.push(x)
      x = add(x, step)
    }
    return array
  }
})
