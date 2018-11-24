import { createNumber } from './type/number'
import { createBigNumberClass } from './type/bignumber/BigNumber'
import { createBignumber } from './type/bignumber/function/bignumber'
import { createComplexClass } from './type/complex/Complex'
import { createComplex } from './type/complex/function/complex'
import { createFractionClass } from './type/fraction/Fraction'
import { createFraction } from './type/fraction/function/fraction'
import { createMatrix } from './type/matrix/function/matrix'
import { createMatrixClass } from './type/matrix/Matrix'
import { createDenseMatrixClass } from './type/matrix/DenseMatrix'
import { createSparseMatrixClass } from './type/matrix/SparseMatrix'
import { createAbs } from './function/arithmetic/abs'
import { createAdd } from './function/arithmetic/add'
import { createAddScalar } from './function/arithmetic/addScalar'
import { createCbrt } from './function/arithmetic/cbrt'
import { createCeil } from './function/arithmetic/ceil'
import { createCube } from './function/arithmetic/cube'
import { createDivide } from './function/arithmetic/divide'
import { createDivideScalar } from './function/arithmetic/divideScalar'
import { createDotDivide } from './function/arithmetic/dotDivide'
import { createDotMultiply } from './function/arithmetic/dotMultiply'
import { createDotPow } from './function/arithmetic/dotPow'
import { createExp } from './function/arithmetic/exp'
import { createExpm1 } from './function/arithmetic/expm1'
import { createFix } from './function/arithmetic/fix'
import { createFloor } from './function/arithmetic/floor'
import { createGcd } from './function/arithmetic/gcd'
import { createHypot } from './function/arithmetic/hypot'
import { createLcm } from './function/arithmetic/lcm'
import { createLog } from './function/arithmetic/log'
import { createLog10 } from './function/arithmetic/log10'
import { createLog1p } from './function/arithmetic/log1p'
import { createLog2 } from './function/arithmetic/log2'
import { createMod } from './function/arithmetic/mod'
import { createMultiply } from './function/arithmetic/multiply'
import { createMultiplyScalar } from './function/arithmetic/multiplyScalar'
import { createNorm } from './function/arithmetic/norm'
import { createNthRoot } from './function/arithmetic/nthRoot'
import { createNthRoots } from './function/arithmetic/nthRoots'
import { createPow } from './function/arithmetic/pow'
import { createRound } from './function/arithmetic/round'
import { createSign } from './function/arithmetic/sign'
import { createSqrt } from './function/arithmetic/sqrt'
import { createSquare } from './function/arithmetic/square'
import { createSubtract } from './function/arithmetic/subtract'
import { createUnaryMinus } from './function/arithmetic/unaryMinus'
import { createUnaryPlus } from './function/arithmetic/unaryPlus'
import { createXgcd } from './function/arithmetic/xgcd'
import { createEqualScalar } from './function/relational/equalScalar'
import { createSmaller } from './function/relational/smaller'
import { createLarger } from './function/relational/larger'
import { createClone } from './function/utils/clone'
import { createIsInteger } from './function/utils/isInteger'
import { createIsNegative } from './function/utils/isNegative'
import { createIsNumeric } from './function/utils/isNumeric'
import { createIsPositive } from './function/utils/isPositive'
import { createIsPrime } from './function/utils/isPrime'
import { createIsZero } from './function/utils/isZero'
import { createIsNaN } from './function/utils/isNaN'
import { createNumeric } from './function/utils/numeric'
import { createTypeOf } from './function/utils/typeOf'
import { createUnitClass } from './type/unit/Unit'
import { createUnit as _createUnit } from './type/unit/function/unit'
import { createArg } from './function/complex/arg'
import { createConj } from './function/complex/conj'
import { createIm } from './function/complex/im'
import { createRe } from './function/complex/re'
import { createLeftShift } from './function/bitwise/leftShift'
import { createRightArithShift } from './function/bitwise/rightArithShift'
import { createRightLogShift } from './function/bitwise/rightLogShift'
import { createBitXor } from './function/bitwise/bitXor'
import { createBitOr } from './function/bitwise/bitOr'
import { createBitNot } from './function/bitwise/bitNot'
import { createBitAnd } from './function/bitwise/bitAnd'
import { createCompare } from './function/relational/compare'
import { createCompareNatural } from './function/relational/compareNatural'
import { createDeepEqual } from './function/relational/deepEqual'
import { createCompareText } from './function/relational/compareText'
import { createEqual } from './function/relational/equal'
import { createEqualText } from './function/relational/equalText'
import { createLargerEq } from './function/relational/largerEq'
import { createSmallerEq } from './function/relational/smallerEq'
import { createUnequal } from './function/relational/unequal'
import { createPrint } from './function/string/print'
import { createFormat } from './function/string/format'
import { createAnd } from './function/logical/and'
import { createXor } from './function/logical/xor'
import { createOr } from './function/logical/or'
import { createNot } from './function/logical/not'
import { createImmutableDenseMatrixClass } from './type/matrix/ImmutableDenseMatrix'
import { createIndexClass } from './type/matrix/MatrixIndex'
import { createRangeClass } from './type/matrix/Range'
import { createResultSet } from './type/resultset/ResultSet'
import { createSpaClass } from './type/matrix/Spa'
import { createFibonacciHeapClass } from './type/matrix/FibonacciHeap'
import { createSparse } from './type/matrix/function/sparse'
import { createBoolean } from './type/boolean'
import { createString } from './type/string'
import { createIdentity } from './function/matrix/identity'
import { createGetMatrixDataType } from './function/matrix/getMatrixDataType'
import { createPartitionSelect } from './function/matrix/partitionSelect'
import { createReshape } from './function/matrix/reshape'
import { createResize } from './function/matrix/resize'
import { createSize } from './function/matrix/size'
import { createSqueeze } from './function/matrix/squeeze'
import { createZeros } from './function/matrix/zeros'
import { createTranspose } from './function/matrix/transpose'
import { createTrace } from './function/matrix/trace'
import { createSubset } from './function/matrix/subset'
import { createSqrtm } from './function/matrix/sqrtm'
import { createSort } from './function/matrix/sort'
import { createRange } from './function/matrix/range'
import { createOnes } from './function/matrix/ones'
import { createMap } from './function/matrix/map'
import { createKron } from './function/matrix/kron'
import { createInv } from './function/matrix/inv'
import { createIndex } from './type/matrix/function'
import { createForEach } from './function/matrix/forEach'
import { createFlatten } from './function/matrix/flatten'
import { createFilter } from './function/matrix/filter'
import { createEye } from './function/matrix/eye'
import { createExpm } from './function/matrix/expm'
import { createDot } from './function/matrix/dot'
import { createDiag } from './function/matrix/diag'
import { createDet } from './function/matrix/det'
import { createCtranspose } from './function/matrix/ctranspose'
import { createCross } from './function/matrix/cross'
import { createConcat } from './function/matrix/concat'
import { createMax } from './function/statistics/max'
import { createMean } from './function/statistics/mean'
import { createQuantileSeq } from './function/statistics/quantileSeq'
import { createVariance } from './function/statistics/variance'
import { createMedian } from './function/statistics/median'
import { createSum } from './function/statistics/sum'
import { createStd } from './function/statistics/std'
import { createProd } from './function/statistics/prod'
import { createMode } from './function/statistics/mode'
import { createMin } from './function/statistics/min'
import { createMad } from './function/statistics/mad'
import { createLsolve } from './function/algebra/solver/lsolve'
import { createLusolve } from './function/algebra/solver/lusolve'
import { createUsolve } from './function/algebra/solver/usolve'
import { createSlu } from './function/algebra/decomposition/slu'
import { createQr } from './function/algebra/decomposition/qr'
import { createLup } from './function/algebra/decomposition/lup'
import { createCreateUnit } from './type/unit/function/createUnit'
import { createSplitUnit } from './type/unit/function/splitUnit'
import { createParseExpression } from './expression/parse'
import { createParserClass } from './expression/Parser'
import { createEval } from './expression/function/eval'
import { createCompile } from './expression/function/compile'
import { createParse } from './expression/function/parse'
import { createFunctionNode } from './expression/node/FunctionNode'
import { createSymbolNode } from './expression/node/SymbolNode'
import { createRelationalNode } from './expression/node/RelationalNode'
import { createRangeNode } from './expression/node/RangeNode'
import { createParenthesisNode } from './expression/node/ParenthesisNode'
import { createOperatorNode } from './expression/node/OperatorNode'
import { createObjectNode } from './expression/node/ObjectNode'
import { createIndexNode } from './expression/node/IndexNode'
import { createFunctionAssignmentNode } from './expression/node/FunctionAssignmentNode'
import { createConstantNode } from './expression/node/ConstantNode'
import { createConditionalNode } from './expression/node/ConditionalNode'
import { createBlockNode } from './expression/node/BlockNode'
import { createAssignmentNode } from './expression/node/AssignmentNode'
import { createArrayNode } from './expression/node/ArrayNode'
import { createAccessorNode } from './expression/node/AccessorNode'
import { createNode } from './expression/node/Node'
import { createRationalize } from './function/algebra/rationalize'
import { createDerivative } from './function/algebra/derivative'
import { createSimplify } from './function/algebra/simplify'
import { createResolve } from './function/algebra/simplify/resolve'
import { createSimplifyConstant } from './function/algebra/simplify/simplifyConstant'
import { createSimplifyCore } from './function/algebra/simplify/simplifyCore'
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
import { createSetUnion } from './function/set/setUnion'
import { createSetSymDifference } from './function/set/setSymDifference'
import { createSetCartesian } from './function/set/setCartesian'
import { createSetDifference } from './function/set/setDifference'
import { createSetDistinct } from './function/set/setDistinct'
import { createSetIntersect } from './function/set/setIntersect'
import { createSetIsSubset } from './function/set/setIsSubset'
import { createSetMultiplicity } from './function/set/setMultiplicity'
import { createSetPowerset } from './function/set/setPowerset'
import { createSetSize } from './function/set/setSize'
import { createReviver } from './json/reviver'
import { createBellNumbers } from './function/combinatorics/bellNumbers'
import { createComposition } from './function/combinatorics/composition'
import { createStirlingS2 } from './function/combinatorics/stirlingS2'
import { createCatalan } from './function/combinatorics/catalan'
import { createIntersect } from './function/geometry/intersect'
import { createDistance } from './function/geometry/distance'
import { createCombinations } from './function/probability/combinations'
import { createFactorial } from './function/probability/factorial'
import { createKldivergence } from './function/probability/kldivergence'
import { createMultinomial } from './function/probability/multinomial'
import { createPermutations } from './function/probability/permutations'
import { createPickRandom } from './function/probability/pickRandom'
import { createRandom } from './function/probability/random'
import { createRandomInt } from './function/probability/randomInt'
import { createErf } from './function/special/erf'
import { createTo } from './function/unit/to'
import { createParser } from './expression/function/parser'
import { createGamma } from './function/probability/gamma'
import { createDistribution } from './function/probability/distribution'
import { createTyped } from './core/function/typed'
import { DEFAULT_CONFIG } from './core/config'
import { createEmbeddedDocs } from './expression/embeddedDocs'
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
  createSQRT2,
  createSQRTHalf,
  createTau,
  createTrue,
  createVersion
} from './constants'

