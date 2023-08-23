export const polynomialRootDocs = {
  name: 'polynomialRoot',
  category: 'Algebra',
  syntax: [
    'x=polynomialRoot(-6, 3)',
    'x=polynomialRoot(4, -4, 1)',
    'x=polynomialRoot(-8, 12, -6, 1)'
  ],
  description: 'Finds the roots of a univariate polynomial given by its coefficients starting from constant, linear, and so on, increasing in degree.',
  examples: [
    'a = polynomialRoot(-6, 11, -6, 1)'
  ],
  seealso: [
    'cbrt', 'sqrt'
  ]
}
