import { factory } from '../../../utils/factory.js'

const name = 'broadcast'

const dependancies = ['typed', 'concat']

export const createBroadcast = /* #__PURE__ */ factory(
  name, dependancies,
  ({ typed, concat }) => {
    /**
   * Broadcasts two matrices, and return both in an array
   * It checks if it's possible with broadcasting rules
   *
   * @param {Matrix}   A      First Matrix
   * @param {Matrix}   B      Second Matrix
   *
   * @return {Matrix[]}      [ broadcastedA, broadcastedB ]
   */
    return typed(name, {
      'Matrix, Matrix': (A, B) => {
        let A_size
        let B_size
        const N = Math.max(A._size.length, B._size.length) // max number of dims

        A._size.length < N ?
          A_size = [...Array(N - A._size.length).fill(0), ...A._size] :
          A_size = [...A._size] // clone

        B._size.length < N ?
          B_size = [...Array(N - B._size.length).fill(0), ...B._size] :
          B_size = [...B._size] // clone

        let Max_size = []

        for (let dim = 0; dim < N; dim++) {
          Max_size[dim] = Math.max(A_size[dim], B_size[dim])
        }

        for (let dim = 0; dim < N; dim++) {
          if ((A_size[dim] < Max_size[dim]) & (A_size[dim] > 1))
            throw new Error(`shape missmatch: missmatch is found in arg with shape (${A_size}) not possible to broadcast dimension ${dim} with size ${A_size[dim]} to size ${Max_size[dim]}`)
          if ((B_size[dim] < Max_size[dim]) & (B_size[dim] > 1))
            throw new Error(`shape missmatch: missmatch is found in arg with shape (${B_size}) not possible to broadcast dimension ${dim} with size ${B_size[dim]} to size ${Max_size[dim]}`)
        }

        if (A._size.length < N)
          A.reshape([...Array(N - A._size.length).fill(1), ...A._size])
        else if (B._size.length < N)
          B.reshape([...Array(N - B._size.length).fill(1), ...B._size])

        for (let dim = 0; dim < N; dim++) {
          if (A._size[dim] < Max_size[dim])
            A = concat(...Array(Max_size[dim]).fill(A), dim)
          if (B._size[dim] < Max_size[dim])
            B = concat(...Array(Max_size[dim]).fill(B), dim)
        }
        return [A, B]
      }
    })
  }
)