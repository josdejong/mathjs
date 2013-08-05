// test data type Complex

var assert = require('assert');
var math = require('../../src/index.js');

var complex1 = math.complex(3, -4);
assert.equal(complex1.re, 3);
assert.equal(complex1.im, -4);
assert.equal(complex1, '3 - 4i');
assert.throws(function () { Complex(3, -4); });

// test constructor and parser
assert.equal(math.complex().toString(), '0');
assert.equal(math.complex(2, 3).toString(), '2 + 3i');
assert.equal(math.complex(2, 0).toString(), '2');
assert.equal(math.complex(0, 3).toString(), '3i');
assert.equal(math.complex('2 + 3i').toString(), '2 + 3i');
assert.equal(math.complex('2 +3i').toString(), '2 + 3i');
assert.equal(math.complex('2+3i').toString(), '2 + 3i');
assert.equal(math.complex(' 2+3i ').toString(), '2 + 3i');
assert.equal(math.complex('2-3i').toString(), '2 - 3i');
assert.equal(math.complex('2 + i').toString(), '2 + i');
assert.equal(math.complex('-2-3i').toString(), '-2 - 3i');
assert.equal(math.complex('-2+3i').toString(), '-2 + 3i');
assert.equal(math.complex('-2+-3i').toString(), '-2 - 3i');
assert.equal(math.complex('-2-+3i').toString(), '-2 - 3i');
assert.equal(math.complex('+2-+3i').toString(), '2 - 3i');
assert.equal(math.complex('+2-+3i').toString(), '2 - 3i');
assert.equal(math.complex('2 + 3i').toString(), '2 + 3i');
assert.equal(math.complex('2 - -3i').toString(), '2 + 3i');
assert.equal(math.complex(' 2 + 3i ').toString(), '2 + 3i');
assert.equal(math.complex('2 + i').toString(), '2 + i');
assert.equal(math.complex('2 - i').toString(), '2 - i');
assert.equal(math.complex('2 + -i').toString(), '2 - i');
assert.equal(math.complex('-2+3e-1i').toString(), '-2 + 0.3i');
assert.equal(math.complex('-2+3e+1i').toString(), '-2 + 30i');
assert.equal(math.complex('2+3e2i').toString(), '2 + 300i');
assert.equal(math.complex('2.2e-1-3.2e-1i').toString(), '0.22 - 0.32i');
assert.equal(math.complex('2.2e-1-+3.2e-1i').toString(), '0.22 - 0.32i');
assert.equal(math.complex('2').toString(), '2');
assert.equal(math.complex('i').toString(), 'i');
assert.equal(math.complex(' i ').toString(), 'i');
assert.equal(math.complex('-i').toString(), '-i');
assert.equal(math.complex(' -i ').toString(), '-i');
assert.equal(math.complex('+i').toString(), 'i');
assert.equal(math.complex(' +i ').toString(), 'i');
assert.equal(math.complex('-2').toString(), '-2');
assert.equal(math.complex('3I').toString(), '3i');
assert.equal(math.complex('-3i').toString(), '-3i');
assert.throws(function () { math.complex(1, 2, 3); });
assert.throws(function () { math.complex('str', 2); });
assert.throws(function () { math.complex(1, true); });
assert.throws(function () { math.complex(2); });
assert.throws(function () { math.complex(''); });
assert.throws(function () { math.complex('2r'); });
assert.throws(function () { math.complex('str'); });
assert.throws(function () { math.complex('2i+3i'); });
assert.throws(function () { math.complex('2ia'); });
assert.throws(function () { math.complex('3+4'); });
assert.throws(function () { math.complex('3i+4'); });
assert.throws(function () { math.complex('3e + 4i'); });
assert.throws(function () { math.complex('3e1.2 + 4i'); });
assert.throws(function () { math.complex('3e1.2i'); });
assert.throws(function () { math.complex('3e1.2i'); });
assert.throws(function () { math.complex('- i'); });
assert.throws(function () { math.complex('+ i'); });

// test toString
assert.equal(math.complex().toString(),      '0');
assert.equal(math.complex(0, 2).toString(),  '2i');
assert.equal(math.complex(1, 1).toString(),  '1 + i');
assert.equal(math.complex(1, 2).toString(),  '1 + 2i');
assert.equal(math.complex(1, -1).toString(), '1 - i');
assert.equal(math.complex(1, -2).toString(), '1 - 2i');
assert.equal(math.complex(1, 0).toString(),  '1');
assert.equal(math.complex(-1, 2).toString(), '-1 + 2i');
assert.equal(math.complex(-1, 1).toString(), '-1 + i');

// test clone
var clone = complex1.clone();
clone.re = 100;
clone.im = 200;
assert.notEqual(complex1, clone);
assert.equal(complex1.re, 3);
assert.equal(complex1.im, -4);
assert.equal(clone.re, 100);
assert.equal(clone.im, 200);
