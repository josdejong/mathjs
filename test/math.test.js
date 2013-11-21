var assert = require('assert'),
    mathjs = require('../index');

describe('factory', function() {

  it('should create an instance of math.js with default configuration', function() {
    var math = mathjs();

    assert.strictEqual(typeof math, 'object');
    assert.deepEqual(math.config(), {
      matrix: {defaultType: 'matrix'},
      number: {defaultType: 'number'}
    });
  });

  it('should create an instance of math.js with custom configuration', function() {
    var math = mathjs({
      matrix: {defaultType: 'array'},
      number: {defaultType: 'bignumber'}
    });

    assert.strictEqual(typeof math, 'object');
    assert.deepEqual(math.config(), {
      matrix: {defaultType: 'array'},
      number: {defaultType: 'bignumber'}
    });
  });

  it('two instances of math.js should be isolated from each other', function() {
    var math1 = mathjs();
    var math2 = mathjs({
      matrix: {defaultType: 'array'}
    });

    assert.notStrictEqual(math1, math2);
    assert.notDeepEqual(math1.config(), math2.config());

    assert.strictEqual(typeof math1.sqrt, 'function');
    assert.strictEqual(typeof math2.sqrt, 'function');

    assert.notStrictEqual(math1.sqrt, math2.sqrt);
  });

  it('should apply configuration using the config function', function() {
    var math = mathjs();

    assert.deepEqual(math.config(), {
      matrix: {defaultType: 'matrix'},
      number: {defaultType: 'number'}
    });

    math.config({
      matrix: {defaultType: 'array'},
      number: {defaultType: 'bignumber'}
    });

    assert.deepEqual(math.config(), {
      matrix: {defaultType: 'array'},
      number: {defaultType: 'bignumber'}
    });
  });

});