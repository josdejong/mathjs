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
      assert.deepEqual(object.clone(new Boolean(true)), new Boolean(true));
      assert.deepEqual(object.clone(new Boolean(false)), new Boolean(false));
    });

    it('should clone numbers', function () {
      assert.strictEqual(object.clone(2.3), 2.3);
      assert.equal(object.clone(new Number(2.3)), new Number(2.3));
    });

    it('should clone strings', function () {
      assert.strictEqual(object.clone('hello'), 'hello');
      assert.equal(object.clone(new String('hello')), new String('hello'));
    });

    // TODO
  });

  it('extend', function() {
    // TODO
  });

  it('deepExtend', function() {
    // TODO
  });

  it('deepEqual', function() {
    // TODO
  });

});