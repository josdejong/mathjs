import { factory } from '../../utils/factory'

const name = 'oct'
const dependencies = ['typed', 'format']

/**
 * Format a number as octal.
 *
 * Syntax:
 *
 *    math.oct(value)
 *
 * Examples:
 *
 *    //the following outputs "0o70"
 *    math.oct(56)
 *
 * See also:
 *
 *    bin
 *    hex
 *
 * @param {number} value  Value to be stringified
 * @return {string}       The formatted value
 */

export const createOct = factory(name, dependencies, ({ typed, format }) => {
  return typed(name, {
    'number | BigNumber': function(n) {
      return format(n, {base: 8})
    },
    'number | BigNumber, number': function(n, wordSize) {
      return format(n, {base: 8, wordSize: wordSize})
    }
  })
})
