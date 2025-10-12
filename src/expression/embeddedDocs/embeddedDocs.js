import { eDocs } from './constants/e.js'
import { falseDocs } from './constants/false.js'
import { iDocs } from './constants/i.js'
import { InfinityDocs } from './constants/Infinity.js'
import { LN10Docs } from './constants/LN10.js'
import { LN2Docs } from './constants/LN2.js'
import { LOG10EDocs } from './constants/LOG10E.js'
import { LOG2EDocs } from './constants/LOG2E.js'
import { NaNDocs } from './constants/NaN.js'
import { nullDocs } from './constants/null.js'
import { phiDocs } from './constants/phi.js'
import { piDocs } from './constants/pi.js'
import { SQRT12Docs } from './constants/SQRT1_2.js'
import { SQRT2Docs } from './constants/SQRT2.js'
import { tauDocs } from './constants/tau.js'
import { trueDocs } from './constants/true.js'
import { versionDocs } from './constants/version.js'
import { bignumberDocs } from './construction/bignumber.js'
import { bigintDocs } from './construction/bigint.js'
import { booleanDocs } from './construction/boolean.js'
import { complexDocs } from './construction/complex.js'
import { createUnitDocs } from './construction/createUnit.js'
import { fractionDocs } from './construction/fraction.js'
import { indexDocs } from './construction/index.js'
import { matrixDocs } from './construction/matrix.js'
import { numberDocs } from './construction/number.js'
import { sparseDocs } from './construction/sparse.js'
import { splitUnitDocs } from './construction/splitUnit.js'
import { stringDocs } from './construction/string.js'
import { unitDocs } from './construction/unit.js'
import { configDocs } from './core/config.js'
import { importDocs } from './core/import.js'
import { typedDocs } from './core/typed.js'
import { derivativeDocs } from './function/algebra/derivative.js'
import { leafCountDocs } from './function/algebra/leafCount.js'
import { lsolveDocs } from './function/algebra/lsolve.js'
import { lsolveAllDocs } from './function/algebra/lsolveAll.js'
import { lupDocs } from './function/algebra/lup.js'
import { lusolveDocs } from './function/algebra/lusolve.js'
import { polynomialRootDocs } from './function/algebra/polynomialRoot.js'
import { qrDocs } from './function/algebra/qr.js'
import { rationalizeDocs } from './function/algebra/rationalize.js'
import { resolveDocs } from './function/algebra/resolve.js'
import { simplifyDocs } from './function/algebra/simplify.js'
import { simplifyConstantDocs } from './function/algebra/simplifyConstant.js'
import { simplifyCoreDocs } from './function/algebra/simplifyCore.js'
import { sluDocs } from './function/algebra/slu.js'
import { symbolicEqualDocs } from './function/algebra/symbolicEqual.js'
import { usolveDocs } from './function/algebra/usolve.js'
import { usolveAllDocs } from './function/algebra/usolveAll.js'
import { absDocs } from './function/arithmetic/abs.js'
import { addDocs } from './function/arithmetic/add.js'
import { cbrtDocs } from './function/arithmetic/cbrt.js'
import { ceilDocs } from './function/arithmetic/ceil.js'
import { cubeDocs } from './function/arithmetic/cube.js'
import { divideDocs } from './function/arithmetic/divide.js'
import { dotDivideDocs } from './function/arithmetic/dotDivide.js'
import { dotMultiplyDocs } from './function/arithmetic/dotMultiply.js'
import { dotPowDocs } from './function/arithmetic/dotPow.js'
import { expDocs } from './function/arithmetic/exp.js'
import { expmDocs } from './function/arithmetic/expm.js'
import { expm1Docs } from './function/arithmetic/expm1.js'
import { fixDocs } from './function/arithmetic/fix.js'
import { floorDocs } from './function/arithmetic/floor.js'
import { gcdDocs } from './function/arithmetic/gcd.js'
import { hypotDocs } from './function/arithmetic/hypot.js'
import { invmodDocs } from './function/arithmetic/invmod.js'
import { lcmDocs } from './function/arithmetic/lcm.js'
import { logDocs } from './function/arithmetic/log.js'
import { log10Docs } from './function/arithmetic/log10.js'
import { log1pDocs } from './function/arithmetic/log1p.js'
import { log2Docs } from './function/arithmetic/log2.js'
import { modDocs } from './function/arithmetic/mod.js'
import { multiplyDocs } from './function/arithmetic/multiply.js'
import { normDocs } from './function/arithmetic/norm.js'
import { nthRootDocs } from './function/arithmetic/nthRoot.js'
import { nthRootsDocs } from './function/arithmetic/nthRoots.js'
import { powDocs } from './function/arithmetic/pow.js'
import { roundDocs } from './function/arithmetic/round.js'
import { signDocs } from './function/arithmetic/sign.js'
import { sqrtDocs } from './function/arithmetic/sqrt.js'
import { sqrtmDocs } from './function/arithmetic/sqrtm.js'
import { sylvesterDocs } from './function/algebra/sylvester.js'
import { schurDocs } from './function/algebra/schur.js'
import { lyapDocs } from './function/algebra/lyap.js'
import { squareDocs } from './function/arithmetic/square.js'
import { subtractDocs } from './function/arithmetic/subtract.js'
import { unaryMinusDocs } from './function/arithmetic/unaryMinus.js'
import { unaryPlusDocs } from './function/arithmetic/unaryPlus.js'
import { xgcdDocs } from './function/arithmetic/xgcd.js'
import { bitAndDocs } from './function/bitwise/bitAnd.js'
import { bitNotDocs } from './function/bitwise/bitNot.js'
import { bitOrDocs } from './function/bitwise/bitOr.js'
import { bitXorDocs } from './function/bitwise/bitXor.js'
import { leftShiftDocs } from './function/bitwise/leftShift.js'
import { rightArithShiftDocs } from './function/bitwise/rightArithShift.js'
import { rightLogShiftDocs } from './function/bitwise/rightLogShift.js'
import { bellNumbersDocs } from './function/combinatorics/bellNumbers.js'
import { catalanDocs } from './function/combinatorics/catalan.js'
import { compositionDocs } from './function/combinatorics/composition.js'
import { stirlingS2Docs } from './function/combinatorics/stirlingS2.js'
import { argDocs } from './function/complex/arg.js'
import { conjDocs } from './function/complex/conj.js'
import { imDocs } from './function/complex/im.js'
import { reDocs } from './function/complex/re.js'
import { evaluateDocs } from './function/expression/evaluate.js'
import { parserDocs } from './function/expression/parser.js'
import { parseDocs } from './function/expression/parse.js'
import { compileDocs } from './function/expression/compile.js'
import { helpDocs } from './function/expression/help.js'
import { distanceDocs } from './function/geometry/distance.js'
import { intersectDocs } from './function/geometry/intersect.js'
import { andDocs } from './function/logical/and.js'
import { notDocs } from './function/logical/not.js'
import { nullishDocs } from './function/logical/nullish.js'
import { orDocs } from './function/logical/or.js'
import { xorDocs } from './function/logical/xor.js'
import { mapSlicesDocs } from './function/matrix/mapSlices.js'
import { columnDocs } from './function/matrix/column.js'
import { concatDocs } from './function/matrix/concat.js'
import { countDocs } from './function/matrix/count.js'
import { crossDocs } from './function/matrix/cross.js'
import { ctransposeDocs } from './function/matrix/ctranspose.js'
import { detDocs } from './function/matrix/det.js'
import { diagDocs } from './function/matrix/diag.js'
import { diffDocs } from './function/matrix/diff.js'
import { dotDocs } from './function/matrix/dot.js'
import { eigsDocs } from './function/matrix/eigs.js'
import { filterDocs } from './function/matrix/filter.js'
import { flattenDocs } from './function/matrix/flatten.js'
import { forEachDocs } from './function/matrix/forEach.js'
import { getMatrixDataTypeDocs } from './function/matrix/getMatrixDataType.js'
import { identityDocs } from './function/matrix/identity.js'
import { invDocs } from './function/matrix/inv.js'
import { pinvDocs } from './function/matrix/pinv.js'
import { kronDocs } from './function/matrix/kron.js'
import { mapDocs } from './function/matrix/map.js'
import { matrixFromColumnsDocs } from './function/matrix/matrixFromColumns.js'
import { matrixFromFunctionDocs } from './function/matrix/matrixFromFunction.js'
import { matrixFromRowsDocs } from './function/matrix/matrixFromRows.js'
import { onesDocs } from './function/matrix/ones.js'
import { partitionSelectDocs } from './function/matrix/partitionSelect.js'
import { rangeDocs } from './function/matrix/range.js'
import { reshapeDocs } from './function/matrix/reshape.js'
import { resizeDocs } from './function/matrix/resize.js'
import { rotateDocs } from './function/matrix/rotate.js'
import { rotationMatrixDocs } from './function/matrix/rotationMatrix.js'
import { rowDocs } from './function/matrix/row.js'
import { sizeDocs } from './function/matrix/size.js'
import { sortDocs } from './function/matrix/sort.js'
import { squeezeDocs } from './function/matrix/squeeze.js'
import { subsetDocs } from './function/matrix/subset.js'
import { traceDocs } from './function/matrix/trace.js'
import { transposeDocs } from './function/matrix/transpose.js'
import { zerosDocs } from './function/matrix/zeros.js'
import { fftDocs } from './function/matrix/fft.js'
import { ifftDocs } from './function/matrix/ifft.js'
import { bernoulliDocs } from './function/probability/bernoulli.js'
import { combinationsDocs } from './function/probability/combinations.js'
import { combinationsWithRepDocs } from './function/probability/combinationsWithRep.js'
import { factorialDocs } from './function/probability/factorial.js'
import { gammaDocs } from './function/probability/gamma.js'
import { lgammaDocs } from './function/probability/lgamma.js'
import { kldivergenceDocs } from './function/probability/kldivergence.js'
import { multinomialDocs } from './function/probability/multinomial.js'
import { permutationsDocs } from './function/probability/permutations.js'
import { pickRandomDocs } from './function/probability/pickRandom.js'
import { randomDocs } from './function/probability/random.js'
import { randomIntDocs } from './function/probability/randomInt.js'
import { compareDocs } from './function/relational/compare.js'
import { compareNaturalDocs } from './function/relational/compareNatural.js'
import { compareTextDocs } from './function/relational/compareText.js'
import { deepEqualDocs } from './function/relational/deepEqual.js'
import { equalDocs } from './function/relational/equal.js'
import { equalTextDocs } from './function/relational/equalText.js'
import { largerDocs } from './function/relational/larger.js'
import { largerEqDocs } from './function/relational/largerEq.js'
import { smallerDocs } from './function/relational/smaller.js'
import { smallerEqDocs } from './function/relational/smallerEq.js'
import { unequalDocs } from './function/relational/unequal.js'
import { setCartesianDocs } from './function/set/setCartesian.js'
import { setDifferenceDocs } from './function/set/setDifference.js'
import { setDistinctDocs } from './function/set/setDistinct.js'
import { setIntersectDocs } from './function/set/setIntersect.js'
import { setIsSubsetDocs } from './function/set/setIsSubset.js'
import { setMultiplicityDocs } from './function/set/setMultiplicity.js'
import { setPowersetDocs } from './function/set/setPowerset.js'
import { setSizeDocs } from './function/set/setSize.js'
import { setSymDifferenceDocs } from './function/set/setSymDifference.js'
import { setUnionDocs } from './function/set/setUnion.js'
import { zpk2tfDocs } from './function/signal/zpk2tf.js'
import { freqzDocs } from './function/signal/freqz.js'
import { erfDocs } from './function/special/erf.js'
import { zetaDocs } from './function/special/zeta.js'
import { madDocs } from './function/statistics/mad.js'
import { maxDocs } from './function/statistics/max.js'
import { meanDocs } from './function/statistics/mean.js'
import { medianDocs } from './function/statistics/median.js'
import { minDocs } from './function/statistics/min.js'
import { modeDocs } from './function/statistics/mode.js'
import { prodDocs } from './function/statistics/prod.js'
import { quantileSeqDocs } from './function/statistics/quantileSeq.js'
import { stdDocs } from './function/statistics/std.js'
import { cumSumDocs } from './function/statistics/cumsum.js'
import { sumDocs } from './function/statistics/sum.js'
import { varianceDocs } from './function/statistics/variance.js'
import { corrDocs } from './function/statistics/corr.js'
import { acosDocs } from './function/trigonometry/acos.js'
import { acoshDocs } from './function/trigonometry/acosh.js'
import { acotDocs } from './function/trigonometry/acot.js'
import { acothDocs } from './function/trigonometry/acoth.js'
import { acscDocs } from './function/trigonometry/acsc.js'
import { acschDocs } from './function/trigonometry/acsch.js'
import { asecDocs } from './function/trigonometry/asec.js'
import { asechDocs } from './function/trigonometry/asech.js'
import { asinDocs } from './function/trigonometry/asin.js'
import { asinhDocs } from './function/trigonometry/asinh.js'
import { atanDocs } from './function/trigonometry/atan.js'
import { atan2Docs } from './function/trigonometry/atan2.js'
import { atanhDocs } from './function/trigonometry/atanh.js'
import { cosDocs } from './function/trigonometry/cos.js'
import { coshDocs } from './function/trigonometry/cosh.js'
import { cotDocs } from './function/trigonometry/cot.js'
import { cothDocs } from './function/trigonometry/coth.js'
import { cscDocs } from './function/trigonometry/csc.js'
import { cschDocs } from './function/trigonometry/csch.js'
import { secDocs } from './function/trigonometry/sec.js'
import { sechDocs } from './function/trigonometry/sech.js'
import { sinDocs } from './function/trigonometry/sin.js'
import { sinhDocs } from './function/trigonometry/sinh.js'
import { tanDocs } from './function/trigonometry/tan.js'
import { tanhDocs } from './function/trigonometry/tanh.js'
import { toDocs } from './function/units/to.js'
import { toBestDocs } from './function/units/toBest.js'
import { binDocs } from './function/utils/bin.js'
import { cloneDocs } from './function/utils/clone.js'
import { formatDocs } from './function/utils/format.js'
import { hasNumericValueDocs } from './function/utils/hasNumericValue.js'
import { hexDocs } from './function/utils/hex.js'
import { isIntegerDocs } from './function/utils/isInteger.js'
import { isNaNDocs } from './function/utils/isNaN.js'
import { isBoundedDocs } from './function/utils/isBounded.js'
import { isFiniteDocs } from './function/utils/isFinite.js'
import { isNegativeDocs } from './function/utils/isNegative.js'
import { isNumericDocs } from './function/utils/isNumeric.js'
import { isPositiveDocs } from './function/utils/isPositive.js'
import { isPrimeDocs } from './function/utils/isPrime.js'
import { isZeroDocs } from './function/utils/isZero.js'
import { numericDocs } from './function/utils/numeric.js'
import { octDocs } from './function/utils/oct.js'
import { printDocs } from './function/utils/print.js'
import { typeOfDocs } from './function/utils/typeOf.js'
import { solveODEDocs } from './function/numeric/solveODE.js'

