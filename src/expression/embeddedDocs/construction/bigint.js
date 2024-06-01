export const bigintDocs = {
  name: 'bigint',
  category: 'Construction',
  syntax: [
    'bigint(x)'
  ],
  description:
      'Create a bigint, an integer with an arbitrary number of digits, from a number or string.',
  examples: [
    '123123123123123123 # a large number will lose digits',
    'bigint("123123123123123123")',
    'bignumber(["1", "3", "5"])'
  ],
  seealso: [
    'boolean', 'bignumber', 'number', 'complex', 'fraction', 'index', 'matrix', 'string', 'unit'
  ]
}
