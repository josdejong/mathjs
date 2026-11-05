import assert from 'assert'
import { approxEqual } from '../../../../tools/approx.js'
import {
  createAtomicMass,
  createAvogadro,
  createBohrMagneton,
  createBohrRadius,
  createBoltzmann,
  createClassicalElectronRadius,
  createConductanceQuantum,
  createCoulomb,
  createCoulombConstant,
  createDeuteronMass,
  createEfimovFactor,
  createElectricConstant,
  createElectronMass,
  createElementaryCharge,
  createFaraday,
  createFermiCoupling,
  createFineStructure,
  createFirstRadiation,
  createGasConstant,
  createGravitationConstant,
  createGravity,
  createHartreeEnergy,
  createInverseConductanceQuantum,
  createJosephson,
  createKlitzing,
  createLoschmidt,
  createMagneticConstant,
  createMagneticFluxQuantum,
  createMolarMass,
  createMolarMassC12,
  createMolarPlanckConstant,
  createMolarVolume,
  createNeutronMass,
  createNuclearMagneton,
  createPlanckCharge,
  createPlanckConstant,
  createPlanckLength,
  createPlanckMass,
  createPlanckTemperature,
  createPlanckTime,
  createProtonMass,
  createQuantumOfCirculation,
  createReducedPlanckConstant,
  createRydberg,
  createSackurTetrode,
  createSecondRadiation,
  createSpeedOfLight,
  createStefanBoltzmann,
  createThomsonCrossSection,
  createVacuumImpedance,
  createWeakMixingAngle,
  createWienDisplacement
} from '../../../../src/type/unit/physicalConstants.js'
import math from '../../../../src/defaultInstance.js'

const { BigNumber, Unit } = math

