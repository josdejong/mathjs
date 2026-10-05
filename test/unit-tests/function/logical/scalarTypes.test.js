import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('logical scalar types', function () {
  for (const name of ['and', 'or', 'xor']) {
    const operation = math[name]
    const expected = {
      and: (x, y) => x && y,
      or: (x, y) => x || y,
      xor: (x, y) => x !== y
    }[name]

    it(`should ${name} fractions without implicit numeric conversion`, function () {
      for (const x of [0, 1, -1]) {
        for (const y of [0, 1, -1]) {
          assert.strictEqual(operation(math.fraction(x), math.fraction(y)), expected(!!x, !!y))
        }
      }
    })

    it(`should ${name} fractions with other scalar types`, function () {
      const others = [0, 2, false, true, 0n, 2n, math.bignumber(0), math.bignumber(2)]
      for (const x of [0, 1]) {
        for (const y of others) {
          const result = expected(!!x, !math.not(y))
          assert.strictEqual(operation(math.fraction(x), y), result)
          assert.strictEqual(operation(y, math.fraction(x)), result)
        }
      }
    })

    it(`should ${name} fractions below floating point range`, function () {
      const tiny = math.fraction(1n, 10n ** 400n)
      assert.strictEqual(operation(tiny, math.fraction(0)), expected(true, false))
      assert.strictEqual(operation(tiny, true), expected(true, true))
      assert.strictEqual(operation(true, tiny), expected(true, true))
      assert.strictEqual(operation(tiny, math.bignumber('1e-400')), expected(true, true))
      assert.strictEqual(operation(math.bignumber('1e-400'), tiny), expected(true, true))
    })

    it(`should ${name} units with scalars in either order`, function () {
      const others = [0, 2, false, true, 0n, 2n, math.bignumber(0), math.bignumber(2), math.fraction(0), math.fraction(2), math.complex(0), math.complex(0, 2)]
      for (const x of [0, 1]) {
        for (const y of others) {
          const result = expected(!!x, !math.not(y))
          assert.strictEqual(operation(math.unit(x, 'm'), y), result)
          assert.strictEqual(operation(y, math.unit(x, 'm')), result)
        }
      }
      assert.strictEqual(operation(math.unit('m'), 0), false)
      assert.strictEqual(operation(math.unit(math.fraction(1), 'm'), math.unit(math.fraction(0), 'm')), expected(true, false))
    })

    it(`should ${name} stored unit values instead of their object truthiness`, function () {
      for (const makeValue of [math.bignumber, math.complex]) {
        for (const x of [0, 1]) {
          assert.strictEqual(operation(math.unit(makeValue(x), 'm'), 1), expected(!!x, true))
          assert.strictEqual(operation(1, math.unit(makeValue(x), 'm')), expected(true, !!x))
        }
      }
    })

    it(`should ${name} all unit magnitudes with booleans and complex scalars`, function () {
      const magnitudes = [math.bignumber(0), math.bignumber(1), math.complex(0), math.complex(0, 1), math.fraction(0), math.fraction(1n, 10n ** 400n)]
      for (const magnitude of magnitudes) {
        const x = math.unit(magnitude, 'm')
        for (const y of [false, true, math.complex(0), math.complex(1)]) {
          const result = expected(!math.not(magnitude), !math.not(y))
          assert.strictEqual(operation(x, y), result)
          assert.strictEqual(operation(y, x), result)
        }
      }
    })

    it(`should ${name} new unit mixtures without changing unit pair promotion`, function () {
      const x = math.unit(math.bignumber(NaN), 'm')
      const y = math.complex(1)
      assert.strictEqual(operation(x, y), expected(false, true))
      assert.strictEqual(operation(y, x), expected(true, false))
      assert.strictEqual(operation(x, math.unit(y, 'm')), expected(true, true))
      assert.strictEqual(operation(math.unit(y, 'm'), x), expected(true, true))
    })

    it(`should preserve ${name} implicit boolean and bigint conversions`, function () {
      for (const x of [false, true, 0n, 1n]) {
        for (const y of [1e-100, NaN, Infinity, '', ' 0 ', '1e-100']) {
          if (typeof x === 'bigint' && y === '1e-100') {
            assert.throws(() => operation(x, y), /Cannot convert "1e-100" to BigInt/)
            assert.throws(() => operation(y, x), /Cannot convert "1e-100" to BigInt/)
            continue
          }
          const result = expected(!!x, !!Number(y))
          assert.strictEqual(operation(x, y), result)
          assert.strictEqual(operation(y, x), result)
        }
      }
    })

    it(`should preserve ${name} BigNumber NaN semantics`, function () {
      const nan = math.bignumber(NaN)
      assert.strictEqual(operation(nan, true), expected(false, true))
      assert.strictEqual(operation(true, nan), expected(true, false))
      assert.strictEqual(operation(nan, math.fraction(1)), expected(false, true))
      assert.strictEqual(operation(math.fraction(1), nan), expected(true, false))
      // Existing mixed Complex operations convert BigNumber to Complex.
      assert.strictEqual(operation(nan, math.complex(1)), expected(true, true))
      assert.strictEqual(operation(math.complex(1), nan), expected(true, true))
    })

    it(`should ${name} fraction arrays using existing collection dispatch`, function () {
      assert.deepStrictEqual(operation([math.fraction(0), math.fraction(1)], [math.fraction(1), math.fraction(1)]), [expected(false, true), expected(true, true)])
    })
  }

  it('should negate fractions and units with fraction values', function () {
    assert.strictEqual(math.not(math.fraction(0)), true)
    assert.strictEqual(math.not(math.fraction(1, 3)), false)
    assert.strictEqual(math.not(math.fraction(-1, 3)), false)
    assert.strictEqual(math.not(math.fraction(1n, 10n ** 400n)), false)
    assert.strictEqual(math.not(math.unit(math.fraction(0), 'm')), true)
    assert.strictEqual(math.not(math.unit(math.fraction(1), 'm')), false)
  })

  for (const name of ['and', 'or']) {
    it(`should evaluate ${name} expressions with complex, fraction and unit values`, function () {
      for (const makeValue of [math.complex, math.fraction, x => math.unit(x, 'm')]) {
        for (const x of [0, 1]) {
          for (const y of [0, 1]) {
            const scope = { x: makeValue(x), y: makeValue(y) }
            assert.strictEqual(math.evaluate(`${name}(x, y)`, scope), math[name](scope.x, scope.y))
            assert.strictEqual(math.evaluate(`x ${name} y`, scope), math[name](scope.x, scope.y))
          }
        }
      }
    })

    it(`should preserve ${name} expression short circuiting`, function () {
      const fail = () => { throw new Error('right hand side evaluated') }
      for (const makeValue of [math.complex, math.fraction, x => math.unit(x, 'm')]) {
        const x = makeValue(name === 'and' ? 0 : 1)
        assert.strictEqual(math.evaluate(`${name}(x, fail())`, { x, fail }), name === 'or')
      }
      const x = name === 'and' ? math.bignumber(NaN) : math.bignumber(1)
      assert.strictEqual(math.evaluate(`${name}(x, fail())`, { x, fail }), name === 'or')
    })

    it(`should preserve ${name} expression invalid input errors`, function () {
      for (const x of [null, undefined, {}, new Date(0)]) {
        assert.throws(() => math.evaluate(`${name}(x, true)`, { x }), TypeError)
      }
    })
  }
})
