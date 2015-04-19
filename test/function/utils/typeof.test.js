// test typeof
var assert = require('assert'),
    math = require('../../../index')
    Index = math.type.Index,
    Range = math.type.Range,
    Matrix = math.type.Matrix,
    Help = math.type.Help,
    Unit = math.type.Unit,
    Complex = math.type.Complex;

describe('typeof', function() {

  it('should return number type for a number', function() {
    assert.equal(math.typeof(2), 'number');
    assert.equal(math.typeof(new Number(2)), 'number');
  });

  it('should return bignumber type for a bignumber', function() {
    assert.equal(math.typeof(math.bignumber(0.1)), 'bignumber');
    assert.equal(math.typeof(new math.type.BigNumber('0.2')), 'bignumber');
  });

  it('should return string type for a string', function() {
    assert.equal(math.typeof('hello there'), 'string');
    assert.equal(math.typeof(new String('hello there')), 'string');
  });

  it('should return complex type for a complex number', function() {
    assert.equal(math.typeof(new Complex(2,3)), 'complex');
    assert.equal(math.typeof(math.complex(2,3)), 'complex');
  });

  it('should return array type for an array', function() {  
    assert.equal(math.typeof([1,2,3]), 'array');
    assert.equal(math.typeof(new Array()), 'array');
  });

  it('should return array type for an array', function() {
    assert.equal(math.typeof([1,2,3]), 'array');
    assert.equal(math.typeof(new Array()), 'array');
  });

  it('should return matrix type for a matrix', function() {  
    assert.equal(math.typeof(math.matrix()), 'matrix');
    assert.equal(math.typeof(math.matrix()), 'matrix');
  });

  it('should return unit type for a unit', function() {
    assert.equal(math.typeof(new Unit(5, 'cm')), 'unit');
    assert.equal(math.typeof(math.unit('5cm')), 'unit');
  });

  it('should return boolean type for a boolean', function() {  
    assert.equal(math.typeof(true), 'boolean');
    assert.equal(math.typeof(false), 'boolean');
    assert.equal(math.typeof(new Boolean(true)), 'boolean');
  });

  it('should return null type for null', function() {  
    assert.equal(math.typeof(null), 'null');
  });

  it('should return undefined type for undefined', function() {  
    assert.equal(math.typeof(undefined), 'undefined');
  });

  it('should return date type for a Date', function() {  
    assert.equal(math.typeof(new Date()), 'date');
  });

  it('should return function type for a function', function() {  
    assert.equal(math.typeof(function () {}), 'function');
    assert.equal(math.typeof(new Function ()), 'function');
  });

  it('should return function type for a chain', function() {
    assert.equal(math.typeof(math.chain(3)), 'chain');
  });

  it('should return function type for an index', function() {
    assert.equal(math.typeof(new Index([0, 10])), 'index');
  });

  it('should return function type for a range', function() {
    assert.equal(math.typeof(new Range(0, 10)), 'range');
  });

  it('should return function type for a help object', function() {
    assert.equal(math.typeof(new Help({}, {})), 'help');
  });

  it('should return object type for an object', function() {  
    assert.equal(math.typeof({}), 'object');
    assert.equal(math.typeof(new Object()), 'object');
  });

  it('should throw an error if called with a wrong number of arguments', function() {
    assert.throws(function() {math.typeof(); });
    assert.throws(function() {math.typeof(1,2); });
  });

  it('should LaTeX typeof', function () {
    var expression = math.parse('typeof(1)');
    assert.equal(expression.toTex(), '\\mathrm{typeof}\\left(1\\right)');
  });

});
