export const orDocs = {
  name: 'or',
  category: 'Logical',
  syntax: [
    'x or y',
    'or(x, y)',
    'or(x, y, z, ...)'
  ],
  description: 'Logical or. Test if at least one value is defined with a nonzero/nonempty value.',
  examples: [
    'true or false',
    'false or false',
    '0 or 4',
    'or(0, 0, 4)'
  ],
  seealso: [
    'not', 'and', 'xor'
  ]
}
