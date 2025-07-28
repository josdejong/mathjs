import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const { sparse, matrix, nullish } = math

describe('nullish', function () {
  it('should return right if left nullish', function () {
    assert.strictEqual(nullish(null, 42), 42)
    assert.strictEqual(nullish(undefined, 'foo'), 'foo')
    assert.strictEqual(nullish(0, 42), 0)
  })

  it('should short-circuit scalar ?? sparse', function () {
    const s = sparse([[1, 0]])
    assert.strictEqual(nullish(5, s), 5)
    assert.strictEqual(nullish(undefined, s), s)
  })

  it('should short-circuit scalar ?? dense', function () {
    const d = matrix([[1, null], [undefined, 4]])
    assert.strictEqual(nullish(5, d), 5)
    assert.strictEqual(nullish(undefined, d), d)
  })

  it('should handle sparse ?? dense efficiently', function () {
    const s = sparse([[1, 0]])
    const d = matrix([[10, 20]])
    const res = nullish(s, d)
    assert(res.isSparseMatrix) // but since 0 not nullish, res should have 1 and 0 (but sparse might skip 0)
    assert.deepStrictEqual(res.toArray(), [[1, 0]])
  })

  it('should handle dense ?? scalar element-wise', function () {
    const d = matrix([[null, 0], [undefined, 1]])
    const res = nullish(d, 42)
    assert.deepStrictEqual(res.toArray(), [[42, 0], [42, 1]])
  })
})
