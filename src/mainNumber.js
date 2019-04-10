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
  e,
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
  phi,
  pi,
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
  tau,
  unaryMinusNumber,
  unaryPlusNumber,
  xgcdNumber,
  xorNumber
} from './plain/number'
import { DEFAULT_CONFIG } from './core/config'
import { version } from './version'
import { createResultSet } from './type/resultset/ResultSet'
import { createRangeClass } from './type/matrix/Range'
import { createTyped } from './core/function/typed'
import { createClone } from './function/utils/clone'
import { createIsNumeric } from './function/utils/isNumeric'
import { createHasNumericValue } from './function/utils/hasNumericValue'
import { createTypeOf } from './function/utils/typeOf'
import { createEqualScalarNumber } from './function/relational/equalScalar'
import { createNumber } from './type/number'
import { createString } from './type/string'
import { createBoolean } from './type/boolean'
import { createNthRootNumber } from './function/arithmetic/nthRoot'
import { createErf } from './function/special/erf'
import { createMode } from './function/statistics/mode'
import { createProd } from './function/statistics/prod'
import { createFormat } from './function/string/format'
import { createPrint } from './function/string/print'
import { createIsPrime } from './function/utils/isPrime'
import { createRoundNumber } from './function/arithmetic/round'
import { createCompareNumber } from './function/relational/compare'
import { createCompareNatural } from './function/relational/compareNatural'
import { createCompareTextNumber } from './function/relational/compareText'
import { createEqualText } from './function/relational/equalText'
import { createSmallerNumber } from './function/relational/smaller'
import { createSmallerEqNumber } from './function/relational/smallerEq'
import { createLargerNumber } from './function/relational/larger'
import { createLargerEqNumber } from './function/relational/largerEq'
import { createDeepEqual } from './function/relational/deepEqual'
import { createUnequalNumber } from './function/relational/unequal'
import { createPartitionSelect } from './function/matrix/partitionSelect'
import { createMax } from './function/statistics/max'
import { createMin } from './function/statistics/min'
import { createHypot } from './function/arithmetic/hypot'
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
import { createHelpClass } from './expression/Help'
import { createChainClass } from './type/chain/Chain'
import { createHelp } from './expression/function/help'
import { createChain } from './type/chain/function/chain'
import { createSum } from './function/statistics/sum'
import { createMean } from './function/statistics/mean'
import { createMedian } from './function/statistics/median'
import { createMad } from './function/statistics/mad'
import { createVariance } from './function/statistics/variance'
import { createQuantileSeq } from './function/statistics/quantileSeq'
import { createStd } from './function/statistics/std'
import { createFactorial } from './function/probability/factorial'
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
import { createFilterTransform } from './expression/transform/filter.transform'
import { createForEachTransform } from './expression/transform/forEach.transform'
import { createMapTransform } from './expression/transform/map.transform'
import { createMaxTransform } from './expression/transform/max.transform'
import { createMeanTransform } from './expression/transform/mean.transform'
import { createMinTransform } from './expression/transform/min.transform'
import { createRangeTransform } from './expression/transform/range.transform'
import { createSumTransform } from './expression/transform/sum.transform'
import { MATRIX_OPTIONS, NUMBER_OPTIONS } from './core/function/config'
import { createNumeric } from './function/utils/numeric'
import { createEqualNumber } from './function/relational/equal'
import { createFilter } from './function/matrix/filter'
import { createForEach } from './function/matrix/forEach'
import { createMap } from './function/matrix/map'
import { createRange } from './function/matrix/range'
import { createSubsetTransform } from './expression/transform/subset.transform'
import { createSubset } from './factoriesNumber'
import { noMatrix } from './utils/noop'

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
// export const BigNumber = /* #__PURE__ */ createBigNumberClass({ config })
// export const Complex = /* #__PURE__ */ createComplexClass({ config })
// export const Fraction = /* #__PURE__ */ createFractionClass()
export const Range = /* #__PURE__ */ createRangeClass()
// export const Matrix = /* #__PURE__ */ createMatrixClass()
// export const DenseMatrix = /* #__PURE__ */ createDenseMatrixClass({ Matrix })

// core (1)
export const typed = /* #__PURE__ */ createTyped({})

