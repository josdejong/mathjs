export const invmodDocs = {
  name: 'invmod',
  category: 'Arithmetic',
  syntax: [
    'invmod(a, b)'
  ],
  description: 'Calculate the (modular) multiplicative inverse of a modulo b. Solution to the equation ax ≣ 1 (mod b)',
  examples: [
    'invmod(8, 12)',
    'invmod(7, 13)',
    'invmod(15151, 15122)'
  ],
  seealso: ['gcd', 'xgcd']
}
