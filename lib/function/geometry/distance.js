'use strict';

var math = require('../../../index'),
flatten = math.flatten;

function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));

  /**
    * Calculates the eucledian distance between two points in 2 and 3 dimensional spaces.
    * The points can be passed as multiples of two(for 2D) or three(for 3D) numerical arguments,
    * a 2x2 Matrix or as two 1D arrays.
    * The output will be the numeric value of the distance between those two points.
    * The input can also be in pairs of points, and the function will return a list of distances
    * between all the points.
    * In addition to the points, a parameter should be passed (either '2' or '3') signifying
    * if the points entered are in a two dimensional or three dimensional space.
    * TODO:
    *  1. DISTANCE BETWEEN POINT AND PLANE(2D)
    *  2. DISTANCE BETWEEN POINT AND PLANE(3D)
    *  3. DISTANCE BETWEEN PAIRS OF POINTS(2D)
    *  4. DISTANCE BETWEEN PAIRS OF POINTS(3D)
    *  5. DISTANCE BETWEEN PAIRS OF POINTS AND A PLANE(2D AND 3D)
    *
    * Syntax:
    *    math.distance([x1, y1], [x2, y2], 2)
    *    math.distance([x1, y1, z1], [x2, y2, z2], 3)
    *    TODO{
    *      math.distance(a, b, c, d..., 2)
    *      math.distance(a, b, c, d, e, f..., 3)
    *    }
    *
    * Examples:
    *    math.distance([0,0], [4,4], 2)                  // Returns 5.6569
    *    math.distance([1, 0, 1],  [4, -2, 2], 3)        // Returns 3.74166
    *
    * @param {Array | Matrix} x    Co-ordinates of first end-point of first line
    * @param {Array | Matrix} y    Co-ordinates of second end-point of first line
    * @param {Array | Matrix} z    Co-ordinates of third end-point of first line
    * @param {Number}              A number, either 2 or 3, signifying 2D or 3D
    * @return {Number | BigNumber} Returns the distance from two points
  */

  var distance = typed('distance', {
    'Array, Array, number': function(x, y, f){
      if (f == 2){
        if (!_2d(x)) { throw new TypeError('Array with 2 numbers expected for first argument'); }
        if (!_2d(y)) { throw new TypeError('Array with 2 numbers expected for second argument'); }
        return _distance2d(x[0], x[1], y[0], y[1]);
      }
      else if(f == 3){
        if (!_3d(x)) { throw new TypeError('Array with 3 numbers expected for first argument'); }
        if (!_3d(y)) { throw new TypeError('Array with 3 numbers expected for second argument'); }
        return _distance3d(x[0], x[1], x[2], y[0], y[1], y[2]);
      }
      else{
        throw new TypeError('Invalid Argument: The distance type can be either "2" or "3". You entered ', f);
      }
    }
  });

  return distance;
}

function _2d(a){
  // checks if the number of arguments are correct in count and are valid (should be numbers)
  return a.length === 2 && typeof a[0] === 'number' && typeof a[1] === 'number';
}

function _3d(a){
  // checks if the number of arguments are correct in count and are valid (should be numbers)
  return a.length === 3 && typeof a[0] === 'number' && typeof a[1] === 'number';
}

function _distance2d(x1, y1, x2, y2){
  var yDiff = y2 - y1;
  var xDiff = x2 - x1;
  var radicant = yDiff * yDiff + xDiff * xDiff;
  var result = Math.pow(radicant, 0.5);
  return result;
}

function _distance3d(x1, y1, z1, x2, y2, z2){
  var zDiff = z2 - z1;
  var yDiff = y2 - y1;
  var xDiff = x2 - x1;
  var radicant = zDiff * zDiff + yDiff * yDiff + xDiff * xDiff;
  var result = Math.pow(radicant, 0.5);
  return result;
}

exports.name = 'distance';
exports.factory = factory;