// utils (1)
export const clone = /* #__PURE__ */ createClone({ typed })
export const isInteger = /* #__PURE__ */ typed(isIntegerNumber)
export const isNegative = /* #__PURE__ */ typed(isNegativeNumber)
export const isNumeric = /* #__PURE__ */ createIsNumeric({ typed })
export const hasNumericValue = /* #__PURE__ */ createHasNumericValue({ typed, isNumeric })
export const isPositive = /* #__PURE__ */ typed(isPositiveNumber)
export const isZero = /* #__PURE__ */ typed(isZeroNumber)
export const isNaN = /* #__PURE__ */ typed(isNaNNumber)
export const typeOf = /* #__PURE__ */ createTypeOf({ typed })

// relational (1)
export const equalScalar = /* #__PURE__ */ createEqualScalarNumber({ config, typed })

// classes (1.1)
// export const SparseMatrix = /* #__PURE__ */ createSparseMatrixClass({ typed, equalScalar, Matrix })

// create (1)
export const number = /* #__PURE__ */ createNumber({ typed })
export const string = /* #__PURE__ */ createString({ typed })
export const boolean = /* #__PURE__ */ createBoolean({ typed })
// export const bignumber = /* #__PURE__ */ createBignumber({ typed, BigNumber })
// export const complex = /* #__PURE__ */ createComplex({ typed, Complex })
// export const fraction = /* #__PURE__ */ createFraction({ typed, Fraction })
export const matrix = /* #__PURE__ */ noMatrix // FIXME: remove export, currently required because of subset.transform dependency
// export const splitUnit = /* #__PURE__ */ createSplitUnit({ typed })

// arithmetic (1)
export const unaryMinus = /* #__PURE__ */ typed(unaryMinusNumber)
export const unaryPlus = /* #__PURE__ */ typed(unaryPlusNumber)
export const abs = /* #__PURE__ */ typed(absNumber)
export const addScalar = /* #__PURE__ */ typed(addNumber)
export const cbrt = /* #__PURE__ */ typed(cbrtNumber)
export const ceil = /* #__PURE__ */ typed(ceilNumber)
export const cube = /* #__PURE__ */ typed(cubeNumber)
export const exp = /* #__PURE__ */ typed(expNumber)
export const expm1 = /* #__PURE__ */ typed(expm1Number)
export const fix = /* #__PURE__ */ typed(fixNumber)
export const floor = /* #__PURE__ */ typed(floorNumber)
export const gcd = /* #__PURE__ */ typed(gcdNumber)
export const lcm = /* #__PURE__ */ typed(lcmNumber)
export const log10 = /* #__PURE__ */ typed(log10Number)
export const log2 = /* #__PURE__ */ typed(log2Number)
export const mod = /* #__PURE__ */ typed(modNumber)
export const multiplyScalar = /* #__PURE__ */ typed(multiplyNumber)
export const multiply = /* #__PURE__ */ multiplyScalar
export const nthRoot = /* #__PURE__ */ createNthRootNumber({ typed })
export const sign = /* #__PURE__ */ typed(signNumber)
export const sqrt = /* #__PURE__ */ typed(sqrtNumber)
export const square = /* #__PURE__ */ typed(squareNumber)
export const subtract = /* #__PURE__ */ typed(subtractNumber)
export const xgcd = /* #__PURE__ */ typed(xgcdNumber)
// export const dotMultiply = /* #__PURE__ */ createDotMultiply({ typed, matrix, equalScalar, multiplyScalar })

// bitwise (1)
export const bitAnd = /* #__PURE__ */ typed(bitAndNumber)
export const bitNot = /* #__PURE__ */ typed(bitNotNumber)
export const bitOr = /* #__PURE__ */ typed(bitOrNumber)
export const bitXor = /* #__PURE__ */ typed(bitXorNumber)

// complex (1)
// export const arg = /* #__PURE__ */ createArg({ typed })
// export const conj = /* #__PURE__ */ createConj({ typed })
// export const im = /* #__PURE__ */ createIm({ typed })
// export const re = /* #__PURE__ */ createRe({ typed })

// logical (1)
export const not = /* #__PURE__ */ typed(notNumber)
export const or = /* #__PURE__ */ typed(orNumber)
export const xor = /* #__PURE__ */ typed(xorNumber)

