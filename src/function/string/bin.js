import { factory } from '../../utils/factory'

const name = 'bin'
const dependencies = ['typed', 'format']

/**
 * Format a number as binary.
 *
 * Syntax:
 *
 *    math.bin(value)
 *
 * Examples:
 *
 *    //the following outputs "0b10"
 *    math.bin(2)
 *
 * See also:
 *
 *    oct
 *    hex
 *
 * @param {number} value    Value to be stringified
 * @return {string}         The formatted value
 */
export const createBin = factory(name, dependencies, ({ typed, format }) => {
  return typed(name, {
    'number | BigNumber': function (n) {
      return format(n, { base: 2 })
    },
    'number | BigNumber, number': function (n, wordSize) {
      return format(n, { base: 2, wordSize: wordSize })
    }
  })
})
