import { factory } from '../../utils/factory'
import { bignumberDocs } from './construction/bignumber'
import { typeOfDocs } from './function/utils/typeOf'
import { isZeroDocs } from './function/utils/isZero'
import { isPrimeDocs } from './function/utils/isPrime'
import { isPositiveDocs } from './function/utils/isPositive'
import { isNumericDocs } from './function/utils/isNumeric'
import { isNegativeDocs } from './function/utils/isNegative'
import { isIntegerDocs } from './function/utils/isInteger'
import { isNaNDocs } from './function/utils/isNaN'
import { formatDocs } from './function/utils/format'
import { cloneDocs } from './function/utils/clone'
import { toDocs } from './function/units/to'
import { tanhDocs } from './function/trigonometry/tanh'
import { tanDocs } from './function/trigonometry/tan'
import { sinhDocs } from './function/trigonometry/sinh'
import { sechDocs } from './function/trigonometry/sech'
import { secDocs } from './function/trigonometry/sec'
import { cschDocs } from './function/trigonometry/csch'
import { cscDocs } from './function/trigonometry/csc'
import { cothDocs } from './function/trigonometry/coth'
import { cotDocs } from './function/trigonometry/cot'
import { coshDocs } from './function/trigonometry/cosh'
import { cosDocs } from './function/trigonometry/cos'
import { atan2Docs } from './function/trigonometry/atan2'
import { atanhDocs } from './function/trigonometry/atanh'
import { atanDocs } from './function/trigonometry/atan'
import { asinhDocs } from './function/trigonometry/asinh'
import { asinDocs } from './function/trigonometry/asin'
import { asechDocs } from './function/trigonometry/asech'
import { asecDocs } from './function/trigonometry/asec'
import { acschDocs } from './function/trigonometry/acsch'
import { acscDocs } from './function/trigonometry/acsc'
import { acothDocs } from './function/trigonometry/acoth'
import { acotDocs } from './function/trigonometry/acot'
import { acoshDocs } from './function/trigonometry/acosh'
import { acosDocs } from './function/trigonometry/acos'
import { sumDocs } from './function/statistics/sum'
import { stdDocs } from './function/statistics/std'
import { quantileSeqDocs } from './function/statistics/quantileSeq'
import { prodDocs } from './function/statistics/prod'
import { modeDocs } from './function/statistics/mode'
import { minDocs } from './function/statistics/min'
import { medianDocs } from './function/statistics/median'
import { meanDocs } from './function/statistics/mean'
import { maxDocs } from './function/statistics/max'
import { madDocs } from './function/statistics/mad'
import { erfDocs } from './function/special/erf'
import { setUnionDocs } from './function/set/setUnion'
import { setSymDifferenceDocs } from './function/set/setSymDifference'
import { setSizeDocs } from './function/set/setSize'
import { setPowersetDocs } from './function/set/setPowerset'
import { setMultiplicityDocs } from './function/set/setMultiplicity'
import { setIsSubsetDocs } from './function/set/setIsSubset'
import { setIntersectDocs } from './function/set/setIntersect'
import { setDistinctDocs } from './function/set/setDistinct'
import { setDifferenceDocs } from './function/set/setDifference'
import { setCartesianDocs } from './function/set/setCartesian'
import { unequalDocs } from './function/relational/unequal'
import { smallerEqDocs } from './function/relational/smallerEq'
import { smallerDocs } from './function/relational/smaller'
import { largerEqDocs } from './function/relational/largerEq'
import { largerDocs } from './function/relational/larger'
import { equalTextDocs } from './function/relational/equalText'
import { equalDocs } from './function/relational/equal'
import { deepEqualDocs } from './function/relational/deepEqual'
import { compareTextDocs } from './function/relational/compareText'
import { compareNaturalDocs } from './function/relational/compareNatural'
import { compareDocs } from './function/relational/compare'
import { randomIntDocs } from './function/probability/randomInt'
import { randomDocs } from './function/probability/random'
import { pickRandomDocs } from './function/probability/pickRandom'
import { permutationsDocs } from './function/probability/permutations'
import { multinomialDocs } from './function/probability/multinomial'
import { kldivergenceDocs } from './function/probability/kldivergence'
import { gammaDocs } from './function/probability/gamma'
import { factorialDocs } from './function/probability/factorial'
import { combinationsDocs } from './function/probability/combinations'
import { zerosDocs } from './function/matrix/zeros'
import { transposeDocs } from './function/matrix/transpose'
import { traceDocs } from './function/matrix/trace'
import { subsetDocs } from './function/matrix/subset'
import { squeezeDocs } from './function/matrix/squeeze'
import { sortDocs } from './function/matrix/sort'
import { sizeDocs } from './function/matrix/size'
import { reshapeDocs } from './function/matrix/reshape'
import { resizeDocs } from './function/matrix/resize'
import { rangeDocs } from './function/matrix/range'
import { partitionSelectDocs } from './function/matrix/partitionSelect'
import { onesDocs } from './function/matrix/ones'
import { mapDocs } from './function/matrix/map'
import { kronDocs } from './function/matrix/kron'
import { invDocs } from './function/matrix/inv'
import { forEachDocs } from './function/matrix/forEach'
import { flattenDocs } from './function/matrix/flatten'
import { filterDocs } from './function/matrix/filter'
import { identityDocs } from './function/matrix/identity'
import { getMatrixDataTypeDocs } from './function/matrix/getMatrixDataType'
import { dotDocs } from './function/matrix/dot'
import { diagDocs } from './function/matrix/diag'
import { detDocs } from './function/matrix/det'
import { ctransposeDocs } from './function/matrix/ctranspose'
import { crossDocs } from './function/matrix/cross'
import { concatDocs } from './function/matrix/concat'
import { xorDocs } from './function/logical/xor'
import { orDocs } from './function/logical/or'
import { notDocs } from './function/logical/not'
import { andDocs } from './function/logical/and'
import { intersectDocs } from './function/geometry/intersect'
import { distanceDocs } from './function/geometry/distance'
import { helpDocs } from './function/expression/help'
import { evaluateDocs } from './function/expression/evaluate'
import { imDocs } from './function/complex/im'
import { reDocs } from './function/complex/re'
import { conjDocs } from './function/complex/conj'
import { argDocs } from './function/complex/arg'
import { typedDocs } from './core/typed'
import { importDocs } from './core/import'
import { configDocs } from './core/config'
import { stirlingS2Docs } from './function/combinatorics/stirlingS2'
import { compositionDocs } from './function/combinatorics/composition'
import { catalanDocs } from './function/combinatorics/catalan'
import { bellNumbersDocs } from './function/combinatorics/bellNumbers'
import { rightLogShiftDocs } from './function/bitwise/rightLogShift'
import { rightArithShiftDocs } from './function/bitwise/rightArithShift'
import { leftShiftDocs } from './function/bitwise/leftShift'
import { bitXorDocs } from './function/bitwise/bitXor'
import { bitOrDocs } from './function/bitwise/bitOr'
import { bitNotDocs } from './function/bitwise/bitNot'
import { bitAndDocs } from './function/bitwise/bitAnd'
import { xgcdDocs } from './function/arithmetic/xgcd'
import { unaryPlusDocs } from './function/arithmetic/unaryPlus'
import { unaryMinusDocs } from './function/arithmetic/unaryMinus'
import { squareDocs } from './function/arithmetic/square'
import { sqrtmDocs } from './function/arithmetic/sqrtm'
import { sqrtDocs } from './function/arithmetic/sqrt'
import { signDocs } from './function/arithmetic/sign'
import { roundDocs } from './function/arithmetic/round'
import { powDocs } from './function/arithmetic/pow'
import { nthRootsDocs } from './function/arithmetic/nthRoots'
import { nthRootDocs } from './function/arithmetic/nthRoot'
import { normDocs } from './function/arithmetic/norm'
import { multiplyDocs } from './function/arithmetic/multiply'
import { modDocs } from './function/arithmetic/mod'
import { log10Docs } from './function/arithmetic/log10'
import { log1pDocs } from './function/arithmetic/log1p'
import { log2Docs } from './function/arithmetic/log2'
import { logDocs } from './function/arithmetic/log'
import { lcmDocs } from './function/arithmetic/lcm'
import { hypotDocs } from './function/arithmetic/hypot'
import { gcdDocs } from './function/arithmetic/gcd'
import { floorDocs } from './function/arithmetic/floor'
import { fixDocs } from './function/arithmetic/fix'
import { expm1Docs } from './function/arithmetic/expm1'
import { expmDocs } from './function/arithmetic/expm'
import { expDocs } from './function/arithmetic/exp'
import { dotMultiplyDocs } from './function/arithmetic/dotMultiply'
import { dotDivideDocs } from './function/arithmetic/dotDivide'
import { divideDocs } from './function/arithmetic/divide'
import { cubeDocs } from './function/arithmetic/cube'
import { ceilDocs } from './function/arithmetic/ceil'
import { cbrtDocs } from './function/arithmetic/cbrt'
import { addDocs } from './function/arithmetic/add'
import { absDocs } from './function/arithmetic/abs'
import { qrDocs } from './function/algebra/qr'
import { usolveDocs } from './function/algebra/usolve'
import { sluDocs } from './function/algebra/slu'
import { rationalizeDocs } from './function/algebra/rationalize'
import { simplifyDocs } from './function/algebra/simplify'
import { lupDocs } from './function/algebra/lup'
import { lsolveDocs } from './function/algebra/lsolve'
import { derivativeDocs } from './function/algebra/derivative'
import { versionDocs } from './constants/version'
import { trueDocs } from './constants/true'
import { tauDocs } from './constants/tau'
import { SQRT2Docs } from './constants/SQRT2'
import { SQRT12Docs } from './constants/SQRT1_2'
import { phiDocs } from './constants/phi'
import { piDocs } from './constants/pi'
import { nullDocs } from './constants/null'
import { NaNDocs } from './constants/NaN'
import { LOG10EDocs } from './constants/LOG10E'
import { LOG2EDocs } from './constants/LOG2E'
import { LN10Docs } from './constants/LN10'
import { LN2Docs } from './constants/LN2'
import { InfinityDocs } from './constants/Infinity'
import { iDocs } from './constants/i'
import { falseDocs } from './constants/false'
import { eDocs } from './constants/e'
import { unitDocs } from './construction/unit'
import { stringDocs } from './construction/string'
import { splitUnitDocs } from './construction/splitUnit'
import { sparseDocs } from './construction/sparse'
import { numberDocs } from './construction/number'
import { matrixDocs } from './construction/matrix'
import { indexDocs } from './construction'
import { fractionDocs } from './construction/fraction'
import { createUnitDocs } from './construction/createUnit'
import { complexDocs } from './construction/complex'
import { booleanDocs } from './construction/boolean'
import { dotPowDocs } from './function/arithmetic/dotPow'
import { lusolveDocs } from './function/algebra/lusolve'
import { subtractDocs } from './function/arithmetic/subtract'
import { varianceDocs } from './function/statistics/variance'
import { sinDocs } from './function/trigonometry/sin'
import { numericDocs } from './function/utils/numeric'

