'use strict';

const assert = require('assert');
const math = require('../../../index');

const Fraction = require('../../../lib/expression/step-solver/Fraction');
const flatten = require('../../../lib/expression/step-solver/flattenOperands.js');

describe('isIntegerFraction', function () {
  it('4/5 true', function () {
    assert.deepEqual(
      Fraction.isIntegerFraction(math.parse('4/5')),
      true);
  });
  it('4.3/5 false', function () {
    assert.deepEqual(
      Fraction.isIntegerFraction(math.parse('4.3/5')),
      false);
  });
  it('4x/5 false', function () {
    assert.deepEqual(
      Fraction.isIntegerFraction(math.parse('4x/5')),
      false);
  });
  it('5 false', function () {
    assert.deepEqual(
      Fraction.isIntegerFraction(math.parse('5')),
      false);
  });
});

function addConstantFractions(exprString) {
	return Fraction.addConstantFractions(math.parse(exprString)).node;
}

describe('addConstantFractions', function () {
  it('4/5 + 3/5 -> (4+3)/5', function () {
    assert.deepEqual(
      addConstantFractions('4/5 + 3/5'),
      flatten(math.parse('(4+3)/5')));
  });
  it('4/10 + 3/5 -> 4/10 + (3*2)/(5*2)', function () {
    assert.deepEqual(
      addConstantFractions('4/10 + 3/5'),
      flatten(math.parse('4/10 + (3*2)/(5*2)')));
  });
  it('4/9 + 3/5 -> (4*5)/(9*5) + (3*9)/(5*9)', function () {
    assert.deepEqual(
      addConstantFractions('4/9 + 3/5'),
      flatten(math.parse('(4*5)/(9*5) + (3*9)/(5*9)')));
  });
});

function addConstantAndFraction(exprString) {
  return Fraction.addConstantAndFraction(math.parse(exprString)).node;
}

describe('addConstantAndFraction', function () {
  it('7 + 1/2 -> 14/2 + 1/2', function () {
    assert.deepEqual(
      addConstantAndFraction('7 + 1/2'),
      flatten(math.parse('14/2 + 1/2')));
  });
  it('5/6 + 3 -> 5/6 + 18/6', function () {
    assert.deepEqual(
      addConstantAndFraction('5/6 + 3'),
      flatten(math.parse('5/6 + 18/6')));
  });
  it('1/2 + 5.8 -> 0.5 + 5.8', function () {
    assert.deepEqual(
      addConstantAndFraction('1/2 + 5.8'),
      flatten(math.parse('0.5 + 5.8')));
  });
  it('1/3 + 5.8 -> 0.3333 + 5.8', function () {
    assert.deepEqual(
      addConstantAndFraction('1/3 + 5.8'),
      flatten(math.parse('0.3333 + 5.8')));
  });
});

function multiplyConstantsAndFractions(exprString) {
	const node = flatten(math.parse(exprString));
	return flatten(Fraction.multiplyConstantsAndFractions(node).node);
}

describe('multiplyConstantsAndFractions', function () {
  it('3 * 1/5 * 5/9 -> (3*1*5)/(5*9)', function () {
    assert.deepEqual(
      multiplyConstantsAndFractions('3 * 1/5 * 5/9'),
      flatten(math.parse('(3*1*5)/(5*9)')));
  });
  it('3/7 * 10/11 -> (3*10)/(7*11)', function () {
    assert.deepEqual(
      multiplyConstantsAndFractions('3/7 * 10/11'),
      flatten(math.parse('(3*10)/(7*11)')));
  });
});

function simplifyFraction(exprStr) {
  return flatten(Fraction.simplifyFraction(flatten(math.parse(exprStr))).node);
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
