// constants
exports.e = require('./constants/e.js');
exports.E = require('./constants/e.js');
exports['false'] = require('./constants/false.js');
exports.i = require('./constants/i.js');
exports['Infinity'] = require('./constants/Infinity.js');
exports.LN2 = require('./constants/LN2.js');
exports.LN10 = require('./constants/LN10.js');
exports.LOG2E = require('./constants/LOG2E.js');
exports.LOG10E = require('./constants/LOG10E.js');
exports.NaN = require('./constants/NaN.js');
exports.pi = require('./constants/pi.js');
exports.PI = require('./constants/pi.js');
exports.SQRT1_2 = require('./constants/SQRT1_2.js');
exports.SQRT2 = require('./constants/SQRT2.js');
exports.tau = require('./constants/tau.js');
exports['true'] = require('./constants/true.js');

// functions - arithmetic
exports.abs = require('./function/arithmetic/abs.js');
exports.add = require('./function/arithmetic/add.js');
exports.ceil = require('./function/arithmetic/ceil.js');
exports.cube = require('./function/arithmetic/cube.js');
exports.divide = require('./function/arithmetic/divide.js');
exports.edivide = require('./function/arithmetic/edivide.js');
exports.emultiply = require('./function/arithmetic/emultiply.js');
exports.epow = require('./function/arithmetic/epow.js');
exports.equal = require('./function/arithmetic/equal.js');
exports.exp = require('./function/arithmetic/exp.js');
exports.fix = require('./function/arithmetic/fix.js');
exports.floor = require('./function/arithmetic/floor.js');
exports.gcd = require('./function/arithmetic/gcd.js');
exports.larger = require('./function/arithmetic/larger.js');
exports.largereq = require('./function/arithmetic/largereq.js');
exports.lcm = require('./function/arithmetic/lcm.js');
exports.log = require('./function/arithmetic/log.js');
exports.log10 = require('./function/arithmetic/log10.js');
exports.mod = require('./function/arithmetic/mod.js');
exports.multiply = require('./function/arithmetic/multiply.js');
exports.pow = require('./function/arithmetic/pow.js');
exports.round = require('./function/arithmetic/round.js');
exports.sign = require('./function/arithmetic/sign.js');
exports.smaller = require('./function/arithmetic/smaller.js');
exports.smallereq = require('./function/arithmetic/smallereq.js');
exports.sqrt = require('./function/arithmetic/sqrt.js');
exports.square = require('./function/arithmetic/square.js');
exports.subtract = require('./function/arithmetic/subtract.js');
exports.unary = require('./function/arithmetic/unary.js');
exports.unequal = require('./function/arithmetic/unequal.js');
exports.xgcd = require('./function/arithmetic/xgcd.js');

// functions - complex
exports.arg = require('./function/complex/arg.js');
exports.conj = require('./function/complex/conj.js');
exports.re = require('./function/complex/re.js');
exports.im = require('./function/complex/im.js');

// functions - construction
exports.boolean = require('./function/construction/boolean.js');
exports.complex = require('./function/construction/complex.js');
exports.index = require('./function/construction/index.js');
exports.matrix = require('./function/construction/matrix.js');
exports.number = require('./function/construction/number.js');
exports.string = require('./function/construction/string.js');
exports.unit = require('./function/construction/unit.js');

// functions - epxression
exports['eval'] =  require('./function/expression/eval.js');
exports.help =  require('./function/expression/help.js');

// functions - matrix
exports.concat = require('./function/matrix/concat.js');
exports.det = require('./function/matrix/det.js');
exports.diag = require('./function/matrix/diag.js');
exports.eye = require('./function/matrix/eye.js');
exports.inv = require('./function/matrix/inv.js');
exports.ones = require('./function/matrix/ones.js');
exports.range = require('./function/matrix/range.js');
exports.size = require('./function/matrix/size.js');
exports.squeeze = require('./function/matrix/squeeze.js');
exports.subset = require('./function/matrix/subset.js');
exports.transpose = require('./function/matrix/transpose.js');
exports.zeros = require('./function/matrix/zeros.js');

// functions - probability
exports.factorial = require('./function/probability/factorial.js');
exports.distribution = require('./function/probability/distribution.js');
exports.pickRandom = require('./function/probability/pickRandom.js');
exports.random = require('./function/probability/random.js');
exports.randomInt = require('./function/probability/randomInt.js');

// functions - statistics
exports.min = require('./function/statistics/min.js');
exports.max = require('./function/statistics/max.js');

// functions - trigonometry
exports.acos = require('./function/trigonometry/acos.js');
exports.asin = require('./function/trigonometry/asin.js');
exports.atan = require('./function/trigonometry/atan.js');
exports.atan2 = require('./function/trigonometry/atan2.js');
exports.cos = require('./function/trigonometry/cos.js');
exports.cot = require('./function/trigonometry/cot.js');
exports.csc = require('./function/trigonometry/csc.js');
exports.sec = require('./function/trigonometry/sec.js');
exports.sin = require('./function/trigonometry/sin.js');
exports.tan = require('./function/trigonometry/tan.js');

// functions - units
exports['in'] = require('./function/units/in.js');

// functions - utils
exports.clone =  require('./function/utils/clone.js');
exports.map =  require('./function/utils/map.js');
exports.forEach =  require('./function/utils/forEach.js');
exports.format =  require('./function/utils/format.js');
exports['import'] =  require('./function/utils/import.js');
exports['typeof'] =  require('./function/utils/typeof.js');
