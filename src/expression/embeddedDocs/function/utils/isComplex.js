/**
 * Test whether a value is a complex number.
 *
 * Syntax:
 *
 *     math.isComplex(x)
 *
 * Examples:
 *
 *    math.isComplex(math.complex("2-3i"))  // returns true
 *    math.isComplex(3)                     // returns false
 *
 * See also:
 *
 *    isNumber, isBigNumber
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a complex number, false otherwise.
 */
export const isComplexDocs = {
  name: 'isComplex',
  category: 'Type Checks',
  syntax: ['isComplex(x)'],
  description: 'Test whether a value is a Complex number.',
  examples: ['isComplex(math.complex("2-3i"))', 'isComplex(3)'],
  seealso: ['isNumber', 'isBigNumber']
}
