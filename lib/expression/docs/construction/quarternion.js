module.exports = {
  'name': 'quaternion',
  'category': 'Construction',
  'syntax': [
    'quaternion()',
    'quaternion(r, i, j, k)',
    'quaternion(string)',
    'quaternion(complex)',
    'quaternion({})'
  ],
  'description':
      'Create a quaternion number.',
  'examples': [
    'quaternion()',
    'quaternion(2, 3)',
    'quaternion("7 - 2i + 2j -7j")',
    'quaternion({r:1, i;2, j:-3, k:-9})',
    'quaternion(new complex(2,3))'
  ],
  'seealso': [
    'bignumber', 'boolean', 'index', 'matrix', 'number', 'string', 'unit'
  ]
};
