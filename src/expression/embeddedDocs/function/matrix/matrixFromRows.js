export const matrixFromRowsDocs = {
  name: 'matrixFromRows',
  category: 'Matrix',
  syntax: [
    'matrixFromRows(...arr)',
    'matrixFromRows(row1, row2)',
    'matrixFromRows(row1, row2, row3)'
  ],
  description: 'Create a dense matrix from vectors as individual rows.',
  examples: [
    'matrixFromRows([1, 2, 3], [[4],[5],[6]])'
  ],
  seealso: [
    'matrix', 'matrixFromColumns', 'matrixFromFunction', 'zeros'
  ]
}
