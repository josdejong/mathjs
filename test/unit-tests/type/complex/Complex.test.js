// test data type Complex

import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const Unit = math.Unit
const Complex = math.Complex

describe('Complex', function () {
  function assertComplex (complex, re, im) {
    assert(complex instanceof Complex)
    assert.strictEqual(complex.re, re)
    assert.strictEqual(complex.im, im)
  }

  describe('constructor', function () {
    it('should create a complex number correctly', function () {
      const complex1 = new Complex(3, -4)
      assertComplex(complex1, 3, -4)

      const complex2 = new Complex()
      assertComplex(complex2, 0, 0)
    })

    it('should have a property isComplex', function () {
      const a = new math.Complex(2, 3)
      assert.strictEqual(a.isComplex, true)
    })

    it('should have a property type', function () {
      const a = new math.Complex(2, 3)
      assert.strictEqual(a.type, 'Complex')
    })

    it('should accept an object with im and re as keys', function () {
      assertComplex(new Complex({ re: 1, im: 2 }), 1, 2)
    })
  })

  describe('toString', function () {
    it('stringify a complex number', function () {
      assert.strictEqual(new Complex(3, -4).toString(), '3 - 4i')
      assert.strictEqual(new Complex().toString(), '0')
      assert.strictEqual(new Complex(2, 3).toString(), '2 + 3i')
      assert.strictEqual(new Complex(2, 0).toString(), '2')
      assert.strictEqual(new Complex(0, 3).toString(), '3i')
      assert.strictEqual(new Complex().toString(), '0')
      assert.strictEqual(new Complex(0, 2).toString(), '2i')
      assert.strictEqual(new Complex(0, 1).toString(), 'i')
      assert.strictEqual(new Complex(1, 1).toString(), '1 + i')
      assert.strictEqual(new Complex(1, 2).toString(), '1 + 2i')
      assert.strictEqual(new Complex(1, -1).toString(), '1 - i')
      assert.strictEqual(new Complex(1, -2).toString(), '1 - 2i')
      assert.strictEqual(new Complex(1, 0).toString(), '1')
      assert.strictEqual(new Complex(-1, 2).toString(), '-1 + 2i')
      assert.strictEqual(new Complex(-1, 1).toString(), '-1 + i')
    })

    it('should not round off digits', function () {
      assert.strictEqual(new Complex(1 / 3, 1 / 3).toString(), '0.3333333333333333 + 0.3333333333333333i')
    })
  })

  describe('valueOf', function () {
    it('should return string representation when calling valueOf', function () {
      assert.strictEqual(new Complex(3, -4).valueOf(), '3 - 4i')
      assert.strictEqual(new Complex().valueOf(), '0')
      assert.strictEqual(new Complex(2, 3).valueOf(), '2 + 3i')
    })
  })

  describe('format', function () {
    it('should format a complex number', function () {
      assert.strictEqual(new Complex(2, 3).format(), '2 + 3i')
      assert.strictEqual(new Complex(2, -3).format(), '2 - 3i')
      assert.strictEqual(new Complex(-2, 3).format(), '-2 + 3i')
      assert.strictEqual(new Complex(-2, -3).format(), '-2 - 3i')
      assert.strictEqual(new Complex(2, 1).format(), '2 + i')
      assert.strictEqual(new Complex(2, -1).format(), '2 - i')
      assert.strictEqual(new Complex(2, 0).format(), '2')
      assert.strictEqual(new Complex(0, 2).format(), '2i')
    })

    it('should format a complex number with custom precision', function () {
      assert.strictEqual(new Complex(1 / 3, 1 / 3).format(3), '0.333 + 0.333i')
      assert.strictEqual(new Complex(1 / 3, 1 / 3).format(4), '0.3333 + 0.3333i')
      assert.strictEqual(new Complex(1 / 3, 1 / 3).format(), '0.3333333333333333 + 0.3333333333333333i')
    })

    it('should round im to zero if very small compared to re', function () {
      assert.strictEqual(new Complex(-1, 1.22e-16).format(), '-1 + 1.22e-16i')

      assert.strictEqual(new Complex(-1, 1.22e-16).format(15), '-1')
      assert.strictEqual(new Complex(-1, -1.22e-16).format(15), '-1')
      assert.strictEqual(new Complex(1, -1.22e-16).format(15), '1')
      assert.strictEqual(new Complex(1, 1.22e-16).format(15), '1')

      assert.strictEqual(new Complex(-1, 1e-7).format(5), '-1')
    })

    it('should round re to zero if very small compared to im', function () {
      assert.strictEqual(new Complex(1.22e-16, -1).format(), '1.22e-16 - i')

      assert.strictEqual(new Complex(1.22e-16, -1).format(15), '-i')
      assert.strictEqual(new Complex(-1.22e-16, -1).format(15), '-i')
      assert.strictEqual(new Complex(-1.22e-16, 1).format(15), 'i')
      assert.strictEqual(new Complex(1.22e-16, 1).format(15), 'i')

      assert.strictEqual(new Complex(1e-7, -1).format(5), '-i')
    })
  })

  describe('parse', function () {
    it('should parse rightly', function () {
      assertComplex(Complex('2 + 3i'), 2, 3)
      assertComplex(Complex('2 +3i'), 2, 3)
      assertComplex(Complex('2+3i'), 2, 3)
      assertComplex(Complex(' 2+3i '), 2, 3)

      assertComplex(Complex('2-3i'), 2, -3)
      assertComplex(Complex('2 + i'), 2, 1)
      assertComplex(Complex('-2-3i'), -2, -3)
      assertComplex(Complex('-2+3i'), -2, 3)
      assertComplex(Complex('-2+-3i'), -2, -3)
      assertComplex(Complex('-2-+3i'), -2, -3)
      assertComplex(Complex('+2-+3i'), 2, -3)
      assertComplex(Complex('+2-+3i'), 2, -3)
      assertComplex(Complex('2 + 3i'), 2, 3)
      assertComplex(Complex('2 - -3i'), 2, 3)
      assertComplex(Complex(' 2 + 3i '), 2, 3)
      assertComplex(Complex('2 + i'), 2, 1)
      assertComplex(Complex('2 - i'), 2, -1)
      assertComplex(Complex('2 + -i'), 2, -1)
      assertComplex(Complex('-2+3e-1i'), -2, 0.3)
      assertComplex(Complex('-2+3e+1i'), -2, 30)
      assertComplex(Complex('2+3e2i'), 2, 300)
      assertComplex(Complex('2.2e-1-3.2e-1i'), 0.22, -0.32)
      assertComplex(Complex('2.2e-1-+3.2e-1i'), 0.22, -0.32)
      assertComplex(Complex('2'), 2, 0)
      assertComplex(Complex('i'), 0, 1)
      assertComplex(Complex(' i '), 0, 1)
      assertComplex(Complex('-i'), 0, -1)
      assertComplex(Complex(' -i '), 0, -1)
      assertComplex(Complex('+i'), 0, 1)
      assertComplex(Complex(' +i '), 0, 1)
      assertComplex(Complex('-2'), -2, 0)
      assertComplex(Complex('3I'), 0, 3)
      assertComplex(Complex('-3i'), 0, -3)
      assertComplex(Complex('.2i'), 0, 0.2)
      assertComplex(Complex('.2'), 0.2, 0)
      assertComplex(Complex('2.i'), 0, 2)
      assertComplex(Complex('2.'), 2, 0)
    })

    it('should throw an exception if called with an invalid string', function () {
      assert.throws(function () { Complex('') })
      assert.throws(function () { Complex('2r') })
      assert.throws(function () { Complex('str') })
      assert.throws(function () { Complex('2ia') })
      assert.throws(function () { Complex('3e + 4i') })
      assert.throws(function () { Complex('3 + 4i foo') })
      assert.throws(function () { Complex('3e1.2 + 4i') })
      assert.throws(function () { Complex('3e1.2i') })
      assert.throws(function () { Complex('.') })
      assert.throws(function () { Complex('2 + .i') })
      assert.throws(function () { Complex('4i foo') })
      assert.throws(function () { Complex('i foo') })
    })
  })

  describe('clone', function () {
    it('should clone the complex properly', function () {
      const complex1 = new Complex(3, -4)
      const clone = complex1.clone()
      clone.re = 100
      clone.im = 200
      assert.notStrictEqual(complex1, clone)
      assert.strictEqual(complex1.re, 3)
      assert.strictEqual(complex1.im, -4)
      assert.strictEqual(clone.re, 100)
      assert.strictEqual(clone.im, 200)
    })
  })

  describe('equals', function () {
    it('should test equality of two complex numbers', function () {
      assert.strictEqual(new Complex(2, 4).equals(new Complex(2, 4)), true)
      assert.strictEqual(new Complex(2, 3).equals(new Complex(2, 4)), false)
      assert.strictEqual(new Complex(2, 4).equals(new Complex(1, 4)), false)
      assert.strictEqual(new Complex(2, 4).equals(new Complex(1, 3)), false)
      assert.strictEqual(new Complex(2, 4).equals(new Complex(2, 0)), false)
      assert.strictEqual(new Complex(2, 4).equals(new Complex(0, 4)), false)
      assert.strictEqual(new Complex(0, 0).equals(new Complex()), true)
    })
  })

  describe('fromPolar', function () {
    it('should save polar coordinates input correctly', function () {
      const complex1 = Complex.fromPolar({ r: 0, phi: 4 })
      const complex2 = Complex.fromPolar({ r: 5, phi: 0 })
      const complex3 = Complex.fromPolar({ r: 1, phi: Math.PI })
      const complex4 = Complex.fromPolar({ r: 3, phi: Math.PI / 2 })
      const complex5 = Complex.fromPolar({ r: 3, phi: -Math.PI / 2 })
      assertComplex(complex1, -0, -0)
      assertComplex(complex2, 5, 0)
      assert.strictEqual(complex3.re, -1)
      assert.strictEqual(complex4.im, 3)
      assert.strictEqual(complex5.im, -3)
    })

    it('should have the same value for the different import ways', function () {
      const way1 = Complex.fromPolar(1, 1)
      const way2 = Complex.fromPolar({ r: 1, phi: 1 })
      assert(way1.equals(way2))
    })

    it('should accept angle units for phi properly', function () {
      const fromDeg = Complex.fromPolar(1, new Unit(90, 'deg'))
      const fromRad = Complex.fromPolar(1, new Unit(0, 'rad'))
      const fromGrad = Complex.fromPolar(1, new Unit(100, 'grad'))
      assert.strictEqual(fromDeg.im, 1)
      assert.strictEqual(fromGrad.im, 1)
      assert.strictEqual(fromRad.im, 0)
    })

    it('should only accept an object with r and phi keys for 1 argument', function () {
      assert.throws(function () { Complex({}) }, /Invalid Param/)
      assert.throws(function () { Complex({ r: 1 }) }, /Invalid Param/)
      assert.throws(function () { Complex({ phi: 1 }) }, /Invalid Param/)
      assert.throws(function () { Complex('') }, /Invalid Param/)
    })
  })

  describe('toPolar', function () {
    it('should return polar coordinates properly', function () {
      const polar0 = (new Complex(0, 0)).toPolar()
      const polar1 = (new Complex(3, 4)).toPolar()
      const polar2 = (new Complex(-3, 4)).toPolar()
      const polar3 = (new Complex(3, -4)).toPolar()
      const polar4 = (new Complex(-3, -4)).toPolar()
      const polar5 = (new Complex(0, -1)).toPolar()
      assert.strictEqual(polar0.r, 0)
      assert.strictEqual(polar1.r, 5)
      assert.strictEqual(polar2.r, 5)
      assert.strictEqual(polar3.r, 5)
      assert.strictEqual(polar4.r, 5)
      assert.strictEqual(polar5.r, 1)
      assert.strictEqual(polar0.phi, 0)
      assert.strictEqual(polar1.phi, 0.9272952180016122)
      assert.strictEqual(polar2.phi, 2.214297435588181)
      assert.strictEqual(polar3.phi, -0.9272952180016122)
      assert.strictEqual(polar4.phi, -2.214297435588181)
      assert.strictEqual(polar5.phi, -1.5707963267948966)
    })
  })

  it('toJSON', function () {
    assert.deepStrictEqual(new Complex(2, 4).toJSON(), { mathjs: 'Complex', re: 2, im: 4 })
    assert.deepStrictEqual(new Complex(3, 0).toJSON(), { mathjs: 'Complex', re: 3, im: 0 })
  })

  it('fromJSON', function () {
    const c1 = Complex.fromJSON({ re: 2, im: 4 })
    assert.ok(c1 instanceof Complex)
    assert.strictEqual(c1.re, 2)
    assert.strictEqual(c1.im, 4)

    const c2 = Complex.fromJSON({ re: 3, im: 0 })
    assert.ok(c2 instanceof Complex)
    assert.strictEqual(c2.re, 3)
    assert.strictEqual(c2.im, 0)
  })

  it('compare', function () {
    assert.deepStrictEqual(Complex.compare(new Complex(3, 4), new Complex(2, 4)), 1)
    assert.deepStrictEqual(Complex.compare(new Complex(2, 4), new Complex(2, 4)), 0)
    assert.deepStrictEqual(Complex.compare(new Complex(2, 4), new Complex(2, 7)), -1)
  })
})
