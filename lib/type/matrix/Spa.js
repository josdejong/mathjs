'use strict';

function factory (type, config, load, typed) {
  
  var add = load(require('../../function/arithmetic/add'));
  
  function Spa(length) {
    if (!(this instanceof Spa))
      throw new SyntaxError('Constructor must be called with the new operator');
    
    // allocate vector, TODO use typed arrays
    this._values = new Array(length);
    this._heap = new type.FibonacciHeap();
  }
  
  Spa.prototype.set = function (i, v) {
    // check we have a value @ i
    if (!this._values[i]) {
      // insert in heap
      this._heap.insert(i);
    }
    // set the value @ i
    this._values[i] = v;
  };
  
  Spa.prototype.get = function (i) {
    return this._values[i] || 0;
  };
  
  Spa.prototype.accumulate = function (i, v) {
    // current value
    var value = this._values[i];
    // check we have a value @ i
    if (!value) {
      // insert in heap
      this._heap.insert(i);
      // initialize value
      value = 0;
    }
    // accumulate value
    this._values[i] = add(value, v);
  };
  
  Spa.prototype.forEach = function (from, to, callback) {
    // loop indexes
    for (var i = 0, values = this._values, index = this._index; i < index.length; i++) {
      // values index
      var k = index[i];
      // check it is in range
      if (k >= from && k <=to) {
        // value @ k
        var v = values[k];
        // invoke callback if needed
        if (v !== undefined)
          callback(k, v, this);
      }
    }
  };
  
  Spa.prototype.swap = function (i, j) {
    // values @ i and j
    var vi = this._values[i];
    var vj = this._values[j];
    // swap values
    this._values[i] = vj;
    this._values[j] = vi;
    // chek we need to insert indeces
    if (!vi && vj) {
      // insert in heap
      this._heap.insert(i);
      // remove from heap
      this._heap.remove(j);
    }
    else if (vi && !vj) {
      // insert in heap
      this._heap.insert(j);
      // remove from heap
      this._heap.remove(i);
    }
  };
  
  return Spa;
}

exports.name = 'Spa';
exports.path = 'type';
exports.factory = factory;
