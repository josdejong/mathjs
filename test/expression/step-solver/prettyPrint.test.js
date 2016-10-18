'use strict';

const assert = require('assert');
const math = require('../../../index');
const prettyPrint = require('../../../lib/expression/step-solver/prettyPrint.js');
const flatten = require('../../../lib/expression/step-solver/flattenOperands.js');

describe('prettyPrint asciimath', function () {
  it('2 + 3 + 4', function () {
    assert.deepEqual(
      prettyPrint(math.parse('2+3+4')),
      '2 + 3 + 4');
  });
  it('2 + (4 - x) + - 4', function () {
    assert.deepEqual(
      prettyPrint(math.parse('2 + (4 - x) + - 4')),
      '2 + (4 - x) - 4');
  });
  it('2/3 x^2', function () {
    assert.deepEqual(
      prettyPrint(math.parse('2/3 x^2')),
      '2/3 x^2');
  });
});

describe('prettyPrint latex', function () {
  it('2 + 3 + 4', function () {
    assert.deepEqual(
      prettyPrint(math.parse('2+3+4'), true),
      '2+3+4');
  });
  it('2 + (4 - x) + - 4', function () {
    assert.deepEqual(
      prettyPrint(math.parse('2 + (4 - x) + - 4'), true),
      '2+\\left(4- x\\right)-4');
  });
  it('2/3 x^2', function () {
    assert.deepEqual(
      prettyPrint(math.parse('2/3 x^2'), true),
      '\\frac{2}{3}~{ x}^{2}');
  });
});
