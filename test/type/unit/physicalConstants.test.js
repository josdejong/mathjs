import assert from 'assert'
import approx from '../../../tools/approx'
import {
  createAtomicMass,
  createAvogadro,
  createBohrMagneton,
  createBohrRadius,
  createBoltzmann,
  createClassicalElectronRadius,
  createConductanceQuantum,
  createCoulomb,
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
} from '../../../src/type/unit/physicalConstants'
import { BigNumber, Unit } from '../../../src/entry/pureFunctionsAny.generated'

describe('physical constants', function () {
  it('should return the correct value and unit for physical constants', function () {
    // Note: to keep these unit tests readable and compact, the toString() of the units is compared
    const config = { number: 'number', precision: 64, epsilon: 1e-12 }
    const dependencies = { config, BigNumber, Unit }

    // Universal constants
    assert.strictEqual(createSpeedOfLight(dependencies).toString(), '2.99792458e+8 m / s')
    assert.strictEqual(createGravitationConstant(dependencies).toString(), '6.673848e-11 m^3 / (kg s^2)')
    assert.strictEqual(createPlanckConstant(dependencies).toString(), '6.626069311e-34 J s')
    assert.strictEqual(createReducedPlanckConstant(dependencies).toString(), '1.05457172647e-34 J s')

    // Electromagnetic constants
    assert.strictEqual(createMagneticConstant(dependencies).toString(), '1.2566370614e-6 N / A^2')
    assert.strictEqual(createElectricConstant(dependencies).toString(), '8.854187817e-12 F / m')
    assert.strictEqual(createVacuumImpedance(dependencies).toString(), '376.730313461 ohm')
    assert.strictEqual(createCoulomb(dependencies).format({ precision: 14 }), '8.9875517873682e+9 (N m^2) / C^2') // round off issues on IE11 if not using precisions
    assert.strictEqual(createElementaryCharge(dependencies).toString(), '1.60217656535e-19 C')
    assert.strictEqual(createBohrMagneton(dependencies).toString(), '9.274009682e-24 J / T')
    assert.strictEqual(createConductanceQuantum(dependencies).toString(), '7.748091734625e-5 S')
    assert.strictEqual(createInverseConductanceQuantum(dependencies).toString(), '12906.403721742 ohm')
    assert.strictEqual(createMagneticFluxQuantum(dependencies).toString(), '2.06783375846e-15 Wb')
    assert.strictEqual(createNuclearMagneton(dependencies).toString(), '5.0507835311e-27 J / T')
    assert.strictEqual(createKlitzing(dependencies).toString(), '25812.807443484 ohm')
    // assert.strictEqual(createJosephson(dependencies).toString(),                 '4.8359787011e-14 Hz V^-1');  // TODO: support for Hz needed

    // Atomic and nuclear constants
    assert.strictEqual(createBohrRadius(dependencies).toString(), '5.291772109217e-11 m')
    assert.strictEqual(createClassicalElectronRadius(dependencies).toString(), '2.817940326727e-15 m')
    assert.strictEqual(createElectronMass(dependencies).format({ precision: 14 }), '9.109382914e-31 kg')
    assert.strictEqual(createFermiCoupling(dependencies).toString(), '1.1663645e-5 GeV^-2')
    approx.equal(createFineStructure(dependencies), 7.297352569824e-3)
    assert.strictEqual(createHartreeEnergy(dependencies).toString(), '4.3597443419e-18 J')
    assert.strictEqual(createProtonMass(dependencies).toString(), '1.67262177774e-27 kg')
    assert.strictEqual(createDeuteronMass(dependencies).toString(), '3.3435830926e-27 kg') // round-off error
    assert.strictEqual(createNeutronMass(dependencies).toString(), '1.6749271613e-27 kg')
    assert.strictEqual(createQuantumOfCirculation(dependencies).toString(), '3.636947552024e-4 m^2 / s')
    assert.strictEqual(createRydberg(dependencies).toString(), '1.097373156853955e+7 m^-1')
    assert.strictEqual(createThomsonCrossSection(dependencies).toString(), '6.65245873413e-29 m^2')
    approx.equal(createWeakMixingAngle(dependencies), 0.222321)
    approx.equal(createEfimovFactor(dependencies), 22.7)

    // Physico-chemical constants
    assert.strictEqual(createAtomicMass(dependencies).format({ precision: 14 }), '1.66053892173e-27 kg') // round-off error
    assert.strictEqual(createAvogadro(dependencies).toString(), '6.0221412927e+23 mol^-1')
    assert.strictEqual(createBoltzmann(dependencies).toString(), '1.380648813e-23 J / K')
    assert.strictEqual(createFaraday(dependencies).toString(), '96485.336521 C / mol')
    assert.strictEqual(createFirstRadiation(dependencies).toString(), '3.7417715317e-16 W m^2')
    assert.strictEqual(createLoschmidt(dependencies).toString(), '2.686780524e+25 m^-3')
    assert.strictEqual(createGasConstant(dependencies).toString(), '8.314462175 J / (K mol)')
    assert.strictEqual(createMolarPlanckConstant(dependencies).toString(), '3.990312717628e-10 (J s) / mol')
    assert.strictEqual(createMolarVolume(dependencies).toString(), '2.24139682e-10 m^3 / mol')
    approx.equal(createSackurTetrode(dependencies), -1.164870823)
    assert.strictEqual(createSecondRadiation(dependencies).toString(), '0.01438777013 m K')
    assert.strictEqual(createStefanBoltzmann(dependencies).toString(), '5.67037321e-8 W / (m^2 K^4)')
    assert.strictEqual(createWienDisplacement(dependencies).toString(), '0.002897772126 m K')
    // assert.strictEqual(createSpectralRadiance(dependencies).toString(),   '1.19104286953e-16 W m^2 sr^-1'); // TODO spectralRadiance

    // Adopted values
    assert.strictEqual(createMolarMass(dependencies).toString(), '0.001 kg / mol')
    assert.strictEqual(createMolarMassC12(dependencies).toString(), '0.012 kg / mol')
    assert.strictEqual(createGravity(dependencies).toString(), '9.80665 m / s^2')

    // Natural units
    assert.strictEqual(createPlanckLength(dependencies).toString(), '1.61619997e-35 m')
    assert.strictEqual(createPlanckMass(dependencies).toString(), '2.1765113e-8 kg')
    assert.strictEqual(createPlanckTime(dependencies).toString(), '5.3910632e-44 s')
    assert.strictEqual(createPlanckCharge(dependencies).toString(), '1.87554595641e-18 C')
    assert.strictEqual(createPlanckTemperature(dependencies).toString(), '1.41683385e+32 K')
  })

  it('should create BigNumber unit values if configured', () => {
    const config = { number: 'BigNumber', precision: 64, epsilon: 1e-12 }
    const dependencies = { config, BigNumber, Unit }
    const molarMass = createMolarMass(dependencies)

    assert.strictEqual(molarMass.toString(), '0.001 kg / mol')
    assert(molarMass.value instanceof BigNumber)
  })
})
