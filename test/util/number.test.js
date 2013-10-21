// test number utils
var assert = require('assert'),
    approx = require('../../tools/approx'),
    number = require('../../lib/util/number');

describe('number', function() {

  it('isInteger', function() {
    assert.equal(number.isInteger(1), true);
    assert.equal(number.isInteger(3), true);
    assert.equal(number.isInteger(-4), true);
    assert.equal(number.isInteger(0), true);
    assert.equal(number.isInteger(12000), true);
    assert.equal(number.isInteger(-3000), true);

    assert.equal(number.isInteger(1.1), false);
    assert.equal(number.isInteger(0.1), false);
    assert.equal(number.isInteger(-2.3), false);
    assert.equal(number.isInteger(-2.3), false);
  });

  it('isNumber', function() {
    assert.equal(number.isNumber(1), true);
    assert.equal(number.isNumber(2e3), true);
    assert.equal(number.isNumber(new Number(23)), true);
    assert.equal(number.isNumber(Number(2.3)), true);
    assert.equal(number.isNumber(-23), true);
    assert.equal(number.isNumber(parseFloat('123')), true);

    assert.equal(number.isNumber('23'), false);
    assert.equal(number.isNumber('str'), false);
    assert.equal(number.isNumber(new Date()), false);
    assert.equal(number.isNumber({}), false);
    assert.equal(number.isNumber([]), false);
    assert.equal(number.isNumber(/regexp/), false);
    assert.equal(number.isNumber(true), false);
    assert.equal(number.isNumber(false), false);
    assert.equal(number.isNumber(null), false);
    assert.equal(number.isNumber(undefined), false);
    assert.equal(number.isNumber(), false);
  });

  it('isNumBool', function() {
    assert.equal(number.isNumBool(1), true);
    assert.equal(number.isNumBool(2e3), true);
    assert.equal(number.isNumBool(new Number(23)), true);
    assert.equal(number.isNumBool(Number(2.3)), true);
    assert.equal(number.isNumBool(-23), true);
    assert.equal(number.isNumBool(parseFloat('123')), true);
    assert.equal(number.isNumBool(true), true);
    assert.equal(number.isNumBool(false), true);

    assert.equal(number.isNumBool('23'), false);
    assert.equal(number.isNumBool('str'), false);
    assert.equal(number.isNumBool(new Date()), false);
    assert.equal(number.isNumBool({}), false);
    assert.equal(number.isNumBool([]), false);
    assert.equal(number.isNumBool(/regexp/), false);
    assert.equal(number.isNumBool(null), false);
    assert.equal(number.isNumBool(undefined), false);
    assert.equal(number.isNumBool(), false);
  });

  it('sign', function() {
    assert.equal(number.sign(1), 1);
    assert.equal(number.sign(3), 1);
    assert.equal(number.sign(4.5), 1);
    assert.equal(number.sign(0.00234), 1);

    assert.equal(number.sign(0), 0);

    assert.equal(number.sign(-1), -1);
    assert.equal(number.sign(-3), -1);
    assert.equal(number.sign(-0.23), -1);
  });

  it('toPrecision', function() {
    assert.equal(number.toPrecision(1/3), '0.3333333333333333');
    assert.equal(number.toPrecision(1/3, 5), '0.33333');
    assert.equal(number.toPrecision(1/3, 3), '0.333');
    assert.equal(number.toPrecision(2/3, 3), '0.667');
    assert.equal(number.toPrecision(123456), '123456');
    assert.equal(number.toPrecision(123456, 9), '123456');
    assert.equal(number.toPrecision(123456, 3), '123000');
    assert.equal(number.toPrecision(123456, 5), '123460');
  });

  describe('format', function () {

    it('should format numbers', function() {
      assert.equal(number.format(2/7), '0.2857142857142857');
      assert.equal(number.format(0.10400), '0.104');
      assert.equal(number.format(1000), '1000');
      assert.equal(number.format(2.4e-7), '2.4e-7');
      assert.equal(number.format(2.4e-6), '2.4e-6');
      assert.equal(number.format(2.4e-5), '2.4e-5');
      assert.equal(number.format(2.4e-4), '2.4e-4');
      assert.equal(number.format(2.3e-3), '0.0023');
      assert.equal(number.format(2.3e-2), '0.023');
      assert.equal(number.format(2.3e-1), '0.23');
      assert.equal(number.format(2.3), '2.3');
      assert.equal(number.format(2.3e1), '23');
      assert.equal(number.format(2.3e2), '230');
      assert.equal(number.format(2.3e3), '2300');
      assert.equal(number.format(2.3e4), '23000');
      assert.equal(number.format(2.3e5), '2.3e5');
      assert.equal(number.format(2.3e6), '2.3e6');
    });

    it('should format numbers with given precision', function() {
      assert.equal(number.format(1/3), '0.3333333333333333');
      assert.equal(number.format(1/3, 3), '0.333');
      assert.equal(number.format(1/3, 4), '0.3333');
      assert.equal(number.format(1/3, 5), '0.33333');

      assert.equal(number.format(1000.000, 5), '1000');
      assert.equal(number.format(1000.0010, 5), '1000'); // rounded off at 5 digits
      assert.equal(number.format(1234, 3), '1230');
      assert.equal(number.format(0.001234, 3), '0.00123');
    });
    
  });

});
