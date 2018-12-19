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
import { createUnit } from './type/unit/function/unit'
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
import { createEvaluate } from './expression/function/evaluate'
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
import { partial } from './utils/factory'
import { createHelpClass } from './expression/Help'
import { createChainClass } from './type/chain/Chain'
import { createHelp } from './expression/function/help'
import { createChain } from './type/chain/function/chain'
import { createEmbeddedDocs } from './expression/embeddedDocs'
import { core } from './core/core'

// class (1)
export const createResultSetFull = /* #__PURE__ */ createResultSet
const ResultSet = /* #__PURE__ */ createResultSetFull
export const createBigNumberClassFull = /* #__PURE__ */ createBigNumberClass
const BigNumber = /* #__PURE__ */ createBigNumberClassFull
export const createComplexClassFull = /* #__PURE__ */ createComplexClass
const Complex = /* #__PURE__ */ createComplexClassFull
export const createFractionClassFull = /* #__PURE__ */ createFractionClass
const Fraction = /* #__PURE__ */ createFractionClassFull
export const createRangeClassFull = /* #__PURE__ */ createRangeClass
export const createMatrixClassFull = /* #__PURE__ */ createMatrixClass
const Matrix = /* #__PURE__ */ createMatrixClassFull
export const createDenseMatrixClassFull = /* #__PURE__ */ partial(createDenseMatrixClass, { type: { Matrix } })
const DenseMatrix = /* #__PURE__ */ createDenseMatrixClassFull

const classes = {
  BigNumber: createBigNumberClassFull,
  Complex: createComplexClassFull,
  DenseMatrix: createDenseMatrixClassFull,
  Fraction: createFractionClassFull
}

export const createCoreFull = /* #__PURE__ */ partial(core, { classes })

export const createTypedFull = /* #__PURE__ */ partial(createTyped, { classes })
const typed = /* #__PURE__ */ createTypedFull

// utils (1)
export const createCloneFull = /* #__PURE__ */ partial(createClone, { typed })
export const createIsIntegerFull = /* #__PURE__ */ partial(createIsInteger, { typed })
const isInteger = /* #__PURE__ */ createIsIntegerFull
export const createIsNegativeFull = /* #__PURE__ */ partial(createIsNegative, { typed })
const isNegative = /* #__PURE__ */ createIsNegativeFull
export const createIsNumericFull = /* #__PURE__ */ partial(createIsNumeric, { typed })
const isNumeric = /* #__PURE__ */ createIsNumericFull
export const createIsPositiveFull = /* #__PURE__ */ partial(createIsPositive, { typed })
const isPositive = /* #__PURE__ */ createIsPositiveFull
export const createIsZeroFull = /* #__PURE__ */ partial(createIsZero, { typed })
const isZero = /* #__PURE__ */ createIsZeroFull
export const createIsNaNFull = /* #__PURE__ */ partial(createIsNaN, { typed })
const isNaN = /* #__PURE__ */ createIsNaNFull
export const createTypeOfFull = /* #__PURE__ */ partial(createTypeOf, { typed })

// relational (1)
export const createEqualScalarFull = /* #__PURE__ */ partial(createEqualScalar, { typed })
const equalScalar = /* #__PURE__ */ createEqualScalarFull // shortcut to keep partial notation concise

// classes (1.1)
export const createSparseMatrixClassFull = /* #__PURE__ */ partial(createSparseMatrixClass, { typed, equalScalar, type: { Matrix } })
const SparseMatrix = /* #__PURE__ */ createSparseMatrixClassFull

// create (1)
export const createNumberFull = /* #__PURE__ */ partial(createNumber, { typed })
const number = /* #__PURE__ */ createNumberFull
export const createStringFull = /* #__PURE__ */ partial(createString, { typed })
export const createBooleanFull = /* #__PURE__ */ partial(createBoolean, { typed })
export const createBignumberFull = /* #__PURE__ */ partial(createBignumber, { typed, type: { BigNumber } })
const bignumber = /* #__PURE__ */ createBignumberFull
export const createComplexFull = /* #__PURE__ */ partial(createComplex, { typed, type: { Complex } })
export const createFractionFull = /* #__PURE__ */ partial(createFraction, { typed, type: { Fraction } })
const fraction = /* #__PURE__ */ createFractionFull
export const createMatrixFull = /* #__PURE__ */ partial(createMatrix, { typed, type: { Matrix, DenseMatrix, SparseMatrix } })
const matrix = /* #__PURE__ */ createMatrixFull
export const createSplitUnitFull = /* #__PURE__ */ partial(createSplitUnit, { typed })

