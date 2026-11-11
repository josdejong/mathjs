export const multinomialDocs = {
  name: 'multinomial',
  category: 'Probability',
  syntax: [
    'multinomial(A)'
  ],
  description: 'Computes the number of ways of dividing a1 + a2 + ... + am distinct items into m groups of sizes a1, a2, ..., am, where the order within each group does not matter: the multinomial coefficient (a1 + ... + am)! / (a1! ... am!). Takes one array of nonnegative integers.',
  examples: [
    'multinomial([1, 2, 1])',
    'multinomial([2, 0, 1])'
  ],
  seealso: ['combinations', 'factorial']
}
