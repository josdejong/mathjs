const assert = require('assert')
const approx = require('../../../tools/approx')
const math = require('../../../src/main')

describe('physical constants', function () {
  it('should return the correct value and unit for physical constants', function () {
    // NOte: to keep these unit tests readable and compact, the toString() of the units is compared

    // Universal constants
    assert.strictEqual(math.speedOfLight.toString(), '2.99792458e+8 m / s')
    assert.strictEqual(math.gravitationConstant.toString(), '6.673848e-11 m^3 / (kg s^2)')
    assert.strictEqual(math.planckConstant.toString(), '6.626069311e-34 J s')
    assert.strictEqual(math.reducedPlanckConstant.toString(), '1.05457172647e-34 J s')

    // Electromagnetic constants
    assert.strictEqual(math.magneticConstant.toString(), '1.2566370614e-6 N / A^2')
    assert.strictEqual(math.electricConstant.toString(), '8.854187817e-12 F / m')
    assert.strictEqual(math.vacuumImpedance.toString(), '376.730313461 ohm')
    assert.strictEqual(math.coulomb.format({ precision: 14 }), '8.9875517873682e+9 (N m^2) / C^2') // round off issues on IE11 if not using precisions
    assert.strictEqual(math.elementaryCharge.toString(), '1.60217656535e-19 C')
    assert.strictEqual(math.bohrMagneton.toString(), '9.274009682e-24 J / T')
    assert.strictEqual(math.conductanceQuantum.toString(), '7.748091734625e-5 S')
    assert.strictEqual(math.inverseConductanceQuantum.toString(), '12906.403721742 ohm')
    assert.strictEqual(math.magneticFluxQuantum.toString(), '2.06783375846e-15 Wb')
    assert.strictEqual(math.nuclearMagneton.toString(), '5.0507835311e-27 J / T')
    assert.strictEqual(math.klitzing.toString(), '25812.807443484 ohm')
    // assert.strictEqual(math.josephson.toString(),                 '4.8359787011e-14 Hz V^-1');  // TODO: support for Hz needed

    // Atomic and nuclear constants
    assert.strictEqual(math.bohrRadius.toString(), '5.291772109217e-11 m')
    assert.strictEqual(math.classicalElectronRadius.toString(), '2.817940326727e-15 m')
    assert.strictEqual(math.electronMass.format({ precision: 14 }), '9.109382914e-31 kg')
    assert.strictEqual(math.fermiCoupling.toString(), '1.1663645e-5 GeV^-2')
    approx.equal(math.fineStructure, 7.297352569824e-3)
    assert.strictEqual(math.hartreeEnergy.toString(), '4.3597443419e-18 J')
    assert.strictEqual(math.protonMass.toString(), '1.67262177774e-27 kg')
    assert.strictEqual(math.deuteronMass.toString(), '3.3435830926e-27 kg') // round-off error
    assert.strictEqual(math.neutronMass.toString(), '1.6749271613e-27 kg')
    assert.strictEqual(math.quantumOfCirculation.toString(), '3.636947552024e-4 m^2 / s')
    assert.strictEqual(math.rydberg.toString(), '1.097373156853955e+7 m^-1')
    assert.strictEqual(math.thomsonCrossSection.toString(), '6.65245873413e-29 m^2')
    approx.equal(math.weakMixingAngle, 0.222321)
    approx.equal(math.efimovFactor, 22.7)

    // Physico-chemical constants
    assert.strictEqual(math.atomicMass.format({ precision: 14 }), '1.66053892173e-27 kg') // round-off error
    assert.strictEqual(math.avogadro.toString(), '6.0221412927e+23 mol^-1')
    assert.strictEqual(math.boltzmann.toString(), '1.380648813e-23 J / K')
    assert.strictEqual(math.faraday.toString(), '96485.336521 C / mol')
    assert.strictEqual(math.firstRadiation.toString(), '3.7417715317e-16 W m^2')
    assert.strictEqual(math.loschmidt.toString(), '2.686780524e+25 m^-3')
    assert.strictEqual(math.gasConstant.toString(), '8.314462175 J / (K mol)')
    assert.strictEqual(math.molarPlanckConstant.toString(), '3.990312717628e-10 (J s) / mol')
    assert.strictEqual(math.molarVolume.toString(), '2.24139682e-10 m^3 / mol')
    approx.equal(math.sackurTetrode, -1.164870823)
    assert.strictEqual(math.secondRadiation.toString(), '0.01438777013 m K')
    assert.strictEqual(math.stefanBoltzmann.toString(), '5.67037321e-8 W / (m^2 K^4)')
    assert.strictEqual(math.wienDisplacement.toString(), '0.002897772126 m K')
    // assert.strictEqual(math.spectralRadiance.toString(),   '1.19104286953e-16 W m^2 sr^-1'); // TODO spectralRadiance

    // Adopted values
    assert.strictEqual(math.molarMass.toString(), '0.001 kg / mol')
    assert.strictEqual(math.molarMassC12.toString(), '0.012 kg / mol')
    assert.strictEqual(math.gravity.toString(), '9.80665 m / s^2')

    // Natural units
    assert.strictEqual(math.planckLength.toString(), '1.61619997e-35 m')
    assert.strictEqual(math.planckMass.toString(), '2.1765113e-8 kg')
    assert.strictEqual(math.planckTime.toString(), '5.3910632e-44 s')
    assert.strictEqual(math.planckCharge.toString(), '1.87554595641e-18 C')
    assert.strictEqual(math.planckTemperature.toString(), '1.41683385e+32 K')
  })
})
