var assert = require('assert'),
    approx = require('../tools/approx'),
    mathjs = require('../index');

describe('factory', function() {

  it('should create an instance of math.js with default configuration', function() {
    var math = mathjs();

    assert.strictEqual(typeof math, 'object');
    assert.deepEqual(math.config(), {
      matrix: 'matrix',
      number: 'number',
      precision: 20
    });
  });

  it('should create an instance of math.js with custom configuration', function() {
    var math = mathjs({
      matrix: 'array',
      number: 'bignumber'
    });

    assert.strictEqual(typeof math, 'object');
    assert.deepEqual(math.config(), {
      matrix: 'array',
      number: 'bignumber',
      precision: 20
    });
  });

  it('two instances of math.js should be isolated from each other', function() {
    var math1 = mathjs();
    var math2 = mathjs({
      matrix: 'array'
    });

    assert.notStrictEqual(math1, math2);
    assert.notDeepEqual(math1.config(), math2.config());

    assert.strictEqual(typeof math1.sqrt, 'function');
    assert.strictEqual(typeof math2.sqrt, 'function');

    assert.notStrictEqual(math1.sqrt, math2.sqrt);
  });

  it('should apply configuration using the config function', function() {
    var math = mathjs();

    var config = math.config();
    assert.deepEqual(config, {
      matrix: 'matrix',
      number: 'number',
      precision: 20
    });

    math.config({
      matrix: 'array',
      number: 'bignumber',
      precision: 32
    });

    assert.deepEqual(math.config(), {
      matrix: 'array',
      number: 'bignumber',
      precision: 32
    });

    // restore the original config
    math.config(config);
  });


  it('should convert a number into a bignumber (when possible)', function() {
    var BigNumber = math.type.BigNumber;

    assert.deepEqual(BigNumber.convert(2.34), new BigNumber(2.34));
    assert.deepEqual(BigNumber.convert(0), new BigNumber(0));
    assert.deepEqual(BigNumber.convert(2.3e-3), new BigNumber(2.3e-3));
    assert.deepEqual(BigNumber.convert(2.3e+3), new BigNumber(2.3e+3));

    // The following values can't represented as bignumber
    approx.equal(BigNumber.convert(Math.PI), Math.PI);
    approx.equal(BigNumber.convert(1/3), 1/3);
  });

  // TODO: test whether two instances of mathjs do not influence each others (BigNumber) settings

  it('should throw an error when ES5 is not supported', function() {
    var create = Object.create;
    Object.create = undefined; // fake missing Object.create function

    assert.throws(function () {
      var math = mathjs();
    }, /ES5 not supported/);

    // restore Object.create
    Object.create = create;
  });

});