export { create } from './core/core'

// FIXME: fill math and mathWithTransform
const math = {}
const mathWithTransform = {}

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

const config = { ...DEFAULT_CONFIG }

// class (1)
export const ResultSet = createResultSet()
export const BigNumber = createBigNumberClass({ config })
export const Complex = createComplexClass({ config })
export const Fraction = createFractionClass()
export const Range = createRangeClass()
export const Matrix = createMatrixClass()
export const DenseMatrix = createDenseMatrixClass({ type: { Matrix } })

export const typed = createTyped({
  BigNumber,
  Complex,
  Fraction,
  DenseMatrix
})

// utils (1)
export const clone = createClone({ typed })
export const isInteger = createIsInteger({ typed })
export const isNegative = createIsNegative({ typed })
export const isNumeric = createIsNumeric({ typed })
export const isPositive = createIsPositive({ typed })
export const isZero = createIsZero({ typed })
export const isNaN = createIsNaN({ typed })
export const typeOf = createTypeOf({ typed })

// relational (1)
export const equalScalar = createEqualScalar({ typed, config })

// create (1)
export const number = createNumber({ typed })
export const string = createString({ typed })
export const boolean = createBoolean({ typed })
export const bignumber = createBignumber({ typed, type: { BigNumber } })
export const complex = createComplex({ typed, type: { Complex } })
export const fraction = createFraction({ typed, type: { Fraction } })
export const matrix = createMatrix({ typed, type: { Matrix } })
export const splitUnit = createSplitUnit({ typed })

