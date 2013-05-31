// test parser

var assert = require('assert'),
    math = require('../../math.js'),
    parser = math.parser(),
    matrix = math.matrix,
    range = math.range,
    round = math.round;

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

// test precedence
assert.equal(parser.eval('4-2+3'), 5);
assert.equal(parser.eval('4-(2+3)'), -1);
assert.equal(parser.eval('4-2-3'), -1);
assert.equal(parser.eval('4-(2-3)'), 5);

assert.equal(parser.eval('2+3*4'), 14);
assert.equal(parser.eval('2*3+4'), 10);
assert.equal(parser.eval('2*3^2'), 18);

assert.equal(parser.eval('2^3'), 8);
assert.equal(parser.eval('2^3^4'), Math.pow(2, Math.pow(3, 4)));
assert.equal(parser.eval('1.5^1.5^1.5'), parser.eval('1.5^(1.5^1.5)'));
assert.equal(parser.eval('1.5^1.5^1.5^1.5'), parser.eval('1.5^(1.5^(1.5^1.5))'));

assert.equal(parser.eval('-3^2'), -9);
assert.equal(parser.eval('(-3)^2'), 9);

assert.equal(parser.eval('2^3!'), 64);
assert.equal(parser.eval('2^(3!)'), 64);

assert.equal(parser.eval('-4!'), -24);
assert.equal(parser.eval('3!+2'), 8);

assert.deepEqual(parser.eval('[1,2;3,4]\' * 2').valueOf(), [[2,6],[4,8]]);
assert.deepEqual(parser.eval('[1,2;3,4]\' * [5,6;7,8]').valueOf(), [[26,30],[38,44]]);
assert.deepEqual(parser.eval('[1,2;3,4] * [5,6;7,8]\'').valueOf(), [[17,23],[39,53]]);
assert.deepEqual(parser.eval('[1,2;3,4]\'+2').valueOf(), [[3,5],[4,6]]);

// test numbers
assert.equal(parser.eval('3'), 3);
assert.equal(parser.eval('3.2'), 3.2);
assert.equal(parser.eval('003.2'), 3.2);
assert.equal(parser.eval('003.200'), 3.2);
assert.equal(parser.eval('.2'), 0.2);
assert.equal(parser.eval('2.'), 2);
assert.throws(function () {parser.eval('.'); });
assert.throws(function () {parser.eval('3.2.2'); });
assert.equal(parser.eval('3e2'), 300);
assert.equal(parser.eval('300e2'), 30000);
assert.equal(parser.eval('300e+2'), 30000);
assert.equal(parser.eval('300e-2'), 3);
assert.equal(parser.eval('300E-2'), 3);
assert.equal(parser.eval('3.2e2'), 320);
assert.throws(function () {parser.eval('3.2e2.2'); });


// test constants
assert.deepEqual(parser.eval('i'), math.complex(0, 1));
assert.deepEqual(parser.eval('pi'), Math.PI);


// test function calls
assert.equal(parser.eval('sqrt(4)'), 2);
assert.equal(parser.eval('sqrt(6+3)'), 3);
assert.equal(parser.eval('atan2(2,2)'), 0.7853981633974483);

// test variables
assert.equal(parser.eval('a = 0.75'), 0.75);
assert.equal(parser.eval('a + 2'), 2.75);
assert.equal(parser.eval('a = 2'), 2);
assert.equal(parser.eval('a + 2'), 4);
approxEqual(parser.eval('pi * 2'), 6.283185307179586);
parser.remove('a');
assert.throws(function() {parser.eval('a + 2'); }); // TODO: throws an stack overflow

// test nested variable assignments
assert.equal(parser.eval('c = d = (e = 4.5)'), 4.5);
assert.equal(parser.get('c'), 4.5);
assert.equal(parser.get('d'), 4.5);
assert.equal(parser.get('e'), 4.5);
assert.deepEqual(parser.eval('a = [1,2,f=3]'), matrix([[1,2,3]]));
assert.equal(parser.get('f'), 3);
assert.equal(parser.eval('2 + (g = 3 + 4)'), 9);
assert.equal(parser.get('g'), 7);
assert.throws(function () {parser.eval('a(j = 3)')}, SyntaxError);


