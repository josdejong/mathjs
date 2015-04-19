var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    conj = math.conj;

describe('conj', function() {
  it('should compute the conjugate of a boolean', function () {
    assert.strictEqual(conj(true), 1);
    assert.strictEqual(conj(false), 0);
  });

  it('should compute the conjugate of null', function () {
    assert.strictEqual(conj(null), 0);
  });

  it('should compute the conjugate of a number', function () {
    assert.equal(conj(1), 1);
    assert.equal(conj(2), 2);
    assert.equal(conj(0), 0);
    assert.equal(conj(-2), -2);
  });
  it('should compute the conjugate of a bignumber', function () {
    assert.deepEqual(conj(math.bignumber(2)), math.bignumber(2));
  });

  it('should calculate the conjugate of a complex number correctly', function() {
    assert.equal(conj(math.complex('2 + 3i')).toString(), '2 - 3i');
    assert.equal(conj(123).toString(), '123');
    assert.equal(conj(math.complex('2 - 3i')).toString(), '2 + 3i');
    assert.equal(conj(math.complex('2')).toString(), '2');
    assert.equal(conj(math.complex('-4i')).toString(), '4i');
    assert.equal(conj(math.i).toString(), '-i');
  });

  it('should calculate the conjugate for each element in a matrix', function() {
    assert.equal(math.format(conj([math.complex('2+3i'), math.complex('3-4i')])),
        '[2 - 3i, 3 + 4i]');
    assert.equal(conj(math.matrix([math.complex('2+3i'), math.complex('3-4i')])).toString(),
        '[2 - 3i, 3 + 4i]');
  });

  it('should be identity if used with a string', function() {
    assert.equal(conj('string'), 'string');
  });

  it('should be identity if used with a unit', function() {
    assert.deepEqual(conj(math.unit('5cm')), math.unit('5cm'));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {conj()}, error.ArgumentsError);
    assert.throws(function () {conj(1, 2)}, error.ArgumentsError);
  });

  it('should LaTeX conj', function () {
    var expression = math.parse('conj(1+i)');
    assert.equal(expression.toTex(), '\\left(1+ i\\right)^*');
  });

});
