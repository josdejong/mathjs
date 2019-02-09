// TODO: auto generate this file

import { DEFAULT_CONFIG } from './core/config'
import { embeddedDocs } from './expression/embeddedDocs/embeddedDocs'
import { createResultSet } from './type/resultset/ResultSet'
import { createBigNumberClass } from './type/bignumber/BigNumber'
import { createComplexClass } from './type/complex/Complex'
import { createFractionClass } from './type/fraction/Fraction'
import { createRangeClass } from './type/matrix/Range'
import { createMatrixClass } from './type/matrix/Matrix'
import { createDenseMatrixClass } from './type/matrix/DenseMatrix'
import { createTyped } from './core/function/typed'
import { createClone } from './function/utils/clone'
import { createIsInteger } from './function/utils/isInteger'
import { createIsNegative } from './function/utils/isNegative'
import { createIsNumeric } from './function/utils/isNumeric'
import { createHasNumericValue } from './function/utils/hasNumericValue'
import { createIsPositive } from './function/utils/isPositive'
import { createIsZero } from './function/utils/isZero'
import { createIsNaN } from './function/utils/isNaN'
import { createTypeOf } from './function/utils/typeOf'
import { createEqualScalar } from './function/relational/equalScalar'
import { createSparseMatrixClass } from './type/matrix/SparseMatrix'
import { createNumber } from './type/number'
import { createString } from './type/string'
import { createBoolean } from './type/boolean'
import { createBignumber } from './type/bignumber/function/bignumber'
import { createComplex } from './type/complex/function/complex'
import { createFraction } from './type/fraction/function/fraction'
import { createMatrix } from './type/matrix/function/matrix'
import { createSplitUnit } from './type/unit/function/splitUnit'
import { createUnaryMinus } from './function/arithmetic/unaryMinus'
import { createUnaryPlus } from './function/arithmetic/unaryPlus'
import { createAbs } from './function/arithmetic/abs'
import { createAddScalar } from './function/arithmetic/addScalar'
import { createCbrt } from './function/arithmetic/cbrt'
import { createCeil } from './function/arithmetic/ceil'
import { createCube } from './function/arithmetic/cube'
import { createExp } from './function/arithmetic/exp'
import { createExpm1 } from './function/arithmetic/expm1'
import { createFix } from './function/arithmetic/fix'
import { createFloor } from './function/arithmetic/floor'
import { createGcd } from './function/arithmetic/gcd'
import { createLcm } from './function/arithmetic/lcm'
import { createLog10 } from './function/arithmetic/log10'
import { createLog2 } from './function/arithmetic/log2'
import { createMod } from './function/arithmetic/mod'
import { createMultiplyScalar } from './function/arithmetic/multiplyScalar'
import { createMultiply } from './function/arithmetic/multiply'
import { createNthRoot } from './function/arithmetic/nthRoot'
import { createSign } from './function/arithmetic/sign'
import { createSqrt } from './function/arithmetic/sqrt'
import { createSquare } from './function/arithmetic/square'
import { createSubtract } from './function/arithmetic/subtract'
import { createXgcd } from './function/arithmetic/xgcd'
import { createDotMultiply } from './function/arithmetic/dotMultiply'
import { createBitAnd } from './function/bitwise/bitAnd'
import { createBitNot } from './function/bitwise/bitNot'
import { createBitOr } from './function/bitwise/bitOr'
import { createBitXor } from './function/bitwise/bitXor'
import { createArg } from './function/complex/arg'
import { createConj } from './function/complex/conj'
import { createIm } from './function/complex/im'
import { createRe } from './function/complex/re'
import { createNot } from './function/logical/not'
import { createOr } from './function/logical/or'
import { createXor } from './function/logical/xor'
import { createConcat } from './function/matrix/concat'
import { createCross } from './function/matrix/cross'
import { createDiag } from './function/matrix/diag'
import { createEye } from './function/matrix/eye'
import { createFilter } from './function/matrix/filter'
import { createFlatten } from './function/matrix/flatten'
import { createForEach } from './function/matrix/forEach'
import { createGetMatrixDataType } from './function/matrix/getMatrixDataType'
import { createIdentity } from './function/matrix/identity'
import { createKron } from './function/matrix/kron'
import { createMap } from './function/matrix/map'
import { createOnes } from './function/matrix/ones'
import { createRange } from './function/matrix/range'
import { createReshape } from './function/matrix/reshape'
import { createResize } from './function/matrix/resize'
import { createSize } from './function/matrix/size'
import { createSqueeze } from './function/matrix/squeeze'
import { createSubset } from './function/matrix/subset'
import { createTranspose } from './function/matrix/transpose'
import { createCtranspose } from './function/matrix/ctranspose'
import { createZeros } from './function/matrix/zeros'
import { createErf } from './function/special/erf'
import { createMode } from './function/statistics/mode'
import { createProd } from './function/statistics/prod'
import { createFormat } from './function/string/format'
import { createPrint } from './function/string/print'
import { createTo } from './function/unit/to'
import { createIsPrime } from './function/utils/isPrime'
import { createNumeric } from './function/utils/numeric'
import { createDivideScalar } from './function/arithmetic/divideScalar'
import { createPow } from './function/arithmetic/pow'
import { createRound } from './function/arithmetic/round'
import { createLog } from './function/arithmetic/log'
import { createLog1p } from './function/arithmetic/log1p'
import { createNthRoots } from './function/arithmetic/nthRoots'
import { createDotPow } from './function/arithmetic/dotPow'
import { createDotDivide } from './function/arithmetic/dotDivide'
import { createLsolve } from './function/algebra/solver/lsolve'
import { createUsolve } from './function/algebra/solver/usolve'
import { createLeftShift } from './function/bitwise/leftShift'
import { createRightArithShift } from './function/bitwise/rightArithShift'
import { createRightLogShift } from './function/bitwise/rightLogShift'
import { createAnd } from './function/logical/and'
import { createCompare } from './function/relational/compare'
import { createCompareNatural } from './function/relational/compareNatural'
import { createCompareText } from './function/relational/compareText'
import { createEqual } from './function/relational/equal'
import { createEqualText } from './function/relational/equalText'
import { createSmaller } from './function/relational/smaller'
import { createSmallerEq } from './function/relational/smallerEq'
import { createLarger } from './function/relational/larger'
import { createLargerEq } from './function/relational/largerEq'
import { createDeepEqual } from './function/relational/deepEqual'
import { createUnequal } from './function/relational/unequal'
import { createPartitionSelect } from './function/matrix/partitionSelect'
import { createSort } from './function/matrix/sort'
import { createMax } from './function/statistics/max'
import { createMin } from './function/statistics/min'
import { createImmutableDenseMatrixClass } from './type/matrix/ImmutableDenseMatrix'
import { createIndexClass } from './type/matrix/MatrixIndex'
import { createFibonacciHeapClass } from './type/matrix/FibonacciHeap'
import { createSpaClass } from './type/matrix/Spa'
import { createUnitClass } from './type/unit/Unit'
import { createUnit as createUnitFactory } from './type/unit/function/unit'
import { createSparse } from './type/matrix/function/sparse'
import { createCreateUnit } from './type/unit/function/createUnit'
import { createAcos } from './function/trigonometry/acos'
import { createAcosh } from './function/trigonometry/acosh'
import { createAcot } from './function/trigonometry/acot'
import { createAcoth } from './function/trigonometry/acoth'
import { createAcsc } from './function/trigonometry/acsc'
import { createAcsch } from './function/trigonometry/acsch'
import { createAsec } from './function/trigonometry/asec'
import { createAsech } from './function/trigonometry/asech'
import { createAsin } from './function/trigonometry/asin'
import { createAsinh } from './function/trigonometry/asinh'
import { createAtan } from './function/trigonometry/atan'
import { createAtan2 } from './function/trigonometry/atan2'
import { createAtanh } from './function/trigonometry/atanh'
import { createCos } from './function/trigonometry/cos'
import { createCosh } from './function/trigonometry/cosh'
import { createCot } from './function/trigonometry/cot'
import { createCoth } from './function/trigonometry/coth'
import { createCsc } from './function/trigonometry/csc'
import { createCsch } from './function/trigonometry/csch'
import { createSec } from './function/trigonometry/sec'
import { createSech } from './function/trigonometry/sech'
import { createSin } from './function/trigonometry/sin'
import { createSinh } from './function/trigonometry/sinh'
import { createTan } from './function/trigonometry/tan'
import { createTanh } from './function/trigonometry/tanh'
import { createSetCartesian } from './function/set/setCartesian'
import { createSetDifference } from './function/set/setDifference'
import { createSetDistinct } from './function/set/setDistinct'
import { createSetIntersect } from './function/set/setIntersect'
import { createSetIsSubset } from './function/set/setIsSubset'
import { createSetMultiplicity } from './function/set/setMultiplicity'
import { createSetPowerset } from './function/set/setPowerset'
import { createSetSize } from './function/set/setSize'
import { createSetSymDifference } from './function/set/setSymDifference'
import { createSetUnion } from './function/set/setUnion'
import { createAdd } from './function/arithmetic/add'
import { createHypot } from './function/arithmetic/hypot'
import { createNorm } from './function/arithmetic/norm'
import { createDot } from './function/matrix/dot'
import { createTrace } from './function/matrix/trace'
import { createIndex } from './type/matrix/function'
import { createNode } from './expression/node/Node'
import { createAccessorNode } from './expression/node/AccessorNode'
import { createArrayNode } from './expression/node/ArrayNode'
import { createAssignmentNode } from './expression/node/AssignmentNode'
import { createBlockNode } from './expression/node/BlockNode'
import { createConditionalNode } from './expression/node/ConditionalNode'
import { createConstantNode } from './expression/node/ConstantNode'
import { createFunctionAssignmentNode } from './expression/node/FunctionAssignmentNode'
import { createIndexNode } from './expression/node/IndexNode'
import { createObjectNode } from './expression/node/ObjectNode'
import { createOperatorNode } from './expression/node/OperatorNode'
import { createParenthesisNode } from './expression/node/ParenthesisNode'
import { createRangeNode } from './expression/node/RangeNode'
import { createRelationalNode } from './expression/node/RelationalNode'
import { createSymbolNode } from './expression/node/SymbolNode'
import { createFunctionNode } from './expression/node/FunctionNode'
import { createParse } from './expression/parse'
import { createCompile } from './expression/function/compile'
import { createEvaluate } from './expression/function/evaluate'
import { createParserClass } from './expression/Parser'
import { createParser } from './expression/function/parser'
import { createLup } from './function/algebra/decomposition/lup'
import { createQr } from './function/algebra/decomposition/qr'
import { createSlu } from './function/algebra/decomposition/slu'
import { createLusolve } from './function/algebra/solver/lusolve'
import { createHelpClass } from './expression/Help'
import { createChainClass } from './type/chain/Chain'
import { createHelp } from './expression/function/help'
import { createChain } from './type/chain/function/chain'
import { createDet } from './function/matrix/det'
import { createInv } from './function/matrix/inv'
import { createExpm } from './function/matrix/expm'
import { createSqrtm } from './function/matrix/sqrtm'
import { createDivide } from './function/arithmetic/divide'
import { createDistance } from './function/geometry/distance'
import { createIntersect } from './function/geometry/intersect'
import { createSum } from './function/statistics/sum'
import { createMean } from './function/statistics/mean'
import { createMedian } from './function/statistics/median'
import { createMad } from './function/statistics/mad'
import { createVariance } from './function/statistics/variance'
import { createQuantileSeq } from './function/statistics/quantileSeq'
import { createStd } from './function/statistics/std'
import { createCombinations } from './function/probability/combinations'
import { createGamma } from './function/probability/gamma'
import { createFactorial } from './function/probability/factorial'
import { createKldivergence } from './function/probability/kldivergence'
import { createMultinomial } from './function/probability/multinomial'
import { createPermutations } from './function/probability/permutations'
import { createPickRandom } from './function/probability/pickRandom'
import { createRandom } from './function/probability/random'
import { createRandomInt } from './function/probability/randomInt'
import { createStirlingS2 } from './function/combinatorics/stirlingS2'
import { createBellNumbers } from './function/combinatorics/bellNumbers'
import { createCatalan } from './function/combinatorics/catalan'
import { createComposition } from './function/combinatorics/composition'
import { createSimplify } from './function/algebra/simplify'
import { createDerivative } from './function/algebra/derivative'
import { createRationalize } from './function/algebra/rationalize'
import { createReviver } from './json/reviver'
import {
  createE,
  createFalse,
  createI,
  createInfinity,
  createLN10,
  createLN2,
  createLOG10E,
  createLOG2E,
  createNaN,
  createNull,
  createPhi,
  createPi,
  createSQRT1_2, // eslint-disable-line camelcase
  createSQRT2,
  createTau,
  createTrue,
  createVersion
} from './constants'
import {
  createAtomicMass,
  createAvogadro,
  createBohrMagneton,
  createBohrRadius,
  createBoltzmann,
  createClassicalElectronRadius,
  createConductanceQuantum,
  createCoulomb,
  createDeuteronMass,
  createEfimovFactor,
  createElectricConstant,
  createElectronMass,
  createElementaryCharge,
  createFaraday,
  createFermiCoupling,
  createFineStructure,
  createFirstRadiation,
  createGasConstant,
  createGravitationConstant,
  createGravity,
  createHartreeEnergy,
  createInverseConductanceQuantum,
  createKlitzing,
  createLoschmidt,
  createMagneticConstant,
  createMagneticFluxQuantum,
  createMolarMass,
  createMolarMassC12,
  createMolarPlanckConstant,
  createMolarVolume,
  createNeutronMass,
  createNuclearMagneton,
  createPlanckCharge,
  createPlanckConstant,
  createPlanckLength,
  createPlanckMass,
  createPlanckTemperature,
  createPlanckTime,
  createProtonMass,
  createQuantumOfCirculation,
  createReducedPlanckConstant,
  createRydberg,
  createSackurTetrode,
  createSecondRadiation,
  createSpeedOfLight,
  createStefanBoltzmann,
  createThomsonCrossSection,
  createVacuumImpedance,
  createWeakMixingAngle,
  createWienDisplacement
} from './type/unit/physicalConstants'
import { createFilterTransform } from './expression/transform/filter.transform'
import { createForEachTransform } from './expression/transform/forEach.transform'
import { createIndexTransform } from './expression/transform/index.transform'
import { createMapTransform } from './expression/transform/map.transform'
import { createMaxTransform } from './expression/transform/max.transform'
import { createMeanTransform } from './expression/transform/mean.transform'
import { createMinTransform } from './expression/transform/min.transform'
import { createRangeTransform } from './expression/transform/range.transform'
import { createSubsetTransform } from './expression/transform/subset.transform'
import { createConcatTransform } from './expression/transform/concat.transform'
import { MATRIX_OPTIONS, NUMBER_OPTIONS } from './core/function/config'

