export const nandDocs = {
  name: 'nand',
  category: 'Logical',
  syntax: [
    'x nand y',
    'nand(x, y)'
  ],
  description: 'Logical nand. Test whether at least one of values is zero.',
  examples: [
    'nand(true, false)',
    'nand(true, true)',
    'nand(2, 4)'
  ],
  seealso: [
    'not', 'or', 'xor'
  ]
}
