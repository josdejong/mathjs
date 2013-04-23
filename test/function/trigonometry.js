// test trigonometric functions

var assert = require('assert'),
    math = require('../../math.js'),
    pi = math.pi,
    acos = math.acos,
    atan = math.atan,
    asin = math.asin,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    divide = math.divide;
    round = math.round,
    sec = math.sec,
    csc = math.csc,
    cot = math.cot,
    sin = math.sin,
    cos = math.cos,
    tan = math.tan,
    atan2 = math.atan2;

var re, im;

// TODO: replace all string comparisons with approxEqual comparisons with numbers

/**
 * Test whether two numbers are equal when rounded to 5 decimals
 * @param {Number} a
 * @param {Number} b
 */
function approxEqual(a, b) {
    assert.equal(round(a, 5), round(b, 5));
}

/**
 * Test whether all numbers in two objects objects are equal when rounded
 * to 5 decimals
 * @param {*} a
 * @param {*} b
 */
function approxDeepEqual(a, b) {
    assert.deepEqual(round(a, 5), round(b, 5));
}


// test acos
approxEqual(acos(-1) / pi, 1);
approxEqual(acos(-0.5) / pi, 2 / 3);
approxEqual(acos(0) / pi, 0.5);
approxEqual(acos(0.5) / pi, 1 / 3);
approxEqual(acos(1) / pi, 0);

approxDeepEqual(acos(complex('2+3i')), complex(1.00014354247380, -1.98338702991654));
approxDeepEqual(acos(complex('2-3i')), complex(1.00014354247380, 1.98338702991654));
approxDeepEqual(acos(complex('-2+3i')), complex(2.14144911111600, -1.98338702991654));
approxDeepEqual(acos(complex('-2-3i')), complex(2.14144911111600, 1.98338702991654));
approxDeepEqual(acos(complex('i')), complex(1.570796326794897, -0.881373587019543));
approxDeepEqual(acos(complex('1')), complex(0, 0));
approxDeepEqual(acos(complex('1+i')), complex(0.904556894302381, -1.061275061905036));

approxEqual(acos(cos(-1)), 1);
approxEqual(acos(cos(0)), 0);
approxEqual(acos(cos(0.1)), 0.1);
approxEqual(acos(cos(0.5)), 0.5);
approxEqual(acos(cos(2)), 2);

// note: the results of acos(2) and acos(3) differs in octave
// the next tests are verified with mathematica
var acos123 = [0, complex(0, 1.316957896924817), complex(0, 1.762747174039086)];
approxDeepEqual(acos([1,2,3]), acos123);
approxDeepEqual(acos(math.range('1:3')), acos123);
approxDeepEqual(acos(matrix([1,2,3])), matrix(acos123));

assert.throws(function () {acos(unit('45deg'))});
assert.throws(function () {acos('string')});
assert.throws(function () {acos(unit('5 celsius'))});


// test asin
approxEqual(asin(-1) / pi, -0.5);
approxEqual(asin(-0.5) / pi, -1/6);
approxEqual(asin(0) / pi, 0);
approxEqual(asin(0.5) / pi, 1/6);
approxEqual(asin(1) / pi, 0.5);

re = 0.570652784321099;
im = 1.983387029916536;
approxDeepEqual(asin(complex('2+3i')), complex(re, im));
approxDeepEqual(asin(complex('2-3i')), complex(re, -im));
approxDeepEqual(asin(complex('-2+3i')), complex(-re, im));
approxDeepEqual(asin(complex('-2-3i')), complex(-re, -im));
approxDeepEqual(asin(complex('i')), complex(0, 0.881373587019543));
approxDeepEqual(asin(complex('1')), complex(1.57079632679490, 0));
approxDeepEqual(asin(complex('1+i')), complex(0.666239432492515, 1.061275061905036));

approxEqual(asin(sin(-1)), -1);
approxEqual(asin(sin(0)), 0);
approxEqual(asin(sin(0.1)), 0.1);
approxEqual(asin(sin(0.5)), 0.5);
approxEqual(asin(sin(2)), 1.14159265358979);

// note: the results of asin(2) and asin(3) differs in octave
// the next tests are verified with mathematica
var asin123 = [
    1.57079632679490,
    complex(1.57079632679490, -1.31695789692482),
    complex(1.57079632679490, -1.76274717403909)];
approxDeepEqual(asin([1,2,3]), asin123);
approxDeepEqual(asin(math.range('1:3')), asin123);
approxDeepEqual(asin(matrix([1,2,3])), matrix(asin123));

assert.throws(function () {asin(unit('45deg'))});
assert.throws(function () {asin('string')});
assert.throws(function () {asin(unit('5 celsius'))});

