'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../../type/matrix/function/matrix'));
  var latex = require('../../utils/latex');

  var algorithm02 = load(require('../../type/matrix/utils/algorithm02'));
  var algorithm03 = load(require('../../type/matrix/utils/algorithm03'));
  var algorithm05 = load(require('../../type/matrix/utils/algorithm05'));
  var algorithm11 = load(require('../../type/matrix/utils/algorithm11'));
  var algorithm12 = load(require('../../type/matrix/utils/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));
  
  /**
   * Calculates the modulus, the remainder of an integer division.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Three modulo functions are available via config.moduloFunc:
   *
   * 'truncated':   x % y
   * 'floored':     x - y * floor(x / y)
   * 'euclidean':   x - |y| * floor(x / |y|)
   *
   * See http://en.wikipedia.org/wiki/Modulo_operation.
   *
   * Note: mod(x, 0) will return x.
   *
   * Syntax:
   *
   *    math.mod(x, y)
   *
   * Examples:
   *
   *    math.mod(8, 3);                // returns 2
   *    math.mod(11, 2);               // returns 1
   *
   *    function isOdd(x) {
   *      return math.mod(x, 2) != 0;
   *    }
   *
   *    isOdd(2);                      // returns false
   *    isOdd(3);                      // returns true
   *
   * See also:
   *
   *    divide
   *
   * @param  {number | BigNumber | Fraction | Array | Matrix} x Dividend
   * @param  {number | BigNumber | Fraction | Array | Matrix} y Divisor
   * @param  {string} [func='floored']
   *            Optional modulo function to use. Options are 'truncated', 'floored' or 'euclidean'
   * @return {number | BigNumber | Fraction | Array | Matrix} Returns the remainder of `x` divided by `y`.
   */
  var typed_mod = typed('mod', {

	//'any, any': function (x, y) {
	//	return mod(x, y, 'floored');
	//},

    'number, number, string': _mod,

    'BigNumber, BigNumber, string': function (x, y, func) {
      // TODO: Override (in BigNumber) or patch Decimal.mod to permit choosing modulo function
      // Note that as at Decimal.js 4.0.2, the 'modulo' config option defaults to 1 ('truncated')
      return y.isZero() ? x : x.mod(y);
    },

    'Fraction, Fraction, string': function (x, y, func) {
      // TODO: Patch Fraction.mod to permit choosing modulo function
      // Note that as at Fraction.js 2.7.0, mod is hard coded as 'truncated'
      return x.mod(y);
    },

    'Matrix, Matrix, string': function (x, y, func) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // mod(sparse, sparse)
              c = algorithm05(x, y, _modf(func), false);
              break;
            default:
              // mod(sparse, dense)
              c = algorithm02(y, x, _modf(func), true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // mod(dense, sparse)
              c = algorithm03(x, y, _modf(func), false);
              break;
            default:
              // mod(dense, dense)
              c = algorithm13(x, y, _modf(func));
              break;
          }
          break;
      }
      return c;
    },
    
    'Array, Array, string': function (x, y, func) {
      // use matrix implementation
      return mod(matrix(x), matrix(y), func).valueOf();
    },

    'Array, Matrix, string': function (x, y, func) {
      // use matrix implementation
      return mod(matrix(x), y, func);
    },

    'Matrix, Array, string': function (x, y, func) {
      // use matrix implementation
      return mod(x, matrix(y), func);
    },

    'Matrix, any, string': function (x, y, func) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm11(x, y, _modf(func), false);
          break;
        default:
          c = algorithm14(x, y, _modf(func), false);
          break;
      }
      return c;
    },

    'any, Matrix, string': function (x, y, func) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm12(y, x, _modf(func), true);
          break;
        default:
          c = algorithm14(y, x, _modf(func), true);
          break;
      }
      return c;
    },

    'Array, any, string': function (x, y, func) {
      // use matrix implementation
      return algorithm14(matrix(x), y, _modf(func), false).valueOf();
    },

    'any, Array, string': function (x, y, func) {
      // use matrix implementation
      return algorithm14(matrix(y), x, _modf(func), true).valueOf();
    },

  });

  // temporary placeholder to provide default value for 'func'
  var mod = function(x, y, func) {
    if(arguments.length < 3) func = 'floored';
    return typed_mod(x, y, func);
  };

  mod.toTex = '\\left(${args[0]}' + latex.operators['mod'] + '${args[1]}\\right)';

  var _mod_defs = {
	  'truncated': function(x, y) {
	    // sign of dividend
	    return x % y;
	  },

	  'floored': function(x, y) {
	    // sign of divisor
	    return x - y * Math.floor(x / y);
	  },

	  'euclidean': function(x, y) {
	    // always positive
	    y = Math.abs(y);
	    return x - y * Math.floor(x / y);
	  }
  }

  return mod;

  /**
   * Calculate the modulus of two numbers
   * @param {number} x
   * @param {number} y
   * @param {string} func
   * @returns {number} res
   * @private
   */
  function _mod(x, y, func) {
    // TODO: permit configuring the definition of mod(x, 0), see also the case for BigNumber above.
    return y === 0 ? x : _mod_defs[func](x,y);
  }

  /**
   * Create and return a wrapper for mod using the modulo function of choice.
   * @param {string} func
   * @returns {function} res
   * @private
   */
  function _modf(func) {
    return function(x, y) { mod(x, y, func); };
  }
}

exports.name = 'mod';
exports.factory = factory;
