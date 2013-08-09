// test xgcd
var assert = require('assert');
var math = require('../../../src/index.js');

describe('xgcd', function() {

  it('should be parsed correctly', function() {
    // parser
    assert.deepEqual([1247, -7, 12], math.eval('xgcd(36163, 21199)'));
  });

  it('should return extended greatest common divisor of two numbers', function() {
    // xgcd(36163, 21199) = 1247 => -7(36163) + 12(21199) = 1247
    assert.deepEqual([1247, -7, 12], math.xgcd(36163, 21199));
    // xgcd(120, 23) = 1 => -9(120) + 47(23) = 1
    assert.deepEqual([1, -9, 47], math.xgcd(120, 23));
    // some unit tests from: https://github.com/sjkaliski/numbers.js/blob/master/test/basic.test.js
    assert.deepEqual([5, -3, 5], math.xgcd(65, 40));
    assert.deepEqual([5, 5, -3], math.xgcd(40, 65));
    assert.deepEqual([21, -16, 27], math.xgcd(1239, 735));
    assert.deepEqual([21, 5, -2], math.xgcd(105, 252));
    assert.deepEqual([21, -2, 5], math.xgcd(252, 105));
  });

  it('should give same results as gcd', function() {
    assert.equal(math.gcd(1239, 735), math.xgcd(1239, 735)[0]);
    assert.equal(math.gcd(105, 252),  math.xgcd(105, 252)[0]);
    assert.equal(math.gcd(7, 13),     math.xgcd(7, 13)[0]);
  });

  it('should throw an error if used with wrong number of arguments', function() {
    assert.throws(function () {math.xgcd(1)});
    assert.throws(function () {math.xgcd(1, 2, 3)});
  });

  it('should throw an error when used with a complex number', function() {
    assert.throws(function () {math.xgcd(math.complex(1,3),2); }, TypeError, 'Function xgcd(complex, number) not supported');
  });

  it('should throw an error when used with a string', function() {
    assert.throws(function () {math.xgcd('a', 2); }, TypeError, 'Function xgcd(string, number) not supported');
    assert.throws(function () {math.xgcd(2, 'a'); }, TypeError, 'Function xgcd(number, string) not supported');
  });

  it('should throw an error when used with a unit', function() {
    assert.throws(function () { math.xgcd(math.unit('5cm'), 2); }, TypeError, 'Function xgcd(unit, number) not supported');
  });

  it('should throw an error when used with a matrix', function() {
    assert.throws(function () { math.xgcd([5,2,3], [25,3,6]); }, TypeError, 'Function xgcd(array, array) not supported');
  });


});