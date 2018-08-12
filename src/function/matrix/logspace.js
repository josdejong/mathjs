'use strict'

function factory (type, config, load, typed) {
	const pow = load(require('../arithmetic/pow'))
	const log10 = load(require('../arithmetic/log10'))
	const equal = load(require('../relational/equal'))
	const linspace = load(require('../matrix/linspace'))
	
  /**
   * Create an array of logarithmically equally spaced points from 10^start to 10^end.
   * By default, the logspace generates a array of 100 logarithmically equally spaced points from start 
	 * to end. The number of points can be changed by the extra parameter `n`. For `n = 1` logspace returns 
	 * the end. If end is pi, then the points are from 10^start to pi.
   *
   * Syntax:
   *
   *     math.logspace(start, end)                    // Create a logspace from start to 
	 *																									// end with 100 points.
   *     math.logspace(start, end [, n])        		  // Create a logspace from start to
   *                                                  // end with n points.
   *
   * Where:
   *
   * - `start: number`
   *   Start of the logspace
   * - `end: number`
   *   End of the logspace
   * - `n: number`
   *   Number of generated points. Default is 100.
   *
   * Examples:
   *
   *     math.logspace(-1,2)        	// [0.1, 0.1149..., 0.1232..., ..., 100]
	 *		 math.logspace(-1,2,4)				// [0.1, 1, 10, 100]
	 *		 math.logspace(-1,math.pi,3) 	// [0.1, 0.3155..., 0.9956..., ..., pi]
   *
   * See also:
   *
   *     linspace, range, ones, zeros
   *
   * @param {*} args   Parameters describing the logspace `start`, `end`, and optional `n`.
   * @return {Array | Matrix} logspace
   */
  const logspace = typed('logspace', {
    'number, number': function (start, end) {
      return _logspace(start, end, 100);
    },
    'number, number, number': function (start, end, n) {
      return _logspace(start, end, n)
    }
  })

  logspace.toTex = undefined // use default template

  return logspace

  /**
   * Create a logspace with numbers.
   * @param {number} start
   * @param {number} end
   * @param {number} n
   * @returns {Array} logspace
   * @private
   */
  function _logspace (start, end, n) {
		if (equal(end,Math.PI)) {
			end = log10(end)
		}

		return linspace(start, end, n).map(function(x) { return pow(10,x); });
  }
}

exports.name = 'logspace'
exports.factory = factory
