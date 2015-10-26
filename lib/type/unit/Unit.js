'use strict';

var format = require('../../utils/number').format;
var endsWith = require('../../utils/string').endsWith;


function factory (type, config, load, typed) {

  /**
   * @constructor Unit
   *
   * A unit can be constructed in the following ways:
   *     var a = new Unit(value, name);
   *     var b = new Unit(null, name);
   *     var c = Unit.parse(str);
   *
   * Example usage:
   *     var a = new Unit(5, 'cm');               // 50 mm
   *     var b = Unit.parse('23 kg');             // 23 kg
   *     var c = math.in(a, new Unit(null, 'm');  // 0.05 m
   *     var d = new Unit(9.81, "m/s^2");         // 9.81 m/s^2
   *
   * @param {number} [value]  A value like 5.2
   * @param {string} [name]   A unit name like "cm" or "inch", or a derived unit of the form: "u1[^ex1] [u2[^ex2] ...] [/ u3[^ex3] [u4[^ex4]]]", such as "kg m^2/s^2", where each unit appearing after the forward slash is taken to be in the denominator. "kg m^2 s^-2" is a synonym and is also acceptable. Any of the units can include a prefix.
   */
  function Unit(value, name) {
    if (!(this instanceof Unit)) {
      throw new Error('Constructor must be called with the new operator');
    }

    if (value != undefined && typeof value !== 'number') {
      throw new TypeError('First parameter in Unit constructor must be a number');
    }
    if (name != undefined && (typeof name !== 'string' || name == '')) {
      throw new TypeError('Second parameter in Unit constructor must be a string');
    }

    if (name != undefined) {
      var u = Unit.parse(name);
      this.units = u.units;
      this.dimensions = u.dimensions;
    }
    else {
      this.units = [
        {
          unit: UNIT_NONE,
          prefix: PREFIX_NONE,  // link to a list with supported prefixes
          power: 0
        }
      ];
      this.dimensions = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    this.value = (value != undefined) ? this._normalize(value) : null;

    this.fixPrefix = false; // if true, function format will not search for the
                            // best prefix but leave it as initially provided.
                            // fixPrefix is set true by the method Unit.to

    // The justification behind this is that if the constructor is explicitly called,
    // the caller wishes the units to be returned exactly as he supplied.
    this.isUnitListSimplified = true;

  }

  /**
   * Attach type information
   */
  Unit.prototype.type = 'Unit';
  Unit.prototype.isUnit = true;

  // private variables and functions for the Unit parser
  var text, index, c;

  function skipWhitespace() {
    while (c == ' ' || c == '\t') {
      next();
    }
  }

  function isDigitDot(c) {
    return ((c >= '0' && c <= '9') || c == '.');
  }

  function isDigit(c) {
    return ((c >= '0' && c <= '9'));
  }

  function next() {
    index++;
    c = text.charAt(index);
  }

  function revert(oldIndex) {
    index = oldIndex;
    c = text.charAt(index);
  }

  function parseNumber() {
    var number = '';
    var oldIndex;
    oldIndex = index;

    if (c == '+') {
      next();
    }
    else if (c == '-') {
      number += c;
      next();
    }

    if (!isDigitDot(c)) {
      // a + or - must be followed by a digit
      revert(oldIndex);
      return null;
    }

    // get number, can have a single dot
    if (c == '.') {
      number += c;
      next();
      if (!isDigit(c)) {
        // this is no legal number, it is just a dot
        revert(oldIndex);
        return null;
      }
    }
    else {
      while (isDigit(c)) {
        number += c;
        next();
      }
      if (c == '.') {
        number += c;
        next();
      }
    }
    while (isDigit(c)) {
      number += c;
      next();
    }

    // check for exponential notation like "2.3e-4" or "1.23e50"
    if (c == 'E' || c == 'e') {
      // The grammar branches here. This could either be part of an exponent or the start of a unit that begins with the letter e, such as "4exabytes"

      var tentativeNumber = '';
      var tentativeIndex = index;

      tentativeNumber += c;
      next();

      if (c == '+' || c == '-') {
        tentativeNumber += c;
        next();
      }

      // Scientific notation MUST be followed by an exponent (otherwise we assume it is not scientific notation)
      if (!isDigit(c)) {
        // The e or E must belong to something else, so return the number without the e or E.
        revert(tentativeIndex);
        return number;
      }
      
      // We can now safely say that this is scientific notation.
      number = number + tentativeNumber;
      while (isDigit(c)) {
        number += c;
        next();
      }
    }

    return number;
  }

  function parseUnit() {
    var unitName = '';

    // Alphanumeric characters only; matches [a-zA-Z0-9]
    var code = text.charCodeAt(index);
    while ( (code >= 48 && code <= 57) ||
            (code >= 65 && code <= 90) ||
            (code >= 97 && code <= 122)) {
      unitName += c;
      next();
      code = text.charCodeAt(index);
    }

    // Must begin with [a-zA-Z]
    code = unitName.charCodeAt(0);
    if ((code >= 65 && code <= 90) ||
        (code >= 97 && code <= 122)) {
        return unitName || null;
    } 
    else {
      return null;
    }
  }

  function parseCharacter(toFind) {
    if (c === toFind) {
      next();
      return toFind;
    }
    else {
      return null;
    }
  }

  /**
   * Parse a string into a unit. Throws an exception if the provided string does not
   * contain a valid unit or cannot be parsed.
   * @param {string} str        A string like "5.2 inch", "4e2 cm/s^2"
   * @return {Unit} unit
   */
  Unit.parse = function (str) {
    text = str;
    index = -1;
    c = '';

    if (typeof text !== 'string') {
      throw new TypeError('Invalid argument in Unit.parse, string expected');
    }

    var unit = new Unit();
    unit.units = [];

    // A unit should follow this pattern:
    // [number]unit[^number] [unit[^number]]...[/unit[^number] [unit[^number]]]

    // Rules:
    // number is any floating point number.
    // unit is any alphanumeric string beginning with an alpha. Units with names like e3 should be avoided because they look like the exponent of a floating point number!
    // The string may optionally begin with a number.
    // Each unit may optionally be followed by ^number.
    // Whitespace or a forward slash is recommended between consecutive units, although the following technically is parseable:
    //   2m^2kg/s^2
    // it is not good form. If a unit starts with e, then it could be confused as a floating point number:
    //   4erg

    next();
    skipWhitespace();
    // Optional number at the start of the string
    var valueStr = parseNumber();
    var value = null;
    if(valueStr) {
      value = parseFloat(valueStr);
    }
    skipWhitespace();    // Whitespace is not required here

    // Next, we read any number of unit[^number]
    var powerMultiplierCurrent = 1;
    var expectingUnit = false;

    // Stack to keep track of powerMultipliers applied to each parentheses group
    var powerMultiplierStack = [];

    // Running product of all elements in powerMultiplierStack
    var powerMultiplierStackProduct = 1;

    while (true) {
      skipWhitespace();

      // Check for and consume opening parentheses, pushing powerMultiplierCurrent to the stack
      // A '(' will always appear directly before a unit.
      while (c === '(') {
        powerMultiplierStack.push(powerMultiplierCurrent);
        powerMultiplierStackProduct *= powerMultiplierCurrent;
        powerMultiplierCurrent = 1;
        next();
        skipWhitespace();
      }

      // Is there something here?
      if(c) {
        var oldC = c;
        var uStr = parseUnit();
        if(uStr == null) {
          throw new SyntaxError('Unexpected "' + oldC + '" in "' + text + '" at index ' + index.toString());
        }
      }
      else {
        // End of input.
        break;
      }

      // Verify the unit exists and get the prefix (if any)
      var res = _findUnit(uStr);
      if(res == null) {
        // Unit not found.
        throw new SyntaxError('Unit "' + uStr + '" not found.');
      }

      var power = powerMultiplierCurrent * powerMultiplierStackProduct;
      // Is there a "^ number"?
      skipWhitespace();
      if (parseCharacter('^')) {
        skipWhitespace();
        var p = parseNumber();
        if(p == null) {
          // No valid number found for the power!
          throw new SyntaxError('In "' + str + '", "^" must be followed by a floating-point number');
        }
        power *= p;
      }

      // Add the unit to the list
      unit.units.push( {
        unit: res.unit,
        prefix: res.prefix,
        power: power
      });
      for(var i=0; i<BASE_DIMENSIONS.length; i++) {
        unit.dimensions[i] += res.unit.dimensions[i] * power;
      }

      // Check for and consume closing parentheses, popping from the stack.
      // A ')' will always follow a unit.
      skipWhitespace();
      while (c === ')') {
        if(powerMultiplierStack.length === 0) {
          throw new SyntaxError('Unmatched ")" in "' + text + '" at index ' + index.toString());
        }
        powerMultiplierStackProduct /= powerMultiplierStack.pop();
        next();
        skipWhitespace();
      }

      // "*" and "/" should mean we are expecting something to come next.
      // Is there a forward slash? If so, negate powerMultiplierCurrent. The next unit or paren group is in the denominator.
      expectingUnit = false;

      if (parseCharacter('*')) {
        // explicit multiplication
        powerMultiplierCurrent = 1;
        expectingUnit = true;
      }
      else if (parseCharacter('/')) {
        // division
        powerMultiplierCurrent = -1;
        expectingUnit = true;
      }
      else {
        // implicit multiplication
        powerMultiplierCurrent = 1;
      }

      // Replace the unit into the auto unit system
      var baseDim = res.unit.base.key;
      UNIT_SYSTEMS.auto[baseDim] = {
        unit: res.unit,
        prefix: res.prefix
      };
    }
    
    // Has the string been entirely consumed?
    skipWhitespace();
    if(c) {
      throw new SyntaxError('Could not parse: "' + str + '"');
    }

    // Is there a trailing slash?
    if(expectingUnit) {
      throw new SyntaxError('Trailing characters: "' + str + '"');
    }

    // Is the parentheses stack empty?
    if(powerMultiplierStack.length !== 0) {
      throw new SyntaxError('Unmatched "(" in "' + text + '"');
    }

    // Are there any units at all?
    if(unit.units.length == 0) {
      throw new SyntaxError('"' + str + '" contains no units');
    }

    unit.value = (value != undefined) ? unit._normalize(value) : null;
    return unit;
  };

  /**
   * create a copy of this unit
   * @return {Unit} clone
   */
  Unit.prototype.clone = function () {
    var clone = new Unit();

    for (var p in this) {
      if (this.hasOwnProperty(p)) {
        clone[p] = this[p];
      }
    }

    clone.dimensions = this.dimensions.slice(0);
    clone.units = [];
    for(var i=0; i<this.units.length; i++) {
      clone.units[i] = { };
      for (var p in this.units[i]) {
        if (this.units[i].hasOwnProperty(p)) {
          clone.units[i][p] = this.units[i][p];
        }
      }
    }

    return clone;
  };

  /**
   * Return whether the unit is derived (such as m/s, or cm^2, but not N)
   * @return {boolean} True if the unit is derived
   */
  Unit.prototype._isDerived = function() {
    if(this.units.length === 0) {
      return false;
    }
    return this.units.length > 1 || Math.abs(this.units[0].power - 1.0) > 1e-15;
  }

  /**
   * Normalize a value, based on its currently set unit(s)
   * @param {number} value
   * @return {number} normalized value
   * @private
   */
  Unit.prototype._normalize = function (value) {
    if (this.units.length === 0) {
      return value;
    }
    else if (this._isDerived()) {
      // This is a derived unit, so do not apply offsets.
      // For example, with J kg^-1 degC^-1 you would NOT want to apply the offset.
      var res = value;
      for(var i=0; i < this.units.length; i++) {
        res = res * Math.pow(this.units[i].unit.value * this.units[i].prefix.value, this.units[i].power);
      }
      return res;
    }
    else {
      // This is a single unit of power 1, like kg or degC
      return (value + this.units[0].unit.offset) * this.units[0].unit.value * this.units[0].prefix.value;
    }
  };

  /**
   * Denormalize a value, based on its currently set unit(s)
   * @param {number} value
   * @param {number} [prefixValue]    Optional prefix value to be used (ignored if this is a derived unit)
   * @return {number} denormalized value
   * @private
   */
  Unit.prototype._denormalize = function (value, prefixValue) {
    if (this.units.length === 0) {
      return value;
    }
    else if (this._isDerived()) {
      // This is a derived unit, so do not apply offsets.
      // For example, with J kg^-1 degC^-1 you would NOT want to apply the offset.
      // Also, prefixValue is ignored--but we will still use the prefix value stored in each unit, since kg is usually preferrable to g unless the user decides otherwise.
      var res = value;
      for(var i=0; i<this.units.length; i++) {
        res = res / Math.pow(this.units[i].unit.value * this.units[i].prefix.value, this.units[i].power);
      }
      return res;
    }
    else {
      // This is a single unit of power 1, like kg or degC
      if (prefixValue == undefined) {
        return value / this.units[0].unit.value / this.units[0].prefix.value - this.units[0].unit.offset;
      }
      else {
        return value / this.units[0].unit.value / prefixValue - this.units[0].unit.offset;
      }
    }
  };

  /**
   * Find a unit from a string
   * @param {string} str              A string like 'cm' or 'inch'
   * @returns {Object | null} result  When found, an object with fields unit and
   *                                  prefix is returned. Else, null is returned.
   * @private
   */
  function _findUnit(str) {
    for (var name in UNITS) {
      if (UNITS.hasOwnProperty(name)) {
        if (endsWith(str, name)) {
          var unit = UNITS[name];
          var prefixLen = (str.length - name.length);
          var prefixName = str.substring(0, prefixLen);
          var prefix = unit.prefixes[prefixName];
          if (prefix !== undefined) {
            // store unit, prefix, and value
            return {
              unit: unit,
              prefix: prefix
            };
          }
        }
      }
    }

    return null;
  }

  /**
   * Test if the given expression is a unit.
   * The unit can have a prefix but cannot have a value.
   * @param {string} name   A string to be tested whether it is a value less unit.
   *                        The unit can have prefix, like "cm"
   * @return {boolean}      true if the given string is a unit
   */
  Unit.isValuelessUnit = function (name) {
    return (_findUnit(name) != null);
  };

  /**
   * check if this unit has given base unit
   * If this unit is a derived unit, this will ALWAYS return false, since by definition base units are not derived.
   * @param {BASE_UNITS | undefined} base
   */
  Unit.prototype.hasBase = function (base) {

    // All dimensions must be the same
    for(var i=0; i<BASE_DIMENSIONS.length; i++) {
      if (Math.abs(this.dimensions[i] - base.dimensions[i]) > 1e-12) {
        return false;
      }
    }
    return true;

  };

  /**
   * Check if this unit has a base or bases equal to another base or bases
   * For derived units, the exponent on each base also must match
   * @param {Unit} other
   * @return {boolean} true if equal base
   */
  Unit.prototype.equalBase = function (other) {
    // All dimensions must be the same
    for(var i=0; i<BASE_DIMENSIONS.length; i++) {
      if (Math.abs(this.dimensions[i] - other.dimensions[i]) > 1e-12) {
        return false;
      }
    }
    return true;
  };

  /**
   * Check if this unit equals another unit
   * @param {Unit} other
   * @return {boolean} true if both units are equal
   */
  Unit.prototype.equals = function (other) {
    return (this.equalBase(other) && this.value == other.value);
  };

  /**
   * Multiply this unit with another one
   * @param {Unit} other
   * @return {Unit} product of this unit and the other unit
   */
  Unit.prototype.multiply = function (other) {

    var res = this.clone();
    
    for(var i=0; i<BASE_DIMENSIONS.length; i++) {
      res.dimensions[i] = this.dimensions[i] + other.dimensions[i];
    }

    // Append other's units list onto res (simplify later in Unit.prototype.format)
    for(var i=0; i<other.units.length; i++) {
      var inverted = JSON.parse(JSON.stringify(other.units[i])); 
      res.units.push(inverted);
    }

    // If at least one operand has a value, then the result should also have a value
    if(this.value != null || other.value != null) {
      var valThis = this.value == null ? this._normalize(1) : this.value;
      var valOther = other.value == null ? other._normalize(1) : other.value;
      res.value = valThis * valOther;
    }
    else {
      res.value = null;
    }

    // Trigger simplification of the unit list at some future time
    res.isUnitListSimplified = false;
    return res;
  }

  /**
   * Divide this unit by another one
   * @param {Unit} other
   * @return {Unit} result of dividing this unit by the other unit
   */
  Unit.prototype.divide = function (other) {
    var res = this.clone();
    
    for(var i=0; i<BASE_DIMENSIONS.length; i++) {
      res.dimensions[i] = this.dimensions[i] - other.dimensions[i];
    }

    // Invert and append other's units list onto res (simplify later in Unit.prototype.format)
    for(var i=0; i<other.units.length; i++) {
      // Clone other's unit
      var inverted = JSON.parse(JSON.stringify(other.units[i])); 
      inverted.power = -inverted.power;
      res.units.push(inverted);
    }

    // If at least one operand has a value, the result should have a value
    if (this.value != null || other.value != null) {
      var valThis = this.value == null ? this._normalize(1) : this.value;
      var valOther = other.value == null ? other._normalize(1) : other.value;
      res.value = valThis / valOther;
    }
    else {
      res.value = null;
    }

    // Trigger simplification of the unit list at some future time
    res.isUnitListSimplified = false;
    return res;
  };

  /**
   * Calculate the power of a unit
   * @param {number} p    Any real number
   * @returns {Unit}      The result: this^p
   */
  Unit.prototype.pow = function (p) {
    var res = this.clone();
    
    for(var i=0; i<BASE_DIMENSIONS.length; i++) {
      res.dimensions[i] = this.dimensions[i] * p;
    }

    // Adjust the power of each unit in the list
    for(var i=0; i<res.units.length; i++) {
      res.units[i].power *= p;
    }

    if(res.value != null) {
      res.value = Math.pow(res.value, p);
    }
    else {
      res.value = null;
    }

    // Trigger lazy evaluation of the unit list
    res.isUnitListSimplified = false;
    return res;
  };


  /**
   * Create a clone of this unit with a representation
   * @param {string | Unit} valuelessUnit   A unit without value. Can have prefix, like "cm"
   * @returns {Unit} unit having fixed, specified unit
   */
  Unit.prototype.to = function (valuelessUnit) {
    
    var other;
    var value = this.value == null ? this._normalize(1) : this.value;
    if (typeof valuelessUnit === 'string') {
      //other = new Unit(null, valuelessUnit);
      other = Unit.parse(valuelessUnit);
      if (!this.equalBase(other)) {
        throw new Error('Units do not match');
      }
      if (other.value !== null) {
        throw new Error('Cannot convert to a unit with a value');
      }

      other.value = value;
      other.fixPrefix = true;
      other.isUnitListSimplified = true;
      return other;
    }
    else if (valuelessUnit && valuelessUnit.isUnit) {
      if (!this.equalBase(valuelessUnit)) {
        throw new Error('Units do not match');
      }
      if (valuelessUnit.value !== null) {
        throw new Error('Cannot convert to a unit with a value');
      }
      other = valuelessUnit.clone();
      other.value = value;
      other.fixPrefix = true;
      other.isUnitListSimplified = true;
      return other;
    }
    else {
      throw new Error('String or Unit expected as parameter');
    }
  };

  /**
   * Return the value of the unit when represented with given valueless unit
   * @param {string | Unit} valuelessUnit    For example 'cm' or 'inch'
   * @return {number} value
   */
  Unit.prototype.toNumber = function (valuelessUnit) {
    var other = this.to(valuelessUnit);
    if(other._isDerived()) {
      return other._denormalize(other.value);    
    }
    else {
      return other._denormalize(other.value, other.units[0].prefix.value);
    }
  };


  /**
   * Get a string representation of the unit.
   * @return {string}
   */
  Unit.prototype.toString = function () {
    return this.format();
  };

  /**
   * Get a JSON representation of the unit
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "Unit", "value": 2, "unit": "cm", "fixPrefix": false}`
   */
  Unit.prototype.toJSON = function () {
    return {
      mathjs: 'Unit',
      value: this._denormalize(this.value),
      unit: this.formatUnits(),
      fixPrefix: this.fixPrefix
    };
  };

  /**
   * Instantiate a Unit from a JSON object
   * @param {Object} json  A JSON object structured as:
   *                       `{"mathjs": "Unit", "value": 2, "unit": "cm", "fixPrefix": false}`
   * @return {Unit}
   */
  Unit.fromJSON = function (json) {
    var unit = new Unit(json.value, json.unit);
    unit.fixPrefix = json.fixPrefix || false;
    return unit;
  };

  /**
   * Returns the string representation of the unit.
   * @return {string}
   */
  Unit.prototype.valueOf = Unit.prototype.toString;

  /**
   * Attempt to simplify the list of units for this unit according to the dimensions array and the current unit system. After the call, this Unit will contain a list of the "best" units for formatting.
   * Intended to be evaluated lazily. You must set isUnitListSimplified = false before the call! After the call, isUnitListSimplified will be set to true.
   */
  Unit.prototype.simplifyUnitListLazy = function() {

    if (this.isUnitListSimplified || this.value == null) {
      return;
    }

    var proposedUnitList = [];

    // Search for a matching base
    var matchingBase;
    for(var key in currentUnitSystem) {
      if(this.hasBase(BASE_UNITS[key])) {
        matchingBase = key;
        break;
      }
    }

    if(matchingBase === 'NONE')
    {
      this.units = [];
    }
    else {
      var matchingUnit;
      if(matchingBase) {
        // Does the unit system have a matching unit?
        if(currentUnitSystem.hasOwnProperty(matchingBase)) {
          matchingUnit = currentUnitSystem[matchingBase]
        }
      }

      var value;
      var str;
      if(matchingUnit) {
        this.units = [{
          unit: matchingUnit.unit,
          prefix: matchingUnit.prefix,
          power: 1.0,
        }];
      }
      else {
        // Multiple units or units with powers are formatted like this:
        // 5 (kg m^2) / (s^3 mol)
        // Build an representation from the base units of the current unit system
        for(var i=0; i<BASE_DIMENSIONS.length; i++) {
          var baseDim = BASE_DIMENSIONS[i];
          if(Math.abs(this.dimensions[i]) > 1e-12) {
            proposedUnitList.push({
              unit: currentUnitSystem[baseDim].unit,
              prefix: currentUnitSystem[baseDim].prefix,
              power: this.dimensions[i]
            });
          }
        }

        // Is the proposed unit list "simpler" than the existing one?
        if(proposedUnitList.length < this.units.length) {
          // Replace this unit list with the proposed list
          this.units = proposedUnitList;
        }
      }
    }

    this.isUnitListSimplified = true;
    return;
  }

  /**
   * Get a string representation of the units of this Unit, without the value.
   * @return {string}
   */
  Unit.prototype.formatUnits = function () {

    // Lazy evaluation of the unit list
    this.simplifyUnitListLazy();

    var strNum = "";
    var strDen = "";
    var nNum = 0;
    var nDen = 0;

    for(var i=0; i<this.units.length; i++) {
      if(this.units[i].power > 0) {
        nNum++;
        strNum += " " + this.units[i].prefix.name + this.units[i].unit.name;
        if(Math.abs(this.units[i].power - 1.0) > 1e-15) {
          strNum += "^" + this.units[i].power;
        }
      }
      else if(this.units[i].power < 0) {
        nDen++;
      }
    }

    if(nDen > 0) {
      for(var i=0; i<this.units.length; i++) {
        if(this.units[i].power < 0) {
          if(nNum > 0) {
            strDen += " " + this.units[i].prefix.name + this.units[i].unit.name;
            if(Math.abs(this.units[i].power + 1.0) > 1e-15) {
              strDen += "^" + (-this.units[i].power);
            }
          }
          else {
            strDen += " " + this.units[i].prefix.name + this.units[i].unit.name;
            strDen += "^" + (this.units[i].power);
          }
        }
      }
    }
    // Remove leading " "
    strNum = strNum.substr(1);
    strDen = strDen.substr(1);

    // Add parans for better copy/paste back into the eval, for example, or for better pretty print formatting
    if(nNum > 1 && nDen > 0) {
      strNum = "(" + strNum + ")";
    }
    if(nDen > 1 && nNum > 0) {
      strDen = "(" + strDen + ")";
    }

    var str = strNum;
    if(nNum > 0 && nDen > 0) {
      str += " / ";
    }
    str += strDen;

    return str;
  };

  /**
   * Get a string representation of the Unit, with optional formatting options.
   * @param {Object | number | Function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @return {string}
   */
  Unit.prototype.format = function (options) {

    // Simplfy the unit list, if necessary
    this.simplifyUnitListLazy();

    // Now apply the best prefix
    // Units must have only one unit and not have the fixPrefix flag set
    if (this.units.length === 1 && !this.fixPrefix) {
      // Units must have integer powers, otherwise the prefix will change the
      // outputted value by not-an-integer-power-of-ten
      if (Math.abs(this.units[0].power - Math.round(this.units[0].power)) < 1e-14) {
        // Apply the prefix
        var bestPrefix = this._bestPrefix();
        this.units[0].prefix = bestPrefix;
      }
    }

    var value = this._denormalize(this.value);
    var str = (this.value !== null) ? (format(value, options)) : '';
    var unitStr = this.formatUnits();
    if(unitStr.length > 0 && str.length > 0) {
      str += " ";
    }
    str += unitStr;

    return str;

/*
    var value,
        str;
    if (this._isDerived()) {
      value = this._denormalize(this.value);
      str = (this.value !== null) ? (format(value, options)) : '';
      var unitStr = this.formatUnits();
      if(unitStr.length > 0 && str.length > 0) {
        str += " ";
      }
      str += unitStr;
    }
    else if (this.units.length === 1) {
      if (this.value !== null && !this.fixPrefix) {
        var bestPrefix = this._bestPrefix();
        value = this._denormalize(this.value, bestPrefix.value);
        str = format(value, options) + ' ';
        str += bestPrefix.name + this.units[0].unit.name;
      }
      else {
        value = this._denormalize(this.value);
        str = (this.value !== null) ? (format(value, options) + ' ') : '';
        str += this.units[0].prefix.name + this.units[0].unit.name;
      }
    }
    else if (this.units.length === 0) {
      str = format(this.value, options);
    }


    return str;
    */
  };

  /**
   * Calculate the best prefix using current value.
   * @returns {Object} prefix
   * @private
   */
  Unit.prototype._bestPrefix = function () {
    if (this.units.length !== 1) {
      throw new Error("Can only compute the best prefix for single units with integer powers, like kg, s^2, N^-1, and so forth!");
    }
    if (Math.abs(this.units[0].power - Math.round(this.units[0].power)) >= 1e-14) {
      throw new Error("Can only compute the best prefix for single units with integer powers, like kg, s^2, N^-1, and so forth!");
    }

    // find the best prefix value (resulting in the value of which
    // the absolute value of the log10 is closest to zero,
    // though with a little offset of 1.2 for nicer values: you get a
    // sequence 1mm 100mm 500mm 0.6m 1m 10m 100m 500m 0.6km 1km ...

    var absValue = Math.abs(this.value); // / this.units[0].unit.value);
    var bestPrefix = this.units[0].prefix;
    if (absValue === 0) {
      return bestPrefix;
    }
    var power = this.units[0].power;
    var bestDiff = Math.abs(
        Math.log(absValue / Math.pow(bestPrefix.value * this.units[0].unit.value, power)) / Math.LN10 - 1.2);

    var prefixes = this.units[0].unit.prefixes;
    for (var p in prefixes) {
      if (prefixes.hasOwnProperty(p)) {
        var prefix = prefixes[p];
        if (prefix.scientific) {

          var diff = Math.abs(
              Math.log(absValue / Math.pow(prefix.value * this.units[0].unit.value, power)) / Math.LN10 - 1.2);

          if (diff < bestDiff
              || (diff === bestDiff && prefix.name.length < bestPrefix.name.length)) {
                // choose the prefix with the smallest diff, or if equal, choose the one
                // with the shortest name (can happen with SHORTLONG for example)
                bestPrefix = prefix;
                bestDiff = diff;
          }
        }
      }
    }

    return bestPrefix;
  };

  var PREFIXES = {
    NONE: {
      '': {name: '', value: 1, scientific: true}
    },
    SHORT: {
      '': {name: '', value: 1, scientific: true},

      'da': {name: 'da', value: 1e1, scientific: false},
      'h': {name: 'h', value: 1e2, scientific: false},
      'k': {name: 'k', value: 1e3, scientific: true},
      'M': {name: 'M', value: 1e6, scientific: true},
      'G': {name: 'G', value: 1e9, scientific: true},
      'T': {name: 'T', value: 1e12, scientific: true},
      'P': {name: 'P', value: 1e15, scientific: true},
      'E': {name: 'E', value: 1e18, scientific: true},
      'Z': {name: 'Z', value: 1e21, scientific: true},
      'Y': {name: 'Y', value: 1e24, scientific: true},

      'd': {name: 'd', value: 1e-1, scientific: false},
      'c': {name: 'c', value: 1e-2, scientific: false},
      'm': {name: 'm', value: 1e-3, scientific: true},
      'u': {name: 'u', value: 1e-6, scientific: true},
      'n': {name: 'n', value: 1e-9, scientific: true},
      'p': {name: 'p', value: 1e-12, scientific: true},
      'f': {name: 'f', value: 1e-15, scientific: true},
      'a': {name: 'a', value: 1e-18, scientific: true},
      'z': {name: 'z', value: 1e-21, scientific: true},
      'y': {name: 'y', value: 1e-24, scientific: true}
    },
    LONG: {
      '': {name: '', value: 1, scientific: true},

      'deca': {name: 'deca', value: 1e1, scientific: false},
      'hecto': {name: 'hecto', value: 1e2, scientific: false},
      'kilo': {name: 'kilo', value: 1e3, scientific: true},
      'mega': {name: 'mega', value: 1e6, scientific: true},
      'giga': {name: 'giga', value: 1e9, scientific: true},
      'tera': {name: 'tera', value: 1e12, scientific: true},
      'peta': {name: 'peta', value: 1e15, scientific: true},
      'exa': {name: 'exa', value: 1e18, scientific: true},
      'zetta': {name: 'zetta', value: 1e21, scientific: true},
      'yotta': {name: 'yotta', value: 1e24, scientific: true},

      'deci': {name: 'deci', value: 1e-1, scientific: false},
      'centi': {name: 'centi', value: 1e-2, scientific: false},
      'milli': {name: 'milli', value: 1e-3, scientific: true},
      'micro': {name: 'micro', value: 1e-6, scientific: true},
      'nano': {name: 'nano', value: 1e-9, scientific: true},
      'pico': {name: 'pico', value: 1e-12, scientific: true},
      'femto': {name: 'femto', value: 1e-15, scientific: true},
      'atto': {name: 'atto', value: 1e-18, scientific: true},
      'zepto': {name: 'zepto', value: 1e-21, scientific: true},
      'yocto': {name: 'yocto', value: 1e-24, scientific: true}
    },
    SQUARED: {
      '': {name: '', value: 1, scientific: true},

      'da': {name: 'da', value: 1e2, scientific: false},
      'h': {name: 'h', value: 1e4, scientific: false},
      'k': {name: 'k', value: 1e6, scientific: true},
      'M': {name: 'M', value: 1e12, scientific: true},
      'G': {name: 'G', value: 1e18, scientific: true},
      'T': {name: 'T', value: 1e24, scientific: true},
      'P': {name: 'P', value: 1e30, scientific: true},
      'E': {name: 'E', value: 1e36, scientific: true},
      'Z': {name: 'Z', value: 1e42, scientific: true},
      'Y': {name: 'Y', value: 1e48, scientific: true},

      'd': {name: 'd', value: 1e-2, scientific: false},
      'c': {name: 'c', value: 1e-4, scientific: false},
      'm': {name: 'm', value: 1e-6, scientific: true},
      'u': {name: 'u', value: 1e-12, scientific: true},
      'n': {name: 'n', value: 1e-18, scientific: true},
      'p': {name: 'p', value: 1e-24, scientific: true},
      'f': {name: 'f', value: 1e-30, scientific: true},
      'a': {name: 'a', value: 1e-36, scientific: true},
      'z': {name: 'z', value: 1e-42, scientific: true},
      'y': {name: 'y', value: 1e-48, scientific: true}
    },
    CUBIC: {
      '': {name: '', value: 1, scientific: true},

      'da': {name: 'da', value: 1e3, scientific: false},
      'h': {name: 'h', value: 1e6, scientific: false},
      'k': {name: 'k', value: 1e9, scientific: true},
      'M': {name: 'M', value: 1e18, scientific: true},
      'G': {name: 'G', value: 1e27, scientific: true},
      'T': {name: 'T', value: 1e36, scientific: true},
      'P': {name: 'P', value: 1e45, scientific: true},
      'E': {name: 'E', value: 1e54, scientific: true},
      'Z': {name: 'Z', value: 1e63, scientific: true},
      'Y': {name: 'Y', value: 1e72, scientific: true},

      'd': {name: 'd', value: 1e-3, scientific: false},
      'c': {name: 'c', value: 1e-6, scientific: false},
      'm': {name: 'm', value: 1e-9, scientific: true},
      'u': {name: 'u', value: 1e-18, scientific: true},
      'n': {name: 'n', value: 1e-27, scientific: true},
      'p': {name: 'p', value: 1e-36, scientific: true},
      'f': {name: 'f', value: 1e-45, scientific: true},
      'a': {name: 'a', value: 1e-54, scientific: true},
      'z': {name: 'z', value: 1e-63, scientific: true},
      'y': {name: 'y', value: 1e-72, scientific: true}
    },
    BINARY_SHORT: {
      '': {name: '', value: 1, scientific: true},
      'k': {name: 'k', value: 1e3, scientific: true},
      'M': {name: 'M', value: 1e6, scientific: true},
      'G': {name: 'G', value: 1e9, scientific: true},
      'T': {name: 'T', value: 1e12, scientific: true},
      'P': {name: 'P', value: 1e15, scientific: true},
      'E': {name: 'E', value: 1e18, scientific: true},
      'Z': {name: 'Z', value: 1e21, scientific: true},
      'Y': {name: 'Y', value: 1e24, scientific: true},

      'Ki': {name: 'Ki', value: 1024, scientific: true},
      'Mi': {name: 'Mi', value: Math.pow(1024, 2), scientific: true},
      'Gi': {name: 'Gi', value: Math.pow(1024, 3), scientific: true},
      'Ti': {name: 'Ti', value: Math.pow(1024, 4), scientific: true},
      'Pi': {name: 'Pi', value: Math.pow(1024, 5), scientific: true},
      'Ei': {name: 'Ei', value: Math.pow(1024, 6), scientific: true},
      'Zi': {name: 'Zi', value: Math.pow(1024, 7), scientific: true},
      'Yi': {name: 'Yi', value: Math.pow(1024, 8), scientific: true}
    },
    BINARY_LONG: {
      '': {name: '', value: 1, scientific: true},
      'kilo': {name: 'kilo', value: 1e3, scientific: true},
      'mega': {name: 'mega', value: 1e6, scientific: true},
      'giga': {name: 'giga', value: 1e9, scientific: true},
      'tera': {name: 'tera', value: 1e12, scientific: true},
      'peta': {name: 'peta', value: 1e15, scientific: true},
      'exa': {name: 'exa', value: 1e18, scientific: true},
      'zetta': {name: 'zetta', value: 1e21, scientific: true},
      'yotta': {name: 'yotta', value: 1e24, scientific: true},

      'kibi': {name: 'kibi', value: 1024, scientific: true},
      'mebi': {name: 'mebi', value: Math.pow(1024, 2), scientific: true},
      'gibi': {name: 'gibi', value: Math.pow(1024, 3), scientific: true},
      'tebi': {name: 'tebi', value: Math.pow(1024, 4), scientific: true},
      'pebi': {name: 'pebi', value: Math.pow(1024, 5), scientific: true},
      'exi': {name: 'exi', value: Math.pow(1024, 6), scientific: true},
      'zebi': {name: 'zebi', value: Math.pow(1024, 7), scientific: true},
      'yobi': {name: 'yobi', value: Math.pow(1024, 8), scientific: true}
    },
    BTU: {
      '':   {name: '',   value: 1,   scientific: true},
      'MM': {name: 'MM', value: 1e6, scientific: true}
    }
  };

  // Add a prefix list for both short and long prefixes (for ohm in particular, since Mohm and megaohm are both acceptable):
  PREFIXES.SHORTLONG = {};
  for (var key in PREFIXES.SHORT) {
    if(PREFIXES.SHORT.hasOwnProperty(key)) {
      PREFIXES.SHORTLONG[key] = PREFIXES.SHORT[key];
    }
  }
  for (var key in PREFIXES.LONG) {
    if(PREFIXES.LONG.hasOwnProperty(key)) {
      PREFIXES.SHORTLONG[key] = PREFIXES.LONG[key];
    }
  }

  var PREFIX_NONE = {name: '', value: 1, scientific: true};

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

  var BASE_DIMENSIONS = ["MASS", "LENGTH", "TIME", "CURRENT", "TEMPERATURE", "LUMINOUS_INTENSITY", "AMOUNT_OF_SUBSTANCE", "ANGLE", "BIT"];

  var BASE_UNITS = {
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


    ANGLE: {
      dimensions: [0, 0, 0, 0, 0, 0, 0, 1, 0]
    },
    BIT: {
      dimensions: [0, 0, 0, 0, 0, 0, 0, 0, 1]
    }
  };

  for(var key in BASE_UNITS) {
    BASE_UNITS[key].key = key;
  }

  var BASE_UNIT_NONE = {};

  var UNIT_NONE = {name: '', base: BASE_UNIT_NONE, value: 1, offset: 0, dimensions: [0,0,0,0,0,0,0,0,0]};

  var UNITS = {
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
      value: 5.029210,
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
    'in': {
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
    //{name: 'cup', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.000240, offset: 0}, // 240 mL  // not possible, we have already another cup
    drop: {
      name: 'drop',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 5e-8,
      offset: 0
    },  // 0.05 mL = 5e-8 m3
    gtt: {
      name: 'gtt',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 5e-8,
      offset: 0
    },  // 0.05 mL = 5e-8 m3

    // Liquid volume
    minim: {
      name: 'minim',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.00000006161152,
      offset: 0
    }, // 0.06161152 mL
    fluiddram: {
      name: 'fluiddram',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0000036966911,
      offset: 0
    },  // 3.696691 mL
    fluidounce: {
      name: 'fluidounce',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.00002957353,
      offset: 0
    }, // 29.57353 mL
    gill: {
      name: 'gill',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0001182941,
      offset: 0
    }, // 118.2941 mL
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
      value: 0.0002365882,
      offset: 0
    }, // 236.5882 mL
    pint: {
      name: 'pint',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0004731765,
      offset: 0
    }, // 473.1765 mL
    quart: {
      name: 'quart',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0009463529,
      offset: 0
    }, // 946.3529 mL
    gallon: {
      name: 'gallon',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.003785412,
      offset: 0
    }, // 3.785412 L
    beerbarrel: {
      name: 'beerbarrel',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.1173478,
      offset: 0
    }, // 117.3478 L
    oilbarrel: {
      name: 'oilbarrel',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.1589873,
      offset: 0
    }, // 158.9873 L
    hogshead: {
      name: 'hogshead',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.2384810,
      offset: 0
    }, // 238.4810 L

    //{name: 'min', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.00000006161152, offset: 0}, // 0.06161152 mL // min is already in use as minute
    fldr: {
      name: 'fldr',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0000036966911,
      offset: 0
    },  // 3.696691 mL
    floz: {
      name: 'floz',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.00002957353,
      offset: 0
    }, // 29.57353 mL
    gi: {
      name: 'gi',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0001182941,
      offset: 0
    }, // 118.2941 mL
    cp: {
      name: 'cp',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0002365882,
      offset: 0
    }, // 236.5882 mL
    pt: {
      name: 'pt',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0004731765,
      offset: 0
    }, // 473.1765 mL
    qt: {
      name: 'qt',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0009463529,
      offset: 0
    }, // 946.3529 mL
    gal: {
      name: 'gal',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.003785412,
      offset: 0
    }, // 3.785412 L
    bbl: {
      name: 'bbl',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.1173478,
      offset: 0
    }, // 117.3478 L
    obl: {
      name: 'obl',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.1589873,
      offset: 0
    }, // 158.9873 L
    //{name: 'hogshead', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.2384810, offset: 0}, // 238.4810 L // TODO: hh?

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
    tonne: {
      name: 'tonne',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.SHORT,
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

    // Angle
    rad: {
      name: 'rad',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.NONE,
      value: 1,
      offset: 0
    },
    // deg = rad / (2*pi) * 360 = rad / 0.017453292519943295769236907684888
    deg: {
      name: 'deg',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.NONE,
      value: 0.017453292519943295769236907684888,
      offset: 0
    },
    // grad = rad / (2*pi) * 400  = rad / 0.015707963267948966192313216916399
    grad: {
      name: 'grad',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.NONE,
      value: 0.015707963267948966192313216916399,
      offset: 0
    },
    // cycle = rad / (2*pi) = rad / 6.2831853071795864769252867665793
    cycle: {
      name: 'cycle',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.NONE,
      value: 6.2831853071795864769252867665793,
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
    // K(F) = (°F + 459.67) / 1.8
    // K(R) = °R / 1.8
    K: {
      name: 'K',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.NONE,
      value: 1,
      offset: 0
    },
    degC: {
      name: 'degC',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.NONE,
      value: 1,
      offset: 273.15
    },
    degF: {
      name: 'degF',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.NONE,
      value: 1 / 1.8,
      offset: 459.67
    },
    degR: {
      name: 'degR',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.NONE,
      value: 1 / 1.8,
      offset: 0
    },
    kelvin: {
      name: 'kelvin',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.NONE,
      value: 1,
      offset: 0
    },
    celsius: {
      name: 'celsius',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.NONE,
      value: 1,
      offset: 273.15
    },
    fahrenheit: {
      name: 'fahrenheit',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.NONE,
      value: 1 / 1.8,
      offset: 459.67
    },
    rankine: {
      name: 'rankine',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.NONE,
      value: 1 / 1.8,
      offset: 0
    },

    // amount of substance
    mol: {
      name: 'mol',
      base: BASE_UNITS.AMOUNT_OF_SUBSTANCE,
      prefixes: PREFIXES.NONE,
      value: 1,
      offset: 0
    },
    mole: {
      name: 'mole',
      base: BASE_UNITS.AMOUNT_OF_SUBSTANCE,
      prefixes: PREFIXES.NONE,
      value: 1,
      offset: 0
    },

    // luminous intensity
    cd: {
      name: 'cd',
      base: BASE_UNITS.LUMINOUS_INTENSITY,
      prefixes: PREFIXES.NONE,
      value: 1,
      offset: 0
    },
    candela: {
      name: 'candela',
      base: BASE_UNITS.LUMINOUS_INTENSITY,
      prefixes: PREFIXES.NONE,
      value: 1,
      offset: 0
    },
    // TODO: units STERADIAN
    //{name: 'sr', base: BASE_UNITS.STERADIAN, prefixes: PREFIXES.NONE, value: 1, offset: 0},
    //{name: 'steradian', base: BASE_UNITS.STERADIAN, prefixes: PREFIXES.NONE, value: 1, offset: 0},

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
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    erg: {
      name: 'erg',
      base: BASE_UNITS.ENERGY,
      prefixes: PREFIXES.NONE,
      value: 1e-5,
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
      name: 'W',
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

    // Electric charge
    coulomb: {
      name: 'coulomb',
      base: BASE_UNITS.ELECTRIC_CHARGE,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0,
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
      prefixes: PREFIXES.SHORTLONG,    // Both Mohm and megaohm are acceptable
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
  };

  // plurals
  var PLURALS = {
    meters: 'meter',
    inches: 'inch',
    feet: 'foot',
    yards: 'yard',
    miles: 'mile',
    links: 'link',
    rods: 'rod',
    chains: 'chain',
    angstroms: 'angstrom',

    litres: 'litre',
    teaspoons: 'teaspoon',
    tablespoons: 'tablespoon',
    minims: 'minim',
    fluiddrams: 'fluiddram',
    fluidounces: 'fluidounce',
    gills: 'gill',
    cups: 'cup',
    pints: 'pint',
    quarts: 'quart',
    gallons: 'gallon',
    beerbarrels: 'beerbarrel',
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

    seconds: 'second',
    minutes: 'minute',
    hours: 'hour',
    days: 'day',

    radians: 'rad',
    degrees: 'deg',
    gradients: 'grad',
    cycles: 'cycle',

    BTUs: 'BTU',
    watts: 'watt',
    joules: 'joule',

    amperes: 'ampere',
    coulombs: 'coulomb',
    volts: 'volt',
    ohms: 'ohm',
    farads: 'farad',
    webers: 'weber',
    teslas: 'tesla',
    electronvolts: 'electronvolt',
    moles: 'mole'

  };

  /**
   * A unit system is a set of dimensionally independent base units plus a set of derived units, formed by multiplication and division of the base units, that are by convention used with the unit system.
   * A user perhaps could issue a command to select a preferred unit system, or use the default (see below).
   * Auto unit system: The default unit system is updated on the fly anytime a unit is parsed. The corresponding unit in the default unit system is updated, so that answers are given in the same units the user supplies.
   */
  var UNIT_SYSTEMS = {
    si: {
      // Base units
      NONE:                  {unit: UNIT_NONE, prefix: PREFIXES.NONE['']},
      LENGTH:                {unit: UNITS.m,   prefix: PREFIXES.SHORT['']},
      MASS:                  {unit: UNITS.g,   prefix: PREFIXES.SHORT['k']}, 
      TIME:                  {unit: UNITS.s,   prefix: PREFIXES.SHORT['']}, 
      CURRENT:               {unit: UNITS.A,   prefix: PREFIXES.SHORT['']}, 
      TEMPERATURE:           {unit: UNITS.K,   prefix: PREFIXES.SHORT['']}, 
      LUMINOUS_INTENSITY:    {unit: UNITS.cd,  prefix: PREFIXES.SHORT['']}, 
      AMOUNT_OF_SUBSTANCE:   {unit: UNITS.mol, prefix: PREFIXES.SHORT['']}, 
      ANGLE:                 {unit: UNITS.rad, prefix: PREFIXES.SHORT['']}, 
      BIT:                   {unit: UNITS.bit, prefix: PREFIXES.SHORT['']}, 

      // Derived units
      FORCE:                 {unit: UNITS.N,   prefix: PREFIXES.SHORT['']}, 
      ENERGY:                {unit: UNITS.J,   prefix: PREFIXES.SHORT['']},
      POWER:                 {unit: UNITS.W,   prefix: PREFIXES.SHORT['']},
      PRESSURE:              {unit: UNITS.Pa,  prefix: PREFIXES.SHORT['']},
      ELECTRIC_CHARGE:       {unit: UNITS.C,   prefix: PREFIXES.SHORT['']},
      ELECTRIC_CAPACITANCE:  {unit: UNITS.F,   prefix: PREFIXES.SHORT['']},
      ELECTRIC_POTENTIAL:    {unit: UNITS.V,   prefix: PREFIXES.SHORT['']},
      ELECTRIC_RESISTANCE:   {unit: UNITS.ohm, prefix: PREFIXES.SHORT['']},
      ELECTRIC_INDUCTANCE:   {unit: UNITS.H,   prefix: PREFIXES.SHORT['']},
      ELECTRIC_CONDUCTANCE:  {unit: UNITS.S,   prefix: PREFIXES.SHORT['']},
      MAGNETIC_FLUX:         {unit: UNITS.Wb,  prefix: PREFIXES.SHORT['']},
      MAGNETIC_FLUX_DENSITY: {unit: UNITS.T,   prefix: PREFIXES.SHORT['']}
    }
  };

  // Clone to create the other unit systems
  UNIT_SYSTEMS.cgs = JSON.parse(JSON.stringify(UNIT_SYSTEMS.si));
  UNIT_SYSTEMS.cgs.LENGTH = {unit: UNITS.m,   prefix: PREFIXES.SHORT['c']};
  UNIT_SYSTEMS.cgs.MASS =   {unit: UNITS.g,   prefix: PREFIXES.SHORT['']};
  UNIT_SYSTEMS.cgs.FORCE =  {unit: UNITS.dyn, prefix: PREFIXES.SHORT['']};
  UNIT_SYSTEMS.cgs.ENERGY = {unit: UNITS.erg, prefix: PREFIXES.NONE['']};
  // there are wholly 4 unique cgs systems for electricity and magnetism,
  // so let's not worry about it unless somebody complains
  
  UNIT_SYSTEMS.us = JSON.parse(JSON.stringify(UNIT_SYSTEMS.si));
  UNIT_SYSTEMS.us.LENGTH =      {unit: UNITS.ft,   prefix: PREFIXES.NONE['']};
  UNIT_SYSTEMS.us.MASS =        {unit: UNITS.lbm,  prefix: PREFIXES.NONE['']};
  UNIT_SYSTEMS.us.TEMPERATURE = {unit: UNITS.degF, prefix: PREFIXES.NONE['']};
  UNIT_SYSTEMS.us.FORCE =       {unit: UNITS.lbf,  prefix: PREFIXES.NONE['']};
  UNIT_SYSTEMS.us.ENERGY =      {unit: UNITS.BTU,  prefix: PREFIXES.BTU['']};
  UNIT_SYSTEMS.us.POWER =       {unit: UNITS.hp,   prefix: PREFIXES.NONE['']};
  UNIT_SYSTEMS.us.PRESSURE =    {unit: UNITS.psi,  prefix: PREFIXES.NONE['']};

  // Add additional unit systems here.



  // Choose a unit system to seed the auto unit system.
  UNIT_SYSTEMS.auto = JSON.parse(JSON.stringify(UNIT_SYSTEMS.si));

  // Set the current unit system
  var currentUnitSystem = UNIT_SYSTEMS.auto;

  /**
   * Set a unit system for formatting derived units.
   * @param {string} [name] The name of the unit system.
   */
  Unit.setUnitSystem = function(name) {
    if(UNIT_SYSTEMS.hasOwnProperty(name)) {
      currentUnitSystem = UNIT_SYSTEMS[name];
    }
    else {
      var mess = "Unit system " + name + " does not exist. Choices are: " + listAvailableUnitSystems();
    }
  }
 
  /**
   * Return a list of the available unit systems.
   * @return {string} A space-delimited string of the available unit systems.
   */
  Unit.listAvailableUnitSystems = function() {
    var mess = "";
    for(var key in UNIT_SYSTEMS) {
      mess += " " + key;
    }
    return mess.substr(1);
  }

  /**
   * Return the current unit system.
   * @return {string} The current unit system.
   */
  Unit.getUnitSystem = function() {
    for(var key in UNIT_SYSTEMS) {
      if(UNIT_SYSTEMS[key] === currentUnitSystem) {
        return key;
      }
    }
  }


  // Add dimensions to each built-in unit
  for (var key in UNITS) {
    var unit = UNITS[key];
    unit.dimensions = unit.base.dimensions;
  }    

  for (var name in PLURALS) {
    /* istanbul ignore next (we cannot really test next statement) */
    if (PLURALS.hasOwnProperty(name)) {
      var unit = UNITS[PLURALS[name]];
      var plural = Object.create(unit);
      plural.name = name;
      UNITS[name] = plural;
    }
  }

  // aliases
  UNITS.lt = UNITS.l;
  UNITS.liter = UNITS.litre;
  UNITS.liters = UNITS.litres;
  UNITS.lb = UNITS.lbm;
  UNITS.lbs = UNITS.lbm;

  Unit.PREFIXES = PREFIXES;
  Unit.BASE_UNITS = BASE_UNITS;
  Unit.UNITS = UNITS;
  Unit.UNIT_SYSTEMS = UNIT_SYSTEMS;

  return Unit;
}

exports.name = 'Unit';
exports.path = 'type';
exports.factory = factory;
