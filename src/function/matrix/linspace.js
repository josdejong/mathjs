'use strict'
function factory (type, config, load, typed) {
  const matrix = load(require('../../type/matrix/function/matrix'))
  const complex = load(require('../../type/complex/function/complex'))
  const bignumber = load(require('../../type/bignumber/function/bignumber'))
  const isInteger = load(require('../utils/isInteger'))
  const add = load(require('../arithmetic/add'))
  const substract = load(require('../arithmetic/substract'))
  const multiply = load(require('../arithmetic/multiply'))
  const divide = load(require('../arithmetic/divide'))
  
  const ONE  = new type.BigNumber(1)

  /**
   * Create an array of linearly n equally spaced points from start to end.
   * By default, the linspace generates a array of 100 linearly equally spaced points from start
   * to end. The number of points can be changed by the extra parameter `n`. For `n = 1` linspace
   * returns the end.
   *
   * Syntax:
   *
   *     math.linspace(start, end)                    // Create a linspace from start to
   *                                                  // end with 100 points.
   *     math.linspace(start, end [, n])              // Create a linspace from start to
   *                                                  // end with n points.
   *
   * Where:
   *
   * - `start: number | Complex`
   *   Start of the linspace
   * - `end: number | Complex`
   *   End of the linspace
   * - `n: number`
   *   Number of generated points. Default is 100.
   *
   * Examples:
   *
   *     math.linspace(2, 200)      // [2, 4, 6, 8, ..., 200]
   *     math.linspace(0, 100, 11)  // [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
   *     math.linspace(10, 0, 5)    // [10, 7.5, 5, 2.5, 0]
   *
   * See also:
   *
   *     logspace, range, ones, zeros
   *
   * @param {*} args   Parameters describing the linspace `start`, `end`, and optional `n`.
   * @return {Array | Matrix} linspace
   */
  const linspace = typed('linspace', {
    'number, number': function (start, end) {
      return _out(_linspace(start, end, 100))
    },
    'number, number, number': function (start, end, n) {
      return _out(_linspace(start, end, n))
    },
    'Complex, Complex': function (start, end) {
      return _out(_complexLinspace(start, end, 100))
    },
    'Complex, Complex, number': function (start, end, n) {
      return _out(_complexLinspace(start, end, n))
    },
    'number, Complex': function (start, end) {
      return _out(_complexLinspace(complex(start), end, 100))
    },
    'Complex, number': function (start, end) {
      return _out(_complexLinspace(start, complex(end), 100))
    },
    'number, Complex, number': function (start, end, n) {
      return _out(_complexLinspace(complex(start), end, n))
    },
    'Complex, number, number': function (start, end, n) {
      return _out(_complexLinspace(start, complex(end), n))
    },
    'BigNumber, BigNumber': function (start, end) {
      return _out(_bigLinspace(start, end, bignumber(100)))
    },    
    'BigNumber, BigNumber, BigNumber': function (start, end, n) {
      return _out(_bigLinspace(start, end, n))
    }
  })
  linspace.toTex = undefined // use default template
  return linspace

  function _out (arr) {
    return config.matrix === 'Array' ? arr : matrix(arr)
  }
  /**
   * Create a linspace with numbers.
   * @param {number} start
   * @param {number} end
   * @param {number} n
   * @returns {Array} linspace
   * @private
   */
  function _linspace (start, end, n) {
    console.log('WTF')
    if (!isInteger(n)) {
      throw new TypeError('Number of values must be an integer value (actual value: ' + N + ')')
    }
    if (n < 2) {
      return n === 1 ? [end] : []
    }
    const array = []
    n = n - 1
    for (let i = 0; i <= n; i++) {
      array.push((i*end + (n-i)*start) / n)
    }
    return array
  }
  /**
   * Create a linspace with complex numbers.
   * @param {Complex} start
   * @param {Complex} end
   * @param {number} n
   * @returns {Array} range
   * @private
   */
  function _complexLinspace (start, end, n) { 
    let re = _linspace(start.re, end.re, n),
        im = _linspace(start.im, end.im, n)
    const array = []
    for (let i = 0; i < re.length; i++) {
      array.push(complex(re[i], im[i]))
    }
    return array
  }

  /**
   * Create a linspace with bigNumbers.
   * @param {BigNumber} start
   * @param {BigNumber} end
   * @param {BigNumber} n
   * @returns {Array} range
   * @private
   */
  function _bigLinspace (start, end, n) {
    if (!isInteger(n)) {
      throw new TypeError('Number of values must be an integer value (actual value: ' + N + ')');
    }

    if (n.lt(type.BigNumber(2))) {
      return n.eq(ONE) ? [end] : [];
    }

    const array = [];
    n = n.sub(ONE);

    let i = type.BigNumber(0);

    while (i.lte(n)) {
      array.push(i.mul(end).add(n.sub(i).mul(start)).div(n));
      i = i.add(ONE);
    }

    return array
  }
}
exports.name = 'linspace'
exports.factory = factory