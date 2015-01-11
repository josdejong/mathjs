var assert = require('assert');
var BigNumber = require('decimal.js');
var assertBigNumber = require('../tools/assertBigNumber');

describe('assertBigNumber', function() {

  it('should test equality of BigNumbers with the same constructor', function () {
    var a = new BigNumber(2).div(5);
    var b = new BigNumber(0.4);
    var c = new BigNumber(0.1);

    assertBigNumber.equal(a, b);

    assert.throws(function () {assertBigNumber.equal(a, c)}, assert.AssertionError);
  });

  it('should test equality of BigNumbers with a different constructor', function () {
    var Big = BigNumber.constructor({precision: 100});

    var a = new BigNumber(2).div(5);
    var b = new Big(0.4);
    var c = new Big(0.1);

    assertBigNumber.equal(a, b);

    assert.throws(function () {assertBigNumber.equal(a, c)}, assert.AssertionError);
  });

});