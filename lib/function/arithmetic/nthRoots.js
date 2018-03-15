'use strict';

var Complex = require('../../type/complex/Complex');
var typed = require('../../core/typed');
var complex = Complex.factory(
  'Complex', {}, '', typed, {on: function(x, y){}}
);

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
 * If val is an integer multiple of a power of i, return that power.
 * @param  {Complex} val
 * @return {number} n where val = abs(val)*i^n or undefined if no n exists
 */
function _onRay(val) {
  var valIsNumeric = typeof(val) === 'number';
  if (!valIsNumeric && !(val.re === 0 || val.im === 0)) { return; }
  if (valIsNumeric) {
    return 2*(+(val < 0));
  }
  if (val.im === 0) {
    return 2*(+(val.re < 0));
  }
  return 2*(+(val.im < 0)) + 1;
}

/**
 * Calculate the nth root of a Complex Number a using De Movire's Theorem.
 * @param  {Complex} a
 * @param  {number} root
 * @return {Array} array of n Complex Roots
 */
function _nthComplexRoots(a, root) {
  if (root < 0) throw new Error('Root must be greater than zero');
  if (root === 0) throw new Error('Root must be non-zero');
  if (root % 1 !== 0) throw new Error('Root must be an integer');
  if (a === 0 || a.abs() === 0) return [complex(0)];
  var arg = a.arg();
  var abs = a.abs();
  var roots = [];
  // This is used to fix float artifacts for zero-valued components.
  var rays = [
    function realPos(val){return complex(val);},
    function imagPos(val){return complex(0, val);},
    function realNeg(val){return complex(-val);},
    function imagNeg(val){return complex(0, -val);}
  ];
  var r = Math.pow(abs, 1/root);
  for(var k = 0; k < root; k++) {
    var ray = (_onRay(a) + 4*k)/root;
    if (ray === Math.round(ray)) {
      roots.push(rays[ray % 4](r));
      continue;
    }
    roots.push(complex({r: r, phi: (arg + 2 * Math.PI * k)/root}));
  }
  return roots;
}

exports.name = 'nthRoots';
exports.factory = factory;
