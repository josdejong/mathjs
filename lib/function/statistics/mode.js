'use strict';

module.exports = function (math) {

 /**
  * Computes the mode of a set of numbers or a list with values(numbers or characters).
  * If there are more than one modes, it returns a list of those values.
  *
  * Syntax:
  *
  *     math.mode(a, b, c, ...)
  *     math.mode(A)
  *
  * Examples:
  *
  *     math.mode(2, 1, 4, 3, 1);                            // returns [1]
  *     math.mode([1, 2.7, 3.2, 4, 2.7]);                    // returns [2.7]
  *     math.mode(1, 4, 6, 1, 6)                             // returns [1, 6]
  *     math.mode('a','a','b','c')                           // returns ["a"]
  *     math.mode(1, 1.5, 'abc')                             // returns [1, 1.5, "abc"]
  *
  * See also:
  *
  *     median, mean
  *
  * @param {... *} args  A single matrix
  * @return {*} The mode of all values
  */
  
  math.mode = function mode(args){
    if (arguments.length == 0) {
      throw new SyntaxError('Mode requires one or more parameters (0 provided)');
    }
    else{
        for(var i=0; i < arguments.length-1; i++){
          if(Array.isArray(arguments[i]) && !Array.isArray(arguments[i-1])){
            throw new SyntaxError('Parameters can be of only one type (Array or Non-Array)')
          }
        }
      // mode([a, b, c, d, ...)
      if(Array.isArray(args)){
        return _mode(args);
      }
      else{
        // mode(a, b, c, d, ...)
        var argArr = new Array(arguments.length);
        for (var i = 0; i < argArr.length; ++i) {
          argArr[i] = arguments[i];
        }
        return _mode(argArr);
      }
    }
  };
  
  function _mode(values) {
    var count = {},
        mode = [],
        max = 0;
    for (var i in values) {
      if (!(values[i] in count)){
        count[values[i]] = 0;
      }
      count[values[i]]++;
      if (count[values[i]] == max){
        mode.push(values[i]);
      }
      else if (count[values[i]] > max) {
        max = count[values[i]];
        mode = [values[i]];
      }
    }
    return mode; 
  };
}