// test atan
approxEqual(atan(-1) / pi, -0.25);
approxEqual(atan(-0.5) / pi, -0.147583617650433);
approxEqual(atan(0) / pi, 0);
approxEqual(atan(0.5) / pi, 0.147583617650433);
approxEqual(atan(1) / pi, 0.25);

assert.deepEqual(atan(complex('2+3i')).toString(), '1.4099 + 0.22907i');
assert.deepEqual(atan(complex('2-3i')).toString(), '1.4099 - 0.22907i');
assert.deepEqual(atan(complex('-2+3i')).toString(), '-1.4099 + 0.22907i');
assert.deepEqual(atan(complex('-2-3i')).toString(), '-1.4099 - 0.22907i');
assert.deepEqual(atan(complex('i')).toString(), '-Infinityi');
assert.deepEqual(atan(complex('1')).toString(), '0.7854');
assert.deepEqual(atan(complex('1+i')).toString(), '1.0172 + 0.40236i');

approxEqual(atan(tan(-1)), -1);
approxEqual(atan(tan(0)), 0);
approxEqual(atan(tan(0.1)), 0.1);
approxEqual(atan(tan(0.5)), 0.5);
approxEqual(atan(tan(2)), -1.14159265358979);

var atan123 = [0.785398163397448, 1.107148717794090, 1.249045772398254];
approxDeepEqual(atan([1,2,3]), atan123);
approxDeepEqual(atan(math.range('1:3')), atan123);
approxDeepEqual(atan(matrix([1,2,3])), matrix(atan123));

assert.throws(function () {atan(unit('45deg'))});
assert.throws(function () {atan('string')});
assert.throws(function () {atan(unit('5 celsius'))});


// test atan2
approxEqual(atan2(0, 0) / pi, 0);
approxEqual(atan2(0, 1) / pi, 0);
approxEqual(atan2(1, 1) / pi, 0.25);
approxEqual(atan2(1, 0) / pi, 0.5);
approxEqual(atan2(1, -1) / pi, 0.75);
approxEqual(atan2(0, -1) / pi, 1);
approxEqual(atan2(-1, -1) / pi, -0.75);
approxEqual(atan2(-1, 0) / pi, -0.5);
approxEqual(atan2(-1, 1) / pi, -0.25);
approxDeepEqual(divide(atan2([1,0,-1], [1,0,-1]), pi), [0.25, 0, -0.75]);
approxDeepEqual(divide(atan2(
    matrix([1,0,-1]),
    matrix([1,0,-1])), pi),
    matrix([0.25, 0, -0.75]));
approxEqual(atan2(0, 2) / pi, 0);
approxEqual(atan2(0, -2) / pi, 1);
assert.throws(function () {atan2(complex('2+3i'), complex('1-2i')); });
assert.throws(function () {atan2('string', 1)});
assert.throws(function () {atan2(unit('5cm'), 1)});

// test cos
approxEqual(cos(0), 1);
approxEqual(cos(pi*1/4), 0.707106781186548);
approxEqual(cos(pi*1/8), 0.923879532511287);
approxEqual(cos(pi*2/4), 0);
approxEqual(cos(pi*3/4), -0.707106781186548);
approxEqual(cos(pi*4/4), -1);
approxEqual(cos(pi*5/4), -0.707106781186548);
approxEqual(cos(pi*6/4), 0);
approxEqual(cos(pi*7/4), 0.707106781186548);
approxEqual(cos(pi*8/4), 1);
approxEqual(cos(pi/4), math.sqrt(2)/2);

assert.deepEqual(cos(complex('2+3i')).toString(), '-4.1896 - 9.1092i');
assert.deepEqual(cos(complex('2-3i')).toString(), '-4.1896 + 9.1092i');
assert.deepEqual(cos(complex('-2+3i')).toString(), '-4.1896 + 9.1092i');
assert.deepEqual(cos(complex('-2-3i')).toString(), '-4.1896 - 9.1092i');
assert.deepEqual(cos(complex('i')).toString(), '1.5431');
assert.deepEqual(cos(complex('1')).toString(), '0.5403');
assert.deepEqual(cos(complex('1+i')).toString(), '0.83373 - 0.9889i');

var cos123 = [0.540302305868140, -0.41614683654714, -0.989992496600445];
approxDeepEqual(cos([1,2,3]), cos123);
approxDeepEqual(cos(math.range('1:3')), cos123);
approxDeepEqual(cos(matrix([1,2,3])), matrix(cos123));

approxEqual(cos(unit('45deg')), 0.707106781186548);
approxEqual(cos(unit('-135deg')), -0.707106781186548);
assert.throws(function () {cos('string')});
assert.throws(function () {cos(unit('5 celsius'))});

