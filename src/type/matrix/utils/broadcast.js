import { factory } from '../../../utils/factory.js'

const name = 'broadcast'

const dependancies = ['concat']

export const createBroadcast = /* #__PURE__ */ factory(
  name, dependancies,
  ({ concat }) => {
    /**
   * Broadcasts two matrices, and return both in an array
   * It checks if it's possible with broadcasting rules
   *
   * @param {Matrix}   A      First Matrix
   * @param {Matrix}   B      Second Matrix
   *
   * @return {Matrix[]}      [ broadcastedA, broadcastedB ]
   */
    return (A, B) => {
      let sizeA
      let sizeB
      const N = Math.max(A._size.length, B._size.length) // max number of dims
      if (A._size.length === B._size.length) {
        if (A._size.every((dim, i) => dim === B._size[i])) {
          // If matrices have the same size return them
          return [A, B]
        }
        sizeA = [...A._size] // clone
        sizeB = [...B._size] // clone
      } else {
        sizeA = A._size.length < N
          ? _padLeft(A._size, N, 0) // pad to the left to align dimensions to the right
          : [...A._size] // clone

        sizeB = B._size.length < N
          ? _padLeft(B._size, N, 0) // pad to the left to align dimensions to the right
          : [...B._size] // clone
      }

      // calculate the max dimensions
      const sizeMax = []

      for (let dim = 0; dim < N; dim++) {
        sizeMax[dim] = Math.max(sizeA[dim], sizeB[dim])
      }

      // check if the broadcasting rules applyes for both matrices
      for (let dim = 0; dim < N; dim++) {
        _checkRules(sizeA, sizeMax, dim)
        _checkRules(sizeB, sizeMax, dim)
      }

      // reshape A or B if needed to make them ready for concat
      if (A._size.length < N) {
        A.reshape(_padLeft(A._size, N, 1))
      } else if (B._size.length < N) {
        B.reshape(_padLeft(B._size, N, 1))
      }

      // stretches the matrices on each dimension to make them the same size
      for (let dim = 0; dim < N; dim++) {
        if (A._size[dim] < sizeMax[dim]) { A = _stretch(A, sizeMax[dim], dim) }
        if (B._size[dim] < sizeMax[dim]) { B = _stretch(B, sizeMax[dim], dim) }
      }

      // return the array with the two broadcasted matrices
      return [A, B]
    }

    function _padLeft (shape, N, filler) {
      // pads an array of dimensions with numbers to the left, unitl the number of dimensions is N
      return [...Array(N - shape.length).fill(filler), ...shape]
    }

    function _stretch (arrayToStretch, sizeToStretch, dimToStretch) {
      // stretches a matrix up to a certain size in a certain dimension
      return concat(...Array(sizeToStretch).fill(arrayToStretch), dimToStretch)
    }

    function _checkRules (shape, sizeMax, dim) {
      if ((shape[dim] < sizeMax[dim]) & (shape[dim] > 1)) { throw new Error(`shape missmatch: missmatch is found in arg with shape (${shape}) not possible to broadcast dimension ${dim} with size ${shape[dim]} to size ${sizeMax[dim]}`) }
    }
  }
)
