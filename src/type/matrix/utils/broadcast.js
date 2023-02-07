import { factory } from '../../../utils/factory.js'

const name = 'broadcast'

const dependancies = ['typed', 'max', 'size', 'resize', 'reshape', 'concat']

export const createBroadcast = /* #__PURE__ */ factory(
  name, dependancies,
  ({ typed, max, size, resize, reshape, concat }) => {
    return function broadcast(...matrices) {

      // consistently gets the size of an array, matrix or scalar as an array
      sizeAsArray = typed(
        'sizeAsArray',
        {
          'Array': (x) => size(x),
          'any': (x) => size(x).toArray()
        })

      // aligns a shapte to a size in N dimensions
      alignShape = (shape, nDims, pad) => shape.length < nDims ? resize(shape.reverse(), [nDims], pad).reverse() : shape

      // calculates the shape needed to concat an array in a dimension
      shapeToConcat = (Mat, dim) => alignShape(sizeAsArray(Mat), dim, 1)

      // stretches a matrix up to a certain size on a dimensions
      // TODO: use function repeat when it's available
      stretch = (matrix, size, dim) => concat(...Array(size).fill(matrix), dim)

      broadcast_shapes = typed(
        // Calculates the final broadcastable shape from different shape inputs
        // Throws an error if it brakes the broadcasting rules
        'broadcast_shapes',
        {
          '...Array': (shapes) => {
            const dims = shapes.map(shape => shape.length)
            const N = max(dims)
            const shapes_array = shapes.map((shape, i) => alignShape(shape, N, 0))
            const max_shapes = max(shapes_array, 0)

            shapes_array.forEach(
              (shape, shapeID) => {
                shape.forEach(
                  (dim, dimID) => {
                    if ((dim < max_shapes[dimID]) & (dim > 1))
                      throw new Error(`shape missmatch: missmatch is found in arg ${shapeID} with shape (${shape}) not possible to broadcast dimension ${dimID} with size ${dim} to size ${max_shapes[dimID]}`)
                  }
                )
              }
            )
            return max_shapes
          }
        }
      )

      const broadcastedMatrixSize = broadcast_shapes(...matrices.map(matrix => sizeAsArray(matrix)))
      const N = broadcastedMatrixSize.length
      const broadcasted_matrices =
        matrices.map(matrix => {
          let matrixSize

          if (isScalar(matrix)) {
            matrix = [matrix]
          }

          matrixSize = sizeAsArray(matrix)

          if (matrixSize.length < N) {
            matrix = reshape(
              matrix,
              shapeToConcat(matrix, N))

            matrixSize = sizeAsArray(matrix)
          }

          broadcastedMatrixSize.forEach(
            (size, dim) => {
              if (matrixSize[dim] < size) {
                matrix = stretch(matrix, size, dim)
              }
            }
          )
          return matrix
        })
      console.log(broadcasted_matrices)
      return broadcasted_matrices
    }
  })