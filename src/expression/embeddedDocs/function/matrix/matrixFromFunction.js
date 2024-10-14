export const matrixFromFunctionDocs = {
  name: 'matrixFromFunction',
  category: 'Matrix',
  syntax: [
    'matrixFromFunction(size, fn)',
    'matrixFromFunction(size, fn, format)',
    'matrixFromFunction(size, fn, format, datatype)',
    'matrixFromFunction(size, format, fn)',
    'matrixFromFunction(size, format, datatype, fn)'
  ],
  description: 'Create a matrix by evaluating a generating function at each index.',
  examples: [
    'f(I) = I[1] - I[2]',
    'matrixFromFunction([3,3], f)',
    'g(I) = I[1] - I[2] == 1 ? 4 : 0',
    'matrixFromFunction([100, 100], "sparse", g)',
    'matrixFromFunction([5], random)'
  ],
  seealso: [
    'matrix', 'matrixFromRows', 'matrixFromColumns', 'zeros'
  ]
}
