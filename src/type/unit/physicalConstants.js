'use strict'
const lazy = require('../../utils/object').lazy

function factory (type, config, load, typed, math) {
  // helper function to create a unit with a fixed prefix
  function fixedUnit (str) {
    const unit = type.Unit.parse(str)
    unit.fixPrefix = true
    return unit
  }

  // Source: https://en.wikipedia.org/wiki/Physical_constant

  // Universal constants
  setLazyConstant(math, 'speedOfLight', function () { return fixedUnit('299792458 m s^-1') })
  setLazyConstant(math, 'gravitationConstant', function () { return fixedUnit('6.67430e-11 m^3 kg^-1 s^-2') })
  setLazyConstant(math, 'planckConstant', function () { return fixedUnit('6.62607015e-34 J s') })
  setLazyConstant(math, 'reducedPlanckConstant', function () { return fixedUnit('1.0545718176461565e-34 J s') })

  // Electromagnetic constants
  setLazyConstant(math, 'magneticConstant', function () { return fixedUnit('1.25663706212e-6 N A^-2') })
  setLazyConstant(math, 'electricConstant', function () { return fixedUnit('8.8541878128e-12 F m^-1') })
  setLazyConstant(math, 'vacuumImpedance', function () { return fixedUnit('376.730313667 ohm') })
  setLazyConstant(math, 'coulomb', function () { return fixedUnit('8.987551792261171e9 N m^2 C^-2') })
  setLazyConstant(math, 'elementaryCharge', function () { return fixedUnit('1.602176634e-19 C') })
  setLazyConstant(math, 'bohrMagneton', function () { return fixedUnit('9.2740100783e-24 J T^-1') })
  setLazyConstant(math, 'conductanceQuantum', function () { return fixedUnit('7.748091729863649e-5 S') })
  setLazyConstant(math, 'inverseConductanceQuantum', function () { return fixedUnit('12906.403729652257 ohm') })
  setLazyConstant(math, 'magneticFluxQuantum', function () { return fixedUnit('2.0678338484619295e-15 Wb') })
  setLazyConstant(math, 'nuclearMagneton', function () { return fixedUnit('5.0507837461e-27 J T^-1') })
  setLazyConstant(math, 'klitzing', function () { return fixedUnit('25812.807459304513 ohm') })
  setLazyConstant(math, 'josephson', function () { return fixedUnit('4.835978484169836e14 Hz V^-1') })

  // Atomic and nuclear constants
  setLazyConstant(math, 'bohrRadius', function () { return fixedUnit('5.29177210903e-11 m') })
  setLazyConstant(math, 'classicalElectronRadius', function () { return fixedUnit('2.8179403262e-15 m') })
  setLazyConstant(math, 'electronMass', function () { return fixedUnit('9.1093837015e-31 kg') })
  setLazyConstant(math, 'fermiCoupling', function () { return fixedUnit('1.1663787e-5 GeV^-2') })
  setLazyConstant(math, 'fineStructure', function () { return 7.2973525693e-3 })
  setLazyConstant(math, 'hartreeEnergy', function () { return fixedUnit('4.3597447222071e-18 J') })
  setLazyConstant(math, 'protonMass', function () { return fixedUnit('1.67262192369e-27 kg') })
  setLazyConstant(math, 'deuteronMass', function () { return fixedUnit('3.3435830926e-27 kg') })
  setLazyConstant(math, 'neutronMass', function () { return fixedUnit('1.6749271613e-27 kg') })
  setLazyConstant(math, 'quantumOfCirculation', function () { return fixedUnit('3.6369475516e-4 m^2 s^-1') })
  setLazyConstant(math, 'rydberg', function () { return fixedUnit('10973731.568160 m^-1') })
  setLazyConstant(math, 'thomsonCrossSection', function () { return fixedUnit('6.6524587321e-29 m^2') })
  setLazyConstant(math, 'weakMixingAngle', function () { return 0.22290 })
  setLazyConstant(math, 'efimovFactor', function () { return 22.7 })

  // Physico-chemical constants
  setLazyConstant(math, 'atomicMass', function () { return fixedUnit('1.66053906660e-27 kg') })
  setLazyConstant(math, 'avogadro', function () { return fixedUnit('6.02214076e23 mol^-1') })
  setLazyConstant(math, 'boltzmann', function () { return fixedUnit('1.380649e-23 J K^-1') })
  setLazyConstant(math, 'faraday', function () { return fixedUnit('96485.33212331001 C mol^-1') })
  setLazyConstant(math, 'firstRadiation', function () { return fixedUnit('3.7417718521927573e-16 W m^2') })
  // setLazyConstant(math, 'spectralRadiance',   function () {return fixedUnit('1.1910429723971881e-16 W m^2 sr^-1')})
  setLazyConstant(math, 'loschmidt', function () { return fixedUnit('2.686780111798444e25 m^-3') })
  setLazyConstant(math, 'gasConstant', function () { return fixedUnit('8.31446261815324 J K^-1 mol^-1') })
  setLazyConstant(math, 'molarPlanckConstant', function () { return fixedUnit('3.990312712893431e-10 J s mol^-1') })
  setLazyConstant(math, 'molarVolume', function () { return fixedUnit('0.022413969545014137 m^3 mol^-1') })
  setLazyConstant(math, 'sackurTetrode', function () { return -1.16487052358 })
  setLazyConstant(math, 'secondRadiation', function () { return fixedUnit('0.014387768775039337  m K') })
  setLazyConstant(math, 'stefanBoltzmann', function () { return fixedUnit('5.67037441918443e-8 W m^-2 K^-4') })
  setLazyConstant(math, 'wienDisplacement', function () { return fixedUnit('2.897771955e-3 m K') })

  // Adopted values
  setLazyConstant(math, 'molarMass', function () { return fixedUnit('0.99999999965e-3 kg mol^-1') })
  setLazyConstant(math, 'molarMassC12', function () { return fixedUnit('11.9999999958e-3 kg mol^-1') })
  setLazyConstant(math, 'gravity', function () { return fixedUnit('9.80665 m s^-2') })
  // atm is defined in Unit.js

  // Natural units
  setLazyConstant(math, 'planckLength', function () { return fixedUnit('1.616255e-35 m') })
  setLazyConstant(math, 'planckMass', function () { return fixedUnit('2.176435e-8 kg') })
  setLazyConstant(math, 'planckTime', function () { return fixedUnit('5.391245e-44 s') })
  setLazyConstant(math, 'planckCharge', function () { return fixedUnit('1.87554603778e-18 C') })
  setLazyConstant(math, 'planckTemperature', function () { return fixedUnit('1.416785e+32 K') })
}

// create a lazy constant in both math and mathWithTransform
function setLazyConstant (math, name, resolver) {
  lazy(math, name, resolver)
  lazy(math.expression.mathWithTransform, name, resolver)
}

exports.factory = factory
exports.lazy = false // no lazy loading of constants, the constants themselves are lazy when needed
exports.math = true // request access to the math namespace