// create a read-only version of config
export const config = /* #__PURE__ */ function (options) {
  if (options) {
    throw new Error('The global config is readonly. ' +
      'Please create a mathjs instance if you want to change the default configuration.')
  }

  return Object.freeze(DEFAULT_CONFIG)
}
Object.assign(config, DEFAULT_CONFIG, { MATRIX_OPTIONS, NUMBER_OPTIONS })

// util functions
export {
  isAccessorNode,
  isArray,
  isArrayNode,
  isAssignmentNode,
  isBigNumber,
  isBlockNode,
  isBoolean,
  isChain,
  isComplex,
  isConditionalNode,
  isConstantNode,
  isDate,
  isDenseMatrix,
  isFraction,
  isFunction,
  isFunctionAssignmentNode,
  isFunctionNode,
  isHelp,
  isIndex,
  isIndexNode,
  isMatrix,
  isNode,
  isNull,
  isNumber,
  isString,
  isUndefined,
  isObject,
  isObjectNode,
  isOperatorNode,
  isParenthesisNode,
  isRange,
  isRangeNode,
  isRegExp,
  isResultSet,
  isSparseMatrix,
  isSymbolNode,
  isUnit
} from './utils/is'

// ----------------------------------------------------------------------------
// classes and functions

// class (1)
export const ResultSet = /* #__PURE__ */ createResultSet()
export const BigNumber = /* #__PURE__ */ createBigNumberClass({ config })
export const Complex = /* #__PURE__ */ createComplexClass({ config })
export const Fraction = /* #__PURE__ */ createFractionClass()
export const Range = /* #__PURE__ */ createRangeClass()
export const Matrix = /* #__PURE__ */ createMatrixClass()
export const DenseMatrix = /* #__PURE__ */ createDenseMatrixClass({ Matrix })

