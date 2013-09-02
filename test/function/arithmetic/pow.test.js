// test exp
var assert = require('assert'),
    approx = require('../../../tools/approx.js'),
    math = require('../../../index.js'),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    range = math.range,
    pow = math.pow;

describe('pow', function() {

  it('should elevate a number to the given power', function() {
    approx.deepEqual(pow(2,3), 8);
    approx.deepEqual(pow(2,4), 16);
    approx.deepEqual(pow(-2,2), 4);
    approx.deepEqual(pow(3,3), 27);
    approx.deepEqual(pow(3,-2), 0.111111111111111);
    approx.deepEqual(pow(-3,-2), 0.111111111111111);
    approx.deepEqual(pow(3,-3), 0.0370370370370370);
    approx.deepEqual(pow(-3,-3), -0.0370370370370370);
    approx.deepEqual(pow(2,1.5), 2.82842712474619);
    approx.deepEqual(pow(-2,1.5), complex(0, -2.82842712474619));
  });

  it('should elevate booleans to the given power', function() {
    assert.equal(pow(true, true), 1);
    assert.equal(pow(true, false), 1);
    assert.equal(pow(false, true), 0);
    assert.equal(pow(false, false), 1);
  });

  it('should add mixed numbers and booleans', function() {
    assert.equal(pow(2, true), 2);
    assert.equal(pow(2, false), 1);
    assert.equal(pow(true, 2), 1);
    assert.equal(pow(false, 2), 0);
  });

  it('should throw an error if used with wrong number of arguments', function() {
    assert.throws(function () {pow(1)}, SyntaxError, 'Wrong number of arguments in function pow (1 provided, 2 expected)');
    assert.throws(function () {pow(1, 2, 3)}, SyntaxError, 'Wrong number of arguments in function pow (3 provided, 2 expected)');
  });

  it('should elevate a complex number to the given power', function() {
    approx.deepEqual(pow(complex(3, 0), 2), 9);
    approx.deepEqual(pow(complex(0, 2), 2), complex(-4, 0));

    approx.deepEqual(pow(complex(-1,-1),complex(-1,-1)), complex('-0.0284750589322119 +  0.0606697332231795i'));
    approx.deepEqual(pow(complex(-1,-1),complex(-1,1)), complex('-6.7536199239765713 +  3.1697803027015614i'));
    approx.deepEqual(pow(complex(-1,-1),complex(0,-1)), complex('0.0891447921553914 - 0.0321946742909677i'));
    approx.deepEqual(pow(complex(-1,-1),complex(0,1)), complex('9.92340022667813 + 3.58383962127501i'));
    approx.deepEqual(pow(complex(-1,-1),complex(1,-1)), complex('-0.1213394664463591 -  0.0569501178644237i'));
    approx.deepEqual(pow(complex(-1,-1),complex(1,1)), complex('-6.3395606054031211 - 13.5072398479531426i'));
    approx.deepEqual(pow(complex(-1,1),complex(-1,-1)), complex('-6.7536199239765713 -  3.1697803027015614i'));
    approx.deepEqual(pow(complex(-1,1),complex(-1,1)), complex('-0.0284750589322119 -  0.0606697332231795i'));
    approx.deepEqual(pow(complex(-1,1),complex(0,-1)), complex('9.92340022667813 - 3.58383962127501i'));
    approx.deepEqual(pow(complex(-1,1),complex(0,1)), complex('0.0891447921553914 + 0.0321946742909677i'));
    approx.deepEqual(pow(complex(-1,1),complex(1,-1)), complex('-6.3395606054031211 + 13.5072398479531426i'));
    approx.deepEqual(pow(complex(-1,1),complex(1,1)), complex('-0.1213394664463591 +  0.0569501178644237i'));

    approx.deepEqual(pow(complex(0,-1),complex(-1,-1)), complex('0.000000000000000 + 0.207879576350762i'));
    approx.deepEqual(pow(complex(0,-1),complex(-1,1)), complex('0.000000000000000 + 4.810477380965351i'));
    approx.deepEqual(pow(complex(0,-1),complex(1,-1)), complex('0.000000000000000 - 0.207879576350762i'));
    approx.deepEqual(pow(complex(0,-1),complex(1,1)), complex('0.000000000000000 - 4.810477380965351i'));
    approx.deepEqual(pow(complex(0,1),complex(-1,-1)), complex('0.000000000000000 - 4.810477380965351i'));
    approx.deepEqual(pow(complex(0,1),complex(-1,1)), complex('0.000000000000000 - 0.207879576350762i'));
    approx.deepEqual(pow(complex(0,1),complex(1,-1)), complex('0.000000000000000 + 4.810477380965351i'));
    approx.deepEqual(pow(complex(0,1),complex(1,1)), complex('0.000000000000000 + 0.207879576350762i'));

    approx.deepEqual(pow(complex(1,-1),complex(-1,-1)), complex('0.2918503793793073 +  0.1369786269150605i'));
    approx.deepEqual(pow(complex(1,-1),complex(-1,1)), complex('0.6589325864505904 +  1.4039396486303144i'));
    approx.deepEqual(pow(complex(1,-1),complex(0,-1)), complex('0.428829006294368 - 0.154871752464247i'));
    approx.deepEqual(pow(complex(1,-1),complex(0,1)), complex('2.062872235080905 + 0.745007062179724i'));
    approx.deepEqual(pow(complex(1,-1),complex(1,-1)), complex('0.2739572538301211 -  0.5837007587586147i'));
    approx.deepEqual(pow(complex(1,-1),complex(1,1)), complex('2.8078792972606288 -  1.3178651729011805i'));
    approx.deepEqual(pow(complex(1,1),complex(-1,-1)), complex('0.6589325864505904 -  1.4039396486303144i'));
    approx.deepEqual(pow(complex(1,1),complex(-1,1)), complex('0.2918503793793073 -  0.1369786269150605i'));
    approx.deepEqual(pow(complex(1,1),complex(0,-1)), complex('2.062872235080905 - 0.745007062179724i'));
    approx.deepEqual(pow(complex(1,1),complex(0,1)), complex('0.428829006294368 + 0.154871752464247i'));
    approx.deepEqual(pow(complex(1,1),complex(1,-1)), complex('2.8078792972606288 +  1.3178651729011805i'));
    approx.deepEqual(pow(complex(1,1),complex(1,1)), complex('0.2739572538301211 +  0.5837007587586147i'));
  });

  it('should throw an error if used with a unit', function() {
    assert.throws(function () {pow(unit('5cm'))});
  });

  it('should throw an error if used with a string', function() {
    assert.throws(function () {pow('text')});
  });

  it('should raise a square matrix to the power 2', function() {
    var a = [[1,2],[3,4]];
    var res = [[7,10],[15,22]];
    approx.deepEqual(pow(a, 2), res);
    approx.deepEqual(pow(matrix(a), 2), matrix(res));
  });

  it('should throw an error when calculating the power of a non square matrix', function() {
    assert.throws(function () {pow([1,2,3,4],2);});
    assert.throws(function () {pow([[1,2,3],[4,5,6]],2);});
    assert.throws(function () {pow([[1,2,3],[4,5,6]],2);});
  });

  it('should throw an error when raising a matrix to a non-integer power', function() {
    var a = [[1,2],[3,4]];
    assert.throws(function () {pow(a, 2.5);});
    assert.throws(function () {pow(a, [2,3]);});
  });

});