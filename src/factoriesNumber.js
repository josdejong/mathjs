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
  ceilNumber, combinationsNumber,
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
  floorNumber, gammaNumber,
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
import { noMatrix, noSubset } from './utils/noop'

// ----------------------------------------------------------------------------
// classes and functions

// class (1)
export { createResultSet } from './type/resultset/ResultSet'
// export const BigNumber = /* #__PURE__ */ createBigNumberClass({ config })
// export const Complex = /* #__PURE__ */ createComplexClass({ config })
// export const Fraction = /* #__PURE__ */ createFractionClass()
export { createRangeClass } from './type/matrix/Range'
// export const Matrix = /* #__PURE__ */ createMatrixClass()
// export const DenseMatrix = /* #__PURE__ */ createDenseMatrixClass({ Matrix })

// core (1)
export { createTyped } from './core/function/typed'

// utils (1)
export { createClone } from './function/utils/clone'
export const createIsInteger = /* #__PURE__ */ createNumberFactory('isInteger', isIntegerNumber)
export const createIsNegative = /* #__PURE__ */ createNumberFactory('isNegative', isNegativeNumber)
export { createIsNumeric } from './function/utils/isNumeric'
export { createHasNumericValue } from './function/utils/hasNumericValue'
export const createIsPositive = /* #__PURE__ */ createNumberFactory('isPositive', isPositiveNumber)
export const createIsZero = /* #__PURE__ */ createNumberFactory('isZero', isZeroNumber)
export const createIsNaN = /* #__PURE__ */ createNumberFactory('isNaN', isNaNNumber)
export { createTypeOf } from './function/utils/typeOf'

// relational (1)
export { createEqualScalarNumber as createEqualScalar } from './function/relational/equalScalar'

// classes (1.1)
// export const SparseMatrix = /* #__PURE__ */ createSparseMatrixClass({ typed, equalScalar, Matrix })

// create (1)
export { createNumber } from './type/number'
export { createString } from './type/string'
export { createBoolean } from './type/boolean'
// export const bignumber = /* #__PURE__ */ createBignumber({ typed, BigNumber })
// export const complex = /* #__PURE__ */ createComplex({ typed, Complex })
// export const fraction = /* #__PURE__ */ createFraction({ typed, Fraction })
export const createMatrix = /* #__PURE__ */ factory('matrix', [], () => noMatrix) // FIXME: needed now because subset transform needs it. Remove the need for it in subset
// export const splitUnit = /* #__PURE__ */ createSplitUnit({ typed })

// arithmetic (1)
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
// export const dotMultiply = /* #__PURE__ */ createDotMultiply({ typed, matrix, equalScalar, multiplyScalar })

// bitwise (1)
export const createbitAnd = /* #__PURE__ */ createNumberFactory('bitAnd', bitAndNumber)
export const createbitNot = /* #__PURE__ */ createNumberFactory('bitNot', bitNotNumber)
export const createbitOr = /* #__PURE__ */ createNumberFactory('bitOr', bitOrNumber)
export const createbitXor = /* #__PURE__ */ createNumberFactory('bitXor', bitXorNumber)

// complex (1)
// export const arg = /* #__PURE__ */ createArg({ typed })
// export const conj = /* #__PURE__ */ createConj({ typed })
// export const im = /* #__PURE__ */ createIm({ typed })
// export const re = /* #__PURE__ */ createRe({ typed })

// logical (1)
export const createNot = /* #__PURE__ */ createNumberFactory('not', notNumber)
export const createOr = /* #__PURE__ */ createNumberFactory('or', orNumber)
export const createXor = /* #__PURE__ */ createNumberFactory('xor', xorNumber)

// matrix (1)
// export const concat = /* #__PURE__ */ createConcat({ typed, matrix, isInteger })
// export const cross = /* #__PURE__ */ createCross({ typed, matrix, subtract, multiply })
// export const diag = /* #__PURE__ */ createDiag({ typed, matrix, DenseMatrix, SparseMatrix })
// export const eye = /* #__PURE__ */ createEye({ typed, matrix })
export { createFilter } from './function/matrix/filter'
// export const flatten = /* #__PURE__ */ createFlatten({ typed, matrix })
export { createForEach } from './function/matrix/forEach'
// export const getMatrixDataType = /* #__PURE__ */ createGetMatrixDataType({ typed })
// export const identity = /* #__PURE__ */ createIdentity({ config, typed, matrix, BigNumber, DenseMatrix, SparseMatrix })
// export const kron = /* #__PURE__ */ createKron({ typed, matrix, multiplyScalar })
export { createMap } from './function/matrix/map'
// export const ones = /* #__PURE__ */ createOnes({ config, typed, matrix, BigNumber })
export { createRange } from './function/matrix/range'
// export const reshape = /* #__PURE__ */ createReshape({ typed, isInteger, matrix })
// export const resize = /* #__PURE__ */ createResize({ config, matrix })
// export const size = /* #__PURE__ */ createSize({ config, typed, matrix })
// export const squeeze = /* #__PURE__ */ createSqueeze({ typed, matrix })
// FIXME: create a lightweight "number" implementation of subset only supporting plain objects/arrays
export const createSubset = /* #__PURE__ */ factory('subset', [], () => noSubset)
// export const transpose = /* #__PURE__ */ createTranspose({ typed, matrix })
// export const ctranspose = /* #__PURE__ */ createCtranspose({ typed, transpose, conj })
// export const zeros = /* #__PURE__ */ createZeros({ config, typed, matrix, BigNumber })
// TODO: provide number+array implementations for map, filter, forEach, zeros, ...?
// TODO: create range implementation for range?

// special (1)
export { createErf } from './function/special/erf'