export const typed = /* #__PURE__ */ createTyped({
  bignumber: (x) => new BigNumber(x),
  complex: (re) => new Complex(re, 0),
  fraction: (x) => new Fraction(x),
  matrix: (x) => new DenseMatrix(x)
})

// utils (1)
export const clone = /* #__PURE__ */ createClone({ typed })
export const isInteger = /* #__PURE__ */ createIsInteger({ typed })
export const isNegative = /* #__PURE__ */ createIsNegative({ typed })
export const isNumeric = /* #__PURE__ */ createIsNumeric({ typed })
export const hasNumericValue = /* #__PURE__ */ createHasNumericValue({ typed, isNumeric })
export const isPositive = /* #__PURE__ */ createIsPositive({ typed })
export const isZero = /* #__PURE__ */ createIsZero({ typed })
export const isNaN = /* #__PURE__ */ createIsNaN({ typed })
export const typeOf = /* #__PURE__ */ createTypeOf({ typed })

// relational (1)
export const equalScalar = /* #__PURE__ */ createEqualScalar({ config, typed })

// classes (1.1)
export const SparseMatrix = /* #__PURE__ */ createSparseMatrixClass({ typed, equalScalar, Matrix })

// create (1)
export const number = /* #__PURE__ */ createNumber({ typed })
export const string = /* #__PURE__ */ createString({ typed })
export const boolean = /* #__PURE__ */ createBoolean({ typed })
export const bignumber = /* #__PURE__ */ createBignumber({ typed, BigNumber })
export const complex = /* #__PURE__ */ createComplex({ typed, Complex })
export const fraction = /* #__PURE__ */ createFraction({ typed, Fraction })
export const matrix = /* #__PURE__ */ createMatrix({ typed, Matrix, DenseMatrix, SparseMatrix })
export const splitUnit = /* #__PURE__ */ createSplitUnit({ typed })

// arithmetic (1)
export const unaryMinus = /* #__PURE__ */ createUnaryMinus({ typed })
export const unaryPlus = /* #__PURE__ */ createUnaryPlus({ config, typed, BigNumber })
export const abs = /* #__PURE__ */ createAbs({ typed })
export const addScalar = /* #__PURE__ */ createAddScalar({ typed })
export const cbrt = /* #__PURE__ */ createCbrt({ config, typed, isNegative, unaryMinus, matrix, Complex, BigNumber, Fraction })
export const ceil = /* #__PURE__ */ createCeil({ typed })
export const cube = /* #__PURE__ */ createCube({ typed })
export const exp = /* #__PURE__ */ createExp({ typed })
export const expm1 = /* #__PURE__ */ createExpm1({ typed, Complex })
export const fix = /* #__PURE__ */ createFix({ typed, Complex })
export const floor = /* #__PURE__ */ createFloor({ typed })
export const gcd = /* #__PURE__ */ createGcd({ typed, matrix, equalScalar, BigNumber, DenseMatrix })
export const lcm = /* #__PURE__ */ createLcm({ typed, matrix, equalScalar })
export const log10 = /* #__PURE__ */ createLog10({ config, typed, Complex })
export const log2 = /* #__PURE__ */ createLog2({ config, typed, Complex })
export const mod = /* #__PURE__ */ createMod({ typed, matrix, equalScalar, DenseMatrix })
export const multiplyScalar = /* #__PURE__ */ createMultiplyScalar({ typed })
export const multiply = /* #__PURE__ */ createMultiply({ typed, matrix, addScalar, multiplyScalar, equalScalar })
export const nthRoot = /* #__PURE__ */ createNthRoot({ typed, matrix, equalScalar, BigNumber })
export const sign = /* #__PURE__ */ createSign({ typed, BigNumber, Fraction })
export const sqrt = /* #__PURE__ */ createSqrt({ config, typed, Complex })
export const square = /* #__PURE__ */ createSquare({ typed })
export const subtract = /* #__PURE__ */ createSubtract({ typed, matrix, equalScalar, addScalar, unaryMinus, DenseMatrix })
export const xgcd = /* #__PURE__ */ createXgcd({ config, typed, matrix, BigNumber })
export const dotMultiply = /* #__PURE__ */ createDotMultiply({ typed, matrix, equalScalar, multiplyScalar })

