var assert = require('assert');
var math = require('../../../lib/index.js');

describe('conj', function() {

  it('should calculate the conjugate of a complex number correctly', function() {
    assert.equal(math.conj(math.complex('2 + 3i')).toString(), '2 - 3i');
    assert.equal(math.conj(123).toString(), '123');
    assert.equal(math.conj(math.complex('2 - 3i')).toString(), '2 + 3i');
    assert.equal(math.conj(math.complex('2')).toString(), '2');
    assert.equal(math.conj(math.complex('-4i')).toString(), '4i');
    assert.equal(math.conj(math.i).toString(), '-i');
  });

  it('should calculate the conjugate for each element in a matrix', function() {
    assert.equal(math.format(math.conj([math.complex('2+3i'), math.complex('3-4i')])),
        '[2 - 3i, 3 + 4i]');
    assert.equal(math.conj(math.matrix([math.complex('2+3i'), math.complex('3-4i')])).toString(),
        '[2 - 3i, 3 + 4i]');
  });

  it('should be identity if used with a string', function() {
    assert.equal(math.conj('string'), 'string');
  });

  it('should be identity if used with a unit', function() {
    assert.deepEqual(math.conj(math.unit('5cm')), math.unit('5cm'));
  });

});