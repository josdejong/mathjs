// test data type Index
var assert = require('assert');
var math = require('../../index');
var Index = math.type.Index;
var Matrix = math.type.Matrix;
var Range = math.type.Range;

describe('Index', function () {

  it('should create an Index', function () {
    assert.deepEqual(new Index(0, 2)._ranges, [{start:0, end:1, step:1}, {start:2, end:3, step:1}]);

    assert.deepEqual(new Index([0, 10])._ranges, [{start:0, end:10, step:1}]);
    assert.deepEqual(new Index([0, 10, 2])._ranges, [{start:0, end:10, step:2}]);
    assert.deepEqual(new Index([0, 10], [4,6])._ranges, [
      {start:0, end:10, step:1},
      {start:4, end:6, step:1}
    ]);
  });

  it('should create an Index from a Range', function () {
    assert.deepEqual(new Index(new Range(0, 10))._ranges, [{start:0, end:10, step:1}]);
  });

  it('should create an Index from a Matrix', function () {
    assert.deepEqual(new Index(math.matrix([0, 10]))._ranges, [{start:0, end:10, step:1}]);
  });

  it('should create an Index from an array with ranges', function () {
    var index = Index.create([new Range(0, 10), 4]);
    assert(index instanceof Index);
    assert.deepEqual(index._ranges, [{start:0, end:10, step:1}, {start:4, end:5, step:1}]);
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

  it('should clone an Index', function () {
    var index1 = new Index(2, [0, 4]);
    var index2 = index1.clone(0);

    assert.deepEqual(index1, index2);
    assert.notStrictEqual(index1, index2);
    assert.notStrictEqual(index1._ranges[0], index2._ranges[0]);
    assert.notStrictEqual(index1._ranges[1], index2._ranges[1]);
  });

  it('should stringify an index', function () {
    assert.equal(new Index().toString(), '[]');
    assert.equal(new Index(2, 3).toString(), '[2:3, 3:4]');
    assert.equal(new Index(2, 3, 1).toString(), '[2:3, 3:4, 1:2]');
    assert.equal(new Index(2, [0,3]).toString(), '[2:3, 0:3]');
    assert.equal(new Index([0,6,2]).toString(), '[0:2:6]');
  });

  it('toJSON', function () {
    assert.deepEqual(new Index([0,10], 2).toJSON(),
        {'mathjs': 'Index', ranges: [
          new Range(0, 10, 1),
          new Range(2, 3, 1)
        ]});
  });

  it('fromJSON', function () {
    var json = {ranges: [
      new Range(0, 10, 1),
      new Range(2, 3, 1)
    ]};
    var i1 = new Index([0,10], 2);

    var i2 = Index.fromJSON(json);
    assert.ok(i2 instanceof Index);
    assert.deepEqual(i2, i1);
  });

  it('should get the range for a given dimension', function () {
    var index = new Index(2, [0, 8, 2], [3,-1,-1]);

    assert(index.range(0) instanceof Range);
    assert.deepEqual(index.range(0), new Range(2, 3));

    assert(index.range(1) instanceof Range);
    assert.deepEqual(index.range(1), new Range(0, 8, 2));

    assert(index.range(2) instanceof Range);
    assert.deepEqual(index.range(2), new Range(3, -1, -1));
    assert.strictEqual(index.range(3), null);
  });

  it('should iterate over all ranges', function () {
    var index = new Index(2, [0, 8, 2], [3,-1,-1]);

    var log = [];
    index.forEach(function (range, i, obj) {
      log.push({
        range: range,
        index: i
      });
      assert.strictEqual(obj, index);
    });

    assert.deepEqual(log, [
      {range: new Range(2, 3), index: 0},
      {range: new Range(0, 8, 2), index: 1},
      {range: new Range(3, -1, -1), index: 2}
    ]);
  });

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

    assert.deepEqual(new Index(2, [0, 8, 2], [3,-1,-1], [2, 4, 0]).toArray(), [
      [2],
      [0, 2, 4, 6],
      [3, 2, 1, 0],
      []
    ]);
  });

  it('valueOf should return the expanded array', function () {
    assert.deepEqual(new Index(2, [0, 8, 2], [3,-1,-1]).valueOf(), [
      [2],
      [0, 2, 4, 6],
      [3, 2, 1, 0]
    ]);
  });

  it('should complain when new operator is missing', function () {
    assert.throws(function () {Index([2, 5]);}, /Constructor must be called with the new operator/);
  });

  it('should throw an error on non-integer ranges', function () {
    assert.throws(function () {new Index([0,4.5])});
    assert.throws(function () {new Index([0.1,4])});
    assert.throws(function () {new Index([4,2,0.1])});
  });

  it('should throw an error on unsupported type of arguments', function () {
    assert.throws(function () {new Index('string')}, TypeError);
    assert.throws(function () {new Index(new Date())}, TypeError);
  });
});
