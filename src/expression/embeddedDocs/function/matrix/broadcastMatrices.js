export const broadcastMatricesDocs = {
  name: 'broadcastMatrices',
  category: 'Matrix',
  syntax: [
    'broadcastMatrices(A, B)'
  ],
  description: 'Broadcast two matrices to compatible sizes',
  examples: [
    'broadcastMatrices([1, 2, 3], [[1], [2], [3]])',
    'broadcastMatrices([1, 2; 3, 4], [5, 6; 7, 8])'
  ],
  seealso: [
    'size', 'reshape', 'broadcastSizes', 'broadcastTo'
  ]
}
