// test bignumber utils
var assert = require('assert');
var approx = require('../../tools/approx');
var BigNumber = require('decimal.js');
var bignumber = require('../../lib/util/bignumber');

describe('bignumber', function() {

  it('should test whether an object is a BigNumber', function() {
    assert.equal(bignumber.isBigNumber(new BigNumber(2.34)), true);

    assert.equal(bignumber.isBigNumber(new Date()), false);
    assert.equal(bignumber.isBigNumber({}), false);
    assert.equal(bignumber.isBigNumber(123), false);
  });

  it('should calculate a bignumber e', function() {
    assert.equal(bignumber.e(32), '2.7182818284590452353602874713527');
    assert.equal(bignumber.e(64), '2.718281828459045235360287471352662497757247093699959574966967628');
  });

  it('should calculate a bignumber pi', function() {
    assert.equal(bignumber.pi(32), '3.1415926535897932384626433832795');
    assert.equal(bignumber.pi(64), '3.141592653589793238462643383279502884197169399375105820974944592');
  });

  it('should calculate a bignumber tau', function() {
    assert.equal(bignumber.tau(32), '6.283185307179586476925286766559');
    assert.equal(bignumber.tau(64), '6.283185307179586476925286766559005768394338798750211641949889185');
  });

  it('should calculate a bignumber phi', function() {
    // FIXME: round-off error
    //assert.equal(bignumber.phi(32), '1.6180339887498948482045868343656');
    assert.equal(bignumber.phi(32), '1.6180339887498948482045868343657');
    assert.equal(bignumber.phi(64), '1.618033988749894848204586834365638117720309179805762862135448623');
  });

  it('should convert a number to BigNumber', function() {
    var Big = BigNumber.constructor();
    Big.config({precision: 4});

    var a = bignumber.toBigNumber(0.123456789, BigNumber);
    assert(a instanceof BigNumber);
    assert.equal(a.plus(0).toString(), '0.123456789');

    var b = bignumber.toBigNumber(0.123456789, Big);
    assert(b instanceof BigNumber);
    assert.equal(b.plus(0).toString(), '0.1235');
  });

});