// test cot
approxEqual(cot(0), Infinity);
approxEqual(1 / cot(pi*1/4), 1);
approxEqual(1 / cot(pi*1/8), 0.414213562373095);
approxEqual(cot(pi*2/4), 0);
approxEqual(1 / cot(pi*3/4), -1);
approxEqual(1 / cot(pi*4/4), 0);
approxEqual(1 / cot(pi*5/4), 1);
approxEqual(cot(pi*6/4), 0);
approxEqual(1 / cot(pi*7/4), -1);
approxEqual(1 / cot(pi*8/4), 0);

re = 0.00373971037633696;
im = 0.99675779656935837;
approxDeepEqual(cot(complex('2+3i')), complex(-re, -im));
approxDeepEqual(cot(complex('2-3i')), complex(-re, im));
approxDeepEqual(cot(complex('-2+3i')), complex(re, -im));
approxDeepEqual(cot(complex('-2-3i')), complex(re, im));
approxDeepEqual(cot(complex('i')), complex(0, -1.313035285499331));
approxEqual(cot(complex('1')), 0.642092615934331);
approxDeepEqual(cot(complex('1+i')), complex(0.217621561854403, -0.868014142895925));

var cot123 = [0.642092615934331, -0.457657554360286, -7.015252551434534];
approxDeepEqual(cot([1,2,3]), cot123);
approxDeepEqual(cot(math.range('1:3')), cot123);
approxDeepEqual(cot(matrix([1,2,3])), matrix(cot123));

approxEqual(cot(unit('45deg')), 1);
approxEqual(cot(unit('-45deg')), -1);
assert.throws(function () {cot('string')});
assert.throws(function () {cot(unit('5 celsius'))});


// test csc
approxEqual(1 / csc(0), 0);
approxEqual(1 / csc(pi*1/4), 0.707106781186548);
approxEqual(1 / csc(pi*1/8), 0.382683432365090);
approxEqual(1 / csc(pi*2/4), 1);
approxEqual(1 / csc(pi*3/4), 0.707106781186548);
approxEqual(1 / csc(pi*4/4), 0);
approxEqual(1 / csc(pi*5/4), -0.707106781186548);
approxEqual(1 / csc(pi*6/4), -1);
approxEqual(1 / csc(pi*7/4), -0.707106781186548);
approxEqual(1 / csc(pi*8/4), 0);
approxEqual(1 / csc(pi/4), math.sqrt(2)/2);

re = 0.0904732097532074;
im = 0.0412009862885741;
approxDeepEqual(csc(complex('2+3i')), complex(re, im));
approxDeepEqual(csc(complex('2-3i')), complex(re, -im));
approxDeepEqual(csc(complex('-2+3i')), complex(-re, im));
approxDeepEqual(csc(complex('-2-3i')), complex(-re, -im));
approxDeepEqual(csc(complex('i')), complex(0, -0.850918128239322));
approxEqual(csc(complex('1')), 1.18839510577812);
approxDeepEqual(csc(complex('1+i')), complex(0.621518017170428, -0.303931001628426));

var csc123 = [1.18839510577812, 1.09975017029462, 7.08616739573719];
approxDeepEqual(csc([1,2,3]), csc123);
approxDeepEqual(csc(math.range('1:3')), csc123);
approxDeepEqual(csc(matrix([1,2,3])), matrix(csc123));

approxEqual(csc(unit('45deg')), 1.41421356237310);
approxEqual(csc(unit('-45deg')), -1.41421356237310);
assert.throws(function () {csc('string')});
assert.throws(function () {csc(unit('5 celsius'))});

// test sec
approxEqual(1 / sec(0), 1);
approxEqual(1 / sec(pi*1/4), 0.707106781186548);
approxEqual(1 / sec(pi*1/8), 0.923879532511287);
approxEqual(1 / sec(pi*2/4), 0);
approxEqual(1 / sec(pi*3/4), -0.707106781186548);
approxEqual(1 / sec(pi*4/4), -1);
approxEqual(1 / sec(pi*5/4), -0.707106781186548);
approxEqual(1 / sec(pi*6/4), 0);
approxEqual(1 / sec(pi*7/4), 0.707106781186548);
approxEqual(1 / sec(pi*8/4), 1);
approxEqual(1 / sec(pi/4), math.sqrt(2)/2);

approxEqual(math.pow(sec(pi/4), 2), 2);
approxEqual(sec(0), 1);
approxEqual(sec(pi), -1);
approxEqual(sec(-pi), -1);
approxEqual(math.pow(sec(-pi/4), 2), 2);
approxEqual(sec(2*pi), 1);
approxEqual(sec(-2*pi), 1);

