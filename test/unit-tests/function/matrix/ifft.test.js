// test ifft

import { approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const ifft = math.ifft

describe('ifft', function () {
  it('should calculate 1-dimensional inverse Fourier transformation', function () {
    approxDeepEqual(ifft([2, math.complex(-2, -2), math.complex(0, -2), math.complex(4, 4)]), [1, math.complex(2, -1), math.complex(0, -1), math.complex(-1, 2)])
  })

  it('should calculate multidimensional inverse Fourier transformation', function () {
    const in1 = [
      [1, 0],
      [1, 0]
    ]
    approxDeepEqual(math.fft(ifft(in1.valueOf())), in1.valueOf())
    approxDeepEqual(math.fft(ifft(math.matrix(in1))), math.matrix(in1))
  })
})
