import {
  absNumber,
  acoshNumber,
  acosNumber,
  acothNumber,
  acotNumber,
  acschNumber,
  acscNumber,
  addNumber,
  andNumber,
  asechNumber,
  asecNumber,
  asinhNumber,
  asinNumber,
  atan2Number,
  atanhNumber,
  atanNumber,
  bitAndNumber,
  bitNotNumber,
  bitOrNumber,
  bitXorNumber,
  cbrtNumber,
  ceilNumber,
  combinationsNumber,
  coshNumber,
  cosNumber,
  cothNumber,
  cotNumber,
  cschNumber,
  cscNumber,
  cubeNumber,
  divideNumber,
  expm1Number,
  expNumber,
  fixNumber,
  floorNumber,
  gammaNumber,
  gcdNumber,
  isIntegerNumber,
  isNaNNumber,
  isNegativeNumber,
  isPositiveNumber,
  isZeroNumber,
  lcmNumber,
  leftShiftNumber,
  log10Number,
  log1pNumber,
  log2Number,
  logNumber,
  modNumber,
  multiplyNumber,
  normNumber,
  notNumber,
  orNumber,
  powNumber,
  rightArithShiftNumber,
  rightLogShiftNumber,
  sechNumber,
  secNumber,
  signNumber,
  sinhNumber,
  sinNumber,
  sqrtNumber,
  squareNumber,
  subtractNumber,
  tanhNumber,
  tanNumber,
  unaryMinusNumber,
  unaryPlusNumber,
  xgcdNumber,
  xorNumber
} from './plain/number'

import { factory } from './utils/factory'
import { noIndex, noMatrix, noSubset } from './utils/noop'

// ----------------------------------------------------------------------------
// classes and functions

// core
export { createTyped } from './core/function/typed'

// classes
export { createResultSet } from './type/resultset/ResultSet'
export { createRangeClass } from './type/matrix/Range'
export { createHelpClass } from './expression/Help'
export { createChainClass } from './type/chain/Chain'
export { createHelp } from './expression/function/help'
export { createChain } from './type/chain/function/chain'

// algebra
export { createSimplify } from './function/algebra/simplify'
export { createDerivative } from './function/algebra/derivative'
export { createRationalize } from './function/algebra/rationalize'

// arithmetic
export const createUnaryMinus = /* #__PURE__ */ createNumberFactory('unaryMinus', unaryMinusNumber)
export const createUnaryPlus = /* #__PURE__ */ createNumberFactory('unaryPlus', unaryPlusNumber)
export const createAbs = /* #__PURE__ */ createNumberFactory('abs', absNumber)
export const createAddScalar = /* #__PURE__ */ createNumberFactory('addScalar', addNumber)
export const createCbrt = /* #__PURE__ */ createNumberFactory('cbrt', cbrtNumber)
export const createCeil = /* #__PURE__ */ createNumberFactory('ceil', ceilNumber)
export const createCube = /* #__PURE__ */ createNumberFactory('cube', cubeNumber)
export const createExp = /* #__PURE__ */ createNumberFactory('exp', expNumber)
export const createExpm1 = /* #__PURE__ */ createNumberFactory('expm1', expm1Number)
export const createFix = /* #__PURE__ */ createNumberFactory('fix', fixNumber)
export const createFloor = /* #__PURE__ */ createNumberFactory('floor', floorNumber)
export const createGcd = /* #__PURE__ */ createNumberFactory('gcd', gcdNumber)
export const createLcm = /* #__PURE__ */ createNumberFactory('lcm', lcmNumber)
export const createLog10 = /* #__PURE__ */ createNumberFactory('log10', log10Number)
export const createLog2 = /* #__PURE__ */ createNumberFactory('log2', log2Number)
export const createMod = /* #__PURE__ */ createNumberFactory('mod', modNumber)
export const createMultiplyScalar = /* #__PURE__ */ createNumberFactory('multiplyScalar', multiplyNumber)
export const createMultiply = /* #__PURE__ */ createNumberFactory('multiply', multiplyNumber)
export { createNthRootNumber as createNthRoot } from './function/arithmetic/nthRoot'
export const createSign = /* #__PURE__ */ createNumberFactory('sign', signNumber)
export const createSqrt = /* #__PURE__ */ createNumberFactory('sqrt', sqrtNumber)
export const createSquare = /* #__PURE__ */ createNumberFactory('square', squareNumber)
export const createSubtract = /* #__PURE__ */ createNumberFactory('subtract', subtractNumber)
export const createXgcd = /* #__PURE__ */ createNumberFactory('xgcd', xgcdNumber)
export const createDivideScalar = /* #__PURE__ */ createNumberFactory('divideScalar', divideNumber)
export const createPow = /* #__PURE__ */ createNumberFactory('pow', powNumber)
export { createRoundNumber as createRound } from './function/arithmetic/round'
export const createLog = /* #__PURE__ */ createNumberFactory('log', logNumber)
export const createLog1p = /* #__PURE__ */ createNumberFactory('log1p', log1pNumber)
export const createAdd = /* #__PURE__ */ createNumberFactory('add', addNumber)
export { createHypot } from './function/arithmetic/hypot'
export const createNorm = /* #__PURE__ */ createNumberFactory('norm', normNumber)
export const createDivide = /* #__PURE__ */ createNumberFactory('divide', divideNumber)