// arithmetic (1)
export const createUnaryMinusFull = /* #__PURE__ */ partial(createUnaryMinus, { typed })
const unaryMinus = /* #__PURE__ */ createUnaryMinusFull
export const createUnaryPlusFull = /* #__PURE__ */ partial(createUnaryPlus, { typed, type: { BigNumber } })
export const createAbsFull = /* #__PURE__ */ partial(createAbs, { typed })
const abs = /* #__PURE__ */ createAbsFull
export const createAddScalarFull = /* #__PURE__ */ partial(createAddScalar, { typed })
const addScalar = /* #__PURE__ */ createAddScalarFull
export const createCbrtFull = /* #__PURE__ */ partial(createCbrt, { typed, isNegative, unaryMinus, matrix, type: { Complex, BigNumber, Fraction } })
export const createCeilFull = /* #__PURE__ */ partial(createCeil, { typed })
export const createCubeFull = /* #__PURE__ */ partial(createCube, { typed })
export const createExpFull = /* #__PURE__ */ partial(createExp, { typed })
export const createExpm1Full = /* #__PURE__ */ partial(createExpm1, { typed, type: { Complex } })
export const createFixFull = /* #__PURE__ */ partial(createFix, { typed, type: { Complex } })
const fix = /* #__PURE__ */ createFixFull
export const createFloorFull = /* #__PURE__ */ partial(createFloor, { typed })
export const createGcdFull = /* #__PURE__ */ partial(createGcd, { typed, matrix, equalScalar, type: { BigNumber, DenseMatrix } })
export const createLcmFull = /* #__PURE__ */ partial(createLcm, { typed, matrix, equalScalar })
export const createLog10Full = /* #__PURE__ */ partial(createLog10, { typed, type: { Complex } })
export const createLog2Full = /* #__PURE__ */ partial(createLog2, { typed, type: { Complex } })
export const createModFull = /* #__PURE__ */ partial(createMod, { typed, matrix, equalScalar, type: { DenseMatrix } })
export const createMultiplyScalarFull = /* #__PURE__ */ partial(createMultiplyScalar, { typed })
const multiplyScalar = /* #__PURE__ */ createMultiplyScalarFull
export const createMultiplyFull = /* #__PURE__ */ partial(createMultiply, { typed, matrix, addScalar, multiplyScalar, equalScalar })
const multiply = /* #__PURE__ */ createMultiplyFull
export const createNthRootFull = /* #__PURE__ */ partial(createNthRoot, { typed, matrix, equalScalar, type: { BigNumber } })
export const createSignFull = /* #__PURE__ */ partial(createSign, { typed, type: { BigNumber, Fraction } })
const sign = /* #__PURE__ */ createSignFull
export const createSqrtFull = /* #__PURE__ */ partial(createSqrt, { typed: createTypedFull, type: { Complex: createComplexClassFull } })
const sqrt = /* #__PURE__ */ createSqrtFull
export const createSquareFull = /* #__PURE__ */ partial(createSquare, { typed })
export const createSubtractFull = /* #__PURE__ */ partial(createSubtract, { typed, matrix, equalScalar, addScalar, unaryMinus, type: { DenseMatrix } })
const subtract = /* #__PURE__ */ createSubtractFull
export const createXgcdFull = /* #__PURE__ */ partial(createXgcd, { typed, matrix, type: { BigNumber } })
export const createDotMultiplyFull = /* #__PURE__ */ partial(createDotMultiply, { typed, matrix, equalScalar, multiplyScalar })

// bitwise (1)
export const createBitAndFull = /* #__PURE__ */ partial(createBitAnd, { typed, matrix, equalScalar })
export const createBitNotFull = /* #__PURE__ */ partial(createBitNot, { typed })
export const createBitOrFull = /* #__PURE__ */ partial(createBitOr, { typed, matrix, equalScalar, type: { DenseMatrix } })
export const createBitXorFull = /* #__PURE__ */ partial(createBitXor, { typed, matrix, type: { DenseMatrix } })

// complex (1)
export const createArgFull = /* #__PURE__ */ partial(createArg, { typed, type: { BigNumber } })
export const createConjFull = /* #__PURE__ */ partial(createConj, { typed })
const conj = /* #__PURE__ */ createConjFull
export const createImFull = /* #__PURE__ */ partial(createIm, { typed })
export const createReFull = /* #__PURE__ */ partial(createRe, { typed })

// logical (1)
export const createNotFull = /* #__PURE__ */ partial(createNot, { typed })
const not = /* #__PURE__ */ createNotFull
export const createOrFull = /* #__PURE__ */ partial(createOr, { typed, matrix, equalScalar, type: { DenseMatrix } })
export const createXorFull = /* #__PURE__ */ partial(createXor, { typed, matrix, type: { DenseMatrix } })

