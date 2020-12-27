import { factory } from '../../utils/factory.js'

const name = 'hex'
const dependencies = ['typed', 'format']

/**
 * Format a number as hexadecimal.
 *
 * Syntax:
 *
 *    math.hex(value)
 *
 * Examples:
 *
 *    //the following outputs "0xF0"
 *    math.hex(240)
 *
 * See also:
 *
 *    oct
 *    bin
 *
 * @param {number} value    Value to be stringified
 * @param {number} wordSize Optional word size (see `format`)
 * @return {string}         The formatted value
 */
export const createHex = factory(name, dependencies, ({ typed, format }) => {
  return typed(name, {
    'number | BigNumber': function (n) {
      return format(n, { notation: 'hex' })
    },
    'number | BigNumber, number': function (n, wordSize) {
      return format(n, { notation: 'hex', wordSize: wordSize })
    }
  })
})
