const assert = require('assert')
const math = require('../../../src/main')

describe('seed', function () {
  after(function () {
    // Randomly seed random number generator
    math.config({ randomSeed: null })
  })

  it('should generate same number with seed', function () {
    math.config({ randomSeed: 'a' })
    const first = math.random()
    math.config({ randomSeed: 'a' })
    const second = math.random()
    assert.strictEqual(first, second)
  })

  it('should generate different number subsequent calls to seeded random', function () {
    math.config({ randomSeed: 'a' })
    const first = math.random()
    const second = math.random()
    assert.notStrictEqual(first, second)
  })

  it('calling with no parameters should unseed rng', function () {
    math.config({ randomSeed: 'a' })
    const firstA = math.random()
    const secondA = math.random()
    math.config({ randomSeed: 'a' })
    const firstB = math.random()
    math.config({ randomSeed: null })
    const secondB = math.random()
    assert.strictEqual(firstA, firstB)
    assert.notStrictEqual(secondA, secondB)
  })

  it('should generate same matrix with seed', function () {
    math.config({ randomSeed: 'a' })
    const first = math.random([5, 5])
    math.config({ randomSeed: 'a' })
    const second = math.random([5, 5])
    assert.strictEqual(math.deepEqual(first, second), true)
  })

  it('should generate different matrices subsequent calls to seeded random', function () {
    math.config({ randomSeed: 'a' })
    const first = math.random([5, 5])
    const second = math.random([5, 5])
    assert.strictEqual(math.deepEqual(first, second), false)
  })

  it('should pick same number with seed', function () {
    const range = math.range(1, 1000)
    math.config({ randomSeed: 'a' })
    const first = math.pickRandom(range)
    math.config({ randomSeed: 'a' })
    const second = math.pickRandom(range)
    assert.strictEqual(first, second)
  })

  it('should pick different number subsequent calls to seeded random', function () {
    // In theory these might be the same but with 'a' as seed they are different and always will be
    const range = math.range(1, 1000)
    math.config({ randomSeed: 'a' })
    const first = math.pickRandom(range)
    const second = math.pickRandom(range)
    assert.notStrictEqual(first, second)
  })

  it('should pick same int with seed', function () {
    math.config({ randomSeed: 'a' })
    const first = math.randomInt(1, 100)
    math.config({ randomSeed: 'a' })
    const second = math.randomInt(1, 100)
    assert.strictEqual(first, second)
  })

  it('should pick different int subsequent calls to seeded random', function () {
    math.config({ randomSeed: 'a' })
    const first = math.randomInt(1, 100)
    const second = math.randomInt(1, 100)
    assert.notStrictEqual(first, second)
  })

  it('should work for number seeds', function () {
    math.config({ randomSeed: 1 })
    const first = math.random()
    math.config({ randomSeed: 1 })
    const second = math.random()
    assert.strictEqual(first, second)
  })

  it('should work for object seeds', function () {
    math.config({ randomSeed: { a: 1 } })
    const first = math.random()
    math.config({ randomSeed: { a: 1 } })
    const second = math.random()
    assert.strictEqual(first, second)
  })
})
