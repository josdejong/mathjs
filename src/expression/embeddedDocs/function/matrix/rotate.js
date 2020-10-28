export const rotateDocs = {
  name: 'rotate',
  category: 'Matrix',
  syntax: [
    'rotate(w, theta)',
    'rotate(w, theta, v)'
  ],
  description: 'Returns a 2-D rotation matrix (2x2) for a given angle (in radians). ' +
    'Returns a 2-D rotation matrix (3x3) of a given angle (in radians) around given axis.',
  examples: [
    'rotate([1, 0], math.pi / 2)',
    'rotate(matrix([1, 0]), unit("35deg"))',
    'rotate([1, 0, 0], unit("90deg"), [0, 0, 1])',
    'rotate(matrix([1, 0, 0]), unit("90deg"), matrix([0, 0, 1]))'
  ],
  seealso: [
    'matrix', 'rotationMatrix'
  ]
}
