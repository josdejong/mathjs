/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
import {
  createResultSet,
  createRangeClass,
  createTyped,
  createClone,
  createIsNumeric,
  createHasNumericValue,
  createTypeOf,
  createEqualScalar,
  createNumber,
  createString,
  createBoolean,
  createNthRoot,
  createFilter,
  createForEach,
  createMap,
  createRange,
  createErf,
  createMode,
  createProd,
  createFormat,
  createPrint,
  createIsPrime,
  createNumeric,
  createRound,
  createCompare,
  createCompareNatural,
  createCompareText,
  createEqual,
  createEqualText,
  createSmaller,
  createSmallerEq,
  createLarger,
  createLargerEq,
  createDeepEqual,
  createUnequal,
  createPartitionSelect,
  createMax,
  createMin,
  createE,
  createUppercaseE,
  createFalse,
  createInfinity,
  createLN10,
  createLN2,
  createLOG10E,
  createLOG2E,
  createNaN,
  createNull,
  createPhi,
  createPi,
  createUppercasePi,
  createSQRT1_2, // eslint-disable-line camelcase
  createSQRT2,
  createTau,
  createTrue,
  createVersion,
  createHypot,
  createSum,
  createMean,
  createMedian,
  createMad,
  createVariance,
  createQuantileSeq,
  createStd,
  createFactorial,
  createMultinomial,
  createPermutations,
  createPickRandom,
  createRandom,
  createRandomInt,
  createStirlingS2,
  createBellNumbers,
  createCatalan,
  createComposition,
  createFilterTransform,
  createForEachTransform,
  createMapTransform,
  createMaxTransform,
  createMeanTransform,
  createMinTransform,
  createRangeTransform,
  createSubsetTransform,
  createSumTransform,
  createNode,
  createAccessorNode,
  createArrayNode,
  createAssignmentNode,
  createBlockNode,
  createConditionalNode,
  createConstantNode,
  createFunctionAssignmentNode,
  createIndexNode,
  createObjectNode,
  createOperatorNode,
  createParenthesisNode,
  createRangeNode,
  createRelationalNode,
  createSymbolNode,
  createFunctionNode,
  createParse,
  createCompile,
  createEvaluate,
  createParserClass,
  createParser,
  createHelpClass,
  createChainClass,
  createHelp,
  createChain,
  createSimplify,
  createDerivative,
  createRationalize,
  createReviver,
  createIsInteger,
  createIsNegative,
  createIsPositive,
  createIsZero,
  createIsNaN,
  createMatrix,
  createUnaryMinus,
  createUnaryPlus,
  createAbs,
  createAddScalar,
  createCbrt,
  createCeil,
  createCube,
  createExp,
  createExpm1,
  createFix,
  createFloor,
  createGcd,
  createLcm,
  createLog10,
  createLog2,
  createMod,
  createMultiplyScalar,
  createMultiply,
  createSign,
  createSqrt,
  createSquare,
  createSubtract,
  createXgcd,
  createbitAnd,
  createbitNot,
  createbitOr,
  createbitXor,
  createNot,
  createOr,
  createXor,
  createSubset,
  createDivideScalar,
  createPow,
  createLog,
  createLog1p,
  createLeftShift,
  createRightArithShift,
  createRightLogShift,
  createAnd,
  createAcos,
  createAcosh,
  createAcot,
  createAcoth,
  createAcsc,
  createAcsch,
  createAsec,
  createAsech,
  createAsin,
  createAsinh,
  createAtan,
  createAtan2,
  createAtanh,
  createCos,
  createCosh,
  createCot,
  createCoth,
  createCsc,
  createCsch,
  createSec,
  createSech,
  createSin,
  createSinh,
  createTan,
  createTanh,
  createAdd,
  createNorm,
  createDivide,
  createCombinations,
  createGamma
} from '../factoriesNumber'
export { all } from './allNumber.js'

export const ResultSetDependencies = {
  createResultSet
}

export const typedDependencies = {
  createTyped
}

export const isNumericDependencies = {
  typedDependencies,
  createIsNumeric
}

export const typeOfDependencies = {
  typedDependencies,
  createTypeOf
}

export const numberDependencies = {
  typedDependencies,
  createNumber
}

export const booleanDependencies = {
  typedDependencies,
  createBoolean
}

export const filterDependencies = {
  typedDependencies,
  createFilter
}

