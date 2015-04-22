'use strict';

var clone = require('../../util/object').clone;
var _flatten = require('../../util/array').flatten;

function factory (type, config, load, typed) {
  var matrix = load(require('../construction/matrix'));

  /**
   * Flatten a multi dimensional matrix into a single dimensional matrix.
   *
   * Syntax:
   *
   *    math.flatten(x)
   *
   * Examples:
   *
   *    math.flatten([[1,2], [3,4]]);   // returns [1, 2, 3, 4]
   *
   * See also:
   *
   *    concat, resize, size, squeeze
   *
   * @param {Matrix | Array} x   Matrix to be flattened
   * @return {Matrix | Array} Returns the flattened matrix
   */
  return typed('flatten', {
    'Array': function (x) {
      return _flatten(clone(x));
    },

    'Matrix': function (x) {
      var flat = _flatten(clone(x.toArray()));
      // TODO: return the same matrix type as x
      return matrix(flat);
    }
  });
}

exports.name = 'flatten';
exports.factory = factory;
