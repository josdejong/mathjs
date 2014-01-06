// constants
exports.e = require('./constants/e');
exports.E = require('./constants/e');
exports['false'] = require('./constants/false');
exports.i = require('./constants/i');
exports['Infinity'] = require('./constants/Infinity');
exports.LN2 = require('./constants/LN2');
exports.LN10 = require('./constants/LN10');
exports.LOG2E = require('./constants/LOG2E');
exports.LOG10E = require('./constants/LOG10E');
exports.NaN = require('./constants/NaN');
exports.pi = require('./constants/pi');
exports.PI = require('./constants/pi');
exports.SQRT1_2 = require('./constants/SQRT1_2');
exports.SQRT2 = require('./constants/SQRT2');
exports.tau = require('./constants/tau');
exports['true'] = require('./constants/true');

// functions - arithmetic
exports.abs = require('./function/arithmetic/abs');
exports.add = require('./function/arithmetic/add');
exports.ceil = require('./function/arithmetic/ceil');
exports.cube = require('./function/arithmetic/cube');
exports.divide = require('./function/arithmetic/divide');
exports.edivide = require('./function/arithmetic/edivide');
exports.emultiply = require('./function/arithmetic/emultiply');
exports.epow = require('./function/arithmetic/epow');
exports.equal = require('./function/arithmetic/equal');
exports.exp = require('./function/arithmetic/exp');
exports.fix = require('./function/arithmetic/fix');
exports.floor = require('./function/arithmetic/floor');
exports.gcd = require('./function/arithmetic/gcd');
exports.larger = require('./function/arithmetic/larger');
exports.largereq = require('./function/arithmetic/largereq');
exports.lcm = require('./function/arithmetic/lcm');
exports.log = require('./function/arithmetic/log');
exports.log10 = require('./function/arithmetic/log10');
exports.mod = require('./function/arithmetic/mod');
exports.multiply = require('./function/arithmetic/multiply');
exports.pow = require('./function/arithmetic/pow');
exports.round = require('./function/arithmetic/round');
exports.sign = require('./function/arithmetic/sign');
exports.smaller = require('./function/arithmetic/smaller');
exports.smallereq = require('./function/arithmetic/smallereq');
exports.sqrt = require('./function/arithmetic/sqrt');
exports.square = require('./function/arithmetic/square');
exports.subtract = require('./function/arithmetic/subtract');
exports.unary = require('./function/arithmetic/unary');
exports.unequal = require('./function/arithmetic/unequal');
exports.xgcd = require('./function/arithmetic/xgcd');

// functions - complex
exports.arg = require('./function/complex/arg');
exports.conj = require('./function/complex/conj');
exports.re = require('./function/complex/re');
exports.im = require('./function/complex/im');

// functions - construction
exports.bignumber = require('./function/construction/bignumber');
exports['boolean'] = require('./function/construction/boolean');
exports.complex = require('./function/construction/complex');
exports.index = require('./function/construction/index');
exports.matrix = require('./function/construction/matrix');
exports.number = require('./function/construction/number');
exports.string = require('./function/construction/string');
exports.unit = require('./function/construction/unit');

// functions - epxression
exports['eval'] =  require('./function/expression/eval');
exports.help =  require('./function/expression/help');

// functions - matrix
exports.concat = require('./function/matrix/concat');
exports.det = require('./function/matrix/det');
exports.diag = require('./function/matrix/diag');
exports.eye = require('./function/matrix/eye');
exports.inv = require('./function/matrix/inv');
exports.ones = require('./function/matrix/ones');
exports.range = require('./function/matrix/range');
exports.resize = require('./function/matrix/resize');
exports.size = require('./function/matrix/size');
exports.squeeze = require('./function/matrix/squeeze');
exports.subset = require('./function/matrix/subset');
exports.transpose = require('./function/matrix/transpose');
exports.zeros = require('./function/matrix/zeros');

// functions - probability
exports.combinations = require('./function/probability/combinations');
exports.distribution = require('./function/probability/distribution');
exports.factorial = require('./function/probability/factorial');
exports.permutations = require('./function/probability/permutations');
exports.pickRandom = require('./function/probability/pickRandom');
exports.random = require('./function/probability/random');
exports.randomInt = require('./function/probability/randomInt');

// functions - statistics
exports.min = require('./function/statistics/min');
exports.mean = require('./function/statistics/mean');
exports.max = require('./function/statistics/max');

// functions - trigonometry
exports.acos = require('./function/trigonometry/acos');
exports.asin = require('./function/trigonometry/asin');
exports.atan = require('./function/trigonometry/atan');
exports.atan2 = require('./function/trigonometry/atan2');
exports.cos = require('./function/trigonometry/cos');
exports.cot = require('./function/trigonometry/cot');
exports.csc = require('./function/trigonometry/csc');
exports.sec = require('./function/trigonometry/sec');
exports.sin = require('./function/trigonometry/sin');
exports.tan = require('./function/trigonometry/tan');

// functions - units
exports.to = require('./function/units/to');

// functions - utils
exports.clone =  require('./function/utils/clone');
exports.map =  require('./function/utils/map');
exports.forEach =  require('./function/utils/forEach');
exports.format =  require('./function/utils/format');
// exports.print =  require('./function/utils/print'); // TODO: add documentation for print as soon as the parser supports objects.
exports['import'] =  require('./function/utils/import');
exports['typeof'] =  require('./function/utils/typeof');
