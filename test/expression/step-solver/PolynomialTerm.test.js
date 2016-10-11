'use strict';

const assert = require('assert');
const math = require('../../../index');

const flatten = require('../../../lib/expression/step-solver/flattenOperands.js');
const PolynomialTermNode = require('../../../lib/expression/step-solver/PolynomialTermNode.js');
const PolynomialTermOperations = require('../../../lib/expression/step-solver/PolynomialTermOperations.js');

function isPolynomialTerm(exprString) {
  return PolynomialTermNode.isPolynomialTerm(flatten(math.parse(exprString)));
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
    assert.equal(isPolynomialTerm('x^y'), true);
  });
  it('3', function () {
    assert.equal(isPolynomialTerm('3'), false);
  });
  it('2^5', function () {
    assert.equal(isPolynomialTerm('2^5'), false);
  });
  it('x*y^5', function () {
    assert.equal(isPolynomialTerm('x*y^5'), false);
  });
  it('-12y^5/-3', function () {
    assert.equal(isPolynomialTerm('-12y^5/-3'), true);
  });
});

function combinePolynomialTerms(exprString) {
  return PolynomialTermOperations.combinePolynomialTerms(
    flatten(math.parse(exprString))).node;
}

function canCombine(exprString) {
  return PolynomialTermOperations.canCombinePolynomialTerms(
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
      canCombine('y * y^3'),
      true);
  });
  it('5 * y^3', function () { // makes it implicit
    assert.deepEqual(
      canCombine('5 * y^3'),
      true);
  });
  it('5/7 * x', function () { // makes it implicit
    assert.deepEqual(
      canCombine('5/7 * x'),
      true);
  });
  it('5/7*9 * x', function () { // makes it implicit
    assert.deepEqual(
      canCombine('5/7*9 * x'),
      false);
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
  return PolynomialTermOperations.multiplyConstantAndPolynomialTerm(
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
  return PolynomialTermOperations.simplifyPolynomialFraction(
    flatten(math.parse(exprString))).node;
}

describe('simplifyPolynomialFraction', function() {
  it('2x/4 -> 1/2 x', function () {
    assert.deepEqual(
      simplifyPolynomialFraction('2x/4'),
      flatten(math.parse('1/2 x')));
  });
  it('9y/3 -> 3y', function () {
    assert.deepEqual(
      simplifyPolynomialFraction('9y/3'),
      flatten(math.parse('3y')));
  });
  it('y/-3 -> -1/3 y', function () {
    assert.deepEqual(
      simplifyPolynomialFraction('y/-3'),
      flatten(math.parse('-1/3 y')));
  });
  it('-3y/-2 -> 3/2 y', function () {
    assert.deepEqual(
      simplifyPolynomialFraction('-3y/-2'),
      flatten(math.parse('3/2 y')));
  });
  it('-y/-1 -> y', function () {
    assert.deepEqual(
      simplifyPolynomialFraction('-y/-1'),
      flatten(math.parse('y')));
  });
  it('12z^2/27 -> 4/9 z^2', function () {
    assert.deepEqual(
      simplifyPolynomialFraction('12z^2/27'),
      flatten(math.parse('4/9 z^2')));
  });
});

function negatePolynomialTerm(exprString) {
  return PolynomialTermOperations.negatePolynomialTerm(
    flatten(math.parse(exprString)));
}

describe('negatePolynomialTerm', function() {
  it('x -> -x', function () {
    assert.deepEqual(
      negatePolynomialTerm('x'),
      flatten(math.parse('-x')));
  });
  it('x^2 -> -x^2', function () {
    assert.deepEqual(
      negatePolynomialTerm('x^2'),
      flatten(math.parse('-x^2')));
  });
  it('-y^3 -> y^3', function () {
    assert.deepEqual(
      negatePolynomialTerm('-y^3'),
      flatten(math.parse('y^3')));
  });
  it('2/3 x -> -2/3 x', function () {
    assert.deepEqual(
      negatePolynomialTerm('2/3 x'),
      flatten(math.parse('-2/3 x')));
  });
  it('-5/6 z -> 5/6 x', function () {
    assert.deepEqual(
      negatePolynomialTerm('-5/6 z'),
      flatten(math.parse('5/6 z')));
  });
});
