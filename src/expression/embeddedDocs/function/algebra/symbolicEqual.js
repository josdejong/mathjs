export const symbolicEqualDocs = {
  name: 'symbolicEqual',
  category: 'Algebra',
  syntax: [
    'symbolicEqual(expr1, expr2)',
    'symbolicEqual(expr1, expr2, options)'
  ],
  description: 'Returns true if the difference of the expressions simplifies to 0',
  examples: [
    'symbolicEqual("x*y","y*x")',
    'symbolicEqual("abs(x^2)", "x^2")',
    'symbolicEqual("abs(x)", "x", {context: {abs: {trivial: true}}})'
  ],
  seealso: ['simplify', 'evaluate']
}
