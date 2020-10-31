import { bignumberDocs } from './construction/bignumber'
import { typeOfDocs } from './function/utils/typeOf'
import { isZeroDocs } from './function/utils/isZero'
import { isPrimeDocs } from './function/utils/isPrime'
import { isPositiveDocs } from './function/utils/isPositive'
import { isNumericDocs } from './function/utils/isNumeric'
import { hasNumericValueDocs } from './function/utils/hasNumericValue'
import { isNegativeDocs } from './function/utils/isNegative'
import { isIntegerDocs } from './function/utils/isInteger'
import { isNaNDocs } from './function/utils/isNaN'
import { formatDocs } from './function/utils/format'
import { binDocs } from './function/utils/bin'
import { octDocs } from './function/utils/oct'
import { hexDocs } from './function/utils/hex'
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
import { combinationsWithRepDocs } from './function/probability/combinationsWithRep'
import { zerosDocs } from './function/matrix/zeros'
import { transposeDocs } from './function/matrix/transpose'
import { traceDocs } from './function/matrix/trace'
import { subsetDocs } from './function/matrix/subset'
import { squeezeDocs } from './function/matrix/squeeze'
import { sortDocs } from './function/matrix/sort'
import { sizeDocs } from './function/matrix/size'
import { diffDocs } from './function/matrix/diff'
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
import { eigsDocs } from './function/matrix/eigs'
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
import { usolveAllDocs } from './function/algebra/usolveAll'
import { sluDocs } from './function/algebra/slu'
import { rationalizeDocs } from './function/algebra/rationalize'
import { simplifyDocs } from './function/algebra/simplify'
import { lupDocs } from './function/algebra/lup'
import { lsolveDocs } from './function/algebra/lsolve'
import { lsolveAllDocs } from './function/algebra/lsolveAll'
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
import { columnDocs } from './function/matrix/column'
import { rowDocs } from './function/matrix/row'
import { rotationMatrixDocs } from './function/matrix/rotationMatrix'
import { rotateDocs } from './function/matrix/rotate'

