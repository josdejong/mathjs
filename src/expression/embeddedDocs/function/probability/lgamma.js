export const lgammaDocs = {
  name: 'lgamma',
  category: 'Probability',
  syntax: [
    'lgamma(n)'
  ],
  description: 'Compute the log gamma function of a value, using Lanczos approximation for numbers and Stirling series for complex numbers.',
  examples: [
    'lgamma(4)',
    'lgamma(1/2)',
    'lgamma(math.i)',
    'lgamma(complex(1.1, 2))'
  ],
  seealso: ['gamma']
}
