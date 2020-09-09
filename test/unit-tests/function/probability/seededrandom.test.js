import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('seed', function () {
  it('should generate same number with seed', function () {
    const math1 = math.create({ randomSeed: 'a' })
    const first = math1.random()
    const math2 = math.create({ randomSeed: 'a' })
    const second = math2.random()
    assert.strictEqual(first, second)
  })

  it('should generate different number subsequent calls to seeded random', function () {
    const math2 = math.create({ randomSeed: 'a' })
    const first = math2.random()
    const second = math2.random()
    assert.notStrictEqual(first, second)
  })

  it('calling with no parameters should unseed rng', function () {
    const math1 = math.create({ randomSeed: 'a' })
    const firstA = math1.random()
    const secondA = math1.random()
    const math2 = math.create({ randomSeed: 'a' })
    const firstB = math2.random()
    const math3 = math.create({ randomSeed: null })
    const secondB = math3.random()
    assert.strictEqual(firstA, firstB)
    assert.notStrictEqual(secondA, secondB)
  })

  it('should generate same matrix with seed', function () {
    const math1 = math.create({ randomSeed: 'a' })
    const first = math1.random([5, 5])
    const math2 = math.create({ randomSeed: 'a' })
    const second = math2.random([5, 5])
    assert.strictEqual(math.deepEqual(first, second), true)
  })

  it('should generate different matrices subsequent calls to seeded random', function () {
    const math2 = math.create({ randomSeed: 'a' })
    const first = math2.random([5, 5])
    const second = math2.random([5, 5])
    assert.strictEqual(math.deepEqual(first, second), false)
  })

  it('should pick same number with seed', function () {
    const range = math.range(1, 1000)
    const math1 = math.create({ randomSeed: 'a' })
    const first = math1.pickRandom(range)
    const math2 = math.create({ randomSeed: 'a' })
    const second = math2.pickRandom(range)
    assert.strictEqual(first, second)
  })

  it('should pick different number subsequent calls to seeded random', function () {
    // In theory these might be the same but with 'a' as seed they are different and always will be
    const range = math.range(1, 1000)
    const math2 = math.create({ randomSeed: 'a' })
    const first = math2.pickRandom(range)
    const second = math2.pickRandom(range)
    assert.notStrictEqual(first, second)
  })

  it('should pick same int with seed', function () {
    const math1 = math.create({ randomSeed: 'a' })
    const first = math1.randomInt(1, 100)
    const math2 = math.create({ randomSeed: 'a' })
    const second = math2.randomInt(1, 100)
    assert.strictEqual(first, second)
  })

  it('should pick different int subsequent calls to seeded random', function () {
    const math2 = math.create({ randomSeed: 'a' })
    const first = math2.randomInt(1, 100)
    const second = math2.randomInt(1, 100)
    assert.notStrictEqual(first, second)
  })

  it('should work for number seeds', function () {
    const math1 = math.create({ randomSeed: 1 })
    const first = math1.random()
    const math2 = math.create({ randomSeed: 1 })
    const second = math2.random()
    assert.strictEqual(first, second)
  })

  it('should work for object seeds', function () {
    const math1 = math.create({ randomSeed: { a: 1 } })
    const first = math1.random()
    const math2 = math.create({ randomSeed: { a: 1 } })
    const second = math2.random()
    assert.strictEqual(first, second)
  })
})
