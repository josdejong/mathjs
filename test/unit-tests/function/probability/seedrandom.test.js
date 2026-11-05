import assert from 'assert'
import { seedrandom } from '../../../../src/function/probability/util/seedrandom.js'

describe('seedrandom', function () {
  describe('deterministic behavior', function () {
    it('should produce the same sequence for the same seed', function () {
      const rng1 = seedrandom('test-seed')
      const rng2 = seedrandom('test-seed')

      const sequence1 = [rng1(), rng1(), rng1(), rng1(), rng1()]
      const sequence2 = [rng2(), rng2(), rng2(), rng2(), rng2()]

      assert.deepStrictEqual(sequence1, sequence2)
    })

    it('should produce different sequences for different seeds', function () {
      const rng1 = seedrandom('seed-a')
      const rng2 = seedrandom('seed-b')

      assert.notStrictEqual(rng1(), rng2())
    })

    it('should work with numeric seeds', function () {
      const rng1 = seedrandom(12345)
      const rng2 = seedrandom(12345)

      assert.strictEqual(rng1(), rng2())
    })

    it('should work with null/undefined seeds', function () {
      const rng1 = seedrandom(null)
      const rng2 = seedrandom(undefined)

      assert.strictEqual(typeof rng1(), 'number')
      assert.strictEqual(typeof rng2(), 'number')
    })
  })

  describe('output range', function () {
    it('should return values in [0, 1)', function () {
      const rng = seedrandom('range-test')

      for (let i = 0; i < 1000; i++) {
        const value = rng()
        assert.ok(value >= 0, 'value should be >= 0')
        assert.ok(value < 1, 'value should be < 1')
      }
    })

    it('should produce well-distributed values', function () {
      const rng = seedrandom('distribution-test')
      const buckets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

      for (let i = 0; i < 10000; i++) {
        const value = rng()
        const bucket = Math.floor(value * 10)
        buckets[bucket]++
      }

      for (const count of buckets) {
        assert.ok(count > 800, 'each bucket should have > 800 values')
        assert.ok(count < 1200, 'each bucket should have < 1200 values')
      }
    })
  })

  describe('exact sequence stability', function () {
    it('should produce the exact reference sequence for seed "hello"', function () {
      const rng = seedrandom('hello')
      assert.deepStrictEqual([rng(), rng(), rng(), rng(), rng()], [
        0.5463663768140734, 0.4397379377059223, 0.554769432473455,
        0.7627046759719986, 0.4805307030523447
      ])
    })

    it('should produce the exact reference sequence for seed "test123"', function () {
      const rng = seedrandom('test123')
      assert.deepStrictEqual([rng(), rng(), rng(), rng(), rng()], [
        0.04685716528492509, 0.5600614521575903, 0.6661488235776364,
        0.6245303379613479, 0.2794975513488121
      ])
    })

    it('should produce the exact reference sequence for seed "42"', function () {
      const rng = seedrandom('42')
      assert.deepStrictEqual([rng(), rng(), rng(), rng(), rng()], [
        0.00701751618236155, 0.17185490054868188, 0.967001069269818,
        0.4077816952668805, 0.922687842759339
      ])
    })

    it('should produce the exact reference sequence for empty string seed', function () {
      const rng = seedrandom('')
      assert.deepStrictEqual([rng(), rng(), rng(), rng(), rng()], [
        0.23144008215179881, 0.27404636548159655, 0.7901279251811976,
        0.40384160557189036, 0.1321140086237582
      ])
    })
  })

  describe('edge cases', function () {
    it('should handle empty string seed', function () {
      const rng = seedrandom('')
      assert.strictEqual(typeof rng(), 'number')
    })

    it('should handle very long seeds', function () {
      const longSeed = 'a'.repeat(10000)
      const rng = seedrandom(longSeed)
      assert.strictEqual(typeof rng(), 'number')
    })

    it('should handle special characters in seed', function () {
      const rng = seedrandom('!@#$%^&*()_+-=[]{}|;:,.<>?')
      assert.strictEqual(typeof rng(), 'number')
    })

    it('should handle unicode in seed', function () {
      const rng = seedrandom('こんにちは世界🎲')
      assert.strictEqual(typeof rng(), 'number')
    })
  })
})
