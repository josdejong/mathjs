'use strict';

var math = require('../../../index'),
flatten = math.flatten;

function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));

  /**
    * Calculates:
    *    The eucledian distance between two points in 2 and 3 dimensional spaces.
    *    Distance between point and a line in 2 and 3 dimensional spaces.
    *    Pairwise distance between a set of 2D or 3D points
    * NOTE:
    *    When substituting coefficients of a line(a, b and c), use ax + by + c = 0 instead of ax + by = c
    *
    * Syntax:
    *    math.distance([x1, y1], [x2, y2])
    *    math.distance([x1, y1, z1], [x2, y2, z2])
    *    math.distance([[A], [B], [C]...])
    *    math.distance([x1, y1], [LineX1, LineY1], [LineX2, LineY2])
    *    math.distance([x1, y1], [xCoeffLine, yCoeffLine, constant])
    *    math.distance([x1, y1, z1], [x0, y0, z0, a-tCoeff, b-tCoeff, c-tCoeff]) point and parametric equation of 3D line
    *
    * Examples:
    *    math.distance([0,0], [4,4])                  // Returns 5.6569
    *    math.distance([1, 0, 1], [4, -2, 2])         // Returns 3.74166
    *    math.distance([[1, 2], [1, 2], [1, 3]])      // Returns [0, 1, 1]
    *    math.distance([[1,2,4], [1,2,6], [8,1,3]])   // Returns [2, 7.14142842854285, 7.681145747868608]
    *    math.distance([10, 10], [8, 1, 3])           // Returns 11.535230316796387
    *    math.distance([10, 10], [2, 3], [-8, 0])     // Returns 8.759953130362847
    *    math.distance([2, 3, 1], [1, 1, 2, 5, 0, 1]) // Returns 2.3204774044612857
    *
    * @param {Array | Matrix} x    Co-ordinates of first point
    * @param {Array | Matrix} y    Co-ordinates of second point
    * @return {Number | BigNumber} Returns the distance from two/three points
  */

  var distance = typed('distance', {
    'Array, Array, Array': function(x, y, z){
      // Point to Line 2D; (x=Point, y=LinePoint1, z=LinePoint2)
      if (x.length == 2 && y.length == 2 && z.length == 2){
        if (!_2d(x)) { throw new TypeError('Array with 2 numbers expected for first argument'); }
        if (!_2d(y)) { throw new TypeError('Array with 2 numbers expected for second argument'); }
        if (!_2d(z)) { throw new TypeError('Array with 2 numbers expected for third argument'); }
        var m = (z[1]-z[0])/(y[1]-y[0]);
        var xCoeff = m*m*y[0];
        var yCoeff = -1*(m*y[0]);
        var constant = x[1];

        return _distancePointLine2D(x[0], x[1], xCoeff, yCoeff, constant);
      }
      else{
        throw new TypeError('Invalid Argument: Try again');
      }
    },
    'Array, Array': function(x, y){
      // Point to Line 2D; (x=[pointX, pointY], y=[x-coeff, y-coeff, const])
      if (x.length == 2 && y.length == 3){
        if (!_2d(x)) { throw new TypeError('Array with 2 numbers expected for first argument'); }
        if (!_line2D(y)) { throw new TypeError('Array with 3 numbers expected for second argument'); }

        return _distancePointLine2D(x[0], x[1], y[0], y[1], y[2]);
      }
      // Point to Line 3D
      else if (x.length == 3 && y.length == 6){
        if (!_3d(x)) { throw new TypeError('Array with 3 numbers expected for first argument'); }
        if (!_parametricLine(y)) { throw new TypeError('Array with 6 numbers expected for second argument'); }

        return _distancePointLine3D(x[0], x[1], x[2], y[0], y[1], y[2], y[3], y[4], y[5]);
      }
      // Point to Point 2D
      else if (x.length == 2 && y.length == 2){
        if (!_2d(x)) { throw new TypeError('Array with 2 numbers expected for first argument'); }
        if (!_2d(y)) { throw new TypeError('Array with 2 numbers expected for second argument'); }

        return _distance2d(x[0], x[1], y[0], y[1]);
      }
      // Point to Point 3D
      else if(x.length == 3 && y.length == 3){
        if (!_3d(x)) { throw new TypeError('Array with 3 numbers expected for first argument'); }
        if (!_3d(y)) { throw new TypeError('Array with 3 numbers expected for second argument'); }

        return _distance3d(x[0], x[1], x[2], y[0], y[1], y[2]);
      }
      else{
        throw new TypeError('Invalid Argument: Try again');
      }
    },
    'Array': function(arr){
      if (!_pairwise(arr)) { throw new TypeError('Incorrect array format entered for pairwise distance calculation'); }

      return _distancePairwise(arr);
    }
  });
  return distance;
}

function _2d(a){
  // checks if the number of arguments are correct in count and are valid (should be numbers)
  return typeof a[0] === 'number' && typeof a[1] === 'number';
}

function _3d(a){
  // checks if the number of arguments are correct in count and are valid (should be numbers)
  return typeof a[0] === 'number' && typeof a[1] === 'number' && typeof a[2] === 'number';
}

function _line2D(a){
  return typeof a[0] === 'number' && typeof a[1] === 'number' && typeof a[2] === 'number';
}

function _parametricLine(a){
  return typeof a[0] === 'number' && typeof a[1] === 'number' && typeof a[2] === 'number' &&
    typeof a[3] === 'number' && typeof a[4] === 'number' && typeof a[5] === 'number';
}

function _pairwise(a){
  //checks for valid arguments passed to _distancePairwise(Array)
  if (a[0].length == 2 && typeof a[0][0] === 'number' && typeof a[0][1] === 'number'){
    for(var i in a){
      if (a[i].length != 2 || typeof a[i][0] !== 'number' || typeof a[i][1] !== 'number'){
        return false;
      }
    }
  }
  else if (a[0].length == 3 && typeof a[0][0] === 'number' && typeof a[0][1] === 'number' && typeof a[0][2] === 'number'){
    for(var i in a){
      if (a[i].length != 3 || typeof a[i][0] !== 'number' || typeof a[i][1] !== 'number' || typeof a[i][2] !== 'number'){
        return false;
      }
    }
  }
  else{
    return false;
  }
  return true;
}

function _distancePointLine2D(x, y, a, b, c){
  var num =  Math.abs(a*x + b*y + c);
  var den = Math.pow((a*a + b*b), 0.5);
  var result = (num/den);
  return result;
}

function _distancePointLine3D(x, y, z, x0, y0, z0, a, b, c){
  var num = [((y0-y)*(c))-((z0-z)*(b)), ((z0-z)*(a))-((x0-x)*(c)), ((x0-x)*(b))-((y0-y)*(a))]
  num = Math.pow(num[0]*num[0] + num[1]*num[1] + num[2]*num[2], 0.5);
  var den = Math.pow(a*a + b*b + c*c, 0.5);
  var result = num/den;
  return result;
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

function _distancePairwise(a){
  var result = [];
  for(var i = 0; i < a.length-1; i++){
    for(var j = i+1; j < a.length; j++){
      if (a[0].length == 2){
        result.push(_distance2d(a[i][0], a[i][1], a[j][0], a[j][1]));
      }
      else if (a[0].length == 3){
        result.push(_distance3d(a[i][0], a[i][1], a[i][2], a[j][0], a[j][1], a[j][2]));
      }
    }
  }
  return result;
}

exports.name = 'distance';
exports.factory = factory;
