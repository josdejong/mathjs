const assert = require('assert')
const math = require('../src/main')

describe('factory', function () {
  it('should get a default instance of mathjs', function () {
    assert.strictEqual(typeof math, 'object')
    assert.deepStrictEqual(math.config(), {
      matrix: 'Matrix',
      number: 'number',
      precision: 64,
      predictable: false,
      epsilon: 1e-12,
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
      precision: 64,
      predictable: false,
      epsilon: 1e-12,
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

    const config = math1.config()
    assert.deepStrictEqual(config, {
      matrix: 'Matrix',
      number: 'number',
      precision: 64,
      predictable: false,
      epsilon: 1e-12,
      randomSeed: null
    })

    // restore the original config
    math1.config(config)
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
})
