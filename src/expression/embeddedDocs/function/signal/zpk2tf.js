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
    'zpk2tf([math.complex(1,-3), math.complex(2,2)], [math.complex(-1,0), math.complex(-2,0)])'
  ],
  seealso: []
}
