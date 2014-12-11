var assert = require('assert'),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    bignumber = math.bignumber,
    gamma = math.gamma;

describe('gamma', function () {

  it('should calculate the gamma of a whole number', function () {
    assert.equal(gamma(1), 1);
    assert.equal(gamma(2), 1);
    assert.equal(gamma(3), 2);
    assert.equal(gamma(4), 6);
    assert.equal(gamma(5), 24);
    assert.equal(gamma(6), 120);
    assert.equal(gamma(Infinity), Infinity);
  });

  it('should calculate the gamma of a nonpositive integer', function () {
    assert.equal(gamma(0), Infinity);
    assert.equal(gamma(-1), Infinity);
    assert.equal(gamma(-2), Infinity);
    assert.equal(gamma(-100000), Infinity);
  });

  it('should calculate the gamma of a rational number', function () {
    approx.deepEqual(gamma(0.125), 7.5339415987976119046992);
    approx.deepEqual(gamma(0.25), 3.625609908221908311930685);
    approx.deepEqual(gamma(0.5), 1.77245385090551602729816748);
    approx.deepEqual(gamma(1.5), 0.88622692545275801364908374);
    approx.deepEqual(gamma(2.5), 1.32934038817913702047362561);
    approx.deepEqual(gamma(3.5), 3.32335097044784255118406403);
    approx.deepEqual(gamma(30.5), 4.8226969334909086010917483e+31);

    approx.deepEqual(gamma(-0.5), -3.54490770181103205459633);
    approx.deepEqual(gamma(-1.5), 2.3632718012073547030642233);
    approx.deepEqual(gamma(-2.5), -0.945308720482941881225689);
  });

  it('should calculate the gamma of an irrational number', function () {
    approx.deepEqual(gamma(Math.sqrt(2)), 0.8865814287192591250809176); 
    approx.deepEqual(gamma(Math.PI), 2.2880377953400324179595889);
    approx.deepEqual(gamma(Math.E), 1.56746825577405307486334);

    approx.deepEqual(gamma(-Math.sqrt(2)), 2.599459907524570073533756846);
    approx.deepEqual(gamma(-Math.PI), 1.01569714446021834110892259347);
    approx.deepEqual(gamma(-Math.E), -0.952681729748073099220537210195);
  });

  it('should calculate the gamma of a whole bignumber', function () {
    assert.deepEqual(gamma(bignumber(1)), bignumber(1));
    assert.deepEqual(gamma(bignumber(2)), bignumber(1));
    assert.deepEqual(gamma(bignumber(3)), bignumber(2));
    assert.deepEqual(gamma(bignumber(4)), bignumber(6));
    assert.deepEqual(gamma(bignumber(5)), bignumber(24));
    assert.deepEqual(gamma(bignumber(6)), bignumber(120));
    assert.deepEqual(gamma(bignumber(31)), bignumber('265252859812191058636308480000000'));
    assert.deepEqual(gamma(bignumber(Infinity)), bignumber(Infinity));
  });

  it('should calculate the gamma of a nonpositive integer bignumber', function () {
    assert.deepEqual(gamma(bignumber(0)), bignumber(Infinity));
    assert.deepEqual(gamma(bignumber(-1)), bignumber(Infinity));
    assert.deepEqual(gamma(bignumber(-2)), bignumber(Infinity));
    assert.deepEqual(gamma(bignumber('-1.0e10223')), bignumber(Infinity));
  });
  
  it('should calculate the gamma of a rational bignumber', function () {
    //approx.deepEqual(gamma(bignumber(0.125)), bignumber('7.5339415987976119046992'));
    //approx.deepEqual(gamma(bignumber(0.25)), bignumber('3.625609908221908311930685'));
    approx.deepEqual(gamma(bignumber(0.5)), bignumber('1.77245385090551602729816748'));
    //approx.deepEqual(gamma(bignumber(1.5)), bignumber('0.88622692545275801364908374'));
    //approx.deepEqual(gamma(bignumber(2.5)), bignumber('1.32934038817913702047362561'));
    //approx.deepEqual(gamma(bignumber(3.5)), bignumber('3.32335097044784255118406403'));
    //approx.deepEqual(gamma(bignumber(30.5)), bignumber('4.8226969334909086010917483e+31'));

    //approx.deepEqual(gamma(bignumber(-0.5)), bignumber('-3.54490770181103205459633'));
    //approx.deepEqual(gamma(bignumber(-1.5)), bignumber('2.3632718012073547030642233'));
    //approx.deepEqual(gamma(bignumber(-2.5)), bignumber('-0.945308720482941881225689'));
  });

  it('should calculate the gamma of an irrational bignumber', function () {
    approx.deepEqual(gamma(bignumber(Math.sqrt(2) + '')), bignumber('0.8865814287192591250809176'));
    approx.deepEqual(gamma(bignumber(Math.PI + '')), bignumber('2.2880377953400324179595889'));
    approx.deepEqual(gamma(bignumber(Math.E + '')), bignumber('1.56746825577405307486334'));

    approx.deepEqual(gamma(bignumber(-Math.sqrt(2) + '')), bignumber('2.599459907524570073533756846'));
    approx.deepEqual(gamma(bignumber(-Math.PI + '')), bignumber('1.01569714446021834110892259347'));
    approx.deepEqual(gamma(bignumber(-Math.E + '')), bignumber('-0.952681729748073099220537210195'));
  });

  it('should calculate the gamma of an imaginary unit', function () {
    approx.deepEqual(gamma(math.i), math.complex(-0.1549498283018106851249551304838866,
                                                 -0.498015668118356042713691117462198));
  });

  it('should calculate the gamma of a complex number', function () {
    approx.deepEqual(gamma(math.complex(1, 1)), math.complex( 0.498015668118356042713691117462,
                                                             -0.15494982830181068512495513048));
    approx.deepEqual(gamma(math.complex(-1, 1)), math.complex(-0.171532919908272678794367993489,
                                                               0.326482748210083363919323123973));
    approx.deepEqual(gamma(math.complex(1, -1)), math.complex(0.498015668118356042713691117462,
                                                              0.15494982830181068512495513048));
    approx.deepEqual(gamma(math.complex(-1, -1)), math.complex(-0.171532919908272678794367993489,
                                                               -0.326482748210083363919323123973));
    approx.deepEqual(gamma(math.complex(0.5, 0.5)), math.complex( 0.8181639995417473940777488735553249,
                                                                 -0.7633138287139826166702967877609));
    approx.deepEqual(gamma(math.complex(-0.5, 0.5)), math.complex(-1.581477828255730010748045661316,
                                                                  -0.054850170827764777407452085794));
    approx.deepEqual(gamma(math.complex(0.5, -0.5)), math.complex(0.8181639995417473940777488735553249,
                                                                  0.7633138287139826166702967877609));
    approx.deepEqual(gamma(math.complex(-0.5, -0.5)), math.complex(-1.581477828255730010748045661316,
                                                                    0.054850170827764777407452085794));
    approx.deepEqual(gamma(math.complex(5, 3)), math.complex( 0.0160418827416523250315696368,
                                                             -9.433293289755986999320428818));
    approx.deepEqual(gamma(math.complex(-5, 3)), math.complex(7.8964874812393125559757726129e-6,
                                                              4.75617383659732237692628366667e-6));
    approx.deepEqual(gamma(math.complex(5, -3)), math.complex(0.0160418827416523250315696368,
                                                              9.433293289755986999320428818));
    approx.deepEqual(gamma(math.complex(-5, -3)), math.complex( 7.8964874812393125559757726129e-6,
                                                               -4.75617383659732237692628366667e-6));
  });

  it('should calculate the gamma of a boolean', function () {
    assert.equal(gamma(true), 1);
    assert.equal(gamma(false), Infinity);
  });

  it('should calculate the gamma of null', function () {
    assert.equal(gamma(null), Infinity);
  });

  it('should calculate the gamma of each element in a matrix', function () {
    assert.deepEqual(gamma(math.matrix([0,1,2,3,4,5])), math.matrix([Infinity,1,1,2,6,24]));
  });

  it('should calculate the gamma of each element in an array', function () {
    assert.deepEqual(gamma([0,1,2,3,4,5]), [Infinity,1,1,2,6,24]);
  });

  it('should throw en error if called with invalid number of arguments', function() {
    assert.throws(function() { gamma(); });
    assert.throws(function() { gamma(1,3); });
  });

  it('should throw en error if called with invalid type of argument', function() {
    assert.throws(function() { gamma(new Date()); });
    assert.throws(function() { gamma('a string'); });
  });


});
