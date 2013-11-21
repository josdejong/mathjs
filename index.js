var object = require('./lib/util/object');

/**
 * math.js factory function.
 *
 * Usage:
 *
 *     var math = mathjs();
 *     var math = mathjs(options);
 *
 * @param {Object} [options]  Available options:
 *                            {String} matrix.defaultType
 *                              A string 'matrix' (default) or 'array'.
 *                            {String} number.defaultType
 *                              A string 'number' (default) or 'bignumber'
 */
function mathjs (options) {
  // create new namespace
  var math = {};

  // create configuration options
  // TODO: change options to properties with getters to validate the input value
  var opt = {
    matrix: {
      // type of default matrix output. Choose 'matrix' (default) or 'array'
      'defaultType': 'matrix'
    },
    number: {
      // type of default number output. Choose 'number' (default) or 'bignumber'
      'defaultType': 'number'
      // TODO: add more options for BigNumber
      // TODO: check all functions to see whether they need to support BigNumber output
    }
  };

  // merge options
  object.deepExtend(opt, options);

  // TODO: remove deprecated options some day (deprecated since version 0.15.0)
  if (options && options.precision) {
    throw new Error('Option options.precision is deprecated. ' +
        'Use math.format(value, precision) instead.')
  }
  if (options && options.matrix && options.matrix.default) {
    throw new Error('Option math.options.matrix.default is deprecated. ' +
        'Use math.options.matrix.defaultType instead.')
  }


  // expression (Parser, Scope, nodes, docs)
  math.expression = {};
  math.expression.node = require('./lib/expression/node/index.js');
  math.expression.Scope = require('./lib/expression/Scope.js');
  math.expression.Parser = require('./lib/expression/Parser.js');
  math.expression.docs = require('./lib/expression/docs/index.js');

  // TODO: deprecated since version 0.13.0. cleanup deprecated stuff some day
  math.expr = {};
  math.expr.Scope = function () {
    throw new Error('Moved to math.expression.Scope');
  };
  math.expr.Parser = function () {
    throw new Error('Moved to math.expression.Parser');
  };


  // types (Matrix, Complex, Unit, ...)
  math.type = {};
  math.type.BigNumber = require('bignumber.js');
  math.type.Complex = require('./lib/type/Complex.js');
  math.type.Range = require('./lib/type/Range.js');
  math.type.Index = require('./lib/type/Index.js');
  math.type.Matrix = require('./lib/type/Matrix.js');
  math.type.Unit = require('./lib/type/Unit.js');
  math.type.Help = require('./lib/type/Help.js');

  math.collection = require('./lib/type/collection.js');


  // expression parser
  require('./lib/function/expression/eval.js')(math, opt);
  require('./lib/function/expression/help.js')(math, opt);
  require('./lib/function/expression/parse.js')(math, opt);

  // functions - arithmetic
  require('./lib/function/arithmetic/abs.js')(math, opt);
  require('./lib/function/arithmetic/add.js')(math, opt);
  require('./lib/function/arithmetic/add.js')(math, opt);
  require('./lib/function/arithmetic/ceil.js')(math, opt);
  require('./lib/function/arithmetic/cube.js')(math, opt);
  require('./lib/function/arithmetic/divide.js')(math, opt);
  require('./lib/function/arithmetic/edivide.js')(math, opt);
  require('./lib/function/arithmetic/emultiply.js')(math, opt);
  require('./lib/function/arithmetic/epow.js')(math, opt);
  require('./lib/function/arithmetic/equal.js')(math, opt);
  require('./lib/function/arithmetic/exp.js')(math, opt);
  require('./lib/function/arithmetic/fix.js')(math, opt);
  require('./lib/function/arithmetic/floor.js')(math, opt);
  require('./lib/function/arithmetic/gcd.js')(math, opt);
  require('./lib/function/arithmetic/larger.js')(math, opt);
  require('./lib/function/arithmetic/largereq.js')(math, opt);
  require('./lib/function/arithmetic/lcm.js')(math, opt);
  require('./lib/function/arithmetic/log.js')(math, opt);
  require('./lib/function/arithmetic/log10.js')(math, opt);
  require('./lib/function/arithmetic/mod.js')(math, opt);
  require('./lib/function/arithmetic/multiply.js')(math, opt);
  require('./lib/function/arithmetic/pow.js')(math, opt);
  require('./lib/function/arithmetic/round.js')(math, opt);
  require('./lib/function/arithmetic/sign.js')(math, opt);
  require('./lib/function/arithmetic/smaller.js')(math, opt);
  require('./lib/function/arithmetic/smallereq.js')(math, opt);
  require('./lib/function/arithmetic/sqrt.js')(math, opt);
  require('./lib/function/arithmetic/square.js')(math, opt);
  require('./lib/function/arithmetic/subtract.js')(math, opt);
  require('./lib/function/arithmetic/unary.js')(math, opt);
  require('./lib/function/arithmetic/unequal.js')(math, opt);
  require('./lib/function/arithmetic/xgcd.js')(math, opt);

  // functions - complex
  require('./lib/function/complex/arg.js')(math, opt);
  require('./lib/function/complex/conj.js')(math, opt);
  require('./lib/function/complex/re.js')(math, opt);
  require('./lib/function/complex/im.js')(math, opt);

  // functions - construction
  require('./lib/function/construction/bignumber')(math, opt);
  require('./lib/function/construction/boolean.js')(math, opt);
  require('./lib/function/construction/complex.js')(math, opt);
  require('./lib/function/construction/index.js')(math, opt);
  require('./lib/function/construction/matrix.js')(math, opt);
  require('./lib/function/construction/number.js')(math, opt);
  require('./lib/function/construction/parser.js')(math, opt);
  require('./lib/function/construction/string.js')(math, opt);
  require('./lib/function/construction/unit.js')(math, opt);

  // functions - matrix
  require('./lib/function/matrix/concat.js')(math, opt);
  require('./lib/function/matrix/det.js')(math, opt);
  require('./lib/function/matrix/diag.js')(math, opt);
  require('./lib/function/matrix/eye.js')(math, opt);
  require('./lib/function/matrix/inv.js')(math, opt);
  require('./lib/function/matrix/ones.js')(math, opt);
  require('./lib/function/matrix/range.js')(math, opt);
  require('./lib/function/matrix/resize.js')(math, opt);
  require('./lib/function/matrix/size.js')(math, opt);
  require('./lib/function/matrix/squeeze.js')(math, opt);
  require('./lib/function/matrix/subset.js')(math, opt);
  require('./lib/function/matrix/transpose.js')(math, opt);
  require('./lib/function/matrix/zeros.js')(math, opt);

  // functions - probability
  require('./lib/function/probability/factorial.js')(math, opt);
  require('./lib/function/probability/random.js')(math, opt);

  // functions - statistics
  require('./lib/function/statistics/min.js')(math, opt);
  require('./lib/function/statistics/max.js')(math, opt);
  require('./lib/function/statistics/mean.js')(math, opt);

  // functions - trigonometry
  require('./lib/function/trigonometry/acos.js')(math, opt);
  require('./lib/function/trigonometry/asin.js')(math, opt);
  require('./lib/function/trigonometry/atan.js')(math, opt);
  require('./lib/function/trigonometry/atan2.js')(math, opt);
  require('./lib/function/trigonometry/cos.js')(math, opt);
  require('./lib/function/trigonometry/cot.js')(math, opt);
  require('./lib/function/trigonometry/csc.js')(math, opt);
  require('./lib/function/trigonometry/sec.js')(math, opt);
  require('./lib/function/trigonometry/sin.js')(math, opt);
  require('./lib/function/trigonometry/tan.js')(math, opt);

  // functions - units
  require('./lib/function/units/in.js')(math, opt);

  // functions - utils
  require('./lib/function/utils/clone.js')(math, opt);
  require('./lib/function/utils/format.js')(math, opt);
  require('./lib/function/utils/import.js')(math, opt);
  require('./lib/function/utils/map.js')(math, opt);
  require('./lib/function/utils/print.js')(math, opt);
  require('./lib/function/utils/select.js')(math, opt);
  require('./lib/function/utils/typeof.js')(math, opt);
  require('./lib/function/utils/forEach.js')(math, opt);

  // constants
  require('./lib/constants.js')(math, opt);

  // selector (we initialize after all functions are loaded)
  math.chaining = {};
  math.chaining.Selector = require('./lib/chaining/Selector.js')(math, opt);

  // TODO: deprecated since version 0.13.0. Cleanup some day
  math.expr.Selector = function () {
    throw new Error('Moved to math.expression.Selector');
  };

  // return the new instance
  return math;
}


// return the mathjs factory
module.exports = mathjs;

// error messages for deprecated static library (deprecated since v0.15.0) TODO: remove some day
var placeholder = function () {
  throw new Error('Static function calls are deprecated. Create an instance of math.js:\n\t"var math = require(\'mathjs\')();" on node.js, \n\t"var math = mathjs();" in the browser.');
};
var instance = mathjs();
for (var prop in instance) {
  if (instance.hasOwnProperty(prop)) {
    var fn = instance[prop];
    if (typeof fn === 'function') {
      mathjs[prop] = placeholder;
    }
    else {
      if (Object.defineProperty) {
        Object.defineProperty(mathjs, prop, {
          get: placeholder,
          set: placeholder,
          enumerable: true,
          configurable: false
        });
      }
    }
  }
}

if (typeof window !== 'undefined') {
  window.math = mathjs;
}