export const embeddedDocs = {

  // construction functions
  bignumber: bignumberDocs,
  bigint: bigintDocs,
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
  coulomb: { description: 'Coulomb\'s constant. Deprecated in favor of coulombConstant', examples: ['coulombConstant'] },
  coulombConstant: { description: 'Coulomb\'s constant', examples: ['coulombConstant'] },
  elementaryCharge: { description: 'Elementary charge', examples: ['elementaryCharge'] },
  bohrMagneton: { description: 'Bohr magneton', examples: ['bohrMagneton'] },
  conductanceQuantum: { description: 'Conductance quantum', examples: ['conductanceQuantum'] },
  inverseConductanceQuantum: { description: 'Inverse conductance quantum', examples: ['inverseConductanceQuantum'] },
  // josephson: {description: 'Josephson constant', examples: ['josephson']},
  magneticFluxQuantum: { description: 'Magnetic flux quantum', examples: ['magneticFluxQuantum'] },
  nuclearMagneton: { description: 'Nuclear magneton', examples: ['nuclearMagneton'] },
  klitzing: { description: 'Von Klitzing constant', examples: ['klitzing'] },

  bohrRadius: { description: 'Bohr radius', examples: ['bohrRadius'] },
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
  leafCount: leafCountDocs,
  polynomialRoot: polynomialRootDocs,
  resolve: resolveDocs,
  simplify: simplifyDocs,
  simplifyConstant: simplifyConstantDocs,
  simplifyCore: simplifyCoreDocs,
  symbolicEqual: symbolicEqualDocs,
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
  invmod: invmodDocs,

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
  parse: parseDocs,
  parser: parserDocs,
  compile: compileDocs,

  // functions - geometry
  distance: distanceDocs,
  intersect: intersectDocs,

  // functions - logical
  and: andDocs,
  not: notDocs,
  nullish: nullishDocs,
  or: orDocs,
  xor: xorDocs,

  // functions - matrix
  mapSlices: mapSlicesDocs,
  concat: concatDocs,
  count: countDocs,
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
  pinv: pinvDocs,
  eigs: eigsDocs,
  kron: kronDocs,
  matrixFromFunction: matrixFromFunctionDocs,
  matrixFromRows: matrixFromRowsDocs,
  matrixFromColumns: matrixFromColumnsDocs,
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
  fft: fftDocs,
  ifft: ifftDocs,
  sylvester: sylvesterDocs,
  schur: schurDocs,
  lyap: lyapDocs,

  // functions - numeric
  solveODE: solveODEDocs,

  // functions - probability
  bernoulli: bernoulliDocs,
  combinations: combinationsDocs,
  combinationsWithRep: combinationsWithRepDocs,
  // distribution: distributionDocs,
  factorial: factorialDocs,
  gamma: gammaDocs,
  kldivergence: kldivergenceDocs,
  lgamma: lgammaDocs,
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

  // functions - signal
  zpk2tf: zpk2tfDocs,
  freqz: freqzDocs,

  // functions - special
  erf: erfDocs,
  zeta: zetaDocs,

  // functions - statistics
  cumsum: cumSumDocs,
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
  corr: corrDocs,

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
  toBest: toBestDocs,

  // functions - utils
  clone: cloneDocs,
  format: formatDocs,
  bin: binDocs,
  oct: octDocs,
  hex: hexDocs,
  isNaN: isNaNDocs,
  isBounded: isBoundedDocs,
  isFinite: isFiniteDocs,
  isInteger: isIntegerDocs,
  isNegative: isNegativeDocs,
  isNumeric: isNumericDocs,
  hasNumericValue: hasNumericValueDocs,
  isPositive: isPositiveDocs,
  isPrime: isPrimeDocs,
  isZero: isZeroDocs,
  print: printDocs,
  typeOf: typeOfDocs,
  numeric: numericDocs
}
