export const invmodDocs = {
  name: 'invmod',
  category: 'Arithmetic',
  syntax: [
    'invmod(a, b)'
  ],
  description: 'Calculate the (modular) multiplicative inverse of a modulo b. Solution to the equation ax ≣ 1 (mod b)',
  examples: [
    'invmod(8, 12)=NaN',
    'invmod(7, 13)=2',
    'invmod(15151, 15122)=10429'
  ],
  seealso: ['gcd', 'xgcd']
}
