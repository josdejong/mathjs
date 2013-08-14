// test import
var assert = require('assert'),
    math = require('../../../index.js'),
    approx = require('../../../tools/approx.js');

math.import({
  myvalue: 42,
  hello: function (name) {
    return 'hello, ' + name + '!';
  }
});
assert.equal(math.myvalue * 2, 84);
assert.equal(math.hello('user'), 'hello, user!');

// test whether not overwriting existing functions by default
math.import({myvalue: 10});
approx.equal(math.myvalue, 42);
// test whether overwritten when forced
math.import({myvalue: 10}, {override: true});
approx.equal(math.myvalue, 10);


var parser = math.parser();
parser.eval('myvalue + 10');    // 52
parser.eval('hello("user")');   // 'hello, user!'

// test wrapping
var getSize = function (array) {
  return array.length;
};
math.import({
  getSizeWrapped: getSize
});
math.import({
  getSizeNotWrapped: getSize
}, {
  wrap: false
});

assert.equal(math.getSizeWrapped([1,2,3]), 3);
assert.equal(math.getSizeWrapped(math.matrix([1,2,3])), 3);
assert.equal(math.getSizeNotWrapped([1,2,3]), 3);
assert.equal(math.getSizeNotWrapped(math.matrix([1,2,3])), undefined);


// extend math.js with numbers.js
// examples copied from https://github.com/sjkaliski/numbers.js/blob/master/examples/statistic.js
math.import('numbers');

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
