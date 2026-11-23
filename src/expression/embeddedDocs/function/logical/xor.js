export const xorDocs = {
  name: 'xor',
  category: 'Logical',
  syntax: [
    'x xor y',
    'xor(x, y)',
    'xor(x, y, z, ...)'
  ],
  description: 'Logical exclusive or, xor. Test whether one and only one value is defined with a nonzero/nonempty value.',
  examples: [
    'true xor false',
    'false xor false',
    'true xor true',
    '0 xor 4',
    'xor(true, true, true)'
  ],
  seealso: [
    'not', 'and', 'or'
  ]
}
