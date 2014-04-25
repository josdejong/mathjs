// test exp
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index')(),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    range = math.range,
    epow = math.epow;

describe('epow', function() {

  it('should elevate a number to the given power', function() {
    approx.deepEqual(epow(2,3), 8);
    approx.deepEqual(epow(2,4), 16);
    approx.deepEqual(epow(-2,2), 4);
    approx.deepEqual(epow(3,3), 27);
    approx.deepEqual(epow(3,-2), 0.111111111111111);
    approx.deepEqual(epow(-3,-2), 0.111111111111111);
    approx.deepEqual(epow(3,-3), 0.0370370370370370);
    approx.deepEqual(epow(-3,-3), -0.0370370370370370);
    approx.deepEqual(epow(2,1.5), 2.82842712474619);
    approx.deepEqual(epow(-2,1.5), complex(0, -2.82842712474619));
  });

  it('should elevate booleans to the given power', function() {
    assert.equal(epow(true, true), 1);
    assert.equal(epow(true, false), 1);
    assert.equal(epow(false, true), 0);
    assert.equal(epow(false, false), 1);
  });

  it('should add mixed numbers and booleans', function() {
    assert.equal(epow(2, true), 2);
    assert.equal(epow(2, false), 1);
    assert.equal(epow(true, 2), 1);
    assert.equal(epow(false, 2), 0);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {epow(1)}, error.ArgumentsError);
    assert.throws(function () {epow(1, 2, 3)}, error.ArgumentsError);
  });

  it('should elevate a complex number to the given power', function() {
    approx.deepEqual(epow(complex(-1,-1),complex(-1,-1)), complex('-0.0284750589322119 +  0.0606697332231795i'));
    approx.deepEqual(epow(complex(-1,-1),complex(-1,1)), complex('-6.7536199239765713 +  3.1697803027015614i'));
    approx.deepEqual(epow(complex(-1,-1),complex(0,-1)), complex('0.0891447921553914 - 0.0321946742909677i'));
    approx.deepEqual(epow(complex(-1,-1),complex(0,1)), complex('9.92340022667813 + 3.58383962127501i'));
    approx.deepEqual(epow(complex(-1,-1),complex(1,-1)), complex('-0.1213394664463591 -  0.0569501178644237i'));
    approx.deepEqual(epow(complex(-1,-1),complex(1,1)), complex('-6.3395606054031211 - 13.5072398479531426i'));
    approx.deepEqual(epow(complex(-1,1),complex(-1,-1)), complex('-6.7536199239765713 -  3.1697803027015614i'));
    approx.deepEqual(epow(complex(-1,1),complex(-1,1)), complex('-0.0284750589322119 -  0.0606697332231795i'));
    approx.deepEqual(epow(complex(-1,1),complex(0,-1)), complex('9.92340022667813 - 3.58383962127501i'));
    approx.deepEqual(epow(complex(-1,1),complex(0,1)), complex('0.0891447921553914 + 0.0321946742909677i'));
    approx.deepEqual(epow(complex(-1,1),complex(1,-1)), complex('-6.3395606054031211 + 13.5072398479531426i'));
    approx.deepEqual(epow(complex(-1,1),complex(1,1)), complex('-0.1213394664463591 +  0.0569501178644237i'));

    approx.deepEqual(epow(complex(0,-1),complex(-1,-1)), complex('0.000000000000000 + 0.207879576350762i'));
    approx.deepEqual(epow(complex(0,-1),complex(-1,1)), complex('0.000000000000000 + 4.810477380965351i'));
    approx.deepEqual(epow(complex(0,-1),complex(1,-1)), complex('0.000000000000000 - 0.207879576350762i'));
    approx.deepEqual(epow(complex(0,-1),complex(1,1)), complex('0.000000000000000 - 4.810477380965351i'));
    approx.deepEqual(epow(complex(0,1),complex(-1,-1)), complex('0.000000000000000 - 4.810477380965351i'));
    approx.deepEqual(epow(complex(0,1),complex(-1,1)), complex('0.000000000000000 - 0.207879576350762i'));
    approx.deepEqual(epow(complex(0,1),complex(1,-1)), complex('0.000000000000000 + 4.810477380965351i'));
    approx.deepEqual(epow(complex(0,1),complex(1,1)), complex('0.000000000000000 + 0.207879576350762i'));

    approx.deepEqual(epow(complex(1,-1),complex(-1,-1)), complex('0.2918503793793073 +  0.1369786269150605i'));
    approx.deepEqual(epow(complex(1,-1),complex(-1,1)), complex('0.6589325864505904 +  1.4039396486303144i'));
    approx.deepEqual(epow(complex(1,-1),complex(0,-1)), complex('0.428829006294368 - 0.154871752464247i'));
    approx.deepEqual(epow(complex(1,-1),complex(0,1)), complex('2.062872235080905 + 0.745007062179724i'));
    approx.deepEqual(epow(complex(1,-1),complex(1,-1)), complex('0.2739572538301211 -  0.5837007587586147i'));
    approx.deepEqual(epow(complex(1,-1),complex(1,1)), complex('2.8078792972606288 -  1.3178651729011805i'));
    approx.deepEqual(epow(complex(1,1),complex(-1,-1)), complex('0.6589325864505904 -  1.4039396486303144i'));
    approx.deepEqual(epow(complex(1,1),complex(-1,1)), complex('0.2918503793793073 -  0.1369786269150605i'));
    approx.deepEqual(epow(complex(1,1),complex(0,-1)), complex('2.062872235080905 - 0.745007062179724i'));
    approx.deepEqual(epow(complex(1,1),complex(0,1)), complex('0.428829006294368 + 0.154871752464247i'));
    approx.deepEqual(epow(complex(1,1),complex(1,-1)), complex('2.8078792972606288 +  1.3178651729011805i'));
    approx.deepEqual(epow(complex(1,1),complex(1,1)), complex('0.2739572538301211 +  0.5837007587586147i'));
  });

  it('should throw an error with units', function() {
    assert.throws(function () {epow(unit('5cm'))});
  });

  it('should throw an error with strings', function() {
    assert.throws(function () {epow('text')});
  });

  it('should elevate each element in a matrix to the given power', function() {
    var a = [[1,2],[3,4]];
    var res = [[1,4],[9,16]];
    approx.deepEqual(epow(a, 2), res);
    approx.deepEqual(epow(a, 2.5), [[1,5.65685424949238], [15.58845726811990, 32]]);
    approx.deepEqual(epow(3, [2,3]), [9,27]);
    approx.deepEqual(epow(matrix(a), 2), matrix(res));
    approx.deepEqual(epow([[1,2,3],[4,5,6]],2), [[1,4,9],[16,25,36]]);
  });

});