// matrix (1)
// export const concat = /* #__PURE__ */ createConcat({ typed, matrix, isInteger })
// export const cross = /* #__PURE__ */ createCross({ typed, matrix, subtract, multiply })
// export const diag = /* #__PURE__ */ createDiag({ typed, matrix, DenseMatrix, SparseMatrix })
// export const eye = /* #__PURE__ */ createEye({ typed, matrix })
export const filter = /* #__PURE__ */ createFilter({ typed })
// export const flatten = /* #__PURE__ */ createFlatten({ typed, matrix })
export const forEach = /* #__PURE__ */ createForEach({ typed })
// export const getMatrixDataType = /* #__PURE__ */ createGetMatrixDataType({ typed })
// export const identity = /* #__PURE__ */ createIdentity({ config, typed, matrix, BigNumber, DenseMatrix, SparseMatrix })
// export const kron = /* #__PURE__ */ createKron({ typed, matrix, multiplyScalar })
export const map = /* #__PURE__ */ createMap({ typed })
// export const ones = /* #__PURE__ */ createOnes({ config, typed, matrix, BigNumber })
export const range = /* #__PURE__ */ createRange({ config, typed })
// export const reshape = /* #__PURE__ */ createReshape({ typed, isInteger, matrix })
// export const resize = /* #__PURE__ */ createResize({ config, matrix })
// export const size = /* #__PURE__ */ createSize({ config, typed, matrix })
// export const squeeze = /* #__PURE__ */ createSqueeze({ typed, matrix })
// FIXME: have a light weight implementation of subset
export const subset = /* #__PURE__ */ createSubset({ typed, matrix })
// export const transpose = /* #__PURE__ */ createTranspose({ typed, matrix })
// export const ctranspose = /* #__PURE__ */ createCtranspose({ typed, transpose, conj })
// export const zeros = /* #__PURE__ */ createZeros({ config, typed, matrix, BigNumber })
// TODO: provide number+array implementations for map, filter, forEach, zeros, ...?
// TODO: create range implementation for range?

// special (1)
export const erf = /* #__PURE__ */ createErf({ typed })

// statistics (1)
export const mode = /* #__PURE__ */ createMode({ typed, isNaN, isNumeric })
export const prod = /* #__PURE__ */ createProd({ typed, multiply })

// string (1)
export const format = /* #__PURE__ */ createFormat({ typed })
export const print = /* #__PURE__ */ createPrint({ typed })

// unit (1)
// export const to = /* #__PURE__ */ createTo({ typed, matrix })

// utils (2)
export const isPrime = /* #__PURE__ */ createIsPrime({ typed })
export const numeric = /* #__PURE__ */ createNumeric({ typed, number })

// arithmetic (2)
export const divideScalar = /* #__PURE__ */ typed(divideNumber)
export const pow = /* #__PURE__ */ typed(powNumber)
export const round = /* #__PURE__ */ createRoundNumber({ typed })
export const log = /* #__PURE__ */ typed(logNumber)
export const log1p = /* #__PURE__ */ typed(log1pNumber)
// export const nthRoots = /* #__PURE__ */ createNthRoots({ config, typed, divideScalar, Complex })
// export const dotPow = /* #__PURE__ */ createDotPow({ typed, equalScalar, matrix, pow, DenseMatrix })
// export const dotDivide = /* #__PURE__ */ createDotDivide({ typed, matrix, equalScalar, divideScalar, DenseMatrix })

// algebra (2)
// export const lsolve = /* #__PURE__ */ createLsolve({ typed, matrix, divideScalar, multiplyScalar, subtract, equalScalar, DenseMatrix })
// export const usolve = /* #__PURE__ */ createUsolve({ typed, matrix, divideScalar, multiplyScalar, subtract, equalScalar, DenseMatrix })

// bitwise (2)
export const leftShift = /* #__PURE__ */ typed(leftShiftNumber)
export const rightArithShift = /* #__PURE__ */ typed(rightArithShiftNumber)
export const rightLogShift = /* #__PURE__ */ typed(rightLogShiftNumber)

// logical (2)
export const and = /* #__PURE__ */ typed(andNumber)

// relational (2)
export const compare = /* #__PURE__ */ createCompareNumber({ config, typed })
export const compareNatural = /* #__PURE__ */ createCompareNatural({ typed, compare })
export const compareText = /* #__PURE__ */ createCompareTextNumber({ typed })
export const equal = /* #__PURE__ */ createEqualNumber({ typed, equalScalar })
export const equalText = /* #__PURE__ */ createEqualText({ typed, compareText, isZero })
export const smaller = /* #__PURE__ */ createSmallerNumber({ config, typed })
export const smallerEq = /* #__PURE__ */ createSmallerEqNumber({ config, typed })
export const larger = /* #__PURE__ */ createLargerNumber({ config, typed })
export const largerEq = /* #__PURE__ */ createLargerEqNumber({ config, typed })
export const deepEqual = /* #__PURE__ */ createDeepEqual({ config, typed, equal })
export const unequal = /* #__PURE__ */ createUnequalNumber({ config, typed, equalScalar })

