'use strict';

var object = require('./util/object');
var digits = require('./util/number').digits;

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
function create (config) {
  // simple test for ES5 support
  if (typeof Object.create !== 'function') {
    throw new Error('ES5 not supported by this JavaScript engine. ' +
        'Please load the es5-shim and es5-sham library for compatibility.');
  }

  // create namespace
  var math = {};

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
  math.config = function(options) {
    if (options) {
      // merge options
      object.deepExtend(_config, options);

      if (options.precision) {
        math.type.BigNumber.config({
          precision: options.precision
        });
      }

      // reload the constants (they depend on option number and precision)
      // this must be done after math.type.BigNumber.config is applied
      require('./constants')(math, _config);

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

  /**
   * math.js factory function. Creates a new instance of math.js
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
  math.create = create;

  // create a new BigNumber factory for this instance of math.js
  var BigNumber = require('decimal.js').constructor();

  // extend BigNumber with a function clone
  if (typeof BigNumber.prototype.clone !== 'function') {
    /**
     * Clone a bignumber
     * @return {BigNumber} clone
     */
    BigNumber.prototype.clone = function() {
      return this; // just return itself (a BigNumber is immutable)
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
    BigNumber.convert = function(number) {
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
  math.type.ResultSet = require('./type/ResultSet');
  math.type.BigNumber = BigNumber;

  math.collection = require('./type/collection');

  // expression (parse, Parser, nodes, docs)
  math.expression = {};
  math.expression.node = require('./expression/node/index');
  math.expression.parse = require('./expression/parse');
  math.expression.Parser = require('./expression/Parser');
  math.expression.docs = require('./expression/docs/index');

  // expression parser
  require('./function/expression/compile')(math, _config);
  require('./function/expression/eval')(math, _config);
  require('./function/expression/help')(math, _config);
  require('./function/expression/parse')(math, _config);

  // functions - arithmetic
  require('./function/arithmetic/abs')(math, _config);
  require('./function/arithmetic/add')(math, _config);
  require('./function/arithmetic/ceil')(math, _config);
  require('./function/arithmetic/cube')(math, _config);
  require('./function/arithmetic/_divide')(math, _config);
  require('./function/arithmetic/divide')(math, _config);
  require('./function/arithmetic/dotDivide')(math, _config);
  require('./function/arithmetic/dotMultiply')(math, _config);
  require('./function/arithmetic/dotPow')(math, _config);
  require('./function/arithmetic/exp')(math, _config);
  require('./function/arithmetic/fix')(math, _config);
  require('./function/arithmetic/floor')(math, _config);
  require('./function/arithmetic/gcd')(math, _config);
  require('./function/arithmetic/lcm')(math, _config);
  require('./function/arithmetic/log')(math, _config);
  require('./function/arithmetic/log10')(math, _config);
  require('./function/arithmetic/mod')(math, _config);
  require('./function/arithmetic/multiply')(math, _config);
  require('./function/arithmetic/norm')(math, _config);
  require('./function/arithmetic/nthRoot')(math, _config);
  require('./function/arithmetic/pow')(math, _config);
  require('./function/arithmetic/round')(math, _config);
  require('./function/arithmetic/sign')(math, _config);
  require('./function/arithmetic/sqrt')(math, _config);
  require('./function/arithmetic/square')(math, _config);
  require('./function/arithmetic/subtract')(math, _config);
  require('./function/arithmetic/unaryMinus')(math, _config);
  require('./function/arithmetic/unaryPlus')(math, _config);
  require('./function/arithmetic/xgcd')(math, _config);

  // functions - bitwise
  require('./function/bitwise/bitAnd')(math, _config);
  require('./function/bitwise/bitNot')(math, _config);
  require('./function/bitwise/bitOr')(math, _config);
  require('./function/bitwise/bitXor')(math, _config);
  require('./function/bitwise/leftShift')(math, _config);
  require('./function/bitwise/rightArithShift')(math, _config);
  require('./function/bitwise/rightLogShift')(math, _config);

  // functions - complex
  require('./function/complex/arg')(math, _config);
  require('./function/complex/conj')(math, _config);
  require('./function/complex/re')(math, _config);
  require('./function/complex/im')(math, _config);

  // functions - construction
  require('./function/construction/bignumber')(math, _config);
  require('./function/construction/boolean')(math, _config);
  require('./function/construction/complex')(math, _config);
  require('./function/construction/index')(math, _config);
  require('./function/construction/matrix')(math, _config);
  require('./function/construction/number')(math, _config);
  require('./function/construction/parser')(math, _config);
  require('./function/construction/chain')(math, _config);
  require('./function/construction/string')(math, _config);
  require('./function/construction/unit')(math, _config);

  // functions - logical
  require('./function/logical/and')(math, _config);
  require('./function/logical/not')(math, _config);
  require('./function/logical/or')(math, _config);
  require('./function/logical/xor')(math, _config);

  // functions - matrix
  require('./function/matrix/concat')(math, _config);
  require('./function/matrix/cross')(math, _config);
  require('./function/matrix/det')(math, _config);
  require('./function/matrix/diag')(math, _config);
  require('./function/matrix/dot')(math, _config);
  require('./function/matrix/eye')(math, _config);
  require('./function/matrix/flatten')(math, _config);
  require('./function/matrix/inv')(math, _config);
  require('./function/matrix/ones')(math, _config);
  require('./function/matrix/range')(math, _config);
  require('./function/matrix/resize')(math, _config);
  require('./function/matrix/size')(math, _config);
  require('./function/matrix/squeeze')(math, _config);
  require('./function/matrix/subset')(math, _config);
  require('./function/matrix/trace')(math, _config);
  require('./function/matrix/transpose')(math, _config);
  require('./function/matrix/zeros')(math, _config);

  // functions - probability
  //require('./function/probability/distribution')(math, _config); // TODO: rethink math.distribution
  require('./function/probability/factorial')(math, _config);
  require('./function/probability/gamma')(math, _config);
  require('./function/probability/random')(math, _config);
  require('./function/probability/randomInt')(math, _config);
  require('./function/probability/pickRandom')(math, _config);
  require('./function/probability/permutations')(math, _config);
  require('./function/probability/combinations')(math, _config);

  // functions - relational
  require('./function/relational/compare')(math, _config);
  require('./function/relational/deepEqual')(math, _config);
  require('./function/relational/equal')(math, _config);
  require('./function/relational/larger')(math, _config);
  require('./function/relational/largerEq')(math, _config);
  require('./function/relational/smaller')(math, _config);
  require('./function/relational/smallerEq')(math, _config);
  require('./function/relational/unequal')(math, _config);

  // functions - statistics
  require('./function/statistics/min')(math, _config);
  require('./function/statistics/max')(math, _config);
  require('./function/statistics/mean')(math, _config);
  require('./function/statistics/median')(math, _config);
  require('./function/statistics/prod')(math, _config);
  require('./function/statistics/std')(math, _config);
  require('./function/statistics/sum')(math, _config);
  require('./function/statistics/var')(math, _config);

  // functions - trigonometry
  require('./function/trigonometry/acos')(math, _config);
  require('./function/trigonometry/asin')(math, _config);
  require('./function/trigonometry/atan')(math, _config);
  require('./function/trigonometry/atan2')(math, _config);
  require('./function/trigonometry/cos')(math, _config);
  require('./function/trigonometry/cosh')(math, _config);
  require('./function/trigonometry/cot')(math, _config);
  require('./function/trigonometry/coth')(math, _config);
  require('./function/trigonometry/csc')(math, _config);
  require('./function/trigonometry/csch')(math, _config);
  require('./function/trigonometry/sec')(math, _config);
  require('./function/trigonometry/sech')(math, _config);
  require('./function/trigonometry/sin')(math, _config);
  require('./function/trigonometry/sinh')(math, _config);
  require('./function/trigonometry/tan')(math, _config);
  require('./function/trigonometry/tanh')(math, _config);

  // functions - units
  require('./function/units/to')(math, _config);

  // functions - utils
  require('./function/utils/clone')(math, _config);
  require('./function/utils/filter')(math, _config);
  require('./function/utils/format')(math, _config);
  require('./function/utils/import')(math, _config);
  require('./function/utils/map')(math, _config);
  require('./function/utils/print')(math, _config);
  require('./function/utils/sort')(math, _config);
  require('./function/utils/typeof')(math, _config);
  require('./function/utils/forEach')(math, _config);

  // TODO: deprecated since version 0.25.0, remove some day.
  math.ifElse = function () {
    throw new Error('Function ifElse is deprecated. Use the conditional operator instead.');
  };

  // constants
  require('./constants')(math, _config);

  // attach transform functions (for converting one-based indices to zero-based)
  math.expression.transform = {
    concat: require('./expression/transform/concat.transform')(math, _config),
    filter: require('./expression/transform/filter.transform')(math, _config),
    forEach:require('./expression/transform/forEach.transform')(math, _config),
    index:  require('./expression/transform/index.transform')(math, _config),
    map:    require('./expression/transform/map.transform')(math, _config),
    max:    require('./expression/transform/max.transform')(math, _config),
    mean:   require('./expression/transform/mean.transform')(math, _config),
    min:    require('./expression/transform/min.transform')(math, _config),
    range:  require('./expression/transform/range.transform')(math, _config),
    subset: require('./expression/transform/subset.transform')(math, _config)
  };

  // selector (we initialize after all functions are loaded)
  math.chaining = {};
  math.chaining.Chain = require('./chaining/Chain')(math, _config);
  math.chaining.Selector = math.chaining.Chain; // TODO: deprecate in v2.0

  // apply provided configuration options
  math.config(_config); // apply the default options
  math.config(config);  // apply custom options

  // return the new instance
  return math;
}

// create a default instance of math.js
var math = create();

if (typeof window !== 'undefined') {
  window.mathjs = math; // TODO: deprecate the mathjs namespace some day (replaced with 'math' since version 0.25.0)
}

// export the default instance
module.exports = math;