// arithmetic (1)
export const unaryMinus = createUnaryMinus({ typed })
export const unaryPlus = createUnaryPlus({ typed, config, type: { BigNumber } })
export const abs = createAbs({ typed })
export const addScalar = createAddScalar({ typed })
export const cbrt = createCbrt({ config, typed, isNegative, unaryMinus, matrix, type: { Complex, BigNumber, Fraction } })
export const ceil = createCeil({ typed })
export const cube = createCube({ typed })
export const exp = createExp({ typed })
export const expm1 = createExpm1({ typed, type: { Complex } })
export const fix = createFix({ typed, type: { Complex } })
export const floor = createFloor({ typed })
export const gcd = createGcd({ typed, matrix, equalScalar, type: { BigNumber, DenseMatrix } })
export const lcm = createLcm({ typed, matrix, equalScalar })
export const log10 = createLog10({ typed, config, type: { Complex } })
export const log2 = createLog2({ typed, config, type: { Complex } })
export const mod = createMod({ typed, matrix, equalScalar, type: { DenseMatrix } })
export const multiplyScalar = createMultiplyScalar({ typed })
export const multiply = createMultiply({ typed, matrix, addScalar, multiplyScalar, equalScalar })
export const nthRoot = createNthRoot({ typed, matrix, equalScalar, type: { BigNumber } })
export const sign = createSign({ typed, type: { BigNumber, Fraction } })
export const sqrt = createSqrt({ config, typed, type: { Complex } })
export const square = createSquare({ typed })
export const subtract = createSubtract({ typed, matrix, equalScalar, addScalar, unaryMinus, type: { DenseMatrix } })
export const xgcd = createXgcd({ typed, config, matrix, type: { BigNumber } })
export const dotMultiply = createDotMultiply({ typed, matrix, equalScalar, multiplyScalar })