// bitwise
export const createBitAnd = /* #__PURE__ */ createNumberFactory('bitAnd', bitAndNumber)
export const createBitNot = /* #__PURE__ */ createNumberFactory('bitNot', bitNotNumber)
export const createBitOr = /* #__PURE__ */ createNumberFactory('bitOr', bitOrNumber)
export const createBitXor = /* #__PURE__ */ createNumberFactory('bitXor', bitXorNumber)
export const createLeftShift = /* #__PURE__ */ createNumberFactory('leftShift', leftShiftNumber)
export const createRightArithShift = /* #__PURE__ */ createNumberFactory('rightArithShift', rightArithShiftNumber)
export const createRightLogShift = /* #__PURE__ */ createNumberFactory('rightLogShift', rightLogShiftNumber)

// combinatorics
export { createStirlingS2 } from './function/combinatorics/stirlingS2'
export { createBellNumbers } from './function/combinatorics/bellNumbers'
export { createCatalan } from './function/combinatorics/catalan'
export { createComposition } from './function/combinatorics/composition'

// constants
export {
  createE,
  createUppercaseE,
  createFalse,
  // createI,
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
  createVersion
} from './constants'

// create
export { createNumber } from './type/number'
export { createString } from './type/string'
export { createBoolean } from './type/boolean'
export { createParser } from './expression/function/parser'

// expression
export { createNode } from './expression/node/Node'
export { createAccessorNode } from './expression/node/AccessorNode'
export { createArrayNode } from './expression/node/ArrayNode'
export { createAssignmentNode } from './expression/node/AssignmentNode'
export { createBlockNode } from './expression/node/BlockNode'
export { createConditionalNode } from './expression/node/ConditionalNode'
export { createConstantNode } from './expression/node/ConstantNode'
export { createFunctionAssignmentNode } from './expression/node/FunctionAssignmentNode'
export { createIndexNode } from './expression/node/IndexNode'
export { createObjectNode } from './expression/node/ObjectNode'
export { createOperatorNode } from './expression/node/OperatorNode'
export { createParenthesisNode } from './expression/node/ParenthesisNode'
export { createRangeNode } from './expression/node/RangeNode'
export { createRelationalNode } from './expression/node/RelationalNode'
export { createSymbolNode } from './expression/node/SymbolNode'
export { createFunctionNode } from './expression/node/FunctionNode'
export { createParse } from './expression/parse'
export { createCompile } from './expression/function/compile'
export { createEvaluate } from './expression/function/evaluate'
export { createParserClass } from './expression/Parser'

// logical
export const createAnd = /* #__PURE__ */ createNumberFactory('and', andNumber)
export const createNot = /* #__PURE__ */ createNumberFactory('not', notNumber)
export const createOr = /* #__PURE__ */ createNumberFactory('or', orNumber)
export const createXor = /* #__PURE__ */ createNumberFactory('xor', xorNumber)

// matrix
export { createApply } from './function/matrix/apply'
export { createFilter } from './function/matrix/filter'
export { createForEach } from './function/matrix/forEach'
export { createMap } from './function/matrix/map'
export { createRange } from './function/matrix/range'
export { createSize } from './function/matrix/size'
// FIXME: create a lightweight "number" implementation of subset only supporting plain objects/arrays
export const createIndex = /* #__PURE__ */ factory('index', [], () => noIndex)
export const createMatrix = /* #__PURE__ */ factory('matrix', [], () => noMatrix) // FIXME: needed now because subset transform needs it. Remove the need for it in subset
export const createSubset = /* #__PURE__ */ factory('subset', [], () => noSubset)
// TODO: provide number+array implementations for map, filter, forEach, zeros, ...?
// TODO: create range implementation for range?
export { createPartitionSelect } from './function/matrix/partitionSelect'

// probability
export const createCombinations = createNumberFactory('combinations', combinationsNumber)
export const createGamma = createNumberFactory('gamma', gammaNumber)
export { createCombinationsWithRep } from './function/probability/combinationsWithRep'
export { createFactorial } from './function/probability/factorial'
export { createMultinomial } from './function/probability/multinomial'
export { createPermutations } from './function/probability/permutations'
export { createPickRandom } from './function/probability/pickRandom'
export { createRandomNumber as createRandom } from './function/probability/random'
export { createRandomInt } from './function/probability/randomInt'

// relational
export { createEqualScalarNumber as createEqualScalar } from './function/relational/equalScalar'
export { createCompareNumber as createCompare } from './function/relational/compare'
export { createCompareNatural } from './function/relational/compareNatural'
export { createCompareTextNumber as createCompareText } from './function/relational/compareText'
export { createEqualNumber as createEqual } from './function/relational/equal'
export { createEqualText } from './function/relational/equalText'
export { createSmallerNumber as createSmaller } from './function/relational/smaller'
export { createSmallerEqNumber as createSmallerEq } from './function/relational/smallerEq'
export { createLargerNumber as createLarger } from './function/relational/larger'
export { createLargerEqNumber as createLargerEq } from './function/relational/largerEq'
export { createDeepEqual } from './function/relational/deepEqual'
export { createUnequalNumber as createUnequal } from './function/relational/unequal'