assert.deepEqual(sec(complex('2+3i')).toString(), '-0.041675 + 0.090611i');
assert.deepEqual(sec(complex('2-3i')).toString(), '-0.041675 - 0.090611i');
assert.deepEqual(sec(complex('-2+3i')).toString(), '-0.041675 - 0.090611i');
assert.deepEqual(sec(complex('-2-3i')).toString(), '-0.041675 + 0.090611i');
assert.deepEqual(sec(complex('i')).toString(), '0.64805');
assert.deepEqual(sec(complex('1')).toString(), '1.8508');
assert.deepEqual(sec(complex('1+i')).toString(), '0.49834 + 0.59108i');

var sec123 = [1.85081571768093, -2.40299796172238, -1.01010866590799];
approxDeepEqual(sec([1,2,3]), sec123);
approxDeepEqual(sec(math.range('1:3')), sec123);
approxDeepEqual(sec(matrix([1,2,3])), matrix(sec123));

approxEqual(sec(unit('45deg')), 1.41421356237310);
approxEqual(sec(unit('-45deg')), 1.41421356237310);
assert.throws(function () {sec('string')});
assert.throws(function () {sec(unit('5 celsius'))});


// test sin
approxEqual(sin(0), 0);
approxEqual(sin(pi*1/4), 0.707106781186548);
approxEqual(sin(pi*1/8), 0.382683432365090);
approxEqual(sin(pi*2/4), 1);
approxEqual(sin(pi*3/4), 0.707106781186548);
approxEqual(sin(pi*4/4), 0);
approxEqual(sin(pi*5/4), -0.707106781186548);
approxEqual(sin(pi*6/4), -1);
approxEqual(sin(pi*7/4), -0.707106781186548);
approxEqual(sin(pi*8/4), 0);
approxEqual(sin(pi/4), math.sqrt(2)/2);

assert.deepEqual(sin(complex('2+3i')).toString(), '9.1545 - 4.1689i');
assert.deepEqual(sin(complex('2-3i')).toString(), '9.1545 + 4.1689i');
assert.deepEqual(sin(complex('-2+3i')).toString(), '-9.1545 - 4.1689i');
assert.deepEqual(sin(complex('-2-3i')).toString(), '-9.1545 + 4.1689i');
assert.deepEqual(sin(complex('i')).toString(), '1.1752i');
assert.deepEqual(sin(complex('1')).toString(), '0.84147');
assert.deepEqual(sin(complex('1+i')).toString(), '1.2985 + 0.63496i');

var sin123 = [0.84147098480789, 0.909297426825682, 0.141120008059867];
approxDeepEqual(sin([1,2,3]), sin123);
approxDeepEqual(sin(math.range('1:3')), sin123);
approxDeepEqual(sin(matrix([1,2,3])), matrix(sin123));

approxEqual(sin(unit('45deg')), 0.707106781186548);
approxEqual(sin(unit('-45deg')), -0.707106781186548);
assert.throws(function () {sin('string')});
assert.throws(function () {sin(unit('5 celsius'))});


// test tan
var tan = tan;
approxEqual(tan(0), 0);
approxEqual(tan(pi*1/4), 1);
approxEqual(tan(pi*1/8), 0.414213562373095);
assert.ok(tan(pi*2/4) > 1e10);
approxEqual(tan(pi*3/4), -1);
approxEqual(tan(pi*4/4), 0);
approxEqual(tan(pi*5/4), 1);
assert.ok(tan(pi*6/4) > 1e10);
approxEqual(tan(pi*7/4), -1);
approxEqual(tan(pi*8/4), 0);

var tan123 = [1.557407724654902, -2.185039863261519, -0.142546543074278];
approxDeepEqual(tan([1,2,3]), tan123);
(tan(math.range('1:3')), tan123);
approxDeepEqual(tan(matrix([1,2,3])), matrix(tan123));

assert.deepEqual(tan(complex('2+3i')).toString(), '-0.003764 + 1.0032i');
assert.deepEqual(tan(complex('2-3i')).toString(), '-0.003764 - 1.0032i');
assert.deepEqual(tan(complex('-2+3i')).toString(), '0.003764 + 1.0032i');
assert.deepEqual(tan(complex('-2-3i')).toString(), '0.003764 - 1.0032i');
assert.deepEqual(tan(complex('i')).toString(), '0.76159i');
assert.deepEqual(tan(complex('1')).toString(), '1.5574');
assert.deepEqual(tan(complex('1+i')).toString(), '0.27175 + 1.0839i');

approxEqual(tan(unit(' 60deg')), math.sqrt(3));
approxEqual(tan(unit('-135deg')), 1);
assert.throws(function () {tan('string')});
assert.throws(function () {tan(unit('5 celsius'))});
math.range(0, 0.1, 1).forEach(function (value) {
    approxEqual(tan(value), sin(value) / cos(value));
});
