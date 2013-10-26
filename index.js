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
 *                            {Number} format.precision
 *                              A number in the range 0-16. Default value is 5.
 *                            {String} matrix.defaultType
 *                              A string 'array' or 'matrix' (default).
 */
function mathjs (options) {
  // create new namespace
  var math = {};

  // options
  // TODO: change options to properties with getters to validate the input value
  math.options = {
    matrix: {
      'defaultType': 'matrix' // type of default matrix output. Choose 'array' or 'matrix' (default)
    }
  };

  // merge options
  object.deepExtend(math.options, options);

  // TODO: remove deprecated options some day (deprecated since version 0.15.0)
  if (Object.defineProperty) {
    var fnPrecision = function () {
      throw new Error('Option math.options.precision is deprecated. ' +
          'Use math.format(value, precision) instead.')
    };

    Object.defineProperty(math.options, 'precision', {
      get: fnPrecision,
      set: fnPrecision,
      enumerable: false,
      configurable: false
    });

    var fnDefault = function () {
      throw new Error('Option math.options.matrix.default is deprecated. ' +
          'Use math.options.matrix.defaultType instead.')
    };

    Object.defineProperty(math.options.matrix, 'default', {
      get: fnDefault,
      set: fnDefault,
      enumerable: false,
      configurable: false
    });
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
  math.type.Complex = require('./lib/type/Complex.js');
  math.type.Range = require('./lib/type/Range.js');
  math.type.Index = require('./lib/type/Index.js');
  math.type.Matrix = require('./lib/type/Matrix.js');
  math.type.Unit = require('./lib/type/Unit.js');
  math.type.Help = require('./lib/type/Help.js');

  math.collection = require('./lib/type/collection.js');

  // expression parser
  require('./lib/function/expression/eval.js')(math);
  require('./lib/function/expression/help.js')(math);
  require('./lib/function/expression/parse.js')(math);

  // functions - arithmetic
  require('./lib/function/arithmetic/abs.js')(math);
  require('./lib/function/arithmetic/add.js')(math);
  require('./lib/function/arithmetic/add.js')(math);
  require('./lib/function/arithmetic/ceil.js')(math);
  require('./lib/function/arithmetic/cube.js')(math);
  require('./lib/function/arithmetic/divide.js')(math);
  require('./lib/function/arithmetic/edivide.js')(math);
  require('./lib/function/arithmetic/emultiply.js')(math);
  require('./lib/function/arithmetic/epow.js')(math);
  require('./lib/function/arithmetic/equal.js')(math);
  require('./lib/function/arithmetic/exp.js')(math);
  require('./lib/function/arithmetic/fix.js')(math);
  require('./lib/function/arithmetic/floor.js')(math);
  require('./lib/function/arithmetic/gcd.js')(math);
  require('./lib/function/arithmetic/larger.js')(math);
  require('./lib/function/arithmetic/largereq.js')(math);
  require('./lib/function/arithmetic/lcm.js')(math);
  require('./lib/function/arithmetic/log.js')(math);
  require('./lib/function/arithmetic/log10.js')(math);
  require('./lib/function/arithmetic/mod.js')(math);
  require('./lib/function/arithmetic/multiply.js')(math);
  require('./lib/function/arithmetic/pow.js')(math);
  require('./lib/function/arithmetic/round.js')(math);
  require('./lib/function/arithmetic/sign.js')(math);
  require('./lib/function/arithmetic/smaller.js')(math);
  require('./lib/function/arithmetic/smallereq.js')(math);
  require('./lib/function/arithmetic/sqrt.js')(math);
  require('./lib/function/arithmetic/square.js')(math);
  require('./lib/function/arithmetic/subtract.js')(math);
  require('./lib/function/arithmetic/unary.js')(math);
  require('./lib/function/arithmetic/unequal.js')(math);
  require('./lib/function/arithmetic/xgcd.js')(math);

  // functions - complex
  require('./lib/function/complex/arg.js')(math);
  require('./lib/function/complex/conj.js')(math);
  require('./lib/function/complex/re.js')(math);
  require('./lib/function/complex/im.js')(math);

  // functions - construction
  require('./lib/function/construction/boolean.js')(math);
  require('./lib/function/construction/complex.js')(math);
  require('./lib/function/construction/index.js')(math);
  require('./lib/function/construction/matrix.js')(math);
  require('./lib/function/construction/number.js')(math);
  require('./lib/function/construction/parser.js')(math);
  require('./lib/function/construction/string.js')(math);
  require('./lib/function/construction/unit.js')(math);

  // functions - matrix
  require('./lib/function/matrix/concat.js')(math);
  require('./lib/function/matrix/det.js')(math);
  require('./lib/function/matrix/diag.js')(math);
  require('./lib/function/matrix/eye.js')(math);
  require('./lib/function/matrix/inv.js')(math);
  require('./lib/function/matrix/ones.js')(math);
  require('./lib/function/matrix/range.js')(math);
  require('./lib/function/matrix/size.js')(math);
  require('./lib/function/matrix/squeeze.js')(math);
  require('./lib/function/matrix/subset.js')(math);
  require('./lib/function/matrix/transpose.js')(math);
  require('./lib/function/matrix/zeros.js')(math);

  // functions - probability
  require('./lib/function/probability/factorial.js')(math);
  require('./lib/function/probability/random.js')(math);

  // functions - statistics
  require('./lib/function/statistics/min.js')(math);
  require('./lib/function/statistics/max.js')(math);
  require('./lib/function/statistics/mean.js')(math);

  // functions - trigonometry
  require('./lib/function/trigonometry/acos.js')(math);
  require('./lib/function/trigonometry/asin.js')(math);
  require('./lib/function/trigonometry/atan.js')(math);
  require('./lib/function/trigonometry/atan2.js')(math);
  require('./lib/function/trigonometry/cos.js')(math);
  require('./lib/function/trigonometry/cot.js')(math);
  require('./lib/function/trigonometry/csc.js')(math);
  require('./lib/function/trigonometry/sec.js')(math);
  require('./lib/function/trigonometry/sin.js')(math);
  require('./lib/function/trigonometry/tan.js')(math);

  // functions - units
  require('./lib/function/units/in.js')(math);

  // functions - utils
  require('./lib/function/utils/clone.js')(math);
  require('./lib/function/utils/format.js')(math);
  require('./lib/function/utils/import.js')(math);
  require('./lib/function/utils/map.js')(math);
  require('./lib/function/utils/print.js')(math);
  require('./lib/function/utils/select.js')(math);
  require('./lib/function/utils/typeof.js')(math);
  require('./lib/function/utils/forEach.js')(math);

  // constants
  require('./lib/constants.js')(math);

  // selector (we initialize after all functions are loaded)
  math.chaining = {};
  math.chaining.Selector = require('./lib/chaining/Selector.js')(math);

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