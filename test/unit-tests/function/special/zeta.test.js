/* eslint-disable no-loss-of-precision */

import assert from 'assert'
import approx from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'

const zeta = math.zeta

describe('Riemann Zeta', function () {
  it('should calculate the Riemann Zeta Function of a positive integer', function () {
    assert.ok(isNaN(zeta(1)))
    approx.equal(zeta(2), 1.6449340668482264)
    approx.equal(zeta(3), 1.2020569031595942)
    approx.equal(zeta(4), 1.0823232337111381)
    approx.equal(zeta(5), 1.0369277551433699)
    assert.strictEqual(zeta(Infinity), 1) // shouldn't stall
  })

  it('should calculate the Riemann Zeta Function of a nonpositive integer', function () {
    assert.strictEqual(zeta(0), -0.5)
    approx.equal(zeta(-1), -1 / 12)
    approx.equal(zeta(-2), 0)
    approx.equal(zeta(-3), 1 / 120)
    approx.equal(zeta(-13), -1 / 12)
    assert.ok(isNaN(zeta(-Infinity)))
  })

  it('should calculate the Riemann Zeta Function of a BigNumber', function () {
    approx.equal(zeta(math.bignumber(0)), math.bignumber(-0.5))
    assert.ok(zeta(math.bignumber(1)).isNaN())
    approx.equal(zeta(math.bignumber(2)), math.bignumber(1.6449340668482264))
    approx.equal(zeta(math.bignumber(-2)), math.bignumber(0))
    approx.equal(zeta(math.bignumber(20)), math.bignumber(1.000000953962033872))
    approx.equal(zeta(math.bignumber(-21)), math.bignumber(-281.4601449275362318))
    approx.equal(zeta(math.bignumber(50)), math.bignumber(1.0000000000000008881))
    approx.equal(zeta(math.bignumber(-211)), math.bignumber(2.727488e231))
    approx.equal(zeta(math.bignumber(100)), math.bignumber(1.000000000000000000))
    approx.equal(zeta(math.bignumber(Infinity)), math.bignumber(1)) // shouldn't stall
    approx.equal(zeta(math.bignumber(-Infinity)), math.bignumber(NaN)) // shouldn't stall
  })

  it('should calculate the Riemann Zeta Function of a rational number', function () {
    approx.equal(zeta(0.125), -0.6327756234986952552935)
    approx.equal(zeta(0.25), -0.81327840526189165652144)
    approx.equal(zeta(0.5), -1.460354508809586812889499)
    approx.equal(zeta(1.5), 2.61237534868548834334856756)
    approx.equal(zeta(2.5), 1.34148725725091717975676969)
    approx.equal(zeta(3.5), 1.12673386731705664642781249)
    approx.equal(zeta(30.5), 1.00000000065854731257004465)
    approx.equal(zeta(144.9), 1.0000000000000000000000000)

    approx.equal(zeta(-0.5), -0.2078862249773545660173067)
    approx.equal(zeta(-1.5), -0.0254852018898330359495429)
    approx.equal(zeta(-2.5), 0.00851692877785033054235856)
  })

  it('should calculate the Riemann Zeta Function of an irrational number', function () {
    approx.equal(zeta(Math.SQRT2), 3.0207376794860326682709)
    approx.equal(zeta(Math.PI), 1.17624173838258275887215)
    approx.equal(zeta(Math.E), 1.26900960433571711576556)

    approx.equal(zeta(-Math.SQRT2), -0.0325059805396893552173896)
    approx.equal(zeta(-Math.PI), 0.00744304047846672771406904635)
    approx.equal(zeta(-Math.E), 0.00915987755942023170457566822)
  })

  it('should calculate the Riemann Zeta Function of a Complex number', function () {
    approx.equal(zeta(math.complex(0, 1)), math.complex(0.00330022368532410287421711, -0.418155449141321676689274239))
    approx.equal(zeta(math.complex(3, 2)), math.complex(0.97304196041894244856408189, -0.1476955930004537946298999860))
    approx.equal(zeta(math.complex(-1.5, 3.7)), math.complex(0.244513626137832304395, 0.2077842378226353306923615))
    approx.equal(zeta(math.complex(3.9, -5.2)), math.complex(0.952389583517691366229, -0.03276345793831000384775143962))
    approx.equal(zeta(math.complex(-1.2, -9.3)), math.complex(2.209608454242663005234, -0.67864225792147162441259999407))
    approx.equal(zeta(math.complex(0.5, 14.14)), math.complex(-0.00064921838659084911, 0.004134963322496717323762898714))
  })
})