// matrix (2)
export const partitionSelect = /* #__PURE__ */ createPartitionSelect({ typed, isNumeric, isNaN, compare })
// export const sort = /* #__PURE__ */ createSort({ typed, matrix, compare, compareNatural })

// statistics (2)
export const max = /* #__PURE__ */ createMax({ typed, larger })
export const min = /* #__PURE__ */ createMin({ typed, smaller })

// class (2)
// export const ImmutableDenseMatrix = /* #__PURE__ */ createImmutableDenseMatrixClass({ smaller, DenseMatrix })
// export const Index = /* #__PURE__ */ createIndexClass({ ImmutableDenseMatrix })
// export const FibonacciHeap = /* #__PURE__ */ createFibonacciHeapClass({ smaller, larger })
// export const Spa = /* #__PURE__ */ createSpaClass({ addScalar, equalScalar, FibonacciHeap })
// export const Unit = /* #__PURE__ */ createUnitClass({
//   config,
//   addScalar,
//   subtract,
//   multiplyScalar,
//   divideScalar,
//   pow,
//   abs,
//   fix,
//   round,
//   equal,
//   isNumeric,
//   format,
//   number,
//   Complex,
//   BigNumber,
//   Fraction
// })

// constants
export const _true = true
export const _false = false
export const _null = null
export const _Infinity = Infinity
export const _NaN = NaN
export { pi, tau, e, phi } from './plain/number'
export const LN2 = Math.LN2
export const LN10 = Math.LN10
export const LOG2E = Math.LOG2E
export const LOG10E = Math.LOG10E
export const SQRT1_2 = Math.SQRT1_2
export const SQRT2 = Math.SQRT2
// export const i = /* #__PURE__ */ createI({ config, Complex })
export { version } from './version'

