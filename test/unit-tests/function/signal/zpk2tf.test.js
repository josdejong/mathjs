import { approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'

const zpk2tf = math.zpk2tf

describe('zpk2tf', function () {
  it('should return the transfer function of a zero-pole-gain model', function () {
    approxDeepEqual(zpk2tf([math.complex(1, 5)], [math.complex(-2, 0), math.complex(-3, 0)], 1),
      [[math.complex(1, 0), math.complex(-1, -5)], [math.complex(1, 0), math.complex(5, 0), math.complex(6, 0)]])
    approxDeepEqual(zpk2tf([math.complex(1, 5)], [math.complex(-2, 0), math.complex(-3, 0)], 2),
      [[math.complex(2, 0), math.complex(-2, -10)], [math.complex(1, 0), math.complex(5, 0), math.complex(6, 0)]])
  })

  it('should return the transfer function of a zero-pole model', function () {
    approxDeepEqual(zpk2tf([math.complex(1, 5)], [math.complex(-2, 0), math.complex(-3, 0)]),
      [[math.complex(1, 0), math.complex(-1, -5)], [math.complex(1, 0), math.complex(5, 0), math.complex(6, 0)]])
  })

  it('should return the transfer function of a zero-pole-gain model with number parameters', function () {
    approxDeepEqual(zpk2tf([1, 2], [-1, -2], 1),
      [[math.complex(1, 0), math.complex(-3, 0), math.complex(2, 0)], [math.complex(1, 0), math.complex(3, 0), math.complex(2, 0)]])
    approxDeepEqual(zpk2tf([1, 5], [-2, -3], 1),
      [[math.complex(1, 0), math.complex(-6, 0), math.complex(5, 0)], [math.complex(1, 0), math.complex(5, 0), math.complex(6, 0)]])
    approxDeepEqual(zpk2tf([1, 8, 5, 7, 2], [-2, -3, 2, 5, 6], 1),
      [[math.complex(1, 0), math.complex(-23, 0), math.complex(193, 0), math.complex(-713, 0), math.complex(1102, 0),
        math.complex(-560, 0)], [math.complex(1, 0), math.complex(-8, 0), math.complex(-7, 0),
        math.complex(122, 0), math.complex(12, 0), math.complex(-360, 0)]])
  })

  it('should return the transfer function of a zero-pole model with Bignumber parameters', function () {
    approxDeepEqual(zpk2tf(math.bignumber([1, 2]), math.bignumber([-1, -2])),
      [[math.complex(1, 0), math.complex(-3, 0), math.complex(2, 0)], [math.complex(1, 0), math.complex(3, 0), math.complex(2, 0)]])
    approxDeepEqual(zpk2tf(math.bignumber([1, 5]), math.bignumber([-2, -3])),
      [[math.complex(1, 0), math.complex(-6, 0), math.complex(5, 0)], [math.complex(1, 0), math.complex(5, 0), math.complex(6, 0)]])
  })

  it('should return the transfer function of a zero-pole-gain model with matrix parameters', function () {
    approxDeepEqual(zpk2tf(math.matrix([math.complex(1, 5)]), math.matrix([math.complex(-2, 0), math.complex(-3, 0)]), 1),
      [[math.complex(1, 0), math.complex(-1, -5)], [math.complex(1, 0), math.complex(5, 0), math.complex(6, 0)]])
    approxDeepEqual(zpk2tf(math.matrix([math.complex(1, 5)]), math.matrix([math.complex(-2, 0), math.complex(-3, 0)]), 2),
      [[math.complex(2, 0), math.complex(-2, -10)], [math.complex(1, 0), math.complex(5, 0), math.complex(6, 0)]])
  })

  it('should return the transfer function of a zero-pole model with matrix parameters', function () {
    approxDeepEqual(zpk2tf(math.matrix([math.complex(1, 5)]), math.matrix([math.complex(-2, 0), math.complex(-3, 0)])),
      [[math.complex(1, 0), math.complex(-1, -5)], [math.complex(1, 0), math.complex(5, 0), math.complex(6, 0)]])
  })
})