export const mapDependencies = {
  typedDependencies,
  createMap
}

export const erfDependencies = {
  typedDependencies,
  createErf
}

export const formatDependencies = {
  typedDependencies,
  createFormat
}

export const isPrimeDependencies = {
  typedDependencies,
  createIsPrime
}

export const roundDependencies = {
  typedDependencies,
  createRound
}

export const compareTextDependencies = {
  typedDependencies,
  createCompareText
}

export const smallerDependencies = {
  typedDependencies,
  createSmaller
}

export const largerDependencies = {
  typedDependencies,
  createLarger
}

export const maxDependencies = {
  largerDependencies,
  typedDependencies,
  createMax
}

export const eDependencies = {
  createE
}

export const falseDependencies = {
  createFalse
}

export const LN10Dependencies = {
  createLN10
}

export const LOG10EDependencies = {
  createLOG10E
}

export const NaNDependencies = {
  createNaN
}

export const phiDependencies = {
  createPhi
}

export const SQRT1_2Dependencies = { // eslint-disable-line camelcase
  createSQRT1_2
}

export const tauDependencies = {
  createTau
}

export const versionDependencies = {
  createVersion
}

export const pickRandomDependencies = {
  typedDependencies,
  createPickRandom
}

export const randomIntDependencies = {
  typedDependencies,
  createRandomInt
}

export const filterTransformDependencies = {
  typedDependencies,
  createFilterTransform
}

export const mapTransformDependencies = {
  typedDependencies,
  createMapTransform
}

export const minTransformDependencies = {
  smallerDependencies,
  typedDependencies,
  createMinTransform
}

export const NodeDependencies = {
  createNode
}

export const ArrayNodeDependencies = {
  NodeDependencies,
  createArrayNode
}

export const BlockNodeDependencies = {
  NodeDependencies,
  ResultSetDependencies,
  createBlockNode
}

export const ConstantNodeDependencies = {
  NodeDependencies,
  createConstantNode
}

export const ObjectNodeDependencies = {
  NodeDependencies,
  createObjectNode
}

export const ParenthesisNodeDependencies = {
  NodeDependencies,
  createParenthesisNode
}

export const RelationalNodeDependencies = {
  NodeDependencies,
  createRelationalNode
}

export const ChainDependencies = {
  createChainClass
}

export const chainDependencies = {
  ChainDependencies,
  typedDependencies,
  createChain
}

export const reviverDependencies = {
  createReviver
}

export const isNegativeDependencies = {
  typedDependencies,
  createIsNegative
}

export const isZeroDependencies = {
  typedDependencies,
  createIsZero
}

export const matrixDependencies = {
  createMatrix
}

export const unaryPlusDependencies = {
  typedDependencies,
  createUnaryPlus
}

export const addScalarDependencies = {
  typedDependencies,
  createAddScalar
}

export const ceilDependencies = {
  typedDependencies,
  createCeil
}

export const expDependencies = {
  typedDependencies,
  createExp
}

export const fixDependencies = {
  typedDependencies,
  createFix
}

export const gcdDependencies = {
  typedDependencies,
  createGcd
}

export const log10Dependencies = {
  typedDependencies,
  createLog10
}

export const modDependencies = {
  typedDependencies,
  createMod
}

export const multiplyDependencies = {
  typedDependencies,
  createMultiply
}

export const sqrtDependencies = {
  typedDependencies,
  createSqrt
}

export const subtractDependencies = {
  typedDependencies,
  createSubtract
}

export const bitAndDependencies = {
  typedDependencies,
  createbitAnd
}

export const bitOrDependencies = {
  typedDependencies,
  createbitOr
}

export const notDependencies = {
  typedDependencies,
  createNot
}

export const xorDependencies = {
  typedDependencies,
  createXor
}

export const divideScalarDependencies = {
  typedDependencies,
  createDivideScalar
}

export const logDependencies = {
  typedDependencies,
  createLog
}

export const leftShiftDependencies = {
  typedDependencies,
  createLeftShift
}

export const rightLogShiftDependencies = {
  typedDependencies,
  createRightLogShift
}

export const acosDependencies = {
  typedDependencies,
  createAcos
}

export const acotDependencies = {
  typedDependencies,
  createAcot
}

export const acscDependencies = {
  typedDependencies,
  createAcsc
}

export const asecDependencies = {
  typedDependencies,
  createAsec
}

export const asinDependencies = {
  typedDependencies,
  createAsin
}

