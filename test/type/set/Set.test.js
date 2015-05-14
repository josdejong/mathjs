// test data type Set

var assert = require('assert');
var math = require('../../../index');
var Set = math.type.Set;

describe('set', function() {
  
  describe('create', function() {

    it('should create a set', function() {
      var r = new Set([2,6]);
      assert.deepEqual(r.toArray(), [2,6]);
      assert.equal(r.size(), 2);
    });

    it('should create a set with floating points', function() {
      var r = new Set([1, 5.5, 1.5]);
      assert.deepEqual(r.toArray(), [1, 5.5, 1.5]);
      assert.equal(r.size(), 3);
    });

    it('should create an empty set', function() {
      var r = new Set();
      assert.deepEqual(r.toArray(), []);
    });

    it('should create a set with only one value', function() {
      var r = new Set([0]);
      assert.deepEqual(r.toArray(), [0]);
      assert.equal(r.size(), 1);
    });

    it('should throw an error when created without new keyword', function() {
      assert.throws(function () {Set(0,10);}, /Constructor must be called with the new operator/);
    });

    it('should throw an error for wrong type of arguments', function() {
      assert.throws(function () {new Set('str', 10, 1);}, /Invalid arguments, expecting Array or Matrix/);
      assert.throws(function () {new Set(0, 'str', 1);}, /Invalid arguments, expecting Array or Matrix/);
      assert.throws(function () {new Set(0, 10, 'str');}, /Invalid arguments, expecting Array or Matrix/);
    });
  });

  describe('size', function () {
    it('should calculate the size of a set', function() {
      assert.deepEqual(new Set([]).size(), [0]);

      assert.deepEqual(new Set([0, 4]).size(), [2]);
      assert.deepEqual(new Set([2, 4]).size(), [2]);
      assert.deepEqual(new Set([0, 8, 2]).size(), [3]);
      assert.deepEqual(new Set([0, 8.1, 2]).size(), [3]);
    });
  });

  describe('min', function () {
    it('should calculate the minimum value of a set', function() {
      assert.strictEqual(new Set([]).min(), undefined);
      assert.strictEqual(new Set().min(), undefined);

      assert.strictEqual(new Set([0, 4]).min(), 0);
      assert.strictEqual(new Set([2, 4]).min(), 2);
      assert.strictEqual(new Set([0, 8, 2]).min(), 0);
      assert.strictEqual(new Set([0, 8.1, 2]).min(), 0);
    });
  });

  describe('max', function () {
    it('should calculate the maximum value of a set', function() {
      assert.strictEqual(new Set([]).max(), undefined);
      assert.strictEqual(new Set().max(), undefined);

      assert.strictEqual(new Set([2, 4]).max(), 4);
      assert.strictEqual(new Set([0, 8, 2]).max(), 8);
      assert.strictEqual(new Set([0, 8.1, 2]).max(), 8.1);
    });
  });

  describe('toString', function () {
    it('should stringify a set', function () {
      assert.equal(new math.type.Set([0,10]).toString(), '[0, 10]');
      assert.equal(new math.type.Set().toString(), '[]');
      assert.equal(new math.type.Set([]).toString(), '[]');
    });
  });

  describe('clone', function () {
    it('should clone a Set', function () {
      var r1 = new Set([0, 10, 2]);
      var r2 = r1.clone();

      assert.deepEqual(r1, r2);
      assert.notStrictEqual(r1, r2);
    });
  });

  describe('type', function () {

    it('should have a property isSet', function () {
      var a = new math.type.Set([0, 10]);
      assert.strictEqual(a.isSet, true);
    });

    it('should have a property type', function () {
      var a = new math.type.Set([0, 10]);
      assert.strictEqual(a.type, 'Set');
    });

  });

  describe('map', function () {
    it('should perform a transformation on all values in the set', function () {
      var r = new Set([2, 6]);
      assert.deepEqual(r.map(function (value, index, set) {
        assert.strictEqual(set, r);
        return 'set[' + index + ']=' + value;
      }), [
        'set[0]=2',
        'set[1]=6'
      ]);
    });
  });

  describe('forEach', function () {
    it('should perform a given callback on all values in the set', function () {
      var r = new Set([2, 6]);
      var log = [];
      r.forEach(function (value, index, set) {
        assert.strictEqual(set, r);
        log.push('set[' + index + ']=' + value);
      });

      assert.deepEqual(log, [
        'set[0]=2',
        'set[1]=6'
      ]);
    });
  });

  describe('format', function () {
    it('should format a set as string', function () {
      assert.equal(new Set([0, 4]).format(), '[0, 4]');
      assert.equal(new Set([0, 4, 2]).format(), '[0, 4, 2]');
    });
  });

  describe('toArray', function () {
    it('should expand a Set into an Array', function () {
      assert.deepEqual(new Set([0, 4]).toArray(), [0,4]);
      assert.deepEqual(new Set([4, 0, -1]).toArray(), [4, 0, -1]);
    });
  });

  describe('valueOf', function () {
    it('valueOf should return the Set expanded as Array', function () {
      assert.deepEqual(new Set([0, 4]).valueOf(), [0,4]);
      assert.deepEqual(new Set([4, 0, -1]).valueOf(), [4, 0, -1]);
    });
  });

  it('toJSON', function () {
    assert.deepEqual(new Set([2, 4]).toJSON(), {'mathjs': 'Set', values: [2, 4], min: null, max: null});
    assert.deepEqual(new Set([0, 10, 2]).toJSON(), {'mathjs': 'Set', values: [0, 10, 2], min: null, max: null});
  });

  it('fromJSON', function () {
    var r1 = Set.fromJSON({values: [2, 4]});
    assert.ok(r1 instanceof Set);
    assert.deepEqual(r1._values, [2, 4]);
    assert.strictEqual(r1._min, null);
    assert.strictEqual(r1._max, null);

    var r2 = Set.fromJSON({values: [0, 2], min: 0, max: 2});
    assert.ok(r2 instanceof Set);
    assert.deepEqual(r2._values, [0, 2]);
    assert.strictEqual(r2._min, 0);
    assert.strictEqual(r2._max, 2);
  });

});