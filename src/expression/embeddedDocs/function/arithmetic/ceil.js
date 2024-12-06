export const ceilDocs = {
  name: 'ceil',
  category: 'Arithmetic',
  syntax: [
    'ceil(x)',
    'ceil(x, n)',
    'ceil(unit, valuelessUnit)',
    'ceil(unit, n, valuelessUnit)'
  ],
  description:
      'Round a value towards plus infinity. If x is complex, both real and imaginary part are rounded towards plus infinity.',
  examples: [
    'ceil(3.2)',
    'ceil(3.8)',
    'ceil(-4.2)',
    'ceil(3.241cm, cm)',
    'ceil(3.241cm, 2, cm)'
  ],
  seealso: ['floor', 'fix', 'round']
}
