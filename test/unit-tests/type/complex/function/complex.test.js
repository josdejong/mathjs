import assert from 'assert'
import math from '../../../../../src/defaultInstance.js'
const complex = math.complex

describe('complex', function () {
  it('should return 0 + 0i if called with no argument', function () {
    assert.deepStrictEqual(complex(), new math.Complex(0, 0))
    assert.ok(complex() instanceof math.Complex)
  })

  it('should parse a valid string and create the complex number accordingly', function () {
    assert.deepStrictEqual(complex('2+3i'), new math.Complex(2, 3))
    assert.deepStrictEqual(complex('2-3i'), new math.Complex(2, -3))
    assert.ok(complex('2+3i') instanceof math.Complex)
  })

  it('should convert a real number into a complex value', function () {
    assert.deepStrictEqual(complex(123), new math.Complex(123, 0))
  })

  it('should convert a fraction into a complex value', function () {
    assert.deepStrictEqual(complex(math.fraction(123)), new math.Complex(123, 0))
  })

  it('should convert null into a complex value', function () {
    assert.deepStrictEqual(complex(null), new math.Complex(0, 0))
  })

  it('should convert a big number into a complex value (downgrades to number', function () {
    assert.deepStrictEqual(complex(math.bignumber(123)), new math.Complex(123, 0))
    assert.deepStrictEqual(complex(math.bignumber(2), math.bignumber(3)), new math.Complex(2, 3))
  })

  it('should clone a complex value', function () {
    const b = complex(complex(2, 3))
    assert.deepStrictEqual(b, new math.Complex(2, 3))
  })

  it('should convert the elements of a matrix or array to complex values', function () {
    const result = [
      new math.Complex(2, 0),
      new math.Complex(1, 0),
      new math.Complex(2, 3)
    ]
    assert.deepStrictEqual(complex(math.matrix([2, 1, complex(2, 3)])), math.matrix(result))
    assert.deepStrictEqual(complex([2, 1, complex(2, 3)]), result)
  })

  it('should accept polar coordinates as input', function () {
    assert.deepStrictEqual(complex({ r: 1, phi: 1 }), math.Complex.fromPolar(1, 1))
    assert.deepStrictEqual(complex({ abs: 1, arg: 1 }), math.Complex.fromPolar(1, 1))
  })

  it('should accept an object with im and re as keys', function () {
    assert.deepStrictEqual(complex({ re: 1, im: 2 }), new math.Complex(1, 2))
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { complex('no valid complex number') }, SyntaxError)
  })

  it('should create a complex value from a boolean', function () {
    assert.deepStrictEqual(complex(true), new math.Complex(1, 0))
  })

  it('should throw an error if called with a unit', function () {
    assert.throws(function () { complex(math.unit('5cm')) }, /TypeError: Unexpected type of argument in function complex/)
  })

  it('should accept two numbers as arguments', function () {
    assert.deepStrictEqual(complex(2, 3), new math.Complex(2, 3))
    assert.deepStrictEqual(complex(2, -3), new math.Complex(2, -3))
    assert.deepStrictEqual(complex(-2, 3), new math.Complex(-2, 3))
    assert.ok(complex(2, 3) instanceof math.Complex)
  })

  it('should throw an error if passed two argument, one is invalid', function () {
    assert.throws(function () { complex(new Date(), 2) }, TypeError)
    assert.throws(function () { complex(2, new Date()) }, TypeError)
  })

  it('should throw an error if called with more than 2 arguments', function () {
    assert.throws(function () { complex(2, 3, 4) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX complex', function () {
    const expr1 = math.parse('complex()')
    const expr2 = math.parse('complex(1)')
    const expr3 = math.parse('complex(1,2)')

    assert.strictEqual(expr1.toTex(), '0')
    assert.strictEqual(expr2.toTex(), '\\left(1\\right)')
    assert.strictEqual(expr3.toTex(), '\\left(\\left(1\\right)+i\\cdot\\left(2\\right)\\right)')
  })
})
