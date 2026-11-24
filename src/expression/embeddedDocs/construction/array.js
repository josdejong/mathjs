export const arrayDocs = {
  name: 'array',
  category: 'Construction',
  syntax: [
    'arrary()',
    'array(x)'
  ],
  description:
    'Create an array from a string, Matrix, Complex number, or other number' +
      'specifying its length.',
  examples: [
    'array() # returns []',
    'array("explode")',
    'array([1,2;3,4])',
    'array(5)'
  ],
  seealso: [
    'boolean', 'bignumber', 'number', 'complex', 'fraction', 'index', 'matrix', 'string', 'unit'
  ]
}
