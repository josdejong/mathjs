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

describe('prettyPrint', function () {
  it('2 + 3 + 4', function () {
    assert.deepEqual(
      Util.prettyPrint(math.parse('2+3+4')),
      '2 + 3 + 4');
  });
  it('2 + (4 - x) + - 4', function () {
    assert.deepEqual(
      Util.prettyPrint(math.parse('2 + (4 - x) + - 4')),
      '2 + (4 - x) - 4');
  });
});

