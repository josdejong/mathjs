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
exports['null'] = require('./constants/null');
exports.pi = require('./constants/pi');
exports.PI = require('./constants/pi');
exports.phi = require('./constants/phi');
exports.SQRT1_2 = require('./constants/SQRT1_2');
exports.SQRT2 = require('./constants/SQRT2');
exports.tau = require('./constants/tau');
exports['true'] = require('./constants/true');
exports.version = require('./constants/version');

// functions - arithmetic
exports.abs = require('./function/arithmetic/abs');
exports.add = require('./function/arithmetic/add');
exports.ceil = require('./function/arithmetic/ceil');
exports.cube = require('./function/arithmetic/cube');
exports.divide = require('./function/arithmetic/divide');
exports.dotDivide = require('./function/arithmetic/dotDivide');
exports.dotMultiply = require('./function/arithmetic/dotMultiply');
exports.dotPow = require('./function/arithmetic/dotPow');
exports.exp = require('./function/arithmetic/exp');
exports.fix = require('./function/arithmetic/fix');
exports.floor = require('./function/arithmetic/floor');
exports.gcd = require('./function/arithmetic/gcd');
exports.lcm = require('./function/arithmetic/lcm');
exports.log = require('./function/arithmetic/log');
exports.log10 = require('./function/arithmetic/log10');
exports.mod = require('./function/arithmetic/mod');
exports.multiply = require('./function/arithmetic/multiply');
exports.norm = require('./function/arithmetic/norm');
exports.nthRoot = require('./function/arithmetic/nthRoot');
exports.pow = require('./function/arithmetic/pow');
exports.round = require('./function/arithmetic/round');
exports.sign = require('./function/arithmetic/sign');
exports.sqrt = require('./function/arithmetic/sqrt');
exports.square = require('./function/arithmetic/square');
exports.subtract = require('./function/arithmetic/subtract');
exports.unaryMinus = require('./function/arithmetic/unaryMinus');
exports.unaryPlus = require('./function/arithmetic/unaryPlus');
exports.xgcd = require('./function/arithmetic/xgcd');

// functions - bitwise
exports.bitAnd = require('./function/bitwise/bitAnd');
exports.bitNot = require('./function/bitwise/bitNot');
exports.bitOr = require('./function/bitwise/bitOr');
exports.bitXor = require('./function/bitwise/bitXor');
exports.leftShift = require('./function/bitwise/leftShift');
exports.rightArithShift = require('./function/bitwise/rightArithShift');
exports.rightLogShift = require('./function/bitwise/rightLogShift');

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

// functions - expression
exports['eval'] =  require('./function/expression/eval');
exports.help =  require('./function/expression/help');

// functions - logical
exports['and'] = require('./function/logical/and');
exports['not'] = require('./function/logical/not');
exports['or'] = require('./function/logical/or');
exports['xor'] = require('./function/logical/xor');

// functions - matrix
exports['concat'] = require('./function/matrix/concat');
exports.cross = require('./function/matrix/cross');
exports.det = require('./function/matrix/det');
exports.diag = require('./function/matrix/diag');
exports.dot = require('./function/matrix/dot');
exports.eye = require('./function/matrix/eye');
exports.flatten = require('./function/matrix/flatten');
exports.inv = require('./function/matrix/inv');
exports.ones = require('./function/matrix/ones');
exports.range = require('./function/matrix/range');
exports.resize = require('./function/matrix/resize');
exports.size = require('./function/matrix/size');
exports.squeeze = require('./function/matrix/squeeze');
exports.subset = require('./function/matrix/subset');
exports.trace = require('./function/matrix/trace');
exports.transpose = require('./function/matrix/transpose');
exports.zeros = require('./function/matrix/zeros');

// functions - probability
exports.combinations = require('./function/probability/combinations');
//exports.distribution = require('./function/probability/distribution');
exports.factorial = require('./function/probability/factorial');
exports.gamma = require('./function/probability/gamma');
exports.permutations = require('./function/probability/permutations');
exports.pickRandom = require('./function/probability/pickRandom');
exports.random = require('./function/probability/random');
exports.randomInt = require('./function/probability/randomInt');

// functions - relational
exports.compare = require('./function/relational/compare');
exports.deepEqual = require('./function/relational/deepEqual');
exports['equal'] = require('./function/relational/equal');
exports.larger = require('./function/relational/larger');
exports.largerEq = require('./function/relational/largerEq');
exports.smaller = require('./function/relational/smaller');
exports.smallerEq = require('./function/relational/smallerEq');
exports.unequal = require('./function/relational/unequal');

// functions - statistics
exports.max = require('./function/statistics/max');
exports.mean = require('./function/statistics/mean');
exports.median = require('./function/statistics/median');
exports.min = require('./function/statistics/min');
exports.prod = require('./function/statistics/prod');
exports.std = require('./function/statistics/std');
exports.sum = require('./function/statistics/sum');
exports['var'] = require('./function/statistics/var');

// functions - trigonometry
exports.acos = require('./function/trigonometry/acos');
exports.acosh = require('./function/trigonometry/acosh');
exports.acot = require('./function/trigonometry/acot');
exports.acoth = require('./function/trigonometry/acoth');
exports.acsc = require('./function/trigonometry/acsc');
exports.acsch = require('./function/trigonometry/acsch');
exports.asec = require('./function/trigonometry/asec');
exports.asech = require('./function/trigonometry/asech');
exports.asin = require('./function/trigonometry/asin');
exports.asinh = require('./function/trigonometry/asinh');
exports.atan = require('./function/trigonometry/atan');
exports.atanh = require('./function/trigonometry/atanh');
exports.atan2 = require('./function/trigonometry/atan2');
exports.cos = require('./function/trigonometry/cos');
exports.cosh = require('./function/trigonometry/cosh');
exports.cot = require('./function/trigonometry/cot');
exports.coth = require('./function/trigonometry/coth');
exports.csc = require('./function/trigonometry/csc');
exports.csch = require('./function/trigonometry/csch');
exports.sec = require('./function/trigonometry/sec');
exports.sech = require('./function/trigonometry/sech');
exports.sin = require('./function/trigonometry/sin');
exports.sinh = require('./function/trigonometry/sinh');
exports.tan = require('./function/trigonometry/tan');
exports.tanh = require('./function/trigonometry/tanh');

// functions - units
exports.to = require('./function/units/to');

// functions - utils
exports.clone =  require('./function/utils/clone');
exports.map =  require('./function/utils/map');
exports.filter =  require('./function/utils/filter');
exports.forEach =  require('./function/utils/forEach');
exports.format =  require('./function/utils/format');
// exports.print =  require('./function/utils/print'); // TODO: add documentation for print as soon as the parser supports objects.
exports['import'] =  require('./function/utils/import');
exports.sort =  require('./function/utils/sort');
exports['typeof'] =  require('./function/utils/typeof');
