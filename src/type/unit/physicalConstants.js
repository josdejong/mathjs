'use strict'

import { factory } from '../../utils/factory'

// Source: http://www.wikiwand.com/en/Physical_constant

// Universal constants
export const createSpeedOfLight = /* #__PURE__ */ unitFactory('speedOfLight', '299792458', 'm s^-1')
export const createGravitationConstant = /* #__PURE__ */ unitFactory('gravitationConstant', '6.6738480e-11', 'm^3 kg^-1 s^-2')
export const createPlanckConstant = /* #__PURE__ */ unitFactory('planckConstant', '6.626069311e-34', 'J s')
export const createReducedPlanckConstant = /* #__PURE__ */ unitFactory('reducedPlanckConstant', '1.05457172647e-34', 'J s')

// Electromagnetic constants
export const createMagneticConstant = /* #__PURE__ */ unitFactory('magneticConstant', '1.2566370614e-6', 'N A^-2')
export const createElectricConstant = /* #__PURE__ */ unitFactory('electricConstant', '8.854187817e-12', 'F m^-1')
export const createVacuumImpedance = /* #__PURE__ */ unitFactory('vacuumImpedance', '376.730313461', 'ohm')
export const createCoulomb = /* #__PURE__ */ unitFactory('coulomb', '8.9875517873681764e9', 'N m^2 C^-2')
export const createElementaryCharge = /* #__PURE__ */ unitFactory('elementaryCharge', '1.60217656535e-19', 'C')
export const createBohrMagneton = /* #__PURE__ */ unitFactory('bohrMagneton', '9.2740096820e-24', 'J T^-1')
export const createConductanceQuantum = /* #__PURE__ */ unitFactory('conductanceQuantum', '7.748091734625e-5', 'S')
export const createInverseConductanceQuantum = /* #__PURE__ */ unitFactory('inverseConductanceQuantum', '12906.403721742', 'ohm')
export const createMagneticFluxQuantum = /* #__PURE__ */ unitFactory('magneticFluxQuantum', '2.06783375846e-15', 'Wb')
export const createNuclearMagneton = /* #__PURE__ */ unitFactory('nuclearMagneton', '5.0507835311e-27', 'J T^-1')
export const createKlitzing = /* #__PURE__ */ unitFactory('klitzing', '25812.807443484', 'ohm')
// export const createJosephson = /* #__PURE__ */ unitFactory('josephson', '4.8359787011e-14 Hz V^-1') // TODO: support for Hz needed

// Atomic and nuclear constants
export const createBohrRadius = /* #__PURE__ */ unitFactory('bohrRadius', '5.291772109217e-11', 'm')
export const createClassicalElectronRadius = /* #__PURE__ */ unitFactory('classicalElectronRadius', '2.817940326727e-15', 'm')
export const createElectronMass = /* #__PURE__ */ unitFactory('electronMass', '9.1093829140e-31', 'kg')
export const createFermiCoupling = /* #__PURE__ */ unitFactory('fermiCoupling', '1.1663645e-5', 'GeV^-2')
export const createFineStructure = numberFactory('fineStructure', 7.297352569824e-3)
export const createHartreeEnergy = /* #__PURE__ */ unitFactory('hartreeEnergy', '4.3597443419e-18', 'J')
export const createProtonMass = /* #__PURE__ */ unitFactory('protonMass', '1.67262177774e-27', 'kg')
export const createDeuteronMass = /* #__PURE__ */ unitFactory('deuteronMass', '3.3435830926e-27', 'kg')
export const createNeutronMass = /* #__PURE__ */ unitFactory('neutronMass', '1.6749271613e-27', 'kg')
export const createQuantumOfCirculation = /* #__PURE__ */ unitFactory('quantumOfCirculation', '3.636947552024e-4', 'm^2 s^-1')
export const createRydberg = /* #__PURE__ */ unitFactory('rydberg', '10973731.56853955', 'm^-1')
export const createThomsonCrossSection = /* #__PURE__ */ unitFactory('thomsonCrossSection', '6.65245873413e-29', 'm^2')
export const createWeakMixingAngle = numberFactory('weakMixingAngle', 0.222321)
export const createEfimovFactor = numberFactory('efimovFactor', 22.7)

