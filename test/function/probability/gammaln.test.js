var assert = require('assert'),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    bigUtil = require('../../../lib/util/index').bignumber,
    bignumber = math.bignumber,
    gammaln = math.gammaln;

describe('gammaln', function () {

    it('should calculate the gammaln of a whole number', function () {
      approx.equal(gammaln(3), 0.69314718055994529);
    });

    it('should calculate the gammaln of a rational number', function () {
      approx.equal(gammaln(0.5), 0.57236494292469997);
    });

    it('should calculate the gammaln of a irrational number', function () {
      approx.equal(gammaln(Math.PI), 0.82769459232343701);
    });

    it('should calculate the gamma of each element in a matrix', function () {
      approx.deepEqual(gammaln(math.matrix([1,2,3,4,5])),
                       math.matrix([0.,-2.220446049250313e-16,0.693147180559944,1.791759469228054,3.178053830347945]));
    });

    it('should calculate the gamma of each element in an array', function () {
      approx.deepEqual(gammaln([1,2,3,4,5]),
                       [0.,-2.220446049250313e-16,0.693147180559944,1.791759469228054,3.178053830347945]);
    });

    it('should throw en error if called with invalid number of arguments', function() {
      assert.throws(function() { gammaln(); });
      assert.throws(function() { gammaln(1,3); });
    });

    it('should throw en error if called with invalid type of argument', function() {
      assert.throws(function() { gamma(new Date()); });
      assert.throws(function() { gamma('a string'); });
    });

});
