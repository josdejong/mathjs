import { createBaseFormatterFactory } from './baseUtils'

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
export const createBin = createBaseFormatterFactory('bin', 2)
