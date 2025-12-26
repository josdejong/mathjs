export const broadcastSizesDocs = {
  name: 'broadcastSizes',
  category: 'Matrix',
  syntax: [
    'broadcastSizes(sizeA, sizeB)'
  ],
  description: 'Broadcast the sizes of matrices to a compatible size',
  examples: [
    'broadcastSizes([3, 1, 3], [3, 3])',
    'broadcastSizes([2, 1], [2, 2])'
  ],
  seealso: [
    'size', 'reshape', 'broadcastTo', 'broadcastMatrices'
  ]
}
