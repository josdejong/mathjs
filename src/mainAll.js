import { create as _create } from './core/core'
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
import { createChainClass } from './type/chain/Chain'
import { createChain } from './type/chain/function/chain'
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

import { createHelpClass } from './expression/Help'
import { createHelp } from './expression/function/help'
import { createCreateUnit } from './type/unit/function/createUnit'
import { createSplitUnit } from './type/unit/function/splitUnit'
import { createEmbeddedDocs } from './expression/embeddedDocs'
import { IndexError } from './error/IndexError'
import { DimensionError } from './error/DimensionError'
import { ArgumentsError } from './error/ArgumentsError'
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
import {
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
  isString,
  isSymbolNode,
  isUndefined,
  isUnit
} from './utils/is'
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
import { createConcatTransform } from './expression/transform/concat.transform'
import { createFilterTransform } from './expression/transform/filter.transform'
import { createForEachTransform } from './expression/transform/forEach.transform'
import { createIndexTransform } from './expression/transform/index.transform'
import { createMapTransform } from './expression/transform/map.transform'
import { createMaxTransform } from './expression/transform/max.transform'
import { createMeanTransform } from './expression/transform/mean.transform'
import { createMinTransform } from './expression/transform/min.transform'
import { createRangeTransform } from './expression/transform/range.transform'
import { createSubsetTransform } from './expression/transform/subset.transform'

export { create as createCore } from './core/core'

// minimal math instance used for individual exports
const mathCore = _create()

export const typed = mathCore.typed
export const create = mathCore.create
export const config = mathCore.config
export const on = mathCore.on
export const off = mathCore.off
export const emit = mathCore.emit
export const once = mathCore.once

// full math instance used for parse, evaluate, etc.
const math = Object.assign({}, mathCore)
const transform = {}
const mathWithTransform = {}

const docs = createEmbeddedDocs()

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

// class (1)
export const ResultSet = createResultSet()
export const BigNumber = createBigNumberClass({ config, on })
export const Complex = createComplexClass({ typed, config, on })
export const Fraction = createFractionClass()
export const Range = createRangeClass()
export const Matrix = createMatrixClass()
export const DenseMatrix = createDenseMatrixClass({ typed, type: { Matrix } })
export const SparseMatrix = createSparseMatrixClass({ typed, equalScalar, type: { Matrix } })

// create (1)
export const number = createNumber({ typed })
export const string = createString({ typed })
export const boolean = createBoolean({ typed })
export const bignumber = createBignumber({ typed, type: { BigNumber } })
export const complex = createComplex({ typed, type: { Complex } })
export const fraction = createFraction({ typed, type: { Fraction } })
export const matrix = createMatrix({ typed, type: { Matrix } })
export const sparse = createSparse({ typed, type: { SparseMatrix } })
export const splitUnit = createSplitUnit({ typed })

// arithmetic (1)
export const unaryMinus = createUnaryMinus({ typed })
export const unaryPlus = createUnaryPlus({ typed, config, type: { BigNumber } })
export const abs = createAbs({ typed })
export const addScalar = createAddScalar({ typed })
export const add = createAdd({ typed, matrix, addScalar, equalScalar, type: { DenseMatrix, SparseMatrix } })
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
export const dot = createDot({ typed, add, multiply })
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
export const trace = createTrace({ typed, matrix, add })
export const transpose = createTranspose({ typed, matrix })
export const ctranspose = createCtranspose({ typed, transpose, conj })
export const zeros = createZeros({ typed, config, matrix, type: { BigNumber } })

// special (1)
export const erf = createErf({ typed, type: { BigNumber } })

// statistics (1)
export const mode = createMode({ typed, isNaN, isNumeric })
export const prod = createProd({ typed, multiply })
export const sum = createSum({ typed, config, add, type: { BigNumber, Fraction } })

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
export const quantileSeq = createQuantileSeq({ typed, add, multiply, partitionSelect, compare, type: { BigNumber } })

