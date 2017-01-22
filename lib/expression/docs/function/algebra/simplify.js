module.exports = {
  'name': 'simplify',
  'category': 'Algebra',
  'syntax': [
    'simplify(expr)',
    'simplify(expr, rules)'
  ],
  'description': 'Simplify an expression tree.',
  'examples': [
    'simplify("3 + 2 / 4")',
    'simplify("x^2 + x + 3 + x^2")',
    'f = parse("x^2 + x")',
    'simplified = simplify(f)',
    'simplified.eval({x: 4})'
  ],
  'seealso': [
    'derivative', 'parse', 'eval'
  ]
};