// bitwise (1)
export const bitAnd = createBitAnd({ typed, matrix, equalScalar })
export const bitNot = createBitNot({ typed })
export const bitOr = createBitOr({ typed, matrix, equalScalar, type: { DenseMatrix } })
export const bitXor = createBitXor({ typed, matrix, type: { DenseMatrix } })

// complex (1)
export const arg = createArg({ typed, type: { BigNumber } })
export const conj = createConj({ typed })
export const im = createIm({ typed })
export const re = createRe({ typed })

// logical (1)
export const not = createNot({ typed })
export const or = createOr({ typed, matrix, equalScalar, type: { DenseMatrix } })
export const xor = createXor({ typed, matrix, type: { DenseMatrix } })

// matrix (1)
export const concat = createConcat({ typed, matrix, isInteger })
export const cross = createCross({ typed, matrix, subtract, multiply })
export const diag = createDiag({ typed, matrix, type: { Matrix } })
export const eye = createEye({ typed, matrix })
export const filter = createFilter({ typed, matrix })
export const flatten = createFlatten({ typed, matrix })
export const forEach = createForEach({ typed })
export const getMatrixDataType = createGetMatrixDataType({ typed })
export const identity = createIdentity({ typed, config, matrix, type: { BigNumber, Matrix } })
export const kron = createKron({ typed, matrix, multiplyScalar })
export const map = createMap({ typed })
export const ones = createOnes({ typed, config, matrix, type: { BigNumber } })
export const range = createRange({ typed, config, matrix, type: { BigNumber } })
export const reshape = createReshape({ typed, isInteger, matrix })
export const resize = createResize({ config, matrix })
export const size = createSize({ typed, config, matrix })
export const squeeze = createSqueeze({ typed, matrix })
export const subset = createSubset({ typed, matrix })
export const transpose = createTranspose({ typed, matrix })
export const ctranspose = createCtranspose({ typed, transpose, conj })
export const zeros = createZeros({ typed, config, matrix, type: { BigNumber } })

