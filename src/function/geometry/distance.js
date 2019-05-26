import { isBigNumber } from '../../utils/is'
import { factory } from '../../utils/factory'

const name = 'distance'
const dependencies = [
  'typed',
  'addScalar',
  'subtract',
  'divideScalar',
  'multiplyScalar',
  'unaryMinus',
  'sqrt',
  'abs'
]

export const createDistance = /* #__PURE__ */ factory(name, dependencies, ({ typed, addScalar, subtract, multiplyScalar, divideScalar, unaryMinus, sqrt, abs }) => {
  /**
    * Calculates:
    *    The eucledian distance between two points in 2 and 3 dimensional spaces.
    *    Distance between point and a line in 2 and 3 dimensional spaces.
    *    Pairwise distance between a set of 2D or 3D points
    * NOTE:
    *    When substituting coefficients of a line(a, b and c), use ax + by + c = 0 instead of ax + by = c
    *    For parametric equation of a 3D line, x0, y0, z0, a, b, c are from: (x−x0, y−y0, z−z0) = t(a, b, c)
    *
    * Syntax:
    *    math.distance([x1, y1], [x2, y2])
    *-   math.distance({pointOneX: 4, pointOneY: 5}, {pointTwoX: 2, pointTwoY: 7})
    *    math.distance([x1, y1, z1], [x2, y2, z2])
    *    math.distance({pointOneX: 4, pointOneY: 5, pointOneZ: 8}, {pointTwoX: 2, pointTwoY: 7, pointTwoZ: 9})
    *    math.distance([[A], [B], [C]...])
    *    math.distance([x1, y1], [LinePtX1, LinePtY1], [LinePtX2, LinePtY2])
    *    math.distance({pointX: 1, pointY: 4}, {lineOnePtX: 6, lineOnePtY: 3}, {lineTwoPtX: 2, lineTwoPtY: 8})
    *    math.distance([x1, y1, z1], [LinePtX1, LinePtY1, LinePtZ1], [LinePtX2, LinePtY2, LinePtZ2])
    *    math.distance({pointX: 1, pointY: 4, pointZ: 7}, {lineOnePtX: 6, lineOnePtY: 3, lineOnePtZ: 4}, {lineTwoPtX: 2, lineTwoPtY: 8, lineTwoPtZ: 5})
    *    math.distance([x1, y1], [xCoeffLine, yCoeffLine, constant])
    *    math.distance({pointX: 10, pointY: 10}, {xCoeffLine: 8, yCoeffLine: 1, constant: 3})
    *    math.distance([x1, y1, z1], [x0, y0, z0, a-tCoeff, b-tCoeff, c-tCoeff]) point and parametric equation of 3D line
    *    math.distance([x, y, z], [x0, y0, z0, a, b, c])
    *    math.distance({pointX: 2, pointY: 5, pointZ: 9}, {x0: 4, y0: 6, z0: 3, a: 4, b: 2, c: 0})
    *
    * Examples:
    *    math.distance([0,0], [4,4])                     // Returns 5.6569
    *    math.distance(
    *     {pointOneX: 0, pointOneY: 0},
    *     {pointTwoX: 10, pointTwoY: 10})                // Returns 14.142135623730951
    *    math.distance([1, 0, 1], [4, -2, 2])            // Returns 3.74166
    *    math.distance(
    *     {pointOneX: 4, pointOneY: 5, pointOneZ: 8},
    *     {pointTwoX: 2, pointTwoY: 7, pointTwoZ: 9})    // Returns 3
    *    math.distance([[1, 2], [1, 2], [1, 3]])         // Returns [0, 1, 1]
    *    math.distance([[1,2,4], [1,2,6], [8,1,3]])      // Returns [2, 7.14142842854285, 7.681145747868608]
    *    math.distance([10, 10], [8, 1, 3])              // Returns 11.535230316796387
    *    math.distance([10, 10], [2, 3], [-8, 0])        // Returns 8.759953130362847
    *    math.distance(
    *     {pointX: 1, pointY: 4},
    *     {lineOnePtX: 6, lineOnePtY: 3},
    *     {lineTwoPtX: 2, lineTwoPtY: 8})                // Returns 2.720549372624744
    *    math.distance([2, 3, 1], [1, 1, 2, 5, 0, 1])    // Returns 2.3204774044612857
    *    math.distance(
    *     {pointX: 2, pointY: 3, pointZ: 1},
    *     {x0: 1, y0: 1, z0: 2, a: 5, b: 0, c: 1}        // Returns 2.3204774044612857
    *
    * @param {Array | Matrix | Object} x    Co-ordinates of first point
    * @param {Array | Matrix | Object} y    Co-ordinates of second point
    * @return {Number | BigNumber} Returns the distance from two/three points
  */
  return typed(name, {
    'Array, Array, Array': function (x, y, z) {
      // Point to Line 2D (x=Point, y=LinePoint1, z=LinePoint2)
      if (x.length === 2 && y.length === 2 && z.length === 2) {
        if (!_2d(x)) { throw new TypeError('Array with 2 numbers or BigNumbers expected for first argument') }
        if (!_2d(y)) { throw new TypeError('Array with 2 numbers or BigNumbers expected for second argument') }
        if (!_2d(z)) { throw new TypeError('Array with 2 numbers or BigNumbers expected for third argument') }
        const m = divideScalar(subtract(z[1], z[0]), subtract(y[1], y[0]))
        const xCoeff = multiplyScalar(multiplyScalar(m, m), y[0])
        const yCoeff = unaryMinus(multiplyScalar(m, y[0]))
        const constant = x[1]

        return _distancePointLine2D(x[0], x[1], xCoeff, yCoeff, constant)
      } else {
        throw new TypeError('Invalid Arguments: Try again')
      }
    },
    'Object, Object, Object': function (x, y, z) {
      if (Object.keys(x).length === 2 && Object.keys(y).length === 2 && Object.keys(z).length === 2) {
        if (!_2d(x)) { throw new TypeError('Values of pointX and pointY should be numbers or BigNumbers') }
        if (!_2d(y)) { throw new TypeError('Values of lineOnePtX and lineOnePtY should be numbers or BigNumbers') }
        if (!_2d(z)) { throw new TypeError('Values of lineTwoPtX and lineTwoPtY should be numbers or BigNumbers') }
        if (x.hasOwnProperty('pointX') && x.hasOwnProperty('pointY') && y.hasOwnProperty('lineOnePtX') &&
          y.hasOwnProperty('lineOnePtY') && z.hasOwnProperty('lineTwoPtX') && z.hasOwnProperty('lineTwoPtY')) {
          const m = divideScalar(subtract(z.lineTwoPtY, z.lineTwoPtX), subtract(y.lineOnePtY, y.lineOnePtX))
          const xCoeff = multiplyScalar(multiplyScalar(m, m), y.lineOnePtX)
          const yCoeff = unaryMinus(multiplyScalar(m, y.lineOnePtX))
          const constant = x.pointX

          return _distancePointLine2D(x.pointX, x.pointY, xCoeff, yCoeff, constant)
        } else {
          throw new TypeError('Key names do not match')
        }
      } else {
        throw new TypeError('Invalid Arguments: Try again')
      }
    },
    'Array, Array': function (x, y) {
      // Point to Line 2D (x=[pointX, pointY], y=[x-coeff, y-coeff, const])
      if (x.length === 2 && y.length === 3) {
        if (!_2d(x)) {
          throw new TypeError('Array with 2 numbers or BigNumbers expected for first argument')
        }
        if (!_3d(y)) {
          throw new TypeError('Array with 3 numbers or BigNumbers expected for second argument')
        }

        return _distancePointLine2D(x[0], x[1], y[0], y[1], y[2])
      } else if (x.length === 3 && y.length === 6) {
        // Point to Line 3D
        if (!_3d(x)) {
          throw new TypeError('Array with 3 numbers or BigNumbers expected for first argument')
        }
        if (!_parametricLine(y)) {
          throw new TypeError('Array with 6 numbers or BigNumbers expected for second argument')
        }

        return _distancePointLine3D(x[0], x[1], x[2], y[0], y[1], y[2], y[3], y[4], y[5])
      } else if (x.length === 2 && y.length === 2) {
        // Point to Point 2D
        if (!_2d(x)) {
          throw new TypeError('Array with 2 numbers or BigNumbers expected for first argument')
        }
        if (!_2d(y)) {
          throw new TypeError('Array with 2 numbers or BigNumbers expected for second argument')
        }

        return _distance2d(x[0], x[1], y[0], y[1])
      } else if (x.length === 3 && y.length === 3) {
        // Point to Point 3D
        if (!_3d(x)) {
          throw new TypeError('Array with 3 numbers or BigNumbers expected for first argument')
        }
        if (!_3d(y)) {
          throw new TypeError('Array with 3 numbers or BigNumbers expected for second argument')
        }

        return _distance3d(x[0], x[1], x[2], y[0], y[1], y[2])
      } else {
        throw new TypeError('Invalid Arguments: Try again')
      }
    },
    'Object, Object': function (x, y) {
      if (Object.keys(x).length === 2 && Object.keys(y).length === 3) {
        if (!_2d(x)) {
          throw new TypeError('Values of pointX and pointY should be numbers or BigNumbers')
        }
        if (!_3d(y)) {
          throw new TypeError('Values of xCoeffLine, yCoeffLine and constant should be numbers or BigNumbers')
        }
        if (x.hasOwnProperty('pointX') && x.hasOwnProperty('pointY') && y.hasOwnProperty('xCoeffLine') &&
          y.hasOwnProperty('yCoeffLine') && y.hasOwnProperty('constant')) {
          return _distancePointLine2D(x.pointX, x.pointY, y.xCoeffLine, y.yCoeffLine, y.constant)
        } else {
          throw new TypeError('Key names do not match')
        }
      } else if (Object.keys(x).length === 3 && Object.keys(y).length === 6) {
        // Point to Line 3D
        if (!_3d(x)) {
          throw new TypeError('Values of pointX, pointY and pointZ should be numbers or BigNumbers')
        }
        if (!_parametricLine(y)) {
          throw new TypeError('Values of x0, y0, z0, a, b and c should be numbers or BigNumbers')
        }
        if (x.hasOwnProperty('pointX') && x.hasOwnProperty('pointY') && y.hasOwnProperty('x0') &&
          y.hasOwnProperty('y0') && y.hasOwnProperty('z0') && y.hasOwnProperty('a') &&
          y.hasOwnProperty('b') && y.hasOwnProperty('c')) {
          return _distancePointLine3D(x.pointX, x.pointY, x.pointZ, y.x0, y.y0, y.z0, y.a, y.b, y.c)
        } else {
          throw new TypeError('Key names do not match')
        }
      } else if (Object.keys(x).length === 2 && Object.keys(y).length === 2) {
        // Point to Point 2D
        if (!_2d(x)) {
          throw new TypeError('Values of pointOneX and pointOneY should be numbers or BigNumbers')
        }
        if (!_2d(y)) {
          throw new TypeError('Values of pointTwoX and pointTwoY should be numbers or BigNumbers')
        }
        if (x.hasOwnProperty('pointOneX') && x.hasOwnProperty('pointOneY') &&
          y.hasOwnProperty('pointTwoX') && y.hasOwnProperty('pointTwoY')) {
          return _distance2d(x.pointOneX, x.pointOneY, y.pointTwoX, y.pointTwoY)
        } else {
          throw new TypeError('Key names do not match')
        }
      } else if (Object.keys(x).length === 3 && Object.keys(y).length === 3) {
        // Point to Point 3D
        if (!_3d(x)) {
          throw new TypeError('Values of pointOneX, pointOneY and pointOneZ should be numbers or BigNumbers')
        }
        if (!_3d(y)) {
          throw new TypeError('Values of pointTwoX, pointTwoY and pointTwoZ should be numbers or BigNumbers')
        }
        if (x.hasOwnProperty('pointOneX') && x.hasOwnProperty('pointOneY') && x.hasOwnProperty('pointOneZ') &&
          y.hasOwnProperty('pointTwoX') && y.hasOwnProperty('pointTwoY') && y.hasOwnProperty('pointTwoZ')) {
          return _distance3d(x.pointOneX, x.pointOneY, x.pointOneZ, y.pointTwoX, y.pointTwoY, y.pointTwoZ)
        } else {
          throw new TypeError('Key names do not match')
        }
      } else {
        throw new TypeError('Invalid Arguments: Try again')
      }
    },
    'Array': function (arr) {
      if (!_pairwise(arr)) { throw new TypeError('Incorrect array format entered for pairwise distance calculation') }

      return _distancePairwise(arr)
    }
  })

  function _isNumber (a) {
    // distance supports numbers and bignumbers
    return (typeof a === 'number' || isBigNumber(a))
  }

  function _2d (a) {
    // checks if the number of arguments are correct in count and are valid (should be numbers)
    if (a.constructor !== Array) {
      a = _objectToArray(a)
    }
    return _isNumber(a[0]) && _isNumber(a[1])
  }

  function _3d (a) {
    // checks if the number of arguments are correct in count and are valid (should be numbers)
    if (a.constructor !== Array) {
      a = _objectToArray(a)
    }
    return _isNumber(a[0]) && _isNumber(a[1]) && _isNumber(a[2])
  }

  function _parametricLine (a) {
    if (a.constructor !== Array) {
      a = _objectToArray(a)
    }
    return _isNumber(a[0]) && _isNumber(a[1]) && _isNumber(a[2]) &&
      _isNumber(a[3]) && _isNumber(a[4]) && _isNumber(a[5])
  }

  function _objectToArray (o) {
    const keys = Object.keys(o)
    const a = []
    for (let i = 0; i < keys.length; i++) {
      a.push(o[keys[i]])
    }
    return a
  }

  function _pairwise (a) {
    // checks for valid arguments passed to _distancePairwise(Array)
    if (a[0].length === 2 && _isNumber(a[0][0]) && _isNumber(a[0][1])) {
      if (a.some(aI => aI.length !== 2 || !_isNumber(aI[0]) || !_isNumber(aI[1]))) {
        return false
      }
    } else if (a[0].length === 3 && _isNumber(a[0][0]) && _isNumber(a[0][1]) && _isNumber(a[0][2])) {
      if (a.some(aI => aI.length !== 3 || !_isNumber(aI[0]) || !_isNumber(aI[1]) || !_isNumber(aI[2]))) {
        return false
      }
    } else {
      return false
    }
    return true
  }

  function _distancePointLine2D (x, y, a, b, c) {
    const num = abs(addScalar(addScalar(multiplyScalar(a, x), multiplyScalar(b, y)), c))
    const den = sqrt(addScalar(multiplyScalar(a, a), multiplyScalar(b, b)))
    return divideScalar(num, den)
  }

  function _distancePointLine3D (x, y, z, x0, y0, z0, a, b, c) {
    let num = [ subtract(multiplyScalar(subtract(y0, y), c), multiplyScalar(subtract(z0, z), b)),
      subtract(multiplyScalar(subtract(z0, z), a), multiplyScalar(subtract(x0, x), c)),
      subtract(multiplyScalar(subtract(x0, x), b), multiplyScalar(subtract(y0, y), a)) ]
    num = sqrt(addScalar(addScalar(multiplyScalar(num[0], num[0]), multiplyScalar(num[1], num[1])), multiplyScalar(num[2], num[2])))
    const den = sqrt(addScalar(addScalar(multiplyScalar(a, a), multiplyScalar(b, b)), multiplyScalar(c, c)))
    return divideScalar(num, den)
  }

  function _distance2d (x1, y1, x2, y2) {
    const yDiff = subtract(y2, y1)
    const xDiff = subtract(x2, x1)
    const radicant = addScalar(multiplyScalar(yDiff, yDiff), multiplyScalar(xDiff, xDiff))
    return sqrt(radicant)
  }

  function _distance3d (x1, y1, z1, x2, y2, z2) {
    const zDiff = subtract(z2, z1)
    const yDiff = subtract(y2, y1)
    const xDiff = subtract(x2, x1)
    const radicant = addScalar(addScalar(multiplyScalar(zDiff, zDiff), multiplyScalar(yDiff, yDiff)), multiplyScalar(xDiff, xDiff))
    return sqrt(radicant)
  }

  function _distancePairwise (a) {
    const result = []
    for (let i = 0; i < a.length - 1; i++) {
      for (let j = i + 1; j < a.length; j++) {
        if (a[0].length === 2) {
          result.push(_distance2d(a[i][0], a[i][1], a[j][0], a[j][1]))
        } else if (a[0].length === 3) {
          result.push(_distance3d(a[i][0], a[i][1], a[i][2], a[j][0], a[j][1], a[j][2]))
        }
      }
    }
    return result
  }
})
