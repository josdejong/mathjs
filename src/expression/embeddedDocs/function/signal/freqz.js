export const freqzDocs = {
  name: 'freqz',
  category: 'Signal',
  syntax: [
    'freqz(b, a)',
    'freqz(b, a, w)'
  ],
  description: 'Calculates the frequency response of a filter given its numerator and denominator coefficients.',
  examples: [
    'freqz([1, 2], [1, 2, 3])',
    'freqz([1, 2], [1, 2, 3], [0, 1])',
    'freqz([1, 2], [1, 2, 3], 512)'
  ],
  seealso: []
}
