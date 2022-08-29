// test ifft

import approx from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const ifft = math.ifft

describe('ifft', function () {
  it('should calculate 1-dimensional inverse fourier transformation', function () {
    approx.deepEqual(ifft([2, math.complex(-2, -2), math.complex(0, -2), math.complex(4, 4)]), [1, math.complex(2, -1), math.complex(0, -1), math.complex(-1, 2)])
  })

  it('should calculate multidimensional inverse fourier transformation', function () {
    const in1 = [
      [1, 0],
      [1, 0]
    ]
    approx.deepEqual(math.fft(ifft(in1.valueOf())), in1.valueOf())
    approx.deepEqual(math.fft(ifft(math.matrix(in1))), math.matrix(in1))
  })
})
