// test round
var assert = require('assert'),
  approx = require('../../../tools/approx'),
  error = require('../../../lib/error/index'),
  math = require('../../../index'),
  bignumber = math.bignumber,
  sigFig = math.sigFig;

describe('sigFig', function() {

  it('should round a number to the given number of significant figures', function() {
    approx.equal(sigFig(math.pi, 1), 3);
    approx.equal(sigFig(math.pi * 10, 1), 30);
    approx.equal(sigFig(math.pi * 10, 2), 31);
    approx.equal(sigFig(math.pi * 1000, 3), 3140);
    approx.equal(sigFig(math.pi * 1000, 6), 3141.59);
    approx.equal(sigFig(math.pi, 3), 3.14);
    approx.equal(sigFig(-1 * math.pi, 3), -3.14);
    approx.equal(sigFig(-1 * math.pi * 1000, 3), -3140);
  });

  it('should round booleans (yeah, not really useful but it should be supported)', function() {
    approx.equal(sigFig(true, 2), 1);
    approx.equal(sigFig(false, 2), 0);
  });


});