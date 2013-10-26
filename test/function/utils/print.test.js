// test print
var assert = require('assert'),
    math = require('../../../index')();

describe('print', function() {

  it('should interpolate values in a template', function() {
    assert.equal(math.print('hello, $name!', {name: 'user'}), 'hello, user!');
  });

  it('should interpolate values from a nested object in a template', function() {
    assert.equal(math.print('hello, $name.first $name.last!', {
      name: {
        first: 'first',
        last: 'last'
      }
    }), 'hello, first last!');
  });

  it('should round interpolate values to provided precision', function() {
    assert.equal(math.print('pi=$pi', {pi: math.pi}, 3), 'pi=3.14');
  });

});