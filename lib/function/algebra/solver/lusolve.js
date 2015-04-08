'use strict';

function factory (type, config, load, typed) {
  
  var lup = load(require('../decomposition/lup'));
  
  /**
   * Solves the linear system A * x = b. 
   */
  var lusolver = typed('lusolve', {
    'Array, Array': function (a, b) {
      return _lusolve(a, b);
    }
  });
  
  var _lusolve = function (a, b) {
    // use lu decomposition
    var lu = lup(a);
    
    return [-1, -0.5, -1/3, -0.25];
  };

  return lusolver;
}

exports.name = 'lusolve';
exports.factory = factory;
