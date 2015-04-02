'use strict';

function factory (type, config, load, typed) {
  
  function Spa(length) {
    if (!(this instanceof SparseAccumulator))
      throw new SyntaxError('Constructor must be called with the new operator');
    
    // allocate vectors, TODO use typed arrays
    this._values = [];
    this._index = [];
    this._occupied = new Array(length);
    
    // reset occupied vector
    for (var i = 0, o = this._occupied; i < length; i++) 
      o[i] = false;  
  }
  
  Spa.prototype.set = function (i, v) {
    // store value
    this._values = v;
  };
  
  return Spa;
}

exports.name = 'Spa';
exports.path = 'type';
exports.factory = factory;
