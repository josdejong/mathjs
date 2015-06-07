'use strict';

module.exports = function(math) {
  var array = require('../../util/array');
  var Matrix = math.type.Matrix;

  /**
  * Calculates the point of intersection of two lines in two or three dimensions
  * and of a line and a plane in three dimensions. The inputs are in the form of
  * arrays or 1 dimensional matrices. The line intersection functions return null
  * if the lines do not meet.
  *
  * Syntax:
  *
  *	math.intersect(endPoint1Line1, endPoint2Line1, endPoint1Line2, endPoint2Line2)
  *	math.intersect(endPoint1, endPoint2, planeCoefficients)
  *
  * Examples:
  *
  *    math.intersect([0, 0], [10, 10], [10, 0], [0, 10]);              // Returns [5, 5]
  *    math.intersect([0, 0, 0], [10, 10, 0], [10, 0, 0], [0, 10, 0]);  // Returns [5, 5, 0]
  *    math.intersect([1, 0, 1],  [4, -2, 2], [1, 1, 1, 6]);            // Returns [7, -4, 3]
  *
  * Caveats:
  *	Fill the plane coefficients as 'x + y + z = c' and not as 'x + y + z + c = 0'
  *
  * @param  {Array | Matrix} w   Co-ordinates of first end-point of first line
  * @param  {Array | Matrix} x   Co-ordinates of second end-point of first line
  * @param  {Array | Matrix} y   Co-ordinates of first end-point of second line
  *                              OR Co-efficients of the plane's equation
  * @param  {Array | Matrix} z   Co-ordinates of second end-point of second line
  *                              OR null if the calculation is for line and plane
  * @return {Array}              Returns the point of intersection of lines/lines-planes
  */
  math.intersect = function intersect(w, x, y, z) {
    //check for correct type and modify it accordingly
    if (w instanceof Matrix) {
      w = w.toArray();
    }
    else if (x instanceof Matrix) {
      x = x.toArray();
    }
    else if (y instanceof Matrix) {
      y = y.toArray();
    }
    else if (z instanceof Matrix) {
      z = z.toArray();
    }

    if (!(Array.isArray(w) || Array.isArray(x) || Array.isArray(y) || Array.isArray(z))){
      throw new math.error.UnsupportedTypeError('intersect', math['typeof'](w), math['typeof'](x), math['typeof'](y), math['typeof'](z));
    }
    
    //decide which function to call based on type of arguments
    switch (arguments.length) {
      case 3:
        if(arguments[0].length === 3 && arguments[1].length === 3 && arguments[2].length === 4){
          return _intersectLinePlane(arguments[0][0], arguments[0][1], arguments[0][2], arguments[1][0], arguments[1][1], arguments[1][2], arguments[2][0], arguments[2][1], arguments[2][2], arguments[2][3]);
        }
        else{
          throw new TypeError('Arguments are not correct');
        }
        break;
      case 4:
        var is2D = (arguments[0].length === 2 && arguments[1].length === 2 && arguments[2].length === 2 && arguments[3].length === 2);
        var is3D = (arguments[0].length === 3 && arguments[1].length === 3 && arguments[2].length === 3 && arguments[3].length === 3);
        if (is2D){
          return _intersect2d(arguments[0][0], arguments[0][1], arguments[1][0], arguments[1][1], arguments[2][0], arguments[2][1], arguments[3][0], arguments[3][1]);
          break;
        }
        else if(is3D){
          return _intersect3d(arguments[0][0], arguments[0][1], arguments[0][2], arguments[1][0], arguments[1][1], arguments[1][2], arguments[2][0], arguments[2][1], arguments[2][2], arguments[3][0], arguments[3][1], arguments[3][2]);
          break
        }
      default:
        throw new math.error.ArgumentsError('intersect', arguments.length, 3, 4);
      }
    };

  function _intersect2d(x1, y1, x2, y2, x3, y3, x4, y4){
    var d1343 = (x1 - x3)*(x4 - x3) + (y1 - y3)*(y4 - y3);
    var d4321 = (x4 - x3)*(x2 - x1) + (y4 - y3)*(y2 - y1);
    var d1321 = (x1 - x3)*(x2 - x1) + (y1 - y3)*(y2 - y1);
    var d4343 = (x4 - x3)*(x4 - x3) + (y4 - y3)*(y4 - y3);
    var d2121 = (x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1);
    var ta = ( d1343*d4321 - d1321*d4343 ) / ( d2121*d4343 - d4321*d4321 );
    var tb = ( d1343 + ta * d4321 ) / (d4343);
   
    var pax = x1 + ta * (x2 - x1);
    var pay = y1 + ta * (y2 - y1);
    var pbx = x3 + tb * (x4 - x3);
    var pby = y3 + tb * (y4 - y3);
    if (pax === pbx && pay === pby){
      return [pax, pay];
    }
    else{
      return null;
    }
  }

  function _intersect3d(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4){
    var d1343 = (x1 - x3)*(x4 - x3) + (y1 - y3)*(y4 - y3) + (z1 - z3)*(z4 - z3);
    var d4321 = (x4 - x3)*(x2 - x1) + (y4 - y3)*(y2 - y1) + (z4 - z3)*(z2 - z1);
    var d1321 = (x1 - x3)*(x2 - x1) + (y1 - y3)*(y2 - y1) + (z1 - z3)*(z2 - z1);
    var d4343 = (x4 - x3)*(x4 - x3) + (y4 - y3)*(y4 - y3) + (z4 - z3)*(z4 - z3);
    var d2121 = (x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1) + (z2 - z1)*(z2 - z1);
    var ta = ( d1343*d4321 - d1321*d4343 ) / ( d2121*d4343 - d4321*d4321 );
    var tb = ( d1343 + ta * d4321 ) / (d4343);
    
    var pax = x1 + ta * (x2 - x1);
    var pay = y1 + ta * (y2 - y1);
    var paz = z1 + ta * (z2 - z1);
    var pbx = x3 + tb * (x4 - x3);
    var pby = y3 + tb * (y4 - y3);
    var pbz = z3 + tb * (z4 - z3);
    if (pax === pbx && pay === pby && paz === pbz){
      return [pax, pay, paz];
    }
    else{
      return null;
    }
  }
  
  function _intersectLinePlane(x1, y1, z1, x2, y2, z2, x, y, z, c){
    var t = (c - x1*x - y1*y - z1*z)/(x2*x + y2*y + z2*z - x1 - y1 - z1);
    var px = x1 + t * (x2 - x1);
    var py = y1 + t * (y2 - y1);
    var pz = z1 + t * (z2 - z1);
    return [px, py, pz];
    // TODO: Add cases when line is parallel to the plane:
    //       (a) no intersection,
    //       (b) line contained in plane
  }
}