// special (1)
export const erf = createErf({ typed, type: { BigNumber } })

// statistics (1)
export const mode = createMode({ typed, isNaN, isNumeric })
export const prod = createProd({ typed, multiply })

// string (1)
export const format = createFormat({ typed })
export const print = createPrint({ typed })

// unit (1)
export const to = createTo({ typed, matrix })

// utils (2)
export const isPrime = createIsPrime({ typed, type: { BigNumber } })
export const numeric = createNumeric({ typed, number, bignumber, fraction })

// arithmetic (2)
export const divideScalar = createDivideScalar({ typed, numeric })
export const pow = createPow({ typed, config, identity, multiply, matrix, number, fraction, type: { Complex } })
export const round = createRound({ typed, matrix, equalScalar, zeros, type: { BigNumber, DenseMatrix } })
export const log = createLog({ typed, config, divideScalar, type: { Complex } })
export const log1p = createLog1p({ typed, config, divideScalar, log, type: { Complex } })
export const nthRoots = createNthRoots({ typed, config, divideScalar, type: { Complex } })
export const dotPow = createDotPow({ typed, equalScalar, matrix, pow, type: { DenseMatrix } })
export const dotDivide = createDotDivide({ typed, matrix, equalScalar, divideScalar, type: { DenseMatrix } })

// algebra (2)
export const lsolve = createLsolve({ typed, matrix, divideScalar, multiplyScalar, subtract, equalScalar, type: { DenseMatrix } })
export const usolve = createUsolve({ typed, matrix, divideScalar, multiplyScalar, subtract, equalScalar, type: { DenseMatrix } })

// bitwise (2)
export const leftShift = createLeftShift({ typed, matrix, equalScalar, zeros, type: { DenseMatrix } })
export const rightArithShift = createRightArithShift({ typed, matrix, equalScalar, zeros, type: { DenseMatrix } })
export const rightLogShift = createRightLogShift({ typed, matrix, equalScalar, zeros, type: { DenseMatrix } })

// logical (2)
export const and = createAnd({ typed, matrix, equalScalar, zeros, not })

// relational (2)
export const compare = createCompare({ typed, config, equalScalar, matrix, type: { BigNumber, Fraction, DenseMatrix } })
export const compareNatural = createCompareNatural({ typed, compare })
export const compareText = createCompareText({ typed, config, matrix })
export const equal = createEqual({ typed, matrix, equalScalar, type: { DenseMatrix } })
export const equalText = createEqualText({ typed, compareText, isZero })
export const smaller = createSmaller({ typed, config, matrix, equalScalar, divideScalar, type: { DenseMatrix } })
export const smallerEq = createSmallerEq({ typed, config, matrix, type: { DenseMatrix } })
export const larger = createLarger({ typed, config, matrix, type: { DenseMatrix } })
export const largerEq = createLargerEq({ typed, config, matrix, type: { DenseMatrix } })
export const deepEqual = createDeepEqual({ typed, equal })
export const unequal = createUnequal({ typed, config, matrix, type: { DenseMatrix } })

// matrix (2)
export const partitionSelect = createPartitionSelect({ typed, isNumeric, isNaN, compare })
export const sort = createSort({ typed, matrix, compare, compareNatural })

// statistics (2)
export const max = createMax({ typed, larger })
export const min = createMin({ typed, smaller })

