/* eslint-disable no-loss-of-precision */

import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const sinh = math.sinh
const bigmath = math.create({ number: 'BigNumber', precision: 20 })

const EPSILON = 1e-14

describe('sinh', function () {
  it('should return the sinh of a boolean', function () {
    assert.strictEqual(sinh(true), 1.1752011936438014)
    assert.strictEqual(sinh(false), 0)
  })

  it('should return the sinh of a number', function () {
    approxEqual(sinh(-2), -3.62686040784701876766821398280126170488634201232113572130, EPSILON)
    approxEqual(sinh(-0.5), -0.52109530549374736162242562641149155910592898261148052794, EPSILON)
    approxEqual(sinh(0), 0, EPSILON)
    approxEqual(sinh(0.3), 0.304520293447142618958435267005095229098024232680179727377, EPSILON)
    approxEqual(sinh(0.5), 0.521095305493747361622425626411491559105928982611480527946, EPSILON)
    approxEqual(sinh(0.8), 0.888105982187623006574717573189756980559709596888150052610, EPSILON)
    approxEqual(sinh(1), 1.175201193643801456882381850595600815155717981334095870229, EPSILON)
    approxEqual(sinh(2), 3.626860407847018767668213982801261704886342012321135721309, EPSILON)
  })

  if (process.version !== '' && !/v0\.10|v0\.12/.test(process.version)) {
    // we only do these tests on node.js
    // skip this test on node v0.10 and v0.12 and IE 11, which have a numerical issue

    it('should return the sinh of very small numbers (avoid returning zero)', function () {
      // If sinh returns 0, that is bad, so we are using assert, not approx.equal
      assert(sinh(-1e-10) !== 0)
      assert(Math.abs(sinh(-1e-10) - -1e-10) < EPSILON)
    })

    it('should return the sinh of very large numbers (avoid returning zero)', function () {
      // If sinh returns 0, that is bad, so we are using assert.strictEqual, not approx.equal
      // console.log('process.version=', process.version)
      assert(sinh(1e-50) !== 0)
      assert(Math.abs(sinh(1e-50) - 1e-50) < EPSILON)
    })
  }

  it('should return the sinh of a bignumber', function () {
    const sinhBig = bigmath.sinh
    const Big = bigmath.bignumber

    const arg1 = Big(-Infinity)
    const arg2 = Big(-1)
    const arg7 = Big(Infinity)
    assert.deepStrictEqual(sinhBig(arg1).toString(), '-Infinity')
    assert.deepStrictEqual(sinhBig(arg2), Big('-1.1752011936438014569'))
    assert.deepStrictEqual(sinhBig(Big(-1e-10)), Big(-1e-10))
    assert.deepStrictEqual(sinhBig(Big(0)), Big(0))
    assert.deepStrictEqual(sinhBig(Big(1)), Big('1.1752011936438014569'))
    assert.deepStrictEqual(sinhBig(bigmath.pi).toString(), '11.548739357257748378')
    assert.deepStrictEqual(sinhBig(arg7).toString(), 'Infinity')

    // Ensure args were not changed
    assert.deepStrictEqual(arg1.toString(), '-Infinity')
    assert.deepStrictEqual(arg2, Big(-1))
    assert.deepStrictEqual(arg7.toString(), 'Infinity')

    bigmath.config({ precision: 50 })
    assert.deepStrictEqual(sinhBig(Big(1e-50)), Big(1e-50))
  })

  it('should return the sinh of a complex number', function () {
    approxDeepEqual(sinh(complex('1')), complex(1.1752011936438014, 0), EPSILON)
    approxDeepEqual(sinh(complex('i')), complex(0, 0.8414709848079), EPSILON)
    approxDeepEqual(sinh(complex('2 + i')), complex(1.95960104142160589707, 3.16577851321616814674), EPSILON)
  })

  it('should throw an error on an angle', function () {
    assert.throws(() => sinh(unit('90deg')), TypeError)
  })

  it('should throw an error if called with an invalid unit', function () {
    assert.throws(function () { sinh(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { sinh('string') })
  })

  const sinh123 = [1.1752011936438014, 3.626860407847, 10.01787492741]

  it('should not operate on an array', function () {
    assert.throws(() => sinh([1, 2, 3]), TypeError)
    approxDeepEqual(math.map([1, 2, 3], sinh), sinh123, EPSILON)
  })

  it('should not operate on a matrix', function () {
    assert.throws(() => sinh(matrix([1, 2, 3])), TypeError)
    approxDeepEqual(math.map(matrix([1, 2, 3]), sinh), matrix(sinh123), EPSILON)
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { sinh() }, /TypeError: Too few arguments/)
    assert.throws(function () { sinh(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () { sinh(null) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX sinh', function () {
    const expression = math.parse('sinh(1)')
    assert.strictEqual(expression.toTex(), '\\sinh\\left(1\\right)')
  })
})
