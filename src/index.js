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
require('./function/arithmetic/abs.js');
require('./function/arithmetic/add.js');
require('./function/arithmetic/add.js');
require('./function/arithmetic/ceil.js');
require('./function/arithmetic/cube.js');
require('./function/arithmetic/divide.js');
require('./function/arithmetic/edivide.js');
require('./function/arithmetic/emultiply.js');
require('./function/arithmetic/epow.js');
require('./function/arithmetic/equal.js');
require('./function/arithmetic/exp.js');
require('./function/arithmetic/fix.js');
require('./function/arithmetic/floor.js');
require('./function/arithmetic/gcd.js');
require('./function/arithmetic/larger.js');
require('./function/arithmetic/largereq.js');
require('./function/arithmetic/lcm.js');
require('./function/arithmetic/log.js');
require('./function/arithmetic/log10.js');
require('./function/arithmetic/mod.js');
require('./function/arithmetic/multiply.js');
require('./function/arithmetic/pow.js');
require('./function/arithmetic/round.js');
require('./function/arithmetic/sign.js');
require('./function/arithmetic/smaller.js');
require('./function/arithmetic/smallereq.js');
require('./function/arithmetic/sqrt.js');
require('./function/arithmetic/square.js');
require('./function/arithmetic/subtract.js');
require('./function/arithmetic/unary.js');
require('./function/arithmetic/unequal.js');
require('./function/arithmetic/xgcd.js');

// functions - complex
require('./function/complex/arg.js');
require('./function/complex/conj.js');
require('./function/complex/re.js');
require('./function/complex/im.js');

// functions - construction
require('./function/construction/boolean.js');
require('./function/construction/complex.js');
require('./function/construction/matrix.js');
require('./function/construction/number.js');
require('./function/construction/parser.js');
require('./function/construction/range.js');
require('./function/construction/string.js');
require('./function/construction/unit.js');

// functions - matrix
require('./function/matrix/concat.js');
require('./function/matrix/det.js');
require('./function/matrix/diag.js');
require('./function/matrix/eye.js');
require('./function/matrix/inv.js');
require('./function/matrix/ones.js');
require('./function/matrix/size.js');
require('./function/matrix/squeeze.js');
require('./function/matrix/subset.js');
require('./function/matrix/transpose.js');
require('./function/matrix/zeros.js');

// functions - probability
require('./function/probability/factorial.js');
require('./function/probability/random.js');

// functions - statistics
require('./function/statistics/min.js');
require('./function/statistics/max.js');

// functions - trigonometry
require('./function/trigonometry/acos.js');
require('./function/trigonometry/asin.js');
require('./function/trigonometry/atan.js');
require('./function/trigonometry/atan2.js');
require('./function/trigonometry/cos.js');
require('./function/trigonometry/cot.js');
require('./function/trigonometry/csc.js');
require('./function/trigonometry/sec.js');
require('./function/trigonometry/sin.js');
require('./function/trigonometry/tan.js');

// functions - units
require('./function/units/in.js');

// functions - utils
require('./function/utils/clone.js');
require('./function/utils/eval.js');
require('./function/utils/format.js');
require('./function/utils/help.js');
require('./function/utils/import.js');
require('./function/utils/parse.js');
require('./function/utils/select.js');
require('./function/utils/typeof.js');

// constants
require('./constants.js');

// initialize Selector
require('./type/Selector.js').init();