// // physical constants
// const pyhiscalConstantsDependencies = {
//   config,
//   BigNumber,
//   Unit
// }
//
// // Universal constants
// export const speedOfLight = /* #__PURE__ */ createSpeedOfLight(pyhiscalConstantsDependencies)
// export const gravitationConstant = /* #__PURE__ */ createGravitationConstant(pyhiscalConstantsDependencies)
// export const planckConstant = /* #__PURE__ */ createPlanckConstant(pyhiscalConstantsDependencies)
// export const reducedPlanckConstant = /* #__PURE__ */ createReducedPlanckConstant(pyhiscalConstantsDependencies)
//
// // Electromagnetic constants
// export const magneticConstant = /* #__PURE__ */ createMagneticConstant(pyhiscalConstantsDependencies)
// export const electricConstant = /* #__PURE__ */ createElectricConstant(pyhiscalConstantsDependencies)
// export const vacuumImpedance = /* #__PURE__ */ createVacuumImpedance(pyhiscalConstantsDependencies)
// export const coulomb = /* #__PURE__ */ createCoulomb(pyhiscalConstantsDependencies)
// export const elementaryCharge = /* #__PURE__ */ createElementaryCharge(pyhiscalConstantsDependencies)
// export const bohrMagneton = /* #__PURE__ */ createBohrMagneton(pyhiscalConstantsDependencies)
// export const conductanceQuantum = /* #__PURE__ */ createConductanceQuantum(pyhiscalConstantsDependencies)
// export const inverseConductanceQuantum = /* #__PURE__ */ createInverseConductanceQuantum(pyhiscalConstantsDependencies)
// export const magneticFluxQuantum = /* #__PURE__ */ createMagneticFluxQuantum(pyhiscalConstantsDependencies)
// export const nuclearMagneton = /* #__PURE__ */ createNuclearMagneton(pyhiscalConstantsDependencies)
// export const klitzing = /* #__PURE__ */ createKlitzing(pyhiscalConstantsDependencies)
//
// // Atomic and nuclear constants
// export const bohrRadius = /* #__PURE__ */ createBohrRadius(pyhiscalConstantsDependencies)
// export const classicalElectronRadius = /* #__PURE__ */ createClassicalElectronRadius(pyhiscalConstantsDependencies)
// export const electronMass = /* #__PURE__ */ createElectronMass(pyhiscalConstantsDependencies)
// export const fermiCoupling = /* #__PURE__ */ createFermiCoupling(pyhiscalConstantsDependencies)
// export const fineStructure = /* #__PURE__ */ createFineStructure(pyhiscalConstantsDependencies)
// export const hartreeEnergy = /* #__PURE__ */ createHartreeEnergy(pyhiscalConstantsDependencies)
// export const protonMass = /* #__PURE__ */ createProtonMass(pyhiscalConstantsDependencies)
// export const deuteronMass = /* #__PURE__ */ createDeuteronMass(pyhiscalConstantsDependencies)
// export const neutronMass = /* #__PURE__ */ createNeutronMass(pyhiscalConstantsDependencies)
// export const quantumOfCirculation = /* #__PURE__ */ createQuantumOfCirculation(pyhiscalConstantsDependencies)
// export const rydberg = /* #__PURE__ */ createRydberg(pyhiscalConstantsDependencies)
// export const thomsonCrossSection = /* #__PURE__ */ createThomsonCrossSection(pyhiscalConstantsDependencies)
// export const weakMixingAngle = /* #__PURE__ */ createWeakMixingAngle(pyhiscalConstantsDependencies)
// export const efimovFactor = /* #__PURE__ */ createEfimovFactor(pyhiscalConstantsDependencies)
//
// // Physico-chemical constants
// export const atomicMass = /* #__PURE__ */ createAtomicMass(pyhiscalConstantsDependencies)
// export const avogadro = /* #__PURE__ */ createAvogadro(pyhiscalConstantsDependencies)
// export const boltzmann = /* #__PURE__ */ createBoltzmann(pyhiscalConstantsDependencies)
// export const faraday = /* #__PURE__ */ createFaraday(pyhiscalConstantsDependencies)
// export const firstRadiation = /* #__PURE__ */ createFirstRadiation(pyhiscalConstantsDependencies)
// export const loschmidt = /* #__PURE__ */ createLoschmidt(pyhiscalConstantsDependencies)
// export const gasConstant = /* #__PURE__ */ createGasConstant(pyhiscalConstantsDependencies)
// export const molarPlanckConstant = /* #__PURE__ */ createMolarPlanckConstant(pyhiscalConstantsDependencies)
// export const molarVolume = /* #__PURE__ */ createMolarVolume(pyhiscalConstantsDependencies)
// export const sackurTetrode = /* #__PURE__ */ createSackurTetrode(pyhiscalConstantsDependencies)
// export const secondRadiation = /* #__PURE__ */ createSecondRadiation(pyhiscalConstantsDependencies)
// export const stefanBoltzmann = /* #__PURE__ */ createStefanBoltzmann(pyhiscalConstantsDependencies)
// export const wienDisplacement = /* #__PURE__ */ createWienDisplacement(pyhiscalConstantsDependencies)
//
// // Adopted values
// export const molarMass = /* #__PURE__ */ createMolarMass(pyhiscalConstantsDependencies)
// export const molarMassC12 = /* #__PURE__ */ createMolarMassC12(pyhiscalConstantsDependencies)
// export const gravity = /* #__PURE__ */ createGravity(pyhiscalConstantsDependencies)
//
// // Natural units
// export const planckLength = /* #__PURE__ */ createPlanckLength(pyhiscalConstantsDependencies)
// export const planckMass = /* #__PURE__ */ createPlanckMass(pyhiscalConstantsDependencies)
// export const planckTime = /* #__PURE__ */ createPlanckTime(pyhiscalConstantsDependencies)
// export const planckCharge = /* #__PURE__ */ createPlanckCharge(pyhiscalConstantsDependencies)
// export const planckTemperature = /* #__PURE__ */ createPlanckTemperature(pyhiscalConstantsDependencies)

// create (2)
// export const sparse = /* #__PURE__ */ createSparse({ typed, SparseMatrix })
// export const unit = /* #__PURE__ */ createUnitFactory({ typed, Unit })
// export const createUnit = /* #__PURE__ */ createCreateUnit({ typed, Unit })