// statistics (1)
export { createMode } from './function/statistics/mode'
export { createProd } from './function/statistics/prod'

// string (1)
export { createFormat } from './function/string/format'
export { createPrint } from './function/string/print'

// unit (1)
// export const to = /* #__PURE__ */ createTo({ typed, matrix })

// utils (2)
export { createIsPrime } from './function/utils/isPrime'
export { createNumeric } from './function/utils/numeric'

// arithmetic (2)
export const createDivideScalar = /* #__PURE__ */ createNumberFactory('divideScalar', divideNumber)
export const createPow = /* #__PURE__ */ createNumberFactory('pow', powNumber)
export { createRoundNumber as createRound } from './function/arithmetic/round'
export const createLog = /* #__PURE__ */ createNumberFactory('log', logNumber)
export const createLog1p = /* #__PURE__ */ createNumberFactory('log1p', log1pNumber)
// export const nthRoots = /* #__PURE__ */ createNthRoots({ config, typed, divideScalar, Complex })
// export const dotPow = /* #__PURE__ */ createDotPow({ typed, equalScalar, matrix, pow, DenseMatrix })
// export const dotDivide = /* #__PURE__ */ createDotDivide({ typed, matrix, equalScalar, divideScalar, DenseMatrix })

// algebra (2)
// export const lsolve = /* #__PURE__ */ createLsolve({ typed, matrix, divideScalar, multiplyScalar, subtract, equalScalar, DenseMatrix })
// export const usolve = /* #__PURE__ */ createUsolve({ typed, matrix, divideScalar, multiplyScalar, subtract, equalScalar, DenseMatrix })

// bitwise (2)
export const createLeftShift = /* #__PURE__ */ createNumberFactory('leftShift', leftShiftNumber)
export const createRightArithShift = /* #__PURE__ */ createNumberFactory('rightArithShift', rightArithShiftNumber)
export const createRightLogShift = /* #__PURE__ */ createNumberFactory('rightLogShift', rightLogShiftNumber)

// logical (2)
export const createAnd = /* #__PURE__ */ createNumberFactory('and', andNumber)

// relational (2)
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

// matrix (2)
export { createPartitionSelect } from './function/matrix/partitionSelect'
// export { createSort } from './function/matrix/sort'

// statistics (2)
export { createMax } from './function/statistics/max'
export { createMin } from './function/statistics/min'

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
export const createAdd = /* #__PURE__ */ createNumberFactory('add', addNumber)
export { createHypot } from './function/arithmetic/hypot'
export const createNorm = /* #__PURE__ */ createNumberFactory('norm', normNumber)

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
export const createDivide = /* #__PURE__ */ createNumberFactory('divide', divideNumber)

// geometry (4)
// export const distance = /* #__PURE__ */ createDistance({ typed, addScalar, subtract, multiplyScalar, divideScalar, unaryMinus, sqrt, abs })
// export const intersect = /* #__PURE__ */ createIntersect({ config, typed, abs, add, addScalar, matrix, multiply, multiplyScalar, divideScalar, subtract, smaller, equalScalar })

// statistics (4)
export { createSum } from './function/statistics/sum'
export { createMean } from './function/statistics/mean'
export { createMedian } from './function/statistics/median'
export { createMad } from './function/statistics/mad'
export { createVariance } from './function/statistics/variance'
export { createQuantileSeq } from './function/statistics/quantileSeq'
export { createStd } from './function/statistics/std'

// probability (4)
export const createCombinations = createNumberFactory('combinations', combinationsNumber)
export const createGamma = createNumberFactory('gamma', gammaNumber)
export { createFactorial } from './function/probability/factorial'
// export { createKldivergence } from './function/probability/kldivergence'
export { createMultinomial } from './function/probability/multinomial'
export { createPermutations } from './function/probability/permutations'
export { createPickRandom } from './function/probability/pickRandom'
export { createRandomNumber as createRandom } from './function/probability/random'
export { createRandomInt } from './function/probability/randomInt'

// combinatorics (4)
export { createStirlingS2 } from './function/combinatorics/stirlingS2'
export { createBellNumbers } from './function/combinatorics/bellNumbers'
export { createCatalan } from './function/combinatorics/catalan'
export { createComposition } from './function/combinatorics/composition'

// transforms
export { createFilterTransform } from './expression/transform/filter.transform'
export { createForEachTransform } from './expression/transform/forEach.transform'
// export { createIndexTransform } from './expression/transform/index.transform'
export { createMapTransform } from './expression/transform/map.transform'
export { createMaxTransform } from './expression/transform/max.transform'
export { createMeanTransform } from './expression/transform/mean.transform'
export { createMinTransform } from './expression/transform/min.transform'
export { createRangeTransform } from './expression/transform/range.transform'
export { createSubsetTransform } from './expression/transform/subset.transform'
// export { createConcatTransform } from './expression/transform/concat.transform'
export { createSumTransform } from './expression/transform/sum.transform'

// expression (4)
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

// create (4)
export { createParser } from './expression/function/parser'

// class (4)
export { createHelpClass } from './expression/Help'
export { createChainClass } from './type/chain/Chain'

// type (4)
export { createHelp } from './expression/function/help'
export { createChain } from './type/chain/function/chain'

// algebra (4)
export { createSimplify } from './function/algebra/simplify'
export { createDerivative } from './function/algebra/derivative'
export { createRationalize } from './function/algebra/rationalize'

// ----------------------------------------------------------------------------
// json

export { createReviver } from './json/reviver'

// helper function to create a factory function for a function which only needs typed-function
function createNumberFactory (name, fn) {
  return factory(name, ['typed'], ({ typed }) => typed(fn))
}