// bitwise (1)
export const bitAnd = /* #__PURE__ */ createBitAnd({ typed, matrix, equalScalar })
export const bitNot = /* #__PURE__ */ createBitNot({ typed })
export const bitOr = /* #__PURE__ */ createBitOr({ typed, matrix, equalScalar, DenseMatrix })
export const bitXor = /* #__PURE__ */ createBitXor({ typed, matrix, DenseMatrix })

// complex (1)
export const arg = /* #__PURE__ */ createArg({ typed, BigNumber })
export const conj = /* #__PURE__ */ createConj({ typed })
export const im = /* #__PURE__ */ createIm({ typed })
export const re = /* #__PURE__ */ createRe({ typed })

// logical (1)
export const not = /* #__PURE__ */ createNot({ typed })
export const or = /* #__PURE__ */ createOr({ typed, matrix, equalScalar, DenseMatrix })
export const xor = /* #__PURE__ */ createXor({ typed, matrix, DenseMatrix })

// matrix (1)
export const concat = /* #__PURE__ */ createConcat({ typed, matrix, isInteger })
export const cross = /* #__PURE__ */ createCross({ typed, matrix, subtract, multiply })
export const diag = /* #__PURE__ */ createDiag({ typed, matrix, DenseMatrix, SparseMatrix })
export const eye = /* #__PURE__ */ createEye({ typed, matrix })
export const filter = /* #__PURE__ */ createFilter({ typed, matrix })
export const flatten = /* #__PURE__ */ createFlatten({ typed, matrix })
export const forEach = /* #__PURE__ */ createForEach({ typed })
export const getMatrixDataType = /* #__PURE__ */ createGetMatrixDataType({ typed })
export const identity = /* #__PURE__ */ createIdentity({ config, typed, matrix, BigNumber, DenseMatrix, SparseMatrix })
export const kron = /* #__PURE__ */ createKron({ typed, matrix, multiplyScalar })
export const map = /* #__PURE__ */ createMap({ typed })
export const ones = /* #__PURE__ */ createOnes({ config, typed, matrix, BigNumber })
export const range = /* #__PURE__ */ createRange({ config, typed, matrix, BigNumber })
export const reshape = /* #__PURE__ */ createReshape({ typed, isInteger, matrix })
export const resize = /* #__PURE__ */ createResize({ config, matrix })
export const size = /* #__PURE__ */ createSize({ config, typed, matrix })
export const squeeze = /* #__PURE__ */ createSqueeze({ typed, matrix })
export const subset = /* #__PURE__ */ createSubset({ typed, matrix })
export const transpose = /* #__PURE__ */ createTranspose({ typed, matrix })
export const ctranspose = /* #__PURE__ */ createCtranspose({ typed, transpose, conj })
export const zeros = /* #__PURE__ */ createZeros({ config, typed, matrix, BigNumber })

// special (1)
export const erf = /* #__PURE__ */ createErf({ typed, BigNumber })

// statistics (1)
export const mode = /* #__PURE__ */ createMode({ typed, isNaN, isNumeric })
export const prod = /* #__PURE__ */ createProd({ typed, multiply })

// string (1)
export const format = /* #__PURE__ */ createFormat({ typed })
export const print = /* #__PURE__ */ createPrint({ typed })

// unit (1)
export const to = /* #__PURE__ */ createTo({ typed, matrix })

// utils (2)
export const isPrime = /* #__PURE__ */ createIsPrime({ typed, BigNumber })
export const numeric = /* #__PURE__ */ createNumeric({ typed, number, bignumber, fraction })

// arithmetic (2)
export const divideScalar = /* #__PURE__ */ createDivideScalar({ typed, numeric })
export const pow = /* #__PURE__ */ createPow({ config, typed, identity, multiply, matrix, number, fraction, Complex })
export const round = /* #__PURE__ */ createRound({ typed, matrix, equalScalar, zeros, BigNumber, DenseMatrix })
export const log = /* #__PURE__ */ createLog({ config, typed, divideScalar, Complex })
export const log1p = /* #__PURE__ */ createLog1p({ config, typed, divideScalar, log, Complex })
export const nthRoots = /* #__PURE__ */ createNthRoots({ config, typed, divideScalar, Complex })
export const dotPow = /* #__PURE__ */ createDotPow({ typed, equalScalar, matrix, pow, DenseMatrix })
export const dotDivide = /* #__PURE__ */ createDotDivide({ typed, matrix, equalScalar, divideScalar, DenseMatrix })

// algebra (2)
export const lsolve = /* #__PURE__ */ createLsolve({ typed, matrix, divideScalar, multiplyScalar, subtract, equalScalar, DenseMatrix })
export const usolve = /* #__PURE__ */ createUsolve({ typed, matrix, divideScalar, multiplyScalar, subtract, equalScalar, DenseMatrix })

// bitwise (2)
export const leftShift = /* #__PURE__ */ createLeftShift({ typed, matrix, equalScalar, zeros, DenseMatrix })
export const rightArithShift = /* #__PURE__ */ createRightArithShift({ typed, matrix, equalScalar, zeros, DenseMatrix })
export const rightLogShift = /* #__PURE__ */ createRightLogShift({ typed, matrix, equalScalar, zeros, DenseMatrix })

// logical (2)
export const and = /* #__PURE__ */ createAnd({ typed, matrix, equalScalar, zeros, not })

// relational (2)
export const compare = /* #__PURE__ */ createCompare({ config, typed, equalScalar, matrix, BigNumber, Fraction, DenseMatrix })
export const compareNatural = /* #__PURE__ */ createCompareNatural({ typed, compare })
export const compareText = /* #__PURE__ */ createCompareText({ config, typed, matrix })
export const equal = /* #__PURE__ */ createEqual({ config, typed, matrix, equalScalar, DenseMatrix })
export const equalText = /* #__PURE__ */ createEqualText({ typed, compareText, isZero })
export const smaller = /* #__PURE__ */ createSmaller({ config, typed, matrix, equalScalar, divideScalar, DenseMatrix })
export const smallerEq = /* #__PURE__ */ createSmallerEq({ config, typed, matrix, DenseMatrix })
export const larger = /* #__PURE__ */ createLarger({ config, typed, matrix, DenseMatrix })
export const largerEq = /* #__PURE__ */ createLargerEq({ config, typed, matrix, DenseMatrix })
export const deepEqual = /* #__PURE__ */ createDeepEqual({ config, typed, equal })
export const unequal = /* #__PURE__ */ createUnequal({ config, typed, matrix, DenseMatrix })

