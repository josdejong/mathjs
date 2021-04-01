export const matrixFromFunctionDocs = {
  name: 'matrixFromFunction',
  category: 'Matrix',
  syntax: [
    'math.matrixFromFunction(size, fn)',
    'math.matrixFromFunction(size, fn, format)',
    'math.matrixFromFunction(size, fn, format, datatype)',
    'math.matrixFromFunction(size, format, fn)',
    'math.matrixFromFunction(size, format, datatype, fn)'
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
