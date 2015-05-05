// test data type Permutation

var assert = require('assert');
var math = require('../../index');
var _ = require('underscore');
var Permutation = math.type.Permutation;

describe('Permutation type', function () {

  describe('Constructor', function() {

    it('should create a permutation correctly from the default constructor', function () {
      var permutation = new Permutation([]);
      assert.equal(permutation._numCycles, 0);
      assert.equal(_.isArray(permutation._values), true);
      assert.equal(_.isEmpty(permutation._values), true);

    });

    it('should throw an error if called with wrong number of arguments', function() {
      assert.throws(function() { new Permutation(3, -4, 5); });
      assert.throws(function() { new Permutation(1); });
    });

    it('should throw an error if called with wrong type of arguments', function() {
      assert.throws(function () { new Permutation(1, true); });
      assert.throws(function () { new Permutation(true, 2); });
    });

    it('should throw an error if called without new operator', function() {
      assert.throws(function () { Permutation(3, -4); });
    });

    it('should accept an object with an array', function() {
      assert.equal(_.isEqual(new Permutation([1,2,3,4])._values, [1,2,3,4]), true);
      assert.equal(_.isEqual(new Permutation([1,2,[3,4],[5]])._numCycles, 4), true);
    });

    describe('isPermutation', function() {

      it('should check if the object is a Permutation', function() {
        var perm = new Permutation([])
        assert.equal(perm.isPermutation({}), false);
        assert.equal(perm.isPermutation([1,2,3]), true);
        assert.equal(perm.isPermutation(new Permutation([1,2])), true);
      });


    });
  });

});
