export const hasNumericValueDocs = {
  name: 'hasNumericValue',
  category: 'Utils',
  syntax: [
    'hasNumericValue(x)'
  ],
  description: 'Test whether a value is an numeric value. ' +
    'In case of a string, true is returned if the string contains a numeric value.',
  examples: [
    'hasNumericValue(2)',
    'hasNumericValue("2")',
    'isNumeric("2")',
    'hasNumericValue(0)',
    'hasNumericValue(bignumber(500))',
    'hasNumericValue(fraction(0.125))',
    'hasNumericValue(2 + 3i)',
    'hasNumericValue([2.3, "foo", false])'
  ],
  seealso: ['isInteger', 'isZero', 'isNegative', 'isPositive', 'isNaN', 'isNumeric']
}
