// test import
var assert = require('assert'),
    math = require('../../../math.js'),
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
