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
      assert.equal(_.isArray(permutation._cycles), true);
      assert.equal(_.isEmpty(permutation._cycles), true);
      assert.equal(_.isArray(permutation._permutation), true);
      assert.equal(_.isEmpty(permutation._permutation), true);

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
      assert.equal(_.isEqual(new Permutation([1,2,3,4])._cycles, [[1],[2],[3],[4]]), true);
      assert.equal(_.isEqual(new Permutation([1,2,[3,4],[5]])._numCycles, 4), true);
      assert.equal(_.isEqual(new Permutation([1,2,3,4])._permutation, [1,2,3,4]), true);
    });

  });

describe('isPermutation', function() {

  it('should check if the object is a Permutation', function() {
    var perm = new Permutation([])
    assert.equal(perm.isPermutation({}), false);
    assert.equal(perm.isPermutation([1,2,3]), true);
    assert.equal(perm.isPermutation(new Permutation([1,2])), true);
  });

});

describe('disjointCycles', function(){

  it('should correctly return the permutation as disjoint cycles as a string', function(){
    var perm = new Permutation([1,2,[3,4]]);
    assert.equal(_.isEqual(perm.disjointCycles(), '[[1],[2],[3,4]]'), true);

    var perm = new Permutation([1,2,[3,4],[1,2,3,4]]);
    assert.equal(_.isEqual(perm.disjointCycles(), '[[1],[2],[3,4],[1,2,3,4]]'), true);

    var perm = new Permutation([1,2,3,4]);
    assert.equal(_.isEqual(perm.disjointCycles(), '[[1],[2],[3],[4]]'), true);
    assert.equal(_.isEqual(new Permutation([]).disjointCycles(), '[]'), true);
  });

});

describe('inverse', function(){

  it('should correctly calculate the inverse of a permutation', function(){
    var perm = new Permutation([2,5,4,3,1]);
    assert.equal(_.isEmpty(perm.inverse()), false);
    assert.equal(_.isEqual(perm.inverse(), [5,1,4,3,2]), true);

    var perm = new Permutation([[2,5,4],[3,1]]);
    assert.equal(_.isEqual(perm.inverse(), [5,1,4,3,2]), true);
  });

});

describe('multiply', function(){

  it('should correctly calculate the product of 2 permutation', function(){
    var perm = new Permutation([5,4,3,2,1]);
    assert.equal(_.isEmpty(perm.inverse()), false);
    console.log(perm.multiply([2,4,1,3,5]));
    assert.equal(_.isEqual(perm.multiply([2,4,1,3,5]), [4,2,5,3,1]), true);

    var perm = new Permutation([[2,5,4],[3,1]]);
    assert.equal(_.isEqual(perm.multiply([2,4,1,3,5]), [4,2,5,3,1]), true);
  });

});
});
