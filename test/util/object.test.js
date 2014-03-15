// test object utils
var assert = require('assert'),
    approx = require('../../tools/approx'),
    object = require('../../lib/util/object');

describe ('object', function () {

  describe('clone', function() {

    it('should clone undefined', function () {
      assert.strictEqual(object.clone(undefined), undefined);
    });

    it('should clone null', function () {
      assert.strictEqual(object.clone(null), null);
    });

    it('should clone booleans', function () {
      assert.strictEqual(object.clone(true), true);
      assert.strictEqual(object.clone(false), false);
      assert.ok(object.clone(new Boolean(true)) instanceof Boolean);
      assert.equal(object.clone(new Boolean(true)), true);
      assert.equal(object.clone(new Boolean(false)), false);
    });

    it('should clone numbers', function () {
      assert.strictEqual(object.clone(2.3), 2.3);
      assert.ok(object.clone(new Number(2.3)) instanceof Number);
      assert.equal(object.clone(new Number(2.3)), 2.3);
    });

    it('should clone strings', function () {
      assert.strictEqual(object.clone('hello'), 'hello');
      assert.ok(object.clone(new String('hello')) instanceof String);
      assert.equal(object.clone(new String('hello')), 'hello');
    });

    it('should (deep) clone objects', function () {
      var obj = {a: {b: 'c', d: new Date(2014,0,1)}};
      var clone = object.clone(obj);

      assert.deepEqual(obj, clone);

      // check whether the clone remains unchanged when changing the original object
      obj.a.b = 'cc';

      assert.equal(clone.a.b, 'c');

      obj.a.d.setMonth(2);
      assert.equal(clone.a.d.valueOf(), new Date(2014,0,1).valueOf());
    });

    it('should clone dates', function () {
      var d1 = new Date(2014,1,1);
      var d2 = object.clone(d1);
      assert.equal(d1.valueOf(), d2.valueOf());
      d1.setMonth(2);
      assert.notEqual(d1, d2);
    });

    it('should throw an error in case of an unsupported type', function () {
      assert.throws(function () {object.clone(/a regexp/)}, /Cannot clone/);
    });

    // TODO: test clone arrays
  });

  it('extend', function() {
    it ('should extend an object with all properties of an other object', function () {
      var o1 = {a: 2, b: 3};
      var o2 = {a:4, b: null, c: undefined, d: 5};
      var o3 = object.extend(o1, o2);

      assert.strictEqual(o1, o3);
      assert.deepEqual(o3, {a: 4, b: null, c: undefined, d: 5});
      assert.deepEqual(o2, {a:4, b: null, c: undefined, d: 5}); // should be unchanged
    });
  });

  it('deepExtend', function() {
    // TODO
  });

  it('deepEqual', function() {
    // TODO
  });

});