// matrix (2)
export const partitionSelect = /* #__PURE__ */ createPartitionSelect({ typed, isNumeric, isNaN, compare })
export const sort = /* #__PURE__ */ createSort({ typed, matrix, compare, compareNatural })

// statistics (2)
export const max = /* #__PURE__ */ createMax({ typed, larger })
export const min = /* #__PURE__ */ createMin({ typed, smaller })

// class (2)
export const ImmutableDenseMatrix = /* #__PURE__ */ createImmutableDenseMatrixClass({ smaller, DenseMatrix })
export const Index = /* #__PURE__ */ createIndexClass({ ImmutableDenseMatrix })
export const FibonacciHeap = /* #__PURE__ */ createFibonacciHeapClass({ smaller, larger })
export const Spa = /* #__PURE__ */ createSpaClass({ addScalar, equalScalar, FibonacciHeap })
export const Unit = /* #__PURE__ */ createUnitClass({
  config,
  addScalar,
  subtract,
  multiplyScalar,
  divideScalar,
  pow,
  abs,
  fix,
  round,
  equal,
  isNumeric,
  format,
  number,
  Complex,
  BigNumber,
  Fraction
})

// constants
export const _true = /* #__PURE__ */ createTrue()
export const _false = /* #__PURE__ */ createFalse()
export const _null = /* #__PURE__ */ createNull()
export const _Infinity = /* #__PURE__ */ createInfinity({ config, BigNumber })
export const _NaN = /* #__PURE__ */ createNaN({ config, BigNumber })
export const pi = /* #__PURE__ */ createPi({ config, BigNumber })
export const tau = /* #__PURE__ */ createTau({ config, BigNumber })
export const e = /* #__PURE__ */ createE({ config, BigNumber })
export const phi = /* #__PURE__ */ createPhi({ config, BigNumber })
export const LN2 = /* #__PURE__ */ createLN2({ config, BigNumber })
export const LN10 = /* #__PURE__ */ createLN10({ config, BigNumber })
export const LOG2E = /* #__PURE__ */ createLOG2E({ config, BigNumber })
export const LOG10E = /* #__PURE__ */ createLOG10E({ config, BigNumber })
export const SQRT1_2 = /* #__PURE__ */ createSQRT1_2({ config, BigNumber })
export const SQRT2 = /* #__PURE__ */ createSQRT2({ config, BigNumber })
export const i = /* #__PURE__ */ createI({ config, Complex })
export const version = /* #__PURE__ */ createVersion()

// physical constants
const pyhiscalConstantsDependencies = {
  config,
  BigNumber,
  Unit
}

// Universal constants
export const speedOfLight = /* #__PURE__ */ createSpeedOfLight(pyhiscalConstantsDependencies)
export const gravitationConstant = /* #__PURE__ */ createGravitationConstant(pyhiscalConstantsDependencies)
export const planckConstant = /* #__PURE__ */ createPlanckConstant(pyhiscalConstantsDependencies)
export const reducedPlanckConstant = /* #__PURE__ */ createReducedPlanckConstant(pyhiscalConstantsDependencies)

// Electromagnetic constants
export const magneticConstant = /* #__PURE__ */ createMagneticConstant(pyhiscalConstantsDependencies)
export const electricConstant = /* #__PURE__ */ createElectricConstant(pyhiscalConstantsDependencies)
export const vacuumImpedance = /* #__PURE__ */ createVacuumImpedance(pyhiscalConstantsDependencies)
export const coulomb = /* #__PURE__ */ createCoulomb(pyhiscalConstantsDependencies)
export const elementaryCharge = /* #__PURE__ */ createElementaryCharge(pyhiscalConstantsDependencies)
export const bohrMagneton = /* #__PURE__ */ createBohrMagneton(pyhiscalConstantsDependencies)
export const conductanceQuantum = /* #__PURE__ */ createConductanceQuantum(pyhiscalConstantsDependencies)
export const inverseConductanceQuantum = /* #__PURE__ */ createInverseConductanceQuantum(pyhiscalConstantsDependencies)
export const magneticFluxQuantum = /* #__PURE__ */ createMagneticFluxQuantum(pyhiscalConstantsDependencies)
export const nuclearMagneton = /* #__PURE__ */ createNuclearMagneton(pyhiscalConstantsDependencies)
export const klitzing = /* #__PURE__ */ createKlitzing(pyhiscalConstantsDependencies)

// Atomic and nuclear constants
export const bohrRadius = /* #__PURE__ */ createBohrRadius(pyhiscalConstantsDependencies)
export const classicalElectronRadius = /* #__PURE__ */ createClassicalElectronRadius(pyhiscalConstantsDependencies)
export const electronMass = /* #__PURE__ */ createElectronMass(pyhiscalConstantsDependencies)
export const fermiCoupling = /* #__PURE__ */ createFermiCoupling(pyhiscalConstantsDependencies)
export const fineStructure = /* #__PURE__ */ createFineStructure(pyhiscalConstantsDependencies)
export const hartreeEnergy = /* #__PURE__ */ createHartreeEnergy(pyhiscalConstantsDependencies)
export const protonMass = /* #__PURE__ */ createProtonMass(pyhiscalConstantsDependencies)
export const deuteronMass = /* #__PURE__ */ createDeuteronMass(pyhiscalConstantsDependencies)
export const neutronMass = /* #__PURE__ */ createNeutronMass(pyhiscalConstantsDependencies)
export const quantumOfCirculation = /* #__PURE__ */ createQuantumOfCirculation(pyhiscalConstantsDependencies)
export const rydberg = /* #__PURE__ */ createRydberg(pyhiscalConstantsDependencies)
export const thomsonCrossSection = /* #__PURE__ */ createThomsonCrossSection(pyhiscalConstantsDependencies)
export const weakMixingAngle = /* #__PURE__ */ createWeakMixingAngle(pyhiscalConstantsDependencies)
export const efimovFactor = /* #__PURE__ */ createEfimovFactor(pyhiscalConstantsDependencies)

// Physico-chemical constants
export const atomicMass = /* #__PURE__ */ createAtomicMass(pyhiscalConstantsDependencies)
export const avogadro = /* #__PURE__ */ createAvogadro(pyhiscalConstantsDependencies)
export const boltzmann = /* #__PURE__ */ createBoltzmann(pyhiscalConstantsDependencies)
export const faraday = /* #__PURE__ */ createFaraday(pyhiscalConstantsDependencies)
export const firstRadiation = /* #__PURE__ */ createFirstRadiation(pyhiscalConstantsDependencies)
export const loschmidt = /* #__PURE__ */ createLoschmidt(pyhiscalConstantsDependencies)
export const gasConstant = /* #__PURE__ */ createGasConstant(pyhiscalConstantsDependencies)
export const molarPlanckConstant = /* #__PURE__ */ createMolarPlanckConstant(pyhiscalConstantsDependencies)
export const molarVolume = /* #__PURE__ */ createMolarVolume(pyhiscalConstantsDependencies)
export const sackurTetrode = /* #__PURE__ */ createSackurTetrode(pyhiscalConstantsDependencies)
export const secondRadiation = /* #__PURE__ */ createSecondRadiation(pyhiscalConstantsDependencies)
export const stefanBoltzmann = /* #__PURE__ */ createStefanBoltzmann(pyhiscalConstantsDependencies)
export const wienDisplacement = /* #__PURE__ */ createWienDisplacement(pyhiscalConstantsDependencies)