// class (2)
export const ImmutableDenseMatrix = createImmutableDenseMatrixClass({ smaller, type: { DenseMatrix } })
export const Index = createIndexClass({ type: { ImmutableDenseMatrix } })
export const FibonacciHeap = createFibonacciHeapClass({ smaller, larger })
export const Spa = createSpaClass({ addScalar, equalScalar, type: { FibonacciHeap } })
export const Unit = createUnitClass({
  config,
  on,
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
export const hypot = createHypot({ typed, abs, addScalar, divideScalar, multiplyScalar, sqrt, smaller, isPositive })
export const norm = createNorm({ typed, abs, add, pow, conj, sqrt, multiply, equalScalar, larger, smaller, matrix })

// matrix (3)
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
export const Help = createHelpClass({ expression: { parse: parseExpression } })
export const Chain = createChainClass({ on, math: math })

// type (3)
export const help = createHelp({ typed, math: math, expression: { docs }, type: { Help } })
export const chain = createChain({ typed, type: { Chain } })

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

// probability (4)
const distribution = createDistribution({ typed, matrix, on, config })
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

// statistics (4)
export const mean = createMean({ typed, add, divide })
export const median = createMedian({ typed, add, divide, compare, partitionSelect })
export const mad = createMad({ typed, abs, map, median, subtract })
export const variance = createVariance({ typed, add, subtract, multiply, divide, isNaN })
export const std = createStd({ typed, sqrt, variance })

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
  math,
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

// error classes
export { IndexError } from './error/IndexError'
export { DimensionError } from './error/DimensionError'
export { ArgumentsError } from './error/ArgumentsError'

// TODO: export constants
// TODO: export physical constants

// export for backward compatibility
export const type = {
  isNumber,
  isComplex,
  isBigNumber,
  isFraction,
  isUnit,
  isString,
  isArray,
  isMatrix,
  isDenseMatrix,
  isSparseMatrix,
  isRange,
  isIndex,
  isBoolean,
  isResultSet,
  isHelp,
  isFunction,
  isDate,
  isRegExp,
  isObject,
  isNull,
  isUndefined,
  isAccessorNode,
  isArrayNode,
  isAssignmentNode,
  isBlockNode,
  isConditionalNode,
  isConstantNode,
  isFunctionAssignmentNode,
  isFunctionNode,
  isIndexNode,
  isNode,
  isObjectNode,
  isOperatorNode,
  isParenthesisNode,
  isRangeNode,
  isSymbolNode,
  isChain,
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
}

// export for backward compatibility
export const expression = {
  docs,
  transform,
  mathWithTransform,
  node: {
    AccessorNode,
    ArrayNode,
    AssignmentNode,
    BlockNode,
    ConditionalNode,
    ConstantNode,
    IndexNode,
    FunctionAssignmentNode,
    FunctionNode,
    Node,
    ObjectNode,
    OperatorNode,
    ParenthesisNode,
    RangeNode,
    RelationalNode,
    SymbolNode
  },
  parse: parseExpression,
  Parser
}

// export for backward compatibility
export const error = {
  ArgumentsError,
  DimensionError,
  IndexError
}

// add all functions to the math namespace
math.clone = clone
math.isInteger = isInteger
math.isNegative = isNegative
math.isNumeric = isNumeric
math.isPositive = isPositive
math.isZero = isZero
math.isNaN = isNaN
math.typeOf = typeOf
math.equalScalar = equalScalar
math.ResultSet = ResultSet
math.BigNumber = BigNumber
math.Complex = Complex
math.Fraction = Fraction
math.Range = Range
math.Matrix = Matrix
math.DenseMatrix = DenseMatrix
math.SparseMatrix = SparseMatrix
math.number = number
math.string = string
math.boolean = boolean
math.bignumber = bignumber
math.complex = complex
math.fraction = fraction
math.matrix = matrix
math.sparse = sparse
math.splitUnit = splitUnit
math.unaryMinus = unaryMinus
math.unaryPlus = unaryPlus
math.abs = abs
math.addScalar = addScalar
math.add = add
math.cbrt = cbrt
math.ceil = ceil
math.cube = cube
math.exp = exp
math.expm1 = expm1
math.fix = fix
math.floor = floor
math.gcd = gcd
math.lcm = lcm
math.log10 = log10
math.log2 = log2
math.mod = mod
math.multiplyScalar = multiplyScalar
math.multiply = multiply
math.nthRoot = nthRoot
math.sign = sign
math.sqrt = sqrt
math.square = square
math.subtract = subtract
math.xgcd = xgcd
math.dotMultiply = dotMultiply
math.bitAnd = bitAnd
math.bitNot = bitNot
math.bitOr = bitOr
math.bitXor = bitXor
math.arg = arg
math.conj = conj
math.im = im
math.re = re
math.not = not
math.or = or
math.xor = xor
math.concat = concat
math.cross = cross
math.diag = diag
math.dot = dot
math.eye = eye
math.filter = filter
math.flatten = flatten
math.forEach = forEach
math.getMatrixDataType = getMatrixDataType
math.identity = identity
math.kron = kron
math.map = map
math.ones = ones
math.range = range
math.reshape = reshape
math.resize = resize
math.size = size
math.squeeze = squeeze
math.subset = subset
math.trace = trace
math.transpose = transpose
math.ctranspose = ctranspose
math.zeros = zeros
math.erf = erf
math.mode = mode
math.prod = prod
math.sum = sum
math.format = format
math.print = print
math.to = to
math.isPrime = isPrime
math.numeric = numeric
math.divideScalar = divideScalar
math.pow = pow
math.round = round
math.log = log
math.log1p = log1p
math.nthRoots = nthRoots
math.dotPow = dotPow
math.dotDivide = dotDivide
math.lsolve = lsolve
math.usolve = usolve
math.leftShift = leftShift
math.rightArithShift = rightArithShift
math.rightLogShift = rightLogShift
math.and = and
math.compare = compare
math.compareNatural = compareNatural
math.compareText = compareText
math.equal = equal
math.equalText = equalText
math.smaller = smaller
math.smallerEq = smallerEq
math.larger = larger
math.largerEq = largerEq
math.deepEqual = deepEqual
math.unequal = unequal
math.partitionSelect = partitionSelect
math.sort = sort
math.max = max
math.min = min
math.quantileSeq = quantileSeq
math.ImmutableDenseMatrix = ImmutableDenseMatrix
math.Index = Index
math.FibonacciHeap = FibonacciHeap
math.Spa = Spa
math.Unit = Unit
math.unit = unit
math.createUnit = createUnit
math.acos = acos
math.acosh = acosh
math.acot = acot
math.acoth = acoth
math.acsc = acsc
math.acsch = acsch
math.asec = asec
math.asech = asech
math.asin = asin
math.asinh = asinh
math.atan = atan
math.atan2 = atan2
math.atanh = atanh
math.cos = cos
math.cosh = cosh
math.cot = cot
math.coth = coth
math.csc = csc
math.csch = csch
math.sec = sec
math.sech = sech
math.sin = sin
math.sinh = sinh
math.tan = tan
math.tanh = tanh
math.setCartesian = setCartesian
math.setDifference = setDifference
math.setDistinct = setDistinct
math.setIntersect = setIntersect
math.setIsSubset = setIsSubset
math.setMultiplicity = setMultiplicity
math.setPowerset = setPowerset
math.setSize = setSize
math.setSymDifference = setSymDifference
math.setUnion = setUnion
math.hypot = hypot
math.norm = norm
math.index = index
math.Node = Node
math.AccessorNode = AccessorNode
math.ArrayNode = ArrayNode
math.AssignmentNode = AssignmentNode
math.BlockNode = BlockNode
math.ConditionalNode = ConditionalNode
math.ConstantNode = ConstantNode
math.FunctionAssignmentNode = FunctionAssignmentNode
math.IndexNode = IndexNode
math.ObjectNode = ObjectNode
math.OperatorNode = OperatorNode
math.ParenthesisNode = ParenthesisNode
math.RangeNode = RangeNode
math.RelationalNode = RelationalNode
math.SymbolNode = SymbolNode
math.FunctionNode = FunctionNode
math.parse = parse
math.compile = compile
math.evaluate = evaluate
math['eval'] = evaluate // For backward compatibility with v5
math.Parser = Parser
math.parser = parser
math.lup = lup
math.qr = qr
math.slu = slu
math.lusolve = lusolve
math.Help = Help
math.Chain = Chain
math.help = help
math.chain = chain
math.det = det
math.inv = inv
math.expm = expm
math.sqrtm = sqrtm
math.divide = divide
math.distance = distance
math.intersect = intersect
math.combinations = combinations
math.gamma = gamma
math.factorial = factorial
math.kldivergence = kldivergence
math.multinomial = multinomial
math.permutations = permutations
math.pickRandom = pickRandom
math.random = random
math.randomInt = randomInt
math.stirlingS2 = stirlingS2
math.bellNumbers = bellNumbers
math.catalan = catalan
math.composition = composition
math.mean = mean
math.median = median
math.mad = mad
math.variance = variance
math['var'] = variance // For backward compatibility with v5
math.std = std
math.simplify = simplify
math.derivative = derivative
math.rationalize = rationalize
math.json = json
math.expression = expression
math.error = error
math.createCore = _create
math.isAccessorNode = isAccessorNode
math.isArray = isArray
math.isArrayNode = isArrayNode
math.isAssignmentNode = isAssignmentNode
math.isBigNumber = isBigNumber
math.isBlockNode = isBlockNode
math.isBoolean = isBoolean
math.isChain = isChain
math.isComplex = isComplex
math.isConditionalNode = isConditionalNode
math.isConstantNode = isConstantNode
math.isDate = isDate
math.isDenseMatrix = isDenseMatrix
math.isFraction = isFraction
math.isFunction = isFunction
math.isFunctionAssignmentNode = isFunctionAssignmentNode
math.isFunctionNode = isFunctionNode
math.isHelp = isHelp
math.isIndex = isIndex
math.isIndexNode = isIndexNode
math.isMatrix = isMatrix
math.isNode = isNode
math.isNull = isNull
math.isNumber = isNumber
math.isObject = isObject
math.isObjectNode = isObjectNode
math.isOperatorNode = isOperatorNode
math.isParenthesisNode = isParenthesisNode
math.isRange = isRange
math.isRangeNode = isRangeNode
math.isRegExp = isRegExp
math.isResultSet = isResultSet
math.isSparseMatrix = isSparseMatrix
math.isSymbolNode = isSymbolNode
math.isUnit = isUnit
math.IndexError = IndexError
math.DimensionError = DimensionError
math.ArgumentsError = ArgumentsError

// add all transform functions
transform.concat = createConcatTransform({ typed, concat })
transform.filter = createFilterTransform({ typed, matrix })
transform.forEach = createForEachTransform({ typed })
transform.index = createIndexTransform({ type: { Index } })
transform.map = createMapTransform({ typed, matrix })
transform.max = createMaxTransform({ typed, max })
transform.mean = createMeanTransform({ typed, mean })
transform.min = createMinTransform({ typed, min })
transform.range = createRangeTransform({ typed, range })
transform.subset = createSubsetTransform({ typed, subset })

// add all functions to the mathWithTransform namespace
// FIXME: remove non-allowed functions and objects
mathWithTransform.clone = clone
mathWithTransform.isInteger = isInteger
mathWithTransform.isNegative = isNegative
mathWithTransform.isNumeric = isNumeric
mathWithTransform.isPositive = isPositive
mathWithTransform.isZero = isZero
mathWithTransform.isNaN = isNaN
mathWithTransform.typeOf = typeOf
mathWithTransform.equalScalar = equalScalar
mathWithTransform.number = number
mathWithTransform.string = string
mathWithTransform.boolean = boolean
mathWithTransform.bignumber = bignumber
mathWithTransform.complex = complex
mathWithTransform.fraction = fraction
mathWithTransform.matrix = matrix
mathWithTransform.sparse = sparse
mathWithTransform.splitUnit = splitUnit
mathWithTransform.unaryMinus = unaryMinus
mathWithTransform.unaryPlus = unaryPlus
mathWithTransform.abs = abs
mathWithTransform.addScalar = addScalar
mathWithTransform.add = add
mathWithTransform.cbrt = cbrt
mathWithTransform.ceil = ceil
mathWithTransform.cube = cube
mathWithTransform.exp = exp
mathWithTransform.expm1 = expm1
mathWithTransform.fix = fix
mathWithTransform.floor = floor
mathWithTransform.gcd = gcd
mathWithTransform.lcm = lcm
mathWithTransform.log10 = log10
mathWithTransform.log2 = log2
mathWithTransform.mod = mod
mathWithTransform.multiplyScalar = multiplyScalar
mathWithTransform.multiply = multiply
mathWithTransform.nthRoot = nthRoot
mathWithTransform.sign = sign
mathWithTransform.sqrt = sqrt
mathWithTransform.square = square
mathWithTransform.subtract = subtract
mathWithTransform.xgcd = xgcd
mathWithTransform.dotMultiply = dotMultiply
mathWithTransform.bitAnd = bitAnd
mathWithTransform.bitNot = bitNot
mathWithTransform.bitOr = bitOr
mathWithTransform.bitXor = bitXor
mathWithTransform.arg = arg
mathWithTransform.conj = conj
mathWithTransform.im = im
mathWithTransform.re = re
mathWithTransform.not = not
mathWithTransform.or = or
mathWithTransform.xor = xor
mathWithTransform.concat = transform.concat
mathWithTransform.cross = cross
mathWithTransform.diag = diag
mathWithTransform.dot = dot
mathWithTransform.eye = eye
mathWithTransform.filter = transform.filter
mathWithTransform.flatten = flatten
mathWithTransform.forEach = transform.forEach
mathWithTransform.getMatrixDataType = getMatrixDataType
mathWithTransform.identity = identity
mathWithTransform.kron = kron
mathWithTransform.map = transform.map
mathWithTransform.ones = ones
mathWithTransform.range = transform.range
mathWithTransform.reshape = reshape
mathWithTransform.resize = resize
mathWithTransform.size = size
mathWithTransform.squeeze = squeeze
mathWithTransform.subset = transform.subset
mathWithTransform.trace = trace
mathWithTransform.transpose = transpose
mathWithTransform.ctranspose = ctranspose
mathWithTransform.zeros = zeros
mathWithTransform.erf = erf
mathWithTransform.mode = mode
mathWithTransform.prod = prod
mathWithTransform.sum = sum
mathWithTransform.format = format
mathWithTransform.print = print
mathWithTransform.to = to
mathWithTransform.isPrime = isPrime
mathWithTransform.numeric = numeric
mathWithTransform.divideScalar = divideScalar
mathWithTransform.pow = pow
mathWithTransform.round = round
mathWithTransform.log = log
mathWithTransform.log1p = log1p
mathWithTransform.nthRoots = nthRoots
mathWithTransform.dotPow = dotPow
mathWithTransform.dotDivide = dotDivide
mathWithTransform.lsolve = lsolve
mathWithTransform.usolve = usolve
mathWithTransform.leftShift = leftShift
mathWithTransform.rightArithShift = rightArithShift
mathWithTransform.rightLogShift = rightLogShift
mathWithTransform.and = and
mathWithTransform.compare = compare
mathWithTransform.compareNatural = compareNatural
mathWithTransform.compareText = compareText
mathWithTransform.equal = equal
mathWithTransform.equalText = equalText
mathWithTransform.smaller = smaller
mathWithTransform.smallerEq = smallerEq
mathWithTransform.larger = larger
mathWithTransform.largerEq = largerEq
mathWithTransform.deepEqual = deepEqual
mathWithTransform.unequal = unequal
mathWithTransform.partitionSelect = partitionSelect
mathWithTransform.sort = sort
mathWithTransform.max = transform.max
mathWithTransform.min = transform.min
mathWithTransform.quantileSeq = quantileSeq
mathWithTransform.unit = unit
mathWithTransform.createUnit = createUnit
mathWithTransform.acos = acos
mathWithTransform.acosh = acosh
mathWithTransform.acot = acot
mathWithTransform.acoth = acoth
mathWithTransform.acsc = acsc
mathWithTransform.acsch = acsch
mathWithTransform.asec = asec
mathWithTransform.asech = asech
mathWithTransform.asin = asin
mathWithTransform.asinh = asinh
mathWithTransform.atan = atan
mathWithTransform.atan2 = atan2
mathWithTransform.atanh = atanh
mathWithTransform.cos = cos
mathWithTransform.cosh = cosh
mathWithTransform.cot = cot
mathWithTransform.coth = coth
mathWithTransform.csc = csc
mathWithTransform.csch = csch
mathWithTransform.sec = sec
mathWithTransform.sech = sech
mathWithTransform.sin = sin
mathWithTransform.sinh = sinh
mathWithTransform.tan = tan
mathWithTransform.tanh = tanh
mathWithTransform.setCartesian = setCartesian
mathWithTransform.setDifference = setDifference
mathWithTransform.setDistinct = setDistinct
mathWithTransform.setIntersect = setIntersect
mathWithTransform.setIsSubset = setIsSubset
mathWithTransform.setMultiplicity = setMultiplicity
mathWithTransform.setPowerset = setPowerset
mathWithTransform.setSize = setSize
mathWithTransform.setSymDifference = setSymDifference
mathWithTransform.setUnion = setUnion
mathWithTransform.hypot = hypot
mathWithTransform.norm = norm
mathWithTransform.index = transform.index
mathWithTransform.parse = parse
mathWithTransform.compile = compile
mathWithTransform.evaluate = evaluate
mathWithTransform['eval'] = evaluate // For backward compatibility with v5
mathWithTransform.parser = parser
mathWithTransform.lup = lup
mathWithTransform.qr = qr
mathWithTransform.slu = slu
mathWithTransform.lusolve = lusolve
mathWithTransform.help = help
mathWithTransform.chain = chain
mathWithTransform.det = det
mathWithTransform.inv = inv
mathWithTransform.expm = expm
mathWithTransform.sqrtm = sqrtm
mathWithTransform.divide = divide
mathWithTransform.distance = distance
mathWithTransform.intersect = intersect
mathWithTransform.combinations = combinations
mathWithTransform.gamma = gamma
mathWithTransform.factorial = factorial
mathWithTransform.kldivergence = kldivergence
mathWithTransform.multinomial = multinomial
mathWithTransform.permutations = permutations
mathWithTransform.pickRandom = pickRandom
mathWithTransform.random = random
mathWithTransform.randomInt = randomInt
mathWithTransform.stirlingS2 = stirlingS2
mathWithTransform.bellNumbers = bellNumbers
mathWithTransform.catalan = catalan
mathWithTransform.composition = composition
mathWithTransform.mean = transform.mean
mathWithTransform.median = median
mathWithTransform.mad = mad
mathWithTransform.variance = variance
mathWithTransform['var'] = variance // For backward compatibility with v5
mathWithTransform.std = std
mathWithTransform.simplify = simplify
mathWithTransform.derivative = derivative
mathWithTransform.rationalize = rationalize
mathWithTransform.isAccessorNode = isAccessorNode
mathWithTransform.isArray = isArray
mathWithTransform.isArrayNode = isArrayNode
mathWithTransform.isAssignmentNode = isAssignmentNode
mathWithTransform.isBigNumber = isBigNumber
mathWithTransform.isBlockNode = isBlockNode
mathWithTransform.isBoolean = isBoolean
mathWithTransform.isChain = isChain
mathWithTransform.isComplex = isComplex
mathWithTransform.isConditionalNode = isConditionalNode
mathWithTransform.isConstantNode = isConstantNode
mathWithTransform.isDate = isDate
mathWithTransform.isDenseMatrix = isDenseMatrix
mathWithTransform.isFraction = isFraction
mathWithTransform.isFunction = isFunction
mathWithTransform.isFunctionAssignmentNode = isFunctionAssignmentNode
mathWithTransform.isFunctionNode = isFunctionNode
mathWithTransform.isHelp = isHelp
mathWithTransform.isIndex = isIndex
mathWithTransform.isIndexNode = isIndexNode
mathWithTransform.isMatrix = isMatrix
mathWithTransform.isNode = isNode
mathWithTransform.isNull = isNull
mathWithTransform.isNumber = isNumber
mathWithTransform.isObject = isObject
mathWithTransform.isObjectNode = isObjectNode
mathWithTransform.isOperatorNode = isOperatorNode
mathWithTransform.isParenthesisNode = isParenthesisNode
mathWithTransform.isRange = isRange
mathWithTransform.isRangeNode = isRangeNode
mathWithTransform.isRegExp = isRegExp
mathWithTransform.isResultSet = isResultSet
mathWithTransform.isSparseMatrix = isSparseMatrix
mathWithTransform.isSymbolNode = isSymbolNode
mathWithTransform.isUnit = isUnit

// allow using `import math from 'mathjs'` alongside using `import * as math from 'mathjs'`
export default math
