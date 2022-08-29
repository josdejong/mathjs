export const pinvDocs = {
  name: 'pinv',
  category: 'Matrix',
  syntax: [
    'pinv(x)'
  ],
  description: 'Calculate the Moore–Penrose inverse of a matrix',
  examples: [
    'pinv([1, 2; 3, 4])',
    'pinv([[1, 0], [0, 1], [0, 1]])',
    'pinv(4)'
  ],
  seealso: [
    'inv'
  ]
}
