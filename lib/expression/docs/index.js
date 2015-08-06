function factory (type, config, load, typed) {
  var docs = {};


  // functions for types
  docs.bignumber = require('./type/bignumber');
  docs['boolean'] = require('./type/boolean');
  docs.complex = require('./type/complex');
  docs.fraction = require('./type/fraction');
  docs.index = require('./type/index');
  docs.matrix = require('./type/matrix');
  docs.number = require('./type/number');
  docs.sparse = require('./type/sparse');
  docs.string = require('./type/string');
  docs.unit = require('./type/unit');

// constants
  docs.e = require('./constants/e');
  docs.E = require('./constants/e');
  docs['false'] = require('./constants/false');
  docs.i = require('./constants/i');
  docs['Infinity'] = require('./constants/Infinity');
  docs.LN2 = require('./constants/LN2');
  docs.LN10 = require('./constants/LN10');
  docs.LOG2E = require('./constants/LOG2E');
  docs.LOG10E = require('./constants/LOG10E');
  docs.NaN = require('./constants/NaN');
  docs['null'] = require('./constants/null');
  docs.pi = require('./constants/pi');
  docs.PI = require('./constants/pi');
  docs.phi = require('./constants/phi');
  docs.SQRT1_2 = require('./constants/SQRT1_2');
  docs.SQRT2 = require('./constants/SQRT2');
  docs.tau = require('./constants/tau');
  docs['true'] = require('./constants/true');
  docs.version = require('./constants/version');

// functions - algebra
  docs.lsolve = require('./function/algebra/lsolve');
  docs.lup = require('./function/algebra/lup');
  docs.lusolve = require('./function/algebra/lusolve');
  docs.slu = require('./function/algebra/slu');
  docs.usolve = require('./function/algebra/usolve');

// functions - arithmetic
  docs.abs = require('./function/arithmetic/abs');
  docs.add = require('./function/arithmetic/add');
  docs.ceil = require('./function/arithmetic/ceil');
  docs.cube = require('./function/arithmetic/cube');
  docs.divide = require('./function/arithmetic/divide');
  docs.dotDivide = require('./function/arithmetic/dotDivide');
  docs.dotMultiply = require('./function/arithmetic/dotMultiply');
  docs.dotPow = require('./function/arithmetic/dotPow');
  docs.exp = require('./function/arithmetic/exp');
  docs.fix = require('./function/arithmetic/fix');
  docs.floor = require('./function/arithmetic/floor');
  docs.gcd = require('./function/arithmetic/gcd');
  docs.lcm = require('./function/arithmetic/lcm');
  docs.log = require('./function/arithmetic/log');
  docs.log10 = require('./function/arithmetic/log10');
  docs.mod = require('./function/arithmetic/mod');
  docs.multiply = require('./function/arithmetic/multiply');
  docs.norm = require('./function/arithmetic/norm');
  docs.nthRoot = require('./function/arithmetic/nthRoot');
  docs.pow = require('./function/arithmetic/pow');
  docs.round = require('./function/arithmetic/round');
  docs.sign = require('./function/arithmetic/sign');
  docs.sqrt = require('./function/arithmetic/sqrt');
  docs.square = require('./function/arithmetic/square');
  docs.subtract = require('./function/arithmetic/subtract');
  docs.unaryMinus = require('./function/arithmetic/unaryMinus');
  docs.unaryPlus = require('./function/arithmetic/unaryPlus');
  docs.xgcd = require('./function/arithmetic/xgcd');

// functions - bitwise
  docs.bitAnd = require('./function/bitwise/bitAnd');
  docs.bitNot = require('./function/bitwise/bitNot');
  docs.bitOr = require('./function/bitwise/bitOr');
  docs.bitXor = require('./function/bitwise/bitXor');
  docs.leftShift = require('./function/bitwise/leftShift');
  docs.rightArithShift = require('./function/bitwise/rightArithShift');
  docs.rightLogShift = require('./function/bitwise/rightLogShift');

// functions - combinatorics
  docs.bellNumbers = require('./function/combinatorics/bellNumbers');
  docs.composition = require('./function/combinatorics/composition');
  docs.stirlingS2 = require('./function/combinatorics/stirlingS2');

// functions - complex
  docs.arg = require('./function/complex/arg');
  docs.conj = require('./function/complex/conj');
  docs.re = require('./function/complex/re');
  docs.im = require('./function/complex/im');

// functions - expression
  docs['eval'] =  require('./function/expression/eval');
  docs.help =  require('./function/expression/help');

// functions - geometry
  docs.intersect = require('./function/geometry/intersect');

// functions - logical
  docs['and'] = require('./function/logical/and');
  docs['not'] = require('./function/logical/not');
  docs['or'] = require('./function/logical/or');
  docs['xor'] = require('./function/logical/xor');

// functions - matrix
  docs['concat'] = require('./function/matrix/concat');
  docs.cross = require('./function/matrix/cross');
  docs.det = require('./function/matrix/det');
  docs.diag = require('./function/matrix/diag');
  docs.dot = require('./function/matrix/dot');
  docs.eye = require('./function/matrix/eye');
  docs.flatten = require('./function/matrix/flatten');
  docs.inv = require('./function/matrix/inv');
  docs.ones = require('./function/matrix/ones');
  docs.range = require('./function/matrix/range');
  docs.resize = require('./function/matrix/resize');
  docs.size = require('./function/matrix/size');
  docs.squeeze = require('./function/matrix/squeeze');
  docs.subset = require('./function/matrix/subset');
  docs.trace = require('./function/matrix/trace');
  docs.transpose = require('./function/matrix/transpose');
  docs.zeros = require('./function/matrix/zeros');

// functions - probability
  docs.combinations = require('./function/probability/combinations');
//docs.distribution = require('./function/probability/distribution');
  docs.factorial = require('./function/probability/factorial');
  docs.gamma = require('./function/probability/gamma');
  docs.multinomial = require('./function/probability/multinomial');
  docs.permutations = require('./function/probability/permutations');
  docs.pickRandom = require('./function/probability/pickRandom');
  docs.random = require('./function/probability/random');
  docs.randomInt = require('./function/probability/randomInt');

// functions - relational
  docs.compare = require('./function/relational/compare');
  docs.deepEqual = require('./function/relational/deepEqual');
  docs['equal'] = require('./function/relational/equal');
  docs.larger = require('./function/relational/larger');
  docs.largerEq = require('./function/relational/largerEq');
  docs.smaller = require('./function/relational/smaller');
  docs.smallerEq = require('./function/relational/smallerEq');
  docs.unequal = require('./function/relational/unequal');

// functions - statistics
  docs.max = require('./function/statistics/max');
  docs.mean = require('./function/statistics/mean');
  docs.median = require('./function/statistics/median');
  docs.min = require('./function/statistics/min');
  docs.prod = require('./function/statistics/prod');
  docs.quantileSeq = require('./function/statistics/quantileSeq');
  docs.std = require('./function/statistics/std');
  docs.sum = require('./function/statistics/sum');
  docs['var'] = require('./function/statistics/var');

// functions - trigonometry
  docs.acos = require('./function/trigonometry/acos');
  docs.acosh = require('./function/trigonometry/acosh');
  docs.acot = require('./function/trigonometry/acot');
  docs.acoth = require('./function/trigonometry/acoth');
  docs.acsc = require('./function/trigonometry/acsc');
  docs.acsch = require('./function/trigonometry/acsch');
  docs.asec = require('./function/trigonometry/asec');
  docs.asech = require('./function/trigonometry/asech');
  docs.asin = require('./function/trigonometry/asin');
  docs.asinh = require('./function/trigonometry/asinh');
  docs.atan = require('./function/trigonometry/atan');
  docs.atanh = require('./function/trigonometry/atanh');
  docs.atan2 = require('./function/trigonometry/atan2');
  docs.cos = require('./function/trigonometry/cos');
  docs.cosh = require('./function/trigonometry/cosh');
  docs.cot = require('./function/trigonometry/cot');
  docs.coth = require('./function/trigonometry/coth');
  docs.csc = require('./function/trigonometry/csc');
  docs.csch = require('./function/trigonometry/csch');
  docs.sec = require('./function/trigonometry/sec');
  docs.sech = require('./function/trigonometry/sech');
  docs.sin = require('./function/trigonometry/sin');
  docs.sinh = require('./function/trigonometry/sinh');
  docs.tan = require('./function/trigonometry/tan');
  docs.tanh = require('./function/trigonometry/tanh');

// functions - units
  docs.to = require('./function/units/to');

// functions - utils
  docs.clone =  require('./function/utils/clone');
  docs.map =  require('./function/utils/map');
  docs.partitionSelect =  require('./function/utils/partitionSelect');
  docs.filter =  require('./function/utils/filter');
  docs.forEach =  require('./function/utils/forEach');
  docs.format =  require('./function/utils/format');
  docs.isInteger =  require('./function/utils/isInteger');
  docs.isNegative =  require('./function/utils/isNegative');
  docs.isNumeric =  require('./function/utils/isNumeric');
  docs.isPositive =  require('./function/utils/isPositive');
  docs.isZero =  require('./function/utils/isZero');
// docs.print =  require('./function/utils/print'); // TODO: add documentation for print as soon as the parser supports objects.
  docs['import'] =  require('./function/utils/import');
  docs.sort =  require('./function/utils/sort');
  docs['typeof'] =  require('./function/utils/typeof');
  
  return docs;
}

exports.name = 'docs';
exports.path = 'expression';
exports.factory = factory;
