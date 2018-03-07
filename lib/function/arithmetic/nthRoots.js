'use strict';

function factory (type, config, load, typed) {
  var nthRoots = typed('nthRoots', {
    'Complex' : function(x) {
      return _nthComplexRoots(x, 2);
    },
    'Complex, number' : _nthComplexRoots,
  });
  nthRoots.toTex = {2: '\\{y : $y^{args[1]} = {${args[0]}}\\}'};
  return nthRoots;
}

/**
 * Calculate the nth root of a Complex Number a using De Moviers Theorem.
 * @param  {Complex} a
 * @param  {number} root
 * @return {Array} array or n Complex Roots in Polar Form.
 */
function _nthComplexRoots(a, root) {
  if (root < 0) throw new Error('Root must be greater than zero');
  if (root === 0) throw new Error('Root must be non-zero');
  if (root % 1 !== 0) throw new Error('Root must be an integer');
  var arg = a.arg();
  var abs = a.abs();
  var roots = [];
  var r = Math.pow(abs, 1/root);
  for(var k = 0; k < root; k++) {
    roots.push({r: r, phi: (arg + 2 * Math.PI * k)/root});
  }
  return roots;
}

exports.name = 'nthRoots';
exports.factory = factory;
