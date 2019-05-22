const assert = require('assert')
const approx = require('../../../tools/approx')
const math = require('../../../src/main')

describe('physical constants', function () {
  it('should return the correct value and unit for physical constants', function () {
    // NOte: to keep these unit tests readable and compact, the toString() of the units is compared

    // Universal constants
    assert.strictEqual(math.speedOfLight.toString(), '2.99792458e+8 m / s')
    assert.strictEqual(math.gravitationConstant.toString(), '6.6743e-11 m^3 / (kg s^2)')
    assert.strictEqual(math.planckConstant.toString(), '6.62607015e-34 J s')
    assert.strictEqual(math.reducedPlanckConstant.toString(), '1.0545718176461565e-34 J s')

    // Electromagnetic constants
    assert.strictEqual(math.magneticConstant.toString(), '1.25663706212e-6 N / A^2')
    assert.strictEqual(math.electricConstant.toString(), '8.8541878128e-12 F / m')
    assert.strictEqual(math.vacuumImpedance.toString(), '376.730313667 ohm')
    assert.strictEqual(math.coulomb.toString(), '8.987551792261171e+9 (N m^2) / C^2')
    assert.strictEqual(math.elementaryCharge.toString(), '1.602176634e-19 C')
    assert.strictEqual(math.bohrMagneton.toString(), '9.2740100783e-24 J / T')
    assert.strictEqual(math.conductanceQuantum.toString(), '7.748091729863649e-5 S')
    assert.strictEqual(math.inverseConductanceQuantum.toString(), '12906.403729652257 ohm')
    assert.strictEqual(math.magneticFluxQuantum.toString(), '2.0678338484619295e-15 Wb')
    assert.strictEqual(math.nuclearMagneton.toString(), '5.0507837461e-27 J / T')
    assert.strictEqual(math.klitzing.toString(), '25812.807459304513 ohm')
    assert.strictEqual(math.josephson.toString(), '4.835978484169836e+14 Hz / V')

    // Atomic and nuclear constants
    assert.strictEqual(math.bohrRadius.toString(), '5.29177210903e-11 m')
    assert.strictEqual(math.classicalElectronRadius.toString(), '2.8179403262e-15 m')
    assert.strictEqual(math.electronMass.toString(), '9.1093837015e-31 kg')
    assert.strictEqual(math.fermiCoupling.toString(), '1.1663787e-5 GeV^-2')
    approx.equal(math.fineStructure, 7.2973525693e-3)
    assert.strictEqual(math.hartreeEnergy.toString(), '4.3597447222071e-18 J')
    assert.strictEqual(math.protonMass.toString(), '1.67262192369e-27 kg')
    assert.strictEqual(math.deuteronMass.toString(), '3.3435830926e-27 kg')
    assert.strictEqual(math.neutronMass.toString(), '1.6749271613e-27 kg')
    assert.strictEqual(math.quantumOfCirculation.toString(), '3.6369475516e-4 m^2 / s')
    assert.strictEqual(math.rydberg.toString(), '1.097373156816e+7 m^-1')
    assert.strictEqual(math.thomsonCrossSection.toString(), '6.6524587321e-29 m^2')
    approx.equal(math.weakMixingAngle, 0.22290)
    approx.equal(math.efimovFactor, 22.7)

    // Physico-chemical constants
    assert.strictEqual(math.atomicMass.toString(), '1.6605390666e-27 kg')
    assert.strictEqual(math.avogadro.toString(), '6.02214076e+23 mol^-1')
    assert.strictEqual(math.boltzmann.toString(), '1.380649e-23 J / K')
    assert.strictEqual(math.faraday.toString(), '96485.33212331001 C / mol')
    assert.strictEqual(math.firstRadiation.toString(), '3.7417718521927573e-16 W m^2')
    // assert.strictEqual(math.spectralRadiance.toString(), '1.1910429723971881e-16 W m^2 / sr')
    assert.strictEqual(math.loschmidt.toString(), '2.686780111798444e+25 m^-3')
    assert.strictEqual(math.gasConstant.toString(), '8.31446261815324 J / (K mol)')
    assert.strictEqual(math.molarPlanckConstant.toString(), '3.990312712893431e-10 (J s) / mol')
    assert.strictEqual(math.molarVolume.toString(), '0.022413969545014137 m^3 / mol')
    approx.equal(math.sackurTetrode, -1.16487052358)
    assert.strictEqual(math.secondRadiation.toString(), '0.014387768775039337 m K')
    assert.strictEqual(math.stefanBoltzmann.toString(), '5.67037441918443e-8 W / (m^2 K^4)')
    assert.strictEqual(math.wienDisplacement.toString(), '0.002897771955 m K')

    // Adopted values
    assert.strictEqual(math.molarMass.toString(), '9.9999999965e-4 kg / mol')
    assert.strictEqual(math.molarMassC12.toString(), '0.0119999999958 kg / mol')
    assert.strictEqual(math.gravity.toString(), '9.80665 m / s^2')

    // Natural units
    assert.strictEqual(math.planckLength.toString(), '1.616255e-35 m')
    assert.strictEqual(math.planckMass.toString(), '2.176435e-8 kg')
    assert.strictEqual(math.planckTime.toString(), '5.391245e-44 s')
    assert.strictEqual(math.planckCharge.toString(), '1.87554603778e-18 C')
    assert.strictEqual(math.planckTemperature.toString(), '1.416785e+32 K')
  })
})
