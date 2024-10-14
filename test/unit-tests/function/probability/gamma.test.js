/* eslint-disable no-loss-of-precision */

import assert from 'assert'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const gamma = math.gamma

describe('gamma', function () {
  it('should calculate the gamma of an integer number', function () {
    assert.strictEqual(gamma(1), 1)
    assert.strictEqual(gamma(2), 1)
    assert.strictEqual(gamma(3), 2)
    assert.strictEqual(gamma(4), 6)
    assert.strictEqual(gamma(5), 24)
    assert.strictEqual(gamma(6), 120)
    assert.strictEqual(gamma(Infinity), Infinity) // shouldn't stall
  })

  it('should calculate the gamma of a nonpositive integer', function () {
    assert.strictEqual(gamma(0), Infinity)
    assert.strictEqual(gamma(-1), Infinity)
    assert.strictEqual(gamma(-2), Infinity)
    assert.strictEqual(gamma(-100000), Infinity)
    assert.ok(isNaN(gamma(-Infinity)))
  })

  it('should calculate the gamma of a rational number', function () {
    approxEqual(gamma(0.125), 7.5339415987976119046992)
    approxEqual(gamma(0.25), 3.625609908221908311930685)
    approxEqual(gamma(0.5), 1.77245385090551602729816748)
    approxEqual(gamma(1.5), 0.88622692545275801364908374)
    approxEqual(gamma(2.5), 1.32934038817913702047362561)
    approxEqual(gamma(3.5), 3.32335097044784255118406403)
    approxEqual(gamma(30.5), 4.8226969334909086010917483e+31)
    approxEqual(gamma(144.9), 3.37554680943478639050191e+249)

    approxEqual(gamma(-0.5), -3.54490770181103205459633)
    approxEqual(gamma(-1.5), 2.3632718012073547030642233)
    approxEqual(gamma(-2.5), -0.945308720482941881225689)
    approxEqual(gamma(-144.9), -2.078523735791760166777e-251)
  })

  it('should calculate the gamma of an irrational number', function () {
    approxEqual(gamma(Math.SQRT2), 0.8865814287192591250809176)
    approxEqual(gamma(Math.PI), 2.2880377953400324179595889)
    approxEqual(gamma(Math.E), 1.56746825577405307486334)

    approxEqual(gamma(-Math.SQRT2), 2.599459907524570073533756846)
    approxEqual(gamma(-Math.PI), 1.01569714446021834110892259347)
    approxEqual(gamma(-Math.E), -0.952681729748073099220537210195)
  })

  it('should calculate the gamma of an integer bignumber', function () {
    assert.deepStrictEqual(gamma(bignumber(1)), bignumber(1))
    assert.deepStrictEqual(gamma(bignumber(2)), bignumber(1))
    assert.deepStrictEqual(gamma(bignumber(3)), bignumber(2))
    assert.deepStrictEqual(gamma(bignumber(4)), bignumber(6))
    assert.deepStrictEqual(gamma(bignumber(5)), bignumber(24))
    assert.deepStrictEqual(gamma(bignumber(6)), bignumber(120))
    assert.deepStrictEqual(gamma(bignumber(31)), bignumber('265252859812191058636308480000000'))
    assert.deepStrictEqual(gamma(bignumber(Infinity)).toString(), 'Infinity')
  })

  it('should calculate the gamma of a nonpositive integer bignumber', function () {
    assert.deepStrictEqual(gamma(bignumber(0)).toString(), 'Infinity')
    assert.deepStrictEqual(gamma(bignumber(-1)).toString(), 'Infinity')
    assert.deepStrictEqual(gamma(bignumber(-2)).toString(), 'Infinity')
    assert.ok(gamma(bignumber(-Infinity)).isNaN())
  })
  /*
  it('should calculate the gamma of a rational bignumber', function () {
    assert.deepStrictEqual(gamma(bignumber(0.125)), bignumber('7.5339415987976'))
    assert.deepStrictEqual(gamma(bignumber(0.25)), bignumber('3.62560990822191'))
    assert.deepStrictEqual(gamma(bignumber(0.5)), bignumber('1.77245385090552'))
    assert.deepStrictEqual(gamma(bignumber(1.5)), bignumber('0.886226925452758'))
    assert.deepStrictEqual(gamma(bignumber(2.5)), bignumber('1.32934038817914'))

    const bigmath = math.create({ precision: 15 })
    assert.deepStrictEqual(bigmath.gamma(bignumber(30.5)), '4.82269693349091e+31')

    bigmath.config({ precision: 13 })
    assert.deepStrictEqual(bigmath.gamma(bignumber(-1.5)), bigmath.bignumber('2.363271801207'))
    assert.deepStrictEqual(gamma(bignumber(-2.5)), bignumber('-0.9453087205'))
  })

  it('should calculate the gamma of an irrational bignumber', function () {
    assert.deepStrictEqual(gamma(bigUtil.phi(math.precision).neg()), bignumber('2.3258497469'))
    assert.deepStrictEqual(gamma(bigUtil.phi(math.precision)), bignumber('0.895673151705288'))

    assert.deepStrictEqual(gamma(bigUtil.pi(20)), bignumber('2.28803779534003'))
    assert.deepStrictEqual(gamma(bigUtil.e(math.precision)), bignumber('1.56746825577405'))

    const bigmath = math.create({ number: 'BigNumber' })
    assert.deepStrictEqual(gamma(bigmath.SQRT2), bignumber('0.886581428719259'))
    assert.deepStrictEqual(gamma(bigmath.SQRT2.neg()), bignumber('2.59945990753'))
  })
*/
  it('should calculate the gamma of an imaginary unit', function () {
    approxDeepEqual(gamma(math.i), math.complex(-0.154949828301810685124955130,
      -0.498015668118356042713691117))
  })

  it('should calculate the gamma of a complex number', function () {
    approxDeepEqual(gamma(math.complex(0, 0)), math.complex(Infinity))
    approxDeepEqual(gamma(math.complex(0.0001, 0.0001)), math.complex(4999.422883240696,
      -4999.9999011125))
    approxDeepEqual(gamma(math.complex(1, 1)), math.complex(0.498015668118356,
      -0.154949828301810))
    approxDeepEqual(gamma(math.complex(1, -1)), math.complex(0.498015668118356,
      0.154949828301810))
    approxDeepEqual(gamma(math.complex(-1, 1)), math.complex(-0.17153291990827,
      0.32648274821008))
    approxDeepEqual(gamma(math.complex(-1, -1)), math.complex(-0.1715329199082,
      -0.3264827482100))
    approxDeepEqual(gamma(math.complex(0.5, 0.5)), math.complex(0.81816399954,
      -0.76331382871))
    approxDeepEqual(gamma(math.complex(0.5, -0.5)), math.complex(0.81816399954,
      0.76331382871))
    approxDeepEqual(gamma(math.complex(-0.5, 0.5)), math.complex(-1.5814778282,
      -0.0548501708))
    approxDeepEqual(gamma(math.complex(-0.5, -0.5)), math.complex(-1.581477828,
      0.054850170))
    approxDeepEqual(gamma(math.complex(-0.45, -0.15)), math.complex(-3.2466111264,
      0.2219549583256))
    approxDeepEqual(gamma(math.complex(0.49, 1)), math.complex(0.294136245907794,
      -0.4298609111267))
    approxDeepEqual(gamma(math.complex(9.43, -4.15)), math.complex(-39533.5179564,
      -7863.025662998))
    approxDeepEqual(gamma(math.complex(5, 3)), math.complex(0.016041882741652,
      -9.433293289755986))
    approxDeepEqual(gamma(math.complex(5, -3)), math.complex(0.016041882741652,
      9.433293289755986))
    approxDeepEqual(gamma(math.complex(-4.242, 0.0001)), math.complex(-0.131096144111857,
      -0.000063737771212))

    approxDeepEqual(math.multiply(gamma(math.complex(-5, 3)), 1e6),
      math.complex(7.896487481239, 4.756173836597))
    approxDeepEqual(math.multiply(gamma(math.complex(-5, -3)), 1e6),
      math.complex(7.8964874812, -4.7561738365))
  })

  it('should calculate the gamma of a boolean', function () {
    assert.strictEqual(gamma(true), 1)
    assert.strictEqual(gamma(false), Infinity)
  })

  it('should not operate on a matrix', function () {
    assert.throws(() => gamma(math.matrix([0, 1, 2, 3, 4, 5])), /Function 'gamma' doesn't apply to matrices/)
    assert.deepStrictEqual(math.map(math.matrix([0, 1, 2, 3, 4, 5]), gamma), math.matrix([Infinity, 1, 1, 2, 6, 24]))
  })

  it('should not operate on an array', function () {
    assert.throws(() => gamma([0, 1, 2, 3, 4, 5]), TypeError)
    assert.deepStrictEqual(math.map([0, 1, 2, 3, 4, 5], gamma), [Infinity, 1, 1, 2, 6, 24])
  })

  it('should throw en error if called with invalid number of arguments', function () {
    assert.throws(function () { gamma() })
    assert.throws(function () { gamma(1, 3) })
  })

  it('should throw en error if called with invalid type of argument', function () {
    assert.throws(function () { gamma(new Date()) })
    assert.throws(function () { gamma('a string') })
  })

  it('should LaTeX gamma', function () {
    const expression = math.parse('gamma(2.5)')
    assert.strictEqual(expression.toTex(), '\\Gamma\\left(2.5\\right)')
  })
})
