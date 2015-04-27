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
  var math = loader.create();
  math.create = create;

  var _config = math._config; // TODO: cleanup as soon as redundant

  // util methods for Arrays and Matrices
  math.import(require('./lib/type/collection'));

  // data types (Matrix, Complex, Unit, ...)
  math.type.Complex = require('./lib/type/Complex');
  math.type.Range = require('./lib/type/Range');
  math.type.Index = require('./lib/type/Index');
  math.import(require('./lib/type/Matrix'));
  math.type.Unit = require('./lib/type/Unit');
  math.type.Help = require('./lib/type/Help');
  math.type.ResultSet = require('./lib/type/ResultSet');
  math.import(require('./lib/type/BigNumber'));
  math.import(require('./lib/type/FibonacciHeap'));

  // matrix storage formats
  math.import(require('./lib/type/matrix/SparseMatrix'));
  math.import(require('./lib/type/matrix/DenseMatrix'));

  // sparse accumulator
  math.import(require('./lib/type/matrix/Spa'));

  // expression (parse, Parser, node.*, docs.*)
  math.import(require('./lib/expression/node'));
  math.import(require('./lib/expression/parse'));
  math.import(require('./lib/expression/Parser'));
  math.import(require('./lib/expression/transform'));
  math.expression.docs = require('./lib/expression/docs');

  // serialization utilities
  // math.json.*
  math.import(require('./lib/json'));

  // functions
  math.import(require('./lib/function/algebra')); // decomposition and solver
  math.import(require('./lib/function/arithmetic'));
  math.import(require('./lib/function/bitwise'));
  math.import(require('./lib/function/complex'));
  math.import(require('./lib/function/construction'));
  math.import(require('./lib/function/expression'));
  math.import(require('./lib/function/logical'));

  // functions - matrix
  // TODO: replace with a matrix/index.js file when all functions are refactored
  math.import(require('./lib/function/matrix/concat'));
  math.import(require('./lib/function/matrix/cross'));
  math.import(require('./lib/function/matrix/det'));
  math.import(require('./lib/function/matrix/diag'));
  math.import(require('./lib/function/matrix/dot'));
  math.import(require('./lib/function/matrix/eye'));
  math.import(require('./lib/function/matrix/flatten'));
  math.import(require('./lib/function/matrix/inv'));
  require('./lib/function/matrix/ones')(math, _config);
  math.import(require('./lib/function/matrix/range'));
  require('./lib/function/matrix/resize')(math, _config);
  math.import(require('./lib/function/matrix/size'));
  math.import(require('./lib/function/matrix/squeeze'));
  math.import(require('./lib/function/matrix/subset'));
  math.import(require('./lib/function/matrix/trace'));
  math.import(require('./lib/function/matrix/transpose'));
  require('./lib/function/matrix/zeros')(math, _config);

  // functions
  math.import(require('./lib/function/probability'));
  math.import(require('./lib/function/relational'));
  math.import(require('./lib/function/statistics'));
  math.import(require('./lib/function/trigonometry'));
  math.import(require('./lib/function/units'));
  math.import(require('./lib/function/utils')); // contains the config function

  // create Chain, and create proxies for all functions/constants in the math
  // namespace.
  math.type.Chain = require('./lib/type/Chain')();
  math.type.Chain.createProxy(math);

  // apply custom options
  math.config(config);

  return math;
}

// return a new instance of math.js
module.exports = create();
