'use strict'

import { factory } from '../../utils/factory'

// Source: http://www.wikiwand.com/en/Physical_constant

// Universal constants
export const createSpeedOfLight = unitFactory('speedOfLight', '299792458', 'm s^-1')
export const createGravitationConstant = unitFactory('gravitationConstant', '6.6738480e-11', 'm^3 kg^-1 s^-2')
export const createPlanckConstant = unitFactory('planckConstant', '6.626069311e-34', 'J s')
export const createReducedPlanckConstant = unitFactory('reducedPlanckConstant', '1.05457172647e-34', 'J s')

// Electromagnetic constants
export const createMagneticConstant = unitFactory('magneticConstant', '1.2566370614e-6', 'N A^-2')
export const createElectricConstant = unitFactory('electricConstant', '8.854187817e-12', 'F m^-1')
export const createVacuumImpedance = unitFactory('vacuumImpedance', '376.730313461', 'ohm')
export const createCoulomb = unitFactory('coulomb', '8.9875517873681764e9', 'N m^2 C^-2')
export const createElementaryCharge = unitFactory('elementaryCharge', '1.60217656535e-19', 'C')
export const createBohrMagneton = unitFactory('bohrMagneton', '9.2740096820e-24', 'J T^-1')
export const createConductanceQuantum = unitFactory('conductanceQuantum', '7.748091734625e-5', 'S')
export const createInverseConductanceQuantum = unitFactory('inverseConductanceQuantum', '12906.403721742', 'ohm')
export const createMagneticFluxQuantum = unitFactory('magneticFluxQuantum', '2.06783375846e-15', 'Wb')
export const createNuclearMagneton = unitFactory('nuclearMagneton', '5.0507835311e-27', 'J T^-1')
export const createKlitzing = unitFactory('klitzing', '25812.807443484', 'ohm')
// export const createJosephson = unitFactory('josephson', '4.8359787011e-14 Hz V^-1') // TODO: support for Hz needed

// Atomic and nuclear constants
export const createBohrRadius = unitFactory('bohrRadius', '5.291772109217e-11', 'm')
export const createClassicalElectronRadius = unitFactory('classicalElectronRadius', '2.817940326727e-15', 'm')
export const createElectronMass = unitFactory('electronMass', '9.1093829140e-31', 'kg')
export const createFermiCoupling = unitFactory('fermiCoupling', '1.1663645e-5', 'GeV^-2')
export const createFineStructure = numberFactory('fineStructure', 7.297352569824e-3)
export const createHartreeEnergy = unitFactory('hartreeEnergy', '4.3597443419e-18', 'J')
export const createProtonMass = unitFactory('protonMass', '1.67262177774e-27', 'kg')
export const createDeuteronMass = unitFactory('deuteronMass', '3.3435830926e-27', 'kg')
export const createNeutronMass = unitFactory('neutronMass', '1.6749271613e-27', 'kg')
export const createQuantumOfCirculation = unitFactory('quantumOfCirculation', '3.636947552024e-4', 'm^2 s^-1')
export const createRydberg = unitFactory('rydberg', '10973731.56853955', 'm^-1')
export const createThomsonCrossSection = unitFactory('thomsonCrossSection', '6.65245873413e-29', 'm^2')
export const createWeakMixingAngle = numberFactory('weakMixingAngle', 0.222321)
export const createEfimovFactor = numberFactory('efimovFactor', 22.7)

// Physico-chemical constants
export const createAtomicMass = unitFactory('atomicMass', '1.66053892173e-27', 'kg')
export const createAvogadro = unitFactory('avogadro', '6.0221412927e23', 'mol^-1')
export const createBoltzmann = unitFactory('boltzmann', '1.380648813e-23', 'J K^-1')
export const createFaraday = unitFactory('faraday', '96485.336521', 'C mol^-1')
export const createFirstRadiation = unitFactory('firstRadiation', '3.7417715317e-16', 'W m^2')
// export const createSpectralRadiance = unitFactory('spectralRadiance', '1.19104286953e-16', 'W m^2 sr^-1') // TODO spectralRadiance
export const createLoschmidt = unitFactory('loschmidt', '2.686780524e25', 'm^-3')
export const createGasConstant = unitFactory('gasConstant', '8.314462175', 'J K^-1 mol^-1')
export const createMolarPlanckConstant = unitFactory('molarPlanckConstant', '3.990312717628e-10', 'J s mol^-1')
export const createMolarVolume = unitFactory('molarVolume', '2.241396820e-10', 'm^3 mol^-1')
export const createSackurTetrode = numberFactory('sackurTetrode', -1.164870823)
export const createSecondRadiation = unitFactory('secondRadiation', '1.438777013e-2', 'm K')
export const createStefanBoltzmann = unitFactory('stefanBoltzmann', '5.67037321e-8', 'W m^-2 K^-4')
export const createWienDisplacement = unitFactory('wienDisplacement', '2.897772126e-3', 'm K')

// Adopted values
export const createMolarMass = unitFactory('molarMass', '1e-3', 'kg mol^-1')
export const createMolarMassC12 = unitFactory('molarMassC12', '1.2e-2', 'kg mol^-1')
export const createGravity = unitFactory('gravity', '9.80665', 'm s^-2')
// atm is defined in Unit.js

// Natural units
export const createPlanckLength = unitFactory('planckLength', '1.61619997e-35', 'm')
export const createPlanckMass = unitFactory('planckMass', '2.1765113e-8', 'kg')
export const createPlanckTime = unitFactory('planckTime', '5.3910632e-44', 's')
export const createPlanckCharge = unitFactory('planckCharge', '1.87554595641e-18', 'C')
export const createPlanckTemperature = unitFactory('planckTemperature', '1.41683385e+32', 'K')

// helper function to create a factory function which creates a physical constant,
// a Unit with either a number value or a BigNumber value depending on the configuration
function unitFactory (name, valueStr, unitStr) {
  const dependencies = ['config', 'Unit', 'BigNumber']

  return factory(name, dependencies, ({ config: { number }, Unit, BigNumber }) => {
    // Note that we can parse into number or BigNumber.
    // We do not parse into Fractions as that doesn't make sense: we would lose precision of the values
    // Therefore we dont use Unit.parse()
    const value = number === 'BigNumber'
      ? new BigNumber(valueStr)
      : parseFloat(valueStr)

    const unit = new Unit(value, unitStr)
    unit.fixPrefix = true
    return unit
  })
}

// helper function to create a factory function which creates a numeric constant,
// either a number or BigNumber depending on the configuration
function numberFactory (name, value) {
  const dependencies = ['config', 'BigNumber']

  return factory(name, dependencies, ({ config: { number }, Unit, BigNumber }) => {
    return number === 'BigNumber'
      ? new BigNumber(value)
      : value
  })
}
