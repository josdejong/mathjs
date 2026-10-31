import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('matrix constructor dimensions', function () {
  for (const name of ['ones', 'zeros']) {
    const fill = name === 'ones' ? 1 : 0
    for (const format of [undefined, 'dense', 'sparse']) {
      it(`${name} should preserve reusable BigNumber dimensions (${format})`, function () {
        const dimensions = [2, math.bignumber(3)]
        const original = dimensions.slice()
        const args = format ? [dimensions, format] : [dimensions]
        const first = math[name](...args)
        assert.deepStrictEqual(dimensions, original)
        const second = math[name](...args)
        assert.deepStrictEqual(first, second)
        const values = first.valueOf()
        assert.deepStrictEqual(values, Array.from({ length: 2 }, () => Array.from({ length: 3 }, () => format === 'sparse' && fill === 0 ? 0 : math.bignumber(fill))))
      })
      it(`${name} should accept frozen BigNumber dimensions (${format})`, function () {
        const dimensions = Object.freeze([math.bignumber(2), 3])
        const result = format ? math[name](dimensions, format) : math[name](dimensions)
        assert.deepStrictEqual(math.size(result).valueOf(), [2, 3])
      })
    }
    it(`${name} should preserve dimensions when validation fails`, function () {
      const dimensions = [math.bignumber(2), -1]
      const original = dimensions.slice()
      assert.throws(() => math[name](dimensions), /positive integers/)
      assert.deepStrictEqual(dimensions, original)
    })
    it(`${name} should preserve ordinary frozen dimensions`, function () {
      assert.deepStrictEqual(math[name](Object.freeze([2, 3])), [[fill, fill, fill], [fill, fill, fill]])
    })
  }
})
