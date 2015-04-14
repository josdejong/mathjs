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

  // expression (parse, Parser, nodes, docs)
  math.expression = {};
  math.expression.node = require('./lib/expression/node/index');
  math.import(require('./lib/expression/parse'));
  math.import(require('./lib/expression/Parser'));
  math.expression.docs = require('./lib/expression/docs/index');

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
  
  // sparse accumulator
  math.import(require('./lib/type/matrix/Spa'));
  
  // matrix storage formats
  math.import(require('./lib/type/matrix/CcsMatrix'));
  math.import(require('./lib/type/matrix/CrsMatrix'));
  math.import(require('./lib/type/matrix/DenseMatrix'));
  
  // matrix storage format registry
  math.type.Matrix._storage.ccs = math.type.CcsMatrix;
  math.type.Matrix._storage.crs = math.type.CrsMatrix;
  math.type.Matrix._storage.dense = math.type.DenseMatrix;
  math.type.Matrix._storage['default'] = math.type.DenseMatrix;

  // serialization utilities
  // math.json.*
  math.import(require('./lib/json/reviver'));

  // functions - algebra/decomposition
  math.import(require('./lib/function/algebra/decomposition/lup'));
  
  // functions - algebra/solver
  math.import(require('./lib/function/algebra/solver/lusolve'));
  
  // functions - arithmetic
  math.import(require('./lib/function/arithmetic/abs'));
  math.import(require('./lib/function/arithmetic/add'));
  math.import(require('./lib/function/arithmetic/ceil'));
  math.import(require('./lib/function/arithmetic/cube'));
  math.import(require('./lib/function/arithmetic/divide'));
  math.import(require('./lib/function/arithmetic/dotDivide'));
  math.import(require('./lib/function/arithmetic/dotMultiply'));
  math.import(require('./lib/function/arithmetic/dotPow'));
  math.import(require('./lib/function/arithmetic/exp'));
  math.import(require('./lib/function/arithmetic/fix'));
  math.import(require('./lib/function/arithmetic/floor'));
  math.import(require('./lib/function/arithmetic/gcd'));
  math.import(require('./lib/function/arithmetic/lcm'));
  math.import(require('./lib/function/arithmetic/log'));
  math.import(require('./lib/function/arithmetic/log10'));
  math.import(require('./lib/function/arithmetic/mod'));
  math.import(require('./lib/function/arithmetic/multiply'));
  math.import(require('./lib/function/arithmetic/norm'));
  math.import(require('./lib/function/arithmetic/nthRoot'));
  math.import(require('./lib/function/arithmetic/pow'));
  math.import(require('./lib/function/arithmetic/round'));
  math.import(require('./lib/function/arithmetic/sign'));
  math.import(require('./lib/function/arithmetic/sqrt'));
  math.import(require('./lib/function/arithmetic/square'));
  math.import(require('./lib/function/arithmetic/subtract'));
  math.import(require('./lib/function/arithmetic/unaryMinus'));
  math.import(require('./lib/function/arithmetic/unaryPlus'));
  math.import(require('./lib/function/arithmetic/xgcd'));

  // functions - bitwise
  math.import(require('./lib/function/bitwise/bitAnd'));
  math.import(require('./lib/function/bitwise/bitNot'));
  math.import(require('./lib/function/bitwise/bitOr'));
  math.import(require('./lib/function/bitwise/bitXor'));
  math.import(require('./lib/function/bitwise/leftShift'));
  math.import(require('./lib/function/bitwise/rightArithShift'));
  math.import(require('./lib/function/bitwise/rightLogShift'));

  // functions - complex
  math.import(require('./lib/function/complex/arg'));
  math.import(require('./lib/function/complex/conj'));
  math.import(require('./lib/function/complex/re'));
  math.import(require('./lib/function/complex/im'));

  // functions - construction
  math.import(require('./lib/function/construction/bignumber'));
  math.import(require('./lib/function/construction/boolean'));
  math.import(require('./lib/function/construction/chain'));
  math.import(require('./lib/function/construction/complex'));
  math.import(require('./lib/function/construction/index'));
  math.import(require('./lib/function/construction/matrix'));
  math.import(require('./lib/function/construction/number'));
  math.import(require('./lib/function/construction/parser'));
  math.import(require('./lib/function/construction/string'));
  math.import(require('./lib/function/construction/unit'));

  // expression parser
  math.import(require('./lib/function/expression/compile'));
  math.import(require('./lib/function/expression/eval'));
  math.import(require('./lib/function/expression/help'));
  math.import(require('./lib/function/expression/parse'));

  // functions - logical
  math.import(require('./lib/function/logical/and'));
  math.import(require('./lib/function/logical/not'));
  math.import(require('./lib/function/logical/or'));
  math.import(require('./lib/function/logical/xor'));

  // functions - matrix
  require('./lib/function/matrix/concat')(math, _config);
  require('./lib/function/matrix/cross')(math, _config);
  math.import(require('./lib/function/matrix/det'));
  math.import(require('./lib/function/matrix/diag'));
  require('./lib/function/matrix/dot')(math, _config);
  math.import(require('./lib/function/matrix/eye'));
  require('./lib/function/matrix/flatten')(math, _config);
  math.import(require('./lib/function/matrix/inv'));
  require('./lib/function/matrix/ones')(math, _config);
  require('./lib/function/matrix/range')(math, _config);
  require('./lib/function/matrix/resize')(math, _config);
  require('./lib/function/matrix/size')(math, _config);
  require('./lib/function/matrix/squeeze')(math, _config);
  require('./lib/function/matrix/subset')(math, _config);
  require('./lib/function/matrix/trace')(math, _config);
  math.import(require('./lib/function/matrix/transpose'));
  require('./lib/function/matrix/zeros')(math, _config);

  // functions - probability
  //require('./lib/function/probability/distribution')(math, _config); // TODO: rethink math.distribution
  require('./lib/function/probability/factorial')(math, _config);
  require('./lib/function/probability/gamma')(math, _config);
  require('./lib/function/probability/random')(math, _config);
  require('./lib/function/probability/randomInt')(math, _config);
  require('./lib/function/probability/pickRandom')(math, _config);
  require('./lib/function/probability/permutations')(math, _config);
  require('./lib/function/probability/combinations')(math, _config);

  // functions - relational
  math.import(require('./lib/function/relational/compare'));
  math.import(require('./lib/function/relational/deepEqual'));
  math.import(require('./lib/function/relational/equal'));
  math.import(require('./lib/function/relational/larger'));
  math.import(require('./lib/function/relational/largerEq'));
  math.import(require('./lib/function/relational/smaller'));
  math.import(require('./lib/function/relational/smallerEq'));
  math.import(require('./lib/function/relational/unequal'));

  // functions - statistics
  math.import(require('./lib/function/statistics/max'));
  math.import(require('./lib/function/statistics/mean'));
  math.import(require('./lib/function/statistics/median'));
  math.import(require('./lib/function/statistics/min'));
  math.import(require('./lib/function/statistics/prod'));
  math.import(require('./lib/function/statistics/std'));
  math.import(require('./lib/function/statistics/sum'));
  math.import(require('./lib/function/statistics/var'));

  // functions - trigonometry
  math.import(require('./lib/function/trigonometry/acos'));
  math.import(require('./lib/function/trigonometry/acosh'));
  math.import(require('./lib/function/trigonometry/acot'));
  math.import(require('./lib/function/trigonometry/acoth'));
  math.import(require('./lib/function/trigonometry/acsc'));
  math.import(require('./lib/function/trigonometry/acsch'));
  math.import(require('./lib/function/trigonometry/asec'));
  math.import(require('./lib/function/trigonometry/asech'));
  math.import(require('./lib/function/trigonometry/asin'));
  math.import(require('./lib/function/trigonometry/asinh'));
  math.import(require('./lib/function/trigonometry/atan'));
  math.import(require('./lib/function/trigonometry/atan2'));
  math.import(require('./lib/function/trigonometry/atanh'));
  math.import(require('./lib/function/trigonometry/cos'));
  math.import(require('./lib/function/trigonometry/cosh'));
  math.import(require('./lib/function/trigonometry/cot'));
  math.import(require('./lib/function/trigonometry/coth'));
  math.import(require('./lib/function/trigonometry/csc'));
  math.import(require('./lib/function/trigonometry/csch'));
  math.import(require('./lib/function/trigonometry/sec'));
  math.import(require('./lib/function/trigonometry/sech'));
  math.import(require('./lib/function/trigonometry/sin'));
  math.import(require('./lib/function/trigonometry/sinh'));
  math.import(require('./lib/function/trigonometry/tan'));
  math.import(require('./lib/function/trigonometry/tanh'));

  // functions - units
  math.import(require('./lib/function/units/to'));

  // functions - utils
  math.import(require('./lib/function/utils/clone'));
  math.import(require('./lib/function/utils/config'));
  math.import(require('./lib/function/utils/filter'));
  math.import(require('./lib/function/utils/format'));
  // note: import is already loaded by loader.js
  math.import(require('./lib/function/utils/map'));
  math.import(require('./lib/function/utils/print'));
  math.import(require('./lib/function/utils/sort'));
  math.import(require('./lib/function/utils/typeof'));
  math.import(require('./lib/function/utils/forEach'));

  // attach transform functions (for converting one-based indices to zero-based)
  math.expression.transform = {
    concat: require('./lib/expression/transform/concat.transform')(math, _config),
    filter: require('./lib/expression/transform/filter.transform')(math, _config),
    forEach:require('./lib/expression/transform/forEach.transform')(math, _config),
    index:  require('./lib/expression/transform/index.transform')(math, _config),
    map:    require('./lib/expression/transform/map.transform')(math, _config),
    max:    require('./lib/expression/transform/max.transform')(math, _config),
    mean:   require('./lib/expression/transform/mean.transform')(math, _config),
    min:    require('./lib/expression/transform/min.transform')(math, _config),
    range:  require('./lib/expression/transform/range.transform')(math, _config),
    subset: require('./lib/expression/transform/subset.transform')(math, _config)
  };

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