// test function assignments
parser.eval('x=100'); // for testing scoping of the function variables
assert.equal(parser.eval('function f(x) = x^2'), 'f(x)');
assert.equal(parser.eval('f(3)'), 9);
assert.equal(parser.eval('x'), 100);
assert.equal(parser.eval('function g(x, y) = x^y'), 'g(x, y)');
assert.equal(parser.eval('g(4,5)'), 1024);
var g = parser.eval('g');


// test range
assert.ok(parser.eval('2:5') instanceof math.type.Range);
assert.deepEqual(parser.eval('2:5').toArray(), [2,3,4,5]);
assert.deepEqual(parser.eval('10:-2:2').toArray(), [10,8,6,4,2]);

// test matrix
parser.set('a', matrix([
    [1,2,3],
    [4,5,6],
    [7,8,9]
]));
assert.deepEqual(parser.eval('a(2, :)'),        matrix([[4,5,6]]));
assert.deepEqual(parser.eval('a(2, :2)'),       matrix([[4,5]]));
assert.deepEqual(parser.eval('a(2, :end-1)'),   matrix([[4,5]]));
assert.deepEqual(parser.eval('a(2, 2:)'),       matrix([[5,6]]));
assert.deepEqual(parser.eval('a(2, 2:3)'),      matrix([[5,6]]));
assert.deepEqual(parser.eval('a(2, 1:2:3)'),    matrix([[4,6]]));
assert.deepEqual(parser.eval('a(:, 2)'),        matrix([[2],[5],[8]]));
assert.deepEqual(parser.eval('a(:2, 2)'),       matrix([[2],[5]]));
assert.deepEqual(parser.eval('a(:end-1, 2)'),   matrix([[2],[5]]));
assert.deepEqual(parser.eval('a(2:, 2)'),       matrix([[5],[8]]));
assert.deepEqual(parser.eval('a(2:3, 2)'),      matrix([[5],[8]]));
assert.deepEqual(parser.eval('a(1:2:3, 2)'),    matrix([[2],[8]]));
// TODO: implement and test support for Array (instead of Matrix)

// test matrix resizing
assert.deepEqual(parser.eval('a = []'),    matrix([[]]));
assert.deepEqual(parser.eval('a(1:3,1) = [1;2;3]'), matrix([[1],[2],[3]]));
assert.deepEqual(parser.eval('a(:,2) = [4;5;6]'), matrix([[1,4],[2,5],[3,6]]));

assert.deepEqual(parser.eval('a = []'),    matrix([[]]));
assert.deepEqual(parser.eval('a(1,3) = 3'), matrix([[0,0,3]]));
assert.deepEqual(parser.eval('a(2,:) = [4,5,6]'), matrix([[0,0,3],[4,5,6]]));

assert.deepEqual(parser.eval('a = []'),    matrix([[]]));
assert.deepEqual(parser.eval('a(3,1) = 3'), matrix([[0],[0],[3]]));
assert.deepEqual(parser.eval('a(:,2) = [4;5;6]'), matrix([[0,4],[0,5],[3,6]]));

assert.deepEqual(parser.eval('a = []'),    matrix([[]]));
assert.deepEqual(parser.eval('a(1,1:3) = [1,2,3]'), matrix([[1,2,3]]));
assert.deepEqual(parser.eval('a(2,:) = [4,5,6]'), matrix([[1,2,3],[4,5,6]]));

// test matrix sizes
assert.ok(parser.eval('[1,2;3,4]') instanceof math.type.Matrix);
var m = parser.eval('[1,2,3;4,5,6]');
assert.deepEqual(m.size(), [2,3]);
assert.deepEqual(m.valueOf(), [[1,2,3],[4,5,6]]);
var b = parser.eval('[5, 6; 1, 1]');
assert.deepEqual(b.size(), [2,2]);
assert.deepEqual(b.valueOf(), [[5,6],[1,1]]);
b.set([2, [1, 2]], [[7, 8]]);
assert.deepEqual(b.size(), [2,2]);
assert.deepEqual(b.valueOf(), [[5,6],[7,8]]);
assert.deepEqual(parser.eval('[ ]').valueOf(), [[]]);