export const atanDependencies = {
  typedDependencies,
  createAtan
}

export const atanhDependencies = {
  typedDependencies,
  createAtanh
}

export const coshDependencies = {
  typedDependencies,
  createCosh
}

export const cothDependencies = {
  typedDependencies,
  createCoth
}

export const cschDependencies = {
  typedDependencies,
  createCsch
}

export const sechDependencies = {
  typedDependencies,
  createSech
}

export const sinhDependencies = {
  typedDependencies,
  createSinh
}

export const tanhDependencies = {
  typedDependencies,
  createTanh
}

export const normDependencies = {
  typedDependencies,
  createNorm
}

export const combinationsDependencies = {
  typedDependencies,
  createCombinations
}

export const RangeDependencies = {
  createRangeClass
}

export const hasNumericValueDependencies = {
  isNumericDependencies,
  typedDependencies,
  createHasNumericValue
}

export const stringDependencies = {
  typedDependencies,
  createString
}

export const forEachDependencies = {
  typedDependencies,
  createForEach
}

export const prodDependencies = {
  multiplyDependencies,
  typedDependencies,
  createProd
}

export const numericDependencies = {
  numberDependencies,
  createNumeric
}

export const equalTextDependencies = {
  compareTextDependencies,
  isZeroDependencies,
  typedDependencies,
  createEqualText
}

export const largerEqDependencies = {
  typedDependencies,
  createLargerEq
}

export const minDependencies = {
  smallerDependencies,
  typedDependencies,
  createMin
}

export const InfinityDependencies = {
  createInfinity
}

export const LOG2EDependencies = {
  createLOG2E
}

export const piDependencies = {
  createPi
}

export const SQRT2Dependencies = {
  createSQRT2
}

export const randomDependencies = {
  typedDependencies,
  createRandom
}

export const forEachTransformDependencies = {
  typedDependencies,
  createForEachTransform
}

export const rangeTransformDependencies = {
  matrixDependencies,
  typedDependencies,
  createRangeTransform
}

export const ConditionalNodeDependencies = {
  NodeDependencies,
  createConditionalNode
}

export const IndexNodeDependencies = {
  NodeDependencies,
  RangeDependencies,
  createIndexNode
}

export const RangeNodeDependencies = {
  NodeDependencies,
  createRangeNode
}

export const isIntegerDependencies = {
  typedDependencies,
  createIsInteger
}

export const isNaNDependencies = {
  typedDependencies,
  createIsNaN
}

export const absDependencies = {
  typedDependencies,
  createAbs
}

export const cubeDependencies = {
  typedDependencies,
  createCube
}

export const floorDependencies = {
  typedDependencies,
  createFloor
}

export const log2Dependencies = {
  typedDependencies,
  createLog2
}

export const signDependencies = {
  typedDependencies,
  createSign
}

export const xgcdDependencies = {
  typedDependencies,
  createXgcd
}

export const bitXorDependencies = {
  typedDependencies,
  createbitXor
}

export const subsetDependencies = {
  createSubset
}

export const log1pDependencies = {
  typedDependencies,
  createLog1p
}

export const andDependencies = {
  typedDependencies,
  createAnd
}

export const acothDependencies = {
  typedDependencies,
  createAcoth
}

export const asechDependencies = {
  typedDependencies,
  createAsech
}

export const atan2Dependencies = {
  typedDependencies,
  createAtan2
}

export const cotDependencies = {
  typedDependencies,
  createCot
}

export const secDependencies = {
  typedDependencies,
  createSec
}

export const tanDependencies = {
  typedDependencies,
  createTan
}

export const divideDependencies = {
  typedDependencies,
  createDivide
}

export const cloneDependencies = {
  typedDependencies,
  createClone
}

export const nthRootDependencies = {
  typedDependencies,
  createNthRoot
}

export const modeDependencies = {
  isNaNDependencies,
  isNumericDependencies,
  typedDependencies,
  createMode
}

export const compareDependencies = {
  typedDependencies,
  createCompare
}

export const smallerEqDependencies = {
  typedDependencies,
  createSmallerEq
}

export const partitionSelectDependencies = {
  compareDependencies,
  isNaNDependencies,
  isNumericDependencies,
  typedDependencies,
  createPartitionSelect
}

export const LN2Dependencies = {
  createLN2
}

export const PIDependencies = {
  piDependencies,
  createUppercasePi
}

