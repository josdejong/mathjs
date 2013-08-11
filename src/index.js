// options (global configuration settings)
exports.options = require('./options');

// expression (Parser, Scope, Nodes)
exports.expr = {};
exports.expr.node = require('./expr/node/index.js');
exports.expr.Scope = require('./expr/Scope.js');
exports.expr.Parser = require('./expr/Parser.js');

// types (Matrix, Complex, Unit, ...)
exports.type = require('./type/index.js');

// docs
exports.docs = require('./docs/index.js');

// functions - arithmetic
require('./function/arithmetic/abs.js')(exports);
require('./function/arithmetic/add.js')(exports);
require('./function/arithmetic/add.js')(exports);
require('./function/arithmetic/ceil.js')(exports);
require('./function/arithmetic/cube.js')(exports);
require('./function/arithmetic/divide.js')(exports);
require('./function/arithmetic/edivide.js')(exports);
require('./function/arithmetic/emultiply.js')(exports);
require('./function/arithmetic/epow.js')(exports);
require('./function/arithmetic/equal.js')(exports);
require('./function/arithmetic/exp.js')(exports);
require('./function/arithmetic/fix.js')(exports);
require('./function/arithmetic/floor.js')(exports);
require('./function/arithmetic/gcd.js')(exports);
require('./function/arithmetic/larger.js')(exports);
require('./function/arithmetic/largereq.js')(exports);
require('./function/arithmetic/lcm.js')(exports);
require('./function/arithmetic/log.js')(exports);
require('./function/arithmetic/log10.js')(exports);
require('./function/arithmetic/mod.js')(exports);
require('./function/arithmetic/multiply.js')(exports);
require('./function/arithmetic/pow.js')(exports);
require('./function/arithmetic/round.js')(exports);
require('./function/arithmetic/sign.js')(exports);
require('./function/arithmetic/smaller.js')(exports);
require('./function/arithmetic/smallereq.js')(exports);
require('./function/arithmetic/sqrt.js')(exports);
require('./function/arithmetic/square.js')(exports);
require('./function/arithmetic/subtract.js')(exports);
require('./function/arithmetic/unary.js')(exports);
require('./function/arithmetic/unequal.js')(exports);
require('./function/arithmetic/xgcd.js')(exports);

// functions - complex
require('./function/complex/arg.js')(exports);
require('./function/complex/conj.js')(exports);
require('./function/complex/re.js')(exports);
require('./function/complex/im.js')(exports);

// functions - construction
require('./function/construction/boolean.js')(exports);
require('./function/construction/complex.js')(exports);
require('./function/construction/matrix.js')(exports);
require('./function/construction/number.js')(exports);
require('./function/construction/parser.js')(exports);
require('./function/construction/range.js')(exports);
require('./function/construction/string.js')(exports);
require('./function/construction/unit.js')(exports);

// functions - matrix
require('./function/matrix/concat.js')(exports);
require('./function/matrix/det.js')(exports);
require('./function/matrix/diag.js')(exports);
require('./function/matrix/eye.js')(exports);
require('./function/matrix/inv.js')(exports);
require('./function/matrix/ones.js')(exports);
require('./function/matrix/size.js')(exports);
require('./function/matrix/squeeze.js')(exports);
require('./function/matrix/subset.js')(exports);
require('./function/matrix/transpose.js')(exports);
require('./function/matrix/zeros.js')(exports);

// functions - probability
require('./function/probability/factorial.js')(exports);
require('./function/probability/random.js')(exports);

// functions - statistics
require('./function/statistics/min.js')(exports);
require('./function/statistics/max.js')(exports);

// functions - trigonometry
require('./function/trigonometry/acos.js')(exports);
require('./function/trigonometry/asin.js')(exports);
require('./function/trigonometry/atan.js')(exports);
require('./function/trigonometry/atan2.js')(exports);
require('./function/trigonometry/cos.js')(exports);
require('./function/trigonometry/cot.js')(exports);
require('./function/trigonometry/csc.js')(exports);
require('./function/trigonometry/sec.js')(exports);
require('./function/trigonometry/sin.js')(exports);
require('./function/trigonometry/tan.js')(exports);

// functions - units
require('./function/units/in.js')(exports);

// functions - utils
require('./function/utils/clone.js')(exports);
require('./function/utils/eval.js')(exports);
require('./function/utils/format.js')(exports);
require('./function/utils/help.js')(exports);
require('./function/utils/import.js')(exports);
require('./function/utils/parse.js')(exports);
require('./function/utils/select.js')(exports);
require('./function/utils/typeof.js')(exports);

// constants
require('./constants.js')(exports);

// selector (we initialize after all functions are loaded)
exports.expr.Selector = require('./expr/Selector.js')(exports);
