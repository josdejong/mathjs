export const multinomialDocs = {
  name: 'multinomial',
  category: 'Probability',
  syntax: [
    'multinomial(A)'
  ],
  description: 'Computes the number of ways of dividing a1 + a2 + ... + an distinct items into n unordered groups of sizes a1, a2, ..., an: the multinomial coefficient (a1 + ... + an)! / (a1! ... an!). Takes one one-dimensional array of nonnegative integers.',
  examples: [
    'multinomial([1, 2, 1])',
    'multinomial([2, 0, 1])'
  ],
  seealso: ['combinations', 'factorial']
}
