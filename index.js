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

  math.collection = require('./lib/type/collection');

  // expression (parse, Parser, nodes, docs)
  math.expression = {};
  math.expression.node = require('./lib/expression/node/index');
  math.expression.parse = require('./lib/expression/parse');
  math.expression.Parser = require('./lib/expression/Parser');
  math.expression.docs = require('./lib/expression/docs/index');

  // serialization utilities
  math.json = {
    reviver: require('./lib/json/reviver')
  };

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
  require('./lib/function/arithmetic/norm')(math, _config);
  require('./lib/function/arithmetic/nthRoot')(math, _config);
  math.import(require('./lib/function/arithmetic/pow'));
  require('./lib/function/arithmetic/round')(math, _config);
  math.import(require('./lib/function/arithmetic/sign'));
  math.import(require('./lib/function/arithmetic/sqrt'));
  math.import(require('./lib/function/arithmetic/square'));
  math.import(require('./lib/function/arithmetic/subtract'));
  math.import(require('./lib/function/arithmetic/unaryMinus'));
  math.import(require('./lib/function/arithmetic/unaryPlus'));
  math.import(require('./lib/function/arithmetic/xgcd'));

  // functions - bitwise
  math.import(require('./lib/function/bitwise/bitAnd'));
  require('./lib/function/bitwise/bitNot')(math, _config);
  require('./lib/function/bitwise/bitOr')(math, _config);
  require('./lib/function/bitwise/bitXor')(math, _config);
  require('./lib/function/bitwise/leftShift')(math, _config);
  require('./lib/function/bitwise/rightArithShift')(math, _config);
  require('./lib/function/bitwise/rightLogShift')(math, _config);

  // functions - complex
  math.import(require('./lib/function/complex/arg'));
  math.import(require('./lib/function/complex/conj'));
  math.import(require('./lib/function/complex/re'));
  math.import(require('./lib/function/complex/im'));

  //// functions - construction
  require('./lib/function/construction/bignumber')(math, _config);
  require('./lib/function/construction/boolean')(math, _config);
  require('./lib/function/construction/complex')(math, _config);
  require('./lib/function/construction/index')(math, _config);
  require('./lib/function/construction/matrix')(math, _config);
  require('./lib/function/construction/number')(math, _config);
  require('./lib/function/construction/parser')(math, _config);
  require('./lib/function/construction/chain')(math, _config);
  require('./lib/function/construction/string')(math, _config);
  require('./lib/function/construction/unit')(math, _config);

  // expression parser
  math.import(require('./lib/function/expression/compile'));
  require('./lib/function/expression/eval')(math, _config);
  require('./lib/function/expression/help')(math, _config);
  require('./lib/function/expression/parse')(math, _config);

  // functions - logical
  require('./lib/function/logical/and')(math, _config);
  require('./lib/function/logical/not')(math, _config);
  require('./lib/function/logical/or')(math, _config);
  require('./lib/function/logical/xor')(math, _config);

  // functions - matrix
  require('./lib/function/matrix/concat')(math, _config);
  require('./lib/function/matrix/cross')(math, _config);
  math.import(require('./lib/function/matrix/det'));
  require('./lib/function/matrix/diag')(math, _config);
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
  require('./lib/function/matrix/transpose')(math, _config);
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
  require('./lib/function/trigonometry/acot')(math, _config);
  math.import(require('./lib/function/trigonometry/acoth'));
  require('./lib/function/trigonometry/acsc')(math, _config);
  math.import(require('./lib/function/trigonometry/acsch'));
  require('./lib/function/trigonometry/asec')(math, _config);
  math.import(require('./lib/function/trigonometry/asech'));
  math.import(require('./lib/function/trigonometry/asin'));
  math.import(require('./lib/function/trigonometry/asinh'));
  require('./lib/function/trigonometry/atan')(math, _config);
  require('./lib/function/trigonometry/atan2')(math, _config);
  math.import(require('./lib/function/trigonometry/atanh'));
  math.import(require('./lib/function/trigonometry/cos'));
  math.import(require('./lib/function/trigonometry/cosh'));
  require('./lib/function/trigonometry/cot')(math, _config);
  math.import(require('./lib/function/trigonometry/coth'));
  require('./lib/function/trigonometry/csc')(math, _config);
  math.import(require('./lib/function/trigonometry/csch'));
  require('./lib/function/trigonometry/sec')(math, _config);
  math.import(require('./lib/function/trigonometry/sech'));
  require('./lib/function/trigonometry/sin')(math, _config);
  math.import(require('./lib/function/trigonometry/sinh'));
  require('./lib/function/trigonometry/tan')(math, _config);
  math.import(require('./lib/function/trigonometry/tanh'));

  // functions - units
  math.import(require('./lib/function/units/to'));

  // functions - utils
  require('./lib/function/utils/clone')(math, _config);
  require('./lib/function/utils/filter')(math, _config);
  require('./lib/function/utils/format')(math, _config);
  //require('./lib/function/utils/import')(math, _config); // TODO: merge with the new import
  require('./lib/function/utils/map')(math, _config);
  require('./lib/function/utils/print')(math, _config);
  require('./lib/function/utils/sort')(math, _config);
  require('./lib/function/utils/typeof')(math, _config);
  require('./lib/function/utils/forEach')(math, _config);

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
  math.chaining = {
    Chain: require('./lib/chaining/Chain')()
  };
  math.chaining.Chain.createProxy(math);

  // apply custom options
  math.config(config);

  return math;
}

// return a new instance of math.js
module.exports = create();
