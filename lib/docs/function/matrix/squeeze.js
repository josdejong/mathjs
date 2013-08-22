module.exports = {
  'name': 'squeeze',
  'category': 'Matrix',
  'syntax': [
    'squeeze(x)'
  ],
  'description': 'Remove singleton dimensions from a matrix.',
  'examples': [
    'a = zeros(1,3,2)',
    'size(squeeze(a))',
    'b = zeros(3,1,1)',
    'size(squeeze(b))'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'subset', 'transpose', 'zeros'
  ]
};
