/* eslint-disable no-loss-of-precision */

import assert from 'assert'
import { approxEqual as _approxEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'

const zeta = math.zeta
const epsilon = 1e-6 // FIXME: make zeta work with an epsilon of 1e-12

function approxEqual (a, b) {
  _approxEqual(a, b, epsilon)
}

describe('Riemann Zeta', function () {
  it('should calculate the Riemann Zeta Function of a positive integer', function () {
    assert.ok(isNaN(zeta(1)))
    approxEqual(zeta(2), 1.6449340668482264)
    approxEqual(zeta(3), 1.2020569031595942)
    approxEqual(zeta(4), 1.0823232337111381)
    approxEqual(zeta(5), 1.0369277551433699)
    assert.strictEqual(zeta(Infinity), 1) // shouldn't stall
  })

  it('should calculate the Riemann Zeta Function of a non-positive integer', function () {
    assert.strictEqual(zeta(0), -0.5)
    approxEqual(zeta(-1), -1 / 12)
    approxEqual(zeta(-2), 0)
    approxEqual(zeta(-3), 1 / 120)
    approxEqual(zeta(-13), -1 / 12)
    assert.ok(isNaN(zeta(-Infinity)))
  })

  it('should calculate the Riemann Zeta Function of a BigNumber', function () {
    const bigEpsilon = 1e-5 // FIXME: should work with for example an epsilon of 1e-64
    const digits = Math.abs(Math.log10(bigEpsilon))

    const math2 = math.create()
    math2.config({ relTol: bigEpsilon, absTol: bigEpsilon * 1e-3 })

    function bigApproxEqual (a, b) {
      assert.strictEqual(
        a.toSignificantDigits(digits).valueOf(),
        b.toSignificantDigits(digits).valueOf(),
        (a + ' ~= ' + b + ' (epsilon: ' + epsilon + ')')
      )
    }

    bigApproxEqual(zeta(math2.bignumber(0)), math2.bignumber('-0.5'))
    assert.ok(zeta(math2.bignumber(1)).isNaN())
    bigApproxEqual(zeta(math2.bignumber(2)), math2.bignumber('1.6449340668482264364724151666460251892189499012067984377355582293'))
    bigApproxEqual(zeta(math2.bignumber(-2)).add(1), math2.bignumber('1')) // we add 1 on both sides since we cannot easily compare zero
    bigApproxEqual(zeta(math2.bignumber(20)), math2.bignumber('1.0000009539620338727961131520386834493459437941874105957500564898'))
    bigApproxEqual(zeta(math2.bignumber(-21)), math2.bignumber('-281.4601449275362318840579710144927536231884057971014492753623188'))
    bigApproxEqual(zeta(math2.bignumber(50)), math2.bignumber('1.0000000000000008881784210930815903096091386391386325608871464644'))
    bigApproxEqual(zeta(math2.bignumber(-211)), math2.bignumber('2.7274887879083469529027229775609299175103750961568681644229e231'))
    bigApproxEqual(zeta(math2.bignumber(100)), math2.bignumber('1.0000000000000000000000000000007888609052210118073520537827660414'))
    bigApproxEqual(zeta(math2.bignumber(Infinity)), math2.bignumber('1')) // shouldn't stall
    bigApproxEqual(zeta(math2.bignumber(-Infinity)), math2.bignumber(NaN)) // shouldn't stall
  })

  it('should calculate the Riemann Zeta Function of a rational number', function () {
    approxEqual(zeta(0.125), -0.6327756234986952552935)
    approxEqual(zeta(0.25), -0.81327840526189165652144)
    approxEqual(zeta(0.5), -1.460354508809586812889499)
    approxEqual(zeta(1.5), 2.61237534868548834334856756)
    approxEqual(zeta(2.5), 1.34148725725091717975676969)
    approxEqual(zeta(3.5), 1.12673386731705664642781249)
    approxEqual(zeta(30.5), 1.00000000065854731257004465)
    approxEqual(zeta(144.9), 1.0000000000000000000000000)

    approxEqual(zeta(-0.5), -0.2078862249773545660173067)
    approxEqual(zeta(-1.5), -0.0254852018898330359495429)
    approxEqual(zeta(-2.5), 0.00851692877785033054235856)
  })

  it('should calculate the Riemann Zeta Function of an irrational number', function () {
    approxEqual(zeta(Math.SQRT2), 3.0207376794860326682709)
    approxEqual(zeta(Math.PI), 1.17624173838258275887215)
    approxEqual(zeta(Math.E), 1.26900960433571711576556)

    approxEqual(zeta(-Math.SQRT2), -0.0325059805396893552173896)
    approxEqual(zeta(-Math.PI), 0.00744304047846672771406904635)
    approxEqual(zeta(-Math.E), 0.00915987755942023170457566822)
  })

  it('should calculate the Riemann Zeta Function of a Complex number', function () {
    approxEqual(zeta(math.complex(0, 1)), math.complex(0.00330022368532410287421711, -0.418155449141321676689274239))
    approxEqual(zeta(math.complex(3, 2)), math.complex(0.97304196041894244856408189, -0.1476955930004537946298999860))
    approxEqual(zeta(math.complex(-1.5, 3.7)), math.complex(0.244513626137832304395, 0.2077842378226353306923615))
    approxEqual(zeta(math.complex(3.9, -5.2)), math.complex(0.952389583517691366229, -0.03276345793831000384775143962))
    approxEqual(zeta(math.complex(-1.2, -9.3)), math.complex(2.209608454242663005234, -0.67864225792147162441259999407))
    approxEqual(zeta(math.complex(0.5, 14.14)), math.complex(-0.00064921838659084911, 0.004134963322496717323762898714))
  })
})
