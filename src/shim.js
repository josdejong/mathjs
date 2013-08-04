/**
 * Compatibility shims for legacy JavaScript engines
 */

// http://soledadpenades.com/2007/05/17/arrayindexof-in-internet-explorer/
if(!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(obj){
    for(var i = 0; i < this.length; i++){
      if(this[i] == obj){
        return i;
      }
    }
    return -1;
  };
}

// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(fn, scope) {
    for(var i = 0, len = this.length; i < len; ++i) {
      fn.call(scope || this, this[i], i, this);
    }
  }
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
if(!Array.isArray) {
  Array.isArray = function (vArg) {
    return Object.prototype.toString.call(vArg) === "[object Array]";
  };
}

// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map
// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.com/#x15.4.4.19
if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {

    var T, A, k;

    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + " is not a function");
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (thisArg) {
      T = thisArg;
    }

    // 6. Let A be a new array created as if by the expression new Array(len) where Array is
    // the standard built-in constructor with that name and len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while(k < len) {

      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[ k ];

        // ii. Let mappedValue be the result of calling the Call internal method of callback
        // with T as the this value and argument list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

        // For best browser support, use the following:
        A[ k ] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };
}

// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
  Array.prototype.every = function(fun /*, thisp */) {
    "use strict";

    if (this == null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun != "function") {
      throw new TypeError();
    }

    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in t && !fun.call(thisp, t[i], i, t)) {
        return false;
      }
    }

    return true;
  };
}

// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
  Array.prototype.some = function(fun /*, thisp */) {
    "use strict";

    if (this == null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun != "function") {
      throw new TypeError();
    }

    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in t && fun.call(thisp, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
}

// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
              ? this
              : oThis,
              aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