// class (2)
export const SparseMatrix = createSparseMatrixClass({ typed, equalScalar, type: { Matrix } })
export const ImmutableDenseMatrix = createImmutableDenseMatrixClass({ smaller, type: { DenseMatrix } })
export const Index = createIndexClass({ type: { ImmutableDenseMatrix } })
export const FibonacciHeap = createFibonacciHeapClass({ smaller, larger })
export const Spa = createSpaClass({ addScalar, equalScalar, type: { FibonacciHeap } })
export const Unit = createUnitClass({
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
  type: { Complex, BigNumber, Fraction }
})

// create (2)
export const sparse = createSparse({ typed, type: { SparseMatrix } })
export const unit = _createUnit({ typed, type: { Unit } })
export const createUnit = createCreateUnit({ typed, type: { Unit } })

// trigonometry (2)
export const acos = createAcos({ typed, config, type: { Complex } })
export const acosh = createAcosh({ typed, config, type: { Complex } })
export const acot = createAcot({ typed, type: { BigNumber } })
export const acoth = createAcoth({ typed, config, type: { Complex, BigNumber } })
export const acsc = createAcsc({ typed, config, type: { Complex, BigNumber } })
export const acsch = createAcsch({ typed, type: { BigNumber } })
export const asec = createAsec({ typed, config, type: { Complex, BigNumber } })
export const asech = createAsech({ typed, config, type: { Complex, BigNumber } })
export const asin = createAsin({ typed, config, type: { Complex } })
export const asinh = createAsinh({ typed })
export const atan = createAtan({ typed })
export const atan2 = createAtan2({ typed, matrix, equalScalar, type: { BigNumber, DenseMatrix } })
export const atanh = createAtanh({ typed, config, type: { Complex } })
export const cos = createCos({ typed, type: { Unit } })
export const cosh = createCosh({ typed, type: { Unit } })
export const cot = createCot({ typed, type: { BigNumber, Unit } })
export const coth = createCoth({ typed, type: { BigNumber, Unit } })
export const csc = createCsc({ typed, type: { BigNumber, Unit } })
export const csch = createCsch({ typed, type: { BigNumber, Unit } })
export const sec = createSec({ typed, type: { BigNumber, Unit } })
export const sech = createSech({ typed, type: { BigNumber, Unit } })
export const sin = createSin({ typed, type: { BigNumber, Unit } })
export const sinh = createSinh({ typed, type: { Unit } })
export const tan = createTan({ typed, type: { Unit } })
export const tanh = createTanh({ typed, type: { Unit } })

// set (2)
export const setCartesian = createSetCartesian({ typed, size, subset, compareNatural, type: { Index, DenseMatrix } })
export const setDifference = createSetDifference({ typed, size, subset, compareNatural, type: { Index, DenseMatrix } })
export const setDistinct = createSetDistinct({ typed, size, subset, compareNatural, type: { Index, DenseMatrix } })
export const setIntersect = createSetIntersect({ typed, size, subset, compareNatural, type: { Index, DenseMatrix } })
export const setIsSubset = createSetIsSubset({ typed, size, subset, compareNatural, type: { Index } })
export const setMultiplicity = createSetMultiplicity({ typed, size, subset, compareNatural, type: { Index } })
export const setPowerset = createSetPowerset({ typed, size, subset, compareNatural, type: { Index } })
export const setSize = createSetSize({ typed, compareNatural })
export const setSymDifference = createSetSymDifference({ typed, size, concat, subset, setDifference, type: { Index } })
export const setUnion = createSetUnion({ typed, size, concat, subset, setIntersect, setSymDifference, type: { Index } })

// arithmetic (3)
export const add = createAdd({ typed, matrix, addScalar, equalScalar, type: { DenseMatrix, SparseMatrix } })
export const hypot = createHypot({ typed, abs, addScalar, divideScalar, multiplyScalar, sqrt, smaller, isPositive })
export const norm = createNorm({ typed, abs, add, pow, conj, sqrt, multiply, equalScalar, larger, smaller, matrix })

// matrix (3)
export const dot = createDot({ typed, add, multiply })
export const trace = createTrace({ typed, matrix, add })
export const index = createIndex({ typed, type: { Index } })

