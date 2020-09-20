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
