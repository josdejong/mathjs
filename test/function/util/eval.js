// test eval
var assert = require('assert');
var math = require('../../../math.js');

assert.equal(math.eval('pi'), Math.PI);
assert.equal(math.eval('(2+3)/4'), 1.25);
assert.equal(math.eval('sqrt(-4)').toString(), '2i');
assert.deepEqual(math.eval(['1+2', '3+4', '5+6']), [3, 7, 11]);
assert.deepEqual(math.eval(['a=3', 'b=4', 'a*b']), [3, 4, 12]);
assert.deepEqual(math.eval('a=3', 'b=4', 'a*b'), [3, 4, 12]);
assert.deepEqual(math.eval('a=3\nb=4\na*b'), [3, 4, 12]);
assert.deepEqual(math.eval('function f(x) = a * x; a=2; f(4)'), [8]);
assert.deepEqual(math.eval('b = 43; b * 4'), [172]);
