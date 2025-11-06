import { isComplex, isUnit, typeOf } from '../../utils/is.js'
import { factory } from '../../utils/factory.js'
import { memoize } from '../../utils/function.js'
import { endsWith } from '../../utils/string.js'
import { clone, hasOwnProperty } from '../../utils/object.js'
import { createBigNumberPi as createPi } from '../../utils/bignumber/constants.js'

const name = 'Unit'
const dependencies = [
  '?on',
  'config',
  'addScalar',
  'subtractScalar',
  'multiplyScalar',
  'divideScalar',
  'pow',
  'abs',
  'fix',
  'round',
  'equal',
  'isNumeric',
  'format',
  'number',
  'Complex',
  'BigNumber',
  'Fraction'
]

export const createUnitClass = /* #__PURE__ */ factory(name, dependencies, ({
  on,
  config,
  addScalar,
  subtractScalar,
  multiplyScalar,
  divideScalar,
  pow,
  abs,
  fix,
  round,
  equal,
  isNumeric,
  format,
  number,
  Complex,
  BigNumber,
  Fraction
}) => {
  const toNumber = number
  const fixPrefixDefault = false
  const skipAutomaticSimplificationDefault = true

  /**
   * A unit can be constructed in the following ways:
   *
   *     const a = new Unit(value, valuelessUnit)
   *     const b = new Unit(null, valuelessUnit)
   *     const c = Unit.parse(str)
   *
   * Example usage:
   *
   *     const a = new Unit(5, 'cm')               // 50 mm
   *     const b = Unit.parse('23 kg')             // 23 kg
   *     const c = math.in(a, new Unit(null, 'm')  // 0.05 m
   *     const d = new Unit(9.81, "m/s^2")         // 9.81 m/s^2
   *
   * @class Unit
   * @constructor Unit
   * @param {number | BigNumber | Fraction | Complex | boolean} [value]  A value like 5.2
   * @param {string | Unit} valuelessUnit   A unit without value. Can have prefix, like "cm"
   */
  function Unit (value, valuelessUnit) {
    if (!(this instanceof Unit)) {
      throw new Error('Constructor must be called with the new operator')
    }

    if (!(value === null || value === undefined || isNumeric(value) || isComplex(value))) {
      throw new TypeError('First parameter in Unit constructor must be number, BigNumber, Fraction, Complex, or undefined')
    }

    this.fixPrefix = fixPrefixDefault // if true, function format will not search for the
    // best prefix but leave it as initially provided.
    // fixPrefix is set true by the method Unit.to

    // The justification behind this is that if the constructor is explicitly called,
    // the caller wishes the units to be returned exactly as supplied.
    this.skipAutomaticSimplification = skipAutomaticSimplificationDefault

    if (valuelessUnit === undefined) {
      this.units = []
      this.dimensions = BASE_DIMENSIONS.map(x => 0)
    } else if (typeof valuelessUnit === 'string') {
      const u = Unit.parse(valuelessUnit)
      this.units = u.units
      this.dimensions = u.dimensions
    } else if (isUnit(valuelessUnit) && valuelessUnit.value === null) {
      // clone from valuelessUnit
      this.fixPrefix = valuelessUnit.fixPrefix
      this.skipAutomaticSimplification = valuelessUnit.skipAutomaticSimplification
      this.dimensions = valuelessUnit.dimensions.slice(0)
      this.units = valuelessUnit.units.map(u => Object.assign({}, u))
    } else {
      throw new TypeError('Second parameter in Unit constructor must be a string or valueless Unit')
    }

    this.value = this._normalize(value)
  }

  /**
   * Attach type information
   */
  Object.defineProperty(Unit, 'name', { value: 'Unit' })
  Unit.prototype.constructor = Unit
  Unit.prototype.type = 'Unit'
  Unit.prototype.isUnit = true

  // private variables and functions for the Unit parser
  let text, index, c

  function skipWhitespace () {
    while (c === ' ' || c === '\t') {
      next()
    }
  }

  function isDigitDot (c) {
    return ((c >= '0' && c <= '9') || c === '.')
  }

  function isDigit (c) {
    return ((c >= '0' && c <= '9'))
  }

  function next () {
    index++
    c = text.charAt(index)
  }

  function revert (oldIndex) {
    index = oldIndex
    c = text.charAt(index)
  }

  function parseNumber () {
    let number = ''
    const oldIndex = index

    if (c === '+') {
      next()
    } else if (c === '-') {
      number += c
      next()
    }

    if (!isDigitDot(c)) {
      // a + or - must be followed by a digit
      revert(oldIndex)
      return null
    }

    // get number, can have a single dot
    if (c === '.') {
      number += c
      next()
      if (!isDigit(c)) {
        // this is no legal number, it is just a dot
        revert(oldIndex)
        return null
      }
    } else {
      while (isDigit(c)) {
        number += c
        next()
      }
      if (c === '.') {
        number += c
        next()
      }
    }
    while (isDigit(c)) {
      number += c
      next()
    }

    // check for exponential notation like "2.3e-4" or "1.23e50"
    if (c === 'E' || c === 'e') {
      // The grammar branches here. This could either be part of an exponent or the start of a unit that begins with the letter e, such as "4exabytes"

      let tentativeNumber = ''
      const tentativeIndex = index

      tentativeNumber += c
      next()

      if (c === '+' || c === '-') {
        tentativeNumber += c
        next()
      }

      // Scientific notation MUST be followed by an exponent (otherwise we assume it is not scientific notation)
      if (!isDigit(c)) {
        // The e or E must belong to something else, so return the number without the e or E.
        revert(tentativeIndex)
        return number
      }

      // We can now safely say that this is scientific notation.
      number = number + tentativeNumber
      while (isDigit(c)) {
        number += c
        next()
      }
    }

    return number
  }

  function parseUnit () {
    let unitName = ''

    // Alphanumeric characters only; matches [a-zA-Z0-9]
    while (isDigit(c) || Unit.isValidAlpha(c)) {
      unitName += c
      next()
    }

    // Must begin with [a-zA-Z]
    const firstC = unitName.charAt(0)
    if (Unit.isValidAlpha(firstC)) {
      return unitName
    } else {
      return null
    }
  }

  function parseCharacter (toFind) {
    if (c === toFind) {
      next()
      return toFind
    } else {
      return null
    }
  }

  /**
   * Parse a string into a unit. The value of the unit is parsed as number,
   * BigNumber, or Fraction depending on the math.js config setting `number`.
   *
   * Throws an exception if the provided string does not contain a valid unit or
   * cannot be parsed.
   * @memberof Unit
   * @param {string} str        A string like "5.2 inch", "4e2 cm/s^2"
   * @return {Unit} unit
   */
  Unit.parse = function (str, options) {
    options = options || {}
    text = str
    index = -1
    c = ''

    if (typeof text !== 'string') {
      throw new TypeError('Invalid argument in Unit.parse, string expected')
    }

    const unit = new Unit()
    unit.units = []

    let powerMultiplierCurrent = 1
    let expectingUnit = false

    // A unit should follow this pattern:
    // [number] ...[ [*/] unit[^number] ]
    // unit[^number] ... [ [*/] unit[^number] ]

    // Rules:
    // number is any floating point number.
    // unit is any alphanumeric string beginning with an alpha. Units with names like e3 should be avoided because they look like the exponent of a floating point number!
    // The string may optionally begin with a number.
    // Each unit may optionally be followed by ^number.
    // Whitespace or a forward slash is recommended between consecutive units, although the following technically is parseable:
    //   2m^2kg/s^2
    // it is not good form. If a unit starts with e, then it could be confused as a floating point number:
    //   4erg

    next()
    skipWhitespace()

    // Optional number at the start of the string
    const valueStr = parseNumber()
    let value = null
    if (valueStr) {
      if (config.number === 'BigNumber') {
        value = new BigNumber(valueStr)
      } else if (config.number === 'Fraction') {
        try {
          // not all numbers can be turned in Fractions, for example very small numbers not
          value = new Fraction(valueStr)
        } catch (err) {
          value = parseFloat(valueStr)
        }
      } else { // number
        value = parseFloat(valueStr)
      }

      skipWhitespace() // Whitespace is not required here

      // handle multiplication or division right after the value, like '1/s'
      if (parseCharacter('*')) {
        powerMultiplierCurrent = 1
        expectingUnit = true
      } else if (parseCharacter('/')) {
        powerMultiplierCurrent = -1
        expectingUnit = true
      }
    }

    // Stack to keep track of powerMultipliers applied to each parentheses group
    const powerMultiplierStack = []

    // Running product of all elements in powerMultiplierStack
    let powerMultiplierStackProduct = 1

    while (true) {
      skipWhitespace()

      // Check for and consume opening parentheses, pushing powerMultiplierCurrent to the stack
      // A '(' will always appear directly before a unit.
      while (c === '(') {
        powerMultiplierStack.push(powerMultiplierCurrent)
        powerMultiplierStackProduct *= powerMultiplierCurrent
        powerMultiplierCurrent = 1
        next()
        skipWhitespace()
      }

      // Is there something here?
      let uStr
      if (c) {
        const oldC = c
        uStr = parseUnit()
        if (uStr === null) {
          throw new SyntaxError('Unexpected "' + oldC + '" in "' + text + '" at index ' + index.toString())
        }
      } else {
        // End of input.
        break
      }

      // Verify the unit exists and get the prefix (if any)
      const res = _findUnit(uStr)
      if (res === null) {
        // Unit not found.
        throw new SyntaxError('Unit "' + uStr + '" not found.')
      }

      let power = powerMultiplierCurrent * powerMultiplierStackProduct
      // Is there a "^ number"?
      skipWhitespace()
      if (parseCharacter('^')) {
        skipWhitespace()
        const p = parseNumber()
        if (p === null) {
          // No valid number found for the power!
          throw new SyntaxError('In "' + str + '", "^" must be followed by a floating-point number')
        }
        power *= p
      }

      // Add the unit to the list
      unit.units.push({
        unit: res.unit,
        prefix: res.prefix,
        power
      })
      for (let i = 0; i < BASE_DIMENSIONS.length; i++) {
        unit.dimensions[i] += (res.unit.dimensions[i] || 0) * power
      }

      // Check for and consume closing parentheses, popping from the stack.
      // A ')' will always follow a unit.
      skipWhitespace()
      while (c === ')') {
        if (powerMultiplierStack.length === 0) {
          throw new SyntaxError('Unmatched ")" in "' + text + '" at index ' + index.toString())
        }
        powerMultiplierStackProduct /= powerMultiplierStack.pop()
        next()
        skipWhitespace()
      }

      // "*" and "/" should mean we are expecting something to come next.
      // Is there a forward slash? If so, negate powerMultiplierCurrent. The next unit or paren group is in the denominator.
      expectingUnit = false

      if (parseCharacter('*')) {
        // explicit multiplication
        powerMultiplierCurrent = 1
        expectingUnit = true
      } else if (parseCharacter('/')) {
        // division
        powerMultiplierCurrent = -1
        expectingUnit = true
      } else {
        // implicit multiplication
        powerMultiplierCurrent = 1
      }

      // Replace the unit into the auto unit system
      if (res.unit.base) {
        const baseDim = res.unit.base.key
        UNIT_SYSTEMS.auto[baseDim] = {
          unit: res.unit,
          prefix: res.prefix
        }
      }
    }

    // Has the string been entirely consumed?
    skipWhitespace()
    if (c) {
      throw new SyntaxError('Could not parse: "' + str + '"')
    }

    // Is there a trailing slash?
    if (expectingUnit) {
      throw new SyntaxError('Trailing characters: "' + str + '"')
    }

    // Is the parentheses stack empty?
    if (powerMultiplierStack.length !== 0) {
      throw new SyntaxError('Unmatched "(" in "' + text + '"')
    }

    // Are there any units at all?
    if (unit.units.length === 0 && !options.allowNoUnits) {
      throw new SyntaxError('"' + str + '" contains no units')
    }

    unit.value = (value !== undefined) ? unit._normalize(value) : null
    return unit
  }

  /**
   * create a copy of this unit
   * @memberof Unit
   * @return {Unit} Returns a cloned version of the unit
   */
  Unit.prototype.clone = function () {
    const unit = new Unit()

    unit.fixPrefix = this.fixPrefix
    unit.skipAutomaticSimplification = this.skipAutomaticSimplification

    unit.value = clone(this.value)
    unit.dimensions = this.dimensions.slice(0)
    unit.units = []
    for (let i = 0; i < this.units.length; i++) {
      unit.units[i] = { }
      for (const p in this.units[i]) {
        if (hasOwnProperty(this.units[i], p)) {
          unit.units[i][p] = this.units[i][p]
        }
      }
    }

    return unit
  }

  /**
   * Return the type of the value of this unit
   *
   * @memberof Unit
   * @return {string} type of the value of the unit
   */
  Unit.prototype.valueType = function () {
    return typeOf(this.value)
  }

  /**
   * Return whether the unit is derived (such as m/s, or cm^2, but not N)
   * @memberof Unit
   * @return {boolean} True if the unit is derived
   * @private
   */
  Unit.prototype._isDerived = function () {
    if (this.units.length === 0) {
      return false
    }
    return this.units.length > 1 || Math.abs(this.units[0].power - 1.0) > 1e-15
  }

  /**
   * Normalize a value, based on its currently set unit(s)
   * @memberof Unit
   * @param {number | BigNumber | Fraction | boolean} value
   * @return {number | BigNumber | Fraction | boolean} normalized value
   * @private
   */
  Unit.prototype._normalize = function (value) {
    if (value === null || value === undefined || this.units.length === 0) {
      return value
    }
    let res = value
    const convert = Unit._getNumberConverter(typeOf(value)) // convert to Fraction or BigNumber if needed

    for (let i = 0; i < this.units.length; i++) {
      const unitValue = convert(this.units[i].unit.value)
      const unitPrefixValue = convert(this.units[i].prefix.value)
      const unitPower = convert(this.units[i].power)
      res = multiplyScalar(res, pow(multiplyScalar(unitValue, unitPrefixValue), unitPower))
    }

    return res
  }

  /**
   * Denormalize a value, based on its currently set unit(s)
   * @memberof Unit
   * @param {number} value
   * @param {number} [prefixValue]    Optional prefix value to be used (ignored if this is a derived unit)
   * @return {number} denormalized value
   * @private
   */
  Unit.prototype._denormalize = function (value, prefixValue) {
    if (value === null || value === undefined || this.units.length === 0) {
      return value
    }
    let res = value
    const convert = Unit._getNumberConverter(typeOf(value)) // convert to Fraction or BigNumber if needed

    for (let i = 0; i < this.units.length; i++) {
      const unitValue = convert(this.units[i].unit.value)
      const unitPrefixValue = convert(this.units[i].prefix.value)
      const unitPower = convert(this.units[i].power)
      res = divideScalar(res, pow(multiplyScalar(unitValue, unitPrefixValue), unitPower))
    }

    return res
  }

  /**
   * Find a unit from a string
   * @memberof Unit
   * @param {string} str              A string like 'cm' or 'inch'
   * @returns {Object | null} result  When found, an object with fields unit and
   *                                  prefix is returned. Else, null is returned.
   * @private
   */
  const _findUnit = memoize((str) => {
    // First, match units names exactly. For example, a user could define 'mm' as 10^-4 m, which is silly, but then we would want 'mm' to match the user-defined unit.
    if (hasOwnProperty(UNITS, str)) {
      const unit = UNITS[str]
      const prefix = unit.prefixes['']
      return { unit, prefix }
    }

    for (const name in UNITS) {
      if (hasOwnProperty(UNITS, name)) {
        if (endsWith(str, name)) {
          const unit = UNITS[name]
          const prefixLen = (str.length - name.length)
          const prefixName = str.substring(0, prefixLen)
          const prefix = hasOwnProperty(unit.prefixes, prefixName)
            ? unit.prefixes[prefixName]
            : undefined
          if (prefix !== undefined) {
            // store unit, prefix, and value
            return { unit, prefix }
          }
        }
      }
    }

    return null
  }, { hasher: (args) => args[0], limit: 100 })

  /**
   * Test if the given expression is a unit.
   * The unit can have a prefix but cannot have a value.
   * @memberof Unit
   * @param {string} name   A string to be tested whether it is a value less unit.
   *                        The unit can have prefix, like "cm"
   * @return {boolean}      true if the given string is a unit
   */
  Unit.isValuelessUnit = function (name) {
    return (_findUnit(name) !== null)
  }

  /**
   * check if this unit has given base unit
   * If this unit is a derived unit, this will ALWAYS return false, since by definition base units are not derived.
   * @memberof Unit
   * @param {BASE_UNIT | string | undefined} base
   */
  Unit.prototype.hasBase = function (base) {
    if (typeof (base) === 'string') {
      base = BASE_UNITS[base]
    }

    if (!base) { return false }

    // All dimensions must be the same
    for (let i = 0; i < BASE_DIMENSIONS.length; i++) {
      if (Math.abs((this.dimensions[i] || 0) - (base.dimensions[i] || 0)) > 1e-12) {
        return false
      }
    }
    return true
  }

  /**
   * Check if this unit has a base or bases equal to another base or bases
   * For derived units, the exponent on each base also must match
   * @memberof Unit
   * @param {Unit} other
   * @return {boolean} true if equal base
   */
  Unit.prototype.equalBase = function (other) {
    // All dimensions must be the same
    for (let i = 0; i < BASE_DIMENSIONS.length; i++) {
      if (Math.abs((this.dimensions[i] || 0) - (other.dimensions[i] || 0)) > 1e-12) {
        return false
      }
    }
    return true
  }

  /**
   * Check if this unit equals another unit
   * @memberof Unit
   * @param {Unit} other
   * @return {boolean} true if both units are equal
   */
  Unit.prototype.equals = function (other) {
    return (this.equalBase(other) && equal(this.value, other.value))
  }

  /**
   * Multiply this unit with another one or with a scalar
   * @memberof Unit
   * @param {Unit} other
   * @return {Unit} product of this unit and the other unit
   */
  Unit.prototype.multiply = function (_other) {
    const res = this.clone()
    const other = isUnit(_other) ? _other : new Unit(_other)

    for (let i = 0; i < BASE_DIMENSIONS.length; i++) {
      // Dimensions arrays may be of different lengths. Default to 0.
      res.dimensions[i] = (this.dimensions[i] || 0) + (other.dimensions[i] || 0)
    }

    // Append other's units list onto res
    for (let i = 0; i < other.units.length; i++) {
      // Make a shallow copy of every unit
      const inverted = {
        ...other.units[i]
      }
      res.units.push(inverted)
    }

    // If at least one operand has a value, then the result should also have a value
    if (this.value !== null || other.value !== null) {
      const valThis = this.value === null ? this._normalize(one(other.value)) : this.value
      const valOther = other.value === null ? other._normalize(one(this.value)) : other.value

      res.value = multiplyScalar(valThis, valOther)
    } else {
      res.value = null
    }

    if (isUnit(_other)) {
      res.skipAutomaticSimplification = false
    }

    return getNumericIfUnitless(res)
  }

  /**
   * Divide a number by this unit
   *
   * @memberof Unit
   * @param {numeric} numerator
   * @param {unit} result of dividing numerator by this unit
   */
  Unit.prototype.divideInto = function (numerator) {
    return new Unit(numerator).divide(this)
  }

  /**
   * Divide this unit by another one
   * @memberof Unit
   * @param {Unit | numeric} other
   * @return {Unit} result of dividing this unit by the other unit
   */
  Unit.prototype.divide = function (_other) {
    const res = this.clone()
    const other = isUnit(_other) ? _other : new Unit(_other)

    for (let i = 0; i < BASE_DIMENSIONS.length; i++) {
      // Dimensions arrays may be of different lengths. Default to 0.
      res.dimensions[i] = (this.dimensions[i] || 0) - (other.dimensions[i] || 0)
    }

    // Invert and append other's units list onto res
    for (let i = 0; i < other.units.length; i++) {
      // Make a shallow copy of every unit
      const inverted = {
        ...other.units[i],
        power: -other.units[i].power
      }
      res.units.push(inverted)
    }

    // If at least one operand has a value, the result should have a value
    if (this.value !== null || other.value !== null) {
      const valThis = this.value === null ? this._normalize(one(other.value)) : this.value
      const valOther = other.value === null ? other._normalize(one(this.value)) : other.value
      res.value = divideScalar(valThis, valOther)
    } else {
      res.value = null
    }

    if (isUnit(_other)) {
      res.skipAutomaticSimplification = false
    }

    return getNumericIfUnitless(res)
  }

  /**
   * Calculate the power of a unit
   * @memberof Unit
   * @param {number | Fraction | BigNumber} p
   * @returns {Unit}      The result: this^p
   */
  Unit.prototype.pow = function (p) {
    const res = this.clone()

    for (let i = 0; i < BASE_DIMENSIONS.length; i++) {
      // Dimensions arrays may be of different lengths. Default to 0.
      res.dimensions[i] = (this.dimensions[i] || 0) * p
    }

    // Adjust the power of each unit in the list
    for (let i = 0; i < res.units.length; i++) {
      res.units[i].power *= p
    }

    if (res.value !== null) {
      res.value = pow(res.value, p)

      // only allow numeric output, we don't want to return a Complex number
      // if (!isNumeric(res.value)) {
      //  res.value = NaN
      // }
      // Update: Complex supported now
    } else {
      res.value = null
    }

    res.skipAutomaticSimplification = false

    return getNumericIfUnitless(res)
  }

  /**
   * Return the numeric value of this unit if it is dimensionless, has a value, and config.predictable == false; or the original unit otherwise
   * @param {Unit} unit
   * @returns {number | Fraction | BigNumber | Unit}  The numeric value of the unit if conditions are met, or the original unit otherwise
   */
  function getNumericIfUnitless (unit) {
    if (unit.equalBase(BASE_UNITS.NONE) && unit.value !== null && !config.predictable) {
      return unit.value
    } else {
      return unit
    }
  }

  /**
   * Create a value one with the numeric type of `typeOfValue`.
   * For example, `one(new BigNumber(3))` returns `BigNumber(1)`
   * @param {number | Fraction | BigNumber} typeOfValue
   * @returns {number | Fraction | BigNumber}
   */
  function one (typeOfValue) {
    // TODO: this is a workaround to prevent the following BigNumber conversion error from throwing:
    //  "TypeError: Cannot implicitly convert a number with >15 significant digits to BigNumber"
    //  see https://github.com/josdejong/mathjs/issues/3450
    //      https://github.com/josdejong/mathjs/pull/3375
    const convert = Unit._getNumberConverter(typeOf(typeOfValue))

    return convert(1)
  }

  /**
   * Calculate the absolute value of a unit
   * @memberof Unit
   * @param {number | Fraction | BigNumber} x
   * @returns {Unit}      The result: |x|, absolute value of x
   */
  Unit.prototype.abs = function () {
    const ret = this.clone()
    if (ret.value !== null) {
      if (ret._isDerived() || ret.units.length === 0 || ret.units[0].unit.offset === 0) {
        ret.value = abs(ret.value)
      } else {
        // To give the correct, but unexpected, results for units with an offset.
        // For example, abs(-283.15 degC) = -263.15 degC !!!
        // We must take the offset into consideration here
        const convert = ret._numberConverter() // convert to Fraction or BigNumber if needed
        const unitValue = convert(ret.units[0].unit.value)
        const nominalOffset = convert(ret.units[0].unit.offset)
        const unitOffset = multiplyScalar(unitValue, nominalOffset)
        ret.value = subtractScalar(abs(addScalar(ret.value, unitOffset)), unitOffset)
      }
    }

    for (const i in ret.units) {
      if (ret.units[i].unit.name === 'VA' || ret.units[i].unit.name === 'VAR') {
        ret.units[i].unit = UNITS.W
      }
    }

    return ret
  }

  /**
   * Convert the unit to a specific unit name.
   * @memberof Unit
   * @param {string | Unit} valuelessUnit   A unit without value. Can have prefix, like "cm"
   * @returns {Unit} Returns a clone of the unit with a fixed prefix and unit.
   */
  Unit.prototype.to = function (valuelessUnit) {
    const value = this.value === null ? this._normalize(1) : this.value
    let other
    if (typeof valuelessUnit === 'string') {
      other = Unit.parse(valuelessUnit)
    } else if (isUnit(valuelessUnit)) {
      other = valuelessUnit.clone()
    } else {
      throw new Error('String or Unit expected as parameter')
    }

    if (!this.equalBase(other)) {
      throw new Error(`Units do not match ('${other.toString()}' != '${this.toString()}')`)
    }
    if (other.value !== null) {
      throw new Error('Cannot convert to a unit with a value')
    }

    if (this.value === null || this._isDerived() ||
        this.units.length === 0 || other.units.length === 0 ||
        this.units[0].unit.offset === other.units[0].unit.offset) {
      other.value = clone(value)
    } else {
      /* Need to adjust value by difference in offset to convert */
      const convert = Unit._getNumberConverter(typeOf(value)) // convert to Fraction or BigNumber if needed

      const thisUnitValue = this.units[0].unit.value
      const thisNominalOffset = this.units[0].unit.offset
      const thisUnitOffset = multiplyScalar(thisUnitValue, thisNominalOffset)

      const otherUnitValue = other.units[0].unit.value
      const otherNominalOffset = other.units[0].unit.offset
      const otherUnitOffset = multiplyScalar(otherUnitValue, otherNominalOffset)

      other.value = addScalar(value, convert(subtractScalar(thisUnitOffset, otherUnitOffset)))
    }
    other.fixPrefix = true
    other.skipAutomaticSimplification = true
    return other
  }

  /**
   * Return the value of the unit when represented with given valueless unit
   * @memberof Unit
   * @param {string | Unit} valuelessUnit    For example 'cm' or 'inch'
   * @return {number} Returns the unit value as number.
   */
  // TODO: deprecate Unit.toNumber? It's always better to use toNumeric
  Unit.prototype.toNumber = function (valuelessUnit) {
    return toNumber(this.toNumeric(valuelessUnit))
  }

  /**
   * Return the value of the unit in the original numeric type
   * @memberof Unit
   * @param {string | Unit} valuelessUnit    For example 'cm' or 'inch'
   * @return {number | BigNumber | Fraction} Returns the unit value
   */
  Unit.prototype.toNumeric = function (valuelessUnit) {
    let other
    if (valuelessUnit) {
      // Allow getting the numeric value without converting to a different unit
      other = this.to(valuelessUnit)
    } else {
      other = this.clone()
    }

    if (other._isDerived() || other.units.length === 0) {
      return other._denormalize(other.value)
    } else {
      return other._denormalize(other.value, other.units[0].prefix.value)
    }
  }

  /**
   * Get a string representation of the unit.
   * @memberof Unit
   * @return {string}
   */
  Unit.prototype.toString = function () {
    return this.format()
  }

  /**
   * Get a JSON representation of the unit
   * @memberof Unit
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "Unit", "value": 2, "unit": "cm", "fixPrefix": false, "skipSimp": true}`
   */
  Unit.prototype.toJSON = function () {
    return {
      mathjs: 'Unit',
      value: this._denormalize(this.value),
      unit: this.units.length > 0 ? this.formatUnits() : null,
      fixPrefix: this.fixPrefix,
      skipSimp: this.skipAutomaticSimplification
    }
  }

  /**
   * Instantiate a Unit from a JSON object
   * @memberof Unit
   * @param {Object} json  A JSON object structured as:
   *                       `{"mathjs": "Unit", "value": 2, "unit": "cm", "fixPrefix": false}`
   * @return {Unit}
   */
  Unit.fromJSON = function (json) {
    const unit = new Unit(json.value, json.unit ?? undefined)
    unit.fixPrefix = json.fixPrefix ?? fixPrefixDefault
    unit.skipAutomaticSimplification = json.skipSimp ?? skipAutomaticSimplificationDefault
    return unit
  }

  /**
   * Returns the string representation of the unit.
   * @memberof Unit
   * @return {string}
   */
  Unit.prototype.valueOf = Unit.prototype.toString

  /**
   * Simplify this Unit's unit list and return a new Unit with the simplified list.
   * The returned Unit will contain a list of the "best" units for formatting.
   */
  Unit.prototype.simplify = function () {
    const ret = this.clone()

    const proposedUnitList = []

    // Search for a matching base
    let matchingBase
    for (const key in currentUnitSystem) {
      if (hasOwnProperty(currentUnitSystem, key)) {
        if (ret.hasBase(BASE_UNITS[key])) {
          matchingBase = key
          break
        }
      }
    }

    if (matchingBase === 'NONE') {
      ret.units = []
    } else {
      let matchingUnit
      if (matchingBase) {
        // Does the unit system have a matching unit?
        if (hasOwnProperty(currentUnitSystem, matchingBase)) {
          matchingUnit = currentUnitSystem[matchingBase]
        }
      }
      if (matchingUnit) {
        ret.units = [{
          unit: matchingUnit.unit,
          prefix: matchingUnit.prefix,
          power: 1.0
        }]
      } else {
        // Multiple units or units with powers are formatted like this:
        // 5 (kg m^2) / (s^3 mol)
        // Build an representation from the base units of the current unit system
        let missingBaseDim = false
        for (let i = 0; i < BASE_DIMENSIONS.length; i++) {
          const baseDim = BASE_DIMENSIONS[i]
          if (Math.abs(ret.dimensions[i] || 0) > 1e-12) {
            if (hasOwnProperty(currentUnitSystem, baseDim)) {
              proposedUnitList.push({
                unit: currentUnitSystem[baseDim].unit,
                prefix: currentUnitSystem[baseDim].prefix,
                power: ret.dimensions[i] || 0
              })
            } else {
              missingBaseDim = true
            }
          }
        }

        // Is the proposed unit list "simpler" than the existing one?
        if (proposedUnitList.length < ret.units.length && !missingBaseDim) {
          // Replace this unit list with the proposed list
          ret.units = proposedUnitList
        }
      }
    }

    return ret
  }

  /**
   * Returns a new Unit in the SI system with the same value as this one
   */
  Unit.prototype.toSI = function () {
    const ret = this.clone()

    const proposedUnitList = []

    // Multiple units or units with powers are formatted like this:
    // 5 (kg m^2) / (s^3 mol)
    // Build an representation from the base units of the SI unit system
    for (let i = 0; i < BASE_DIMENSIONS.length; i++) {
      const baseDim = BASE_DIMENSIONS[i]
      if (Math.abs(ret.dimensions[i] || 0) > 1e-12) {
        if (hasOwnProperty(UNIT_SYSTEMS.si, baseDim)) {
          proposedUnitList.push({
            unit: UNIT_SYSTEMS.si[baseDim].unit,
            prefix: UNIT_SYSTEMS.si[baseDim].prefix,
            power: ret.dimensions[i] || 0
          })
        } else {
          throw new Error('Cannot express custom unit ' + baseDim + ' in SI units')
        }
      }
    }

    // Replace this unit list with the proposed list
    ret.units = proposedUnitList

    ret.fixPrefix = true
    ret.skipAutomaticSimplification = true

    if (this.value !== null) {
      ret.value = null
      return this.to(ret)
    }
    return ret
  }

  /**
   * Get a string representation of the units of this Unit, without the value. The unit list is formatted as-is without first being simplified.
   * @memberof Unit
   * @return {string}
   */
  Unit.prototype.formatUnits = function () {
    let strNum = ''
    let strDen = ''
    let nNum = 0
    let nDen = 0

    for (let i = 0; i < this.units.length; i++) {
      if (this.units[i].power > 0) {
        nNum++
        strNum += ' ' + this.units[i].prefix.name + this.units[i].unit.name
        if (Math.abs(this.units[i].power - 1.0) > 1e-15) {
          strNum += '^' + this.units[i].power
        }
      } else if (this.units[i].power < 0) {
        nDen++
      }
    }

    if (nDen > 0) {
      for (let i = 0; i < this.units.length; i++) {
        if (this.units[i].power < 0) {
          if (nNum > 0) {
            strDen += ' ' + this.units[i].prefix.name + this.units[i].unit.name
            if (Math.abs(this.units[i].power + 1.0) > 1e-15) {
              strDen += '^' + (-this.units[i].power)
            }
          } else {
            strDen += ' ' + this.units[i].prefix.name + this.units[i].unit.name
            strDen += '^' + (this.units[i].power)
          }
        }
      }
    }
    // Remove leading " "
    strNum = strNum.substr(1)
    strDen = strDen.substr(1)

    // Add parans for better copy/paste back into evaluate, for example, or for better pretty print formatting
    if (nNum > 1 && nDen > 0) {
      strNum = '(' + strNum + ')'
    }
    if (nDen > 1 && nNum > 0) {
      strDen = '(' + strDen + ')'
    }

    let str = strNum
    if (nNum > 0 && nDen > 0) {
      str += ' / '
    }
    str += strDen

    return str
  }

  /**
   * Get a unit, with optional formatting options.
   * @memberof Unit
   * @param {string[] | Unit[]} [units]  Array of units strings or valueLess Unit objects in wich choose the best one
   * @param {Object} [options]  Options for parsing the unit. See parseUnit for details.
   *
   * @return {Unit} Returns a new Unit with the given value and unit.
   */
  Unit.prototype.toBest = function (unitList = [], options = {}) {
    if (unitList && !Array.isArray(unitList)) {
      throw new Error('Invalid unit type. Expected string or Unit.')
    }

    const startPrefixes = this.units[0].unit.prefixes
    if (unitList && unitList.length > 0) {
      const unitObjects = unitList.map(u => {
        let unit = null
        if (typeof u === 'string') {
          unit = Unit.parse(u)
          if (!unit) {
            throw new Error('Invalid unit type. Expected compatible string or Unit.')
          }
        } else if (!isUnit(u)) {
          throw new Error('Invalid unit type. Expected compatible string or Unit.')
        }
        if (unit === null) {
          unit = u.clone()
        }
        try {
          this.to(unit.formatUnits())
          return unit
        } catch (e) {
          throw new Error('Invalid unit type. Expected compatible string or Unit.')
        }
      })
      const prefixes = unitObjects.map(el => el.units[0].prefix)
      this.units[0].unit.prefixes = prefixes.reduce((acc, prefix) => {
        acc[prefix.name] = prefix
        return acc
      }, {})
      this.units[0].prefix = prefixes[0]
    }

    const result = formatBest(this, options).simp
    this.units[0].unit.prefixes = startPrefixes
    result.fixPrefix = true
    return result
  }
  /**
   * Get a string representation of the Unit, with optional formatting options.
   * @memberof Unit
   * @param {Object | number | Function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @return {string}
   */
  Unit.prototype.format = function (options) {
    const { simp, valueStr, unitStr } = formatBest(this, options)
    let str = valueStr
    if (simp.value && isComplex(simp.value)) {
      str = '(' + str + ')' // Surround complex values with ( ) to enable better parsing
    }
    if (unitStr.length > 0 && str.length > 0) {
      str += ' '
    }
    str += unitStr

    return str
  }

  /**
 * Helper function to normalize a unit for conversion and formatting
 * @param {Unit} unit The unit to be normalized
 * @return {Object} Object with normalized unit and value
 * @private
 */
  function formatBest (unit, options = {}) {
    // Simplfy the unit list, unless it is valueless or was created directly in the
    // constructor or as the result of to or toSI
    const simp = unit.skipAutomaticSimplification || unit.value === null
      ? unit.clone()
      : unit.simplify()

    // Apply some custom logic for handling VA and VAR. The goal is to express the value of the unit as a real value, if possible. Otherwise, use a real-valued unit instead of a complex-valued one.
    handleVAandVARUnits(simp)
    // Now apply the best prefix
    // Units must have only one unit and not have the fixPrefix flag set
    applyBestPrefixIfNeeded(simp, options.offset)

    const value = simp._denormalize(simp.value)
    const valueStr = (simp.value !== null) ? format(value, options || {}) : ''
    const unitStr = simp.formatUnits()
    return {
      simp,
      valueStr,
      unitStr
    }
  }

  /**
   * Helper to handle VA and VAR units
   * @param {Unit} simp The unit to be normalized
   */
  function handleVAandVARUnits (simp) {
    let isImaginary = false
    if (typeof (simp.value) !== 'undefined' && simp.value !== null && isComplex(simp.value)) {
      // TODO: Make this better, for example, use relative magnitude of re and im rather than absolute
      isImaginary = Math.abs(simp.value.re) < 1e-14
    }
    for (const i in simp.units) {
      if (hasOwnProperty(simp.units, i)) {
        if (simp.units[i].unit) {
          if (simp.units[i].unit.name === 'VA' && isImaginary) {
            simp.units[i].unit = UNITS.VAR
          } else if (simp.units[i].unit.name === 'VAR' && !isImaginary) {
            simp.units[i].unit = UNITS.VA
          }
        }
      }
    }
  }

  /**
   * Helper to apply the best prefix if needed
   * @param {Unit} simp The unit to be normalized
   */
  function applyBestPrefixIfNeeded (simp, offset) {
    if (simp.units.length === 1 && !simp.fixPrefix) {
      // Units must have integer powers, otherwise the prefix will change the
      // outputted value by not-an-integer-power-of-ten
      if (Math.abs(simp.units[0].power - Math.round(simp.units[0].power)) < 1e-14) {
        // Apply the best prefix
        simp.units[0].prefix = simp._bestPrefix(offset)
      }
    }
  }

  /**
   * Calculate the best prefix using current value.
   * @memberof Unit
   * @returns {Object} prefix
   * @param {number} [offset]  Optional offset for the best prefix calculation (default 1.2)
   * @private
   */
  Unit.prototype._bestPrefix = function (offset = 1.2) {
    if (this.units.length !== 1) {
      throw new Error('Can only compute the best prefix for single units with integer powers, like kg, s^2, N^-1, and so forth!')
    }
    if (Math.abs(this.units[0].power - Math.round(this.units[0].power)) >= 1e-14) {
      throw new Error('Can only compute the best prefix for single units with integer powers, like kg, s^2, N^-1, and so forth!')
    }

    // find the best prefix value (resulting in the value of which
    // the absolute value of the log10 is closest to zero,
    // though with a little offset of 1.2 for nicer values: you get a
    // sequence 1mm 100mm 500mm 0.6m 1m 10m 100m 500m 0.6km 1km ...

    // Note: the units value can be any numeric type, but to find the best
    // prefix it's enough to work with limited precision of a regular number
    // Update: using mathjs abs since we also allow complex numbers
    const absValue = this.value !== null ? abs(this.value) : 0
    const absUnitValue = abs(this.units[0].unit.value)
    let bestPrefix = this.units[0].prefix
    if (absValue === 0) {
      return bestPrefix
    }
    const power = this.units[0].power
    let bestDiff = Math.log(absValue / Math.pow(bestPrefix.value * absUnitValue, power)) / Math.LN10 - offset
    if (bestDiff > -2.200001 && bestDiff < 1.800001) return bestPrefix // Allow the original prefix
    bestDiff = Math.abs(bestDiff)
    const prefixes = this.units[0].unit.prefixes
    for (const p in prefixes) {
      if (hasOwnProperty(prefixes, p)) {
        const prefix = prefixes[p]
        if (prefix.scientific) {
          const diff = Math.abs(
            Math.log(absValue / Math.pow(prefix.value * absUnitValue, power)) / Math.LN10 - offset)
          if (diff < bestDiff ||
            (diff === bestDiff && prefix.name.length < bestPrefix.name.length)) {
            // choose the prefix with the smallest diff, or if equal, choose the one
            // with the shortest name (can happen with SHORTLONG for example)
            bestPrefix = prefix
            bestDiff = diff
          }
        }
      }
    }
    return bestPrefix
  }

  /**
   * Returns an array of units whose sum is equal to this unit
   * @memberof Unit
   * @param {Array} [parts] An array of strings or valueless units.
   *
   *   Example:
   *
   *   const u = new Unit(1, 'm')
   *   u.splitUnit(['feet', 'inch'])
   *     [ 3 feet, 3.3700787401575 inch ]
   *
   * @return {Array} An array of units.
   */
  Unit.prototype.splitUnit = function (parts) {
    let x = this.clone()
    const ret = []
    for (let i = 0; i < parts.length; i++) {
      // Convert x to the requested unit
      x = x.to(parts[i])
      if (i === parts.length - 1) break

      // Get the numeric value of this unit
      const xNumeric = x.toNumeric()

      // Check to see if xNumeric is nearly equal to an integer,
      // since fix can incorrectly round down if there is round-off error
      const xRounded = round(xNumeric)
      let xFixed
      const isNearlyEqual = equal(xRounded, xNumeric)
      if (isNearlyEqual) {
        xFixed = xRounded
      } else {
        xFixed = fix(x.toNumeric())
      }

      const y = new Unit(xFixed, parts[i].toString())
      ret.push(y)
      x = subtractScalar(x, y)
    }

    // This little bit fixes a bug where the remainder should be 0 but is a little bit off.
    // But instead of comparing x, the remainder, with zero--we will compare the sum of
    // all the parts so far with the original value. If they are nearly equal,
    // we set the remainder to 0.
    let testSum = 0
    for (let i = 0; i < ret.length; i++) {
      testSum = addScalar(testSum, ret[i].value)
    }
    if (equal(testSum, this.value)) {
      x.value = 0
    }

    ret.push(x)

    return ret
  }

  const PREFIXES = {
    NONE: {
      '': { name: '', value: 1, scientific: true }
    },
    SHORT: {
      '': { name: '', value: 1, scientific: true },

      da: { name: 'da', value: 1e1, scientific: false },
      h: { name: 'h', value: 1e2, scientific: false },
      k: { name: 'k', value: 1e3, scientific: true },
      M: { name: 'M', value: 1e6, scientific: true },
      G: { name: 'G', value: 1e9, scientific: true },
      T: { name: 'T', value: 1e12, scientific: true },
      P: { name: 'P', value: 1e15, scientific: true },
      E: { name: 'E', value: 1e18, scientific: true },
      Z: { name: 'Z', value: 1e21, scientific: true },
      Y: { name: 'Y', value: 1e24, scientific: true },
      R: { name: 'R', value: 1e27, scientific: true },
      Q: { name: 'Q', value: 1e30, scientific: true },

      d: { name: 'd', value: 1e-1, scientific: false },
      c: { name: 'c', value: 1e-2, scientific: false },
      m: { name: 'm', value: 1e-3, scientific: true },
      u: { name: 'u', value: 1e-6, scientific: true },
      n: { name: 'n', value: 1e-9, scientific: true },
      p: { name: 'p', value: 1e-12, scientific: true },
      f: { name: 'f', value: 1e-15, scientific: true },
      a: { name: 'a', value: 1e-18, scientific: true },
      z: { name: 'z', value: 1e-21, scientific: true },
      y: { name: 'y', value: 1e-24, scientific: true },
      r: { name: 'r', value: 1e-27, scientific: true },
      q: { name: 'q', value: 1e-30, scientific: true }
    },
    LONG: {
      '': { name: '', value: 1, scientific: true },

      deca: { name: 'deca', value: 1e1, scientific: false },
      hecto: { name: 'hecto', value: 1e2, scientific: false },
      kilo: { name: 'kilo', value: 1e3, scientific: true },
      mega: { name: 'mega', value: 1e6, scientific: true },
      giga: { name: 'giga', value: 1e9, scientific: true },
      tera: { name: 'tera', value: 1e12, scientific: true },
      peta: { name: 'peta', value: 1e15, scientific: true },
      exa: { name: 'exa', value: 1e18, scientific: true },
      zetta: { name: 'zetta', value: 1e21, scientific: true },
      yotta: { name: 'yotta', value: 1e24, scientific: true },
      ronna: { name: 'ronna', value: 1e27, scientific: true },
      quetta: { name: 'quetta', value: 1e30, scientific: true },

      deci: { name: 'deci', value: 1e-1, scientific: false },
      centi: { name: 'centi', value: 1e-2, scientific: false },
      milli: { name: 'milli', value: 1e-3, scientific: true },
      micro: { name: 'micro', value: 1e-6, scientific: true },
      nano: { name: 'nano', value: 1e-9, scientific: true },
      pico: { name: 'pico', value: 1e-12, scientific: true },
      femto: { name: 'femto', value: 1e-15, scientific: true },
      atto: { name: 'atto', value: 1e-18, scientific: true },
      zepto: { name: 'zepto', value: 1e-21, scientific: true },
      yocto: { name: 'yocto', value: 1e-24, scientific: true },
      ronto: { name: 'ronto', value: 1e-27, scientific: true },
      quecto: { name: 'quecto', value: 1e-30, scientific: true }
    },
    SQUARED: {
      '': { name: '', value: 1, scientific: true },

      da: { name: 'da', value: 1e2, scientific: false },
      h: { name: 'h', value: 1e4, scientific: false },
      k: { name: 'k', value: 1e6, scientific: true },
      M: { name: 'M', value: 1e12, scientific: true },
      G: { name: 'G', value: 1e18, scientific: true },
      T: { name: 'T', value: 1e24, scientific: true },
      P: { name: 'P', value: 1e30, scientific: true },
      E: { name: 'E', value: 1e36, scientific: true },
      Z: { name: 'Z', value: 1e42, scientific: true },
      Y: { name: 'Y', value: 1e48, scientific: true },
      R: { name: 'R', value: 1e54, scientific: true },
      Q: { name: 'Q', value: 1e60, scientific: true },

      d: { name: 'd', value: 1e-2, scientific: false },
      c: { name: 'c', value: 1e-4, scientific: false },
      m: { name: 'm', value: 1e-6, scientific: true },
      u: { name: 'u', value: 1e-12, scientific: true },
      n: { name: 'n', value: 1e-18, scientific: true },
      p: { name: 'p', value: 1e-24, scientific: true },
      f: { name: 'f', value: 1e-30, scientific: true },
      a: { name: 'a', value: 1e-36, scientific: true },
      z: { name: 'z', value: 1e-42, scientific: true },
      y: { name: 'y', value: 1e-48, scientific: true },
      r: { name: 'r', value: 1e-54, scientific: true },
      q: { name: 'q', value: 1e-60, scientific: true }
    },
    CUBIC: {
      '': { name: '', value: 1, scientific: true },

      da: { name: 'da', value: 1e3, scientific: false },
      h: { name: 'h', value: 1e6, scientific: false },
      k: { name: 'k', value: 1e9, scientific: true },
      M: { name: 'M', value: 1e18, scientific: true },
      G: { name: 'G', value: 1e27, scientific: true },
      T: { name: 'T', value: 1e36, scientific: true },
      P: { name: 'P', value: 1e45, scientific: true },
      E: { name: 'E', value: 1e54, scientific: true },
      Z: { name: 'Z', value: 1e63, scientific: true },
      Y: { name: 'Y', value: 1e72, scientific: true },
      R: { name: 'R', value: 1e81, scientific: true },
      Q: { name: 'Q', value: 1e90, scientific: true },

      d: { name: 'd', value: 1e-3, scientific: false },
      c: { name: 'c', value: 1e-6, scientific: false },
      m: { name: 'm', value: 1e-9, scientific: true },
      u: { name: 'u', value: 1e-18, scientific: true },
      n: { name: 'n', value: 1e-27, scientific: true },
      p: { name: 'p', value: 1e-36, scientific: true },
      f: { name: 'f', value: 1e-45, scientific: true },
      a: { name: 'a', value: 1e-54, scientific: true },
      z: { name: 'z', value: 1e-63, scientific: true },
      y: { name: 'y', value: 1e-72, scientific: true },
      r: { name: 'r', value: 1e-81, scientific: true },
      q: { name: 'q', value: 1e-90, scientific: true }
    },
    BINARY_SHORT_SI: {
      '': { name: '', value: 1, scientific: true },
      k: { name: 'k', value: 1e3, scientific: true },
      M: { name: 'M', value: 1e6, scientific: true },
      G: { name: 'G', value: 1e9, scientific: true },
      T: { name: 'T', value: 1e12, scientific: true },
      P: { name: 'P', value: 1e15, scientific: true },
      E: { name: 'E', value: 1e18, scientific: true },
      Z: { name: 'Z', value: 1e21, scientific: true },
      Y: { name: 'Y', value: 1e24, scientific: true }
    },
    BINARY_SHORT_IEC: {
      '': { name: '', value: 1, scientific: true },
      Ki: { name: 'Ki', value: 1024, scientific: true },
      Mi: { name: 'Mi', value: Math.pow(1024, 2), scientific: true },
      Gi: { name: 'Gi', value: Math.pow(1024, 3), scientific: true },
      Ti: { name: 'Ti', value: Math.pow(1024, 4), scientific: true },
      Pi: { name: 'Pi', value: Math.pow(1024, 5), scientific: true },
      Ei: { name: 'Ei', value: Math.pow(1024, 6), scientific: true },
      Zi: { name: 'Zi', value: Math.pow(1024, 7), scientific: true },
      Yi: { name: 'Yi', value: Math.pow(1024, 8), scientific: true }
    },
    BINARY_LONG_SI: {
      '': { name: '', value: 1, scientific: true },
      kilo: { name: 'kilo', value: 1e3, scientific: true },
      mega: { name: 'mega', value: 1e6, scientific: true },
      giga: { name: 'giga', value: 1e9, scientific: true },
      tera: { name: 'tera', value: 1e12, scientific: true },
      peta: { name: 'peta', value: 1e15, scientific: true },
      exa: { name: 'exa', value: 1e18, scientific: true },
      zetta: { name: 'zetta', value: 1e21, scientific: true },
      yotta: { name: 'yotta', value: 1e24, scientific: true }
    },
    BINARY_LONG_IEC: {
      '': { name: '', value: 1, scientific: true },
      kibi: { name: 'kibi', value: 1024, scientific: true },
      mebi: { name: 'mebi', value: Math.pow(1024, 2), scientific: true },
      gibi: { name: 'gibi', value: Math.pow(1024, 3), scientific: true },
      tebi: { name: 'tebi', value: Math.pow(1024, 4), scientific: true },
      pebi: { name: 'pebi', value: Math.pow(1024, 5), scientific: true },
      exi: { name: 'exi', value: Math.pow(1024, 6), scientific: true },
      zebi: { name: 'zebi', value: Math.pow(1024, 7), scientific: true },
      yobi: { name: 'yobi', value: Math.pow(1024, 8), scientific: true }
    },
    BTU: {
      '': { name: '', value: 1, scientific: true },
      MM: { name: 'MM', value: 1e6, scientific: true }
    }
  }

  PREFIXES.SHORTLONG = Object.assign({}, PREFIXES.SHORT, PREFIXES.LONG)
  PREFIXES.BINARY_SHORT = Object.assign({}, PREFIXES.BINARY_SHORT_SI, PREFIXES.BINARY_SHORT_IEC)
  PREFIXES.BINARY_LONG = Object.assign({}, PREFIXES.BINARY_LONG_SI, PREFIXES.BINARY_LONG_IEC)

  /* Internally, each unit is represented by a value and a dimension array. The elements of the dimensions array have the following meaning:
   * Index  Dimension
   * -----  ---------
   *   0    Length
   *   1    Mass
   *   2    Time
   *   3    Current
   *   4    Temperature
   *   5    Luminous intensity
   *   6    Amount of substance
   *   7    Angle
   *   8    Bit (digital)
   * For example, the unit "298.15 K" is a pure temperature and would have a value of 298.15 and a dimension array of [0, 0, 0, 0, 1, 0, 0, 0, 0]. The unit "1 cal / (gm °C)" can be written in terms of the 9 fundamental dimensions as [length^2] / ([time^2] * [temperature]), and would a value of (after conversion to SI) 4184.0 and a dimensions array of [2, 0, -2, 0, -1, 0, 0, 0, 0].
   *
   */

  const BASE_DIMENSIONS = ['MASS', 'LENGTH', 'TIME', 'CURRENT', 'TEMPERATURE', 'LUMINOUS_INTENSITY', 'AMOUNT_OF_SUBSTANCE', 'ANGLE', 'BIT']

  const BASE_UNITS = {
    NONE: {
      dimensions: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    MASS: {
      dimensions: [1, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    LENGTH: {
      dimensions: [0, 1, 0, 0, 0, 0, 0, 0, 0]
    },
    TIME: {
      dimensions: [0, 0, 1, 0, 0, 0, 0, 0, 0]
    },
    CURRENT: {
      dimensions: [0, 0, 0, 1, 0, 0, 0, 0, 0]
    },
    TEMPERATURE: {
      dimensions: [0, 0, 0, 0, 1, 0, 0, 0, 0]
    },
    LUMINOUS_INTENSITY: {
      dimensions: [0, 0, 0, 0, 0, 1, 0, 0, 0]
    },
    AMOUNT_OF_SUBSTANCE: {
      dimensions: [0, 0, 0, 0, 0, 0, 1, 0, 0]
    },

    FORCE: {
      dimensions: [1, 1, -2, 0, 0, 0, 0, 0, 0]
    },
    SURFACE: {
      dimensions: [0, 2, 0, 0, 0, 0, 0, 0, 0]
    },
    VOLUME: {
      dimensions: [0, 3, 0, 0, 0, 0, 0, 0, 0]
    },
    ENERGY: {
      dimensions: [1, 2, -2, 0, 0, 0, 0, 0, 0]
    },
    POWER: {
      dimensions: [1, 2, -3, 0, 0, 0, 0, 0, 0]
    },
    PRESSURE: {
      dimensions: [1, -1, -2, 0, 0, 0, 0, 0, 0]
    },

    ELECTRIC_CHARGE: {
      dimensions: [0, 0, 1, 1, 0, 0, 0, 0, 0]
    },
    ELECTRIC_CAPACITANCE: {
      dimensions: [-1, -2, 4, 2, 0, 0, 0, 0, 0]
    },
    ELECTRIC_POTENTIAL: {
      dimensions: [1, 2, -3, -1, 0, 0, 0, 0, 0]
    },
    ELECTRIC_RESISTANCE: {
      dimensions: [1, 2, -3, -2, 0, 0, 0, 0, 0]
    },
    ELECTRIC_INDUCTANCE: {
      dimensions: [1, 2, -2, -2, 0, 0, 0, 0, 0]
    },
    ELECTRIC_CONDUCTANCE: {
      dimensions: [-1, -2, 3, 2, 0, 0, 0, 0, 0]
    },
    MAGNETIC_FLUX: {
      dimensions: [1, 2, -2, -1, 0, 0, 0, 0, 0]
    },
    MAGNETIC_FLUX_DENSITY: {
      dimensions: [1, 0, -2, -1, 0, 0, 0, 0, 0]
    },

    FREQUENCY: {
      dimensions: [0, 0, -1, 0, 0, 0, 0, 0, 0]
    },
    ANGLE: {
      dimensions: [0, 0, 0, 0, 0, 0, 0, 1, 0]
    },
    BIT: {
      dimensions: [0, 0, 0, 0, 0, 0, 0, 0, 1]
    }
  }

  for (const key in BASE_UNITS) {
    if (hasOwnProperty(BASE_UNITS, key)) {
      BASE_UNITS[key].key = key
    }
  }

  const BASE_UNIT_NONE = {}

  const UNIT_NONE = { name: '', base: BASE_UNIT_NONE, value: 1, offset: 0, dimensions: BASE_DIMENSIONS.map(x => 0) }

  const UNITS = {
    // length
    meter: {
      name: 'meter',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    inch: {
      name: 'inch',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.0254,
      offset: 0
    },
    foot: {
      name: 'foot',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.3048,
      offset: 0
    },
    yard: {
      name: 'yard',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.9144,
      offset: 0
    },
    mile: {
      name: 'mile',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 1609.344,
      offset: 0
    },
    link: {
      name: 'link',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.201168,
      offset: 0
    },
    rod: {
      name: 'rod',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 5.0292,
      offset: 0
    },
    chain: {
      name: 'chain',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 20.1168,
      offset: 0
    },
    angstrom: {
      name: 'angstrom',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 1e-10,
      offset: 0
    },

    m: {
      name: 'm',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    in: {
      name: 'in',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.0254,
      offset: 0
    },
    ft: {
      name: 'ft',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.3048,
      offset: 0
    },
    yd: {
      name: 'yd',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.9144,
      offset: 0
    },
    mi: {
      name: 'mi',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 1609.344,
      offset: 0
    },
    li: {
      name: 'li',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.201168,
      offset: 0
    },
    rd: {
      name: 'rd',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 5.029210,
      offset: 0
    },
    ch: {
      name: 'ch',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 20.1168,
      offset: 0
    },
    mil: {
      name: 'mil',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.0000254,
      offset: 0
    }, // 1/1000 inch

    // Surface
    m2: {
      name: 'm2',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.SQUARED,
      value: 1,
      offset: 0
    },
    sqin: {
      name: 'sqin',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 0.00064516,
      offset: 0
    }, // 645.16 mm2
    sqft: {
      name: 'sqft',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 0.09290304,
      offset: 0
    }, // 0.09290304 m2
    sqyd: {
      name: 'sqyd',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 0.83612736,
      offset: 0
    }, // 0.83612736 m2
    sqmi: {
      name: 'sqmi',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 2589988.110336,
      offset: 0
    }, // 2.589988110336 km2
    sqrd: {
      name: 'sqrd',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 25.29295,
      offset: 0
    }, // 25.29295 m2
    sqch: {
      name: 'sqch',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 404.6873,
      offset: 0
    }, // 404.6873 m2
    sqmil: {
      name: 'sqmil',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 6.4516e-10,
      offset: 0
    }, // 6.4516 * 10^-10 m2
    acre: {
      name: 'acre',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 4046.86,
      offset: 0
    }, // 4046.86 m2
    hectare: {
      name: 'hectare',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 10000,
      offset: 0
    }, // 10000 m2

    // Volume
    m3: {
      name: 'm3',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.CUBIC,
      value: 1,
      offset: 0
    },
    L: {
      name: 'L',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.SHORT,
      value: 0.001,
      offset: 0
    }, // litre
    l: {
      name: 'l',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.SHORT,
      value: 0.001,
      offset: 0
    }, // litre
    litre: {
      name: 'litre',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.LONG,
      value: 0.001,
      offset: 0
    },
    cuin: {
      name: 'cuin',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 1.6387064e-5,
      offset: 0
    }, // 1.6387064e-5 m3
    cuft: {
      name: 'cuft',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.028316846592,
      offset: 0
    }, // 28.316 846 592 L
    cuyd: {
      name: 'cuyd',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.764554857984,
      offset: 0
    }, // 764.554 857 984 L
    teaspoon: {
      name: 'teaspoon',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.000005,
      offset: 0
    }, // 5 mL
    tablespoon: {
      name: 'tablespoon',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.000015,
      offset: 0
    }, // 15 mL
    // {name: 'cup', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.000240, offset: 0}, // 240 mL  // not possible, we have already another cup
    drop: {
      name: 'drop',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 5e-8,
      offset: 0
    }, // 0.05 mL = 5e-8 m3
    gtt: {
      name: 'gtt',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 5e-8,
      offset: 0
    }, // 0.05 mL = 5e-8 m3

    // Liquid volume
    minim: {
      name: 'minim',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.000000061611519921875,
      offset: 0
    }, // 1/61440 gallons
    fluiddram: {
      name: 'fluiddram',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0000036966911953125,
      offset: 0
    }, // 1/1024 gallons
    fluidounce: {
      name: 'fluidounce',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0000295735295625,
      offset: 0
    }, // 1/128 gallons
    gill: {
      name: 'gill',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.00011829411825,
      offset: 0
    }, // 1/32 gallons
    cc: {
      name: 'cc',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 1e-6,
      offset: 0
    }, // 1e-6 L
    cup: {
      name: 'cup',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0002365882365,
      offset: 0
    }, // 1/16 gallons
    pint: {
      name: 'pint',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.000473176473,
      offset: 0
    }, // 1/8 gallons
    quart: {
      name: 'quart',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.000946352946,
      offset: 0
    }, // 1/4 gallons
    gallon: {
      name: 'gallon',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.003785411784,
      offset: 0
    }, // 3.785411784 L
    beerbarrel: {
      name: 'beerbarrel',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.117347765304,
      offset: 0
    }, // 31 gallons
    oilbarrel: {
      name: 'oilbarrel',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.158987294928,
      offset: 0
    }, // 42 gallons
    hogshead: {
      name: 'hogshead',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.238480942392,
      offset: 0
    }, // 63 gallons

    // Mass
    g: {
      name: 'g',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.SHORT,
      value: 0.001,
      offset: 0
    },
    gram: {
      name: 'gram',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.LONG,
      value: 0.001,
      offset: 0
    },

    ton: {
      name: 'ton',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.SHORT,
      value: 907.18474,
      offset: 0
    },
    t: {
      name: 't',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.SHORT,
      value: 1000,
      offset: 0
    },
    tonne: {
      name: 'tonne',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.LONG,
      value: 1000,
      offset: 0
    },

    grain: {
      name: 'grain',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 64.79891e-6,
      offset: 0
    },
    dram: {
      name: 'dram',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 1.7718451953125e-3,
      offset: 0
    },
    ounce: {
      name: 'ounce',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 28.349523125e-3,
      offset: 0
    },
    poundmass: {
      name: 'poundmass',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 453.59237e-3,
      offset: 0
    },
    hundredweight: {
      name: 'hundredweight',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 45.359237,
      offset: 0
    },
    stick: {
      name: 'stick',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 115e-3,
      offset: 0
    },
    stone: {
      name: 'stone',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 6.35029318,
      offset: 0
    },

    gr: {
      name: 'gr',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 64.79891e-6,
      offset: 0
    },
    dr: {
      name: 'dr',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 1.7718451953125e-3,
      offset: 0
    },
    oz: {
      name: 'oz',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 28.349523125e-3,
      offset: 0
    },
    lbm: {
      name: 'lbm',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 453.59237e-3,
      offset: 0
    },
    cwt: {
      name: 'cwt',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 45.359237,
      offset: 0
    },

    // Time
    s: {
      name: 's',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    min: {
      name: 'min',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 60,
      offset: 0
    },
    h: {
      name: 'h',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 3600,
      offset: 0
    },
    second: {
      name: 'second',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    sec: {
      name: 'sec',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    minute: {
      name: 'minute',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 60,
      offset: 0
    },
    hour: {
      name: 'hour',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 3600,
      offset: 0
    },
    day: {
      name: 'day',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 86400,
      offset: 0
    },
    week: {
      name: 'week',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 7 * 86400,
      offset: 0
    },
    month: {
      name: 'month',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 2629800, // 1/12th of Julian year
      offset: 0
    },
    year: {
      name: 'year',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 31557600, // Julian year
      offset: 0
    },
    decade: {
      name: 'decade',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 315576000, // Julian decade
      offset: 0
    },
    century: {
      name: 'century',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 3155760000, // Julian century
      offset: 0
    },
    millennium: {
      name: 'millennium',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 31557600000, // Julian millennium
      offset: 0
    },

    // Frequency
    hertz: {
      name: 'Hertz',
      base: BASE_UNITS.FREQUENCY,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0,
      reciprocal: true
    },
    Hz: {
      name: 'Hz',
      base: BASE_UNITS.FREQUENCY,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0,
      reciprocal: true
    },

    // Angle
    rad: {
      name: 'rad',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    radian: {
      name: 'radian',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    // deg = rad / (2*pi) * 360 = rad / 0.017453292519943295769236907684888
    deg: {
      name: 'deg',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.SHORT,
      value: null, // will be filled in by calculateAngleValues()
      offset: 0
    },
    degree: {
      name: 'degree',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.LONG,
      value: null, // will be filled in by calculateAngleValues()
      offset: 0
    },
    // grad = rad / (2*pi) * 400  = rad / 0.015707963267948966192313216916399
    grad: {
      name: 'grad',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.SHORT,
      value: null, // will be filled in by calculateAngleValues()
      offset: 0
    },
    gradian: {
      name: 'gradian',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.LONG,
      value: null, // will be filled in by calculateAngleValues()
      offset: 0
    },
    // cycle = rad / (2*pi) = rad / 6.2831853071795864769252867665793
    cycle: {
      name: 'cycle',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.NONE,
      value: null, // will be filled in by calculateAngleValues()
      offset: 0
    },
    // arcsec = rad / (3600 * (360 / 2 * pi)) = rad / 0.0000048481368110953599358991410235795
    arcsec: {
      name: 'arcsec',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.NONE,
      value: null, // will be filled in by calculateAngleValues()
      offset: 0
    },
    // arcmin = rad / (60 * (360 / 2 * pi)) = rad / 0.00029088820866572159615394846141477
    arcmin: {
      name: 'arcmin',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.NONE,
      value: null, // will be filled in by calculateAngleValues()
      offset: 0
    },

    // Electric current
    A: {
      name: 'A',
      base: BASE_UNITS.CURRENT,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    ampere: {
      name: 'ampere',
      base: BASE_UNITS.CURRENT,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },

    // Temperature
    // K(C) = °C + 273.15
    // K(F) = (°F + 459.67) * (5 / 9)
    // K(R) = °R * (5 / 9)
    K: {
      name: 'K',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    degC: {
      name: 'degC',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 273.15
    },
    degF: {
      name: 'degF',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.SHORT,
      value: new Fraction(5, 9),
      offset: 459.67
    },
    degR: {
      name: 'degR',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.SHORT,
      value: new Fraction(5, 9),
      offset: 0
    },
    kelvin: {
      name: 'kelvin',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    celsius: {
      name: 'celsius',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 273.15
    },
    fahrenheit: {
      name: 'fahrenheit',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.LONG,
      value: new Fraction(5, 9),
      offset: 459.67
    },
    rankine: {
      name: 'rankine',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.LONG,
      value: new Fraction(5, 9),
      offset: 0
    },

    // amount of substance
    mol: {
      name: 'mol',
      base: BASE_UNITS.AMOUNT_OF_SUBSTANCE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    mole: {
      name: 'mole',
      base: BASE_UNITS.AMOUNT_OF_SUBSTANCE,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },

    // luminous intensity
    cd: {
      name: 'cd',
      base: BASE_UNITS.LUMINOUS_INTENSITY,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    candela: {
      name: 'candela',
      base: BASE_UNITS.LUMINOUS_INTENSITY,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    // TODO: units STERADIAN
    // {name: 'sr', base: BASE_UNITS.STERADIAN, prefixes: PREFIXES.NONE, value: 1, offset: 0},
    // {name: 'steradian', base: BASE_UNITS.STERADIAN, prefixes: PREFIXES.NONE, value: 1, offset: 0},

    // Force
    N: {
      name: 'N',
      base: BASE_UNITS.FORCE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    newton: {
      name: 'newton',
      base: BASE_UNITS.FORCE,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    dyn: {
      name: 'dyn',
      base: BASE_UNITS.FORCE,
      prefixes: PREFIXES.SHORT,
      value: 0.00001,
      offset: 0
    },
    dyne: {
      name: 'dyne',
      base: BASE_UNITS.FORCE,
      prefixes: PREFIXES.LONG,
      value: 0.00001,
      offset: 0
    },
    lbf: {
      name: 'lbf',
      base: BASE_UNITS.FORCE,
      prefixes: PREFIXES.NONE,
      value: 4.4482216152605,
      offset: 0
    },
    poundforce: {
      name: 'poundforce',
      base: BASE_UNITS.FORCE,
      prefixes: PREFIXES.NONE,
      value: 4.4482216152605,
      offset: 0
    },
    kip: {
      name: 'kip',
      base: BASE_UNITS.FORCE,
      prefixes: PREFIXES.LONG,
      value: 4448.2216,
      offset: 0
    },
    kilogramforce: {
      name: 'kilogramforce',
      base: BASE_UNITS.FORCE,
      prefixes: PREFIXES.NONE,
      value: 9.80665,
      offset: 0
    },

    // Energy
    J: {
      name: 'J',
      base: BASE_UNITS.ENERGY,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    joule: {
      name: 'joule',
      base: BASE_UNITS.ENERGY,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    erg: {
      name: 'erg',
      base: BASE_UNITS.ENERGY,
      prefixes: PREFIXES.SHORTLONG, // Both kiloerg and kerg are acceptable
      value: 1e-7,
      offset: 0
    },
    Wh: {
      name: 'Wh',
      base: BASE_UNITS.ENERGY,
      prefixes: PREFIXES.SHORT,
      value: 3600,
      offset: 0
    },
    BTU: {
      name: 'BTU',
      base: BASE_UNITS.ENERGY,
      prefixes: PREFIXES.BTU,
      value: 1055.05585262,
      offset: 0
    },
    eV: {
      name: 'eV',
      base: BASE_UNITS.ENERGY,
      prefixes: PREFIXES.SHORT,
      value: 1.602176565e-19,
      offset: 0
    },
    electronvolt: {
      name: 'electronvolt',
      base: BASE_UNITS.ENERGY,
      prefixes: PREFIXES.LONG,
      value: 1.602176565e-19,
      offset: 0
    },

    // Power
    W: {
      name: 'W',
      base: BASE_UNITS.POWER,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    watt: {
      name: 'watt',
      base: BASE_UNITS.POWER,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    hp: {
      name: 'hp',
      base: BASE_UNITS.POWER,
      prefixes: PREFIXES.NONE,
      value: 745.6998715386,
      offset: 0
    },

    // Electrical power units
    VAR: {
      name: 'VAR',
      base: BASE_UNITS.POWER,
      prefixes: PREFIXES.SHORT,
      value: Complex.I,
      offset: 0
    },

    VA: {
      name: 'VA',
      base: BASE_UNITS.POWER,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },

    // Pressure
    Pa: {
      name: 'Pa',
      base: BASE_UNITS.PRESSURE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    psi: {
      name: 'psi',
      base: BASE_UNITS.PRESSURE,
      prefixes: PREFIXES.NONE,
      value: 6894.75729276459,
      offset: 0
    },
    atm: {
      name: 'atm',
      base: BASE_UNITS.PRESSURE,
      prefixes: PREFIXES.NONE,
      value: 101325,
      offset: 0
    },
    bar: {
      name: 'bar',
      base: BASE_UNITS.PRESSURE,
      prefixes: PREFIXES.SHORTLONG,
      value: 100000,
      offset: 0
    },
    torr: {
      name: 'torr',
      base: BASE_UNITS.PRESSURE,
      prefixes: PREFIXES.NONE,
      value: 133.322,
      offset: 0
    },
    mmHg: {
      name: 'mmHg',
      base: BASE_UNITS.PRESSURE,
      prefixes: PREFIXES.NONE,
      value: 133.322,
      offset: 0
    },
    mmH2O: {
      name: 'mmH2O',
      base: BASE_UNITS.PRESSURE,
      prefixes: PREFIXES.NONE,
      value: 9.80665,
      offset: 0
    },
    cmH2O: {
      name: 'cmH2O',
      base: BASE_UNITS.PRESSURE,
      prefixes: PREFIXES.NONE,
      value: 98.0665,
      offset: 0
    },

    // Electric charge
    coulomb: {
      name: 'coulomb',
      base: BASE_UNITS.ELECTRIC_CHARGE,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    C: {
      name: 'C',
      base: BASE_UNITS.ELECTRIC_CHARGE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    // Electric capacitance
    farad: {
      name: 'farad',
      base: BASE_UNITS.ELECTRIC_CAPACITANCE,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    F: {
      name: 'F',
      base: BASE_UNITS.ELECTRIC_CAPACITANCE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    // Electric potential
    volt: {
      name: 'volt',
      base: BASE_UNITS.ELECTRIC_POTENTIAL,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    V: {
      name: 'V',
      base: BASE_UNITS.ELECTRIC_POTENTIAL,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    // Electric resistance
    ohm: {
      name: 'ohm',
      base: BASE_UNITS.ELECTRIC_RESISTANCE,
      prefixes: PREFIXES.SHORTLONG, // Both Mohm and megaohm are acceptable
      value: 1,
      offset: 0
    },
    /*
     * Unicode breaks in browsers if charset is not specified
    Ω: {
      name: 'Ω',
      base: BASE_UNITS.ELECTRIC_RESISTANCE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    */
    // Electric inductance
    henry: {
      name: 'henry',
      base: BASE_UNITS.ELECTRIC_INDUCTANCE,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    H: {
      name: 'H',
      base: BASE_UNITS.ELECTRIC_INDUCTANCE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    // Electric conductance
    siemens: {
      name: 'siemens',
      base: BASE_UNITS.ELECTRIC_CONDUCTANCE,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    S: {
      name: 'S',
      base: BASE_UNITS.ELECTRIC_CONDUCTANCE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    // Magnetic flux
    weber: {
      name: 'weber',
      base: BASE_UNITS.MAGNETIC_FLUX,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    Wb: {
      name: 'Wb',
      base: BASE_UNITS.MAGNETIC_FLUX,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    // Magnetic flux density
    tesla: {
      name: 'tesla',
      base: BASE_UNITS.MAGNETIC_FLUX_DENSITY,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    T: {
      name: 'T',
      base: BASE_UNITS.MAGNETIC_FLUX_DENSITY,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },

    // Binary
    b: {
      name: 'b',
      base: BASE_UNITS.BIT,
      prefixes: PREFIXES.BINARY_SHORT,
      value: 1,
      offset: 0
    },
    bits: {
      name: 'bits',
      base: BASE_UNITS.BIT,
      prefixes: PREFIXES.BINARY_LONG,
      value: 1,
      offset: 0
    },
    B: {
      name: 'B',
      base: BASE_UNITS.BIT,
      prefixes: PREFIXES.BINARY_SHORT,
      value: 8,
      offset: 0
    },
    bytes: {
      name: 'bytes',
      base: BASE_UNITS.BIT,
      prefixes: PREFIXES.BINARY_LONG,
      value: 8,
      offset: 0
    }
  }

  // aliases (formerly plurals)
  // note that ALIASES is only used at creation to create more entries in UNITS by copying the aliased units
  const ALIASES = {
    meters: 'meter',
    inches: 'inch',
    feet: 'foot',
    yards: 'yard',
    miles: 'mile',
    links: 'link',
    rods: 'rod',
    chains: 'chain',
    angstroms: 'angstrom',

    lt: 'l',
    litres: 'litre',
    liter: 'litre',
    liters: 'litre',
    teaspoons: 'teaspoon',
    tablespoons: 'tablespoon',
    minims: 'minim',
    fldr: 'fluiddram',
    fluiddrams: 'fluiddram',
    floz: 'fluidounce',
    fluidounces: 'fluidounce',
    gi: 'gill',
    gills: 'gill',
    cp: 'cup',
    cups: 'cup',
    pt: 'pint',
    pints: 'pint',
    qt: 'quart',
    quarts: 'quart',
    gal: 'gallon',
    gallons: 'gallon',
    bbl: 'beerbarrel',
    beerbarrels: 'beerbarrel',
    obl: 'oilbarrel',
    oilbarrels: 'oilbarrel',
    hogsheads: 'hogshead',
    gtts: 'gtt',

    grams: 'gram',
    tons: 'ton',
    tonnes: 'tonne',
    grains: 'grain',
    drams: 'dram',
    ounces: 'ounce',
    poundmasses: 'poundmass',
    hundredweights: 'hundredweight',
    sticks: 'stick',
    lb: 'lbm',
    lbs: 'lbm',

    kips: 'kip',
    kgf: 'kilogramforce',

    acres: 'acre',
    hectares: 'hectare',
    sqfeet: 'sqft',
    sqyard: 'sqyd',
    sqmile: 'sqmi',
    sqmiles: 'sqmi',

    mmhg: 'mmHg',
    mmh2o: 'mmH2O',
    cmh2o: 'cmH2O',

    seconds: 'second',
    secs: 'second',
    minutes: 'minute',
    mins: 'minute',
    hours: 'hour',
    hr: 'hour',
    hrs: 'hour',
    days: 'day',
    weeks: 'week',
    months: 'month',
    years: 'year',
    decades: 'decade',
    centuries: 'century',
    millennia: 'millennium',

    hertz: 'hertz',

    radians: 'radian',
    degrees: 'degree',
    gradians: 'gradian',
    cycles: 'cycle',
    arcsecond: 'arcsec',
    arcseconds: 'arcsec',
    arcminute: 'arcmin',
    arcminutes: 'arcmin',

    BTUs: 'BTU',
    watts: 'watt',
    joules: 'joule',

    amperes: 'ampere',
    amps: 'ampere',
    amp: 'ampere',
    coulombs: 'coulomb',
    volts: 'volt',
    ohms: 'ohm',
    farads: 'farad',
    webers: 'weber',
    teslas: 'tesla',
    electronvolts: 'electronvolt',
    moles: 'mole',

    bit: 'bits',
    byte: 'bytes'
  }

  /**
   * Calculate the values for the angle units.
   * Value is calculated as number or BigNumber depending on the configuration
   * @param {{number: 'number' | 'BigNumber'}} config
   */
  function calculateAngleValues (config) {
    if (config.number === 'BigNumber') {
      const pi = createPi(BigNumber)
      UNITS.rad.value = new BigNumber(1)
      UNITS.deg.value = pi.div(180) // 2 * pi / 360
      UNITS.grad.value = pi.div(200) // 2 * pi / 400
      UNITS.cycle.value = pi.times(2) // 2 * pi
      UNITS.arcsec.value = pi.div(648000) // 2 * pi / 360 / 3600
      UNITS.arcmin.value = pi.div(10800) // 2 * pi / 360 / 60
    } else { // number
      UNITS.rad.value = 1
      UNITS.deg.value = Math.PI / 180 // 2 * pi / 360
      UNITS.grad.value = Math.PI / 200 // 2 * pi / 400
      UNITS.cycle.value = Math.PI * 2 // 2 * pi
      UNITS.arcsec.value = Math.PI / 648000 // 2 * pi / 360 / 3600
      UNITS.arcmin.value = Math.PI / 10800 // 2 * pi / 360 / 60
    }

    // copy to the full names of the angles
    UNITS.radian.value = UNITS.rad.value
    UNITS.degree.value = UNITS.deg.value
    UNITS.gradian.value = UNITS.grad.value
  }

  // apply the angle values now
  calculateAngleValues(config)

  if (on) {
    // recalculate the values on change of configuration
    on('config', function (curr, prev) {
      if (curr.number !== prev.number) {
        calculateAngleValues(curr)
      }
    })
  }

  /**
   * A unit system is a set of dimensionally independent base units plus a set of derived units, formed by multiplication and division of the base units, that are by convention used with the unit system.
   * A user perhaps could issue a command to select a preferred unit system, or use the default (see below).
   * Auto unit system: The default unit system is updated on the fly anytime a unit is parsed. The corresponding unit in the default unit system is updated, so that answers are given in the same units the user supplies.
   */
  const UNIT_SYSTEMS = {
    si: {
      // Base units
      NONE: { unit: UNIT_NONE, prefix: PREFIXES.NONE[''] },
      LENGTH: { unit: UNITS.m, prefix: PREFIXES.SHORT[''] },
      MASS: { unit: UNITS.g, prefix: PREFIXES.SHORT.k },
      TIME: { unit: UNITS.s, prefix: PREFIXES.SHORT[''] },
      CURRENT: { unit: UNITS.A, prefix: PREFIXES.SHORT[''] },
      TEMPERATURE: { unit: UNITS.K, prefix: PREFIXES.SHORT[''] },
      LUMINOUS_INTENSITY: { unit: UNITS.cd, prefix: PREFIXES.SHORT[''] },
      AMOUNT_OF_SUBSTANCE: { unit: UNITS.mol, prefix: PREFIXES.SHORT[''] },
      ANGLE: { unit: UNITS.rad, prefix: PREFIXES.SHORT[''] },
      BIT: { unit: UNITS.bits, prefix: PREFIXES.SHORT[''] },

      // Derived units
      FORCE: { unit: UNITS.N, prefix: PREFIXES.SHORT[''] },
      ENERGY: { unit: UNITS.J, prefix: PREFIXES.SHORT[''] },
      POWER: { unit: UNITS.W, prefix: PREFIXES.SHORT[''] },
      PRESSURE: { unit: UNITS.Pa, prefix: PREFIXES.SHORT[''] },
      ELECTRIC_CHARGE: { unit: UNITS.C, prefix: PREFIXES.SHORT[''] },
      ELECTRIC_CAPACITANCE: { unit: UNITS.F, prefix: PREFIXES.SHORT[''] },
      ELECTRIC_POTENTIAL: { unit: UNITS.V, prefix: PREFIXES.SHORT[''] },
      ELECTRIC_RESISTANCE: { unit: UNITS.ohm, prefix: PREFIXES.SHORT[''] },
      ELECTRIC_INDUCTANCE: { unit: UNITS.H, prefix: PREFIXES.SHORT[''] },
      ELECTRIC_CONDUCTANCE: { unit: UNITS.S, prefix: PREFIXES.SHORT[''] },
      MAGNETIC_FLUX: { unit: UNITS.Wb, prefix: PREFIXES.SHORT[''] },
      MAGNETIC_FLUX_DENSITY: { unit: UNITS.T, prefix: PREFIXES.SHORT[''] },
      FREQUENCY: { unit: UNITS.Hz, prefix: PREFIXES.SHORT[''] }
    }
  }

  // Clone to create the other unit systems
  UNIT_SYSTEMS.cgs = JSON.parse(JSON.stringify(UNIT_SYSTEMS.si))
  UNIT_SYSTEMS.cgs.LENGTH = { unit: UNITS.m, prefix: PREFIXES.SHORT.c }
  UNIT_SYSTEMS.cgs.MASS = { unit: UNITS.g, prefix: PREFIXES.SHORT[''] }
  UNIT_SYSTEMS.cgs.FORCE = { unit: UNITS.dyn, prefix: PREFIXES.SHORT[''] }
  UNIT_SYSTEMS.cgs.ENERGY = { unit: UNITS.erg, prefix: PREFIXES.NONE[''] }
  // there are wholly 4 unique cgs systems for electricity and magnetism,
  // so let's not worry about it unless somebody complains

  UNIT_SYSTEMS.us = JSON.parse(JSON.stringify(UNIT_SYSTEMS.si))
  UNIT_SYSTEMS.us.LENGTH = { unit: UNITS.ft, prefix: PREFIXES.NONE[''] }
  UNIT_SYSTEMS.us.MASS = { unit: UNITS.lbm, prefix: PREFIXES.NONE[''] }
  UNIT_SYSTEMS.us.TEMPERATURE = { unit: UNITS.degF, prefix: PREFIXES.NONE[''] }
  UNIT_SYSTEMS.us.FORCE = { unit: UNITS.lbf, prefix: PREFIXES.NONE[''] }
  UNIT_SYSTEMS.us.ENERGY = { unit: UNITS.BTU, prefix: PREFIXES.BTU[''] }
  UNIT_SYSTEMS.us.POWER = { unit: UNITS.hp, prefix: PREFIXES.NONE[''] }
  UNIT_SYSTEMS.us.PRESSURE = { unit: UNITS.psi, prefix: PREFIXES.NONE[''] }

  // Add additional unit systems here.

  // Choose a unit system to seed the auto unit system.
  UNIT_SYSTEMS.auto = JSON.parse(JSON.stringify(UNIT_SYSTEMS.si))

  // Set the current unit system
  let currentUnitSystem = UNIT_SYSTEMS.auto

  /**
   * Set a unit system for formatting derived units.
   * @memberof Unit
   * @param {string} [name] The name of the unit system.
   */
  Unit.setUnitSystem = function (name) {
    if (hasOwnProperty(UNIT_SYSTEMS, name)) {
      currentUnitSystem = UNIT_SYSTEMS[name]
    } else {
      throw new Error('Unit system ' + name + ' does not exist. Choices are: ' + Object.keys(UNIT_SYSTEMS).join(', '))
    }
  }

  /**
   * Return the current unit system.
   * @memberof Unit
   * @return {string} The current unit system.
   */
  Unit.getUnitSystem = function () {
    for (const key in UNIT_SYSTEMS) {
      if (hasOwnProperty(UNIT_SYSTEMS, key)) {
        if (UNIT_SYSTEMS[key] === currentUnitSystem) {
          return key
        }
      }
    }
  }

  /**
   * Converters to convert from number to an other numeric type like BigNumber
   * or Fraction
   */
  Unit.typeConverters = {
    BigNumber: function (x) {
      if (x?.isFraction) return new BigNumber(String(x.n)).div(String(x.d)).times(String(x.s))
      return new BigNumber(x + '') // stringify to prevent constructor error
    },

    Fraction: function (x) {
      return new Fraction(x)
    },

    Complex: function (x) {
      return x
    },

    number: function (x) {
      if (x?.isFraction) return number(x)
      return x
    }
  }

  /**
   * Retrieve the right converter function corresponding with this unit's
   * value
   *
   * @memberof Unit
   * @return {Function}
   */
  Unit.prototype._numberConverter = function () {
    const convert = Unit.typeConverters[this.valueType()]
    if (convert) {
      return convert
    }
    throw new TypeError('Unsupported Unit value type "' + this.valueType() + '"')
  }

  /**
   * Retrieve the right convertor function corresponding with the type
   * of provided exampleValue.
   *
   * @param {string} type   A string 'number', 'BigNumber', or 'Fraction'
   *                        In case of an unknown type,
   * @return {Function}
   */
  Unit._getNumberConverter = function (type) {
    if (!Unit.typeConverters[type]) {
      throw new TypeError('Unsupported type "' + type + '"')
    }

    return Unit.typeConverters[type]
  }

  // Add dimensions to each built-in unit
  for (const key in UNITS) {
    if (hasOwnProperty(UNITS, key)) {
      const unit = UNITS[key]
      unit.dimensions = unit.base.dimensions
    }
  }

  // Create aliases
  for (const name in ALIASES) {
    if (hasOwnProperty(ALIASES, name)) {
      const unit = UNITS[ALIASES[name]]
      const alias = {}
      for (const key in unit) {
        if (hasOwnProperty(unit, key)) {
          alias[key] = unit[key]
        }
      }
      alias.name = name
      UNITS[name] = alias
    }
  }

  /**
   * Checks if a character is a valid latin letter (upper or lower case).
   * Note that this function can be overridden, for example to allow support of other alphabets.
   * @memberof Unit
   * @param {string} c Tested character
   * @return {boolean} true if the character is a latin letter
   */
  Unit.isValidAlpha = function isValidAlpha (c) {
    return /^[a-zA-Z]$/.test(c)
  }

  function assertUnitNameIsValid (name) {
    for (let i = 0; i < name.length; i++) {
      c = name.charAt(i)

      if (i === 0 && !Unit.isValidAlpha(c)) { throw new Error('Invalid unit name (must begin with alpha character): "' + name + '"') }

      if (i > 0 && !(Unit.isValidAlpha(c) ||
        isDigit(c))) { throw new Error('Invalid unit name (only alphanumeric characters are allowed): "' + name + '"') }
    }
  }

  /**
   * Wrapper around createUnitSingle.
   * Example:
   *  createUnit( {
   *     foo: {
   *       prefixes: 'long',
   *       baseName: 'essence-of-foo'
   *     },
   *     bar: '40 foo',
   *     baz: {
   *       definition: '1 bar/hour',
   *       prefixes: 'long'
   *     }
   *   },
   *   {
   *     override: true
   *   })
   * @memberof Unit
   * @param {object} obj      Object map. Each key becomes a unit which is defined by its value.
   * @param {object} options
   * @return {Unit} the last created unit
   */
  Unit.createUnit = function (obj, options) {
    if (typeof (obj) !== 'object') {
      throw new TypeError("createUnit expects first parameter to be of type 'Object'")
    }

    // Remove all units and aliases we are overriding
    if (options && options.override) {
      for (const key in obj) {
        if (hasOwnProperty(obj, key)) {
          Unit.deleteUnit(key)
        }
        if (obj[key].aliases) {
          for (let i = 0; i < obj[key].aliases.length; i++) {
            Unit.deleteUnit(obj[key].aliases[i])
          }
        }
      }
    }

    // TODO: traverse multiple times until all units have been added
    let lastUnit
    for (const key in obj) {
      if (hasOwnProperty(obj, key)) {
        lastUnit = Unit.createUnitSingle(key, obj[key])
      }
    }
    return lastUnit
  }

  /**
   * Create a user-defined unit and register it with the Unit type.
   * Example:
   *  createUnitSingle('knot', '0.514444444 m/s')
   *
   * @memberof Unit
   * @param {string} name      The name of the new unit. Must be unique. Example: 'knot'
   * @param {string | Unit | object} definition      Definition of the unit in terms
   * of existing units. For example, '0.514444444 m / s'. Can be a Unit, a string,
   * or an Object. If an Object, may have the following properties:
   *   - definition {string | Unit} The definition of this unit.
   *   - prefixes {string} "none", "short", "long", "binary_short", or "binary_long".
   *     The default is "none".
   *   - aliases {Array} Array of strings. Example: ['knots', 'kt', 'kts']
   *   - offset {Numeric} An offset to apply when converting from the unit. For
   *     example, the offset for celsius is 273.15 and the offset for farhenheit
   *     is 459.67. Default is 0.
   *   - baseName {string} If the unit's dimension does not match that of any other
   *     base unit, the name of the newly create base unit. Otherwise, this property
   *     has no effect.
   *
   * @return {Unit}
   */
  Unit.createUnitSingle = function (name, obj) {
    if (typeof (obj) === 'undefined' || obj === null) {
      obj = {}
    }

    if (typeof (name) !== 'string') {
      throw new TypeError("createUnitSingle expects first parameter to be of type 'string'")
    }

    // Check collisions with existing units
    if (hasOwnProperty(UNITS, name)) {
      throw new Error('Cannot create unit "' + name + '": a unit with that name already exists')
    }

    // TODO: Validate name for collisions with other built-in functions (like abs or cos, for example), and for acceptable variable names. For example, '42' is probably not a valid unit. Nor is '%', since it is also an operator.

    assertUnitNameIsValid(name)

    let defUnit = null // The Unit from which the new unit will be created.
    let aliases = []
    let offset = 0
    let definition
    let prefixes
    let baseName
    if (obj && obj.type === 'Unit') {
      defUnit = obj.clone()
    } else if (typeof (obj) === 'string') {
      if (obj !== '') {
        definition = obj
      }
    } else if (typeof (obj) === 'object') {
      definition = obj.definition
      prefixes = obj.prefixes
      offset = obj.offset
      baseName = obj.baseName
      if (obj.aliases) {
        aliases = obj.aliases.valueOf() // aliases could be a Matrix, so convert to Array
      }
    } else {
      throw new TypeError('Cannot create unit "' + name + '" from "' + obj.toString() + '": expecting "string" or "Unit" or "Object"')
    }

    if (aliases) {
      for (let i = 0; i < aliases.length; i++) {
        if (hasOwnProperty(UNITS, aliases[i])) {
          throw new Error('Cannot create alias "' + aliases[i] + '": a unit with that name already exists')
        }
      }
    }

    if (definition && typeof (definition) === 'string' && !defUnit) {
      try {
        defUnit = Unit.parse(definition, { allowNoUnits: true })
      } catch (ex) {
        ex.message = 'Could not create unit "' + name + '" from "' + definition + '": ' + ex.message
        throw (ex)
      }
    } else if (definition && definition.type === 'Unit') {
      defUnit = definition.clone()
    }

    aliases = aliases || []
    offset = offset || 0
    if (prefixes && prefixes.toUpperCase) { prefixes = PREFIXES[prefixes.toUpperCase()] || PREFIXES.NONE } else { prefixes = PREFIXES.NONE }

    // If defUnit is null, it is because the user did not
    // specify a defintion. So create a new base dimension.
    let newUnit = {}
    if (!defUnit) {
      // Add a new base dimension
      baseName = baseName || name + '_STUFF' // foo --> foo_STUFF, or the essence of foo
      if (BASE_DIMENSIONS.indexOf(baseName) >= 0) {
        throw new Error('Cannot create new base unit "' + name + '": a base unit with that name already exists (and cannot be overridden)')
      }
      BASE_DIMENSIONS.push(baseName)

      // Push 0 onto existing base units
      for (const b in BASE_UNITS) {
        if (hasOwnProperty(BASE_UNITS, b)) {
          BASE_UNITS[b].dimensions[BASE_DIMENSIONS.length - 1] = 0
        }
      }

      // Add the new base unit
      const newBaseUnit = { dimensions: [] }
      for (let i = 0; i < BASE_DIMENSIONS.length; i++) {
        newBaseUnit.dimensions[i] = 0
      }
      newBaseUnit.dimensions[BASE_DIMENSIONS.length - 1] = 1
      newBaseUnit.key = baseName
      BASE_UNITS[baseName] = newBaseUnit

      newUnit = {
        name,
        value: 1,
        dimensions: BASE_UNITS[baseName].dimensions.slice(0),
        prefixes,
        offset,
        base: BASE_UNITS[baseName]
      }

      currentUnitSystem[baseName] = {
        unit: newUnit,
        prefix: PREFIXES.NONE['']
      }
    } else {
      newUnit = {
        name,
        value: defUnit.value,
        dimensions: defUnit.dimensions.slice(0),
        prefixes,
        offset
      }

      // Create a new base if no matching base exists
      let anyMatch = false
      for (const i in BASE_UNITS) {
        if (hasOwnProperty(BASE_UNITS, i)) {
          let match = true
          for (let j = 0; j < BASE_DIMENSIONS.length; j++) {
            if (Math.abs((newUnit.dimensions[j] || 0) - (BASE_UNITS[i].dimensions[j] || 0)) > 1e-12) {
              match = false
              break
            }
          }
          if (match) {
            anyMatch = true
            newUnit.base = BASE_UNITS[i]
            break
          }
        }
      }
      if (!anyMatch) {
        baseName = baseName || name + '_STUFF' // foo --> foo_STUFF, or the essence of foo
        // Add the new base unit
        const newBaseUnit = { dimensions: defUnit.dimensions.slice(0) }
        newBaseUnit.key = baseName
        BASE_UNITS[baseName] = newBaseUnit

        currentUnitSystem[baseName] = {
          unit: newUnit,
          prefix: PREFIXES.NONE['']
        }

        newUnit.base = BASE_UNITS[baseName]
      }
    }

    Unit.UNITS[name] = newUnit

    for (let i = 0; i < aliases.length; i++) {
      const aliasName = aliases[i]
      const alias = {}
      for (const key in newUnit) {
        if (hasOwnProperty(newUnit, key)) {
          alias[key] = newUnit[key]
        }
      }
      alias.name = aliasName
      Unit.UNITS[aliasName] = alias
    }

    // delete the memoization cache because we created a new unit
    delete _findUnit.cache

    return new Unit(null, name)
  }

  Unit.deleteUnit = function (name) {
    delete Unit.UNITS[name]

    // delete the memoization cache because we deleted a unit
    delete _findUnit.cache
  }

  // expose arrays with prefixes, dimensions, units, systems
  Unit.PREFIXES = PREFIXES
  Unit.BASE_DIMENSIONS = BASE_DIMENSIONS
  Unit.BASE_UNITS = BASE_UNITS
  Unit.UNIT_SYSTEMS = UNIT_SYSTEMS
  Unit.UNITS = UNITS

  return Unit
}, { isClass: true })