// test matrix get/set submatrix
parser.eval('a=[1,2;3,4]');
parser.eval('a(1,1) = 100');
assert.deepEqual(parser.get('a').size(), [2,2]);
assert.deepEqual(parser.get('a').valueOf(), [[100,2],[3,4]]);
parser.eval('a(2:3,2:3) = [10,11;12,13]');
assert.deepEqual(parser.get('a').size(), [3,3]);
assert.deepEqual(parser.get('a').valueOf(), [[100,2,0],[3,10,11],[0,12,13]]);
var a = parser.get('a');
assert.deepEqual(a.get([math.range('1:3'), math.range('1:2')]).valueOf(), [[100,2],[3,10],[0,12]]);
assert.deepEqual(parser.eval('a(1:3,1:2)').valueOf(), [[100,2],[3,10],[0,12]]);

// test get/set matrix for 3d matrix
assert.deepEqual(parser.eval('f=[1,2;3,4]'), matrix([[1,2],[3,4]]));
assert.deepEqual(parser.eval('size(f)'), [2,2]);
/* TODO: doesn't work correctly
assert.deepEqual(parser.eval('f(:,:,2)=[5,6;7,8]'), matrix([
    [
        [1,2],
        [3,4]
    ],
    [
        [5,6],
        [7,8]
    ]
]));
*/
parser.set('f', matrix([
    [
        [1,5],
        [2,6]
    ],
    [
        [3,7],
        [4,8]
    ]
]));
assert.deepEqual(parser.eval('size(f)'), [2,2,2]);
assert.deepEqual(parser.eval('f(:,:,1)'), matrix([[[1],[2]],[[3],[4]]])); // TODO: last dimension should be squeezed
assert.deepEqual(parser.eval('f(:,:,2)'), matrix([[[5],[6]],[[7],[8]]])); // TODO: last dimension should be squeezed
assert.deepEqual(parser.eval('f(:,2,:)'), matrix([[[2,6]],[[4,8]]]));
assert.deepEqual(parser.eval('f(2,:,:)'), matrix([[[3,7],[4,8]]]));

parser.eval('a=diag([1,2,3,4])');
assert.deepEqual(parser.eval('a(3:end, 3:end)'), matrix([[3,0],[0,4]]));
assert.deepEqual(parser.eval('a(3:end, 2:end)=9*ones(2,3)'), matrix([
    [1,0,0,0],
    [0,2,0,0],
    [0,9,9,9],
    [0,9,9,9]
]));
assert.deepEqual(parser.eval('a(2:end-1, 2:end-1)'), matrix([[2,0],[9,9]]));


// test matrix concatenation
parser = math.parser();
parser.eval('a=[1,2;3,4]');
parser.eval('b=[5,6;7,8]');
assert.deepEqual(parser.eval('c=[a,b]'), matrix([[1,2,5,6],[3,4,7,8]]));
assert.deepEqual(parser.eval('c=[a;b]'), matrix([[1,2],[3,4],[5,6],[7,8]]));
assert.deepEqual(parser.eval('c=[a,b;b,a]'), matrix([[1,2,5,6],[3,4,7,8],[5,6,1,2],[7,8,3,4]]));
assert.deepEqual(parser.eval('c=[[1,2]; [3,4]]'), matrix([[1,2],[3,4]]));
assert.deepEqual(parser.eval('c=[1; [2;3]]'), matrix([[1],[2],[3]]));
assert.deepEqual(parser.eval('d=1:3'), range(1,3));  // d is a Range
assert.deepEqual(parser.eval('[d,d]'), matrix([[1,2,3,1,2,3]]));
assert.deepEqual(parser.eval('[d;d]'), matrix([[1,2,3],[1,2,3]]));
assert.deepEqual(parser.eval('e=1+d'), [2,3,4]);  // e is an Array
assert.deepEqual(parser.eval('size(e)'), [3]);
assert.deepEqual(parser.eval('[e,e]'), matrix([[2,3,4,2,3,4]]));
assert.deepEqual(parser.eval('[e;e]'), matrix([[2,3,4],[2,3,4]]));
assert.deepEqual(parser.eval('[[],[]]'), matrix([[]]));
assert.deepEqual(parser.eval('[[],[]]').size(), [0, 0]);
assert.throws(function () {parser.eval('c=[a; [1,2,3] ]')});

