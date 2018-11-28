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

// class (1)
export const createResultSetFull = createResultSet
const ResultSet = createResultSetFull
export const createBigNumberClassFull = createBigNumberClass
const BigNumber = createBigNumberClassFull
export const createComplexClassFull = createComplexClass
const Complex = createComplexClassFull
export const createFractionClassFull = createFractionClass
const Fraction = createFractionClassFull
export const createRangeClassFull = createRangeClass
export const createMatrixClassFull = createMatrixClass
const Matrix = createMatrixClassFull
export const createDenseMatrixClassFull = partial(createDenseMatrixClass, { type: { Matrix } })
const DenseMatrix = createDenseMatrixClassFull

export const createTypedFull = partial(createTyped, {
  BigNumber: createBigNumberClassFull,
  Complex: createComplexClassFull,
  Fraction: createFractionClassFull,
  DenseMatrix: createDenseMatrixClassFull
})
const typed = createTypedFull

// utils (1)
export const createCloneFull = partial(createClone, { typed })
export const createIsIntegerFull = partial(createIsInteger, { typed })
const isInteger = createIsIntegerFull
export const createIsNegativeFull = partial(createIsNegative, { typed })
const isNegative = createIsNegativeFull
export const createIsNumericFull = partial(createIsNumeric, { typed })
const isNumeric = createIsNumericFull
export const createIsPositiveFull = partial(createIsPositive, { typed })
const isPositive = createIsPositiveFull
export const createIsZeroFull = partial(createIsZero, { typed })
const isZero = createIsZeroFull
export const createIsNaNFull = partial(createIsNaN, { typed })
const isNaN = createIsNaNFull
export const createTypeOfFull = partial(createTypeOf, { typed })

// relational (1)
export const createEqualScalarFull = partial(createEqualScalar, { typed })
const equalScalar = createEqualScalarFull // shortcut to keep partial notation concise

// classes (1.1)
export const createSparseMatrixClassFull = partial(createSparseMatrixClass, { typed, equalScalar, type: { Matrix } })
const SparseMatrix = createSparseMatrixClassFull

// create (1)
export const createNumberFull = partial(createNumber, { typed })
const number = createNumberFull
export const createStringFull = partial(createString, { typed })
export const createBooleanFull = partial(createBoolean, { typed })
export const createBignumberFull = partial(createBignumber, { typed, type: { BigNumber } })
const bignumber = createBignumberFull
export const createComplexFull = partial(createComplex, { typed, type: { Complex } })
export const createFractionFull = partial(createFraction, { typed, type: { Fraction } })
const fraction = createFractionFull
export const createMatrixFull = partial(createMatrix, { typed, type: { Matrix, DenseMatrix, SparseMatrix } })
const matrix = createMatrixFull
export const createSplitUnitFull = partial(createSplitUnit, { typed })

