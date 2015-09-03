'use strict';

var math = require('../../../index'),
flatten = math.flatten;

function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));

  /**
   * Calculates the eucledian distance between two points in 2 and 3 dimensional spaces.
   * The points can be passed as 4(2D) or 6(3D) numerical arguments, a 2x2 Matrix or as two 1D arrays.
   * The output will be the numeric value of the distance between those two points.
   * The input can also be in pairs of points, and the function will return a list of distances
   * between all the points.
   * In addition to the points, a parameter should be passed (either '2' or '3') signifying
   * if the points entered are in a two dimensional or three dimensional space.
   *
   * Syntax:
   *
   *    math.distance([x1, y1], [x2, y2]);
   *    math.distance([[x1, y1], [x2, y2]);
   *    math.distance(a, b, c, d, 2)
   *    math.distance(a, b, c, d, e, f, 3)
   *    math.distance([A], [B], 2)
   *    math.distance([A], [B], 3)
   *    math.distance([A], [B], [C], [D], 2)
   *    math.distance(a, b, c, d, e, f, g, h, i, j, 2)
   *    math.distance(a, b, c, d, e, f, g, h, i, 3)
   *
   * Examples:
   *
   *    math.distance([0,0], [4,4]) //returns 5.6569
   *    math.distance([[0,0], [4,4]]) //returns 5.6569
   *    math.intersect([0, 0], [10, 10], [10, 0], [0, 10]);              // Returns [5, 5]
   *    math.intersect([0, 0, 0], [10, 10, 0], [10, 0, 0], [0, 10, 0]);  // Returns [5, 5, 0]
   *    math.intersect([1, 0, 1],  [4, -2, 2], [1, 1, 1, 6]);            // Returns [7, -4, 3]
   *
   * @param  {Array | Matrix} x   Co-ordinates of first end-point of first line
   * @param  {Array | Matrix} y   Co-ordinates of second end-point of first line
   * @return {Number | BigNumber} Returns the distance from two points
   *
   * @param  {Array | Matrix} w   Co-ordinates of first end-point of first line
   * @param  {Array | Matrix} x   Co-ordinates of second end-point of first line
   * @param  {Array | Matrix} y   Co-ordinates of first end-point of second line
   *                              OR Co-efficients of the plane's equation
   * @param  {Array | Matrix} z   Co-ordinates of second end-point of second line
   *                              OR null if the calculation is for line and plane
   * @return {Array}              Returns the point of intersection of lines/lines-planes
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
