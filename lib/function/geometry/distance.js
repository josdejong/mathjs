'use strict';

function factory (type, config, load, typed) {
  /**
   * Calculates the Euclidean distance between two points.
   *
   * Syntax:
   *
   *    math.distance([x1, y1], [x2, y2]);
   *    math.distance([[x1, y1], [x2, y2]);
   *
   * Examples:
   *
   *    math.distance([0,0], [4,4]) //returns 5.6569
   *    math.distance([[0,0], [4,4]]) //returns 5.6569
   *
   * @param  {Array | Matrix} x   Co-ordinates of first end-point of first line
   * @param  {Array | Matrix} y   Co-ordinates of second end-point of first line
   * @return {Number | BigNumber} Returns the distance from two points
   */

   var distance = typed('distance', {
    'Array, Array': function (x, y) {
      if (!_2d(x)) { throw new TypeError('Array with 2 numbers expected for first argument'); }
      if (!_2d(y)) { throw new TypeError('Array with 2 numbers expected for second argument'); }

      return _distance2d(x[0], x[1], y[0], y[1]);
    }

  });
   return distance;
 }

 function _2d(x) {
  return x.length === 2 && typeof x[0] === 'number' && typeof x[1] === 'number';
}

function _distance2d(x1, y1, x2, y2){
  var yDiff = y2 - y1;
  var xDiff = x2 - x1;
  var radicant = yDiff * yDiff + xDiff * xDiff;
  var result = Math.pow(radicant, 0.5);
  return result;
}


exports.name = 'distance';
exports.factory = factory;
