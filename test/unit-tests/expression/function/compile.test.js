// test compile
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

describe('compile', function () {
  it('should compile an expression', function () {
    const code = math.compile('(5+3)/4')
    assert.ok(code instanceof Object)
    assert.ok(code.evaluate instanceof Function)
    assert.strictEqual(code.evaluate(), 2)
  })

  it('should parse multiple expressions', function () {
    const codes = math.compile(['2+3', '4+5'])
    assert.ok(Array.isArray(codes))
    assert.strictEqual(codes.length, 2)

    assert.strictEqual(codes[0].evaluate(), 5)
    assert.strictEqual(codes[1].evaluate(), 9)
  })

  it('should throw an error on wrong number of arguments', function () {
    assert.throws(function () { math.compile() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.compile('2+3', '3+4') }, /TypeError: Too many arguments/)
  })

  it('should throw an error on wrong type of argument', function () {
    assert.throws(function () { math.compile(math.complex(2, 3)) }, TypeError)
  })

  it('should LaTeX compile', function () {
    const expression = math.parse('compile(1)')
    assert.strictEqual(expression.toTex(), '\\mathrm{compile}\\left(1\\right)')
  })
})
