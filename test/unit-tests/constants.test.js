import assert from 'assert'
import approx from '../../tools/approx'
import { createBigNumberClass } from '../../src/type/bignumber/BigNumber'
import { createComplexClass } from '../../src/type/complex/Complex'
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
} from '../../src/constants'

describe('constants', function () {
  describe('number', function () {
    const config = { number: 'number', precision: 64, epsilon: 1e-12 }
    const BigNumber = createBigNumberClass({ config })
    const Complex = createComplexClass({ config })
    const dependencies = {
      config,
      BigNumber,
      Complex
    }

    it('should create pi', function () {
      approx.equal(createPi(dependencies), 3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664)
    })

    it('should create tau', function () {
      approx.equal(createTau(dependencies), 6.28318530717959)
    })

    it('should create phi, golden ratio', function () {
      approx.equal(createPhi(dependencies), 1.61803398874989484820458683436563811772030917980576286213545)
    })

    it('should create e (euler constant)', function () {
      approx.equal(createE(dependencies), 2.71828182845905)
    })

    it('should create LN2', function () {
      approx.equal(createLN2(dependencies), 0.69314718055994530941723212145817656807550013436025525412068000949339362196969471560586332699641868754200148102057068573)
    })

    it('should create LN10', function () {
      approx.equal(createLN10(dependencies), 2.30258509299404568401799145468436420760110148862877297603332790096757260967735248023599720508959829834196778404228624863)
    })

    it('should create LOG2E', function () {
      approx.equal(createLOG2E(dependencies), 1.44269504088896340735992468100189213742664595415298593413544940693110921918118507988552662289350634449699751830965254425)
    })

    it('should create LOG10E', function () {
      approx.equal(createLOG10E(dependencies), 0.43429448190325182765112891891660508229439700580366656611445378316586464920887077472922494933843174831870610674476630373)
    })

    it('should create PI', function () {
      approx.equal(createPi(dependencies), 3.14159265358979)
    })

    it('should create SQRT1_2', function () {
      approx.equal(createSQRT1_2(dependencies), 0.70710678118654752440084436210484903928483593768847403658833986899536623923105351942519376716382078636750692311545614851)
    })

    it('should create SQRT2', function () {
      approx.equal(createSQRT2(dependencies), 1.41421356237309504880168872420969807856967187537694807317667973799073247846210703885038753432764157273501384623091229702)
    })

    it('should create Infinity', function () {
      assert.strictEqual(createInfinity(dependencies), Infinity)
    })

    it('should create NaN', function () {
      assert.ok(isNaN(createNaN(dependencies)))
    })
  })

  describe('bignumbers', function () {
    const config = { number: 'BigNumber', precision: 64, epsilon: 1e-12 }
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