export const maxTransformDependencies = {
  largerDependencies,
  typedDependencies,
  createMaxTransform
}

export const subsetTransformDependencies = {
  matrixDependencies,
  typedDependencies,
  createSubsetTransform
}

export const AccessorNodeDependencies = {
  NodeDependencies,
  subsetDependencies,
  createAccessorNode
}

export const FunctionAssignmentNodeDependencies = {
  NodeDependencies,
  typedDependencies,
  createFunctionAssignmentNode
}

export const SymbolNodeDependencies = {
  NodeDependencies,
  createSymbolNode
}

export const isPositiveDependencies = {
  typedDependencies,
  createIsPositive
}

export const cbrtDependencies = {
  typedDependencies,
  createCbrt
}

export const lcmDependencies = {
  typedDependencies,
  createLcm
}

export const squareDependencies = {
  typedDependencies,
  createSquare
}

export const orDependencies = {
  typedDependencies,
  createOr
}

export const rightArithShiftDependencies = {
  typedDependencies,
  createRightArithShift
}

export const acschDependencies = {
  typedDependencies,
  createAcsch
}

export const cosDependencies = {
  typedDependencies,
  createCos
}

export const sinDependencies = {
  typedDependencies,
  createSin
}

export const gammaDependencies = {
  typedDependencies,
  createGamma
}

export const equalScalarDependencies = {
  typedDependencies,
  createEqualScalar
}

export const printDependencies = {
  typedDependencies,
  createPrint
}

export const equalDependencies = {
  equalScalarDependencies,
  typedDependencies,
  createEqual
}

export const unequalDependencies = {
  equalScalarDependencies,
  typedDependencies,
  createUnequal
}

export const nullDependencies = {
  createNull
}

export const factorialDependencies = {
  gammaDependencies,
  typedDependencies,
  createFactorial
}

export const permutationsDependencies = {
  factorialDependencies,
  typedDependencies,
  createPermutations
}

export const compositionDependencies = {
  addScalarDependencies,
  combinationsDependencies,
  isIntegerDependencies,
  isNegativeDependencies,
  isPositiveDependencies,
  largerDependencies,
  typedDependencies,
  createComposition
}

export const AssignmentNodeDependencies = {
  matrixDependencies,
  NodeDependencies,
  subsetDependencies,
  createAssignmentNode
}

export const FunctionNodeDependencies = {
  NodeDependencies,
  SymbolNodeDependencies,
  createFunctionNode
}

export const unaryMinusDependencies = {
  typedDependencies,
  createUnaryMinus
}

export const multiplyScalarDependencies = {
  typedDependencies,
  createMultiplyScalar
}

export const powDependencies = {
  typedDependencies,
  createPow
}

export const asinhDependencies = {
  typedDependencies,
  createAsinh
}

export const addDependencies = {
  typedDependencies,
  createAdd
}

export const rangeDependencies = {
  matrixDependencies,
  typedDependencies,
  createRange
}

export const deepEqualDependencies = {
  equalDependencies,
  typedDependencies,
  createDeepEqual
}

export const trueDependencies = {
  createTrue
}

export const sumDependencies = {
  addDependencies,
  typedDependencies,
  createSum
}

export const medianDependencies = {
  addDependencies,
  compareDependencies,
  divideDependencies,
  partitionSelectDependencies,
  typedDependencies,
  createMedian
}

export const varianceDependencies = {
  addDependencies,
  divideDependencies,
  isNaNDependencies,
  multiplyDependencies,
  subtractDependencies,
  typedDependencies,
  createVariance
}

export const stdDependencies = {
  sqrtDependencies,
  typedDependencies,
  varianceDependencies,
  createStd
}

export const stirlingS2Dependencies = {
  addScalarDependencies,
  combinationsDependencies,
  divideScalarDependencies,
  factorialDependencies,
  isIntegerDependencies,
  isNegativeDependencies,
  largerDependencies,
  multiplyScalarDependencies,
  powDependencies,
  subtractDependencies,
  typedDependencies,
  createStirlingS2
}

export const catalanDependencies = {
  addScalarDependencies,
  combinationsDependencies,
  divideScalarDependencies,
  isIntegerDependencies,
  isNegativeDependencies,
  multiplyScalarDependencies,
  typedDependencies,
  createCatalan
}

export const sumTransformDependencies = {
  addDependencies,
  typedDependencies,
  createSumTransform
}