// trigonometry (2)
export const acos = /* #__PURE__ */ typed(acosNumber)
export const acosh = /* #__PURE__ */ typed(acoshNumber)
export const acot = /* #__PURE__ */ typed(acotNumber)
export const acoth = /* #__PURE__ */ typed(acothNumber)
export const acsc = /* #__PURE__ */ typed(acscNumber)
export const acsch = /* #__PURE__ */ typed(acschNumber)
export const asec = /* #__PURE__ */ typed(asecNumber)
export const asech = /* #__PURE__ */ typed(asechNumber)
export const asin = /* #__PURE__ */ typed(asinNumber)
export const asinh = /* #__PURE__ */ typed(asinhNumber)
export const atan = /* #__PURE__ */ typed(atanNumber)
export const atan2 = /* #__PURE__ */ typed(atan2Number)
export const atanh = /* #__PURE__ */ typed(atanhNumber)
export const cos = /* #__PURE__ */ typed(cosNumber)
export const cosh = /* #__PURE__ */ typed(coshNumber)
export const cot = /* #__PURE__ */ typed(cotNumber)
export const coth = /* #__PURE__ */ typed(cothNumber)
export const csc = /* #__PURE__ */ typed(cscNumber)
export const csch = /* #__PURE__ */ typed(cschNumber)
export const sec = /* #__PURE__ */ typed(secNumber)
export const sech = /* #__PURE__ */ typed(sechNumber)
export const sin = /* #__PURE__ */ typed(sinNumber)
export const sinh = /* #__PURE__ */ typed(sinhNumber)
export const tan = /* #__PURE__ */ typed(tanNumber)
export const tanh = /* #__PURE__ */ typed(tanhNumber)

// set (2)
// export const setCartesian = /* #__PURE__ */ createSetCartesian({ typed, size, subset, compareNatural, Index, DenseMatrix })
// export const setDifference = /* #__PURE__ */ createSetDifference({ typed, size, subset, compareNatural, Index, DenseMatrix })
// export const setDistinct = /* #__PURE__ */ createSetDistinct({ typed, size, subset, compareNatural, Index, DenseMatrix })
// export const setIntersect = /* #__PURE__ */ createSetIntersect({ typed, size, subset, compareNatural, Index, DenseMatrix })
// export const setIsSubset = /* #__PURE__ */ createSetIsSubset({ typed, size, subset, compareNatural, Index })
// export const setMultiplicity = /* #__PURE__ */ createSetMultiplicity({ typed, size, subset, compareNatural, Index })
// export const setPowerset = /* #__PURE__ */ createSetPowerset({ typed, size, subset, compareNatural, Index })
// export const setSize = /* #__PURE__ */ createSetSize({ typed, compareNatural })
// export const setSymDifference = /* #__PURE__ */ createSetSymDifference({ typed, size, concat, subset, setDifference, Index })
// export const setUnion = /* #__PURE__ */ createSetUnion({ typed, size, concat, subset, setIntersect, setSymDifference, Index })

// arithmetic (3)
export const add = /* #__PURE__ */ typed(addNumber)
export const hypot = /* #__PURE__ */ createHypot({ typed, abs, addScalar, divideScalar, multiplyScalar, sqrt, smaller, isPositive })
export const norm = /* #__PURE__ */ typed(normNumber)

// matrix (3)
// export const dot = /* #__PURE__ */ createDot({ typed, add, multiply })
// export const trace = /* #__PURE__ */ createTrace({ typed, matrix, add })
// export const index = /* #__PURE__ */ createIndex({ typed, Index })

// algebra (3)
// export const lup = /* #__PURE__ */ createLup({
//   typed,
//   matrix,
//   abs,
//   addScalar,
//   divideScalar,
//   multiplyScalar,
//   subtract,
//   larger,
//   equalScalar,
//   unaryMinus,
//   DenseMatrix,
//   SparseMatrix,
//   Spa
// })
// export const qr = /* #__PURE__ */ createQr({
//   typed,
//   matrix,
//   zeros,
//   identity,
//   isZero,
//   unequal,
//   sign,
//   sqrt,
//   conj,
//   unaryMinus,
//   addScalar,
//   divideScalar,
//   multiplyScalar,
//   subtract
// })
// export const slu = /* #__PURE__ */ createSlu({ typed, abs, add, multiply, transpose, divideScalar, subtract, larger, largerEq, SparseMatrix })
// export const lusolve = /* #__PURE__ */ createLusolve({ typed, matrix, lup, slu, usolve, lsolve, DenseMatrix })

