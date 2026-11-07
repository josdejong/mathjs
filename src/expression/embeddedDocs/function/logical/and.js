export const andDocs = {
  name: 'and',
  category: 'Logical',
  syntax: [
    'x and y',
    'and(x, y)',
    'and(x, y, z, ...)'
  ],
  description: 'Logical and. Test whether all values are defined with a nonzero/nonempty value.',
  examples: [
    'true and false',
    'true and true',
    '2 and 4',
    'and(2, 4, 0)'
  ],
  seealso: [
    'not', 'or', 'xor'
  ]
}
