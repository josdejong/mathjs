/**
 * Test whether a value is a Unit.
 *
 * Syntax:
 *
 *     math.isUnit(x)
 *
 * Examples:
 *
 *    math.isUnit(math.unit('5cm'))  // returns true
 *    math.isUnit(5)                 // returns false
 *
 * See also:
 *
 *    Unit
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a unit, false otherwise.
 */
export const isUnitDocs = {
  name: 'isUnit',
  category: 'Type Checks',
  syntax: ['isUnit(x)'],
  description: 'Test whether a value is a Unit.',
  examples: ['isUnit(math.unit("5cm"))', 'isUnit(5)'],
  seealso: ['Unit']
}
