export const powmodDocs = {
  name: 'powmod',
  category: 'Arithmetic',
  syntax: [
    'powmod(b, e, m)'
  ],
  description: 'Calculate the modular exponentiation b^e mod m without computing the full power. All arguments must be integers and m must be non-zero. A negative exponent uses the modular inverse of b.',
  examples: [
    'powmod(10, 58, 531)',
    'powmod(2, 10, 1000)',
    'powmod(3, -1, 7)'
  ],
  seealso: ['pow', 'mod', 'invmod', 'gcd', 'xgcd']
}
