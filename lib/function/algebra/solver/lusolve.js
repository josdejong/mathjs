'use strict';

function factory (type, config, load, typed) {
  
  var lup = load(require('../decomposition/lup'));
  var matrix = load(require('../../construction/matrix'));
  
  /**
   * Solves the linear system A * x = b. 
   */
  var lusolver = typed('lusolve', {
    'Array, Array': function (a, b) {
      // convert a & b to matrices
      a = matrix(a);
      b = matrix(b);
      // solve
      var x = _lusolve(a, b);
      // convert result to array
      return x.valueOf();
    }
  });
  
  var _lusolve = function (a, b) {
    // check matrix dimensions
    var sa = a.size();
    // validate dimensions
    if (sa.length !== 2)
      throw new RangeError('Matrix must be two dimensional (size: ' + string.format(sa) + ')');
    // must be nxn
    if (sa[0] !== sa[1]) 
      throw new RangeError('Matrix must be square (size: ' + string.format(sa) + ')');
    // use lu decomposition
    var r = lup(a);
    // use forward substitution to resolve L * y = b
    var y = r.L.forwardSubstitution(b);
    // use backward substitution to resolve U * x = y
    return r.U.backwardSubstitution(y);
  };

  return lusolver;
}

exports.name = 'lusolve';
exports.factory = factory;
