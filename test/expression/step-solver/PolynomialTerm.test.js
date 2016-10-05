'use strict'

const assert = require('assert');
const math = require('../../../index');

const flatten = require('../../../lib/expression/step-solver/flattenOperands.js');
const PolynomialTerm = require('../../../lib/expression/step-solver/PolynomialTerm.js');

function isPolynomialTerm(exprString) {
  return PolynomialTerm.isPolynomialTerm(math.parse(exprString))
}

describe('classifies symbol terms correctly', function() {
  it('x', function () {
    assert.equal(isPolynomialTerm('x'), true);
  });
  it('-x', function () {
    assert.equal(isPolynomialTerm('x'), true);
  });
  it('x^2', function () {
    assert.equal(isPolynomialTerm('x^2'), true);
  });
  it('y^55', function () {
    assert.equal(isPolynomialTerm('y^55'), true);
  });
  it('-y^(4+3)/4', function () {
    assert.equal(isPolynomialTerm('y^4/4'), true);
  });
  it('5y/3', function () {
    assert.equal(isPolynomialTerm('5y/3'), true);
  });
  it('x^y', function () {
    assert.equal(isPolynomialTerm('x^y'), false);
  });
  it('3', function () {
    assert.equal(isPolynomialTerm('3'), false);
  });
  it('2^5', function () {
    assert.equal(isPolynomialTerm('2^5'), false);
  });
});

function combinePolynomialTerms(exprString) {
  return PolynomialTerm.combinePolynomialTerms(
    flatten(math.parse(exprString))).node;
}

function canCombine(exprString) {
  return PolynomialTerm.canCombinePolynomialTerms(
    flatten(math.parse(exprString)));
}

describe('canCombinePolynomialTerms multiplication', function() {
  it('x^2 * x * x', function () {
    assert.deepEqual(
      canCombine('x^2 * x * x'),
      true);
  });
  it('x^2 * 3x * x false b/c coefficient', function () {
    assert.deepEqual(
      canCombine('x^2 * 3x * x'),
      false);
  });
  it('y * y^3', function () {
    assert.deepEqual(
      canCombine('y * y^3 '),
      true);
  });
});

describe('combinePolynomialTerms multiplication', function() {
  it('x^2 * x * x -> x^(2+1+1)', function () {
    assert.deepEqual(
      combinePolynomialTerms('x^2 * x * x'),
      flatten(math.parse('x^(2+1+1)')));
  });
  it('y * y^3 -> y^(1+3)', function () {
    assert.deepEqual(
      combinePolynomialTerms('y * y^3'),
      math.parse('y^(1+3)'));
  });
});

describe('canCombinePolynomialTerms addition', function() {
  it('x + x', function () {
    assert.deepEqual(
      canCombine('x + x'),
      true);
  });
  it('4y^2 + 7y^2 + y^2', function () {
    assert.deepEqual(
      canCombine('4y^2 + 7y^2 + y^2'),
      true);
  });
  it('4y^2 + 7y^2 + y^2 + y no because diff exponents', function () {
    assert.deepEqual(
      canCombine('4y^2 + 7y^2 + y^2 + y'),
      false);
  });
  it('y no because only one term', function () {
    assert.deepEqual(
      canCombine('y'),
      false);
  });
});

describe('combinePolynomialTerms addition', function() {
  it('x + x -> 2x', function () {
    assert.deepEqual(
      combinePolynomialTerms('x+x'),
      flatten(math.parse('2x')));
  });
  it('4y^2 + 7y^2 + y^2 -> 12y^2', function () {
    assert.deepEqual(
      combinePolynomialTerms('4y^2 + 7y^2 + y^2'),
      math.parse('12y^2'));
  });
});


function multiplyConstantAndPolynomialTerm(exprString) {
  return PolynomialTerm.multiplyConstantAndPolynomialTerm(
    flatten(math.parse(exprString))).node;
}

describe('multiplyConstantAndPolynomialTerm', function() {
  it('2 * x^2 -> 2x^2', function () {
    assert.deepEqual(
      multiplyConstantAndPolynomialTerm('2 * x^2'),
      flatten(math.parse('2x^2')));
  });
  it('y^3 * 5-> 30y^3', function () {
    assert.deepEqual(
      multiplyConstantAndPolynomialTerm('y^3 * 5'),
      flatten(math.parse('5y^3')));
  });
});

function simplifyPolynomialFraction(exprString) {
  return PolynomialTerm.simplifyPolynomialFraction(
    flatten(math.parse(exprString))).node;
}

describe('simplifyPolynomialFraction', function() {
  it('2x/4 -> x/2', function () {
    assert.deepEqual(
      simplifyPolynomialFraction('2x/4'),
      flatten(math.parse('x/2')));
  });
  it('9y/3 -> 3y', function () {
    assert.deepEqual(
      simplifyPolynomialFraction('9y/3'),
      flatten(math.parse('3y')));
  });
  it('y/-3 -> -y/3', function () {
    assert.deepEqual(
      simplifyPolynomialFraction('y/-3'),
      flatten(math.parse('-y/3')));
  });
  it('-3y/-2 -> 3y/2', function () {
    assert.deepEqual(
      simplifyPolynomialFraction('-3y/-2'),
      flatten(math.parse('3y/2')));
  });
  it('-y/-1 -> y', function () {
    assert.deepEqual(
      simplifyPolynomialFraction('-y/-1'),
      flatten(math.parse('y')));
  });
  it('12z^2/27 -> 4z^2/9', function () {
    assert.deepEqual(
      simplifyPolynomialFraction('12z^2/27'),
      flatten(math.parse('4z^2/9')));
  });
});
