export const finiteDocs = {
  name: 'finite',
  category: 'Utils',
  syntax: [
    'finite(x)'
  ],
  description: 'Test whether a value is finite.',
  examples: [
    'finite(Infinity)',
    'finite(bigint(3))',
    'finite([3, -Infinity, -3])'
  ],
  seealso: ['isNumeric', 'isNaN', 'isNegative', 'isPositive']
}