// matrix (4)
// export const det = /* #__PURE__ */ createDet({ typed, matrix, subtract, multiply, unaryMinus, lup })
// export const inv = /* #__PURE__ */ createInv({ typed, matrix, divideScalar, addScalar, multiply, unaryMinus, det, identity, abs })
// export const expm = /* #__PURE__ */ createExpm({ typed, abs, add, identity, inv, multiply })
// export const sqrtm = /* #__PURE__ */ createSqrtm({ typed, abs, add, multiply, sqrt, subtract, inv, size, max, identity })

// arithmetic (4)
export const divide = /* #__PURE__ */ typed(divideNumber)

// geometry (4)
// export const distance = /* #__PURE__ */ createDistance({ typed, addScalar, subtract, multiplyScalar, divideScalar, unaryMinus, sqrt, abs })
// export const intersect = /* #__PURE__ */ createIntersect({ config, typed, abs, add, addScalar, matrix, multiply, multiplyScalar, divideScalar, subtract, smaller, equalScalar })

// statistics (4)
export const sum = /* #__PURE__ */ createSum({ config, typed, add })
export const mean = /* #__PURE__ */ createMean({ typed, add, divide })
export const median = /* #__PURE__ */ createMedian({ typed, add, divide, compare, partitionSelect })
export const mad = /* #__PURE__ */ createMad({ typed, abs, map, median, subtract })
export const variance = /* #__PURE__ */ createVariance({ typed, add, subtract, multiply, divide, isNaN })
export const quantileSeq = /* #__PURE__ */ createQuantileSeq({ typed, add, multiply, partitionSelect, compare })
export const std = /* #__PURE__ */ createStd({ typed, sqrt, variance })

// probability (4)
export const combinations = /* #__PURE__ */ typed(combinationsNumber)
export const gamma = /* #__PURE__ */ typed(gammaNumber)
export const factorial = /* #__PURE__ */ createFactorial({ typed, gamma })
// export const kldivergence = /* #__PURE__ */ createKldivergence({ typed, matrix, divide, sum, multiply, dotDivide, log, isNumeric })
export const multinomial = /* #__PURE__ */ createMultinomial({ typed, add, divide, multiply, factorial, isInteger, isPositive })
export const permutations = /* #__PURE__ */ createPermutations({ typed, factorial })
export const pickRandom = /* #__PURE__ */ createPickRandom({ typed, config })
export const random = /* #__PURE__ */ createRandom({ typed, config, matrix })
export const randomInt = /* #__PURE__ */ createRandomInt({ typed, config })

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
  // arg,
  asec,
  asech,
  asin,
  asinh,
  atan,
  atan2,
  atanh,
  // atomicMass,
  // avogadro,
  bellNumbers,
  // bignumber,
  bitAnd,
  bitNot,
  bitOr,
  bitXor,
  // bohrMagneton,
  // bohrRadius,
  // boltzmann,
  boolean,
  catalan,
  cbrt,
  ceil,
  // classicalElectronRadius,
  clone,
  combinations,
  compare,
  compareNatural,
  compareText,
  // complex,
  composition,
  // concat,
  // conductanceQuantum,
  config,
  // conj,
  cos,
  cosh,
  cot,
  coth,
  // coulomb,
  // createUnit,
  // cross,
  csc,
  csch,
  // ctranspose,
  cube,
  deepEqual,
  // det,
  // deuteronMass,
  // diag,
  // distance,
  divide,
  divideScalar,
  // dot,
  // dotDivide,
  // dotMultiply,
  // dotPow,
  e,
  // efimovFactor,
  // electricConstant,
  // electronMass,
  // elementaryCharge,
  equal,
  equalScalar,
  equalText,
  erf,
  exp,
  // expm,
  expm1,
  // eye,
  factorial,
  false: _false,
  // faraday,
  // fermiCoupling,
  filter,
  // fineStructure,
  // firstRadiation,
  fix,
  // flatten,
  floor,
  forEach,
  format,
  // fraction,
  gamma,
  // gasConstant,
  gcd,
  // getMatrixDataType,
  // gravitationConstant,
  // gravity,
  // hartreeEnergy,
  hypot,
  // i,
  // identity,
  // im,
  // index,
  // intersect,
  // inv,
  // inverseConductanceQuantum,
  isInteger,
  isNaN,
  isNegative,
  isNumeric,
  hasNumericValue,
  isPositive,
  isPrime,
  isZero,
  // kldivergence,
  // klitzing,
  // kron,
  larger,
  largerEq,
  lcm,
  leftShift,
  log,
  log10,
  log1p,
  log2,
  // loschmidt,
  // lsolve,
  // lup,
  // lusolve,
  mad,
  // magneticConstant,
  // magneticFluxQuantum,
  // map,
  matrix, // FIXME: remove matrix here (subset.transform dependency)
  max,
  mean,
  median,
  min,
  mod,
  mode,
  // molarMass,
  // molarMassC12,
  // molarPlanckConstant,
  // molarVolume,
  multinomial,
  multiply,
  multiplyScalar,
  // neutronMass,
  norm,
  not,
  nthRoot,
  // nthRoots,
  // nuclearMagneton,
  null: _null,
  number,
  numeric,
  // ones,
  or,
  partitionSelect,
  permutations,
  phi,
  pi,
  pickRandom,
  // planckCharge,
  // planckConstant,
  // planckLength,
  // planckMass,
  // planckTemperature,
  // planckTime,
  pow,
  print,
  prod,
  // protonMass,
  // qr,
  quantileSeq,
  // quantumOfCirculation,
  random,
  randomInt,
  range,
  // re,
  // reducedPlanckConstant,
  // reshape,
  // resize,
  rightArithShift,
  rightLogShift,
  round,
  // rydberg,
  // sackurTetrode,
  sec,
  sech,
  // secondRadiation,
  // setCartesian,
  // setDifference,
  // setDistinct,
  // setIntersect,
  // setIsSubset,
  // setMultiplicity,
  // setPowerset,
  // setSize,
  // setSymDifference,
  // setUnion,
  sign,
  sin,
  sinh,
  // size,
  // slu,
  smaller,
  smallerEq,
  // sort,
  // sparse,
  // speedOfLight,
  // splitUnit,
  sqrt,
  // sqrtm,
  square,
  // squeeze,
  std,
  // stefanBoltzmann,
  stirlingS2,
  string,
  subset,
  subtract,
  sum,
  tan,
  tanh,
  tau,
  // thomsonCrossSection,
  // to,
  // trace,
  // transpose,
  true: _true,
  typeOf,
  typed,
  unaryMinus,
  unaryPlus,
  unequal,
  // unit,
  // usolve,
  // vacuumImpedance,
  variance,
  version,
  // weakMixingAngle,
  // wienDisplacement,
  xgcd,
  xor,
  // zeros,

  'var': variance,
  'typeof': typeOf
}

