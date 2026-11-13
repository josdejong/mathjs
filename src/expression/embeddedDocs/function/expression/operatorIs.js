export const operatorIsDocs = {
  name: 'operatorIs',
  category: 'Expression',
  syntax: [
    'operatorIs(node, property)',
    'operatorIs(opName, property)',
    'operatorIs(node, property, context)',
    'operatorIs(opName, property, context)'
  ],
  description: 'Returns true or false depending on whether the operator in the' +
    'first argument has the specified property, optionally relative to a' +
    'supplied context',
  examples: [
    "operatorIs(parse('x y'), 'associative')",
    "operatorIs('divide', 'commutative')",
    "operatorIs('abs', 'trivial', {abs: {trivial: true}})"
  ],
  seealso: ['simplify']
}
