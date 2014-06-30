var object = require('./util/object');

/**
 * math.js factory function.
 *
 * @param {Object} [config] Available configuration options:
 *                            {String} matrix
 *                              A string 'matrix' (default) or 'array'.
 *                            {String} number
 *                              A string 'number' (default) or 'bignumber'
 *                            {Number} precision
 *                              The number of significant digits for BigNumbers.
 *                              Not applicable for Numbers.
 */
function factory (config) {
  // simple test for ES5 support
  if (typeof Object.create !== 'function') {
    throw new Error('ES5 not supported by this JavaScript engine. ' +
        'Please load the es5-shim and es5-sham library for compatibility.');
  }

  // create namespace (and factory for a new instance)
  function math (config) {
    return factory(config);
  }

  // create configuration options. These are private
  var _config = {
    // type of default matrix output. Choose 'matrix' (default) or 'array'
    matrix: 'matrix',

    // type of default number output. Choose 'number' (default) or 'bignumber'
    number: 'number',

    // number of significant digits in BigNumbers
    precision: 64,

    // minimum relative difference between two compared values,
    // used by all comparison functions
    epsilon: 1e-14
  };

  /**
   * Set configuration options for math.js, and get current options
   * @param {Object} [options] Available options:
   *                            {String} matrix
   *                              A string 'matrix' (default) or 'array'.
   *                            {String} number
   *                              A string 'number' (default) or 'bignumber'
   *                            {Number} precision
   *                              The number of significant digits for BigNumbers.
   *                              Not applicable for Numbers.
   * @return {Object} Returns the current configuration
   */
  math.config = function config(options) {
    if (options) {
      // merge options
      object.deepExtend(_config, options);

      if (options.precision) {
        math.type.BigNumber.config({
          precision: options.precision
        });
      }

      // TODO: remove deprecated setting some day (deprecated since version 0.17.0)
      if (options.number && options.number.defaultType) {
        throw new Error('setting `number.defaultType` is deprecated. Use `number` instead.')
      }

      // TODO: remove deprecated setting some day (deprecated since version 0.17.0)
      if (options.number && options.number.precision) {
        throw new Error('setting `number.precision` is deprecated. Use `precision` instead.')
      }

      // TODO: remove deprecated setting some day (deprecated since version 0.17.0)
      if (options.matrix && options.matrix.defaultType) {
        throw new Error('setting `matrix.defaultType` is deprecated. Use `matrix` instead.')
      }

      // TODO: remove deprecated setting some day (deprecated since version 0.15.0)
      if (options.matrix && options.matrix['default']) {
        throw new Error('setting `matrix.default` is deprecated. Use `matrix` instead.')
      }

      // TODO: remove deprecated setting some day (deprecated since version 0.20.0)
      if (options.decimals) {
        throw new Error('setting `decimals` is deprecated. Use `precision` instead.')
      }
    }

    // return a clone of the settings
    return object.clone(_config);
  };

  // create a new BigNumber factory for this instance of math.js
  var BigNumber = require('decimal.js').constructor();

  // extend BigNumber with a function clone
  if (typeof BigNumber.prototype.clone !== 'function') {
    /**
     * Clone a bignumber
     * @return {BigNumber} clone
     */
    BigNumber.prototype.clone = function clone() {
      return new BigNumber(this);
    };
  }

  // extend BigNumber with a function convert
  if (typeof BigNumber.convert !== 'function') {
    /**
     * Try to convert a Number in to a BigNumber.
     * If the number has 15 or mor significant digits, the Number cannot be
     * converted to BigNumber and will return the original number.
     * @param {Number} number
     * @return {BigNumber | Number} bignumber
     */
    BigNumber.convert = function convert(number) {
      if (digits(number) > 15) {
        return number;
      }
      else {
        return new BigNumber(number);
      }
    };
  }
  else {
    throw new Error('Cannot add function convert to BigNumber: function already exists');
  }

  // errors
  math.error = require('./error/index');

  // types (Matrix, Complex, Unit, ...)
  math.type = {};
  math.type.Complex = require('./type/Complex');
  math.type.Range = require('./type/Range');
  math.type.Index = require('./type/Index');
  math.type.Matrix = require('./type/Matrix');
  math.type.Unit = require('./type/Unit');
  math.type.Help = require('./type/Help');
  math.type.BigNumber = BigNumber;

  math.collection = require('./type/collection');

  // expression (parse, Parser, nodes, docs)
  math.expression = {};
  math.expression.node = require('./expression/node/index.js');
  math.expression.parse = require('./expression/parse.js');
  math.expression.Parser = require('./expression/Parser.js');
  math.expression.docs = require('./expression/docs/index.js');

  // expression parser
  require('./function/expression/compile.js')(math, _config);
  require('./function/expression/eval.js')(math, _config);
  require('./function/expression/help.js')(math, _config);
  require('./function/expression/parse.js')(math, _config);

  // functions - arithmetic
  require('./function/arithmetic/abs.js')(math, _config);
  require('./function/arithmetic/add.js')(math, _config);
  require('./function/arithmetic/ceil.js')(math, _config);
  require('./function/arithmetic/cube.js')(math, _config);
  require('./function/arithmetic/divide.js')(math, _config);
  require('./function/arithmetic/dotDivide.js')(math, _config);
  require('./function/arithmetic/dotMultiply.js')(math, _config);
  require('./function/arithmetic/dotPow.js')(math, _config);
  require('./function/arithmetic/exp.js')(math, _config);
  require('./function/arithmetic/fix.js')(math, _config);
  require('./function/arithmetic/floor.js')(math, _config);
  require('./function/arithmetic/gcd.js')(math, _config);
  require('./function/arithmetic/lcm.js')(math, _config);
  require('./function/arithmetic/log.js')(math, _config);
  require('./function/arithmetic/log10.js')(math, _config);
  require('./function/arithmetic/mod.js')(math, _config);
  require('./function/arithmetic/multiply.js')(math, _config);
  require('./function/arithmetic/norm.js')(math, _config);
  require('./function/arithmetic/pow.js')(math, _config);
  require('./function/arithmetic/round.js')(math, _config);
  require('./function/arithmetic/sign.js')(math, _config);
  require('./function/arithmetic/sqrt.js')(math, _config);
  require('./function/arithmetic/square.js')(math, _config);
  require('./function/arithmetic/subtract.js')(math, _config);
  require('./function/arithmetic/unaryMinus.js')(math, _config);
  require('./function/arithmetic/unaryPlus.js')(math, _config);
  require('./function/arithmetic/xgcd.js')(math, _config);

  // functions - comparison
  require('./function/comparison/compare.js')(math, _config);
  require('./function/comparison/deepEqual.js')(math, _config);
  require('./function/comparison/equal.js')(math, _config);
  require('./function/comparison/larger.js')(math, _config);
  require('./function/comparison/largerEq.js')(math, _config);
  require('./function/comparison/smaller.js')(math, _config);
  require('./function/comparison/smallerEq.js')(math, _config);
  require('./function/comparison/unequal.js')(math, _config);

  // functions - complex
  require('./function/complex/arg.js')(math, _config);
  require('./function/complex/conj.js')(math, _config);
  require('./function/complex/re.js')(math, _config);
  require('./function/complex/im.js')(math, _config);

  // functions - construction
  require('./function/construction/bignumber')(math, _config);
  require('./function/construction/boolean.js')(math, _config);
  require('./function/construction/complex.js')(math, _config);
  require('./function/construction/index.js')(math, _config);
  require('./function/construction/matrix.js')(math, _config);
  require('./function/construction/number.js')(math, _config);
  require('./function/construction/parser.js')(math, _config);
  require('./function/construction/select.js')(math, _config);
  require('./function/construction/string.js')(math, _config);
  require('./function/construction/unit.js')(math, _config);

  // functions - matrix
  require('./function/matrix/concat.js')(math, _config);
  require('./function/matrix/det.js')(math, _config);
  require('./function/matrix/diag.js')(math, _config);
  require('./function/matrix/eye.js')(math, _config);
  require('./function/matrix/inv.js')(math, _config);
  require('./function/matrix/ones.js')(math, _config);
  require('./function/matrix/range.js')(math, _config);
  require('./function/matrix/resize.js')(math, _config);
  require('./function/matrix/size.js')(math, _config);
  require('./function/matrix/squeeze.js')(math, _config);
  require('./function/matrix/subset.js')(math, _config);
  require('./function/matrix/transpose.js')(math, _config);
  require('./function/matrix/zeros.js')(math, _config);

  // functions - probability
  require('./function/probability/distribution.js')(math, _config);
  require('./function/probability/factorial.js')(math, _config);
  require('./function/probability/random.js')(math, _config);
  require('./function/probability/randomInt.js')(math, _config);
  require('./function/probability/pickRandom.js')(math, _config);
  require('./function/probability/permutations.js')(math, _config);
  require('./function/probability/combinations.js')(math, _config);

  // functions - statistics
  require('./function/statistics/min.js')(math, _config);
  require('./function/statistics/max.js')(math, _config);
  require('./function/statistics/mean.js')(math, _config);
  require('./function/statistics/median.js')(math, _config);
  require('./function/statistics/prod.js')(math, _config);
  require('./function/statistics/std.js')(math, _config);
  require('./function/statistics/sum.js')(math, _config);
  require('./function/statistics/var.js')(math, _config);

  // functions - trigonometry
  require('./function/trigonometry/acos.js')(math, _config);
  require('./function/trigonometry/asin.js')(math, _config);
  require('./function/trigonometry/atan.js')(math, _config);
  require('./function/trigonometry/atan2.js')(math, _config);
  require('./function/trigonometry/cos.js')(math, _config);
  require('./function/trigonometry/cosh.js')(math, _config);
  require('./function/trigonometry/cot.js')(math, _config);
  require('./function/trigonometry/coth.js')(math, _config);
  require('./function/trigonometry/csc.js')(math, _config);
  require('./function/trigonometry/csch.js')(math, _config);
  require('./function/trigonometry/sec.js')(math, _config);
  require('./function/trigonometry/sech.js')(math, _config);
  require('./function/trigonometry/sin.js')(math, _config);
  require('./function/trigonometry/sinh.js')(math, _config);
  require('./function/trigonometry/tan.js')(math, _config);
  require('./function/trigonometry/tanh.js')(math, _config);

  // functions - units
  require('./function/units/to.js')(math, _config);

  // functions - utils
  require('./function/utils/clone.js')(math, _config);
  require('./function/utils/format.js')(math, _config);
  require('./function/utils/import.js')(math, _config);
  require('./function/utils/map.js')(math, _config);
  require('./function/utils/print.js')(math, _config);
  require('./function/utils/typeof.js')(math, _config);
  require('./function/utils/forEach.js')(math, _config);

  // TODO: deprecated since version 0.25.0, remove some day.
  math.ifElse = function () {
    throw new Error('Function ifElse is deprecated. Use the conditional operator instead.');
  };

  // constants
  require('./constants.js')(math, _config);

  // selector (we initialize after all functions are loaded)
  math.chaining = {};
  math.chaining.Selector = require('./chaining/Selector.js')(math, _config);

  // apply provided configuration options
  math.config(_config); // apply the default options
  math.config(config);  // apply custom options

  // return the new instance
  return math;
}

// create a default instance of math.js
var math = factory();

if (typeof window !== 'undefined') {
  window.mathjs = math; // TODO: deprecate the mathjs namespace some day (replaced with 'math' since version 0.25.0)
}

// export the default instance
module.exports = factory();

