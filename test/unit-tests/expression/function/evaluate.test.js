import assert from 'assert'
import { approxEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
import { createMap } from '../../../../src/utils/map.js'

const Complex = math.Complex
const Unit = math.Unit
const ResultSet = math.ResultSet

describe('evaluate', function () {
  it('should evaluate expressions', function () {
    approxEqual(math.evaluate('(2+3)/4'), 1.25)
    assert.deepStrictEqual(math.evaluate('sqrt(-4)'), new Complex(0, 2))
  })

  it('should evaluate a list of expressions', function () {
    assert.deepStrictEqual(math.evaluate(['1+2', '3+4', '5+6']), [3, 7, 11])
    assert.deepStrictEqual(math.evaluate(['a=3', 'b=4', 'a*b']), [3, 4, 12])
    assert.deepStrictEqual(math.evaluate(math.matrix(['a=3', 'b=4', 'a*b'])), math.matrix([3, 4, 12]))
    assert.deepStrictEqual(math.evaluate(['a=3', 'b=4', 'a*b']), [3, 4, 12])
  })

  it('should evaluate a series of expressions', function () {
    assert.deepStrictEqual(math.evaluate('a=3\nb=4\na*b'), new ResultSet([3, 4, 12]))
    assert.deepStrictEqual(math.evaluate('f(x) = a * x; a=2; f(4)'), new ResultSet([8]))
    assert.deepStrictEqual(math.evaluate('b = 43; b * 4'), new ResultSet([172]))
  })

  it('should throw an error if wrong number of arguments', function () {
    assert.throws(function () { math.evaluate() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.evaluate('', {}, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an error with a unit', function () {
    assert.throws(function () { math.evaluate(new Unit(5, 'cm')) }, /TypeError: Unexpected type of argument/)
  })

  it('should throw an error with a complex number', function () {
    assert.throws(function () { math.evaluate(new Complex(2, 3)) }, /TypeError: Unexpected type of argument/)
  })

  it('should evaluate a boolean', function () {
    // TODO: this is odd. Boolean is turned in to string and then evaluated
    assert.strictEqual(math.evaluate(true), true)
  })

  it('should handle the given scope', function () {
    const scope = {
      a: 3,
      b: 4
    }
    assert.deepStrictEqual(math.evaluate('a*b', scope), 12)
    assert.deepStrictEqual(math.evaluate('c=5', scope), 5)
    assert.deepStrictEqual(math.format(math.evaluate('f(x) = x^a', scope)), 'f(x)')

    assert.deepStrictEqual(Object.keys(scope).length, 4)
    assert.deepStrictEqual(scope.a, 3)
    assert.deepStrictEqual(scope.b, 4)
    assert.deepStrictEqual(scope.c, 5)
    assert.deepStrictEqual(typeof scope.f, 'function')

    assert.strictEqual(scope.f(3), 27)
    scope.a = 2
    assert.strictEqual(scope.f(3), 9)
    scope.hello = function (name) {
      return 'hello, ' + name + '!'
    }
    assert.deepStrictEqual(math.evaluate('hello("jos")', scope), 'hello, jos!')
  })

  it('should handle the given Map scope', function () {
    const scope = createMap({
      a: 3,
      b: 4
    })
    assert.deepStrictEqual(math.evaluate('a*b', scope), 12)
    assert.deepStrictEqual(math.evaluate('c=5', scope), 5)
  })

  it('should LaTeX evaluate', function () {
    const expr1 = math.parse('evaluate(expr)')
    const expr2 = math.parse('evaluate(expr,scope)')

    assert.strictEqual(expr1.toTex(), '\\mathrm{evaluate}\\left( expr\\right)')
    assert.strictEqual(expr2.toTex(), '\\mathrm{evaluate}\\left( expr, scope\\right)')
  })

  describe('nullish coalescing operator', function () {
    it('should handle basic nullish coalescing', function () {
      assert.strictEqual(math.evaluate('null ?? 42'), 42)
      assert.strictEqual(math.evaluate('undefined ?? 42'), 42)
      assert.strictEqual(math.evaluate('0 ?? 42'), 0)
      assert.strictEqual(math.evaluate('nullish(null, 42)'), 42)
      assert.strictEqual(math.evaluate('false ?? 42'), false)
      assert.strictEqual(math.evaluate('"" ?? 42'), '')
      assert(isNaN(math.evaluate('NaN ?? 42'))) // Should return NaN, not 42
    })

    it('should handle nullish coalescing with variables', function () {
      const scope1 = {}
      assert.throws(() => math.evaluate('x ?? 42', scope1), /Undefined symbol x/)
      assert.throws(() => math.evaluate('nullish(x, 42)', scope1), /Undefined symbol x/)

      const scope2 = { x: null }
      assert.strictEqual(math.evaluate('x ?? 42', scope2), 42)
      assert.strictEqual(math.evaluate('nullish(x, 42)', scope2), 42)

      const scope3 = { x: 0 }
      assert.strictEqual(math.evaluate('x ?? 42', scope3), 0)
      assert.strictEqual(math.evaluate('nullish(x, 42)', scope3), 0)

      const scope4 = { x: undefined }
      assert.strictEqual(math.evaluate('x ?? 42', scope4), 42)
      assert.strictEqual(math.evaluate('nullish(x, 42)', scope4), 42)

      const scope5 = { x: 5 }
      assert.strictEqual(math.evaluate('x ?? 42', scope5), 5)
      assert.strictEqual(math.evaluate('nullish(x, 42)', scope5), 5)
    })

    it('should handle chained nullish coalescing', function () {
      assert.strictEqual(math.evaluate('null ?? undefined ?? 42'), 42)
      assert.strictEqual(math.evaluate('nullish(null, undefined ?? 42)'), 42)
      assert.strictEqual(math.evaluate('null ?? 10 ?? 42'), 10)
      assert.strictEqual(math.evaluate('5 ?? null ?? 42'), 5)
      assert.strictEqual(math.evaluate('nullish(5, null ?? 42)'), 5)
      assert.strictEqual(math.evaluate('null ?? null ?? null ?? 99'), 99)
      assert.strictEqual(math.evaluate('nullish(null ?? null, null ?? 99)'), 99)
    })

    it('should handle nullish coalescing with correct precedence', function () {
      // ?? has higher precedence than arithmetic and logical operators
      assert.strictEqual(math.evaluate('1 + null ?? 2'), 3) // 1 + (null ?? 2)
      assert.strictEqual(math.evaluate('2 * null ?? 3'), 6) // 2 * (null ?? 3)

      // ?? has higher precedence than exponentiation
      assert.strictEqual(math.evaluate('2 ^ null ?? 3'), 8) // 2 ^ (null ?? 3)

      assert.strictEqual(math.evaluate('null ?? false or true'), true) // (null ?? false) or true
      assert.strictEqual(math.evaluate('true or null ?? 42'), true) // true or (null ?? 42)
      assert.strictEqual(math.evaluate('false and null ?? 42'), false) // false and (null ?? 42)
      assert.strictEqual(math.evaluate('true xor null ?? 42'), false) // true xor (null ?? 42)

      // Parentheses can override precedence
      assert.throws(() => math.evaluate('(1 + null) ?? 2'), /TypeError: Unexpected type of argument/)
      assert.throws(() => math.evaluate('(2 * null) ?? 3'), /TypeError: Unexpected type of argument/)
      assert.throws(() => math.evaluate('(2 ^ null) ?? 3'), /TypeError: Unexpected type of argument/)
      assert.strictEqual(math.evaluate('2 * (null ?? 3)'), 6)
    })

    it('should handle nullish coalescing with higher precedence than exponentiation', function () {
      // These tests specifically verify that ?? has higher precedence than ^
      assert.strictEqual(math.evaluate('5 ?? 2 ^ 3'), 125) // (5 ?? 2) ^ 3 = 5 ^ 3 = 125
      assert.strictEqual(math.evaluate('5 ?? (2 ^ 3)'), 5)
      assert.strictEqual(math.evaluate('3 ^ null ?? 2 ^ 2'), 81) // 3 ^ (null ?? 2) ^ 2 = 3 ^ 2 ^ 2 = 3 ^ 4 = 81
      assert.strictEqual(math.evaluate('false ?? 3 ^ 2'), 0) // false is not nullish, so (false ?? 3) ^ 2 = false ^ 2 = 0 ^ 2 = 0
    })

    it('should handle nullish coalescing precedence with dot power and left-hand operators', function () {
      // dot power .^ should behave like ^ for scalars and bind lower than ??
      assert.strictEqual(math.evaluate('2 .^ null ?? 3'), 8) // 2 .^ (null ?? 3)
      assert.strictEqual(math.evaluate('5 ?? 2 .^ 3'), 125) // (5 ?? 2) .^ 3

      // left-hand operators like factorial bind tighter than ??
      assert.strictEqual(math.evaluate('5! ?? 2'), 120) // (5!) ?? 2
      assert.strictEqual(math.evaluate('null ?? 3!'), 6) // null ?? (3!)
      assert.strictEqual(math.evaluate('(null ?? 3)!'), 6) // parentheses with left-hand op
    })

    it('should handle nullish coalescing with scope lookup', function () {
      const scope = { a: null, b: 5, c: 0 }
      assert.strictEqual(math.evaluate('a ?? b * 2', scope), 10) // null ?? (5 * 2)
      assert.strictEqual(math.evaluate('c ?? b * 2', scope), 0) // 0 ?? (5 * 2) = 0
      assert.strictEqual(math.evaluate('(a ?? b) * 2', scope), 10) // (null ?? 5) * 2 = 10
      // d is undefined, would throw error without fallback
      assert.throws(() => math.evaluate('d ?? 0', scope), /Undefined symbol d/)
    })

    it('should handle nullish coalescing with strings', function () {
      assert.strictEqual(math.evaluate('null ?? "hello"'), 'hello')
      assert.strictEqual(math.evaluate('"world" ?? "hello"'), 'world')
      assert.strictEqual(math.evaluate('"" ?? "hello"'), '') // empty string is not nullish
    })

    it('should handle nullish coalescing with matrices and arrays as operands', function () {
      // Test arrays as operands
      assert.deepStrictEqual(math.evaluate('null ?? [1, 2, 3]'), math.matrix([1, 2, 3]))
      assert.deepStrictEqual(math.evaluate('[1, 2] ?? [3, 4]'), math.matrix([1, 2])) // Neither 1 nor 2 is nullish
      assert.deepStrictEqual(math.evaluate('undefined ?? [5, 6]'), math.matrix([5, 6]))
      assert.deepStrictEqual(math.evaluate('[null, null] ?? [7, 8]'), math.matrix([7, 8])) // Both null elements are nullish, so use [7, 8]

      // Test matrices as operands
      const matrix1 = math.matrix([1, 2])
      assert.deepStrictEqual(math.evaluate('null ?? matrix([1, 2])'), matrix1)
      assert.deepStrictEqual(math.evaluate('matrix([1, 2]) ?? matrix([3, 4])'), matrix1) // Neither 1 nor 2 is nullish
      assert.deepStrictEqual(math.evaluate('undefined ?? matrix([5, 6])'), math.matrix([5, 6]))

      // Test mixed arrays and matrices
      assert.deepStrictEqual(math.evaluate('null ?? matrix([1, 2])'), matrix1)
      assert.deepStrictEqual(math.evaluate('[1, 2] ?? matrix([3, 4])'), math.matrix([1, 2]))
      assert.deepStrictEqual(math.evaluate('[null, 5] ?? 42'), math.matrix([42, 5]))
      assert.deepStrictEqual(math.evaluate('[null, 5] ?? [1, 2]'), math.matrix([1, 5]))

      // Test arrays/matrices containing expressions
      assert.deepStrictEqual(math.evaluate(['null ?? 1', '2 ?? null', 'null ?? null ?? 3']), [1, 2, 3])
      assert.deepStrictEqual(math.evaluate(math.matrix(['null ?? 1', '2 ?? null'])), math.matrix([1, 2]))

      // Test shape mismatch with empty array
      assert.throws(() => math.evaluate('[] ?? [7, 8]'), /RangeError/)
      assert.throws(() => math.evaluate('[1] ?? [7, 8]'), /RangeError/)
    })

    it('should handle nullish coalescing with function calls', function () {
      const scope = {
        getValue: function () { return null },
        getDefault: function () { return 42 }
      }
      assert.strictEqual(math.evaluate('getValue() ?? getDefault()', scope), 42)

      const scope2 = {
        getValue: function () { return 10 },
        getDefault: function () { return 42 }
      }
      assert.strictEqual(math.evaluate('getValue() ?? getDefault()', scope2), 10)
    })

    it('should handle nullish function with arrays', function () {
      assert.deepStrictEqual(math.evaluate('nullish(null, [1, 2, 3])'), math.matrix([1, 2, 3]))
      assert.deepStrictEqual(math.evaluate('nullish([1, 2], [3, 4])'), math.matrix([1, 2]))
      assert.deepStrictEqual(math.evaluate('nullish([null, 5], 42)'), math.matrix([42, 5]))
      assert.deepStrictEqual(math.evaluate('nullish([null, 5], [1, 2])'), math.matrix([1, 5]))
    })

    it('should handle nullish coalescing with conditional expressions and correct precedence', function () {
      // ?? has higher precedence than conditional (?:), so these test cases show the difference
      assert.strictEqual(math.evaluate('5 ?? null ? 1 : 2'), 1) // (5 ?? null) ? 1 : 2 = 5 ? 1 : 2 = 1
      assert.strictEqual(math.evaluate('null ?? 0 ? 1 : 2'), 2) // (null ?? 0) ? 1 : 2 = 0 ? 1 : 2 = 2
      assert.strictEqual(math.evaluate('undefined ?? true ? 1 : 2'), 1) // (undefined ?? true) ? 1 : 2 = true ? 1 : 2 = 1

      assert.strictEqual(math.evaluate('(5 ?? null) ? 1 : 2'), 1) // Explicit precedence
      assert.strictEqual(math.evaluate('5 ?? (null ? 1 : 2)'), 5) // Different precedence
    })

    it('should short-circuit evaluation of the right-hand side when left is not nullish', function () {
      // RHS throws if evaluated; must not be called
      const scope = {
        boom: function () { throw new Error('RHS evaluated unexpectedly') }
      }
      assert.strictEqual(math.evaluate('5 ?? boom()', scope), 5)
      assert.strictEqual(math.evaluate('0 ?? boom()', scope), 0)
      assert.strictEqual(math.evaluate('false ?? boom()', scope), false)
      assert.strictEqual(math.evaluate('"" ?? boom()', scope), '')
      assert.throws(() => math.evaluate('null ?? boom()', scope))
      assert.throws(() => math.evaluate('undefined ?? boom()', scope))
    })

    it('should evaluate the right-hand side when left is nullish', function () {
      let count = 0
      const scope = {
        inc: function () { count++; return 7 }
      }
      assert.strictEqual(math.evaluate('null ?? inc()', scope), 7)
      assert.strictEqual(count, 1)
      assert.strictEqual(math.evaluate('undefined ?? inc()', scope), 7)
      assert.strictEqual(count, 2)
    })

    it('should not short-circuit for collections (element-wise evaluation requires RHS)', function () {
      // When left is a collection, element-wise nullish requires evaluating RHS
      let called = 0
      const scope = {
        getDefault: function () {
          called++
          return math.matrix([1, 2])
        }
      }
      const res = math.evaluate('matrix([null, 5]) ?? getDefault()', scope)
      assert.deepStrictEqual(res, math.matrix([1, 5]))
      assert.strictEqual(called, 1)
    })
  })
})
