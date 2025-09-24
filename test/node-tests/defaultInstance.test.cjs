const assert = require('assert')
const cp = require('child_process')
const path = require('path')
const math = require('../../lib/cjs/defaultInstance.js').default
const version = require('../../package.json').version

describe('defaultInstance', function () {
  it('should get a default instance of mathjs', function () {
    assert.strictEqual(typeof math, 'object')
    assert.deepStrictEqual(math.config(), {
      matrix: 'Matrix',
      number: 'number',
      numberFallback: 'number',
      precision: 64,
      predictable: false,
      relTol: 1e-12,
      absTol: 1e-15,
      legacySubset: false,
      randomSeed: null
    })
  })

  it('should create an instance of math.js with custom configuration', function () {
    const math1 = math.create({
      matrix: 'Array',
      number: 'BigNumber'
    })

    assert.strictEqual(typeof math1, 'object')
    assert.deepStrictEqual(math1.config(), {
      matrix: 'Array',
      number: 'BigNumber',
      numberFallback: 'number',
      precision: 64,
      predictable: false,
      relTol: 1e-12,
      absTol: 1e-15,
      legacySubset: false,
      randomSeed: null
    })
  })

  it('two instances of math.js should be isolated from each other', function () {
    const math1 = math.create()
    const math2 = math.create({
      matrix: 'Array'
    })

    assert.notStrictEqual(math, math1)
    assert.notStrictEqual(math, math2)
    assert.notStrictEqual(math1, math2)
    assert.notDeepStrictEqual(math1.config(), math2.config())
    assert.notDeepStrictEqual(math.config(), math2.config())

    // changing config should not affect the other
    math1.config({ number: 'BigNumber' })
    assert.strictEqual(math.config().number, 'number')
    assert.strictEqual(math1.config().number, 'BigNumber')
    assert.strictEqual(math2.config().number, 'number')
  })

  it('should apply configuration using the config function', function () {
    const math1 = math.create()

    assert.deepStrictEqual(math1.sqrt(-4), math1.complex(0, 2))
    assert.strictEqual(math1.typeOf(math1.pi), 'number')
    assert.strictEqual(math1.typeOf(math1.Unit.UNITS.rad.value), 'number') // TODO: find a better way to unit test this
    assert.strictEqual(math1.bignumber(1).div(3).toString(), '0.3333333333333333333333333333333333333333333333333333333333333333')

    const config = math1.config({
      number: 'BigNumber',
      precision: 4,
      predictable: true
    })

    assert.deepStrictEqual(config, {
      matrix: 'Matrix',
      number: 'BigNumber',
      numberFallback: 'number',
      precision: 4,
      predictable: true,
      relTol: 1e-12,
      absTol: 1e-15,
      legacySubset: false,
      randomSeed: null
    })

    assert.ok(math1.isNaN(math1.sqrt(-4)))
    assert.strictEqual(math1.typeOf(math1.pi), 'BigNumber')
    assert.strictEqual(math1.typeOf(math1.Unit.UNITS.rad.value), 'BigNumber') // TODO: find a better way to unit test this
    assert.strictEqual(math1.bignumber(1).div(3).toString(), '0.3333')

    const config2 = math1.config({
      number: 'number',
      precision: 64,
      predictable: false
    })

    assert.deepStrictEqual(config2, {
      matrix: 'Matrix',
      number: 'number',
      numberFallback: 'number',
      precision: 64,
      predictable: false,
      relTol: 1e-12,
      absTol: 1e-15,
      legacySubset: false,
      randomSeed: null
    })

    assert.deepStrictEqual(math1.sqrt(-4), math1.complex(0, 2))
    assert.strictEqual(math1.typeOf(math1.pi), 'number')
    assert.strictEqual(math1.typeOf(math1.Unit.UNITS.rad.value), 'number') // TODO: find a better way to unit test this
    assert.strictEqual(math1.bignumber(1).div(3).toString(), '0.3333333333333333333333333333333333333333333333333333333333333333')
  })

  it('should not override a custom imported function when config changes', function () {
    const math1 = math.create()

    math1.import({
      sqrt: function customSqrt (x) {
        return 'foo(' + x + ')'
      }
    }, { override: true })

    assert.strictEqual(math1.sqrt(4), 'foo(4)')

    // changing config should not change the custom function sqrt
    math1.config({ number: 'BigNumber' })

    assert.strictEqual(math1.sqrt(4), 'foo(4)')
  })

  // TODO: test whether the namespace is correct: has functions like sin, constants like pi, objects like type and error.

  it('should throw an error when ES5 is not supported', function () {
    const create = Object.create
    Object.create = undefined // fake missing Object.create function

    assert.throws(function () {
      math.create()
    }, /ES5 not supported/)

    // restore Object.create
    Object.create = create
  })

  it('should have the correct version number', function () {
    const math = require('../..')

    assert.strictEqual(math.version, version)
  })

  it('should be robust against pollution of the Object prototype', function (done) {
    const filename = path.join(__dirname, 'pollutedObjectPrototype.js')
    cp.exec('node ' + filename, function (error, result) {
      assert.strictEqual(error, null)
      assert.strictEqual(result, '2i\n')
      done()
    })
  })
})
