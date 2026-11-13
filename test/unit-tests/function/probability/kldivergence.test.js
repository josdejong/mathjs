import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('kldivergence', function () {
  it('should return 0, cause distributions is equals', function () {
    const q = [0.1, 0.4, 0.5, 0.2]
    assert.strictEqual(math.kldivergence(q, q), 0)
    assert.strictEqual(math.kldivergence(math.matrix(q), q), 0)
    assert.strictEqual(math.kldivergence(q, math.matrix(q)), 0)
    assert.strictEqual(math.kldivergence(math.matrix(q), math.matrix(q)), 0)
  })

  it('should return distance between two distrubutions', function () {
    const q = [0.5, 0.6, 0.7]
    const p = [0.4, 0.5, 0.6]
    assert.strictEqual(math.kldivergence(q, p), 0.00038410187968898266)

    const q2 = [0.9, 0.2, 0.8, 0.4]
    const p2 = [0.1, 0.8, 0.7, 0.6]
    assert.strictEqual(math.kldivergence(q2, p2), 0.6707144627487189)
  })

  it('should return normalized distance between two distributions', function () {
    const q = [1, 2, 3, 4, 5, 6, 7, 8]
    const p = [2, 3, 4, 5, 6, 7, 8, 9]
    assert.strictEqual(math.kldivergence(q, p), 0.006970870019248255)
  })

  it('should return infinity', function () {
    const q = [1, 2]
    const p = [0, 1]
    assert.strictEqual(math.kldivergence(q, p), Infinity)
  })

  it('should treat zero-probability terms as zero, including shared zeros', function () {
    for (const q of [[1, 0], [0, 1], [0.5, 0, 0.5]]) {
      assert.strictEqual(math.kldivergence(q, q), 0)
      assert.strictEqual(math.kldivergence(math.matrix(q), q), 0)
      assert.strictEqual(math.kldivergence(q, math.matrix(q)), 0)
      assert.strictEqual(math.kldivergence(math.matrix(q), math.matrix(q)), 0)
    }
    assert.strictEqual(math.kldivergence([1, 0], [0.5, 0.5]), Math.log(2))
    assert.strictEqual(math.kldivergence([0, 2], [1, 1]), Math.log(2))
    assert.strictEqual(math.kldivergence([0, 1, 1], [0, 0, 1]), Infinity)
  })

  it('should preserve BigNumber zero terms and reject zero total mass', function () {
    const q = [math.bignumber(1), math.bignumber(0)]
    const result = math.kldivergence(q, q)
    assert.strictEqual(result.isBigNumber, true)
    assert.strictEqual(result.toString(), '0')
    const tiny = [math.bignumber('1e-1000'), math.bignumber(0)]
    assert.strictEqual(math.kldivergence(tiny, tiny).toString(), '0')
    assert.throws(() => math.kldivergence([0, 0], [1, 0]), /first object must be non zero/)
    assert.throws(() => math.kldivergence([1, 0], [0, 0]), /second object must be non zero/)
    assert.throws(() => math.kldivergence([math.bignumber(0)], [math.bignumber(1)]), /first object must be non zero/)
    assert.throws(() => math.kldivergence([math.bignumber(1)], [math.bignumber(0)]), /second object must be non zero/)
  })

  it('should reject vectors of different lengths in either order', function () {
    assert.throws(() => math.kldivergence([1], [1, 2]), /Length of two vectors must be equal/)
    assert.throws(() => math.kldivergence([1, 2], [1]), /Length of two vectors must be equal/)
  })

  it('should keep tiny nonzero probabilities and invalid reference values distinct from zero', function () {
    assert.strictEqual(math.kldivergence([1e-20], [1e-20]), 0)
    const result = math.kldivergence([1, 1e-20], [1, 1e-21])
    assert.ok(result > 0)
    assert.ok(Math.abs(result / (1e-20 * Math.log(10)) - 1) < 1e-12)
    assert.ok(Number.isNaN(math.kldivergence([1, 0], [2, -1])))
    assert.ok(Number.isNaN(math.kldivergence([1, 0], [1, NaN])))
  })

  it('should return NaN', function () {
    const q = [-1, 2]
    const p = [0.4, 1]
    assert.strictEqual(isNaN(parseFloat(math.kldivergence(q, p))), true)
  })

  it('should return bignumber', function () {
    const result = math.kldivergence([math.bignumber(4), math.bignumber(7)], [math.bignumber(1), math.bignumber(4)])
    assert.strictEqual(result.toString(), '0.0717688178200499468328227075658945850681301640503275280115029999')
  })
})