// Adopted values
export const molarMass = /* #__PURE__ */ createMolarMass(pyhiscalConstantsDependencies)
export const molarMassC12 = /* #__PURE__ */ createMolarMassC12(pyhiscalConstantsDependencies)
export const gravity = /* #__PURE__ */ createGravity(pyhiscalConstantsDependencies)

// Natural units
export const planckLength = /* #__PURE__ */ createPlanckLength(pyhiscalConstantsDependencies)
export const planckMass = /* #__PURE__ */ createPlanckMass(pyhiscalConstantsDependencies)
export const planckTime = /* #__PURE__ */ createPlanckTime(pyhiscalConstantsDependencies)
export const planckCharge = /* #__PURE__ */ createPlanckCharge(pyhiscalConstantsDependencies)
export const planckTemperature = /* #__PURE__ */ createPlanckTemperature(pyhiscalConstantsDependencies)

// create (2)
export const sparse = /* #__PURE__ */ createSparse({ typed, SparseMatrix })
export const unit = /* #__PURE__ */ createUnitFactory({ typed, Unit })
export const createUnit = /* #__PURE__ */ createCreateUnit({ typed, Unit })

// trigonometry (2)
export const acos = /* #__PURE__ */ createAcos({ config, typed, Complex })
export const acosh = /* #__PURE__ */ createAcosh({ config, typed, Complex })
export const acot = /* #__PURE__ */ createAcot({ typed, BigNumber })
export const acoth = /* #__PURE__ */ createAcoth({ config, typed, Complex, BigNumber })
export const acsc = /* #__PURE__ */ createAcsc({ config, typed, Complex, BigNumber })
export const acsch = /* #__PURE__ */ createAcsch({ typed, BigNumber })
export const asec = /* #__PURE__ */ createAsec({ config, typed, Complex, BigNumber })
export const asech = /* #__PURE__ */ createAsech({ config, typed, Complex, BigNumber })
export const asin = /* #__PURE__ */ createAsin({ config, typed, Complex })
export const asinh = /* #__PURE__ */ createAsinh({ typed })
export const atan = /* #__PURE__ */ createAtan({ typed })
export const atan2 = /* #__PURE__ */ createAtan2({ typed, matrix, equalScalar, BigNumber, DenseMatrix })
export const atanh = /* #__PURE__ */ createAtanh({ config, typed, Complex })
export const cos = /* #__PURE__ */ createCos({ typed, Unit })
export const cosh = /* #__PURE__ */ createCosh({ typed, Unit })
export const cot = /* #__PURE__ */ createCot({ typed, BigNumber, Unit })
export const coth = /* #__PURE__ */ createCoth({ typed, BigNumber, Unit })
export const csc = /* #__PURE__ */ createCsc({ typed, BigNumber, Unit })
export const csch = /* #__PURE__ */ createCsch({ typed, BigNumber, Unit })
export const sec = /* #__PURE__ */ createSec({ typed, BigNumber, Unit })
export const sech = /* #__PURE__ */ createSech({ typed, BigNumber, Unit })
export const sin = /* #__PURE__ */ createSin({ typed, BigNumber, Unit })
export const sinh = /* #__PURE__ */ createSinh({ typed, Unit })
export const tan = /* #__PURE__ */ createTan({ typed, Unit })
export const tanh = /* #__PURE__ */ createTanh({ typed, Unit })

// set (2)
export const setCartesian = /* #__PURE__ */ createSetCartesian({ typed, size, subset, compareNatural, Index, DenseMatrix })
export const setDifference = /* #__PURE__ */ createSetDifference({ typed, size, subset, compareNatural, Index, DenseMatrix })
export const setDistinct = /* #__PURE__ */ createSetDistinct({ typed, size, subset, compareNatural, Index, DenseMatrix })
export const setIntersect = /* #__PURE__ */ createSetIntersect({ typed, size, subset, compareNatural, Index, DenseMatrix })
export const setIsSubset = /* #__PURE__ */ createSetIsSubset({ typed, size, subset, compareNatural, Index })
export const setMultiplicity = /* #__PURE__ */ createSetMultiplicity({ typed, size, subset, compareNatural, Index })
export const setPowerset = /* #__PURE__ */ createSetPowerset({ typed, size, subset, compareNatural, Index })
export const setSize = /* #__PURE__ */ createSetSize({ typed, compareNatural })
export const setSymDifference = /* #__PURE__ */ createSetSymDifference({ typed, size, concat, subset, setDifference, Index })
export const setUnion = /* #__PURE__ */ createSetUnion({ typed, size, concat, subset, setIntersect, setSymDifference, Index })

// arithmetic (3)
export const add = /* #__PURE__ */ createAdd({ typed, matrix, addScalar, equalScalar, DenseMatrix, SparseMatrix })
export const hypot = /* #__PURE__ */ createHypot({ typed, abs, addScalar, divideScalar, multiplyScalar, sqrt, smaller, isPositive })
export const norm = /* #__PURE__ */ createNorm({ typed, abs, add, pow, conj, sqrt, multiply, equalScalar, larger, smaller, matrix })

// matrix (3)
export const dot = /* #__PURE__ */ createDot({ typed, add, multiply })
export const trace = /* #__PURE__ */ createTrace({ typed, matrix, add })
export const index = /* #__PURE__ */ createIndex({ typed, Index })

// algebra (3)
export const lup = /* #__PURE__ */ createLup({
  typed,
  matrix,
  abs,
  addScalar,
  divideScalar,
  multiplyScalar,
  subtract,
  larger,
  equalScalar,
  unaryMinus,
  DenseMatrix,
  SparseMatrix,
  Spa
})
export const qr = /* #__PURE__ */ createQr({
  typed,
  matrix,
  zeros,
  identity,
  isZero,
  unequal,
  sign,
  sqrt,
  conj,
  unaryMinus,
  addScalar,
  divideScalar,
  multiplyScalar,
  subtract
})
export const slu = /* #__PURE__ */ createSlu({ typed, abs, add, multiply, transpose, divideScalar, subtract, larger, largerEq, SparseMatrix })
export const lusolve = /* #__PURE__ */ createLusolve({ typed, matrix, lup, slu, usolve, lsolve, DenseMatrix })

