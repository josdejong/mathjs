// test data type Index
var assert = require('assert'),
    math = require('../../index')(),
    Index = math.type.Index;

describe('Index', function () {

  it('should create an Index', function () {
    assert.deepEqual(new Index([0, 10])._ranges, [{start:0, end:10, step:1}]);
    assert.deepEqual(new Index([0, 10, 2])._ranges, [{start:0, end:10, step:2}]);
    assert.deepEqual(new Index([0, 10], [4,6])._ranges, [
      {start:0, end:10, step:1},
      {start:4, end:6, step:1}
    ]);
  });

  it('should calculate the size of an Index', function () {
    assert.deepEqual(new Index([0, 10]).size(), [10]);
    assert.deepEqual(new Index([0, 10, 2]).size(), [5]);
    assert.deepEqual(new Index([4, 0, -1]).size(), [4]);
    assert.deepEqual(new Index([0, 10], [4,6]).size(), [10, 2]);
    assert.deepEqual(new Index([0, 10], [4,6], [3, -1, -1]).size(), [10, 2, 4]);
    assert.deepEqual(new Index([0, 0]).size(), [0]);
    assert.deepEqual(new Index([0, -1]).size(), [0]);
    assert.deepEqual(new Index().size(), []);
  });

  it('should calculate the minimum values of an Index', function () {
    assert.deepEqual(new Index([2, 10]).min(), [2]);
    assert.deepEqual(new Index([4, 0, -1]).min(), [1]);
    assert.deepEqual(new Index([0, 10], [4,6]).min(), [0, 4]);
    assert.deepEqual(new Index([0, 10], [4,6], [3, -1, -1]).min(), [0, 4, 0]);
    assert.deepEqual(new Index().min(), []);
  });

  it('should calculate the minimum values of an Index', function () {
    assert.deepEqual(new Index([2, 10]).max(), [9]);
    assert.deepEqual(new Index([4, 0, -1]).max(), [4]);
    assert.deepEqual(new Index([0, 10], [4,6]).max(), [9, 5]);
    assert.deepEqual(new Index([0, 10], [4,6], [3, -1, -1]).max(), [9, 5, 3]);
    assert.deepEqual(new Index().max(), []);
  });

  it('should test whether an Index contains a scalar', function () {
    assert.equal(new Index(2, 5, 2).isScalar(), true);
    assert.equal(new Index(2).isScalar(), true);
    assert.equal(new Index([2, 10]).isScalar(), false);
    assert.equal(new Index(2, [0, 4], 2).isScalar(), false);
    assert.equal(new Index([0, 2], [0, 4]).isScalar(), false);
    assert.equal(new Index().isScalar(), true);
  });

  // TODO: test Index.clone
  // TODO: test Index.toString
  // TODO: test Index.forEach
  // TODO: test Index.range
  // TODO: test Index.valueOf


  it('should test whether an object is an Index', function () {
    assert.equal(Index.isIndex(new Index()), true);
    assert.equal(Index.isIndex(math.matrix()), false);
    assert.equal(Index.isIndex(23.4), false);
    assert.equal(Index.isIndex([]), false);
    assert.equal(Index.isIndex({}), false);
    assert.equal(Index.isIndex(new Date()), false);
  });

  it('should expand an index into an array', function () {
    assert.deepEqual(new Index([2, 5]).toArray(), [
      [2, 3, 4]
    ]);

    assert.deepEqual(new Index([2, 5], [0, 8, 2]).toArray(), [
        [2, 3, 4],
        [0, 2, 4, 6]
    ]);

    assert.deepEqual(new Index([2, 4], [0, 8, 2], [3,-1,-1]).toArray(), [
      [2, 3],
      [0, 2, 4, 6],
      [3, 2, 1, 0]
    ]);
  });

  it('should complain when new operator is missing', function () {
    assert.throws(function () {
      var index = Index([2, 5]);
    });
  });

  it('should throw an error on non-integer ranges', function () {
    assert.throws(function () {new Index([0,4.5])});
    assert.throws(function () {new Index([0.1,4])});
    assert.throws(function () {new Index([4,2,0.1])});
  });

  // TODO: test wrong inputs

});
