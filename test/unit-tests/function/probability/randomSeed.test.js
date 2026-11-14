import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { all as numberAll, create } from '../../../../src/number.js'

describe('random seed configuration', function () {
  const draws = {
    random: m => m.random(),
    randomInt: m => m.randomInt(1000000),
    pickRandom: m => m.pickRandom(Array.from({ length: 100 }, (_, i) => i), 10)
  }

  for (const [name, draw] of Object.entries(draws)) {
    it(`should restart ${name} when explicitly setting the same seed`, function () {
      const m = math.create({ randomSeed: 'repeat-seed' })
      const first = draw(m)
      draw(m)
      m.config({ randomSeed: 'repeat-seed' })
      assert.deepStrictEqual(draw(m), first)
    })

    it(`should preserve ${name} state on unrelated configuration`, function () {
      const m = math.create({ randomSeed: 'repeat-seed' })
      const control = math.create({ randomSeed: 'repeat-seed' })
      assert.deepStrictEqual(draw(m), draw(control))
      m.config({ precision: 32 })
      m.config({})
      m.config()
      assert.deepStrictEqual(draw(m), draw(control))
    })

    it(`should initialize ${name} lazily with the latest seed`, function () {
      const m = math.create({ randomSeed: 'old-seed' })
      m.config({ randomSeed: 'repeat-seed' })
      const control = math.create({ randomSeed: 'repeat-seed' })
      assert.deepStrictEqual(draw(m), draw(control))
    })
  }

  it('should restart random in the number-only instance', function () {
    const m = create(numberAll, { randomSeed: 'repeat-seed' })
    const first = m.random()
    m.random()
    m.config({ randomSeed: 'repeat-seed' })
    assert.strictEqual(m.random(), first)
  })
})