export const expm1Dependencies = {
  typedDependencies,
  createExpm1
}

export const acoshDependencies = {
  typedDependencies,
  createAcosh
}

export const compareNaturalDependencies = {
  compareDependencies,
  typedDependencies,
  createCompareNatural
}

export const hypotDependencies = {
  absDependencies,
  addScalarDependencies,
  divideScalarDependencies,
  isPositiveDependencies,
  multiplyScalarDependencies,
  smallerDependencies,
  sqrtDependencies,
  typedDependencies,
  createHypot
}

export const madDependencies = {
  absDependencies,
  mapDependencies,
  medianDependencies,
  subtractDependencies,
  typedDependencies,
  createMad
}

export const multinomialDependencies = {
  addDependencies,
  divideDependencies,
  factorialDependencies,
  isIntegerDependencies,
  isPositiveDependencies,
  multiplyDependencies,
  typedDependencies,
  createMultinomial
}

export const meanTransformDependencies = {
  addDependencies,
  divideDependencies,
  typedDependencies,
  createMeanTransform
}

export const bitNotDependencies = {
  typedDependencies,
  createbitNot
}

export const EDependencies = {
  eDependencies,
  createUppercaseE
}

export const quantileSeqDependencies = {
  addDependencies,
  compareDependencies,
  multiplyDependencies,
  partitionSelectDependencies,
  typedDependencies,
  createQuantileSeq
}

export const OperatorNodeDependencies = {
  NodeDependencies,
  createOperatorNode
}

export const cscDependencies = {
  typedDependencies,
  createCsc
}

export const meanDependencies = {
  addDependencies,
  divideDependencies,
  typedDependencies,
  createMean
}

export const parseDependencies = {
  AccessorNodeDependencies,
  ArrayNodeDependencies,
  AssignmentNodeDependencies,
  BlockNodeDependencies,
  ConditionalNodeDependencies,
  ConstantNodeDependencies,
  FunctionAssignmentNodeDependencies,
  FunctionNodeDependencies,
  IndexNodeDependencies,
  ObjectNodeDependencies,
  OperatorNodeDependencies,
  ParenthesisNodeDependencies,
  RangeNodeDependencies,
  RelationalNodeDependencies,
  SymbolNodeDependencies,
  numericDependencies,
  typedDependencies,
  createParse
}

export const evaluateDependencies = {
  parseDependencies,
  typedDependencies,
  createEvaluate
}

export const HelpDependencies = {
  parseDependencies,
  createHelpClass
}

export const simplifyDependencies = {
  ConstantNodeDependencies,
  FunctionNodeDependencies,
  OperatorNodeDependencies,
  ParenthesisNodeDependencies,
  SymbolNodeDependencies,
  addDependencies,
  divideDependencies,
  equalDependencies,
  isZeroDependencies,
  multiplyDependencies,
  parseDependencies,
  powDependencies,
  subtractDependencies,
  typedDependencies,
  createSimplify
}

export const rationalizeDependencies = {
  ConstantNodeDependencies,
  FunctionNodeDependencies,
  OperatorNodeDependencies,
  ParenthesisNodeDependencies,
  SymbolNodeDependencies,
  addDependencies,
  divideDependencies,
  equalDependencies,
  isZeroDependencies,
  multiplyDependencies,
  parseDependencies,
  powDependencies,
  simplifyDependencies,
  subtractDependencies,
  typedDependencies,
  createRationalize
}

export const bellNumbersDependencies = {
  addScalarDependencies,
  isIntegerDependencies,
  isNegativeDependencies,
  stirlingS2Dependencies,
  typedDependencies,
  createBellNumbers
}

export const ParserDependencies = {
  parseDependencies,
  createParserClass
}

export const helpDependencies = {
  HelpDependencies,
  typedDependencies,
  createHelp
}

export const compileDependencies = {
  parseDependencies,
  typedDependencies,
  createCompile
}

export const derivativeDependencies = {
  ConstantNodeDependencies,
  FunctionNodeDependencies,
  OperatorNodeDependencies,
  ParenthesisNodeDependencies,
  SymbolNodeDependencies,
  equalDependencies,
  isZeroDependencies,
  numericDependencies,
  parseDependencies,
  simplifyDependencies,
  typedDependencies,
  createDerivative
}

export const parserDependencies = {
  ParserDependencies,
  typedDependencies,
  createParser
}
