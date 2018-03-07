// test nthRoots
var assert = require('assert');
var math = require('../../../index');
var complex = math.complex;
var nthRoots = math.nthRoots;

describe('nthRoots', function() {
  it('should return an array of Complex Roots in Polar form', function() {
    var roots = nthRoots(complex("-1"), 6);
    var roots1 = [
      {r: 1, phi: Math.PI/6},
      {r: 1, phi: Math.PI/2},
      {r: 1, phi: (5 * Math.PI)/6},
      {r: 1, phi: (7 * Math.PI)/6},
      {r: 1, phi: (9 * Math.PI)/6},
      {r: 1, phi: (11 * Math.PI)/6}
    ];

    roots.forEach(function (value, index, array) {
      assert.equal(value.r, roots1[index].r);
      assert.equal(value.phi, roots1[index].phi);
    });
  });

});
