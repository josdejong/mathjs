export const floorDocs = {
  name: 'floor',
  category: 'Arithmetic',
  syntax: [
    'floor(x)',
    'floor(x, n)',
    'floor(unit, valuelessUnit)',
    'floor(unit, n, valuelessUnit)'
  ],
  description:
      'Round a value towards minus infinity.If x is complex, both real and imaginary part are rounded towards minus infinity.',
  examples: [
    'floor(3.2)',
    'floor(3.8)',
    'floor(-4.2)',
    'floor(3.241cm, cm)',
    'floor(3.241cm, 2, cm)'
  ],
  seealso: ['ceil', 'fix', 'round']
}
