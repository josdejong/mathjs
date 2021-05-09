export const matrixFromColumnsDocs = {
  name: 'matrixFromColumns',
  category: 'Matrix',
  syntax: [
    'math.matrixFromColumns(...arr)',
    'math.matrixFromColumns(row1, row2)',
    'math.matrixFromColumns(row1, row2, row3)'
  ],
  description: 'Create a dense matrix from vectors as individual columns.',
  examples: [
    'matrixFromColumns([1, 2, 3], [[4],[5],[6]])'
  ],
  seealso: [
    'matrix', 'matrixFromRows', 'matrixFromFunction', 'zeros'
  ]
}
