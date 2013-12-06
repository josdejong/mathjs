var object = require('./util/object');

/**
 * math.js factory function.
 *
 * Usage:
 *
 *     var math = mathjs();
 *     var math = mathjs(settings);
 *
 * @param {Object} [settings] Available settings:
 *                            {String} matrix.defaultType
 *                              A string 'matrix' (default) or 'array'.
 *                            {String} number.defaultType
 *                              A string 'number' (default) or 'bignumber'
 */
function mathjs (settings) {
  // create new namespace
  var math = {};

  // create configuration settings. These are private
  var _settings = {
    matrix: {
      // type of default matrix output. Choose 'matrix' (default) or 'array'
      'defaultType': 'matrix'
    },
    number: {
      // type of default number output. Choose 'number' (default) or 'bignumber'
      'defaultType': 'number'
    }
  };

  /**
   * Set configuration settings for math.js, and get current settings
   * @param {Object} [settings] Available settings:
   *                            {String} matrix.defaultType
   *                              A string 'matrix' (default) or 'array'.
   *                            {String} number.defaultType
   *                              A string 'number' (default) or 'bignumber'
   *                            {Number} number.precision
   *                              The number of digits in BigNumber.
   *                              Not applicable for Numbers.
   * @return {Object} settings   The currently applied settings
   */
  math.config = function config (settings) {
    var BigNumber = require('bignumber.js');

    if (settings) {
      // merge settings
      object.deepExtend(_settings, settings);

      if (settings.number && settings.number.precision) {
        BigNumber.config({
          DECIMAL_PLACES: settings.number.precision
        });
      }

      // TODO: remove deprecated setting some day (deprecated since version 0.15.0)
      if (settings.matrix && settings.matrix.default) {
        throw new Error('setting matrix.default is deprecated. ' +
            'Use matrix.defaultType instead.')
      }
    }

    // return a clone of the settings
    var current = object.clone(_settings);
    current.number.precision = BigNumber.config().DECIMAL_PLACES;
    return current;
  };

  // apply provided configuration settings
  math.config(settings);

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
  math.type.Complex = require('./type/Complex');
  math.type.Range = require('./type/Range');
  math.type.Index = require('./type/Index');
  math.type.Matrix = require('./type/Matrix');
  math.type.Unit = require('./type/Unit');
  math.type.Help = require('./type/Help');

  math.collection = require('./type/collection');

  // error utility functions
  require('./type/error')(math);

  // expression parser
  require('./function/expression/eval.js')(math, _settings);
  require('./function/expression/help.js')(math, _settings);
  require('./function/expression/parse.js')(math, _settings);

  // functions - arithmetic
  require('./function/arithmetic/abs.js')(math, _settings);
  require('./function/arithmetic/add.js')(math, _settings);
  require('./function/arithmetic/add.js')(math, _settings);
  require('./function/arithmetic/ceil.js')(math, _settings);
  require('./function/arithmetic/cube.js')(math, _settings);
  require('./function/arithmetic/divide.js')(math, _settings);
  require('./function/arithmetic/edivide.js')(math, _settings);
  require('./function/arithmetic/emultiply.js')(math, _settings);
  require('./function/arithmetic/epow.js')(math, _settings);
  require('./function/arithmetic/equal.js')(math, _settings);
  require('./function/arithmetic/exp.js')(math, _settings);
  require('./function/arithmetic/fix.js')(math, _settings);
  require('./function/arithmetic/floor.js')(math, _settings);
  require('./function/arithmetic/gcd.js')(math, _settings);
  require('./function/arithmetic/larger.js')(math, _settings);
  require('./function/arithmetic/largereq.js')(math, _settings);
  require('./function/arithmetic/lcm.js')(math, _settings);
  require('./function/arithmetic/log.js')(math, _settings);
  require('./function/arithmetic/log10.js')(math, _settings);
  require('./function/arithmetic/mod.js')(math, _settings);
  require('./function/arithmetic/multiply.js')(math, _settings);
  require('./function/arithmetic/pow.js')(math, _settings);
  require('./function/arithmetic/round.js')(math, _settings);
  require('./function/arithmetic/sign.js')(math, _settings);
  require('./function/arithmetic/smaller.js')(math, _settings);
  require('./function/arithmetic/smallereq.js')(math, _settings);
  require('./function/arithmetic/sqrt.js')(math, _settings);
  require('./function/arithmetic/square.js')(math, _settings);
  require('./function/arithmetic/subtract.js')(math, _settings);
  require('./function/arithmetic/unary.js')(math, _settings);
  require('./function/arithmetic/unequal.js')(math, _settings);
  require('./function/arithmetic/xgcd.js')(math, _settings);

  // functions - complex
  require('./function/complex/arg.js')(math, _settings);
  require('./function/complex/conj.js')(math, _settings);
  require('./function/complex/re.js')(math, _settings);
  require('./function/complex/im.js')(math, _settings);

  // functions - construction
  require('./function/construction/bignumber')(math, _settings);
  require('./function/construction/boolean.js')(math, _settings);
  require('./function/construction/complex.js')(math, _settings);
  require('./function/construction/index.js')(math, _settings);
  require('./function/construction/matrix.js')(math, _settings);
  require('./function/construction/number.js')(math, _settings);
  require('./function/construction/parser.js')(math, _settings);
  require('./function/construction/string.js')(math, _settings);
  require('./function/construction/unit.js')(math, _settings);

  // functions - matrix
  require('./function/matrix/concat.js')(math, _settings);
  require('./function/matrix/det.js')(math, _settings);
  require('./function/matrix/diag.js')(math, _settings);
  require('./function/matrix/eye.js')(math, _settings);
  require('./function/matrix/inv.js')(math, _settings);
  require('./function/matrix/ones.js')(math, _settings);
  require('./function/matrix/range.js')(math, _settings);
  require('./function/matrix/resize.js')(math, _settings);
  require('./function/matrix/size.js')(math, _settings);
  require('./function/matrix/squeeze.js')(math, _settings);
  require('./function/matrix/subset.js')(math, _settings);
  require('./function/matrix/transpose.js')(math, _settings);
  require('./function/matrix/zeros.js')(math, _settings);

  // functions - probability
  require('./function/probability/factorial.js')(math, _settings);
  require('./function/probability/random.js')(math, _settings);

  // functions - statistics
  require('./function/statistics/min.js')(math, _settings);
  require('./function/statistics/max.js')(math, _settings);
  require('./function/statistics/mean.js')(math, _settings);
  require('./function/statistics/std.js')(math, _settings);

  // functions - trigonometry
  require('./function/trigonometry/acos.js')(math, _settings);
  require('./function/trigonometry/asin.js')(math, _settings);
  require('./function/trigonometry/atan.js')(math, _settings);
  require('./function/trigonometry/atan2.js')(math, _settings);
  require('./function/trigonometry/cos.js')(math, _settings);
  require('./function/trigonometry/cot.js')(math, _settings);
  require('./function/trigonometry/csc.js')(math, _settings);
  require('./function/trigonometry/sec.js')(math, _settings);
  require('./function/trigonometry/sin.js')(math, _settings);
  require('./function/trigonometry/tan.js')(math, _settings);

  // functions - units
  require('./function/units/in.js')(math, _settings);

  // functions - utils
  require('./function/utils/clone.js')(math, _settings);
  require('./function/utils/format.js')(math, _settings);
  require('./function/utils/import.js')(math, _settings);
  require('./function/utils/map.js')(math, _settings);
  require('./function/utils/print.js')(math, _settings);
  require('./function/utils/select.js')(math, _settings);
  require('./function/utils/typeof.js')(math, _settings);
  require('./function/utils/forEach.js')(math, _settings);

  // constants
  require('./constants.js')(math, _settings);

  // selector (we initialize after all functions are loaded)
  math.chaining = {};
  math.chaining.Selector = require('./chaining/Selector.js')(math, _settings);

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
