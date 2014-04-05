// test string utils
var assert = require('assert'),
    approx = require('../../tools/approx'),
    BigNumber = require('decimal.js'),
    string = require('../../lib/util/string');

describe ('string', function () {

  it('isString', function() {
    assert.equal(string.isString('hi'), true);
    assert.equal(string.isString(String('hi')), true);
    assert.equal(string.isString(new String('hi')), true);

    assert.equal(string.isString(23), false);
    assert.equal(string.isString(true), false);
    assert.equal(string.isString(new Date()), false);
  });

  it('endsWith', function() {
    assert.equal(string.endsWith('hello', 'hello'), true);
    assert.equal(string.endsWith('hello', 'lo'), true);
    assert.equal(string.endsWith('hello', ''), true);

    assert.equal(string.endsWith('hello!', 'lo'), false);
    assert.equal(string.endsWith('hello', 'LO'), false);
    assert.equal(string.endsWith('hello', 'hellohello'), false);
  });

  describe('format', function () {

    it ('should format a number', function () {
      assert.equal(string.format(2.3), '2.3');
    });

    it ('should format a bignumber', function () {
      var B = BigNumber.config({
        precision: 20
      });
      assert.equal(string.format(new B(1).div(3)), '0.33333333333333333333');
    });

    it ('should format a number with configuration', function () {
      assert.equal(string.format(1.23456, 3), '1.23');
      assert.equal(string.format(1.23456, {precision: 3}), '1.23');
    });

    it ('should format an array', function () {
      assert.equal(string.format([1,2,3]), '[1, 2, 3]');
      assert.equal(string.format([[1,2],[3,4]]), '[[1, 2], [3, 4]]');
    });

    it ('should format a string', function () {
      assert.equal(string.format('string'), '"string"');
    });

    it ('should format an object with its own format function', function () {
      var obj = {
        format: function (options) {
          var str = 'obj';
          if (options !== undefined) {
            str += ' ' + JSON.stringify(options);
          }
          return str;
        }
      };

      assert.equal(string.format(obj), 'obj');
      assert.equal(string.format(obj, 4), 'obj 4');
      assert.equal(string.format(obj, {precision: 4}), 'obj {"precision":4}');
    });

    it ('should format a function', function () {
      assert.equal(string.format(function (a, b) {return a + b}), 'function');
      var f = function (a, b) {return a + b};
      f.syntax = 'f(x, y)';
      assert.equal(string.format(f), 'f(x, y)');
    });

    it ('should format unknown objects by converting them to string', function () {
      assert.equal(string.format({}), '[object Object]');
    });

    it ('should format unknown primitives by converting them to string', function () {
      assert.equal(string.format(true), 'true');
    });

  });

});