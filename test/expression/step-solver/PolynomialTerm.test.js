"use strict"

const assert = require('assert');
const math = require('../../../index');
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
