import { factory } from '../../utils/factory.js'
import { noBignumber, noMatrix } from '../../utils/noop.js'

const name = 'range'
const dependencies = ['typed', 'config', '?matrix', '?bignumber', 'smaller', 'smallerEq', 'larger', 'largerEq', 'add', 'isPositive']

export const createRange = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, matrix, bignumber, smaller, smallerEq, larger, largerEq, add, isPositive }) => {
  /**
   * Create an array from a range.
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
   * - `start: {number | BigNumber | Unit}`
   *   Start of the range
   * - `end: number | BigNumber | Unit`
   *   End of the range, excluded by default, included when parameter includeEnd=true
   * - `step: number | BigNumber | Unit`
   *   Step size. Default value is 1.
   * - `includeEnd: boolean`
   *   Option to specify whether to include the end or not. False by default.
   *
   * Examples:
   *
   *     math.range(2, 6)        // [2, 3, 4, 5]
   *     math.range(2, -3, -1)   // [2, 1, 0, -1, -2]
   *     math.range('2:1:6')     // [2, 3, 4, 5]
   *     math.range(2, 6, true)  // [2, 3, 4, 5, 6]
   *     math.range(math.unit(2, 'm'), math.unit(-3, 'm'), math.unit(-1, 'm')) // [2 m, 1 m, 0 m , -1 m, -2 m]
   *
   * See also:
   *
   *     ones, zeros, size, subset
   *
   * @param {*} args   Parameters describing the ranges `start`, `end`, and optional `step`.
   * @return {Array | Matrix} range
   */
  return typed(name, {
    // TODO: simplify signatures when typed-function supports default values and optional arguments

    // TODO: a number or boolean should not be converted to string here
    string: _strRange,
    'string, boolean': _strRange,

    'number, number': function (start, end) {
      return _out(_range(start, end, 1, false))
    },
    'number, number, number': function (start, end, step) {
      return _out(_range(start, end, step, false))
    },
    'number, number, boolean': function (start, end, includeEnd) {
      return _out(_range(start, end, 1, includeEnd))
    },
    'number, number, number, boolean': function (start, end, step, includeEnd) {
      return _out(_range(start, end, step, includeEnd))
    },

    'BigNumber, BigNumber': function (start, end) {
      const BigNumber = start.constructor

      return _out(_range(start, end, new BigNumber(1), false))
    },
    'BigNumber, BigNumber, BigNumber': function (start, end, step) {
      return _out(_range(start, end, step, false))
    },
    'BigNumber, BigNumber, boolean': function (start, end, includeEnd) {
      const BigNumber = start.constructor

      return _out(_range(start, end, new BigNumber(1), includeEnd))
    },
    'BigNumber, BigNumber, BigNumber, boolean': function (start, end, step, includeEnd) {
      return _out(_range(start, end, step, includeEnd))
    },
    'Unit, Unit, Unit': function (start, end, step) {
      return _out(_range(start, end, step, false))
    },
    'Unit, Unit, Unit, boolean': function (start, end, step, includeEnd) {
      return _out(_range(start, end, step, includeEnd))
    }

  })

  function _out (arr) {
    if (config.matrix === 'Matrix') {
      return matrix ? matrix(arr) : noMatrix()
    }

    return arr
  }

  function _strRange (str, includeEnd) {
    const r = _parse(str)
    if (!r) {
      throw new SyntaxError('String "' + str + '" is no valid range')
    }

    if (config.number === 'BigNumber') {
      if (bignumber === undefined) {
        noBignumber()
      }

      return _out(_range(
        bignumber(r.start),
        bignumber(r.end),
        bignumber(r.step)),
      includeEnd)
    } else {
      return _out(_range(r.start, r.end, r.step, includeEnd))
    }
  }

  /**
   * Create a range with numbers or BigNumbers
   * @param {number | BigNumber | Unit} start
   * @param {number | BigNumber | Unit} end
   * @param {number | BigNumber | Unit} step
   * @param {boolean} includeEnd
   * @returns {Array} range
   * @private
   */
  function _range (start, end, step, includeEnd) {
    const array = []
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

  /**
   * Parse a string into a range,
   * The string contains the start, optional step, and end, separated by a colon.
   * If the string does not contain a valid range, null is returned.
   * For example str='0:2:11'.
   * @param {string} str
   * @return {{start: number, end: number, step: number} | null} range Object containing properties start, end, step
   * @private
   */
  function _parse (str) {
    const args = str.split(':')

    // number
    const nums = args.map(function (arg) {
      // use Number and not parseFloat as Number returns NaN on invalid garbage in the string
      return Number(arg)
    })

    const invalid = nums.some(function (num) {
      return isNaN(num)
    })
    if (invalid) {
      return null
    }

    switch (nums.length) {
      case 2:
        return {
          start: nums[0],
          end: nums[1],
          step: 1
        }

      case 3:
        return {
          start: nums[0],
          end: nums[2],
          step: nums[1]
        }

      default:
        return null
    }
  }
})
