export const broadcastToDocs = {
  name: 'broadcastTo',
  category: 'Matrix',
  syntax: [
    'broadcastTo(A, size)'
  ],
  description: 'Broadcast a matrix to a compatible size',
  examples: [
    'broadcastTo([1, 2, 3], [3, 3])',
    'broadcastTo([1, 2; 3, 4], [2, 2])'
  ],
  seealso: [
    'size', 'reshape', 'broadcastSizes', 'broadcastMatrices'
  ]
}
