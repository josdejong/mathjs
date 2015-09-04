'use strict';

var math = require('../../../index'),
flatten = math.flatten;

function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));

  /**
    * Calculates the eucledian distance between two points in 2 and 3 dimensional spaces.

  });

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
