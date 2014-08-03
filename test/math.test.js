var assert = require('assert'),
    approx = require('../tools/approx'),
    math = require('../index');

describe('factory', function() {

  it('should get a default instance of mathjs', function() {
    assert.strictEqual(typeof math, 'object');
    assert.deepEqual(math.config(), {
      matrix: 'matrix',
      number: 'number',
      precision: 64,
      epsilon: 1e-14
    });
  });

  it('should create an instance of math.js with custom configuration', function() {
    var math1 = math.create({
      matrix: 'array',
      number: 'bignumber'
    });

    assert.strictEqual(typeof math1, 'object');
    assert.deepEqual(math1.config(), {
      matrix: 'array',
      number: 'bignumber',
      precision: 64,
      epsilon: 1e-14
    });
  });

  it('two instances of math.js should be isolated from each other', function() {
    var math1 = math.create();
    var math2 = math.create({
      matrix: 'array'
    });

    assert.notStrictEqual(math, math1);
    assert.notStrictEqual(math, math2);
    assert.notStrictEqual(math1, math2);
    assert.notDeepEqual(math1.config(), math2.config());
    assert.notDeepEqual(math.config(), math2.config());

    assert.strictEqual(typeof math1.sqrt, 'function');
    assert.strictEqual(typeof math2.sqrt, 'function');

    assert.notStrictEqual(math1.sqrt, math2.sqrt);

    // changing config should not affect the other
    math1.config({number: 'bignumber'});
    assert.strictEqual(math.config().number, 'number');
    assert.strictEqual(math1.config().number, 'bignumber');
    assert.strictEqual(math2.config().number, 'number');
  });

  it('should apply configuration using the config function', function() {
    var math1 = math.create();

    var config = math1.config();
    assert.deepEqual(config, {
      matrix: 'matrix',
      number: 'number',
      precision: 64,
      epsilon: 1e-14
    });

    math1.config({
      matrix: 'array',
      number: 'bignumber',
      precision: 32,
      epsilon: 1e-7
    });

    assert.deepEqual(math1.config(), {
      matrix: 'array',
      number: 'bignumber',
      precision: 32,
      epsilon: 1e-7
    });

    // restore the original config
    math1.config(config);
  });

  // TODO: test whether the namespace is correct: has functions like sin, constants like pi, objects like type and error.

  it('should throw an error when ES5 is not supported', function() {
    var create = Object.create;
    Object.create = undefined; // fake missing Object.create function

    assert.throws(function () {
      var math1 = math.create();
    }, /ES5 not supported/);

    // restore Object.create
    Object.create = create;
  });

});