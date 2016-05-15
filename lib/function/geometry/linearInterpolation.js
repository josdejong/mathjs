'use strict';

function factory (type, config, load, typed) {

  var linearInterpolation = typed('linearInterpolation', {
    'number, Array, Array': function (x, p0, p1) {
      if (p0.length == 2 && p1.length == 2) {
        if (!_2d(p0)) { throw new TypeError('Array with 2 numbers expected for first argument'); }
        if (!_2d(p1)) { throw new TypeError('Array with 2 numbers expected for second argument'); }

        return _linearInterp(x, p0[0], p1[0], p0[1], p1[1])
      } else {
        throw new TypeError('Invalid Arguments: Try again');
      }
    },

    'number, Object, Object': function (x, p0, p1) {
      if (Object.keys(p0).length == 2 && Object.keys(p1).length == 2){
        if (!_2d(p0)) { throw new TypeError('Point0 - Values of x and y should be numbers'); }
        if (!_2d(p1)) { throw new TypeError('Point1 = Values of x and y should be numbers'); }
        if (p0.hasOwnProperty('x') && p0.hasOwnProperty('y') &&
          p1.hasOwnProperty('x') && p1.hasOwnProperty('y')) {

          return _linearInterp(x, p0.x, p1.x, p0.y, p1.y);
        }
      } else {
        throw new TypeError('Key names do not match');
      }
    }
  });

  return linearInterpolation;
};

function _2d(a){
  // checks if the number of arguments are correct in count and are valid (should be numbers)
  if (a.constructor !== Array){
    a = _objectToArray(a);
  }
  return typeof a[0] === 'number' && typeof a[1] === 'number';
}

function _objectToArray(o){
  var keys = Object.keys(o);
  var a = [];
  for (var i = 0; i < keys.length; i++) {
    a.push(o[keys[i]]);
  }
  return a;
}

function _linearInterp(x, x0, x1, y0, y1) {
  var m = (y1 - y0)/(x1 - x0);
  return m*(x - x0) + y0;
};

exports.name = 'linearInterpolation';
exports.factory = factory;
