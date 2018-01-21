// test performance of the expression parser in node.js

// browserify benchmark/expression_parser.js -o ./benchmark_expression_parser.js

var assert = require('assert');
var Benchmark = require('benchmark');
var padRight = require('pad-right');
var math = require('../index');
var getSafeProperty = require('../lib/utils/customs').getSafeProperty


if (typeof window !== 'undefined') {
  window['Benchmark'] = Benchmark;
}

function pad (text) {
  return padRight(text, 40, ' ');
}

var expr = '2 + 3 * sin(pi / 4) - 4x';
var scope = {x: 2};
var compiled = math.parse(expr).compileWithEval();
var compiledWithoutEval = math.parse(expr).compile(math, {});

var sin = getSafeProperty(math, 'sin');
var pi = getSafeProperty(math, 'pi');
var compiledPlainJs = {
  eval: function (scope) {
    return 2 + 3 * ('sin' in scope ? getSafeProperty(scope, 'sin') :  sin)(('pi' in scope ? getSafeProperty(scope, 'pi') : pi) / 4) - 4 * scope['x']
  }
}

var fExpr = 'f(x) = 2 + 3 * sin(pi / 4) - 4x';
var f = math.parse(fExpr).compileWithEval().eval();
var fWithoutEval = math.parse(fExpr).compile().eval();

var correctResult = -3.878679656440358;

console.log('expression:', expr);
console.log('scope:', scope);
console.log('result:', correctResult);

assertApproxEqual(compiled.eval(scope), correctResult, 1e-7);
assertApproxEqual(compiledWithoutEval.eval(scope), correctResult, 1e-7);
assertApproxEqual(compiledPlainJs.eval(scope), correctResult, 1e-7);
assertApproxEqual(f(scope.x), correctResult, 1e-7);
assertApproxEqual(fWithoutEval(scope.x), correctResult, 1e-7);

var total = 0;

var suite = new Benchmark.Suite();
suite
    .add(pad('(plain js) evaluate'), function() {
      total+= compiledPlainJs.eval(scope);
    })

    .add(pad('(with eval) parse'), function() {
      var node = math.parse(expr);
    })
    .add(pad('(with eval) parse, compile'), function() {
      var node = math.parse(expr).compileWithEval();
    })
    .add(pad('(with eval) parse, compile, evaluate'), function() {
      total+= math.eval(expr, scope);
    })
    .add(pad('(with eval) evaluate'), function() {
      total+= compiled.eval(scope);
    })

    .add(pad('(without eval) parse'), function() {
      var node = math.parse(expr);
    })
    .add(pad('(without eval) parse, compile'), function() {
      var node = math.parse(expr).compile();
    })
    .add(pad('(without eval) parse, compile, evaluate'), function() {
      total+= math.parse(expr).compile().eval(scope);
    })
    .add(pad('(without eval) evaluate'), function() {
      total+= compiledWithoutEval.eval(scope);
    })

    .add(pad('f(x) (with eval)'), function() {
      total+= f(2);
    })
    .add(pad('f(x) (without eval)'), function() {
      total+= fWithoutEval(2);
    })

    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      // we count at total to prevent the browsers from not executing
      // the benchmarks ("dead code") when the results would not be used.
      if (total > 1e6) { 
        console.log('')
      }
      else {
        console.log('')
      }
    })
    .run();


function assertApproxEqual(actual, expected, tolerance) {
  var diff = Math.abs(expected - actual);
  if (diff > tolerance) assert.equal(actual, expected);
  else assert.ok(diff <= tolerance, actual + ' === ' + expected);
};