// special
export { createErf } from './function/special/erf'

// statistics
export { createMode } from './function/statistics/mode'
export { createProd } from './function/statistics/prod'
export { createMax } from './function/statistics/max'
export { createMin } from './function/statistics/min'
export { createSum } from './function/statistics/sum'
export { createMean } from './function/statistics/mean'
export { createMedian } from './function/statistics/median'
export { createMad } from './function/statistics/mad'
export { createVariance } from './function/statistics/variance'
export { createQuantileSeq } from './function/statistics/quantileSeq'
export { createStd } from './function/statistics/std'

// string
export { createFormat } from './function/string/format'
export { createPrint } from './function/string/print'

// trigonometry
export const createAcos = /* #__PURE__ */ createNumberFactory('acos', acosNumber)
export const createAcosh = /* #__PURE__ */ createNumberFactory('acosh', acoshNumber)
export const createAcot = /* #__PURE__ */ createNumberFactory('acot', acotNumber)
export const createAcoth = /* #__PURE__ */ createNumberFactory('acoth', acothNumber)
export const createAcsc = /* #__PURE__ */ createNumberFactory('acsc', acscNumber)
export const createAcsch = /* #__PURE__ */ createNumberFactory('acsch', acschNumber)
export const createAsec = /* #__PURE__ */ createNumberFactory('asec', asecNumber)
export const createAsech = /* #__PURE__ */ createNumberFactory('asech', asechNumber)
export const createAsin = /* #__PURE__ */ createNumberFactory('asin', asinNumber)
export const createAsinh = /* #__PURE__ */ createNumberFactory('asinh', asinhNumber)
export const createAtan = /* #__PURE__ */ createNumberFactory('atan', atanNumber)
export const createAtan2 = /* #__PURE__ */ createNumberFactory('atan2', atan2Number)
export const createAtanh = /* #__PURE__ */ createNumberFactory('atanh', atanhNumber)
export const createCos = /* #__PURE__ */ createNumberFactory('cos', cosNumber)
export const createCosh = /* #__PURE__ */ createNumberFactory('cosh', coshNumber)
export const createCot = /* #__PURE__ */ createNumberFactory('cot', cotNumber)
export const createCoth = /* #__PURE__ */ createNumberFactory('coth', cothNumber)
export const createCsc = /* #__PURE__ */ createNumberFactory('csc', cscNumber)
export const createCsch = /* #__PURE__ */ createNumberFactory('csch', cschNumber)
export const createSec = /* #__PURE__ */ createNumberFactory('sec', secNumber)
export const createSech = /* #__PURE__ */ createNumberFactory('sech', sechNumber)
export const createSin = /* #__PURE__ */ createNumberFactory('sin', sinNumber)
export const createSinh = /* #__PURE__ */ createNumberFactory('sinh', sinhNumber)
export const createTan = /* #__PURE__ */ createNumberFactory('tan', tanNumber)
export const createTanh = /* #__PURE__ */ createNumberFactory('tanh', tanhNumber)

// transforms
export { createApplyTransform } from './expression/transform/apply.transform'
export { createFilterTransform } from './expression/transform/filter.transform'
export { createForEachTransform } from './expression/transform/forEach.transform'
export { createMapTransform } from './expression/transform/map.transform'
export { createMaxTransform } from './expression/transform/max.transform'
export { createMeanTransform } from './expression/transform/mean.transform'
export { createMinTransform } from './expression/transform/min.transform'
export { createRangeTransform } from './expression/transform/range.transform'
export { createSubsetTransform } from './expression/transform/subset.transform'
export { createStdTransform } from './expression/transform/std.transform'
export { createSumTransform } from './expression/transform/sum.transform'
export { createVarianceTransform } from './expression/transform/variance.transform'

// utils
export { createClone } from './function/utils/clone'
export const createIsInteger = /* #__PURE__ */ createNumberFactory('isInteger', isIntegerNumber)
export const createIsNegative = /* #__PURE__ */ createNumberFactory('isNegative', isNegativeNumber)
export { createIsNumeric } from './function/utils/isNumeric'
export { createHasNumericValue } from './function/utils/hasNumericValue'
export const createIsPositive = /* #__PURE__ */ createNumberFactory('isPositive', isPositiveNumber)
export const createIsZero = /* #__PURE__ */ createNumberFactory('isZero', isZeroNumber)
export const createIsNaN = /* #__PURE__ */ createNumberFactory('isNaN', isNaNNumber)
export { createTypeOf } from './function/utils/typeOf'
export { createIsPrime } from './function/utils/isPrime'
export { createNumeric } from './function/utils/numeric'

// json
export { createReviver } from './json/reviver'

// helper function to create a factory function for a function which only needs typed-function
function createNumberFactory (name, fn) {
  return factory(name, ['typed'], ({ typed }) => typed(fn))
}
