'use strict'

import { lazy } from '../../utils/object'
import { factory } from '../../utils/factory'

const name = 'physicalConstants'
const dependencies = ['scope', 'config', 'type.Unit', 'type.BigNumber']

// FIXME: implement support for a factory without name
export const createPhysicalConstants = factory(name, dependencies, ({ scope, config, type: { Unit, BigNumber } }) => {
  // helper function to create a unit with a fixed prefix
  function fixedUnit (valueStr, name) {
    // Note that we can parse into number or BigNumber.
    // We do not parse into Fractions as that doesn't make sense: we would lose precision of the values
    const value = config().number === 'BigNumber'
      ? new BigNumber(valueStr)
      : parseFloat(valueStr)

    const unit = new Unit(value, name)
    unit.fixPrefix = true
    return unit
  }

  // Source: http://www.wikiwand.com/en/Physical_constant

  // Universal constants
  setLazyConstant(scope, 'speedOfLight', function () { return fixedUnit('299792458', 'm s^-1') })
  setLazyConstant(scope, 'gravitationConstant', function () { return fixedUnit('6.6738480e-11', 'm^3 kg^-1 s^-2') })
  setLazyConstant(scope, 'planckConstant', function () { return fixedUnit('6.626069311e-34', 'J s') })
  setLazyConstant(scope, 'reducedPlanckConstant', function () { return fixedUnit('1.05457172647e-34', 'J s') })

  // Electromagnetic constants
  setLazyConstant(scope, 'magneticConstant', function () { return fixedUnit('1.2566370614e-6', 'N A^-2') })
  setLazyConstant(scope, 'electricConstant', function () { return fixedUnit('8.854187817e-12', 'F m^-1') })
  setLazyConstant(scope, 'vacuumImpedance', function () { return fixedUnit('376.730313461', 'ohm') })
  setLazyConstant(scope, 'coulomb', function () { return fixedUnit('8.9875517873681764e9', 'N m^2 C^-2') })
  setLazyConstant(scope, 'elementaryCharge', function () { return fixedUnit('1.60217656535e-19', 'C') })
  setLazyConstant(scope, 'bohrMagneton', function () { return fixedUnit('9.2740096820e-24', 'J T^-1') })
  setLazyConstant(scope, 'conductanceQuantum', function () { return fixedUnit('7.748091734625e-5', 'S') })
  setLazyConstant(scope, 'inverseConductanceQuantum', function () { return fixedUnit('12906.403721742', 'ohm') })
  setLazyConstant(scope, 'magneticFluxQuantum', function () { return fixedUnit('2.06783375846e-15', 'Wb') })
  setLazyConstant(scope, 'nuclearMagneton', function () { return fixedUnit('5.0507835311e-27', 'J T^-1') })
  setLazyConstant(scope, 'klitzing', function () { return fixedUnit('25812.807443484', 'ohm') })
  // setLazyConstant(scope, 'josephson',                 function () {return fixedUnit('4.8359787011e-14 Hz V^-1')})  // TODO: support for Hz needed

  // Atomic and nuclear constants
  setLazyConstant(scope, 'bohrRadius', function () { return fixedUnit('5.291772109217e-11', 'm') })
  setLazyConstant(scope, 'classicalElectronRadius', function () { return fixedUnit('2.817940326727e-15', 'm') })
  setLazyConstant(scope, 'electronMass', function () { return fixedUnit('9.1093829140e-31', 'kg') })
  setLazyConstant(scope, 'fermiCoupling', function () { return fixedUnit('1.1663645e-5', 'GeV^-2') })
  setLazyConstant(scope, 'fineStructure', function () { return 7.297352569824e-3 })
  setLazyConstant(scope, 'hartreeEnergy', function () { return fixedUnit('4.3597443419e-18', 'J') })
  setLazyConstant(scope, 'protonMass', function () { return fixedUnit('1.67262177774e-27', 'kg') })
  setLazyConstant(scope, 'deuteronMass', function () { return fixedUnit('3.3435830926e-27', 'kg') })
  setLazyConstant(scope, 'neutronMass', function () { return fixedUnit('1.6749271613e-27', 'kg') })
  setLazyConstant(scope, 'quantumOfCirculation', function () { return fixedUnit('3.636947552024e-4', 'm^2 s^-1') })
  setLazyConstant(scope, 'rydberg', function () { return fixedUnit('10973731.56853955', 'm^-1') })
  setLazyConstant(scope, 'thomsonCrossSection', function () { return fixedUnit('6.65245873413e-29', 'm^2') })
  setLazyConstant(scope, 'weakMixingAngle', function () { return 0.222321 })
  setLazyConstant(scope, 'efimovFactor', function () { return 22.7 })

  // Physico-chemical constants
  setLazyConstant(scope, 'atomicMass', function () { return fixedUnit('1.66053892173e-27', 'kg') })
  setLazyConstant(scope, 'avogadro', function () { return fixedUnit('6.0221412927e23', 'mol^-1') })
  setLazyConstant(scope, 'boltzmann', function () { return fixedUnit('1.380648813e-23', 'J K^-1') })
  setLazyConstant(scope, 'faraday', function () { return fixedUnit('96485.336521', 'C mol^-1') })
  setLazyConstant(scope, 'firstRadiation', function () { return fixedUnit('3.7417715317e-16', 'W m^2') })
  // setLazyConstant(scope, 'spectralRadiance',   function () {return fixedUnit('1.19104286953e-16 W m^2 sr^-1')}) // TODO spectralRadiance
  setLazyConstant(scope, 'loschmidt', function () { return fixedUnit('2.686780524e25', 'm^-3') })
  setLazyConstant(scope, 'gasConstant', function () { return fixedUnit('8.314462175', 'J K^-1 mol^-1') })
  setLazyConstant(scope, 'molarPlanckConstant', function () { return fixedUnit('3.990312717628e-10', 'J s mol^-1') })
  setLazyConstant(scope, 'molarVolume', function () { return fixedUnit('2.241396820e-10', 'm^3 mol^-1') })
  setLazyConstant(scope, 'sackurTetrode', function () { return -1.164870823 })
  setLazyConstant(scope, 'secondRadiation', function () { return fixedUnit('1.438777013e-2', 'm K') })
  setLazyConstant(scope, 'stefanBoltzmann', function () { return fixedUnit('5.67037321e-8', 'W m^-2 K^-4') })
  setLazyConstant(scope, 'wienDisplacement', function () { return fixedUnit('2.897772126e-3', 'm K') })

  // Adopted values
  setLazyConstant(scope, 'molarMass', function () { return fixedUnit('1e-3', 'kg mol^-1') })
  setLazyConstant(scope, 'molarMassC12', function () { return fixedUnit('1.2e-2', 'kg mol^-1') })
  setLazyConstant(scope, 'gravity', function () { return fixedUnit('9.80665', 'm s^-2') })
  // atm is defined in Unit.js

  // Natural units
  setLazyConstant(scope, 'planckLength', function () { return fixedUnit('1.61619997e-35', 'm') })
  setLazyConstant(scope, 'planckMass', function () { return fixedUnit('2.1765113e-8', 'kg') })
  setLazyConstant(scope, 'planckTime', function () { return fixedUnit('5.3910632e-44', 's') })
  setLazyConstant(scope, 'planckCharge', function () { return fixedUnit('1.87554595641e-18', 'C') })
  setLazyConstant(scope, 'planckTemperature', function () { return fixedUnit('1.41683385e+32', 'K') })
})

// create a lazy constant in both math and mathWithTransform
function setLazyConstant (math, name, resolver) {
  lazy(math, name, resolver)
  lazy(math.expression.mathWithTransform, name, resolver)
}
