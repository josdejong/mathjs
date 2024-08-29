export const mapDocs = {
  name: 'map',
  category: 'Matrix',
  syntax: [
    'map(x, callback)',
    'map(x, y, ..., callback)'
  ],
  description: 'Create a new matrix or array with the results of the callback function executed on each entry of the matrix/array or the matrices/arrays.',
  examples: [
    'map([1, 2, 3], square)',
    'map([1, 2], [3, 4], f(a,b) = a + b)'
  ],
  seealso: ['filter', 'forEach']
}
