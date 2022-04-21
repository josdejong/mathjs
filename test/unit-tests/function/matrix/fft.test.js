// test fft

import approx from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
import { arraySize } from '../../../../src/utils/array.js'
import { isMatrix } from '../../../../src/utils/is.js'
const fft = math.fft

function dft (arr) {
  if (isMatrix(arr)) return math.matrix(dft(arr.valueOf()), arr.storage())
  const size = arraySize(arr)
  return math.matrixFromFunction(size, k => {
    let acc = 0
    math.matrix(arr).forEach((x, n) => {
      acc = math.add(acc,
        math.multiply(
          math.exp(
            math.multiply(
              math.multiply(math.i, math.tau),
              math.multiply(
                -1,
                math.dot(k, math.dotDivide(n, size))
              )
            )
          ),
          x
        )
      )
    })
    return acc
  })
}

describe('inv', function () {
  it('should calculate 1-dimensional fourier transformation', function () {
    approx.deepEqual(fft(math.evaluate('[1, 2-i, -i, -1+2i]')), math.evaluate('[2, -2-2i, -2i, 4+4i]'))
  })

  it('should calculate multidimensional fourier transformation', function () {
    const arr = math.evaluate('[1, 2-i, -i, -1+2i]')
    approx.deepEqual(fft(arr), dft(arr))

    const arr1 = math.evaluate(`[
      [1, 2, 3, 4, 3, 2, 1 ,0],
      [2, 3, 4, 3, 2, 1, 0, 1],
      [3, 4, 3, 2, 1, 0, 1, 2],
      [4, 3, 2, 1, 0, 1, 2, 3]
    ]`)

    approx.deepEqual(fft(arr1), dft(arr1))
  })
})