// arithmetic (1)
export const createUnaryMinusFull = partial(createUnaryMinus, { typed })
const unaryMinus = createUnaryMinusFull
export const createUnaryPlusFull = partial(createUnaryPlus, { typed, type: { BigNumber } })
export const createAbsFull = partial(createAbs, { typed })
const abs = createAbsFull
export const createAddScalarFull = partial(createAddScalar, { typed })
const addScalar = createAddScalarFull
export const createCbrtFull = partial(createCbrt, { typed, isNegative, unaryMinus, matrix, type: { Complex, BigNumber, Fraction } })
export const createCeilFull = partial(createCeil, { typed })
export const createCubeFull = partial(createCube, { typed })
export const createExpFull = partial(createExp, { typed })
export const createExpm1Full = partial(createExpm1, { typed, type: { Complex } })
export const createFixFull = partial(createFix, { typed, type: { Complex } })
const fix = createFixFull
export const createFloorFull = partial(createFloor, { typed })
export const createGcdFull = partial(createGcd, { typed, matrix, equalScalar, type: { BigNumber, DenseMatrix } })
export const createLcmFull = partial(createLcm, { typed, matrix, equalScalar })
export const createLog10Full = partial(createLog10, { typed, type: { Complex } })
export const createLog2Full = partial(createLog2, { typed, type: { Complex } })
export const createModFull = partial(createMod, { typed, matrix, equalScalar, type: { DenseMatrix } })
export const createMultiplyScalarFull = partial(createMultiplyScalar, { typed })
const multiplyScalar = createMultiplyScalarFull
export const createMultiplyFull = partial(createMultiply, { typed, matrix, addScalar, multiplyScalar, equalScalar })
const multiply = createMultiplyFull
export const createNthRootFull = partial(createNthRoot, { typed, matrix, equalScalar, type: { BigNumber } })
export const createSignFull = partial(createSign, { typed, type: { BigNumber, Fraction } })
const sign = createSignFull
export const createSqrtFull = partial(createSqrt, { typed: createTypedFull, type: { Complex: createComplexClassFull } })
const sqrt = createSqrtFull
export const createSquareFull = partial(createSquare, { typed })
export const createSubtractFull = partial(createSubtract, { typed, matrix, equalScalar, addScalar, unaryMinus, type: { DenseMatrix } })
const subtract = createSubtractFull
export const createXgcdFull = partial(createXgcd, { typed, matrix, type: { BigNumber } })
export const createDotMultiplyFull = partial(createDotMultiply, { typed, matrix, equalScalar, multiplyScalar })

// bitwise (1)
export const createBitAndFull = partial(createBitAnd, { typed, matrix, equalScalar })
export const createBitNotFull = partial(createBitNot, { typed })
export const createBitOrFull = partial(createBitOr, { typed, matrix, equalScalar, type: { DenseMatrix } })
export const createBitXorFull = partial(createBitXor, { typed, matrix, type: { DenseMatrix } })

// complex (1)
export const createArgFull = partial(createArg, { typed, type: { BigNumber } })
export const createConjFull = partial(createConj, { typed })
const conj = createConjFull
export const createImFull = partial(createIm, { typed })
export const createReFull = partial(createRe, { typed })

// logical (1)
export const createNotFull = partial(createNot, { typed })
const not = createNotFull
export const createOrFull = partial(createOr, { typed, matrix, equalScalar, type: { DenseMatrix } })
export const createXorFull = partial(createXor, { typed, matrix, type: { DenseMatrix } })

// matrix (1)
export const createConcatFull = partial(createConcat, { typed, matrix, isInteger })
const concat = createConcatFull
export const createCrossFull = partial(createCross, { typed, matrix, subtract, multiply })
export const createDiagFull = partial(createDiag, { typed, matrix, type: { DenseMatrix, SparseMatrix } })
export const createEyeFull = partial(createEye, { typed, matrix })
export const createFilterFull = partial(createFilter, { typed, matrix })
export const createFlattenFull = partial(createFlatten, { typed, matrix })
export const createForEachFull = partial(createForEach, { typed })
export const createGetMatrixDataTypeFull = partial(createGetMatrixDataType, { typed })
export const createIdentityFull = partial(createIdentity, { typed, matrix, type: { BigNumber, DenseMatrix, SparseMatrix } })
const identity = createIdentityFull
export const createKronFull = partial(createKron, { typed, matrix, multiplyScalar })
export const createMapFull = partial(createMap, { typed })
const map = createMapFull
export const createOnesFull = partial(createOnes, { typed, matrix, type: { BigNumber } })
export const createRangeFull = partial(createRange, { typed, matrix, type: { BigNumber } })
const Range = createRangeFull
export const createReshapeFull = partial(createReshape, { typed, isInteger, matrix })
export const createResizeFull = partial(createResize, { matrix })
export const createSizeFull = partial(createSize, { typed, matrix })
const size = createSizeFull
export const createSqueezeFull = partial(createSqueeze, { typed, matrix })
export const createSubsetFull = partial(createSubset, { typed, matrix })
const subset = createSubsetFull
export const createTransposeFull = partial(createTranspose, { typed, matrix })
const transpose = createTransposeFull
export const createCtransposeFull = partial(createCtranspose, { typed, transpose, conj })
export const createZerosFull = partial(createZeros, { typed, matrix, type: { BigNumber } })
const zeros = createZerosFull

