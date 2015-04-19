// test import
var assert = require('assert'),
    error = require('../../../lib/error/index'),
    mathjs = require('../../../index'),
    approx = require('../../../tools/approx');

describe('import', function() {
  var math = null;

  beforeEach(function() {
    math = mathjs.create();
    math.import({
      myvalue: 42,
      hello: function (name) {
        return 'hello, ' + name + '!';
      }
    }, {override: true});
  });

  afterEach(function() {
    math = null;
  });

  it('should import a custom member', function() {
    assert.equal(math.myvalue * 2, 84);
    assert.equal(math.hello('user'), 'hello, user!');
  });

  it('should not override existing functions', function() {
    math.import({myvalue: 10});
    approx.equal(math.myvalue, 42);
  });

  it('should override existing functions if forced', function() {
    math.import({myvalue: 10}, {override: true});
    approx.equal(math.myvalue, 10);
  });

  it('should parse the user defined members', function() {
    if (math.parser) {
      var parser = math.parser();
      math.add(math.myvalue, 10);
      parser.eval('myvalue + 10');    // 52
      parser.eval('hello("user")');   // 'hello, user!'
    }
  });

  var getSize = function (array) {
    return array.length;
  };

  it('shouldn\'t wrap custom functions by default', function () {
    math.import({ getSizeNotWrapped: getSize });
    assert.strictEqual(math.getSizeNotWrapped([1,2,3]), 3);
    assert.strictEqual(math.getSizeNotWrapped(math.matrix([1,2,3])), undefined);
  });

  it('should wrap custom functions if wrap = true', function () {
    math.import({ getSizeWrapped: getSize }, { wrap: true});
    assert.strictEqual(math.getSizeWrapped([1,2,3]), 3);
    assert.strictEqual(math.getSizeWrapped(math.matrix([1,2,3])), 3);
  });

  it('wrapped imported functions should accept undefined and null', function () {
    math.import({
      isNull: function (obj) {
        return obj === null;
      }
    }, { wrap: true });
    assert.equal(math.isNull(null), true);
    assert.equal(math.isNull(0), false);

    math.import({
      isUndefined: function (obj) {
        return obj === undefined;
      }
    }, { wrap: true });
    assert.equal(math.isUndefined(undefined), true);
    assert.equal(math.isUndefined(0), false);
    assert.equal(math.isUndefined(null), false);

  });

  it('should extend math with numbers', function() {
    // extend math.js with numbers.js
    // examples copied from https://github.com/sjkaliski/numbers.js/blob/master/examples/statistic.js
    math.import('numbers', {wrap: true});

    assert.equal(math.fibonacci(7), 13);

    // Consider a data representing total follower count of a
    // variety of users.
    var followers = math.matrix([100, 50, 1000, 39, 283, 634, 3, 6123]);

    // We can generate a report of summary statistics
    // which includes the mean, 1st and 3rd quartiles,
    // and standard deviation.
    var report = math.report(followers);
    approx.deepEqual(report, {
      mean: 1029,
      firstQuartile: 44.5,
      median: 191.5,
      thirdQuartile: 817,
      standardDev: 1953.0897316815733
    });

    // Maybe we decide to become a bit more curious about
    // trends in follower count, so we start conjecturing about
    // our ability to "predict" trends.
    // Let's consider the number of tweets those users have.
    var tweets = math.matrix([100, 10, 400, 5, 123, 24, 302, 2000]);

    // Let's calculate the correlation.
    var correlation = math.correlation(tweets, followers);
    approx.equal(correlation, 0.98054753183666);

    // Now let's create a linear regression.
    var linReg = math.linearRegression(tweets, followers);

    // linReg is actually a function we can use to map tweets
    // onto followers. We'll see that around 1422 followers
    // are expected if a user tweets 500 times.
    var estFollowers = linReg(500);
    approx.equal(estFollowers, 1422.431464053916);
  });

  it.skip('should throw an error when trying to load a module when no module loader is available', function () {
    var orig = require;
    require = undefined;

    assert.throws(function () {math.import('numbers');}, /Cannot load file: require not available/);

    require = orig;
  });

  it('should throw an error in case of wrong number of arguments', function () {
    assert.throws (function () {math.import()}, error.ArgumentsError);
    assert.throws (function () {math.import('', {}, 3)}, error.ArgumentsError);

  });

  it('should throw an error in case of wrong type of arguments', function () {
    assert.throws(function () {math.import(2)}, /Object or module name expected/);
    assert.throws(function () {math.import(function () {})}, /Object or module name expected/);
  });

  it('should ignore properties on Object', function () {
    Object.prototype.foo = 'bar';

    math.import({bar: 456});

    assert(!math.hasOwnProperty('foo'));
    assert(math.hasOwnProperty('bar'));

    delete Object.prototype.foo;
  });

  it('should LaTeX import', function () {
    var expression = math.parse('import(object)');
    assert.equal(expression.toTex(), '\\mathrm{import}\\left(\\mathrm{object}\\right)');
  });

});
