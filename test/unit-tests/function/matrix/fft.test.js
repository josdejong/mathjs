// test fft

import { approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const fft = math.fft

describe('fft', function () {
  it('should calculate 1-dimensional Fourier transformation', function () {
    const in1 = [1, math.complex(2, -1), math.complex(0, -1), math.complex(-1, 2)]
    const out1 = [2, math.complex(-2, -2), math.complex(0, -2), math.complex(4, 4)]
    approxDeepEqual(fft(in1.valueOf()), out1.valueOf())
    approxDeepEqual(fft(math.matrix(in1)), math.matrix(out1))
  })

  it('should calculate multidimensional Fourier transformation', function () {
    const in1 = [
      [1, 0],
      [1, 0]
    ]
    const out1 = [
      [2, 2],
      [0, 0]
    ]
    approxDeepEqual(fft(in1.valueOf()), out1.valueOf())
    approxDeepEqual(fft(math.matrix(in1)), math.matrix(out1))
    const in2 = [
      [0, 0, 1, 1],
      [0, 0, 1, 1],
      [1, 1, 0, 0],
      [1, 1, 0, 0]
    ]
    const out2 = [
      [8, 0, 0, 0],
      [0, math.complex(0, 4), 0, -4],
      [0, 0, 0, 0],
      [0, -4, 0, math.complex(0, -4)]
    ]
    approxDeepEqual(fft(in2.valueOf()), out2.valueOf())
    approxDeepEqual(fft(math.matrix(in2)), math.matrix(out2))
  })

  it('should calculate 1-dimensional non-power-of-2 Fourier transformation', function () {
    const in1 = [1, 2, 3]
    const out1 = [math.complex(6, -0), math.complex(-1.5, 0.8660254), math.complex(-1.5, -0.8660254)]
    approxDeepEqual(fft(in1.valueOf()), out1.valueOf())
    approxDeepEqual(fft(math.matrix(in1)), math.matrix(out1))
    const in2 = [math.complex(1, 2), math.complex(-3, 4), math.complex(1, 0), math.complex(-1, 0), math.complex(0, 5)]
    const out2 = [
      math.complex(-2, 11), math.complex(-0.8781075, 6.45875199), math.complex(2.83926573, -1.61568416),
      math.complex(4.01483624, -8.94662174), math.complex(1.02400553, 3.10355391)
    ]
    approxDeepEqual(fft(in2.valueOf()), out2.valueOf())
    approxDeepEqual(fft(math.matrix(in2)), math.matrix(out2))
  })

  it('should calculate multidimensional non-power-of-2 Fourier transformation', function () {
    const in1 = [
      [1, 2, 3],
      [4, 5, 6],
      [-7, -8, -1]
    ]
    const out1 = [
      [math.complex(5, 0), math.complex(-5.5, 7.79422863), math.complex(-5.5, -7.79422863)],
      [math.complex(6.5, -26.84678752), math.complex(-4, -3.46410162), math.complex(5, 1.73205081)],
      [math.complex(6.5, 26.84678752), math.complex(5, -1.73205081), math.complex(-4, 3.46410162)]
    ]
    approxDeepEqual(fft(in1.valueOf()), out1.valueOf())
    approxDeepEqual(fft(math.matrix(in1)), math.matrix(out1))
    const in2 = [
      [0, 0, math.complex(-5, 1), 1, 1],
      [0, math.complex(0, -6), 3, 1, 1],
      [1, 1, 0, 0, math.complex(0, 1)],
      [1, math.complex(9, 4), 0, 2, 0],
      [math.complex(0, -5), math.complex(9, 4), math.complex(3, -2), 2, -1]
    ]
    const out2 = [
      [math.complex(29, -3), math.complex(2.88049219, -17.44402305), math.complex(-10.47837916, -23.0714851),
        math.complex(-13.5560627, 7.59934915), math.complex(2.15394966, 10.91615901)],
      [math.complex(-13.38045733, 7.66006673), math.complex(9.57829467, 17.24788685), math.complex(24.23778513, 3.36165528),
        math.complex(6.67271684, -15.73668901), math.complex(-11.42209635, -20.25834471)],
      [math.complex(-12.14625419, 5.01795478), math.complex(12.95682463, 13.51826064), math.complex(2.73806165, 0.94226492),
        math.complex(8.56939025, 8.48894432), math.complex(5.6667789, -7.7419998)],
      [math.complex(-14.32588177, 14.63452107), math.complex(11.47911913, 12.79772789), math.complex(-4.91691441, -7.45450247),
        math.complex(-6.77250351, 7.20363312), math.complex(2.93171919, -6.95595474)],
      [math.complex(-4.14740672, -19.31254257), math.complex(-16.23037949, -7.77609714), math.complex(-26.56126066, 2.17438311),
        math.complex(-0.38368317, 19.58261663), math.complex(15.45614719, -2.39378488)]
    ]
    approxDeepEqual(fft(in2.valueOf()), out2.valueOf())
    approxDeepEqual(fft(math.matrix(in2)), math.matrix(out2))
  })
})
