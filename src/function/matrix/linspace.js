'use strict'

function factory (type, config, load, typed) {
  const matrix = load(require('../../type/matrix/function/matrix'))
	const complex = load(require('../../type/complex/function/complex'))
  const isInteger = load(require('../utils/isInteger'))

  /**
   * Create an array of linearly equally spaced points from start to end
   * By default, the linspace generates a array of 100 linearly equally spaced points from start 
	 * to end. The number of points can be changed by the extra parameter `n`. For `n = 1` linspace 
	 * returns the end.
   *
   * Syntax:
   *
   *     math.linspace(start, end)                    // Create a linspace from start to 
	 *																									// end with 100 points.
   *     math.linspace(start, end [, n])        			// Create a linspace from start to
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
   *     math.linspace(2, 5)        // [2, 3, 4, 5]
	 *		 math.linspace(0, 100, 11)	// [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
	 *		 math.linspace(10, 0, 5)		// [10, 7.5, 5, 2.5, 0]
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
    if (!isInteger(n)) {
      throw new SyntaxError('N "' + n + '" is no valid scalar')
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
}

exports.name = 'linspace'
exports.factory = factory