// matrix (4)
export const det = /* #__PURE__ */ createDet({ typed, matrix, subtract, multiply, unaryMinus, lup })
export const inv = /* #__PURE__ */ createInv({ typed, matrix, divideScalar, addScalar, multiply, unaryMinus, det, identity, abs })
export const expm = /* #__PURE__ */ createExpm({ typed, abs, add, identity, inv, multiply })
export const sqrtm = /* #__PURE__ */ createSqrtm({ typed, abs, add, multiply, sqrt, subtract, inv, size, max, identity })

// arithmetic (4)
export const divide = /* #__PURE__ */ createDivide({ typed, matrix, multiply, equalScalar, divideScalar, inv })

// geometry (4)
export const distance = /* #__PURE__ */ createDistance({ typed, addScalar, subtract, multiplyScalar, divideScalar, unaryMinus, sqrt, abs })
export const intersect = /* #__PURE__ */ createIntersect({ config, typed, abs, add, addScalar, matrix, multiply, multiplyScalar, divideScalar, subtract, smaller, equalScalar })

// statistics (4)
export const sum = /* #__PURE__ */ createSum({ config, typed, add, BigNumber, Fraction })
export const mean = /* #__PURE__ */ createMean({ typed, add, divide })
export const median = /* #__PURE__ */ createMedian({ typed, add, divide, compare, partitionSelect })
export const mad = /* #__PURE__ */ createMad({ typed, abs, map, median, subtract })
export const variance = /* #__PURE__ */ createVariance({ typed, add, subtract, multiply, divide, isNaN })
export const quantileSeq = /* #__PURE__ */ createQuantileSeq({ typed, add, multiply, partitionSelect, compare, BigNumber })
export const std = /* #__PURE__ */ createStd({ typed, sqrt, variance })

// probability (4)
export const combinations = /* #__PURE__ */ createCombinations({ typed, BigNumber })
export const gamma = /* #__PURE__ */ createGamma({ config, typed, multiplyScalar, pow, BigNumber, Complex })
export const factorial = /* #__PURE__ */ createFactorial({ typed, gamma })
export const kldivergence = /* #__PURE__ */ createKldivergence({ typed, matrix, divide, sum, multiply, dotDivide, log, isNumeric })
export const multinomial = /* #__PURE__ */ createMultinomial({ typed, add, divide, multiply, factorial, isInteger, isPositive })
export const permutations = /* #__PURE__ */ createPermutations({ typed, factorial })
export const pickRandom = /* #__PURE__ */ createPickRandom({ typed, config })
export const random = /* #__PURE__ */ createRandom({ typed, config, matrix })
export const randomInt = /* #__PURE__ */ createRandomInt({ typed, config, matrix })

// combinatorics (4)
export const stirlingS2 = /* #__PURE__ */ createStirlingS2({ typed, addScalar, subtract, multiplyScalar, divideScalar, pow, factorial, combinations, isNegative, isInteger, larger })
export const bellNumbers = /* #__PURE__ */ createBellNumbers({ typed, addScalar, isNegative, isInteger, stirlingS2 })
export const catalan = /* #__PURE__ */ createCatalan({ typed, addScalar, divideScalar, multiplyScalar, combinations, isNegative, isInteger })
export const composition = /* #__PURE__ */ createComposition({ typed, addScalar, combinations, isPositive, isNegative, isInteger, larger })

const math = /* #__PURE__ */ {
  Infinity: _Infinity,
  LN10,
  LN2,
  LOG10E,
  LOG2E,
  NaN: _NaN,
  SQRT2,
  SQRT1_2,
  abs,
  acos,
  acosh,
  acot,
  acoth,
  acsc,
  acsch,
  add,
  addScalar,
  and,
  arg,
  asec,
  asech,
  asin,
  asinh,
  atan,
  atan2,
  atanh,
  atomicMass,
  avogadro,
  bellNumbers,
  bignumber,
  bitAnd,
  bitNot,
  bitOr,
  bitXor,
  bohrMagneton,
  bohrRadius,
  boltzmann,
  boolean,
  catalan,
  cbrt,
  ceil,
  classicalElectronRadius,
  clone,
  combinations,
  compare,
  compareNatural,
  compareText,
  complex,
  composition,
  concat,
  conductanceQuantum,
  config,
  conj,
  cos,
  cosh,
  cot,
  coth,
  coulomb,
  createUnit,
  cross,
  csc,
  csch,
  ctranspose,
  cube,
  deepEqual,
  det,
  deuteronMass,
  diag,
  distance,
  divide,
  divideScalar,
  dot,
  dotDivide,
  dotMultiply,
  dotPow,
  e,
  efimovFactor,
  electricConstant,
  electronMass,
  elementaryCharge,
  equal,
  equalScalar,
  equalText,
  erf,
  exp,
  expm,
  expm1,
  eye,
  factorial,
  false: _false,
  faraday,
  fermiCoupling,
  filter,
  fineStructure,
  firstRadiation,
  fix,
  flatten,
  floor,
  forEach,
  format,
  fraction,
  gamma,
  gasConstant,
  gcd,
  getMatrixDataType,
  gravitationConstant,
  gravity,
  hartreeEnergy,
  hypot,
  i,
  identity,
  im,
  index,
  intersect,
  inv,
  inverseConductanceQuantum,
  isInteger,
  isNaN,
  isNegative,
  isNumeric,
  isPositive,
  isPrime,
  isZero,
  kldivergence,
  klitzing,
  kron,
  larger,
  largerEq,
  lcm,
  leftShift,
  log,
  log10,
  log1p,
  log2,
  loschmidt,
  lsolve,
  lup,
  lusolve,
  mad,
  magneticConstant,
  magneticFluxQuantum,
  map,
  matrix,
  max,
  mean,
  median,
  min,
  mod,
  mode,
  molarMass,
  molarMassC12,
  molarPlanckConstant,
  molarVolume,
  multinomial,
  multiply,
  multiplyScalar,
  neutronMass,
  norm,
  not,
  nthRoot,
  nthRoots,
  nuclearMagneton,
  null: _null,
  number,
  numeric,
  ones,
  or,
  partitionSelect,
  permutations,
  phi,
  pi,
  pickRandom,
  planckCharge,
  planckConstant,
  planckLength,
  planckMass,
  planckTemperature,
  planckTime,
  pow,
  print,
  prod,
  protonMass,
  qr,
  quantileSeq,
  quantumOfCirculation,
  random,
  randomInt,
  range,
  re,
  reducedPlanckConstant,
  reshape,
  resize,
  rightArithShift,
  rightLogShift,
  round,
  rydberg,
  sackurTetrode,
  sec,
  sech,
  secondRadiation,
  setCartesian,
  setDifference,
  setDistinct,
  setIntersect,
  setIsSubset,
  setMultiplicity,
  setPowerset,
  setSize,
  setSymDifference,
  setUnion,
  sign,
  sin,
  sinh,
  size,
  slu,
  smaller,
  smallerEq,
  sort,
  sparse,
  speedOfLight,
  splitUnit,
  sqrt,
  sqrtm,
  square,
  squeeze,
  std,
  stefanBoltzmann,
  stirlingS2,
  string,
  subset,
  subtract,
  sum,
  tan,
  tanh,
  tau,
  thomsonCrossSection,
  to,
  trace,
  transpose,
  true: _true,
  typeOf,
  typed,
  unaryMinus,
  unaryPlus,
  unequal,
  unit,
  usolve,
  vacuumImpedance,
  variance,
  version,
  weakMixingAngle,
  wienDisplacement,
  xgcd,
  xor,
  zeros,

  'var': variance,
  'typeof': typeOf
}