export const embeddedDocs = {

  // construction functions
  bignumber: bignumberDocs,
  boolean: booleanDocs,
  complex: complexDocs,
  createUnit: createUnitDocs,
  fraction: fractionDocs,
  index: indexDocs,
  matrix: matrixDocs,
  number: numberDocs,
  sparse: sparseDocs,
  splitUnit: splitUnitDocs,
  string: stringDocs,
  unit: unitDocs,

  // constants
  e: eDocs,
  E: eDocs,
  false: falseDocs,
  i: iDocs,
  Infinity: InfinityDocs,
  LN2: LN2Docs,
  LN10: LN10Docs,
  LOG2E: LOG2EDocs,
  LOG10E: LOG10EDocs,
  NaN: NaNDocs,
  null: nullDocs,
  pi: piDocs,
  PI: piDocs,
  phi: phiDocs,
  SQRT1_2: SQRT12Docs,
  SQRT2: SQRT2Docs,
  tau: tauDocs,
  true: trueDocs,
  version: versionDocs,

  // physical constants
  // TODO: more detailed docs for physical constants
  speedOfLight: { description: 'Speed of light in vacuum', examples: ['speedOfLight'] },
  gravitationConstant: { description: 'Newtonian constant of gravitation', examples: ['gravitationConstant'] },
  planckConstant: { description: 'Planck constant', examples: ['planckConstant'] },
  reducedPlanckConstant: { description: 'Reduced Planck constant', examples: ['reducedPlanckConstant'] },

  magneticConstant: { description: 'Magnetic constant (vacuum permeability)', examples: ['magneticConstant'] },
  electricConstant: { description: 'Electric constant (vacuum permeability)', examples: ['electricConstant'] },
  vacuumImpedance: { description: 'Characteristic impedance of vacuum', examples: ['vacuumImpedance'] },
  coulomb: { description: 'Coulomb\'s constant', examples: ['coulomb'] },
  elementaryCharge: { description: 'Elementary charge', examples: ['elementaryCharge'] },
  bohrMagneton: { description: 'Borh magneton', examples: ['bohrMagneton'] },
  conductanceQuantum: { description: 'Conductance quantum', examples: ['conductanceQuantum'] },
  inverseConductanceQuantum: { description: 'Inverse conductance quantum', examples: ['inverseConductanceQuantum'] },
  // josephson: {description: 'Josephson constant', examples: ['josephson']},
  magneticFluxQuantum: { description: 'Magnetic flux quantum', examples: ['magneticFluxQuantum'] },
  nuclearMagneton: { description: 'Nuclear magneton', examples: ['nuclearMagneton'] },
  klitzing: { description: 'Von Klitzing constant', examples: ['klitzing'] },

  bohrRadius: { description: 'Borh radius', examples: ['bohrRadius'] },
  classicalElectronRadius: { description: 'Classical electron radius', examples: ['classicalElectronRadius'] },
  electronMass: { description: 'Electron mass', examples: ['electronMass'] },
  fermiCoupling: { description: 'Fermi coupling constant', examples: ['fermiCoupling'] },
  fineStructure: { description: 'Fine-structure constant', examples: ['fineStructure'] },
  hartreeEnergy: { description: 'Hartree energy', examples: ['hartreeEnergy'] },
  protonMass: { description: 'Proton mass', examples: ['protonMass'] },
  deuteronMass: { description: 'Deuteron Mass', examples: ['deuteronMass'] },
  neutronMass: { description: 'Neutron mass', examples: ['neutronMass'] },
  quantumOfCirculation: { description: 'Quantum of circulation', examples: ['quantumOfCirculation'] },
  rydberg: { description: 'Rydberg constant', examples: ['rydberg'] },
  thomsonCrossSection: { description: 'Thomson cross section', examples: ['thomsonCrossSection'] },
  weakMixingAngle: { description: 'Weak mixing angle', examples: ['weakMixingAngle'] },
  efimovFactor: { description: 'Efimov factor', examples: ['efimovFactor'] },

  atomicMass: { description: 'Atomic mass constant', examples: ['atomicMass'] },
  avogadro: { description: 'Avogadro\'s number', examples: ['avogadro'] },
  boltzmann: { description: 'Boltzmann constant', examples: ['boltzmann'] },
  faraday: { description: 'Faraday constant', examples: ['faraday'] },
  firstRadiation: { description: 'First radiation constant', examples: ['firstRadiation'] },
  loschmidt: { description: 'Loschmidt constant at T=273.15 K and p=101.325 kPa', examples: ['loschmidt'] },
  gasConstant: { description: 'Gas constant', examples: ['gasConstant'] },
  molarPlanckConstant: { description: 'Molar Planck constant', examples: ['molarPlanckConstant'] },
  molarVolume: { description: 'Molar volume of an ideal gas at T=273.15 K and p=101.325 kPa', examples: ['molarVolume'] },
  sackurTetrode: { description: 'Sackur-Tetrode constant at T=1 K and p=101.325 kPa', examples: ['sackurTetrode'] },
  secondRadiation: { description: 'Second radiation constant', examples: ['secondRadiation'] },
  stefanBoltzmann: { description: 'Stefan-Boltzmann constant', examples: ['stefanBoltzmann'] },
  wienDisplacement: { description: 'Wien displacement law constant', examples: ['wienDisplacement'] },
  // spectralRadiance: {description: 'First radiation constant for spectral radiance', examples: ['spectralRadiance']},

  molarMass: { description: 'Molar mass constant', examples: ['molarMass'] },
  molarMassC12: { description: 'Molar mass constant of carbon-12', examples: ['molarMassC12'] },
  gravity: { description: 'Standard acceleration of gravity (standard acceleration of free-fall on Earth)', examples: ['gravity'] },

  planckLength: { description: 'Planck length', examples: ['planckLength'] },
  planckMass: { description: 'Planck mass', examples: ['planckMass'] },
  planckTime: { description: 'Planck time', examples: ['planckTime'] },
  planckCharge: { description: 'Planck charge', examples: ['planckCharge'] },
  planckTemperature: { description: 'Planck temperature', examples: ['planckTemperature'] },

  // functions - algebra
  derivative: derivativeDocs,
  lsolve: lsolveDocs,
  lsolveAll: lsolveAllDocs,
  lup: lupDocs,
  lusolve: lusolveDocs,
  simplify: simplifyDocs,
  rationalize: rationalizeDocs,
  slu: sluDocs,
  usolve: usolveDocs,
  usolveAll: usolveAllDocs,
  qr: qrDocs,

  // functions - arithmetic
  abs: absDocs,
  add: addDocs,
  cbrt: cbrtDocs,
  ceil: ceilDocs,
  cube: cubeDocs,
  divide: divideDocs,
  dotDivide: dotDivideDocs,
  dotMultiply: dotMultiplyDocs,
  dotPow: dotPowDocs,
  exp: expDocs,
  expm: expmDocs,
  expm1: expm1Docs,
  fix: fixDocs,
  floor: floorDocs,
  gcd: gcdDocs,
  hypot: hypotDocs,
  lcm: lcmDocs,
  log: logDocs,
  log2: log2Docs,
  log1p: log1pDocs,
  log10: log10Docs,
  mod: modDocs,
  multiply: multiplyDocs,
  norm: normDocs,
  nthRoot: nthRootDocs,
  nthRoots: nthRootsDocs,
  pow: powDocs,
  round: roundDocs,
  sign: signDocs,
  sqrt: sqrtDocs,
  sqrtm: sqrtmDocs,
  square: squareDocs,
  subtract: subtractDocs,
  unaryMinus: unaryMinusDocs,
  unaryPlus: unaryPlusDocs,
  xgcd: xgcdDocs,

  // functions - bitwise
  bitAnd: bitAndDocs,
  bitNot: bitNotDocs,
  bitOr: bitOrDocs,
  bitXor: bitXorDocs,
  leftShift: leftShiftDocs,
  rightArithShift: rightArithShiftDocs,
  rightLogShift: rightLogShiftDocs,

  // functions - combinatorics
  bellNumbers: bellNumbersDocs,
  catalan: catalanDocs,
  composition: compositionDocs,
  stirlingS2: stirlingS2Docs,

  // functions - core
  config: configDocs,
  import: importDocs,
  typed: typedDocs,

  // functions - complex
  arg: argDocs,
  conj: conjDocs,
  re: reDocs,
  im: imDocs,

  // functions - expression
  evaluate: evaluateDocs,
  help: helpDocs,

  // functions - geometry
  distance: distanceDocs,
  intersect: intersectDocs,

  // functions - logical
  and: andDocs,
  not: notDocs,
  or: orDocs,
  xor: xorDocs,

  // functions - matrix
  concat: concatDocs,
  cross: crossDocs,
  column: columnDocs,
  ctranspose: ctransposeDocs,
  det: detDocs,
  diag: diagDocs,
  diff: diffDocs,
  dot: dotDocs,
  getMatrixDataType: getMatrixDataTypeDocs,
  identity: identityDocs,
  filter: filterDocs,
  flatten: flattenDocs,
  forEach: forEachDocs,
  inv: invDocs,
  eigs: eigsDocs,
  kron: kronDocs,
  map: mapDocs,
  ones: onesDocs,
  partitionSelect: partitionSelectDocs,
  range: rangeDocs,
  resize: resizeDocs,
  reshape: reshapeDocs,
  rotate: rotateDocs,
  rotationMatrix: rotationMatrixDocs,
  row: rowDocs,
  size: sizeDocs,
  sort: sortDocs,
  squeeze: squeezeDocs,
  subset: subsetDocs,
  trace: traceDocs,
  transpose: transposeDocs,
  zeros: zerosDocs,

  // functions - probability
  combinations: combinationsDocs,
  combinationsWithRep: combinationsWithRepDocs,
  // distribution: distributionDocs,
  factorial: factorialDocs,
  gamma: gammaDocs,
  kldivergence: kldivergenceDocs,
  multinomial: multinomialDocs,
  permutations: permutationsDocs,
  pickRandom: pickRandomDocs,
  random: randomDocs,
  randomInt: randomIntDocs,

  // functions - relational
  compare: compareDocs,
  compareNatural: compareNaturalDocs,
  compareText: compareTextDocs,
  deepEqual: deepEqualDocs,
  equal: equalDocs,
  equalText: equalTextDocs,
  larger: largerDocs,
  largerEq: largerEqDocs,
  smaller: smallerDocs,
  smallerEq: smallerEqDocs,
  unequal: unequalDocs,

  // functions - set
  setCartesian: setCartesianDocs,
  setDifference: setDifferenceDocs,
  setDistinct: setDistinctDocs,
  setIntersect: setIntersectDocs,
  setIsSubset: setIsSubsetDocs,
  setMultiplicity: setMultiplicityDocs,
  setPowerset: setPowersetDocs,
  setSize: setSizeDocs,
  setSymDifference: setSymDifferenceDocs,
  setUnion: setUnionDocs,

  // functions - special
  erf: erfDocs,

  // functions - statistics
  mad: madDocs,
  max: maxDocs,
  mean: meanDocs,
  median: medianDocs,
  min: minDocs,
  mode: modeDocs,
  prod: prodDocs,
  quantileSeq: quantileSeqDocs,
  std: stdDocs,
  sum: sumDocs,
  variance: varianceDocs,

  // functions - trigonometry
  acos: acosDocs,
  acosh: acoshDocs,
  acot: acotDocs,
  acoth: acothDocs,
  acsc: acscDocs,
  acsch: acschDocs,
  asec: asecDocs,
  asech: asechDocs,
  asin: asinDocs,
  asinh: asinhDocs,
  atan: atanDocs,
  atanh: atanhDocs,
  atan2: atan2Docs,
  cos: cosDocs,
  cosh: coshDocs,
  cot: cotDocs,
  coth: cothDocs,
  csc: cscDocs,
  csch: cschDocs,
  sec: secDocs,
  sech: sechDocs,
  sin: sinDocs,
  sinh: sinhDocs,
  tan: tanDocs,
  tanh: tanhDocs,

  // functions - units
  to: toDocs,

  // functions - utils
  clone: cloneDocs,
  format: formatDocs,
  bin: binDocs,
  oct: octDocs,
  hex: hexDocs,
  isNaN: isNaNDocs,
  isInteger: isIntegerDocs,
  isNegative: isNegativeDocs,
  isNumeric: isNumericDocs,
  hasNumericValue: hasNumericValueDocs,
  isPositive: isPositiveDocs,
  isPrime: isPrimeDocs,
  isZero: isZeroDocs,
  // print: printDocs // TODO: add documentation for print as soon as the parser supports objects.
  typeOf: typeOfDocs,
  numeric: numericDocs
}
