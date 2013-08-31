// options (global configuration settings)
exports.options = require('./lib/options');

// expression (Parser, Scope, nodes, docs)
exports.expression = {};
exports.expression.node = require('./lib/expression/node/index.js');
exports.expression.Scope = require('./lib/expression/Scope.js');
exports.expression.Parser = require('./lib/expression/Parser.js');
exports.expression.docs = require('./lib/expression/docs/index.js');

// TODO: deprecated since version 0.13.0. cleanup deprecated stuff some day
exports.expr = {};
exports.expr.Scope = function () {
  throw new Error('Moved to math.expression.Scope');
};
exports.expr.Parser = function () {
  throw new Error('Moved to math.expression.Parser');
};


// types (Matrix, Complex, Unit, ...)
exports.type = {};
exports.type.Complex = require('./lib/type/Complex.js');
exports.type.Range = require('./lib/type/Range.js');
exports.type.Index = require('./lib/type/Index.js');
exports.type.Matrix = require('./lib/type/Matrix.js');
exports.type.Unit = require('./lib/type/Unit.js');
exports.type.Help = require('./lib/type/Help.js');

exports.collection = require('./lib/type/collection.js');

// expression parser
require('./lib/function/expression/eval.js')(exports);
require('./lib/function/expression/help.js')(exports);
require('./lib/function/expression/parse.js')(exports);

// functions - arithmetic
require('./lib/function/arithmetic/abs.js')(exports);
require('./lib/function/arithmetic/add.js')(exports);
require('./lib/function/arithmetic/add.js')(exports);
require('./lib/function/arithmetic/ceil.js')(exports);
require('./lib/function/arithmetic/cube.js')(exports);
require('./lib/function/arithmetic/divide.js')(exports);
require('./lib/function/arithmetic/edivide.js')(exports);
require('./lib/function/arithmetic/emultiply.js')(exports);
require('./lib/function/arithmetic/epow.js')(exports);
require('./lib/function/arithmetic/equal.js')(exports);
require('./lib/function/arithmetic/exp.js')(exports);
require('./lib/function/arithmetic/fix.js')(exports);
require('./lib/function/arithmetic/floor.js')(exports);
require('./lib/function/arithmetic/gcd.js')(exports);
require('./lib/function/arithmetic/larger.js')(exports);
require('./lib/function/arithmetic/largereq.js')(exports);
require('./lib/function/arithmetic/lcm.js')(exports);
require('./lib/function/arithmetic/log.js')(exports);
require('./lib/function/arithmetic/log10.js')(exports);
require('./lib/function/arithmetic/mod.js')(exports);
require('./lib/function/arithmetic/multiply.js')(exports);
require('./lib/function/arithmetic/pow.js')(exports);
require('./lib/function/arithmetic/round.js')(exports);
require('./lib/function/arithmetic/sign.js')(exports);
require('./lib/function/arithmetic/smaller.js')(exports);
require('./lib/function/arithmetic/smallereq.js')(exports);
require('./lib/function/arithmetic/sqrt.js')(exports);
require('./lib/function/arithmetic/square.js')(exports);
require('./lib/function/arithmetic/subtract.js')(exports);
require('./lib/function/arithmetic/unary.js')(exports);
require('./lib/function/arithmetic/unequal.js')(exports);
require('./lib/function/arithmetic/xgcd.js')(exports);

// functions - complex
require('./lib/function/complex/arg.js')(exports);
require('./lib/function/complex/conj.js')(exports);
require('./lib/function/complex/re.js')(exports);
require('./lib/function/complex/im.js')(exports);

// functions - construction
require('./lib/function/construction/boolean.js')(exports);
require('./lib/function/construction/complex.js')(exports);
require('./lib/function/construction/index.js')(exports);
require('./lib/function/construction/matrix.js')(exports);
require('./lib/function/construction/number.js')(exports);
require('./lib/function/construction/parser.js')(exports);
require('./lib/function/construction/string.js')(exports);
require('./lib/function/construction/unit.js')(exports);

// functions - matrix
require('./lib/function/matrix/concat.js')(exports);
require('./lib/function/matrix/det.js')(exports);
require('./lib/function/matrix/diag.js')(exports);
require('./lib/function/matrix/eye.js')(exports);
require('./lib/function/matrix/inv.js')(exports);
require('./lib/function/matrix/ones.js')(exports);
require('./lib/function/matrix/range.js')(exports);
require('./lib/function/matrix/size.js')(exports);
require('./lib/function/matrix/squeeze.js')(exports);
require('./lib/function/matrix/subset.js')(exports);
require('./lib/function/matrix/transpose.js')(exports);
require('./lib/function/matrix/zeros.js')(exports);

// functions - probability
require('./lib/function/probability/factorial.js')(exports);
require('./lib/function/probability/random.js')(exports);

// functions - statistics
require('./lib/function/statistics/min.js')(exports);
require('./lib/function/statistics/max.js')(exports);

// functions - trigonometry
require('./lib/function/trigonometry/acos.js')(exports);
require('./lib/function/trigonometry/asin.js')(exports);
require('./lib/function/trigonometry/atan.js')(exports);
require('./lib/function/trigonometry/atan2.js')(exports);
require('./lib/function/trigonometry/cos.js')(exports);
require('./lib/function/trigonometry/cot.js')(exports);
require('./lib/function/trigonometry/csc.js')(exports);
require('./lib/function/trigonometry/sec.js')(exports);
require('./lib/function/trigonometry/sin.js')(exports);
require('./lib/function/trigonometry/tan.js')(exports);

// functions - units
require('./lib/function/units/in.js')(exports);

// functions - utils
require('./lib/function/utils/clone.js')(exports);
require('./lib/function/utils/format.js')(exports);
require('./lib/function/utils/import.js')(exports);
require('./lib/function/utils/select.js')(exports);
require('./lib/function/utils/typeof.js')(exports);
require('./lib/function/utils/map.js')(exports);
require('./lib/function/utils/forEach.js')(exports);

// constants
require('./lib/constants.js')(exports);

// selector (we initialize after all functions are loaded)
exports.chaining = {};
exports.chaining.Selector = require('./lib/chaining/Selector.js')(exports);

// TODO: deprecated since version 0.13.0. Cleanup some day
exports.expr.Selector = function () {
  throw new Error('Moved to math.expression.Selector');
};
