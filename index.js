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

  // data types (Matrix, Complex, Unit, ...)
  math.import(require('./lib/type/bignumber'));
  math.import(require('./lib/type/boolean'));
  math.import(require('./lib/type/chain'));
  math.import(require('./lib/type/complex'));
  math.import(require('./lib/type/fraction'));
  math.import(require('./lib/type/index'));
  math.import(require('./lib/type/matrix'));
  math.import(require('./lib/type/number'));
  math.import(require('./lib/type/range'));
  math.import(require('./lib/type/resultset'));
  math.import(require('./lib/type/set'));
  math.import(require('./lib/type/string'));
  math.import(require('./lib/type/unit'));

  // constants
  math.import(require('./lib/constants'));

  // expression parsing
  math.import(require('./lib/expression'));

  // serialization utility (math.json.reviver)
  math.import(require('./lib/json'));

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

  // util methods for Arrays and Matrices
  // TODO: export these utils in a separate path utils or something, together with ./lib/utils?
  math.import(require('./lib/type/matrix/collection'));

  // errors
  math.error = require('./lib/error');

  return math;
}

// return a new instance of math.js
module.exports = create();
