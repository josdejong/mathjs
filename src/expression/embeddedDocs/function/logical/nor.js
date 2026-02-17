export const norDocs = {
  name: 'nor',
  category: 'Logical',
  syntax: [
    'x nor y',
    'nor(x, y)'
  ],
  description: 'Logical nor. Test if both values are zero',
  examples: [
    'nor(true, false)',
    'nor(false, false)',
    'nor(0, 4)'
  ],
  seealso: [
    'not', 'or', 'xor'
  ]
}
