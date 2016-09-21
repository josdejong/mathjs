"use strict"

const assert = require('assert');
const math = require('../../../index');

const flatten = require('../../../lib/expression/step-solver/flattenOps.js');
const PolynomialTerm = require('../../../lib/expression/step-solver/PolynomialTerm.js');

describe('classifies symbol terms correctly', function() {
  it('x', function () {
    assert.equal(true, PolynomialTerm.isPolynomialTerm(math.parse('x')));
  });
  it('x^2', function () {
    assert.equal(true, PolynomialTerm.isPolynomialTerm(math.parse('x^2')));
  });
  it('y^55', function () {
    assert.equal(true, PolynomialTerm.isPolynomialTerm(math.parse('y^55')));
  });
  it('y^(4+3)/4', function () {
    assert.equal(true, PolynomialTerm.isPolynomialTerm(math.parse('y^4/4')));
  });
  it('5y/3', function () {
    assert.equal(true, PolynomialTerm.isPolynomialTerm(math.parse('5y/3')));
  });
  it('x^y', function () {
    assert.equal(false, PolynomialTerm.isPolynomialTerm(math.parse('x^y')));
  });
  it('3', function () {
    assert.equal(false, PolynomialTerm.isPolynomialTerm(math.parse('3')));
  });
  it('2^5', function () {
    assert.equal(false, PolynomialTerm.isPolynomialTerm(math.parse('2^5')));
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

/*
multiplyConstantByPolynomialTerm

simplifyPolynomialFraction

canCombinePolynomialTerms
*/
