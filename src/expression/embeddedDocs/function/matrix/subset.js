export const subsetDocs = {
  name: 'subset',
  category: 'Matrix',
  syntax: [
    'value(index)',
    'value(index) = replacement',
    'subset(value, [index])',
    'subset(value, [index], replacement)'
  ],
  description: 'Get or set a subset of the entries of a matrix or ' +
      'characters of a string. ' +
      'Indexes are one-based. There should be one index specification for ' +
      'each dimension of the target. Each specification can be a single ' +
      'index, a list of indices, or a range in colon notation `l:u`. ' +
      'In a range, both the lower bound l and upper bound u are included; ' +
      'and if a bound is omitted it defaults to the most extreme valid value. ' +
      'The cartesian product of the indices specified in each dimension ' +
      'determines the target of the operation.',
  examples: [
    'd = [1, 2; 3, 4]',
    'e = []',
    'e[1, 1:2] = [5, 6]',
    'e[2, :] = [7, 8]',
    'f = d * e',
    'f[2, 1]',
    'f[:, 1]',
    'f[[1,2], [1,3]] = [9, 10; 11, 12]',
    'f'
  ],
  seealso: [
    'concat', 'det', 'diag', 'identity', 'inv', 'ones', 'range', 'size', 'squeeze', 'trace', 'transpose', 'zeros'
  ]
}
