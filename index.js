var loader = require('./loader');

/**
 * math.js factory function. Creates a new instance of math.js
 *
 * @param {Object} [config] Available configuration options:
 *                            {String} matrix
 *                              A string 'matrix' (default) or 'array'.
 *                            {String} number
 *                              A string 'number' (default) or 'bignumber'
 *                            {Number} precision
 *                              The number of significant digits for BigNumbers.
 *                              Not applicable for Numbers.
 */
function create (config) {
  // create a new, empty math.js instance
  // TODO: pass config here
  var math = loader.create();
  math.create = create;

  // util methods for Arrays and Matrices
  math.import(require('./lib/type/collection'));

  // data types (Matrix, Complex, Unit, ...)
  // TODO: load all data types via math.import
  math.type.Complex = require('./lib/type/Complex');
  math.type.Range = require('./lib/type/Range');
  math.type.Index = require('./lib/type/Index');
  math.import(require('./lib/type/Matrix'));
  math.type.Unit = require('./lib/type/Unit');
  math.import(require('./lib/type/Help'));
  math.type.ResultSet = require('./lib/type/ResultSet');
  math.import(require('./lib/type/BigNumber'));
  math.import(require('./lib/type/FibonacciHeap'));

  // matrix storage formats
  math.import(require('./lib/type/matrix/SparseMatrix'));
  math.import(require('./lib/type/matrix/DenseMatrix'));
  math.import(require('./lib/type/matrix/Spa')); // sparse accumulator

  // expression (expression.parse, expression.Parser, expression.node.*, expression.docs.*)
  math.import(require('./lib/expression'));

  // serialization utilities (math.json.reviver)
  math.import(require('./lib/json'));

  // functions
  math.import(require('./lib/function/algebra'));
  math.import(require('./lib/function/arithmetic'));
  math.import(require('./lib/function/bitwise'));
  math.import(require('./lib/function/complex'));
  math.import(require('./lib/function/construction'));
  math.import(require('./lib/function/expression'));
  math.import(require('./lib/function/logical'));
  math.import(require('./lib/function/matrix'));
  math.import(require('./lib/function/probability'));
  math.import(require('./lib/function/relational'));
  math.import(require('./lib/function/statistics'));
  math.import(require('./lib/function/trigonometry'));
  math.import(require('./lib/function/units'));
  math.import(require('./lib/function/utils')); // contains the config function

  // create Chain, and create proxies for all functions/constants in the math
  // namespace.
  // TODO: load Chain via math.import
  math.type.Chain = require('./lib/type/Chain')();
  math.type.Chain.createProxy(math);

  // apply custom options
  math.config(config);

  return math;
}

// return a new instance of math.js
module.exports = create();
