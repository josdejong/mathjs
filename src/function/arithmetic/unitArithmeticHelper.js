// unitArithmeticHelper.js — Shared logic for scalar arithmetic operations on Units
//
// Both addScalar and subtractScalar have identical Unit handling:
//   - Validate both units have values
//   - Check that units have the same base
//   - Clone the first operand, compute new value via typed dispatch
//   - Reset fixPrefix
//
// This module extracts that shared pattern to reduce duplication.
// Future scalar operations (e.g., modScalar) should reuse this helper.

/**
 * Create a Unit handler for a scalar binary operation.
 * Returns a typed.referToSelf callback that validates units and computes
 * the result by delegating to the typed system for the value types.
 *
 * @param {function} self - The scalar function itself (via referToSelf)
 * @param {function} typed - The typed function system
 * @returns {function} Handler for 'Unit, Unit' signature
 */
export function createUnitScalarHandler(self, typed) {
  return (x, y) => {
    validateUnitOperand(x, 'x')
    validateUnitOperand(y, 'y')
    validateMatchingUnitBases(x, y)

    const result = x.clone()
    result.value = typed.find(self, [result.valueType(), y.valueType()])(result.value, y.value)
    result.fixPrefix = false
    return result
  }
}

/**
 * Validate that a Unit operand has a defined numeric value.
 * @param {Unit} unit - The unit to validate
 * @param {string} paramName - Name of the parameter for error messages ('x' or 'y')
 * @throws {Error} If the unit's value is null or undefined
 */
function validateUnitOperand(unit, paramName) {
  if (unit.value === null || unit.value === undefined) {
    throw new Error(`Parameter ${paramName} contains a unit with undefined value`)
  }
}

/**
 * Validate that two Units have compatible bases for arithmetic.
 * @param {Unit} x - First unit
 * @param {Unit} y - Second unit
 * @throws {Error} If the units have different bases
 */
function validateMatchingUnitBases(x, y) {
  if (!x.equalBase(y)) {
    throw new Error('Units do not match')
  }
}