const name = 'expression.docs'
const dependencies = []

// TODO: remove factory function here, isn't useful
export const createEmbeddedDocs = /* #__PURE__ */ factory(name, dependencies, () => {
  const docs = {}

  // construction functions
  docs.bignumber = bignumberDocs
  docs['boolean'] = booleanDocs
  docs.complex = complexDocs
  docs.createUnit = createUnitDocs
  docs.fraction = fractionDocs
  docs.index = indexDocs
  docs.matrix = matrixDocs
  docs.number = numberDocs
  docs.sparse = sparseDocs
  docs.splitUnit = splitUnitDocs
  docs.string = stringDocs
  docs.unit = unitDocs

  // constants
  docs.e = eDocs
  docs.E = eDocs
  docs['false'] = falseDocs
  docs.i = iDocs
  docs['Infinity'] = InfinityDocs
  docs.LN2 = LN2Docs
  docs.LN10 = LN10Docs
  docs.LOG2E = LOG2EDocs
  docs.LOG10E = LOG10EDocs
  docs.NaN = NaNDocs
  docs['null'] = nullDocs
  docs.pi = piDocs
  docs.PI = piDocs
  docs.phi = phiDocs
  docs.SQRT1_2 = SQRT12Docs
  docs.SQRT2 = SQRT2Docs
  docs.tau = tauDocs
  docs['true'] = trueDocs
  docs.version = versionDocs

  // physical constants
  // TODO: more detailed docs for physical constants
  docs.speedOfLight = { description: 'Speed of light in vacuum', examples: ['speedOfLight'] }
  docs.gravitationConstant = { description: 'Newtonian constant of gravitation', examples: ['gravitationConstant'] }
  docs.planckConstant = { description: 'Planck constant', examples: ['planckConstant'] }
  docs.reducedPlanckConstant = { description: 'Reduced Planck constant', examples: ['reducedPlanckConstant'] }

  docs.magneticConstant = { description: 'Magnetic constant (vacuum permeability)', examples: ['magneticConstant'] }
  docs.electricConstant = { description: 'Electric constant (vacuum permeability)', examples: ['electricConstant'] }
  docs.vacuumImpedance = { description: 'Characteristic impedance of vacuum', examples: ['vacuumImpedance'] }
  docs.coulomb = { description: 'Coulomb\'s constant', examples: ['coulomb'] }
  docs.elementaryCharge = { description: 'Elementary charge', examples: ['elementaryCharge'] }
  docs.bohrMagneton = { description: 'Borh magneton', examples: ['bohrMagneton'] }
  docs.conductanceQuantum = { description: 'Conductance quantum', examples: ['conductanceQuantum'] }
  docs.inverseConductanceQuantum = { description: 'Inverse conductance quantum', examples: ['inverseConductanceQuantum'] }
  // docs.josephson = {description: 'Josephson constant', examples: ['josephson']}
  docs.magneticFluxQuantum = { description: 'Magnetic flux quantum', examples: ['magneticFluxQuantum'] }
  docs.nuclearMagneton = { description: 'Nuclear magneton', examples: ['nuclearMagneton'] }
  docs.klitzing = { description: 'Von Klitzing constant', examples: ['klitzing'] }

  docs.bohrRadius = { description: 'Borh radius', examples: ['bohrRadius'] }
  docs.classicalElectronRadius = { description: 'Classical electron radius', examples: ['classicalElectronRadius'] }
  docs.electronMass = { description: 'Electron mass', examples: ['electronMass'] }
  docs.fermiCoupling = { description: 'Fermi coupling constant', examples: ['fermiCoupling'] }
  docs.fineStructure = { description: 'Fine-structure constant', examples: ['fineStructure'] }
  docs.hartreeEnergy = { description: 'Hartree energy', examples: ['hartreeEnergy'] }
  docs.protonMass = { description: 'Proton mass', examples: ['protonMass'] }
  docs.deuteronMass = { description: 'Deuteron Mass', examples: ['deuteronMass'] }
  docs.neutronMass = { description: 'Neutron mass', examples: ['neutronMass'] }
  docs.quantumOfCirculation = { description: 'Quantum of circulation', examples: ['quantumOfCirculation'] }
  docs.rydberg = { description: 'Rydberg constant', examples: ['rydberg'] }
  docs.thomsonCrossSection = { description: 'Thomson cross section', examples: ['thomsonCrossSection'] }
  docs.weakMixingAngle = { description: 'Weak mixing angle', examples: ['weakMixingAngle'] }
  docs.efimovFactor = { description: 'Efimov factor', examples: ['efimovFactor'] }

  docs.atomicMass = { description: 'Atomic mass constant', examples: ['atomicMass'] }
  docs.avogadro = { description: 'Avogadro\'s number', examples: ['avogadro'] }
  docs.boltzmann = { description: 'Boltzmann constant', examples: ['boltzmann'] }
  docs.faraday = { description: 'Faraday constant', examples: ['faraday'] }
  docs.firstRadiation = { description: 'First radiation constant', examples: ['firstRadiation'] }
  docs.loschmidt = { description: 'Loschmidt constant at T=273.15 K and p=101.325 kPa', examples: ['loschmidt'] }
  docs.gasConstant = { description: 'Gas constant', examples: ['gasConstant'] }
  docs.molarPlanckConstant = { description: 'Molar Planck constant', examples: ['molarPlanckConstant'] }
  docs.molarVolume = { description: 'Molar volume of an ideal gas at T=273.15 K and p=101.325 kPa', examples: ['molarVolume'] }
  docs.sackurTetrode = { description: 'Sackur-Tetrode constant at T=1 K and p=101.325 kPa', examples: ['sackurTetrode'] }
  docs.secondRadiation = { description: 'Second radiation constant', examples: ['secondRadiation'] }
  docs.stefanBoltzmann = { description: 'Stefan-Boltzmann constant', examples: ['stefanBoltzmann'] }
  docs.wienDisplacement = { description: 'Wien displacement law constant', examples: ['wienDisplacement'] }
  // docs.spectralRadiance = {description: 'First radiation constant for spectral radiance', examples: ['spectralRadiance']}

  docs.molarMass = { description: 'Molar mass constant', examples: ['molarMass'] }
  docs.molarMassC12 = { description: 'Molar mass constant of carbon-12', examples: ['molarMassC12'] }
  docs.gravity = { description: 'Standard acceleration of gravity (standard acceleration of free-fall on Earth)', examples: ['gravity'] }

  docs.planckLength = { description: 'Planck length', examples: ['planckLength'] }
  docs.planckMass = { description: 'Planck mass', examples: ['planckMass'] }
  docs.planckTime = { description: 'Planck time', examples: ['planckTime'] }
  docs.planckCharge = { description: 'Planck charge', examples: ['planckCharge'] }
  docs.planckTemperature = { description: 'Planck temperature', examples: ['planckTemperature'] }

  // functions - algebra
  docs.derivative = derivativeDocs
  docs.lsolve = lsolveDocs
  docs.lup = lupDocs
  docs.lusolve = lusolveDocs
  docs.simplify = simplifyDocs
  docs.rationalize = rationalizeDocs
  docs.slu = sluDocs
  docs.usolve = usolveDocs
  docs.qr = qrDocs

  // functions - arithmetic
  docs.abs = absDocs
  docs.add = addDocs
  docs.cbrt = cbrtDocs
  docs.ceil = ceilDocs
  docs.cube = cubeDocs
  docs.divide = divideDocs
  docs.dotDivide = dotDivideDocs
  docs.dotMultiply = dotMultiplyDocs
  docs.dotPow = dotPowDocs
  docs.exp = expDocs
  docs.expm = expmDocs
  docs.expm1 = expm1Docs
  docs.fix = fixDocs
  docs.floor = floorDocs
  docs.gcd = gcdDocs
  docs.hypot = hypotDocs
  docs.lcm = lcmDocs
  docs.log = logDocs
  docs.log2 = log2Docs
  docs.log1p = log1pDocs
  docs.log10 = log10Docs
  docs.mod = modDocs
  docs.multiply = multiplyDocs
  docs.norm = normDocs
  docs.nthRoot = nthRootDocs
  docs.nthRoots = nthRootsDocs
  docs.pow = powDocs
  docs.round = roundDocs
  docs.sign = signDocs
  docs.sqrt = sqrtDocs
  docs.sqrtm = sqrtmDocs
  docs.square = squareDocs
  docs.subtract = subtractDocs
  docs.unaryMinus = unaryMinusDocs
  docs.unaryPlus = unaryPlusDocs
  docs.xgcd = xgcdDocs

  // functions - bitwise
  docs.bitAnd = bitAndDocs
  docs.bitNot = bitNotDocs
  docs.bitOr = bitOrDocs
  docs.bitXor = bitXorDocs
  docs.leftShift = leftShiftDocs
  docs.rightArithShift = rightArithShiftDocs
  docs.rightLogShift = rightLogShiftDocs

  // functions - combinatorics
  docs.bellNumbers = bellNumbersDocs
  docs.catalan = catalanDocs
  docs.composition = compositionDocs
  docs.stirlingS2 = stirlingS2Docs

  // functions - core
  docs['config'] = configDocs
  docs['import'] = importDocs
  docs['typed'] = typedDocs

  // functions - complex
  docs.arg = argDocs
  docs.conj = conjDocs
  docs.re = reDocs
  docs.im = imDocs

  // functions - expression
  docs['evaluate'] = evaluateDocs
  docs.help = helpDocs

  // functions - geometry
  docs.distance = distanceDocs
  docs.intersect = intersectDocs

  // functions - logical
  docs['and'] = andDocs
  docs['not'] = notDocs
  docs['or'] = orDocs
  docs['xor'] = xorDocs

  // functions - matrix
  docs['concat'] = concatDocs
  docs.cross = crossDocs
  docs.ctranspose = ctransposeDocs
  docs.det = detDocs
  docs.diag = diagDocs
  docs.dot = dotDocs
  docs.getMatrixDataType = getMatrixDataTypeDocs
  docs.identity = identityDocs
  docs.filter = filterDocs
  docs.flatten = flattenDocs
  docs.forEach = forEachDocs
  docs.inv = invDocs
  docs.kron = kronDocs
  docs.map = mapDocs
  docs.ones = onesDocs
  docs.partitionSelect = partitionSelectDocs
  docs.range = rangeDocs
  docs.resize = resizeDocs
  docs.reshape = reshapeDocs
  docs.size = sizeDocs
  docs.sort = sortDocs
  docs.squeeze = squeezeDocs
  docs.subset = subsetDocs
  docs.trace = traceDocs
  docs.transpose = transposeDocs
  docs.zeros = zerosDocs

  // functions - probability
  docs.combinations = combinationsDocs
  // docs.distribution = distributionDocs
  docs.factorial = factorialDocs
  docs.gamma = gammaDocs
  docs.kldivergence = kldivergenceDocs
  docs.multinomial = multinomialDocs
  docs.permutations = permutationsDocs
  docs.pickRandom = pickRandomDocs
  docs.random = randomDocs
  docs.randomInt = randomIntDocs

  // functions - relational
  docs.compare = compareDocs
  docs.compareNatural = compareNaturalDocs
  docs.compareText = compareTextDocs
  docs.deepEqual = deepEqualDocs
  docs['equal'] = equalDocs
  docs.equalText = equalTextDocs
  docs.larger = largerDocs
  docs.largerEq = largerEqDocs
  docs.smaller = smallerDocs
  docs.smallerEq = smallerEqDocs
  docs.unequal = unequalDocs

  // functions - set
  docs.setCartesian = setCartesianDocs
  docs.setDifference = setDifferenceDocs
  docs.setDistinct = setDistinctDocs
  docs.setIntersect = setIntersectDocs
  docs.setIsSubset = setIsSubsetDocs
  docs.setMultiplicity = setMultiplicityDocs
  docs.setPowerset = setPowersetDocs
  docs.setSize = setSizeDocs
  docs.setSymDifference = setSymDifferenceDocs
  docs.setUnion = setUnionDocs

  // functions - special
  docs.erf = erfDocs

  // functions - statistics
  docs.mad = madDocs
  docs.max = maxDocs
  docs.mean = meanDocs
  docs.median = medianDocs
  docs.min = minDocs
  docs.mode = modeDocs
  docs.prod = prodDocs
  docs.quantileSeq = quantileSeqDocs
  docs.std = stdDocs
  docs.sum = sumDocs
  docs['variance'] = varianceDocs

  // functions - trigonometry
  docs.acos = acosDocs
  docs.acosh = acoshDocs
  docs.acot = acotDocs
  docs.acoth = acothDocs
  docs.acsc = acscDocs
  docs.acsch = acschDocs
  docs.asec = asecDocs
  docs.asech = asechDocs
  docs.asin = asinDocs
  docs.asinh = asinhDocs
  docs.atan = atanDocs
  docs.atanh = atanhDocs
  docs.atan2 = atan2Docs
  docs.cos = cosDocs
  docs.cosh = coshDocs
  docs.cot = cotDocs
  docs.coth = cothDocs
  docs.csc = cscDocs
  docs.csch = cschDocs
  docs.sec = secDocs
  docs.sech = sechDocs
  docs.sin = sinDocs
  docs.sinh = sinhDocs
  docs.tan = tanDocs
  docs.tanh = tanhDocs

  // functions - units
  docs.to = toDocs

  // functions - utils
  docs.clone = cloneDocs
  docs.format = formatDocs
  docs.isNaN = isNaNDocs
  docs.isInteger = isIntegerDocs
  docs.isNegative = isNegativeDocs
  docs.isNumeric = isNumericDocs
  docs.isPositive = isPositiveDocs
  docs.isPrime = isPrimeDocs
  docs.isZero = isZeroDocs
  // docs.print = require('./function/utils/print') // TODO: add documentation for print as soon as the parser supports objects.
  docs['typeOf'] = typeOfDocs
  docs['numeric'] = numericDocs

  return docs
})
