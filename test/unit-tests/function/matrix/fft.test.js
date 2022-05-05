// test fft

import approx from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const fft = math.fft

describe('fft', function () {
  it('should calculate 1-dimensional fourier transformation', function () {
    const in1 = math.evaluate('[1, 2-i, -i, -1+2i]')
    const out1 = math.evaluate('[2, -2-2i, -2i, 4+4i]')
    approx.deepEqual(fft(in1.valueOf()), out1.valueOf())
    approx.deepEqual(fft(math.matrix(in1)), math.matrix(out1))
  })

  it('should calculate multidimensional fourier transformation', function () {
    const in1 = math.evaluate(`[
      [1, 0],
      [1, 0]
    ]`)
    const out1 = math.evaluate(`[
      [2, 2],
      [0, 0]
    ]`)
    approx.deepEqual(fft(in1.valueOf()), out1.valueOf())
    approx.deepEqual(fft(math.matrix(in1)), math.matrix(out1))
    const in2 = math.evaluate(`[
      [0, 0, 1, 1],
      [0, 0, 1, 1],
      [1, 1, 0, 0],
      [1, 1, 0, 0]
    ]`)
    const out2 = math.evaluate(`[
      [8, 0, 0, 0],
      [0, 4i, 0, -4],
      [0, 0, 0, 0],
      [0, -4, 0, -4i]
    ]`)
    approx.deepEqual(fft(in2.valueOf()), out2.valueOf())
    approx.deepEqual(fft(math.matrix(in2)), math.matrix(out2))
  })
})