describe('physical constants', function () {
  it('should return the correct value and unit for physical constants', function () {
    // Note: to keep these unit tests readable and compact, the toString() of the units is compared
    const config = { number: 'number', precision: 64, relTol: 1e-12 }
    const dependencies = { config, BigNumber, Unit }

    // Universal constants
    assert.strictEqual(createSpeedOfLight(dependencies).toString(), '2.99792458e+8 m / s')
    assert.strictEqual(createGravitationConstant(dependencies).toString(), '6.6743e-11 m^3 / (kg s^2)')
    assert.strictEqual(createPlanckConstant(dependencies).toString(), '6.62607015e-34 J s')
    // round-off errors on IE and Edge
    const reducedPlanck = createReducedPlanckConstant(dependencies).toString()
    assert(
      reducedPlanck === '1.0545718176461565e-34 J s' ||
      reducedPlanck === '1.0545718176461564e-34 J s')

    // Electromagnetic constants
    assert.strictEqual(createMagneticConstant(dependencies).toString(), '1.25663706212e-6 N / A^2')
    assert.strictEqual(createElectricConstant(dependencies).toString(), '8.8541878128e-12 F / m')
    assert.strictEqual(createVacuumImpedance(dependencies).toString(), '376.730313667 ohm')
    assert.strictEqual(createCoulomb(dependencies).toString(), '8.987551792261171e+9 (N m^2) / C^2')
    assert.strictEqual(createCoulombConstant(dependencies).toString(), '8.987551792261171e+9 (N m^2) / C^2')
    assert.strictEqual(math.coulombConstant.toString(), '8.987551792261171e+9 (N m^2) / C^2')
    assert.strictEqual(createElementaryCharge(dependencies).toString(), '1.602176634e-19 C')
    assert.strictEqual(createBohrMagneton(dependencies).toString(), '9.2740100783e-24 J / T')
    assert.strictEqual(createConductanceQuantum(dependencies).toString(), '7.748091729863649e-5 S')
    // round-off errors on IE and Edge
    const inverseConductanceQuantum = createInverseConductanceQuantum(dependencies).toString()
    assert(
      inverseConductanceQuantum === '12906.403729652257 ohm' ||
      inverseConductanceQuantum === '12906.403729652256 ohm')
    assert.strictEqual(createMagneticFluxQuantum(dependencies).toString(), '2.0678338484619295e-15 Wb')
    assert.strictEqual(createNuclearMagneton(dependencies).toString(), '5.0507837461e-27 J / T')
    assert.strictEqual(createKlitzing(dependencies).toString(), '25812.807459304513 ohm')
    assert.strictEqual(createJosephson(dependencies).toString(), '4.835978484169836e+14 Hz / V')

    // Atomic and nuclear constants
    assert.strictEqual(createBohrRadius(dependencies).toString(), '5.29177210903e-11 m')
    assert.strictEqual(createClassicalElectronRadius(dependencies).toString(), '2.8179403262e-15 m')
    assert.strictEqual(createElectronMass(dependencies).toString(), '9.1093837015e-31 kg')
    assert.strictEqual(createFermiCoupling(dependencies).toString(), '1.1663787e-5 GeV^-2')
    approxEqual(createFineStructure(dependencies), 7.2973525693e-3)
    assert.strictEqual(createHartreeEnergy(dependencies).toString(), '4.3597447222071e-18 J')
    assert.strictEqual(createProtonMass(dependencies).toString(), '1.67262192369e-27 kg')
    assert.strictEqual(createDeuteronMass(dependencies).toString(), '3.3435830926e-27 kg')
    assert.strictEqual(createNeutronMass(dependencies).toString(), '1.6749271613e-27 kg')
    assert.strictEqual(createQuantumOfCirculation(dependencies).toString(), '3.6369475516e-4 m^2 / s')
    assert.strictEqual(createRydberg(dependencies).toString(), '1.097373156816e+7 m^-1')
    assert.strictEqual(createThomsonCrossSection(dependencies).toString(), '6.6524587321e-29 m^2')
    approxEqual(createWeakMixingAngle(dependencies), 0.22290)
    approxEqual(createEfimovFactor(dependencies), 22.7)

    // Physico-chemical constants
    assert.strictEqual(createAtomicMass(dependencies).toString(), '1.6605390666e-27 kg')
    assert.strictEqual(createAvogadro(dependencies).toString(), '6.02214076e+23 mol^-1')
    assert.strictEqual(createBoltzmann(dependencies).toString(), '1.380649e-23 J / K')
    assert.strictEqual(createFaraday(dependencies).toString(), '96485.33212331001 C / mol')
    assert.strictEqual(createFirstRadiation(dependencies).toString(), '3.7417718521927573e-16 W m^2')
    assert.strictEqual(createLoschmidt(dependencies).toString(), '2.686780111798444e+25 m^-3')
    assert.strictEqual(createGasConstant(dependencies).toString(), '8.31446261815324 J / (K mol)')
    assert.strictEqual(createMolarPlanckConstant(dependencies).toString(), '3.990312712893431e-10 (J s) / mol')
    assert.strictEqual(createMolarVolume(dependencies).toString(), '0.022413969545014137 m^3 / mol')
    approxEqual(createSackurTetrode(dependencies), -1.16487052358)
    assert.strictEqual(createSecondRadiation(dependencies).toString(), '0.014387768775039337 m K')
    assert.strictEqual(createStefanBoltzmann(dependencies).toString(), '5.67037441918443e-8 W / (m^2 K^4)')
    assert.strictEqual(createWienDisplacement(dependencies).toString(), '0.002897771955 m K')
    // assert.strictEqual(createSpectralRadiance(dependencies).toString(),   '1.19104286953e-16 W m^2 sr^-1'); // TODO spectralRadiance

    // Adopted values
    assert.strictEqual(createMolarMass(dependencies).toString(), '9.9999999965e-4 kg / mol')
    assert.strictEqual(createMolarMassC12(dependencies).toString(), '0.0119999999958 kg / mol')
    assert.strictEqual(createGravity(dependencies).toString(), '9.80665 m / s^2')

    // Natural units
    assert.strictEqual(createPlanckLength(dependencies).toString(), '1.616255e-35 m')
    assert.strictEqual(createPlanckMass(dependencies).toString(), '2.176435e-8 kg')
    assert.strictEqual(createPlanckTime(dependencies).toString(), '5.391245e-44 s')
    assert.strictEqual(createPlanckCharge(dependencies).toString(), '1.87554603778e-18 C')
    assert.strictEqual(createPlanckTemperature(dependencies).toString(), '1.416785e+32 K')
  })

  it('should create BigNumber unit values if configured', function () {
    const config = { number: 'BigNumber', precision: 64, relTol: 1e-12 }
    const dependencies = { config, BigNumber, Unit }
    const molarMass = createMolarMass(dependencies)

    assert.strictEqual(molarMass.toString(), '9.9999999965e-4 kg / mol')
    assert(molarMass.value instanceof BigNumber)
  })
})