// special (1)
export const createErfFull = partial(createErf, { typed, type: { BigNumber } })

// statistics (1)
export const createModeFull = partial(createMode, { typed, isNaN, isNumeric })
export const createProdFull = partial(createProd, { typed, multiply })

// string (1)
export const createFormatFull = partial(createFormat, { typed })
const format = createFormatFull
export const createPrintFull = partial(createPrint, { typed })

// unit (1)
export const createToFull = partial(createTo, { typed, matrix })

// utils (2)
export const createIsPrimeFull = partial(createIsPrime, { typed, type: { BigNumber } })
export const createNumericFull = partial(createNumeric, { typed, number, bignumber, fraction })
const numeric = createNumericFull

// arithmetic (2)
export const createDivideScalarFull = partial(createDivideScalar, { typed, numeric })
const divideScalar = createDivideScalarFull
export const createPowFull = partial(createPow, { typed, identity, multiply, matrix, number, fraction, type: { Complex } })
const pow = createPowFull
export const createRoundFull = partial(createRound, { typed, matrix, equalScalar, zeros, type: { BigNumber, DenseMatrix } })
const round = createRoundFull
export const createLogFull = partial(createLog, { typed, divideScalar, type: { Complex } })
const log = createLogFull
export const createLog1pFull = partial(createLog1p, { typed, divideScalar, log, type: { Complex } })
export const createNthRootsFull = partial(createNthRoots, { typed, divideScalar, type: { Complex } })
export const createDotPowFull = partial(createDotPow, { typed, equalScalar, matrix, pow, type: { DenseMatrix } })
export const createDotDivideFull = partial(createDotDivide, { typed, matrix, equalScalar, divideScalar, type: { DenseMatrix } })
const dotDivide = createDotDivideFull

// algebra (2)
export const createLsolveFull = partial(createLsolve, { typed, matrix, divideScalar, multiplyScalar, subtract, equalScalar, type: { DenseMatrix } })
const lsolve = createLsolveFull
export const createUsolveFull = partial(createUsolve, { typed, matrix, divideScalar, multiplyScalar, subtract, equalScalar, type: { DenseMatrix } })
const usolve = createUsolveFull

// bitwise (2)
export const createLeftShiftFull = partial(createLeftShift, { typed, matrix, equalScalar, zeros, type: { DenseMatrix } })
export const createRightArithShiftFull = partial(createRightArithShift, { typed, matrix, equalScalar, zeros, type: { DenseMatrix } })
export const createRightLogShiftFull = partial(createRightLogShift, { typed, matrix, equalScalar, zeros, type: { DenseMatrix } })

// logical (2)
export const createAndFull = partial(createAnd, { typed, matrix, equalScalar, zeros, not })

// relational (2)
export const createCompareFull = partial(createCompare, { typed, equalScalar, matrix, type: { BigNumber, Fraction, DenseMatrix } })
const compare = createCompareFull
export const createCompareNaturalFull = partial(createCompareNatural, { typed, compare })
const compareNatural = createCompareNaturalFull
export const createCompareTextFull = partial(createCompareText, { typed, matrix })
const compareText = createCompareTextFull
export const createEqualFull = partial(createEqual, { typed, matrix, equalScalar, type: { DenseMatrix } })
const equal = createEqualFull
export const createEqualTextFull = partial(createEqualText, { typed, compareText, isZero })
export const createSmallerFull = partial(createSmaller, { typed, matrix, equalScalar, divideScalar, type: { DenseMatrix } })
const smaller = createSmallerFull
export const createSmallerEqFull = partial(createSmallerEq, { typed, matrix, type: { DenseMatrix } })
export const createLargerFull = partial(createLarger, { typed, matrix, type: { DenseMatrix } })
const larger = createLargerFull
export const createLargerEqFull = partial(createLargerEq, { typed, matrix, type: { DenseMatrix } })
const largerEq = createLargerEqFull
export const createDeepEqualFull = partial(createDeepEqual, { typed, equal })
export const createUnequalFull = partial(createUnequal, { typed, matrix, type: { DenseMatrix } })
const unequal = createUnequalFull

