import assert from 'assert'
import { approxEqual } from '../../tools/approx.js'
import { createBigNumberClass } from '../../src/type/bignumber/BigNumber.js'
import { createComplexClass } from '../../src/type/complex/Complex.js'
import {
  createE,
  createFalse,
  createI,
  createInfinity,
  createLN10,
  createLN2,
  createLOG10E,
  createLOG2E,
  createNaN,
  createNull,
  createPhi,
  createPi,
  createSQRT2,
  createSQRT1_2, // eslint-disable-line camelcase
  createTau,
  createTrue
} from '../../src/constants.js'

describe('constants', function () {
  describe('number', function () {
    const config = { number: 'number', precision: 64, relTol: 1e-12 }
    const BigNumber = createBigNumberClass({ config })
    const Complex = createComplexClass({ config })
    const dependencies = {
      config,
      BigNumber,
      Complex
    }

    it('should create pi', function () {
      approxEqual(createPi(dependencies), 3.14159265358979)
    })

    it('should create tau', function () {
      approxEqual(createTau(dependencies), 6.28318530717959)
    })

    it('should create phi, golden ratio', function () {
      approxEqual(createPhi(dependencies), 1.61803398874989)
    })

    it('should create e (euler constant)', function () {
      approxEqual(createE(dependencies), 2.71828182845905)
    })

    it('should create LN2', function () {
      approxEqual(createLN2(dependencies), 0.69314718055995)
    })

    it('should create LN10', function () {
      approxEqual(createLN10(dependencies), 2.30258509299405)
    })

    it('should create LOG2E', function () {
      approxEqual(createLOG2E(dependencies), 1.44269504088896)
    })

    it('should create LOG10E', function () {
      approxEqual(createLOG10E(dependencies), 0.43429448190325)
    })

    it('should create PI', function () {
      approxEqual(createPi(dependencies), 3.14159265358979)
    })

    it('should create SQRT1_2', function () {
      approxEqual(createSQRT1_2(dependencies), 0.70710678118655)
    })

    it('should create SQRT2', function () {
      approxEqual(createSQRT2(dependencies), 1.4142135623731)
    })

    it('should create Infinity', function () {
      assert.strictEqual(createInfinity(dependencies), Infinity)
    })

    it('should create NaN', function () {
      assert.ok(isNaN(createNaN(dependencies)))
    })
  })

  describe('bignumbers', function () {
    const config = { number: 'BigNumber', precision: 64, relTol: 1e-12 }
    const BigNumber = createBigNumberClass({ config })
    const Complex = createComplexClass({ config })
    const dependencies = {
      config,
      BigNumber,
      Complex
    }

    it('should create bignumber pi', function () {
      assert.strictEqual(createPi(dependencies).toString(), '3.141592653589793238462643383279502884197169399375105820974944592')
    })

    it('should create bignumber tau', function () {
      assert.strictEqual(createTau(dependencies).toString(), '6.283185307179586476925286766559005768394338798750211641949889184')
    })

    it('should create bignumber phi, golden ratio', function () {
      assert.strictEqual(createPhi(dependencies).toString(), '1.618033988749894848204586834365638117720309179805762862135448623')
    })

    it('should create bignumber e', function () {
      assert.strictEqual(createE(dependencies).toString(), '2.718281828459045235360287471352662497757247093699959574966967628')
    })

    it('should create bignumber LN2', function () {
      assert.strictEqual(createLN2(dependencies).toString(), '0.6931471805599453094172321214581765680755001343602552541206800095')
    })

    it('should create bignumber LN10', function () {
      assert.strictEqual(createLN10(dependencies).toString(), '2.302585092994045684017991454684364207601101488628772976033327901')
    })

    it('should create bignumber LOG2E', function () {
      assert.strictEqual(createLOG2E(dependencies).toString(), '1.442695040888963407359924681001892137426645954152985934135449407')
    })

    it('should create bignumber LOG10E', function () {
      assert.strictEqual(createLOG10E(dependencies).toString(), '0.4342944819032518276511289189166050822943970058036665661144537832')
    })

    it('should create bignumber PI (upper case)', function () {
      assert.strictEqual(createPi(dependencies).toString(), '3.141592653589793238462643383279502884197169399375105820974944592')
    })

    it('should create bignumber SQRT1_2', function () {
      assert.strictEqual(createSQRT1_2(dependencies).toString(), '0.707106781186547524400844362104849039284835937688474036588339869')
    })

    it('should create bignumber SQRT2', function () {
      assert.strictEqual(createSQRT2(dependencies).toString(), '1.414213562373095048801688724209698078569671875376948073176679738')
    })

    it('should create bignumber Infinity', function () {
      const inf = createInfinity(dependencies)
      assert(inf instanceof BigNumber)
      assert.strictEqual(inf.toString(), 'Infinity')
    })

    it('should create bignumber NaN', function () {
      const nan = createNaN(dependencies)
      assert(nan instanceof BigNumber)
      assert.strictEqual(nan.toString(), 'NaN')
      assert.ok(isNaN(nan))
    })
  })

  describe('complex', function () {
    it('should create i', function () {
      const Complex = createComplexClass()
      const i = createI({ Complex })

      assert.deepStrictEqual(i, new Complex(0, 1))
    })
  })

  describe('universal behavior', function () {
    it('should create true and false', function () {
      assert.strictEqual(createTrue(), true)
      assert.strictEqual(createFalse(), false)
    })

    it('should create null', function () {
      assert.strictEqual(createNull(), null)
    })
  })
})
