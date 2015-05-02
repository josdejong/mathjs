var core = require('./core');

/**
 * math.js factory function. Creates a new instance of math.js
 *
 * @param {Object} [config] Available configuration options:
 *                            {number} epsilon
 *                              Minimum relative difference between two
 *                              compared values, used by all comparison functions.
 *                            {string} matrix
 *                              A string 'matrix' (default) or 'array'.
 *                            {string} number
 *                              A string 'number' (default) or 'bignumber'
 *                            {number} precision
 *                              The number of significant digits for BigNumbers.
 *                              Not applicable for Numbers.
 */
function create (config) {

  // create a new math.js instance
  var math = core.create(config);
  math.create = create;

  // util methods for Arrays and Matrices
  // TODO: export these utils in a separate path utils or something, together with ./lib/utils?
  math.import(require('./lib/type/collection'));

  // errors
  math.error = require('./lib/error');

  // data types (Matrix, Complex, Unit, ...)
  math.import(require('./lib/type/Chain'));
  math.import(require('./lib/type/Complex'));
  math.import(require('./lib/type/Range'));
  math.import(require('./lib/type/Index'));
  math.import(require('./lib/type/Matrix'));
  math.import(require('./lib/type/matrix/SparseMatrix'));
  math.import(require('./lib/type/matrix/DenseMatrix'));
  math.import(require('./lib/type/matrix/Spa')); // sparse accumulator
  math.import(require('./lib/type/Unit'));
  math.import(require('./lib/type/Help'));
  math.import(require('./lib/type/ResultSet'));
  math.import(require('./lib/type/BigNumber'));
  math.import(require('./lib/type/FibonacciHeap'));
  math.import(require('./lib/function/construction'));
  // TODO: how to group ./lib/function/construction?

  // constants
  math.import(require('./lib/constants'));

  // expression parsing
  math.import(require('./lib/expression'));
  math.import(require('./lib/function/expression'));
  // TODO: where to put ./lib/function/expression?

  // serialization utility (math.json.reviver)
  math.import(require('./lib/json'));
  // TODO: put ./lib/json in core.js?

  // functions
  math.import(require('./lib/function/algebra'));
  math.import(require('./lib/function/arithmetic'));
  math.import(require('./lib/function/bitwise'));
  math.import(require('./lib/function/complex'));
  math.import(require('./lib/function/logical'));
  math.import(require('./lib/function/matrix'));
  math.import(require('./lib/function/probability'));
  math.import(require('./lib/function/relational'));
  math.import(require('./lib/function/statistics'));
  math.import(require('./lib/function/trigonometry'));
  math.import(require('./lib/function/units'));
  math.import(require('./lib/function/utils'));

  return math;
}

// return a new instance of math.js
module.exports = create();
