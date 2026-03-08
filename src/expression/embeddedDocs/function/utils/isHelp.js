/**
 * Test whether a value requests help.
 *
 * Syntax:
 *
 *     math.isHelp(x)
 *
 * Examples:
 *
 *    math.isHelp()
 *
 * See also:
 *  help
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a help request, false otherwise.
 */
export const isHelpDocs = {
  name: 'isHelp',
  category: 'Type Checks',
  syntax: ['isHelp(x)'],
  description: 'Check if a value requests help.',
  examples: ['isHelp(/* example value */)'],
  seealso: ['help']
}
