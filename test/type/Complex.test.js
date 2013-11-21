// test data type Complex

var assert = require('assert'),
    math = require('../../index')();

describe('Complex', function () {

  assertComplex = function(complex, re, im) {
    assert.equal(complex.re, re);
    assert.equal(complex.im, im);
  };

  describe('constructor', function() {

    it('should create a complex number correctly', function () {
      var complex1 = math.complex(3, -4);
      assertComplex(complex1, 3, -4);
      assertComplex(complex1, 3, -4);
      assertComplex(math.complex(2), 2, 0);
    });

    it('should throw an error if called with wrong arguments', function() {
      assert.throws(function () { math.complex(3, -4, 5); });
      assert.throws(function () { math.complex(1, 2, 3); });
      assert.throws(function () { math.complex(1, true); });
    });

  });

  describe('toString', function() {

    it('should render to <re> +/- <im>i', function() {
      assert.equal(math.complex(3, -4).toString(), '3 - 4i');
      assert.equal(math.complex().toString(), '0');
      assert.equal(math.complex(2, 3).toString(), '2 + 3i');
      assert.equal(math.complex(2, 0).toString(), '2');
      assert.equal(math.complex(0, 3).toString(), '3i');
      assert.equal(math.complex().toString(),      '0');
      assert.equal(math.complex(0, 2).toString(),  '2i');
      assert.equal(math.complex(1, 1).toString(),  '1 + i');
      assert.equal(math.complex(1, 2).toString(),  '1 + 2i');
      assert.equal(math.complex(1, -1).toString(), '1 - i');
      assert.equal(math.complex(1, -2).toString(), '1 - 2i');
      assert.equal(math.complex(1, 0).toString(),  '1');
      assert.equal(math.complex(-1, 2).toString(), '-1 + 2i');
      assert.equal(math.complex(-1, 1).toString(), '-1 + i');
    });

    it('should not round off digits', function() {
      assert.equal(math.complex(1/3, 1/3).toString(), '0.3333333333333333 + 0.3333333333333333i');

    });
  });

  describe('format', function() {

    it(' should render to <re> +/- <im>i with custom precision', function() {
      assert.equal(math.complex(1/3, 1/3).format(3), '0.333 + 0.333i');
      assert.equal(math.complex(1/3, 1/3).format(4), '0.3333 + 0.3333i');
      assert.equal(math.complex(1/3, 1/3).format(), '0.3333333333333333 + 0.3333333333333333i');
    });

  });

  describe('parse', function() {

    it('should parse rightly', function () {
      assertComplex(math.complex('2 + 3i'), 2, 3);
      assertComplex(math.complex('2 +3i'), 2, 3);
      assertComplex(math.complex('2+3i'), 2, 3);
      assertComplex(math.complex(' 2+3i '), 2, 3);

      assertComplex(math.complex('2-3i'), 2, -3);
      assertComplex(math.complex('2 + i'), 2, 1);
      assertComplex(math.complex('-2-3i'), -2, - 3);
      assertComplex(math.complex('-2+3i'), -2, 3);
      assertComplex(math.complex('-2+-3i'), -2, -3);
      assertComplex(math.complex('-2-+3i'), -2, -3);
      assertComplex(math.complex('+2-+3i'), 2, -3);
      assertComplex(math.complex('+2-+3i'), 2, -3);
      assertComplex(math.complex('2 + 3i'), 2, 3);
      assertComplex(math.complex('2 - -3i'), 2, 3);
      assertComplex(math.complex(' 2 + 3i '), 2, 3);
      assertComplex(math.complex('2 + i'), 2, 1);
      assertComplex(math.complex('2 - i'), 2, -1);
      assertComplex(math.complex('2 + -i'), 2, -1);
      assertComplex(math.complex('-2+3e-1i'), -2, 0.3);
      assertComplex(math.complex('-2+3e+1i'), -2, 30);
      assertComplex(math.complex('2+3e2i'), 2, 300);
      assertComplex(math.complex('2.2e-1-3.2e-1i'), 0.22, -0.32);
      assertComplex(math.complex('2.2e-1-+3.2e-1i'), 0.22, -0.32);
      assertComplex(math.complex('2'), 2, 0);
      assertComplex(math.complex('i'), 0, 1);
      assertComplex(math.complex(' i '), 0, 1);
      assertComplex(math.complex('-i'), 0, -1);
      assertComplex(math.complex(' -i '), 0, -1);
      assertComplex(math.complex('+i'), 0, 1);
      assertComplex(math.complex(' +i '), 0, 1);
      assertComplex(math.complex('-2'), -2, 0);
      assertComplex(math.complex('3I'), 0, 3);
      assertComplex(math.complex('-3i'), 0, -3);
    });

    it('should throw an error if called with an invalid string', function() {
      assert.throws(function () { math.complex('str', 2); });
      assert.throws(function () { math.complex(''); });
      assert.throws(function () { math.complex('2r'); });
      assert.throws(function () { math.complex('str'); });
      assert.throws(function () { math.complex('2i+3i'); });
      assert.throws(function () { math.complex('2ia'); });
      assert.throws(function () { math.complex('3+4'); });
      assert.throws(function () { math.complex('3i+4'); });
      assert.throws(function () { math.complex('3e + 4i'); });
      assert.throws(function () { math.complex('3e1.2 + 4i'); });
      assert.throws(function () { math.complex('3e1.2i'); });
      assert.throws(function () { math.complex('3e1.2i'); });
      assert.throws(function () { math.complex('- i'); });
      assert.throws(function () { math.complex('+ i'); });
    });

  });

  describe('clone', function() {

    it('should clone the complex properly', function () {
      var complex1 = math.complex(3, -4);
      var clone = complex1.clone();
      clone.re = 100;
      clone.im = 200;
      assert.notEqual(complex1, clone);
      assert.equal(complex1.re, 3);
      assert.equal(complex1.im, -4);
      assert.equal(clone.re, 100);
      assert.equal(clone.im, 200);
    });

  });

});