// matrix (2)
export const createPartitionSelectFull = partial(createPartitionSelect, { typed, isNumeric, isNaN, compare })
const partitionSelect = createPartitionSelectFull
export const createSortFull = partial(createSort, { typed, matrix, compare, compareNatural })

// statistics (2)
export const createMaxFull = partial(createMax, { typed, larger })
const max = createMaxFull
export const createMinFull = partial(createMin, { typed, smaller })

// class (2)
export const createImmutableDenseMatrixClassFull = partial(createImmutableDenseMatrixClass, { smaller, type: { DenseMatrix } })
const ImmutableDenseMatrix = createImmutableDenseMatrixClassFull
export const createIndexClassFull = partial(createIndexClass, { type: { ImmutableDenseMatrix } })
const Index = createIndexClassFull
export const createFibonacciHeapClassFull = partial(createFibonacciHeapClass, { smaller, larger })
const FibonacciHeap = createFibonacciHeapClassFull
export const createSpaClassFull = partial(createSpaClass, { addScalar, equalScalar, type: { FibonacciHeap } })
const Spa = createSpaClassFull
export const createUnitClassFull = partial(createUnitClass, {
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
const Unit = createUnitClassFull

// create (2)
export const createSparseFull = partial(createSparse, { typed, type: { SparseMatrix } })
export const createUnitFull = partial(createUnit, { typed, type: { Unit } })
export const createCreateUnitFull = partial(createCreateUnit, { typed, type: { Unit } })

// trigonometry (2)
export const createAcosFull = partial(createAcos, { typed, type: { Complex } })
export const createAcoshFull = partial(createAcosh, { typed, type: { Complex } })
export const createAcotFull = partial(createAcot, { typed, type: { BigNumber } })
export const createAcothFull = partial(createAcoth, { typed, type: { Complex, BigNumber } })
export const createAcscFull = partial(createAcsc, { typed, type: { Complex, BigNumber } })
export const createAcschFull = partial(createAcsch, { typed, type: { BigNumber } })
export const createAsecFull = partial(createAsec, { typed, type: { Complex, BigNumber } })
export const createAsechFull = partial(createAsech, { typed, type: { Complex, BigNumber } })
export const createAsinFull = partial(createAsin, { typed, type: { Complex } })
export const createAsinhFull = partial(createAsinh, { typed })
export const createAtanFull = partial(createAtan, { typed })
export const createAtan2Full = partial(createAtan2, { typed, matrix, equalScalar, type: { BigNumber, DenseMatrix } })
export const createAtanhFull = partial(createAtanh, { typed, type: { Complex } })
export const createCosFull = partial(createCos, { typed, type: { Unit } })
export const createCoshFull = partial(createCosh, { typed, type: { Unit } })
export const createCotFull = partial(createCot, { typed, type: { BigNumber, Unit } })
export const createCothFull = partial(createCoth, { typed, type: { BigNumber, Unit } })
export const createCscFull = partial(createCsc, { typed, type: { BigNumber, Unit } })
export const createCschFull = partial(createCsch, { typed, type: { BigNumber, Unit } })
export const createSecFull = partial(createSec, { typed, type: { BigNumber, Unit } })
export const createSechFull = partial(createSech, { typed, type: { BigNumber, Unit } })
export const createSinFull = partial(createSin, { typed, type: { BigNumber, Unit } })
export const createSinhFull = partial(createSinh, { typed, type: { Unit } })
export const createTanFull = partial(createTan, { typed, type: { Unit } })
export const createTanhFull = partial(createTanh, { typed, type: { Unit } })

// set (2)
export const createSetCartesianFull = partial(createSetCartesian, { typed, size, subset, compareNatural, type: { Index, DenseMatrix } })
export const createSetDifferenceFull = partial(createSetDifference, { typed, size, subset, compareNatural, type: { Index, DenseMatrix } })
const setDifference = createSetDifferenceFull
export const createSetDistinctFull = partial(createSetDistinct, { typed, size, subset, compareNatural, type: { Index, DenseMatrix } })
export const createSetIntersectFull = partial(createSetIntersect, { typed, size, subset, compareNatural, type: { Index, DenseMatrix } })
const setIntersect = createSetIntersectFull
export const createSetIsSubsetFull = partial(createSetIsSubset, { typed, size, subset, compareNatural, type: { Index } })
export const createSetMultiplicityFull = partial(createSetMultiplicity, { typed, size, subset, compareNatural, type: { Index } })
export const createSetPowersetFull = partial(createSetPowerset, { typed, size, subset, compareNatural, type: { Index } })
export const createSetSizeFull = partial(createSetSize, { typed, compareNatural })
export const createSetSymDifferenceFull = partial(createSetSymDifference, { typed, size, concat, subset, setDifference, type: { Index } })
const setSymDifference = createSetSymDifferenceFull
export const createSetUnionFull = partial(createSetUnion, { typed, size, concat, subset, setIntersect, setSymDifference, type: { Index } })

// arithmetic (3)
export const createAddFull = partial(createAdd, { typed, matrix, addScalar, equalScalar, type: { DenseMatrix, SparseMatrix } })
const add = createAddFull
export const createHypotFull = partial(createHypot, { typed, abs, addScalar, divideScalar, multiplyScalar, sqrt, smaller, isPositive })
export const createNormFull = partial(createNorm, { typed, abs, add, pow, conj, sqrt, multiply, equalScalar, larger, smaller, matrix })

// matrix (3)
export const createDotFull = partial(createDot, { typed, add, multiply })
export const createTraceFull = partial(createTrace, { typed, matrix, add })
export const createIndexFull = partial(createIndex, { typed, type: { Index } })

// expression (3)
export const createNodeFull = createNode
const Node = createNodeFull
export const createAccessorNodeFull = partial(createAccessorNode, { subset, expression: { node: { Node } } })
const AccessorNode = createAccessorNodeFull
export const createArrayNodeFull = partial(createArrayNode, { expression: { node: { Node } } })
const ArrayNode = createArrayNodeFull
export const createAssignmentNodeFull = partial(createAssignmentNode, { subset, matrix, expression: { node: { Node } } })
const AssignmentNode = createAssignmentNodeFull
export const createBlockNodeFull = partial(createBlockNode, { type: { ResultSet }, expression: { node: { Node } } })
const BlockNode = createBlockNodeFull
export const createConditionalNodeFull = partial(createConditionalNode, { expression: { node: { Node } } })
const ConditionalNode = createConditionalNodeFull
export const createConstantNodeFull = partial(createConstantNode, { expression: { node: { Node } } })
const ConstantNode = createConstantNodeFull
export const createFunctionAssignmentNodeFull = partial(createFunctionAssignmentNode, { typed, expression: { node: { Node } } })
const FunctionAssignmentNode = createFunctionAssignmentNodeFull
export const createIndexNodeFull = partial(createIndexNode, { type: { Range }, expression: { node: { Node } } })
const IndexNode = createIndexNodeFull
export const createObjectNodeFull = partial(createObjectNode, { expression: { node: { Node } } })
const ObjectNode = createObjectNodeFull
export const createOperatorNodeFull = partial(createOperatorNode, { expression: { node: { Node } } })
const OperatorNode = createOperatorNodeFull
export const createParenthesisNodeFull = partial(createParenthesisNode, { expression: { node: { Node } } })
const ParenthesisNode = createParenthesisNodeFull
export const createRangeNodeFull = partial(createRangeNode, { expression: { node: { Node } } })
const RangeNode = createRangeNodeFull
export const createRelationalNodeFull = partial(createRelationalNode, { expression: { node: { Node } } })
const RelationalNode = createRelationalNodeFull
export const createSymbolNodeFull = partial(createSymbolNode, { type: { Unit }, expression: { node: { Node } } })
const SymbolNode = createSymbolNodeFull
export const createFunctionNodeFull = partial(createFunctionNode, { expression: { node: { Node, SymbolNode } } })
const FunctionNode = createFunctionNodeFull
const createParseExpressionFull = partial(createParseExpression, {
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
const parseExpression = createParseExpressionFull
export const createParseFull = partial(createParse, { typed, expression: { parse: parseExpression } })
const parse = createParseFull
export const createCompileFull = partial(createCompile, { typed, expression: { parse: parseExpression } })
export const createEvalFull = partial(createEval, { typed, expression: { parse: parseExpression } })
export const createParserClassFull = partial(createParserClass, { expression: { parse: parseExpression } })
const Parser = createParserClassFull

// create (3)
export const createParserFull = partial(createParser, { typed, expression: { Parser } })

// algebra (3)
export const createLupFull = partial(createLup, {
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
const lup = createLupFull
export const createQrFull = partial(createQr, {
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
export const createSluFull = partial(createSlu, { typed, abs, add, multiply, transpose, divideScalar, subtract, larger, largerEq, type: { SparseMatrix } })
const slu = createSluFull
export const createLusolveFull = partial(createLusolve, { typed, matrix, lup, slu, usolve, lsolve, type: { DenseMatrix } })

// class (3)
export const createHelpClassFull = partial(createHelpClass, { expression: { parse: parseExpression } })
const Help = createHelpClassFull
export const createChainClassFull = createChainClass
const Chain = createChainClassFull

// type (3)
const docs = createEmbeddedDocs
export const createHelpFull = partial(createHelp, { typed, expression: { docs }, type: { Help } })
export const createChainFull = partial(createChain, { typed, type: { Chain } })

// matrix (4)
export const createDetFull = partial(createDet, { typed, matrix, subtract, multiply, unaryMinus, lup })
const det = createDetFull
export const createInvFull = partial(createInv, { typed, matrix, divideScalar, addScalar, multiply, unaryMinus, det, identity, abs })
const inv = createInvFull
export const createExpmFull = partial(createExpm, { typed, abs, add, identity, inv, multiply })
export const createSqrtmFull = partial(createSqrtm, { typed, abs, add, multiply, sqrt, subtract, inv, size, max, identity })

// arithmetic (4)
export const createDivideFull = partial(createDivide, { typed, matrix, multiply, equalScalar, divideScalar, inv })
const divide = createDivideFull

// geometry (4)
export const createDistanceFull = partial(createDistance, { typed, addScalar, subtract, multiplyScalar, divideScalar, unaryMinus, sqrt, abs })
export const createIntersectFull = partial(createIntersect, { typed, abs, add, addScalar, matrix, multiply, multiplyScalar, divideScalar, subtract, smaller, equalScalar })

// statistics (4)
export const createSumFull = partial(createSum, { typed, add, type: { BigNumber, Fraction } })
const sum = createSumFull
export const createMeanFull = partial(createMean, { typed, add, divide })
export const createMedianFull = partial(createMedian, { typed, add, divide, compare, partitionSelect })
const median = createMedianFull
export const createMadFull = partial(createMad, { typed, abs, map, median, subtract })
export const createVarianceFull = partial(createVariance, { typed, add, subtract, multiply, divide, isNaN })
const variance = createVarianceFull
export const createQuantileSeqFull = partial(createQuantileSeq, { typed, add, multiply, partitionSelect, compare, type: { BigNumber } })
export const createStdFull = partial(createStd, { typed, sqrt, variance })

// probability (4)
const createDistributionFull = partial(createDistribution, { typed, matrix })
const distribution = createDistributionFull
export const createCombinationsFull = partial(createCombinations, { typed, type: { BigNumber } })
const combinations = createCombinationsFull
export const createGammaFull = partial(createGamma, { typed, multiplyScalar, pow, type: { BigNumber, Complex } })
const gamma = createGammaFull
export const createFactorialFull = partial(createFactorial, { typed, gamma })
const factorial = createFactorialFull
export const createKldivergenceFull = partial(createKldivergence, { typed, matrix, divide, sum, multiply, dotDivide, log, isNumeric })
export const createMultinomialFull = partial(createMultinomial, { typed, add, divide, multiply, factorial, isInteger, isPositive })
export const createPermutationsFull = partial(createPermutations, { typed, factorial })
export const createPickRandomFull = partial(createPickRandom, { distribution })
export const createRandomFull = partial(createRandom, { distribution })
export const createRandomIntFull = partial(createRandomInt, { distribution })

// combinatorics (4)
export const createStirlingS2Full = partial(createStirlingS2, { typed, addScalar, subtract, multiplyScalar, divideScalar, pow, factorial, combinations, isNegative, isInteger, larger })
const stirlingS2 = createStirlingS2Full
export const createBellNumbersFull = partial(createBellNumbers, { typed, addScalar, isNegative, isInteger, stirlingS2 })
export const createCatalanFull = partial(createCatalan, { typed, addScalar, divideScalar, multiplyScalar, combinations, isNegative, isInteger })
export const createCompositionFull = partial(createComposition, { typed, addScalar, combinations, isPositive, isNegative, isInteger, larger })

// algebra (4)
const createSimplifyCoreFull = partial(createSimplifyCore, {
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
const simplifyCore = createSimplifyCoreFull
const createSimplifyConstantFull = partial(createSimplifyConstant, {
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
const simplifyConstant = createSimplifyConstantFull
const createResolveFull = partial(createResolve, { expression: { parse: parseExpression, node: { Node, FunctionNode, OperatorNode, ParenthesisNode } } })
const resolve = createResolveFull
export const createSimplifyFull = partial(createSimplify, {
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
const simplify = createSimplifyFull
export const createDerivativeFull = partial(createDerivative, {
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
export const createRationalizeFull = partial(createRationalize, {
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

export const createReviverFull = partial(createReviver, {
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
export const createTrueFull = createTrue
export const createFalseFull = createFalse
export const createNullFull = createNull
export const createInfinityFull = partial(createInfinity, constantsDependencies)
export const createNaNFull = partial(createNaN, constantsDependencies)
export const createPiFull = partial(createPi, constantsDependencies)
export const createTauFull = partial(createTau, constantsDependencies)
export const createEFull = partial(createE, constantsDependencies)
export const createPhiFull = partial(createPhi, constantsDependencies)
export const createLN2Full = partial(createLN2, constantsDependencies)
export const createLN10Full = partial(createLN10, constantsDependencies)
export const createLOG2EFull = partial(createLOG2E, constantsDependencies)
export const createLOG10EFull = partial(createLOG10E, constantsDependencies)
export const createSQRTHalfFull = partial(createSQRTHalf, constantsDependencies)
export const createSQRT2Full = partial(createSQRT2, constantsDependencies)
export const createIFull = partial(createI, { type: { Complex } })
export const createVersionFull = createVersion

// FIXME: export physical constants