// test matrix transpose
assert.deepEqual(parser.eval('[1,2,3;4,5,6]\'').valueOf(), [[1,4],[2,5],[3,6]]);
assert.ok(parser.eval('[1,2,3;4,5,6]\'') instanceof math.type.Matrix);
assert.deepEqual(parser.eval('23\'').valueOf(), 23);
assert.deepEqual(parser.eval('[1:4]').valueOf(), [[1,2,3,4]]);
assert.deepEqual(parser.eval('[1:4]\'').valueOf(), [[1],[2],[3],[4]]);
assert.deepEqual(parser.eval('size([1:4])').valueOf(), [1, 4]);

// test element wise operators
assert.deepEqual(parser.eval('2.*3'), 6);
assert.deepEqual(parser.eval('2 .* 3'), 6);
assert.deepEqual(parser.eval('2. * 3'), 6);
assert.deepEqual(parser.eval('2 .^ 3'), 8);
assert.deepEqual(parser.eval('4./2'), 2);
assert.deepEqual(parser.eval('4 ./ 2'), 2);
assert.deepEqual(parser.eval('a=3; a.*4'), [12]);
assert.deepEqual(parser.eval('[1,2,3] .* [1,2,3]'), matrix([[1,4,9]]));
assert.deepEqual(parser.eval('[1,2,3] ./ [1,2,3]'), matrix([[1,1,1]]));
assert.deepEqual(parser.eval('[2,3] .^ [2,3]'), matrix([[4,27]]));


// test unit
assert.equal(parser.eval('5cm').toString(), '50 mm');
assert.ok(parser.eval('5cm') instanceof math.type.Unit);
//assert.equal(parser.eval('5.08 cm * 1000 in inch').toString(), '2000 inch'); // TODO: this gives an error
assert.equal(parser.eval('(5.08 cm * 1000) in inch').toString(), '2000 inch');
assert.equal(parser.eval('(5.08 cm * 1000) in mm').toString(), '50800 mm');
assert.equal(parser.eval('ans in inch').toString(), '2000 inch');

parser = math.parser();
assert.equal(parser.eval('a = 3'), 3);
assert.equal(parser.eval('function f(x) = a * x'), 'f(x)');
assert.equal(parser.eval('f(2)'), 6);
assert.equal(parser.eval('a = 5'), 5);
assert.equal(parser.eval('f(2)'), 10);
assert.equal(parser.eval('function g(x) = x^q'), 'g(x)');
assert.throws(function () {
    parser.eval('g(3)')
}, function (err) {
    return (err instanceof Error) && (err.toString() == 'Error: Undefined symbol q');
});
assert.equal(parser.eval('q = 4/2'), 2);
assert.equal(parser.eval('g(3)'), 9);

// test undefined symbols, defining symbols, and removing symbols
parser = math.parser();
var n = parser.parse('q');
assert.throws(function () { n.eval(); });
parser.eval('q=33');
assert.equal(n.eval(), 33);
parser.remove('q');
assert.throws(function () { n.eval(); });

n = parser.parse('qq(1,1)=33');
assert.throws(function () { n.eval(); });
parser.eval('qq=[1,2;3,4]');
assert.deepEqual(n.eval(), matrix([[33,2],[3,4]]));
parser.eval('qq=[4]');
assert.deepEqual(n.eval(), matrix([[33]]));
parser.remove('qq');
assert.throws(function () { n.eval(); });


// TODO: extensively test the Parser
