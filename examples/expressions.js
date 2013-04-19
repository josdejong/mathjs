// expressions can be evaluated in two ways:
// - using the function math.eval (uses a read-only parser)
// - using a parser

// load math.js
var math = require('../math.js');

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
    console.log(math.format(value));
}

// function math.eval
console.log('evaluate with math.eval');
print(math.eval('sqrt(3^2 + 4^2)'));    // 5
print(math.eval('sqrt(-4)'));           // 2i
print(math.eval('2 inch in cm'));       // 5.08 cm
print(math.eval('cos(45 deg)'));        // 0.7071067811865476
console.log();


// create a parser
var parser = math.parser();

// evaluate with parser
console.log('evaluate with parser');
print(parser.eval('sqrt(3^2 + 4^2)'));          // 5
print(parser.eval('sqrt(-4)'));                 // 2i
print(parser.eval('2 inch in cm'));             // 5.08 cm
print(parser.eval('cos(45 deg)'));              // 0.7071067811865476
console.log();

// define variables and functions
console.log('define variables and functions');
print(parser.eval('x = 7 / 2'));                // 3.5
print(parser.eval('x + 3'));                    // 6.5
print(parser.eval('function f(x, y) = x^y'));   // f(x, y)
print(parser.eval('f(2, 3)'));                  // 8
console.log();

// get and set variables and functions
console.log('get and set variables and function in the scope of the parser');
var x = parser.get('x');                        // x = 7
console.log('x=', x);
var f = parser.get('f');                        // f = function
console.log('f=', f);
var g = f(3, 3);                                // g = 27
console.log('g=', g);

parser.set('h', 500);
print(parser.eval('h / 2'));                    // 250
parser.set('hello', function (name) {
    return 'hello, ' + name + '!';
});
print(parser.eval('hello("user")'));            // "hello, user!"
console.log();

// clear defined functions and variables
parser.clear();
