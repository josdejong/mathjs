module.exports = {
  'name': 'quarternion',
  'category': 'Construction',
  'syntax': [
    'quarternion()',
    'quarternion(r, i, j, k)',
    'quarternion(string)',
    'quarternion(complex)',
    'quarternion({})'
  ],
  'description':
      'Create a quarternion number.',
  'examples': [
    'quarternion()',
    'quarternion(2, 3)',
    'quarternion("7 - 2i + 2j -7j")',
    'quarternion({r:1, i;2, j:-3, k:-9})',
    'quarternion(new complex(2,3))'
  ],
  'seealso': [
    'bignumber', 'boolean', 'index', 'matrix', 'number', 'string', 'unit'
  ]
};
