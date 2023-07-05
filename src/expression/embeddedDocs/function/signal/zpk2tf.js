export const zpk2tfDocs = {
  name: 'zpk2tf',
  category: 'Signal',
  syntax: [
    'zpk2tf(z, p, k)'
  ],
  description: 'Compute the transfer function of a zero-pole-gain model.',
  examples: [
    'zpk2tf([1, 2], [-1, -2], 1)',
    'zpk2tf([1, 2], [-1, -2])',
    'zpk2tf([1 - 3i, 2 + 2i], [-1, -2])'
  ],
  seealso: []
}
