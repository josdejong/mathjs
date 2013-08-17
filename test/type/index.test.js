// test data type Index
var assert = require('assert');
var math = require('../../index.js'),
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

  // TODO: test Index.clone
  // TODO: test Index.toString


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

  it('should get a subset', function () {
    var array = [
        [1,2,3,4],
        [5,6,7,8],
        [9,10,11,12],
        [13,14,15,16]
    ];
    var index = new Index([1,3], [1,4]);
    var subset = Index.subset(index, array);

    assert.deepEqual(subset, [
        [6,7,8],
        [10,11,12]
    ]);
  });

  it('should get a subset from an array index', function () {
    var array = [
      [1,2,3,4],
      [5,6,7,8],
      [9,10,11,12],
      [13,14,15,16]
    ];

    var index = [[0,2], [1,2]];
    var subset = Index.subset(index, array);
    assert.deepEqual(subset, [
      [2,3],
      [10,11]
    ]);

    var index = [1, [3,2,0]];
    var subset = Index.subset(index, array);
    assert.deepEqual(subset, [
      [8,7,5]
    ]);

    var index = [2, null];
    var subset = Index.subset(index, array);
    assert.deepEqual(subset, [
      [9,10,11,12]
    ]);

    var index = [null, 2];
    var subset = Index.subset(index, array);
    assert.deepEqual(subset, [
      [3],
      [7],
      [11],
      [15]
    ]);
  });

  // TODO: test set subset using array index

  it('should get a subset selecting a complete range', function () {
    var array = [
      [1,2,3,4],
      [5,6,7,8],
      [9,10,11,12],
      [13,14,15,16]
    ];

    var index = new Index([1,3], null);
    var subset = Index.subset(index, array);
    assert.deepEqual(subset, [
      [5,6,7,8],
      [9,10,11,12]
    ]);

    var index2 = new Index(null, [1,3]);
    var subset2 = Index.subset(index2, array);
    assert.deepEqual(subset2, [
      [2,3],
      [6,7],
      [10,11],
      [14,15]
    ]);
  });

  it('should get a subset selecting a single value', function () {
    var array = [
      [1,2,3,4],
      [5,6,7,8],
      [9,10,11,12],
      [13,14,15,16]
    ];

    var index = new Index([1,3], 1);
    var subset = Index.subset(index, array);
    assert.deepEqual(subset, [
      [6],
      [10]
    ]);

    var index2 = new Index(1, [1,3]);
    var subset2 = Index.subset(index2, array);
    assert.deepEqual(subset2, [
      [6,7]
    ]);

    var index3 = new Index(2, null);
    var subset3 = Index.subset(index3, array);
    assert.deepEqual(subset3, [
      [9,10,11,12]
    ]);
  });

  it('should replace a subset', function () {
    var array = math.zeros([4, 4]);
    var index = new Index([1,3], [1,4]);

    assert.deepEqual(Index.subset(index, array, [
      [1,2,3],
      [4,5,6]
    ]), [
      [0,0,0,0],
      [0,1,2,3],
      [0,4,5,6],
      [0,0,0,0]
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

  it('should throw an error on index out of range', function () {
    var array = math.range(0,10);

    // edge cases which are ok
    assert.deepEqual(Index.subset(new Index([0, 4]), array),  [0,1,2,3]);
    assert.deepEqual(Index.subset(new Index([7, 10]), array), [7,8,9]);
    assert.deepEqual(Index.subset(new Index([9, 6, -1]), array), [9,8,7]);
    assert.deepEqual(Index.subset(new Index([3, -1, -1]), array), [3,2,1,0]);

    // edge cases which are not ok
    assert.throws(function () { Index.subset(new Index([-1, 4]), array)  });
    assert.throws(function () { Index.subset(new Index([-2, 4]), array)  });
    assert.throws(function () { Index.subset(new Index([4, 12]), array)  });
    assert.throws(function () { Index.subset(new Index([4, 11]), array)  });
    assert.throws(function () { Index.subset(new Index([10, 5, -1]), array)  });
    assert.throws(function () { Index.subset(new Index([4, -2, -1]), array)  });
  });

  // TODO: test wrong inputs

});