// expression (3)
export const Node = createNode({ expression: { mathWithTransform } })
export const AccessorNode = createAccessorNode({ subset, expression: { node: { Node } } })
export const ArrayNode = createArrayNode({ expression: { node: { Node } } })
export const AssignmentNode = createAssignmentNode({ subset, matrix, expression: { node: { Node } } })
export const BlockNode = createBlockNode({ type: { ResultSet }, expression: { node: { Node } } })
export const ConditionalNode = createConditionalNode({ expression: { node: { Node } } })
export const ConstantNode = createConstantNode({ expression: { node: { Node } } })
export const FunctionAssignmentNode = createFunctionAssignmentNode({ typed, expression: { node: { Node } } })
export const IndexNode = createIndexNode({ type: { Range }, expression: { node: { Node } } })
export const ObjectNode = createObjectNode({ expression: { node: { Node } } })
export const OperatorNode = createOperatorNode({ expression: { node: { Node } } })
export const ParenthesisNode = createParenthesisNode({ expression: { node: { Node } } })
export const RangeNode = createRangeNode({ expression: { node: { Node } } })
export const RelationalNode = createRelationalNode({ expression: { node: { Node } } })
export const SymbolNode = createSymbolNode({ math, type: { Unit }, expression: { node: { Node } } })
export const FunctionNode = createFunctionNode({ math, expression: { node: { Node, SymbolNode } } })
const parseExpression = createParseExpression({
  numeric,
  config,
  expression: {
    node: {
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
    }
  }
})
export const parse = createParse({ typed, expression: { parse: parseExpression } })
export const compile = createCompile({ typed, expression: { parse: parseExpression } })
export const evaluate = createEval({ typed, expression: { parse: parseExpression } })
export const Parser = createParserClass({ expression: { parse: parseExpression } })

// create (3)
export const parser = createParser({ typed, math, expression: { Parser } })

