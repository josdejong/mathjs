// test exp
var assert = require('assert'),
    approx = require('../../../tools/approx.js'),
    math = require('../../../src/index.js'),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    range = math.range,
    log = math.log;

// parser
approx.equal(math.eval('log(e)'), 1);
approx.equal(math.eval('log(2.71828182845905)'), 1);

// number
approx.deepEqual(log(-3), complex('1.098612288668110 + 3.141592653589793i'));
approx.deepEqual(log(-2), complex('0.693147180559945 + 3.141592653589793i'));
approx.deepEqual(log(-1), complex('0.000000000000000 + 3.141592653589793i'));
approx.deepEqual(log(0), -Infinity);
approx.deepEqual(log(1), 0);
approx.deepEqual(log(2), 0.693147180559945);
approx.deepEqual(log(3), 1.098612288668110);
approx.deepEqual(math.exp(log(100)), 100);

approx.deepEqual(log(100, 10), 2);
approx.deepEqual(log(1000, 10), 3);
approx.deepEqual(log(8, 2), 3);
approx.deepEqual(log(16, 2), 4);

assert.throws(function () {log()}, SyntaxError, 'Wrong number of arguments in function log (0 provided, 1-2 expected)');
assert.throws(function () {log(1, 2, 3)}, SyntaxError, 'Wrong number of arguments in function log (3 provided, 1-2 expected)');

// complex
approx.deepEqual(log(math.i),          complex('1.570796326794897i'));
approx.deepEqual(log(complex(0, -1)),  complex('-1.570796326794897i'));
approx.deepEqual(log(complex(1, 1)),   complex('0.346573590279973 + 0.785398163397448i'));
approx.deepEqual(log(complex(1, -1)),  complex('0.346573590279973 - 0.785398163397448i'));
approx.deepEqual(log(complex(-1, -1)), complex('0.346573590279973 - 2.356194490192345i'));
approx.deepEqual(log(complex(-1, 1)),  complex('0.346573590279973 + 2.356194490192345i'));
approx.deepEqual(log(complex(1, 0)),   complex(0, 0));

// unit
assert.throws(function () {log(unit('5cm'))});

// string
assert.throws(function () {log('text')});

// matrix, array, range
var res = [0, 0.693147180559945, 1.098612288668110, 1.386294361119891];
approx.deepEqual(log([1,2,3,4]), res);
approx.deepEqual(log(range('1:4')), res);
approx.deepEqual(log(matrix([1,2,3,4])), matrix(res));
approx.deepEqual(log(matrix([[1,2],[3,4]])),
    matrix([[0, 0.693147180559945], [1.098612288668110, 1.386294361119891]]));
