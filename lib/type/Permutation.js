  // utility methods for arrays and matrices
  'use strict';

  // module.exports = function (math) {
    var util = require('../util/index');
    var _ = require('underscore');
    var object = util.object;
    var array = util.array;


    function Permutation(data) {
      if (!(this instanceof Permutation)) {
        throw new SyntaxError('Constructor must be called with the new operator');
      } else if (_.isUndefined(data)) {
        throw new TypeError('Input must be not be undefined');
      } else if (!_.isArray(data)) {
        throw new UnsupportedTypeError('Input must be either Permutation or Array object');
      } else {
        if (data instanceof Permutation) {
          if(!_.isEmpty(data) || !_isNan(data)) {
            this._values = object.clone(data._values);
            this._numCycles = object.clone(data._numCycles);
          } else {
            this._values = [];
            this._numCycles = 0;
          }
        } else if(_.isArray(data)) {
          this._values = data;
          var numCycles = 0;
          var isNewArray = [];
          data.forEach(function(cycle) {
            if(_.isArray(cycle) && isNewArray != cycle) {
              numCycles++;
              isNewArray = cycle;
            } else if(_.isNumber(cycle)) {
              numCycles++;
              isNewArray = [];
            }
          });
          this._numCycles = numCycles;
        } else {
          this._values = [];
          this._numCycles = 0;
        }
      }
    }

    // /**
    //  * Convert function arguments to an array. Arguments can have the following
    //  * signature:
    //  *     fn()
    //  *     fn(n)
    //  *     fn(m, n, p, ...)
    //  *     fn([m, n, p, ...])
    //  * @param {...Number | Array | Matrix} args
    //  * @returns {Array} array
    //  */
    //  Permutation.prototype.argsToArray = function(args) {
    //   if (args.length === 0) {
    //     // fn()
    //     return [];
    //   }
    //   else if (args.length == 1) {
    //     // fn(n)
    //     // fn([m, n, p, ...])
    //     var array = args[0];
    //     if (array instanceof Matrix) {
    //       array = array.valueOf();
    //     }
    //     if (!isArray(array)) {
    //       array = [array];
    //     }
    //     return array;
    //   }
    //   else {
    //     // fn(m, n, p, ...)
    //     return util.array.argsToArray(args);
    //   }
    // };


    /**
     * Test whether a value is a permutation: an Array or Matrix
     * @param {*} x
     * @returns {boolean} isPermutation
     */
     Permutation.prototype.isPermutation = function(x) {
      return (_.isArray(x) || (x instanceof Permutation));
    };

    module.exports =  Permutation;
