'use strict'

import { createUnitClass } from './Unit'
import { createCreateUnit } from './function/createUnit'
import { createSplitUnit } from './function/splitUnit'
import { createUnit } from './function/unit'
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
} from './physicalConstants'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  // type
  createUnitClass,

  // construction function
  createUnit,

  // create new units
  createCreateUnit,

  // split units
  createSplitUnit,

  // Universal constants
  createSpeedOfLight,
  createGravitationConstant,
  createPlanckConstant,
  createReducedPlanckConstant,

  // Electromagnetic constants
  createMagneticConstant,
  createElectricConstant,
  createVacuumImpedance,
  createCoulomb,
  createElementaryCharge,
  createBohrMagneton,
  createConductanceQuantum,
  createInverseConductanceQuantum,
  createMagneticFluxQuantum,
  createNuclearMagneton,
  createKlitzing,

  // Atomic and nuclear constants
  createBohrRadius,
  createClassicalElectronRadius,
  createElectronMass,
  createFermiCoupling,
  createFineStructure,
  createHartreeEnergy,
  createProtonMass,
  createDeuteronMass,
  createNeutronMass,
  createQuantumOfCirculation,
  createRydberg,
  createThomsonCrossSection,
  createWeakMixingAngle,
  createEfimovFactor,

  // Physico-chemical constants
  createAtomicMass,
  createAvogadro,
  createBoltzmann,
  createFaraday,
  createFirstRadiation,
  createLoschmidt,
  createGasConstant,
  createMolarPlanckConstant,
  createMolarVolume,
  createSackurTetrode,
  createSecondRadiation,
  createStefanBoltzmann,
  createWienDisplacement,

  // Adopted values
  createMolarMass,
  createMolarMassC12,
  createGravity,

  // Natural units
  createPlanckLength,
  createPlanckMass,
  createPlanckTime,
  createPlanckCharge,
  createPlanckTemperature
]
