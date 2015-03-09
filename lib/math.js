'use strict';

var typed = require('typed-function');
var object = require('./util/object');
var digits = require('./util/number').digits;
var Complex = require('./type/Complex');
var Range = require('./type/Range');
var Index = require('./type/Index');
var Matrix = require('./type/Matrix');
var Unit = require('./type/Unit');
var Help = require('./type/Help');
var ResultSet = require('./type/ResultSet');

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
  var BigNumber = require('./type/BigNumber').constructor();

  // TODO: remove BigNumber.convert
  // extend BigNumber with a function convert
  if (typeof BigNumber.convert !== 'function' || true) { // FIXME: remove BigNumber.convert
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
  math.type = {
    Complex: Complex,
    Range: Range,
    Index: Index,
    Matrix: Matrix,
    Unit: Unit,
    Help: Help,
    ResultSet: ResultSet,
    BigNumber: BigNumber
  };

  // configure typed functions
  typed.types['Complex']    = function (x) { return x instanceof Complex; };
  typed.types['Range']      = function (x) { return x instanceof Range; };
  typed.types['Index']      = function (x) { return x instanceof Index; };
  typed.types['Matrix']     = function (x) { return x instanceof Matrix; };
  typed.types['Unit']       = function (x) { return x instanceof Unit; };
  typed.types['Help']       = function (x) { return x instanceof Help; };
  typed.types['ResultSet']  = function (x) { return x instanceof ResultSet; };
  typed.types['BigNumber']  = function (x) { return x instanceof BigNumber; };

  typed.conversions = [
    {
      from: 'number',
      to: 'Complex',
      convert: function (x) {
        return new Complex(x, 0);
      }
    }, {
      from: 'BigNumber',
      to: 'Complex',
      convert: function (x) {
        return new Complex(x.toNumber(), 0);
      }
    }, {
      from: 'number',
      to: 'string',
      convert: function (x) {
        return x + '';
      }
    }, {
      from: 'number',
      to: 'BigNumber',
      convert: function (x) {
        // note: conversion from number to BigNumber can fail if x has >15 digits
        if (digits(x) > 15) {
          throw new TypeError('Cannot implicitly convert a number with >15 significant digits to BigNumber ' +
              '(value: ' + x + '). ' +
              'Use function bignumber(x) to convert to BigNumber.');
        }
        return new BigNumber(x);
      }
    }, {
      from: 'boolean',
      to: 'number',
      convert: function (x) {
        return +x;
      }
    }, {
      from: 'boolean',
      to: 'string',
      convert: function (x) {
        return +x;
      }
    }, {
      from: 'boolean',
      to: 'BigNumber',
      convert: function (x) {
        return new BigNumber(+x);
      }
    }, {
      from: 'null',
      to: 'number',
      convert: function () {
        return 0;
      }
    }, {
      from: 'null',
      to: 'string',
      convert: function () {
        return 'null';
      }
    }, {
      from: 'null',
      to: 'BigNumber',
      convert: function () {
        return new BigNumber(0);
      }
    }, {
      from: 'Array',
      to: 'Matrix',
      convert: function (array) {
        return new Matrix(array);
      }
    }
  ];

  math.collection = require('./type/collection');

  // expression (parse, Parser, nodes, docs)
  math.expression = {};
  math.expression.node = require('./expression/node/index');
  math.expression.parse = require('./expression/parse');
  math.expression.Parser = require('./expression/Parser');
  math.expression.docs = require('./expression/docs/index');

  // serialization utilities
  math.json = {
    reviver: require('./json/reviver')
  };

  // functions - arithmetic
  math.abs = require('./function/arithmetic/abs')(_config);
  math.add = require('./function/arithmetic/add')(_config);
  math.ceil = require('./function/arithmetic/ceil')(_config);
  math.cube = require('./function/arithmetic/cube')(_config);
  math.divide = require('./function/arithmetic/divide')(_config);
  math.dotDivide = require('./function/arithmetic/dotDivide')(_config);
  math.dotMultiply = require('./function/arithmetic/dotMultiply')(_config);
  math.dotPow = require('./function/arithmetic/dotPow')(_config);
  math.exp = require('./function/arithmetic/exp')(_config);
  math.fix = require('./function/arithmetic/fix')(_config);
  math.floor = require('./function/arithmetic/floor')(_config);
  math.gcd = require('./function/arithmetic/gcd')(_config);
  math.lcm = require('./function/arithmetic/lcm')(_config);
  math.log = require('./function/arithmetic/log')(_config);
  math.log10 = require('./function/arithmetic/log10')(_config);
  math.mod = require('./function/arithmetic/mod')(_config);
  math.multiply = require('./function/arithmetic/multiply')(_config);
  require('./function/arithmetic/norm')(math, _config);
  require('./function/arithmetic/nthRoot')(math, _config);
  math.pow = require('./function/arithmetic/pow')(_config);
  require('./function/arithmetic/round')(math, _config);
  math.sign = require('./function/arithmetic/sign')(_config);
  math.sqrt = require('./function/arithmetic/sqrt')(_config);
  math.square = require('./function/arithmetic/square')(_config);
  math.subtract = require('./function/arithmetic/subtract')(_config);
  math.unaryMinus = require('./function/arithmetic/unaryMinus')(_config);
  math.unaryPlus = require('./function/arithmetic/unaryPlus')(_config);
  math.xgcd = require('./function/arithmetic/xgcd')(_config);

  // functions - bitwise
  math.bitAnd = require('./function/bitwise/bitAnd')(_config);
  require('./function/bitwise/bitNot')(math, _config);
  require('./function/bitwise/bitOr')(math, _config);
  require('./function/bitwise/bitXor')(math, _config);
  require('./function/bitwise/leftShift')(math, _config);
  require('./function/bitwise/rightArithShift')(math, _config);
  require('./function/bitwise/rightLogShift')(math, _config);

  // functions - complex
  math.arg  = require('./function/complex/arg')(_config);
  math.conj = require('./function/complex/conj')(_config);
  math.re   = require('./function/complex/re')(_config);
  math.im   = require('./function/complex/im')(_config);

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

  // expression parser
  math.compile = require('./function/expression/compile')(_config, math); // special case, needs the math namespace
  require('./function/expression/eval')(math, _config);
  require('./function/expression/help')(math, _config);
  require('./function/expression/parse')(math, _config);

  // functions - logical
  require('./function/logical/and')(math, _config);
  require('./function/logical/not')(math, _config);
  require('./function/logical/or')(math, _config);
  require('./function/logical/xor')(math, _config);

  // functions - matrix
  require('./function/matrix/concat')(math, _config);
  require('./function/matrix/cross')(math, _config);
  math.det = require('./function/matrix/det')(_config);
  require('./function/matrix/diag')(math, _config);
  require('./function/matrix/dot')(math, _config);
  math.eye = require('./function/matrix/eye')(_config);
  require('./function/matrix/flatten')(math, _config);
  math.inv = require('./function/matrix/inv')(_config);
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
  math.compare    = require('./function/relational/compare')(_config);
  math.deepEqual  = require('./function/relational/deepEqual')(_config);
  math.equal      = require('./function/relational/equal')(_config);
  math.larger     = require('./function/relational/larger')(_config);
  math.largerEq   = require('./function/relational/largerEq')(_config);
  math.smaller    = require('./function/relational/smaller')(_config);
  math.smallerEq  = require('./function/relational/smallerEq')(_config);
  math.unequal    = require('./function/relational/unequal')(_config);

  // functions - statistics
  math.min = require('./function/statistics/min')(_config);
  require('./function/statistics/max')(math, _config);
  require('./function/statistics/mean')(math, _config);
  require('./function/statistics/median')(math, _config);
  require('./function/statistics/prod')(math, _config);
  require('./function/statistics/std')(math, _config);
  math.sum = require('./function/statistics/sum')(_config);
  require('./function/statistics/var')(math, _config);

  // functions - trigonometry
  require('./function/trigonometry/acos')(math, _config);
  require('./function/trigonometry/acosh')(math, _config);
  require('./function/trigonometry/acot')(math, _config);
  require('./function/trigonometry/acoth')(math, _config);
  require('./function/trigonometry/acsc')(math, _config);
  require('./function/trigonometry/acsch')(math, _config);
  require('./function/trigonometry/asec')(math, _config);
  require('./function/trigonometry/asech')(math, _config);
  require('./function/trigonometry/asin')(math, _config);
  require('./function/trigonometry/asinh')(math, _config);
  require('./function/trigonometry/atan')(math, _config);
  require('./function/trigonometry/atan2')(math, _config);
  require('./function/trigonometry/atanh')(math, _config);
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
  math.to = require('./function/units/to')(_config);

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

  // create Chain, and create proxies for all functions/constants in the math
  // namespace.
  math.chaining = {
    Chain: require('./chaining/Chain')()
  };
  math.chaining.Chain.createProxy(math);

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

