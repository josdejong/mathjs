export const indexDocs = {
  name: 'index',
  category: 'Construction',
  syntax: [
    '[start]',
    '[start:end]',
    '[start:step:end]',
    '[start1, start 2, ...]',
    '[start1:end1, start2:end2, ...]',
    '[start1:step1:end1, start2:step2:end2, ...]'
  ],
  description:
      'Create an index to get or replace a subset of a matrix',
  examples: [
    'A = [1, 2, 3; 4, 5, 6]',
    'A[1, :]',
    'A[1, 2] = 50',
    'A[1:2, 1:2] = 1',
    'B = [1, 2, 3]',
    'B[B>1 and B<3]'
  ],
  seealso: [
    'bignumber', 'boolean', 'complex', 'matrix', 'number', 'range', 'string', 'unit'
  ]
}
