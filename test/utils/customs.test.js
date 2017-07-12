// test boolean utils
var assert = require('assert');
var approx = require('../../tools/approx');
var customs = require('../../lib/utils/customs');
var math = require('../../index');

describe ('customs', function () {

  describe ('isSafeMethod', function() {

    it ('plain objects', function () {
      var object = {
        fn: function () {}
      }
      assert.equal(customs.isSafeMethod(object, 'fn'), true);
      assert.equal(customs.isSafeMethod(object, 'toString'), true);
      assert.equal(customs.isSafeMethod(object, 'toLocaleString'), true);
      assert.equal(customs.isSafeMethod(object, 'valueOf'), true);

      assert.equal(customs.isSafeMethod(object, 'constructor'), false);
      assert.equal(customs.isSafeMethod(object, 'hasOwnProperty'), false);
      assert.equal(customs.isSafeMethod(object, 'isPrototypeOf'), false);
      assert.equal(customs.isSafeMethod(object, 'propertyIsEnumerable'), false);
      assert.equal(customs.isSafeMethod(object, '__defineGetter__'), false);
      assert.equal(customs.isSafeMethod(object, '__defineSetter__'), false);
      assert.equal(customs.isSafeMethod(object, '__lookupGetter__'), false);
      assert.equal(customs.isSafeMethod(object, '__lookupSetter__'), false);

      // non existing method
      assert.equal(customs.isSafeMethod(object, 'foo'), false);

      // custom inherited method
      var object = {};
      object.foo = function () {};
      object = Object.create(object);
      assert.equal(customs.isSafeMethod(object, 'foo'), true);

      // ghosted native method
      var object = {};
      object.toString = function () {};
      assert.equal(customs.isSafeMethod(object, 'toString'), false);

    });

    it ('function objects', function () {
      var f = function () {};

      assert.equal(customs.isSafeMethod(f, 'call'), false);
      assert.equal(customs.isSafeMethod(f, 'bind'), false);
    });

    it ('classes', function () {
      var matrix = math.matrix();
      assert.equal(customs.isSafeMethod(matrix, 'get'), true);
      assert.equal(customs.isSafeMethod(matrix, 'toString'), true);

      var complex = math.complex();
      assert.equal(customs.isSafeMethod(complex, 'sqrt'), true);
      assert.equal(customs.isSafeMethod(complex, 'toString'), true);

      var unit = math.unit('5cm');
      assert.equal(customs.isSafeMethod(unit, 'toNumeric'), true);
      assert.equal(customs.isSafeMethod(unit, 'toString'), true);

      // extend the class instance with a custom method
      var object = math.matrix();
      object.foo = function () {};
      assert.equal(customs.isSafeMethod(object, 'foo'), true);

      // extend the class instance with a ghosted method
      var object = math.matrix();
      object.toJSON = function () {};
      assert.equal(customs.isSafeMethod(object, 'toJSON'), false);

      // unsafe native methods
      assert.equal(customs.isSafeMethod(matrix, 'constructor'), false);
      assert.equal(customs.isSafeMethod(matrix, 'hasOwnProperty'), false);
      assert.equal(customs.isSafeMethod(matrix, 'isPrototypeOf'), false);
      assert.equal(customs.isSafeMethod(matrix, 'propertyIsEnumerable'), false);
      assert.equal(customs.isSafeMethod(matrix, '__defineGetter__'), false);
      assert.equal(customs.isSafeMethod(matrix, '__defineSetter__'), false);
      assert.equal(customs.isSafeMethod(matrix, '__lookupGetter__'), false);
      assert.equal(customs.isSafeMethod(matrix, '__lookupSetter__'), false);

      // non existing method
      assert.equal(customs.isSafeMethod(matrix, 'nonExistingMethod'), false);
    });

  });

  describe ('isSafeProperty', function () {

    it ('plain objects', function () {
      var object = {};

      /* From Object.prototype:
        Object.getOwnPropertyNames(Object.prototype).forEach(
          key => typeof ({})[key] !== 'function' && console.log(key))
      */
      assert.equal(customs.isSafeProperty(object, '__proto__'), false);

      /* From Function.prototype:
        Object.getOwnPropertyNames(Function.prototype).forEach(
          key => typeof (function () {})[key] !== 'function' && console.log(key))
      */
      assert.equal(customs.isSafeProperty(object, 'length'), true);
      assert.equal(customs.isSafeProperty(object, 'name'), false);
      assert.equal(customs.isSafeProperty(object, 'arguments'), false);
      assert.equal(customs.isSafeProperty(object, 'caller'), false);

      // non existing property
      assert.equal(customs.isSafeProperty(object, 'bar'), true);

      // custom inherited property
      var object = {};
      object.foo = true;
      object = Object.create(object);
      assert.equal(customs.isSafeProperty(object, 'foo'), true);

      // ghosted native property
      var array = [];
      array = Object.create(array);
      array.length = Infinity;
      assert.equal(customs.isSafeProperty(array, 'length'), false);

      // ghosted custom property
      var object = {foo: true};
      object = Object.create(object);
      object.foo = false;
      assert.equal(customs.isSafeProperty(object, 'foo'), true);

    });

  });

  it ('should distinguish plain objects', function () {
    var a = {};
    var b = Object.create(a);
    assert.equal(customs.isPlainObject (a), true);
    assert.equal(customs.isPlainObject (b), true);

    assert.equal(customs.isPlainObject (math.unit('5cm')), false);
    assert.equal(customs.isPlainObject (math.unit('5cm')), false);
    assert.equal(customs.isPlainObject ([]), false);
    // assert.equal(customs.isPlainObject (math.complex()), false); // FIXME: shouldn't treat Complex as a plain object (it is a plain object which has __proto__ overridden)
    assert.equal(customs.isPlainObject (math.matrix()), false);
  });
});