// Physico-chemical constants
export const createAtomicMass = /* #__PURE__ */ unitFactory('atomicMass', '1.66053892173e-27', 'kg')
export const createAvogadro = /* #__PURE__ */ unitFactory('avogadro', '6.0221412927e23', 'mol^-1')
export const createBoltzmann = /* #__PURE__ */ unitFactory('boltzmann', '1.380648813e-23', 'J K^-1')
export const createFaraday = /* #__PURE__ */ unitFactory('faraday', '96485.336521', 'C mol^-1')
export const createFirstRadiation = /* #__PURE__ */ unitFactory('firstRadiation', '3.7417715317e-16', 'W m^2')
// export const createSpectralRadiance = /* #__PURE__ */ unitFactory('spectralRadiance', '1.19104286953e-16', 'W m^2 sr^-1') // TODO spectralRadiance
export const createLoschmidt = /* #__PURE__ */ unitFactory('loschmidt', '2.686780524e25', 'm^-3')
export const createGasConstant = /* #__PURE__ */ unitFactory('gasConstant', '8.314462175', 'J K^-1 mol^-1')
export const createMolarPlanckConstant = /* #__PURE__ */ unitFactory('molarPlanckConstant', '3.990312717628e-10', 'J s mol^-1')
export const createMolarVolume = /* #__PURE__ */ unitFactory('molarVolume', '2.241396820e-10', 'm^3 mol^-1')
export const createSackurTetrode = numberFactory('sackurTetrode', -1.164870823)
export const createSecondRadiation = /* #__PURE__ */ unitFactory('secondRadiation', '1.438777013e-2', 'm K')
export const createStefanBoltzmann = /* #__PURE__ */ unitFactory('stefanBoltzmann', '5.67037321e-8', 'W m^-2 K^-4')
export const createWienDisplacement = /* #__PURE__ */ unitFactory('wienDisplacement', '2.897772126e-3', 'm K')

// Adopted values
export const createMolarMass = /* #__PURE__ */ unitFactory('molarMass', '1e-3', 'kg mol^-1')
export const createMolarMassC12 = /* #__PURE__ */ unitFactory('molarMassC12', '1.2e-2', 'kg mol^-1')
export const createGravity = /* #__PURE__ */ unitFactory('gravity', '9.80665', 'm s^-2')
// atm is defined in Unit.js

// Natural units
export const createPlanckLength = /* #__PURE__ */ unitFactory('planckLength', '1.61619997e-35', 'm')
export const createPlanckMass = /* #__PURE__ */ unitFactory('planckMass', '2.1765113e-8', 'kg')
export const createPlanckTime = /* #__PURE__ */ unitFactory('planckTime', '5.3910632e-44', 's')
export const createPlanckCharge = /* #__PURE__ */ unitFactory('planckCharge', '1.87554595641e-18', 'C')
export const createPlanckTemperature = /* #__PURE__ */ unitFactory('planckTemperature', '1.41683385e+32', 'K')

// helper function to create a factory function which creates a physical constant,
// a Unit with either a number value or a BigNumber value depending on the configuration
function unitFactory (name, valueStr, unitStr) {
  const dependencies = ['config', 'Unit', 'BigNumber']

  return factory(name, dependencies, ({ config, Unit, BigNumber }) => {
    // Note that we can parse into number or BigNumber.
    // We do not parse into Fractions as that doesn't make sense: we would lose precision of the values
    // Therefore we dont use Unit.parse()
    const value = config.number === 'BigNumber'
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

  return factory(name, dependencies, ({ config, BigNumber }) => {
    return config.number === 'BigNumber'
      ? new BigNumber(value)
      : value
  })
}