// matrix (1)
export const createConcatFull = /* #__PURE__ */ partial(createConcat, { typed, matrix, isInteger })
const concat = /* #__PURE__ */ createConcatFull
export const createCrossFull = /* #__PURE__ */ partial(createCross, { typed, matrix, subtract, multiply })
export const createDiagFull = /* #__PURE__ */ partial(createDiag, { typed, matrix, type: { DenseMatrix, SparseMatrix } })
export const createEyeFull = /* #__PURE__ */ partial(createEye, { typed, matrix })
export const createFilterFull = /* #__PURE__ */ partial(createFilter, { typed, matrix })
export const createFlattenFull = /* #__PURE__ */ partial(createFlatten, { typed, matrix })
export const createForEachFull = /* #__PURE__ */ partial(createForEach, { typed })
export const createGetMatrixDataTypeFull = /* #__PURE__ */ partial(createGetMatrixDataType, { typed })
export const createIdentityFull = /* #__PURE__ */ partial(createIdentity, { typed, matrix, type: { BigNumber, DenseMatrix, SparseMatrix } })
const identity = /* #__PURE__ */ createIdentityFull
export const createKronFull = /* #__PURE__ */ partial(createKron, { typed, matrix, multiplyScalar })
export const createMapFull = /* #__PURE__ */ partial(createMap, { typed })
const map = /* #__PURE__ */ createMapFull
export const createOnesFull = /* #__PURE__ */ partial(createOnes, { typed, matrix, type: { BigNumber } })
export const createRangeFull = /* #__PURE__ */ partial(createRange, { typed, matrix, type: { BigNumber } })
const Range = /* #__PURE__ */ createRangeFull
export const createReshapeFull = /* #__PURE__ */ partial(createReshape, { typed, isInteger, matrix })
export const createResizeFull = /* #__PURE__ */ partial(createResize, { matrix })
export const createSizeFull = /* #__PURE__ */ partial(createSize, { typed, matrix })
const size = /* #__PURE__ */ createSizeFull
export const createSqueezeFull = /* #__PURE__ */ partial(createSqueeze, { typed, matrix })
export const createSubsetFull = /* #__PURE__ */ partial(createSubset, { typed, matrix })
const subset = /* #__PURE__ */ createSubsetFull
export const createTransposeFull = /* #__PURE__ */ partial(createTranspose, { typed, matrix })
const transpose = /* #__PURE__ */ createTransposeFull
export const createCtransposeFull = /* #__PURE__ */ partial(createCtranspose, { typed, transpose, conj })
export const createZerosFull = /* #__PURE__ */ partial(createZeros, { typed, matrix, type: { BigNumber } })
const zeros = /* #__PURE__ */ createZerosFull

// special (1)
export const createErfFull = /* #__PURE__ */ partial(createErf, { typed, type: { BigNumber } })

// statistics (1)
export const createModeFull = /* #__PURE__ */ partial(createMode, { typed, isNaN, isNumeric })
export const createProdFull = /* #__PURE__ */ partial(createProd, { typed, multiply })

// string (1)
export const createFormatFull = /* #__PURE__ */ partial(createFormat, { typed })
const format = /* #__PURE__ */ createFormatFull
export const createPrintFull = /* #__PURE__ */ partial(createPrint, { typed })

// unit (1)
export const createToFull = /* #__PURE__ */ partial(createTo, { typed, matrix })

// utils (2)
export const createIsPrimeFull = /* #__PURE__ */ partial(createIsPrime, { typed, type: { BigNumber } })
export const createNumericFull = /* #__PURE__ */ partial(createNumeric, { typed, number, bignumber, fraction })
const numeric = /* #__PURE__ */ createNumericFull

// arithmetic (2)
export const createDivideScalarFull = /* #__PURE__ */ partial(createDivideScalar, { typed, numeric })
const divideScalar = /* #__PURE__ */ createDivideScalarFull
export const createPowFull = /* #__PURE__ */ partial(createPow, { typed, identity, multiply, matrix, number, fraction, type: { Complex } })
const pow = /* #__PURE__ */ createPowFull
export const createRoundFull = /* #__PURE__ */ partial(createRound, { typed, matrix, equalScalar, zeros, type: { BigNumber, DenseMatrix } })
const round = /* #__PURE__ */ createRoundFull
export const createLogFull = /* #__PURE__ */ partial(createLog, { typed, divideScalar, type: { Complex } })
const log = /* #__PURE__ */ createLogFull
export const createLog1pFull = /* #__PURE__ */ partial(createLog1p, { typed, divideScalar, log, type: { Complex } })
export const createNthRootsFull = /* #__PURE__ */ partial(createNthRoots, { typed, divideScalar, type: { Complex } })
export const createDotPowFull = /* #__PURE__ */ partial(createDotPow, { typed, equalScalar, matrix, pow, type: { DenseMatrix } })
export const createDotDivideFull = /* #__PURE__ */ partial(createDotDivide, { typed, matrix, equalScalar, divideScalar, type: { DenseMatrix } })
const dotDivide = /* #__PURE__ */ createDotDivideFull

