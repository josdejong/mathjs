export const roundDocs = {
  name: 'round',
  category: 'Arithmetic',
  syntax: [
    'round(x)',
    'round(x, n)',
    'round(unit, valuelessUnit)',
    'round(unit, n, valuelessUnit)'
  ],
  description:
      'round a value towards the nearest integer.If x is complex, both real and imaginary part are rounded towards the nearest integer. When n is specified, the value is rounded to n decimals.',
  examples: [
    'round(3.2)',
    'round(3.8)',
    'round(-4.2)',
    'round(-4.8)',
    'round(pi, 3)',
    'round(123.45678, 2)',
    'round(3.241cm, 2, cm)',
    'round([3.2, 3.8, -4.7])'
  ],
  seealso: ['ceil', 'floor', 'fix']
}
