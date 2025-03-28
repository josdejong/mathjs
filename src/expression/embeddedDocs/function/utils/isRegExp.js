/**
 * Test whether a value is a regular expression.
 *
 * Syntax:
 *
 *     math.isRegExp(x)
 *
 * Examples:
 *
 *    math.isRegExp(/abc/)
 *
 * See also:
 *  isString
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a RegExp, false otherwise.
 */
export const isRegExpDocs = {
  name: 'isRegExp',
  category: 'Type Checks',
  syntax: ['isRegExp(x)'],
  description: 'Check if a value is a regular expression.',
  examples: ['isRegExp(/abc/)'],
  seealso: ['isString']
}
