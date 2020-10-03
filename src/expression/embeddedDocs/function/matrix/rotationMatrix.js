export const rotationMatrixDocs = {
  name: 'rotationMatrix',
  category: 'Matrix',
  syntax: [
    'rotationMatrix(theta)',
    'rotationMatrix(theta, v)',
    'rotationMatrix(theta, v, format)'
  ],
  description: 'Returns a 2-D rotation matrix of a given angle (in radians). ' +
    'Returns a 3-D rotation of a given angle (in radians) around given axis.',
  examples: [
    'rotationMatrix(pi / 2)',
    'rotationMatrix(unit("45deg"), [0, 0, 1])',
    'rotationMatrix(1, matrix([0, 0, 1]), "sparse")'
  ],
  seealso: [
    'cos', 'sin'
  ]
}
