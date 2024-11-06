export const fixDocs = {
  name: 'fix',
  category: 'Arithmetic',
  syntax: [
    'fix(x)',
    'fix(x, n)',
    'fix(unit, valuelessUnit)',
    'fix(unit, n, valuelessUnit)'
  ],
  description:
      'Round a value towards zero. If x is complex, both real and imaginary part are rounded towards zero.',
  examples: [
    'fix(3.2)',
    'fix(3.8)',
    'fix(-4.2)',
    'fix(-4.8)',
    'fix(3.241cm, cm)',
    'fix(3.241cm, 2, cm)'
  ],
  seealso: ['ceil', 'floor', 'round']
}
