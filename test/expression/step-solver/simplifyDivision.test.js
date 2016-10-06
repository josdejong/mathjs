'use strict';

const assert = require('assert');
const math = require('../../../index');

const simplifyDivision = require('../../../lib/expression/step-solver/simplifyDivision.js');
const flatten = require('../../../lib/expression/step-solver/flattenOperands.js');

function simplify(exprString) {
	return simplifyDivision(flatten(math.parse(exprString))).node;
}

describe('simplifyDivision', function () {
	it('6/x/5 -> 6/(x*5)', function () {
	  assert.deepEqual(
	    simplify('6/x/5'),
	    flatten(math.parse('6/(x*5)')));
	});
  it('-(6/x/5) -> -(6/(x*5))', function () {
    assert.deepEqual(
      simplify('-(6/x/5)'),
      flatten(math.parse('-(6/(x*5))')));
  });
  it('-6/x/5 -> -6/(x*5)', function () {
    assert.deepEqual(
      simplify('-6/x/5'),
      flatten(math.parse('-6/(x*5)')));
  });
  it('(2+2)/x/6/(y-z) -> (2+2)/(x*6*(y-z))', function () {
    assert.deepEqual(
      simplify('(2+2)/x/6/(y-z)'),
      flatten(math.parse('(2+2)/(x*6*(y-z))')));
  });
  it('(2/x no change', function () {
    assert.deepEqual(
      simplify('2/x'),
      math.parse('2/x'));
  });
});
