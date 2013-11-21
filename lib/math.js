var object = require('./util/object');

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
  math.expression.node = require('./expression/node/index.js');
  math.expression.Scope = require('./expression/Scope.js');
  math.expression.Parser = require('./expression/Parser.js');
  math.expression.docs = require('./expression/docs/index.js');

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
  math.type.Complex = require('./type/Complex.js');
  math.type.Range = require('./type/Range.js');
  math.type.Index = require('./type/Index.js');
  math.type.Matrix = require('./type/Matrix.js');
  math.type.Unit = require('./type/Unit.js');
  math.type.Help = require('./type/Help.js');

  math.collection = require('./type/collection.js');


  // expression parser
  require('./function/expression/eval.js')(math, opt);
  require('./function/expression/help.js')(math, opt);
  require('./function/expression/parse.js')(math, opt);

  // functions - arithmetic
  require('./function/arithmetic/abs.js')(math, opt);
  require('./function/arithmetic/add.js')(math, opt);
  require('./function/arithmetic/add.js')(math, opt);
  require('./function/arithmetic/ceil.js')(math, opt);
  require('./function/arithmetic/cube.js')(math, opt);
  require('./function/arithmetic/divide.js')(math, opt);
  require('./function/arithmetic/edivide.js')(math, opt);
  require('./function/arithmetic/emultiply.js')(math, opt);
  require('./function/arithmetic/epow.js')(math, opt);
  require('./function/arithmetic/equal.js')(math, opt);
  require('./function/arithmetic/exp.js')(math, opt);
  require('./function/arithmetic/fix.js')(math, opt);
  require('./function/arithmetic/floor.js')(math, opt);
  require('./function/arithmetic/gcd.js')(math, opt);
  require('./function/arithmetic/larger.js')(math, opt);
  require('./function/arithmetic/largereq.js')(math, opt);
  require('./function/arithmetic/lcm.js')(math, opt);
  require('./function/arithmetic/log.js')(math, opt);
  require('./function/arithmetic/log10.js')(math, opt);
  require('./function/arithmetic/mod.js')(math, opt);
  require('./function/arithmetic/multiply.js')(math, opt);
  require('./function/arithmetic/pow.js')(math, opt);
  require('./function/arithmetic/round.js')(math, opt);
  require('./function/arithmetic/sign.js')(math, opt);
  require('./function/arithmetic/smaller.js')(math, opt);
  require('./function/arithmetic/smallereq.js')(math, opt);
  require('./function/arithmetic/sqrt.js')(math, opt);
  require('./function/arithmetic/square.js')(math, opt);
  require('./function/arithmetic/subtract.js')(math, opt);
  require('./function/arithmetic/unary.js')(math, opt);
  require('./function/arithmetic/unequal.js')(math, opt);
  require('./function/arithmetic/xgcd.js')(math, opt);

  // functions - complex
  require('./function/complex/arg.js')(math, opt);
  require('./function/complex/conj.js')(math, opt);
  require('./function/complex/re.js')(math, opt);
  require('./function/complex/im.js')(math, opt);

  // functions - construction
  require('./function/construction/bignumber')(math, opt);
  require('./function/construction/boolean.js')(math, opt);
  require('./function/construction/complex.js')(math, opt);
  require('./function/construction/index.js')(math, opt);
  require('./function/construction/matrix.js')(math, opt);
  require('./function/construction/number.js')(math, opt);
  require('./function/construction/parser.js')(math, opt);
  require('./function/construction/string.js')(math, opt);
  require('./function/construction/unit.js')(math, opt);

  // functions - matrix
  require('./function/matrix/concat.js')(math, opt);
  require('./function/matrix/det.js')(math, opt);
  require('./function/matrix/diag.js')(math, opt);
  require('./function/matrix/eye.js')(math, opt);
  require('./function/matrix/inv.js')(math, opt);
  require('./function/matrix/ones.js')(math, opt);
  require('./function/matrix/range.js')(math, opt);
  require('./function/matrix/resize.js')(math, opt);
  require('./function/matrix/size.js')(math, opt);
  require('./function/matrix/squeeze.js')(math, opt);
  require('./function/matrix/subset.js')(math, opt);
  require('./function/matrix/transpose.js')(math, opt);
  require('./function/matrix/zeros.js')(math, opt);

  // functions - probability
  require('./function/probability/factorial.js')(math, opt);
  require('./function/probability/random.js')(math, opt);

  // functions - statistics
  require('./function/statistics/min.js')(math, opt);
  require('./function/statistics/max.js')(math, opt);
  require('./function/statistics/mean.js')(math, opt);

  // functions - trigonometry
  require('./function/trigonometry/acos.js')(math, opt);
  require('./function/trigonometry/asin.js')(math, opt);
  require('./function/trigonometry/atan.js')(math, opt);
  require('./function/trigonometry/atan2.js')(math, opt);
  require('./function/trigonometry/cos.js')(math, opt);
  require('./function/trigonometry/cot.js')(math, opt);
  require('./function/trigonometry/csc.js')(math, opt);
  require('./function/trigonometry/sec.js')(math, opt);
  require('./function/trigonometry/sin.js')(math, opt);
  require('./function/trigonometry/tan.js')(math, opt);

  // functions - units
  require('./function/units/in.js')(math, opt);

  // functions - utils
  require('./function/utils/clone.js')(math, opt);
  require('./function/utils/format.js')(math, opt);
  require('./function/utils/import.js')(math, opt);
  require('./function/utils/map.js')(math, opt);
  require('./function/utils/print.js')(math, opt);
  require('./function/utils/select.js')(math, opt);
  require('./function/utils/typeof.js')(math, opt);
  require('./function/utils/forEach.js')(math, opt);

  // constants
  require('./constants.js')(math, opt);

  // selector (we initialize after all functions are loaded)
  math.chaining = {};
  math.chaining.Selector = require('./chaining/Selector.js')(math, opt);

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