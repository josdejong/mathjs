export const isBoundedDocs = {
  name: 'isBounded',
  category: 'Utils',
  syntax: [
    'isBounded(x)'
  ],
  description: 'Test whether a value or its entries are bounded.',
  examples: [
    'isBounded(Infinity)',
    'isBounded(bigint(3))',
    'isBounded([3, -Infinity, -3])'
  ],
  seealso: ['isFinite', 'isNumeric', 'isNaN', 'isNegative', 'isPositive']
}
