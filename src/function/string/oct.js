import { createBaseFormatterFactory } from './baseUtils'

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

export const createOct = createBaseFormatterFactory('oct', 8)
