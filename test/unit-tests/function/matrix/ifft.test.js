// test ifft

import approx from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
import { arraySize } from '../../../../src/utils/array.js'
import { isMatrix } from '../../../../src/utils/is.js'
const ifft = math.ifft

function idft (arr) {
  if (isMatrix(arr)) return math.matrix(idft(arr.valueOf()), arr.storage())
  const size = arraySize(arr)
  return math.dotDivide(
    math.matrixFromFunction(size, n => {
      let acc = 0
      math.matrix(arr).forEach((x, k) => {
        acc = math.add(acc,
          math.multiply(
            math.exp(
              math.multiply(
                math.multiply(math.i, math.tau),
                math.dot(n, math.dotDivide(k, size))
              )
            ),
            x
          )
        )
      })
      return acc
    }),
    size.reduce((acc, n) => acc * n, 1)
  )
}

describe('inv', function () {
  it('should calculate 1-dimensional inverse fourier transformation', function () {
    approx.deepEqual(ifft(math.evaluate('[2, -2-2i, -2i, 4+4i]')), math.evaluate('[1, 2-i, -i, -1+2i]'))
  })

  it('should calculate multidimensional inverse fourier transformation', function () {
    const arr = math.evaluate('[2, -2-2i, -2i, 4+4i]')
    approx.deepEqual(ifft(arr), idft(arr))

    const arr1 = math.evaluate(`[
      [1, 2, 3, 4, 3, 2, 1 ,0],
      [2, 3, 4, 3, 2, 1, 0, 1],
      [3, 4, 3, 2, 1, 0, 1, 2],
      [4, 3, 2, 1, 0, 1, 2, 3]
    ]`)

    approx.deepEqual(ifft(arr1), idft(arr1))
  })
})