// algebra (2)
export const createLsolveFull = /* #__PURE__ */ partial(createLsolve, { typed, matrix, divideScalar, multiplyScalar, subtract, equalScalar, type: { DenseMatrix } })
const lsolve = /* #__PURE__ */ createLsolveFull
export const createUsolveFull = /* #__PURE__ */ partial(createUsolve, { typed, matrix, divideScalar, multiplyScalar, subtract, equalScalar, type: { DenseMatrix } })
const usolve = /* #__PURE__ */ createUsolveFull

// bitwise (2)
export const createLeftShiftFull = /* #__PURE__ */ partial(createLeftShift, { typed, matrix, equalScalar, zeros, type: { DenseMatrix } })
export const createRightArithShiftFull = /* #__PURE__ */ partial(createRightArithShift, { typed, matrix, equalScalar, zeros, type: { DenseMatrix } })
export const createRightLogShiftFull = /* #__PURE__ */ partial(createRightLogShift, { typed, matrix, equalScalar, zeros, type: { DenseMatrix } })

// logical (2)
export const createAndFull = /* #__PURE__ */ partial(createAnd, { typed, matrix, equalScalar, zeros, not })

// relational (2)
export const createCompareFull = /* #__PURE__ */ partial(createCompare, { typed, equalScalar, matrix, type: { BigNumber, Fraction, DenseMatrix } })
const compare = /* #__PURE__ */ createCompareFull
export const createCompareNaturalFull = /* #__PURE__ */ partial(createCompareNatural, { typed, compare })
const compareNatural = /* #__PURE__ */ createCompareNaturalFull
export const createCompareTextFull = /* #__PURE__ */ partial(createCompareText, { typed, matrix })
const compareText = /* #__PURE__ */ createCompareTextFull
export const createEqualFull = /* #__PURE__ */ partial(createEqual, { typed, matrix, equalScalar, type: { DenseMatrix } })
const equal = /* #__PURE__ */ createEqualFull
export const createEqualTextFull = /* #__PURE__ */ partial(createEqualText, { typed, compareText, isZero })
export const createSmallerFull = /* #__PURE__ */ partial(createSmaller, { typed, matrix, equalScalar, divideScalar, type: { DenseMatrix } })
const smaller = /* #__PURE__ */ createSmallerFull
export const createSmallerEqFull = /* #__PURE__ */ partial(createSmallerEq, { typed, matrix, type: { DenseMatrix } })
export const createLargerFull = /* #__PURE__ */ partial(createLarger, { typed, matrix, type: { DenseMatrix } })
const larger = /* #__PURE__ */ createLargerFull
export const createLargerEqFull = /* #__PURE__ */ partial(createLargerEq, { typed, matrix, type: { DenseMatrix } })
const largerEq = /* #__PURE__ */ createLargerEqFull
export const createDeepEqualFull = /* #__PURE__ */ partial(createDeepEqual, { typed, equal })
export const createUnequalFull = /* #__PURE__ */ partial(createUnequal, { typed, matrix, type: { DenseMatrix } })
const unequal = /* #__PURE__ */ createUnequalFull

// matrix (2)
export const createPartitionSelectFull = /* #__PURE__ */ partial(createPartitionSelect, { typed, isNumeric, isNaN, compare })
const partitionSelect = /* #__PURE__ */ createPartitionSelectFull
export const createSortFull = /* #__PURE__ */ partial(createSort, { typed, matrix, compare, compareNatural })

// statistics (2)
export const createMaxFull = /* #__PURE__ */ partial(createMax, { typed, larger })
const max = /* #__PURE__ */ createMaxFull
export const createMinFull = /* #__PURE__ */ partial(createMin, { typed, smaller })