// Do not use destructuring like { ...math } here, WebPack can't do tree-shaking in that case
const mathWithTransform = /* #__PURE__ */ Object.assign({}, math, {
  // concat: /* #__PURE__ */ createConcatTransform({ typed, matrix, isInteger }),
  filter: /* #__PURE__ */ createFilterTransform({ typed }),
  forEach: /* #__PURE__ */ createForEachTransform({ typed }),
  // index: /* #__PURE__ */ createIndexTransform({ Index }),
  map: /* #__PURE__ */ createMapTransform({ typed }),
  max: /* #__PURE__ */ createMaxTransform({ typed, larger }),
  mean: /* #__PURE__ */ createMeanTransform({ typed, add, divide }),
  min: /* #__PURE__ */ createMinTransform({ typed, smaller }),
  range: /* #__PURE__ */ createRangeTransform({ typed, config }),
  subset: /* #__PURE__ */ createSubsetTransform({ typed, matrix }),
  sum: /* #__PURE__ */ createSumTransform({ typed, config, add })
})

// expression (4)
export const Node = /* #__PURE__ */ createNode({ mathWithTransform })
export const AccessorNode = /* #__PURE__ */ createAccessorNode({ subset, Node }) // FIXME: subset is heavy-weight
export const ArrayNode = /* #__PURE__ */ createArrayNode({ Node })
export const AssignmentNode = /* #__PURE__ */ createAssignmentNode({ subset, matrix, Node }) // FIXME: subset is heavy-weight
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
export const SymbolNode = /* #__PURE__ */ createSymbolNode({ math, Node })
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
export const help = /* #__PURE__ */ createHelp({ math, typed, Help })
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
    // BigNumber,
    Chain,
    // Complex,
    // Fraction,
    // Matrix,
    // DenseMatrix,
    // SparseMatrix,
    // Spa,
    // FibonacciHeap,
    // ImmutableDenseMatrix,
    // Index,
    Range,
    // ResultSet,
    // Unit,
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

export { core, create, factory } from './mainInstance'
export * from './dependenciesNumber.generated'