// algebra (3)
export const lup = createLup({
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
  type: { DenseMatrix, SparseMatrix, Spa }
})
export const qr = createQr({
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
export const slu = createSlu({ typed, abs, add, multiply, transpose, divideScalar, subtract, larger, largerEq, type: { SparseMatrix } })
export const lusolve = createLusolve({ typed, matrix, lup, slu, usolve, lsolve, type: { DenseMatrix } })

// class (3)
// TODO: do we want to export Chain and Help? or not here?
// export const Help = createHelpClass({ expression: { parse: parseExpression } })
// export const Chain = createChainClass({ on, math: math })

// type (3)
// export const help = createHelp({ typed, math: math, expression: { docs }, type: { Help } })
// export const chain = createChain({ typed, type: { Chain } })

// matrix (4)
export const det = createDet({ typed, matrix, subtract, multiply, unaryMinus, lup })
export const inv = createInv({ typed, matrix, divideScalar, addScalar, multiply, unaryMinus, det, identity, abs })
export const expm = createExpm({ typed, abs, add, identity, inv, multiply })
export const sqrtm = createSqrtm({ typed, abs, add, multiply, sqrt, subtract, inv, size, max, identity })

// arithmetic (4)
export const divide = createDivide({ typed, matrix, multiply, equalScalar, divideScalar, inv })

// geometry (4)
export const distance = createDistance({ typed, addScalar, subtract, multiplyScalar, divideScalar, unaryMinus, sqrt, abs })
export const intersect = createIntersect({ typed, config, abs, add, addScalar, matrix, multiply, multiplyScalar, divideScalar, subtract, smaller, equalScalar })

// statistics (4)
export const sum = createSum({ typed, config, add, type: { BigNumber, Fraction } })
export const mean = createMean({ typed, add, divide })
export const median = createMedian({ typed, add, divide, compare, partitionSelect })
export const mad = createMad({ typed, abs, map, median, subtract })
export const variance = createVariance({ typed, add, subtract, multiply, divide, isNaN })
export const quantileSeq = createQuantileSeq({ typed, add, multiply, partitionSelect, compare, type: { BigNumber } })
export const std = createStd({ typed, sqrt, variance })

// probability (4)
const distribution = createDistribution({ typed, matrix, config })
export const combinations = createCombinations({ typed, type: { BigNumber } })
export const gamma = createGamma({ typed, config, multiplyScalar, pow, type: { BigNumber, Complex } })
export const factorial = createFactorial({ typed, gamma })
export const kldivergence = createKldivergence({ typed, matrix, divide, sum, multiply, dotDivide, log, isNumeric })
export const multinomial = createMultinomial({ typed, add, divide, multiply, factorial, isInteger, isPositive })
export const permutations = createPermutations({ typed, factorial })
export const pickRandom = createPickRandom({ distribution })
export const random = createRandom({ distribution })
export const randomInt = createRandomInt({ distribution })

// combinatorics (4)
export const stirlingS2 = createStirlingS2({ typed, addScalar, subtract, multiplyScalar, divideScalar, pow, factorial, combinations, isNegative, isInteger, larger })
export const bellNumbers = createBellNumbers({ typed, addScalar, isNegative, isInteger, stirlingS2 })
export const catalan = createCatalan({ typed, addScalar, divideScalar, multiplyScalar, combinations, isNegative, isInteger })
export const composition = createComposition({ typed, addScalar, combinations, isPositive, isNegative, isInteger, larger })

// algebra (4)
const simplifyCore = createSimplifyCore({
  equal,
  isZero,
  add,
  subtract,
  multiply,
  divide,
  pow,
  expression: {
    node: {
      ConstantNode,
      OperatorNode,
      FunctionNode,
      ParenthesisNode
    }
  }
})
const simplifyConstant = createSimplifyConstant({
  typed,
  config,
  math,
  fraction,
  bignumber,
  expression: {
    node: {
      ConstantNode,
      OperatorNode,
      FunctionNode,
      SymbolNode
    }
  }
})
const resolve = createResolve({ expression: { parse, node: { Node, FunctionNode, OperatorNode, ParenthesisNode } } })
export const simplify = createSimplify({
  typed,
  parse,
  equal,
  algebra: {
    simplify: {
      simplifyConstant,
      simplifyCore,
      resolve
    }
  },
  expression: {
    node: {
      ConstantNode,
      FunctionNode,
      OperatorNode,
      ParenthesisNode,
      SymbolNode
    }
  }
})
export const derivative = createDerivative({
  typed,
  config,
  parse,
  simplify,
  equal,
  isZero,
  numeric,
  expression: {
    node: {
      ConstantNode,
      FunctionNode,
      OperatorNode,
      ParenthesisNode,
      SymbolNode
    }
  }
})
export const rationalize = createRationalize({
  typed,
  parse,
  simplify,
  algebra: {
    simplify: {
      simplifyConstant,
      simplifyCore
    }
  },
  expression: {
    node: {
      ConstantNode,
      OperatorNode,
      SymbolNode
    }
  }
})

export const json = {
  reviver: createReviver({
    type: {
      BigNumber,
      // Chain, // TODO
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
      Unit
      // Help // TODO
    },
    expression: {
      node: {
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
      }
    }
  })
}

// constants
const constantsDependencies = { config, type: { BigNumber } }
export const _true = createTrue()
export const _false = createFalse()
export const _null = createNull()
export const _Infinity = createInfinity(constantsDependencies)
export const _NaN = createNaN(constantsDependencies)
export const pi = createPi(constantsDependencies)
export const PI = pi
export const tau = createTau(constantsDependencies)
export const e = createE(constantsDependencies)
export const E = e
export const phi = createPhi(constantsDependencies)
export const LN2 = createLN2(constantsDependencies)
export const LN10 = createLN10(constantsDependencies)
export const LOG2E = createLOG2E(constantsDependencies)
export const LOG10E = createLOG10E(constantsDependencies)
export const SQRT1_2 = createSQRTHalf(constantsDependencies)
export const SQRT2 = createSQRT2(constantsDependencies)
export const i = createI({ config, type: { Complex } })
export const version = createVersion()

export const expression = {
  docs: createEmbeddedDocs()
}

// error classes
export { IndexError } from './error/IndexError'
export { DimensionError } from './error/DimensionError'
export { ArgumentsError } from './error/ArgumentsError'

// TODO: export constants
// TODO: export physical constants
