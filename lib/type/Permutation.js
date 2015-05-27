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
          var flattenedData = _.flatten(data);
          if(!_.isEqual(_.uniq(flattenedData), flattenedData)){
            throw new TypeError('Permutation must contain unique integers from 1 to n.')
          }
          if(!_.isEmpty(data) || !_isNan(data)) {
            this._cycles = object.clone(data._cycles);
            this._numCycles = object.clone(data._numCycles);
            this._permutation = object.clone(data._permutation);
          } else {
            this._cycles = [];
            this._numCycles = 0;
            this._permutation = [];
          }
        } else if(_.isArray(data)) {
          var numCycles = 0;
          var isNewArray = [];
          var cycles = [];
          data.forEach(function(cycle) {
            if(_.isArray(cycle) && isNewArray != cycle) {
              numCycles++;
              isNewArray = cycle;
              cycles.push(cycle);
            } else if(_.isNumber(cycle)) {
              numCycles++;
              isNewArray = [];
              cycles.push([cycle]);
            }
          });
          this._numCycles = numCycles;
          this._cycles = cycles;
          this._permutation = _.flatten(data);
        } else {
          this._cycles = [];
          this._numCycles = 0;
          this._permutation = [];
        }
      }
    }

    /**
     * Test whether a value is a permutation: an Array or Matrix
     * @param {*} x
     * @returns {boolean} isPermutation
     */
     Permutation.prototype.isPermutation = function(x) {
      return (_.isArray(x) || (x instanceof Permutation));
    };

    /**
    * disjointCycles
    * Returns the permutation as disjoint cycles in a string format
    * @returns {String}
    */
    Permutation.prototype.disjointCycles = function() {
      return JSON.stringify(this._cycles);
    };

    /*
    * inverse
    * Caclulates and returns the inverse of the permutation as the second row in the 2-line notation form.
    * @returns {Array}
    */
    Permutation.prototype.inverse = function() {
      var inverseArray = [];
      if(!_.isEmpty(this._permutation)) {
        for(var i = 0; i < this._permutation.length; i++) {
          inverseArray.push(_.indexOf(this._permutation, i+1)+1);
        }
      }
      return inverseArray;
    };

    Permutation.prototype.multiply = function(multiplicand) {
      var product = [];
      if(!_.isEmpty(this._permutation)) {
        if(!_.isEmpty(multiplicand._permutation)) {
          for (var i = 0; i < multiplicand._permutation.length; i++) {
            product.push(_.indexOf(this._permutation, multiplicand._permutation[i+1]) + 1);
          };
          return product;
        } else {
          return this._permutation;
        }
      } else {
        return multiplicand._permutation;
      }
    };

    module.exports =  Permutation;