// Do not use destructuring like { ...math } here, WebPack can't do tree-shaking in that case
const mathWithTransform = /* #__PURE__ */ Object.assign({}, math, {
  concat: /* #__PURE__ */ createConcatTransform({ typed, matrix, isInteger }),
  filter: /* #__PURE__ */ createFilterTransform({ typed, matrix }),
  forEach: /* #__PURE__ */ createForEachTransform({ typed }),
  index: /* #__PURE__ */ createIndexTransform({ Index }),
  map: /* #__PURE__ */ createMapTransform({ typed, matrix }),
  max: /* #__PURE__ */ createMaxTransform({ typed, larger }),
  mean: /* #__PURE__ */ createMeanTransform({ typed, add, divide }),
  min: /* #__PURE__ */ createMinTransform({ typed, smaller }),
  range: /* #__PURE__ */ createRangeTransform({ typed, config, matrix, BigNumber }),
  subset: /* #__PURE__ */ createSubsetTransform({ typed, matrix })
})

// expression (4)
export const Node = /* #__PURE__ */ createNode({ mathWithTransform })
export const AccessorNode = /* #__PURE__ */ createAccessorNode({ subset, Node })
export const ArrayNode = /* #__PURE__ */ createArrayNode({ Node })
export const AssignmentNode = /* #__PURE__ */ createAssignmentNode({ subset, matrix, Node })
export const BlockNode = /* #__PURE__ */ createBlockNode({ ResultSet, Node })
export const ConditionalNode = /* #__PURE__ */ createConditionalNode({ Node })
export const ConstantNode = /* #__PURE__ */ createConstantNode({ Node })
export const FunctionAssignmentNode = /* #__PURE__ */ createFunctionAssignmentNode({ typed, Node })
export const IndexNode = /* #__PURE__ */ createIndexNode({ Range, Node })
export const ObjectNode = /* #__PURE__ */ createObjectNode({ Node })
export const OperatorNode = /* #__PURE__ */ createOperatorNode({ Node })
export const ParenthesisNode = /* #__PURE__ */ createParenthesisNode({ Node })
export const RangeNode = /* #__PURE__ */ createRangeNode({ Node })
export const RelationalNode = /* #__PURE__ */ createRelationalNode({ Node })
export const SymbolNode = /* #__PURE__ */ createSymbolNode({ math, Unit, Node })
export const FunctionNode = /* #__PURE__ */ createFunctionNode({ math, Node, SymbolNode })
export const parse = /* #__PURE__ */ createParse({
  typed,
  config,
  numeric,
  AccessorNode,
  ArrayNode,
  AssignmentNode,
  BlockNode,
  ConditionalNode,
  ConstantNode,
  FunctionAssignmentNode,
  FunctionNode,
  IndexNode,
  ObjectNode,
  OperatorNode,
  ParenthesisNode,
  RangeNode,
  RelationalNode,
  SymbolNode
})
export const compile = /* #__PURE__ */ createCompile({ typed, parse })
export const evaluate = /* #__PURE__ */ createEvaluate({ typed, parse })
export const Parser = /* #__PURE__ */ createParserClass({ parse })

// create (4)
export const parser = /* #__PURE__ */ createParser({ math, typed, Parser })

// class (4)
export const Help = /* #__PURE__ */ createHelpClass({ parse })
export const Chain = /* #__PURE__ */ createChainClass({ math })

// type (4)
export { embeddedDocs as docs } from './expression/embeddedDocs/embeddedDocs'
export const help = /* #__PURE__ */ createHelp({ math, typed, docs: embeddedDocs, Help })
export const chain = /* #__PURE__ */ createChain({ typed, Chain })

// algebra (4)
export const simplify = /* #__PURE__ */ createSimplify({
  config,
  typed,
  parse,
  add,
  subtract,
  multiply,
  divide,
  pow,
  isZero,
  equal,
  fraction,
  bignumber,
  math,
  ConstantNode,
  FunctionNode,
  OperatorNode,
  ParenthesisNode,
  SymbolNode
})
export const derivative = /* #__PURE__ */ createDerivative({
  config,
  typed,
  parse,
  simplify,
  equal,
  isZero,
  numeric,
  ConstantNode,
  FunctionNode,
  OperatorNode,
  ParenthesisNode,
  SymbolNode
})
export const rationalize = /* #__PURE__ */ createRationalize({
  config,
  typed,
  simplify,
  parse,
  add,
  subtract,
  multiply,
  divide,
  pow,
  isZero,
  equal,
  fraction,
  bignumber,
  math,
  ConstantNode,
  FunctionNode,
  OperatorNode,
  ParenthesisNode,
  SymbolNode
})

// ----------------------------------------------------------------------------
// json

export const reviver = /* #__PURE__ */ createReviver({
  classes: {
    BigNumber,
    Chain,
    Complex,
    Fraction,
    Matrix,
    DenseMatrix,
    SparseMatrix,
    Spa,
    FibonacciHeap,
    ImmutableDenseMatrix,
    Index,
    Range,
    ResultSet,
    Unit,
    Help
  },
  AccessorNode,
  ArrayNode,
  AssignmentNode,
  BlockNode,
  ConditionalNode,
  ConstantNode,
  FunctionAssignmentNode,
  FunctionNode,
  IndexNode,
  ObjectNode,
  OperatorNode,
  ParenthesisNode,
  RangeNode,
  RelationalNode,
  SymbolNode
})

// TODO: this is ugly having to add these functions afterwards
const mathAdditional = /* __PURE__ */ {
  PI: pi,
  E: e,
  help,
  parse,
  parser,
  compile,
  evaluate,
  eval: evaluate,
  chain,
  simplify,
  derivative,
  rationalize,
  reviver
}
/* #__PURE__ */ Object.assign(math, mathAdditional)
/* #__PURE__ */ Object.assign(mathWithTransform, mathAdditional)

// ----------------------------------------------------------------------------
// error classes

export { IndexError } from './error/IndexError'
export { DimensionError } from './error/DimensionError'
export { ArgumentsError } from './error/ArgumentsError'

// ----------------------------------------------------------------------------
// core

export { core, create } from './mainInstance'
