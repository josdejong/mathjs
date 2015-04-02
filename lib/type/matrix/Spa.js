'use strict';

function factory (type, config, load, typed) {
  
  var add = load(require('../../function/arithmetic/add'));
  
  function Spa() {
    if (!(this instanceof Spa))
      throw new SyntaxError('Constructor must be called with the new operator');
    
    // allocate vector, TODO use typed arrays
    this._values = [];
  }
  
  Spa.prototype.set = function (i, v) {
    // set the value @ i
    this._values[i] = v;
  };
  
  Spa.prototype.get = function (i) {
    return this._values[i] || 0;
  };
  
  Spa.prototype.accumulate = function (i, v) {
    // accumulate value
    this._values[i] = add(this._values[i] || 0, v);
  };
  
  Spa.prototype.forEach = function (callback, from, to) {
    // check arguments
    if (arguments.length === 1) {
      // from & to
      from = 0;
      to = this._values.length - 1;
    }
    else if (arguments.length === 2) {
      // to
      to = this._values.length - 1;
    }
    // loop indexes [from, to]
    for (var i = from, values = this._values; i <= to; i++) {
      // value @ i
      var v = values[i];
      // invoke callback if needed
      if (v !== undefined)
        callback(i, v, this);
    }
  };
  
  return Spa;
}

exports.name = 'Spa';
exports.path = 'type';
exports.factory = factory;
