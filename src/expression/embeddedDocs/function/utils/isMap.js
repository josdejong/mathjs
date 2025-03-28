/**
 * Test whether a value is a Map.
 *
 * Syntax:
 *
 *     math.isMap(x)
 *
 * Examples:
 *
 *    math.isMap(new Map())
 *
 * See also:
 *  isObject
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a Map, false otherwise.
 */
export const isMapDocs = {
  name: 'isMap',
  category: 'Type Checks',
  syntax: ['isMap(x)'],
  description: 'Check if a value is a Map.',
  examples: ['isMap(new Map())'],
  seealso: ['isObject']
}