// class (2)
export const createImmutableDenseMatrixClassFull = /* #__PURE__ */ partial(createImmutableDenseMatrixClass, { smaller, type: { DenseMatrix } })
const ImmutableDenseMatrix = /* #__PURE__ */ createImmutableDenseMatrixClassFull
export const createIndexClassFull = /* #__PURE__ */ partial(createIndexClass, { type: { ImmutableDenseMatrix } })
const Index = /* #__PURE__ */ createIndexClassFull
export const createFibonacciHeapClassFull = /* #__PURE__ */ partial(createFibonacciHeapClass, { smaller, larger })
const FibonacciHeap = /* #__PURE__ */ createFibonacciHeapClassFull
export const createSpaClassFull = /* #__PURE__ */ partial(createSpaClass, { addScalar, equalScalar, type: { FibonacciHeap } })
const Spa = /* #__PURE__ */ createSpaClassFull
export const createUnitClassFull = /* #__PURE__ */ partial(createUnitClass, {
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
const Unit = /* #__PURE__ */ createUnitClassFull

// create (2)
export const createSparseFull = /* #__PURE__ */ partial(createSparse, { typed, type: { SparseMatrix } })
export const createUnitFull = /* #__PURE__ */ partial(createUnit, { typed, type: { Unit } })
export const createCreateUnitFull = /* #__PURE__ */ partial(createCreateUnit, { typed, type: { Unit } })

// trigonometry (2)
export const createAcosFull = /* #__PURE__ */ partial(createAcos, { typed, type: { Complex } })
export const createAcoshFull = /* #__PURE__ */ partial(createAcosh, { typed, type: { Complex } })
export const createAcotFull = /* #__PURE__ */ partial(createAcot, { typed, type: { BigNumber } })
export const createAcothFull = /* #__PURE__ */ partial(createAcoth, { typed, type: { Complex, BigNumber } })
export const createAcscFull = /* #__PURE__ */ partial(createAcsc, { typed, type: { Complex, BigNumber } })
export const createAcschFull = /* #__PURE__ */ partial(createAcsch, { typed, type: { BigNumber } })
export const createAsecFull = /* #__PURE__ */ partial(createAsec, { typed, type: { Complex, BigNumber } })
export const createAsechFull = /* #__PURE__ */ partial(createAsech, { typed, type: { Complex, BigNumber } })
export const createAsinFull = /* #__PURE__ */ partial(createAsin, { typed, type: { Complex } })
export const createAsinhFull = /* #__PURE__ */ partial(createAsinh, { typed })
export const createAtanFull = /* #__PURE__ */ partial(createAtan, { typed })
export const createAtan2Full = /* #__PURE__ */ partial(createAtan2, { typed, matrix, equalScalar, type: { BigNumber, DenseMatrix } })
export const createAtanhFull = /* #__PURE__ */ partial(createAtanh, { typed, type: { Complex } })
export const createCosFull = /* #__PURE__ */ partial(createCos, { typed, type: { Unit } })
export const createCoshFull = /* #__PURE__ */ partial(createCosh, { typed, type: { Unit } })
export const createCotFull = /* #__PURE__ */ partial(createCot, { typed, type: { BigNumber, Unit } })
export const createCothFull = /* #__PURE__ */ partial(createCoth, { typed, type: { BigNumber, Unit } })
export const createCscFull = /* #__PURE__ */ partial(createCsc, { typed, type: { BigNumber, Unit } })
export const createCschFull = /* #__PURE__ */ partial(createCsch, { typed, type: { BigNumber, Unit } })
export const createSecFull = /* #__PURE__ */ partial(createSec, { typed, type: { BigNumber, Unit } })
export const createSechFull = /* #__PURE__ */ partial(createSech, { typed, type: { BigNumber, Unit } })
export const createSinFull = /* #__PURE__ */ partial(createSin, { typed, type: { BigNumber, Unit } })
export const createSinhFull = /* #__PURE__ */ partial(createSinh, { typed, type: { Unit } })
export const createTanFull = /* #__PURE__ */ partial(createTan, { typed, type: { Unit } })
export const createTanhFull = /* #__PURE__ */ partial(createTanh, { typed, type: { Unit } })

// set (2)
export const createSetCartesianFull = /* #__PURE__ */ partial(createSetCartesian, { typed, size, subset, compareNatural, type: { Index, DenseMatrix } })
export const createSetDifferenceFull = /* #__PURE__ */ partial(createSetDifference, { typed, size, subset, compareNatural, type: { Index, DenseMatrix } })
const setDifference = /* #__PURE__ */ createSetDifferenceFull
export const createSetDistinctFull = /* #__PURE__ */ partial(createSetDistinct, { typed, size, subset, compareNatural, type: { Index, DenseMatrix } })
export const createSetIntersectFull = /* #__PURE__ */ partial(createSetIntersect, { typed, size, subset, compareNatural, type: { Index, DenseMatrix } })
const setIntersect = /* #__PURE__ */ createSetIntersectFull
export const createSetIsSubsetFull = /* #__PURE__ */ partial(createSetIsSubset, { typed, size, subset, compareNatural, type: { Index } })
export const createSetMultiplicityFull = /* #__PURE__ */ partial(createSetMultiplicity, { typed, size, subset, compareNatural, type: { Index } })
export const createSetPowersetFull = /* #__PURE__ */ partial(createSetPowerset, { typed, size, subset, compareNatural, type: { Index } })
export const createSetSizeFull = /* #__PURE__ */ partial(createSetSize, { typed, compareNatural })
export const createSetSymDifferenceFull = /* #__PURE__ */ partial(createSetSymDifference, { typed, size, concat, subset, setDifference, type: { Index } })
const setSymDifference = /* #__PURE__ */ createSetSymDifferenceFull
export const createSetUnionFull = /* #__PURE__ */ partial(createSetUnion, { typed, size, concat, subset, setIntersect, setSymDifference, type: { Index } })

// arithmetic (3)
export const createAddFull = /* #__PURE__ */ partial(createAdd, { typed, matrix, addScalar, equalScalar, type: { DenseMatrix, SparseMatrix } })
const add = /* #__PURE__ */ createAddFull
export const createHypotFull = /* #__PURE__ */ partial(createHypot, { typed, abs, addScalar, divideScalar, multiplyScalar, sqrt, smaller, isPositive })
export const createNormFull = /* #__PURE__ */ partial(createNorm, { typed, abs, add, pow, conj, sqrt, multiply, equalScalar, larger, smaller, matrix })

// matrix (3)
export const createDotFull = /* #__PURE__ */ partial(createDot, { typed, add, multiply })
export const createTraceFull = /* #__PURE__ */ partial(createTrace, { typed, matrix, add })
export const createIndexFull = /* #__PURE__ */ partial(createIndex, { typed, type: { Index } })

// expression (3)
export const createNodeFull = /* #__PURE__ */ createNode
const Node = /* #__PURE__ */ createNodeFull
export const createAccessorNodeFull = /* #__PURE__ */ partial(createAccessorNode, { subset, expression: { node: { Node } } })
const AccessorNode = /* #__PURE__ */ createAccessorNodeFull
export const createArrayNodeFull = /* #__PURE__ */ partial(createArrayNode, { expression: { node: { Node } } })
const ArrayNode = /* #__PURE__ */ createArrayNodeFull
export const createAssignmentNodeFull = /* #__PURE__ */ partial(createAssignmentNode, { subset, matrix, expression: { node: { Node } } })
const AssignmentNode = /* #__PURE__ */ createAssignmentNodeFull
export const createBlockNodeFull = /* #__PURE__ */ partial(createBlockNode, { type: { ResultSet }, expression: { node: { Node } } })
const BlockNode = /* #__PURE__ */ createBlockNodeFull
export const createConditionalNodeFull = /* #__PURE__ */ partial(createConditionalNode, { expression: { node: { Node } } })
const ConditionalNode = /* #__PURE__ */ createConditionalNodeFull
export const createConstantNodeFull = /* #__PURE__ */ partial(createConstantNode, { expression: { node: { Node } } })
const ConstantNode = /* #__PURE__ */ createConstantNodeFull
export const createFunctionAssignmentNodeFull = /* #__PURE__ */ partial(createFunctionAssignmentNode, { typed, expression: { node: { Node } } })
const FunctionAssignmentNode = /* #__PURE__ */ createFunctionAssignmentNodeFull
export const createIndexNodeFull = /* #__PURE__ */ partial(createIndexNode, { type: { Range }, expression: { node: { Node } } })
const IndexNode = /* #__PURE__ */ createIndexNodeFull
export const createObjectNodeFull = /* #__PURE__ */ partial(createObjectNode, { expression: { node: { Node } } })
const ObjectNode = /* #__PURE__ */ createObjectNodeFull
export const createOperatorNodeFull = /* #__PURE__ */ partial(createOperatorNode, { expression: { node: { Node } } })
const OperatorNode = /* #__PURE__ */ createOperatorNodeFull
export const createParenthesisNodeFull = /* #__PURE__ */ partial(createParenthesisNode, { expression: { node: { Node } } })
const ParenthesisNode = /* #__PURE__ */ createParenthesisNodeFull
export const createRangeNodeFull = /* #__PURE__ */ partial(createRangeNode, { expression: { node: { Node } } })
const RangeNode = /* #__PURE__ */ createRangeNodeFull
export const createRelationalNodeFull = /* #__PURE__ */ partial(createRelationalNode, { expression: { node: { Node } } })
const RelationalNode = /* #__PURE__ */ createRelationalNodeFull
export const createSymbolNodeFull = /* #__PURE__ */ partial(createSymbolNode, { type: { Unit }, expression: { node: { Node } } })
const SymbolNode = /* #__PURE__ */ createSymbolNodeFull
export const createFunctionNodeFull = /* #__PURE__ */ partial(createFunctionNode, { expression: { node: { Node, SymbolNode } } })
const FunctionNode = /* #__PURE__ */ createFunctionNodeFull
const createParseExpressionFull = /* #__PURE__ */ partial(createParseExpression, {
  numeric,
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
const parseExpression = /* #__PURE__ */ createParseExpressionFull
export const createParseFull = /* #__PURE__ */ partial(createParse, { typed, expression: { parse: parseExpression } })
const parse = /* #__PURE__ */ createParseFull
export const createCompileFull = /* #__PURE__ */ partial(createCompile, { typed, expression: { parse: parseExpression } })
export const createEvaluateFull = /* #__PURE__ */ partial(createEvaluate, { typed, expression: { parse: parseExpression } })
export const createParserClassFull = /* #__PURE__ */ partial(createParserClass, { expression: { parse: parseExpression } })
const Parser = /* #__PURE__ */ createParserClassFull

// create (3)
export const createParserFull = /* #__PURE__ */ partial(createParser, { typed, expression: { Parser } })

// algebra (3)
export const createLupFull = /* #__PURE__ */ partial(createLup, {
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
const lup = /* #__PURE__ */ createLupFull
export const createQrFull = /* #__PURE__ */ partial(createQr, {
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
export const createSluFull = /* #__PURE__ */ partial(createSlu, { typed, abs, add, multiply, transpose, divideScalar, subtract, larger, largerEq, type: { SparseMatrix } })
const slu = /* #__PURE__ */ createSluFull
export const createLusolveFull = /* #__PURE__ */ partial(createLusolve, { typed, matrix, lup, slu, usolve, lsolve, type: { DenseMatrix } })

// class (3)
export const createHelpClassFull = /* #__PURE__ */ partial(createHelpClass, { expression: { parse: parseExpression } })
const Help = /* #__PURE__ */ createHelpClassFull
export const createChainClassFull = /* #__PURE__ */ createChainClass
const Chain = /* #__PURE__ */ createChainClassFull

// type (3)
const docs = /* #__PURE__ */ createEmbeddedDocs
export const createHelpFull = /* #__PURE__ */ partial(createHelp, { typed, expression: { docs }, type: { Help } })
export const createChainFull = /* #__PURE__ */ partial(createChain, { typed, type: { Chain } })

// matrix (4)
export const createDetFull = /* #__PURE__ */ partial(createDet, { typed, matrix, subtract, multiply, unaryMinus, lup })
const det = /* #__PURE__ */ createDetFull
export const createInvFull = /* #__PURE__ */ partial(createInv, { typed, matrix, divideScalar, addScalar, multiply, unaryMinus, det, identity, abs })
const inv = /* #__PURE__ */ createInvFull
export const createExpmFull = /* #__PURE__ */ partial(createExpm, { typed, abs, add, identity, inv, multiply })
export const createSqrtmFull = /* #__PURE__ */ partial(createSqrtm, { typed, abs, add, multiply, sqrt, subtract, inv, size, max, identity })

// arithmetic (4)
export const createDivideFull = /* #__PURE__ */ partial(createDivide, { typed, matrix, multiply, equalScalar, divideScalar, inv })
const divide = /* #__PURE__ */ createDivideFull

// geometry (4)
export const createDistanceFull = /* #__PURE__ */ partial(createDistance, { typed, addScalar, subtract, multiplyScalar, divideScalar, unaryMinus, sqrt, abs })
export const createIntersectFull = /* #__PURE__ */ partial(createIntersect, { typed, abs, add, addScalar, matrix, multiply, multiplyScalar, divideScalar, subtract, smaller, equalScalar })

// statistics (4)
export const createSumFull = /* #__PURE__ */ partial(createSum, { typed, add, type: { BigNumber, Fraction } })
const sum = /* #__PURE__ */ createSumFull
export const createMeanFull = /* #__PURE__ */ partial(createMean, { typed, add, divide })
export const createMedianFull = /* #__PURE__ */ partial(createMedian, { typed, add, divide, compare, partitionSelect })
const median = /* #__PURE__ */ createMedianFull
export const createMadFull = /* #__PURE__ */ partial(createMad, { typed, abs, map, median, subtract })
export const createVarianceFull = /* #__PURE__ */ partial(createVariance, { typed, add, subtract, multiply, divide, isNaN })
const variance = /* #__PURE__ */ createVarianceFull
export const createQuantileSeqFull = /* #__PURE__ */ partial(createQuantileSeq, { typed, add, multiply, partitionSelect, compare, type: { BigNumber } })
export const createStdFull = /* #__PURE__ */ partial(createStd, { typed, sqrt, variance })

// probability (4)
const createDistributionFull = /* #__PURE__ */ partial(createDistribution, { typed, matrix })
const distribution = /* #__PURE__ */ createDistributionFull
export const createCombinationsFull = /* #__PURE__ */ partial(createCombinations, { typed, type: { BigNumber } })
const combinations = /* #__PURE__ */ createCombinationsFull
export const createGammaFull = /* #__PURE__ */ partial(createGamma, { typed, multiplyScalar, pow, type: { BigNumber, Complex } })
const gamma = /* #__PURE__ */ createGammaFull
export const createFactorialFull = /* #__PURE__ */ partial(createFactorial, { typed, gamma })
const factorial = /* #__PURE__ */ createFactorialFull
export const createKldivergenceFull = /* #__PURE__ */ partial(createKldivergence, { typed, matrix, divide, sum, multiply, dotDivide, log, isNumeric })
export const createMultinomialFull = /* #__PURE__ */ partial(createMultinomial, { typed, add, divide, multiply, factorial, isInteger, isPositive })
export const createPermutationsFull = /* #__PURE__ */ partial(createPermutations, { typed, factorial })
export const createPickRandomFull = /* #__PURE__ */ partial(createPickRandom, { distribution })
export const createRandomFull = /* #__PURE__ */ partial(createRandom, { distribution })
export const createRandomIntFull = /* #__PURE__ */ partial(createRandomInt, { distribution })

// combinatorics (4)
export const createStirlingS2Full = /* #__PURE__ */ partial(createStirlingS2, { typed, addScalar, subtract, multiplyScalar, divideScalar, pow, factorial, combinations, isNegative, isInteger, larger })
const stirlingS2 = /* #__PURE__ */ createStirlingS2Full
export const createBellNumbersFull = /* #__PURE__ */ partial(createBellNumbers, { typed, addScalar, isNegative, isInteger, stirlingS2 })
export const createCatalanFull = /* #__PURE__ */ partial(createCatalan, { typed, addScalar, divideScalar, multiplyScalar, combinations, isNegative, isInteger })
export const createCompositionFull = /* #__PURE__ */ partial(createComposition, { typed, addScalar, combinations, isPositive, isNegative, isInteger, larger })

// algebra (4)
const createSimplifyCoreFull = /* #__PURE__ */ partial(createSimplifyCore, {
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
const simplifyCore = /* #__PURE__ */ createSimplifyCoreFull
const createSimplifyConstantFull = /* #__PURE__ */ partial(createSimplifyConstant, {
  typed,
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
const simplifyConstant = /* #__PURE__ */ createSimplifyConstantFull
const createResolveFull = /* #__PURE__ */ partial(createResolve, { expression: { parse: parseExpression, node: { Node, FunctionNode, OperatorNode, ParenthesisNode } } })
const resolve = /* #__PURE__ */ createResolveFull
export const createSimplifyFull = /* #__PURE__ */ partial(createSimplify, {
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
const simplify = /* #__PURE__ */ createSimplifyFull
export const createDerivativeFull = /* #__PURE__ */ partial(createDerivative, {
  typed,
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
export const createRationalizeFull = /* #__PURE__ */ partial(createRationalize, {
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

export const createReviverFull = /* #__PURE__ */ partial(createReviver, {
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

// constants
const constantsDependencies = { type: { BigNumber } }
export const createTrueFull = /* #__PURE__ */ createTrue
export const createFalseFull = /* #__PURE__ */ createFalse
export const createNullFull = /* #__PURE__ */ createNull
export const createInfinityFull = /* #__PURE__ */ partial(createInfinity, constantsDependencies)
export const createNaNFull = /* #__PURE__ */ partial(createNaN, constantsDependencies)
export const createPiFull = /* #__PURE__ */ partial(createPi, constantsDependencies)
export const createTauFull = /* #__PURE__ */ partial(createTau, constantsDependencies)
export const createEFull = /* #__PURE__ */ partial(createE, constantsDependencies)
export const createPhiFull = /* #__PURE__ */ partial(createPhi, constantsDependencies)
export const createLN2Full = /* #__PURE__ */ partial(createLN2, constantsDependencies)
export const createLN10Full = /* #__PURE__ */ partial(createLN10, constantsDependencies)
export const createLOG2EFull = /* #__PURE__ */ partial(createLOG2E, constantsDependencies)
export const createLOG10EFull = /* #__PURE__ */ partial(createLOG10E, constantsDependencies)
export const createSQRTHalfFull = /* #__PURE__ */ partial(createSQRTHalf, constantsDependencies)
export const createSQRT2Full = /* #__PURE__ */ partial(createSQRT2, constantsDependencies)
export const createIFull = /* #__PURE__ */ partial(createI, { type: { Complex } })
export const createVersionFull = /* #__PURE__ */ createVersion

// FIXME: export physical constants
