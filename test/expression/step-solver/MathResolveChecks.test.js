'use strict'

const assert = require('assert');
const math = require('../../../index');

const MathResolveChecks = require('../../../lib/expression/step-solver/MathResolveChecks.js');

function resolvesToConstant(exprString) {
	return MathResolveChecks.resolvesToConstant(math.parse(exprString));
}

describe('resolvesToConstant', function () {
  it('(2+2) true', function () {
    assert.deepEqual(
      resolvesToConstant('(2+2)'),
      true);
  });
  it('10 true', function () {
    assert.deepEqual(
      resolvesToConstant('10'),
      true);
  });
  it('((2^2 + 4)) * 7 / 8 true', function () {
    assert.deepEqual(
      resolvesToConstant('((2^2 + 4)) * 7 / 8'),
      true);
  });
  it('2 * 3^x false', function () {
    assert.deepEqual(
      resolvesToConstant('2 * 3^x'),
      false);
  });
  it('-(2) * -3 true', function () {
    assert.deepEqual(
      resolvesToConstant('-(2) * -3'),
      true);
  });
});
