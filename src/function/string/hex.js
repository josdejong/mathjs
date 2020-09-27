import { createBaseFormatterFactory } from './baseUtils'

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
 * @return {string}         The formatted value
 */
export const createHex = createBaseFormatterFactory('hex', 16)
