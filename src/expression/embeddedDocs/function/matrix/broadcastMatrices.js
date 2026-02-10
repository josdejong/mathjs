export const broadcastMatricesDocs = {
  name: 'broadcastMatrices',
  category: 'Matrix',
  syntax: [
    'broadcastMatrices(A, B)'
  ],
  description: 'Broadcast any number of arrays or matrices against each other.',
  examples: [
    'broadcastMatrices([1, 2, 3], [[1], [2], [3]])',
    'broadcastMatrices([1, 2; 3, 4], [5, 6; 7, 8])',
    'broadcastMatrices([1, 2, 3], [5], [[10], [20], [30]])'
  ],
  seealso: [
    'size', 'reshape', 'broadcastSizes', 'broadcastTo'
  ]
}
