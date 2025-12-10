import assert from 'assert'
import { modernizeOptions } from '../../../../src/core/function/config.js'

function accumulator (list) {
  return item => list.push(item)
}

describe('config internals', function () {
  it('should translate options without changing input', function () {
    const opt = { a: 1, b: 2 }
    assert.deepStrictEqual(
      modernizeOptions(opt, { b: ['normal', ['c']] }), { a: 1, c: 2 })
    assert.deepStrictEqual(opt, { a: 1, b: 2 })
    assert.deepStrictEqual(
      modernizeOptions(opt, { a: ['normal', ['c', 'd']] }),
      { b: 2, c: { d: 1 } })
    assert.deepStrictEqual(opt, { a: 1, b: 2 })
  })

  it('should warn about deprecated options', function () {
    const opt = { a: 1, b: 2 }
    const warns = []
    modernizeOptions(opt, { b: 'deprecated' }, accumulator(warns))
    assert.deepStrictEqual(opt, { a: 1, b: 2 })
    assert.strictEqual(warns.length, 1)
    assert.ok(/deprecated.*option.*b/.test(warns[0]))
  })

  it('should warn and translate at the same time', function () {
    const opt = { a: 1, b: 2 }
    let warns = []
    assert.deepStrictEqual(
      modernizeOptions(opt, { b: ['deprecated', ['c']] }, accumulator(warns)),
      { a: 1, c: 2 })
    assert.deepStrictEqual(opt, { a: 1, b: 2 })
    assert.strictEqual(warns.length, 1)
    assert.ok(/deprecated.*option.*'b'.*'c'/.test(warns[0]))
    warns = []
    assert.deepStrictEqual(
      modernizeOptions(
        opt, { a: ['deprecated', ['c', 'd']] }, accumulator(warns)),
      { b: 2, c: { d: 1 } })
    assert.deepStrictEqual(opt, { a: 1, b: 2 })
    assert.strictEqual(warns.length, 1)
    assert.ok(/deprecated.*option.*'a'.*'c[.]d'/.test(warns[0]))
  })

  it('should throw errors for deprecated options', function () {
    const opt = { a: 1, b: 2 }
    assert.throws(
      () => modernizeOptions(opt, { b: ['discontinued', 'foo'] }),
      /discontinued.*option.*'b'.*'foo'/)
  })

  it('should translate to two places at once', function () {
    const opt = { a: 1, b: 2 }
    const warns = []
    assert.deepStrictEqual(
      modernizeOptions(
        opt, { b: ['deprecated', ['c'], ['d', 'e']] }, accumulator(warns)),
      { a: 1, c: 2, d: { e: 2 } })
    assert.deepStrictEqual(opt, { a: 1, b: 2 })
    assert.strictEqual(warns.length, 1)
    assert.ok(/deprecated.*option.*'b'.*'c' and 'd[.]e'/.test(warns[0]))
  })
})
