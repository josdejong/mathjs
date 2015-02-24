'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),
      object = util.object;

  /**
   * Clone an object.
   *
   * Syntax:
   *
   *     math.clone(x)
   *
   * Examples:
   *
   *    math.clone(3.5);                   // returns number 3.5
   *    math.clone(math.complex('2 - 4i'); // returns Complex 2 - 4i
   *    math.clone(math.unit(45, 'deg'));  // returns Unit 45 deg
   *    math.clone([[1, 2], [3, 4]]);      // returns Array [[1, 2], [3, 4]]
   *    math.clone("hello world");         // returns string "hello world"
   *
   * @param {*} x   Object to be cloned
   * @return {*} A clone of object x
   */
  math.clone = function clone (x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('clone', arguments.length, 1);
    }

    return object.clone(x);
  };
};
