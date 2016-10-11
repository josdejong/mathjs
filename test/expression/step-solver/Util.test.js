'use strict';

const assert = require('assert');
const math = require('../../../index');
const Util = require('../../../lib/expression/step-solver/Util.js');
const flatten = require('../../../lib/expression/step-solver/flattenOperands.js');

describe('appendToArrayInObject', function () {
  it('creates empty array', function () {
    let object = {};
    Util.appendToArrayInObject(object, 'key', 'value');
    assert.deepEqual(
      object,
      {'key': ['value']}
     );
  });
  it('appends to array if it exists', function () {
    let object = {'key': ['old_value']};
    Util.appendToArrayInObject(object, 'key', 'new_value');
    assert.deepEqual(
      object,
      {'key': ['old_value', 'new_value']}
     );
  });
});

describe('isConstantOrConstantFraction', function () {
  it('2 true', function () {
    assert.deepEqual(
      Util.isConstantOrConstantFraction(math.parse('2')),
      true);
  });
  it('2/9 true', function () {
    assert.deepEqual(
      Util.isConstantOrConstantFraction(math.parse('4/9')),
      true);
  });
  it('x/2 false', function () {
    assert.deepEqual(
      Util.isConstantOrConstantFraction(math.parse('x/2')),
      false);
  });
});

function simplifyFraction(exprStr) {
  return flatten(Util.simplifyFraction(flatten(math.parse(exprStr))).node);
}

describe('simplifyFraction', function() {
  it('2/4 -> 1/2', function () {
    assert.deepEqual(
      simplifyFraction('2/4'),
      flatten(math.parse('1/2')));
  });
  it('9/3 -> 3', function () {
    assert.deepEqual(
      simplifyFraction('9/3'),
      flatten(math.parse('3')));
  });
  it('1/-3 -> -1/3', function () {
    assert.deepEqual(
      simplifyFraction('1/-3'),
      flatten(math.parse('-1/3')));
  });
  it('-3/-2 -> 3/2', function () {
    assert.deepEqual(
      simplifyFraction('-3/-2'),
      flatten(math.parse('3/2')));
  });
  it('-1/-1 -> 1', function () {
    assert.deepEqual(
      simplifyFraction('-1/-1'),
      flatten(math.parse('1')));
  });
  it('12/27 -> 4/9', function () {
    assert.deepEqual(
      simplifyFraction('12/27'),
      flatten(math.parse('4/9')));
  });
});
