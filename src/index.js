// main namespace
var math = module.exports = require('./math.js');

// options
math.options = require('./options');

// expression
math.expr = require('./expr/index.js');

// types
math.type = require('./type/index.js');

// docs
math.docs = require('./docs/index.js');

// functions - arithmetic
require('./function/arithmetic/abs.js')(math);
require('./function/arithmetic/add.js')(math);
require('./function/arithmetic/add.js')(math);
require('./function/arithmetic/ceil.js')(math);
require('./function/arithmetic/cube.js')(math);
require('./function/arithmetic/divide.js')(math);
require('./function/arithmetic/edivide.js')(math);
require('./function/arithmetic/emultiply.js')(math);
require('./function/arithmetic/epow.js')(math);
require('./function/arithmetic/equal.js')(math);
require('./function/arithmetic/exp.js')(math);
require('./function/arithmetic/fix.js')(math);
require('./function/arithmetic/floor.js')(math);
require('./function/arithmetic/gcd.js')(math);
require('./function/arithmetic/larger.js')(math);
require('./function/arithmetic/largereq.js')(math);
require('./function/arithmetic/lcm.js')(math);
require('./function/arithmetic/log.js')(math);
require('./function/arithmetic/log10.js')(math);
require('./function/arithmetic/mod.js')(math);
require('./function/arithmetic/multiply.js')(math);
require('./function/arithmetic/pow.js')(math);
require('./function/arithmetic/round.js')(math);
require('./function/arithmetic/sign.js')(math);
require('./function/arithmetic/smaller.js')(math);
require('./function/arithmetic/smallereq.js')(math);
require('./function/arithmetic/sqrt.js')(math);
require('./function/arithmetic/square.js')(math);
require('./function/arithmetic/subtract.js')(math);
require('./function/arithmetic/unary.js')(math);
require('./function/arithmetic/unequal.js')(math);
require('./function/arithmetic/xgcd.js')(math);

// functions - complex
require('./function/complex/arg.js')(math);
require('./function/complex/conj.js')(math);
require('./function/complex/re.js')(math);
require('./function/complex/im.js')(math);

// functions - construction
require('./function/construction/boolean.js')(math);
require('./function/construction/complex.js')(math);
require('./function/construction/matrix.js')(math);
require('./function/construction/number.js')(math);
require('./function/construction/parser.js')(math);
require('./function/construction/range.js')(math);
require('./function/construction/string.js')(math);
require('./function/construction/unit.js')(math);

// functions - matrix
require('./function/matrix/concat.js')(math);
require('./function/matrix/det.js')(math);
require('./function/matrix/diag.js')(math);
require('./function/matrix/eye.js')(math);
require('./function/matrix/inv.js')(math);
require('./function/matrix/ones.js')(math);
require('./function/matrix/size.js')(math);
require('./function/matrix/squeeze.js')(math);
require('./function/matrix/subset.js')(math);
require('./function/matrix/transpose.js')(math);
require('./function/matrix/zeros.js')(math);

// functions - probability
require('./function/probability/factorial.js')(math);
require('./function/probability/random.js')(math);

// functions - statistics
require('./function/statistics/min.js')(math);
require('./function/statistics/max.js')(math);

// functions - trigonometry
require('./function/trigonometry/acos.js')(math);
require('./function/trigonometry/asin.js')(math);
require('./function/trigonometry/atan.js')(math);
require('./function/trigonometry/atan2.js')(math);
require('./function/trigonometry/cos.js')(math);
require('./function/trigonometry/cot.js')(math);
require('./function/trigonometry/csc.js')(math);
require('./function/trigonometry/sec.js')(math);
require('./function/trigonometry/sin.js')(math);
require('./function/trigonometry/tan.js')(math);

// functions - units
require('./function/units/in.js')(math);

// functions - utils
require('./function/utils/clone.js')(math);
require('./function/utils/eval.js')(math);
require('./function/utils/format.js')(math);
require('./function/utils/help.js')(math);
require('./function/utils/import.js')(math);
require('./function/utils/parse.js')(math);
require('./function/utils/select.js')(math);
require('./function/utils/typeof.js')(math);

// constants
require('./constants.js')(math);

// initialize Selector
require('./type/Selector.js').init();
