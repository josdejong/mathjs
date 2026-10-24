import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('short-circuiting transforms', function () {
  const cases = [
    { fn: 'and', one: 'true', three: 'true, true, false', two: 'true, false', result: false },
    { fn: 'or', one: 'false', three: 'false, false, true', two: 'false, true', result: true },
    { fn: 'bitAnd', one: '1', three: '1, 1, 0', two: '6, 3', result: 2 },
    { fn: 'bitOr', one: '0', three: '0, 0, 1', two: '4, 1', result: 5 },
    { fn: 'nullish', one: 'null', three: 'null, 8, null', two: 'null, 8', result: 8 }
  ]

  cases.forEach(function ({ fn, one, three, two, result }) {
    describe(fn, function () {
      it('should evaluate two arguments', function () {
        assert.strictEqual(math.evaluate(`${fn}(${two})`), result)
      })

      it('should throw for too few arguments', function () {
        assert.throws(function () { math.evaluate(`${fn}(${one})`) }, /TypeError: Too few arguments/)
      })

      it('should throw for too many arguments', function () {
        assert.throws(function () { math.evaluate(`${fn}(${three})`) }, /TypeError: Too many arguments/)
      })
    })
  })
})
