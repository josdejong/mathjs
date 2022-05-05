// test ifft

import approx from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const ifft = math.ifft

describe('ifft', function () {
  it('should calculate 1-dimensional inverse fourier transformation', function () {
    approx.deepEqual(ifft(math.evaluate('[2, -2-2i, -2i, 4+4i]')), math.evaluate('[1, 2-i, -i, -1+2i]'))
    approx.deepEqual(ifft(math.evaluate('[2, -2-2i, -2i, 4+4i]')), math.evaluate('[1, 2-i, -i, -1+2i]'))
  })

  it('should calculate multidimensional inverse fourier transformation', function () {
    const in1 = math.evaluate(`[
      [1, 0],
      [1, 0]
    ]`)
    approx.deepEqual(math.fft(ifft(in1.valueOf())), in1.valueOf())
    approx.deepEqual(math.fft(ifft(math.matrix(in1))), math.matrix(in1))
  })
})
