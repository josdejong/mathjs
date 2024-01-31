import { factory } from '../../utils/factory.js'

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
 * @param {number | BigNumber} value    Value to be stringified
 * @param {number | BigNumber} wordSize Optional word size (see `format`)
 * @return {string}         The formatted value
 */
export const createBin = factory(name, dependencies, ({ typed, format }) => {
  return typed(name, {
    'number | BigNumber': function (n) {
      return format(n, { notation: 'bin' })
    },
    'number | BigNumber, number | BigNumber': function (n, wordSize) {
      return format(n, { notation: 'bin', wordSize })
    }
  })
})
