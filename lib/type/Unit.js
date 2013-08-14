var util = require('../util/index.js'),

    number = util.number,
    string = util.string,
    isNumber = util.number.isNumber,
    isString = util.string.isString;

/**
 * @constructor Unit
 *
 * A unit can be constructed in the following ways:
 *     var a = new Unit(value, unit);
 *     var b = new Unit(null, unit);
 *     var c = Unit.parse(str);
 *
 * Example usage:
 *     var a = new Unit(5, 'cm');               // 50 mm
 *     var b = Unit.parse('23 kg');             // 23 kg
 *     var c = math.in(a, new Unit(null, 'm');  // 0.05 m
 *
 * @param {Number} [value]  A value like 5.2
 * @param {String} [unit]   A unit like "cm" or "inch"
 */
function Unit(value, unit) {
  if (!(this instanceof Unit)) {
    throw new Error('Unit constructor must be called with the new operator');
  }

  if (value != null && !isNumber(value)) {
    throw new TypeError('First parameter in Unit constructor must be a number');
  }
  if (unit != null && !isString(unit)) {
    throw new TypeError('Second parameter in Unit constructor must be a string');
  }

  if (unit != null) {
    // find the unit and prefix from the string
    var res = _findUnit(unit);
    if (!res) {
      throw new SyntaxError('String "' + unit + '" is no unit');
    }
    this.unit = res.unit;
    this.prefix = res.prefix;
  }
  else {
    this.unit = UNIT_NONE;
    this.prefix = PREFIX_NONE;  // link to a list with supported prefixes
  }

  if (value != null) {
    this.value = this._normalize(value);
    this.fixPrefix = false;  // is set true by the methods Unit.in and math.in
  }
  else {
    this.value = null;
    this.fixPrefix = true;
  }
}

// private variables and functions for the Unit parser
var text, index, c;

function skipWhitespace() {
  while (c == ' ' || c == '\t') {
    next();
  }
}

function isDigitDot (c) {
  return ((c >= '0' && c <= '9') || c == '.');
}

function isDigit (c) {
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

function parseNumber () {
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

  // check for scientific notation like "2.3e-4" or "1.23e50"
  if (c == 'E' || c == 'e') {
    number += c;
    next();

    if (c == '+' || c == '-') {
      number += c;
      next();
    }

    // Scientific notation MUST be followed by an exponent
    if (!isDigit(c)) {
      // this is no legal number, exponent is missing.
      revert(oldIndex);
      return null;
    }

    while (isDigit(c)) {
      number += c;
      next();
    }
  }

  return number;
}

function parseUnit() {
  var unit = '';

  skipWhitespace();
  while (c && c != ' ' && c != '\t') {
    unit += c;
    next();
  }

  return unit || null;
}

/**
 * Parse a string into a unit. Returns null if the provided string does not
 * contain a valid unit.
 * @param {String} str        A string like "5.2 inch", "4e2 kg"
 * @return {Unit | null} unit
 */
Unit.parse = function parse(str) {
  text = str;
  index = -1;
  c = '';

  if (!isString(text)) {
    return null;
  }

  next();
  skipWhitespace();
  var value = parseNumber();
  var unit;
  if (value) {
    unit = parseUnit();

    next();
    skipWhitespace();
    if (c) {
      // garbage at the end. not good.
      return null;
    }

    if (value && unit) {
      return new Unit(Number(value), unit);
    }
  }
  else {
    unit = parseUnit();

    next();
    skipWhitespace();
    if (c) {
      // garbage at the end. not good.
      return null;
    }

    return new Unit(null, unit)
  }

  return null;
};

/**
 * Test whether value is of type Unit
 * @param {*} value
 * @return {Boolean} isUnit
 */
Unit.isUnit = function isUnit(value) {
  return (value instanceof Unit);
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

  return clone;
};

/**
 * Normalize a value, based on its currently set unit
 * @param {Number} value
 * @return {Number} normalized value
 * @private
 */
Unit.prototype._normalize = function(value) {
  return (value + this.unit.offset) *
      this.unit.value * this.prefix.value;
};

/**
 * Unnormalize a value, based on its currently set unit
 * @param {Number} value
 * @param {Number} [prefixValue]    Optional prefix value to be used
 * @return {Number} unnormalized value
 * @private
 */
Unit.prototype._unnormalize = function (value, prefixValue) {
  if (prefixValue == undefined) {
    return value / this.unit.value / this.prefix.value -
        this.unit.offset;
  }
  else {
    return value / this.unit.value / prefixValue -
        this.unit.offset;
  }
};

/**
 * Find a unit from a string
 * @param {String} str              A string like 'cm' or 'inch'
 * @returns {Object | null} result  When found, an object with fields unit and
 *                                  prefix is returned. Else, null is returned.
 * @private
 */
function _findUnit(str) {
  for (var i = 0, iMax = UNITS.length; i < iMax; i++) {
    var UNIT = UNITS[i];

    if (string.endsWith(str, UNIT.name) ) {
      var prefixLen = (str.length - UNIT.name.length);
      var prefixName = str.substring(0, prefixLen);
      var prefix = UNIT.prefixes[prefixName];
      if (prefix !== undefined) {
        // store unit, prefix, and value
        return {
          unit: UNIT,
          prefix: prefix
        };
      }
    }
  }

  return null;
}

/**
 * Test if the given expression is a unit.
 * The unit can have a prefix but cannot have a value.
 * @param {String} unit   A plain unit without value. Can have prefix, like "cm"
 * @return {Boolean}      true if the given string is a unit
 */
Unit.isPlainUnit = function (unit) {
  return (_findUnit(unit) != null);
};

/**
 * check if this unit has given base unit
 * @param {BASE_UNITS | undefined} base
 */
Unit.prototype.hasBase = function(base) {
  if (this.unit.base === undefined) {
    return (base === undefined);
  }
  return (this.unit.base === base);
};

/**
 * Check if this unit has a base equal to another base
 * @param {Unit} other
 * @return {Boolean} true if equal base
 */
Unit.prototype.equalBase = function(other) {
  return (this.unit.base === other.unit.base);
};

/**
 * Check if this unit equals another unit
 * @param {Unit} other
 * @return {Boolean} true if both units are equal
 */
Unit.prototype.equals = function(other) {
  return (this.equalBase(other) && this.value == other.value);
};

/**
 * Create a clone of this unit with a representation
 * @param {String | Unit} plainUnit   A plain unit, without value. Can have prefix, like "cm"
 * @returns {Unit} unit having fixed, specified unit
 */
Unit.prototype['in'] = function (plainUnit) {
  var other;
  if (isString(plainUnit)) {
    other = new Unit(null, plainUnit);

    if (!this.equalBase(other)) {
      throw new Error('Units do not match');
    }

    other.value = this.value;
    return other;
  }
  else if (plainUnit instanceof Unit) {
    if (!this.equalBase(plainUnit)) {
      throw new Error('Units do not match');
    }
    if (plainUnit.value != null) {
      throw new Error('Cannot convert to a unit with a value');
    }
    if (plainUnit.unit == null) {
      throw new Error('Unit expected on the right hand side of function in');
    }

    other = plainUnit.clone();
    other.value = this.value;
    other.fixPrefix = true;
    return other;
  }
  else {
    throw new Error('String or Unit expected as parameter');
  }
};

/**
 * Return the value of the unit when represented with given plain unit
 * @param {String | Unit} plainUnit    For example 'cm' or 'inch'
 * @return {Number} value
 */
Unit.prototype.toNumber = function (plainUnit) {
  var other = this['in'](plainUnit);
  var prefix = this.fixPrefix ? other._bestPrefix() : other.prefix;
  return other._unnormalize(other.value, prefix.value);
};

/**
 * Get string representation
 * @return {String}
 */
Unit.prototype.toString = function() {
  var value, str;
  if (!this.fixPrefix) {
    var bestPrefix = this._bestPrefix();
    value = this._unnormalize(this.value, bestPrefix.value);
    str = (this.value != null) ? number.format(value) + ' ' : '';
    str += bestPrefix.name + this.unit.name;
  }
  else {
    value = this._unnormalize(this.value);
    str = (this.value != null) ? number.format(value) + ' ' : '';
    str += this.prefix.name + this.unit.name;
  }
  return str;
};

/**
 * Calculate the best prefix using current value.
 * @returns {Object} prefix
 * @private
 */
Unit.prototype._bestPrefix = function () {
  // find the best prefix value (resulting in the value of which
  // the absolute value of the log10 is closest to zero,
  // though with a little offset of 1.2 for nicer values: you get a
  // sequence 1mm 100mm 500mm 0.6m 1m 10m 100m 500m 0.6km 1km ...
  var absValue = Math.abs(this.value / this.unit.value);
  var bestPrefix = PREFIX_NONE;
  var bestDiff = Math.abs(
      Math.log(absValue / bestPrefix.value) / Math.LN10 - 1.2);

  var prefixes = this.unit.prefixes;
  for (var p in prefixes) {
    if (prefixes.hasOwnProperty(p)) {
      var prefix = prefixes[p];
      if (prefix.scientific) {
        var diff = Math.abs(
            Math.log(absValue / prefix.value) / Math.LN10 - 1.2);

        if (diff < bestDiff) {
          bestPrefix = prefix;
          bestDiff = diff;
        }
      }
    }
  }

  return bestPrefix;
};

var PREFIXES = {
  'NONE': {
    '': {'name': '', 'value': 1, 'scientific': true}
  },
  'SHORT': {
    '': {'name': '', 'value': 1, 'scientific': true},

    'da': {'name': 'da', 'value': 1e1, 'scientific': false},
    'h': {'name': 'h', 'value': 1e2, 'scientific': false},
    'k': {'name': 'k', 'value': 1e3, 'scientific': true},
    'M': {'name': 'M', 'value': 1e6, 'scientific': true},
    'G': {'name': 'G', 'value': 1e9, 'scientific': true},
    'T': {'name': 'T', 'value': 1e12, 'scientific': true},
    'P': {'name': 'P', 'value': 1e15, 'scientific': true},
    'E': {'name': 'E', 'value': 1e18, 'scientific': true},
    'Z': {'name': 'Z', 'value': 1e21, 'scientific': true},
    'Y': {'name': 'Y', 'value': 1e24, 'scientific': true},

    'd': {'name': 'd', 'value': 1e-1, 'scientific': false},
    'c': {'name': 'c', 'value': 1e-2, 'scientific': false},
    'm': {'name': 'm', 'value': 1e-3, 'scientific': true},
    // 'µ': {'name': 'µ', 'value': 1e-6, 'scientific': true},
    'u': {'name': 'u', 'value': 1e-6, 'scientific': true},
    'n': {'name': 'n', 'value': 1e-9, 'scientific': true},
    'p': {'name': 'p', 'value': 1e-12, 'scientific': true},
    'f': {'name': 'f', 'value': 1e-15, 'scientific': true},
    'a': {'name': 'a', 'value': 1e-18, 'scientific': true},
    'z': {'name': 'z', 'value': 1e-21, 'scientific': true},
    'y': {'name': 'y', 'value': 1e-24, 'scientific': true}
  },
  'LONG': {
    '': {'name': '', 'value': 1, 'scientific': true},

    'deca': {'name': 'deca', 'value': 1e1, 'scientific': false},
    'hecto': {'name': 'hecto', 'value': 1e2, 'scientific': false},
    'kilo': {'name': 'kilo', 'value': 1e3, 'scientific': true},
    'mega': {'name': 'mega', 'value': 1e6, 'scientific': true},
    'giga': {'name': 'giga', 'value': 1e9, 'scientific': true},
    'tera': {'name': 'tera', 'value': 1e12, 'scientific': true},
    'peta': {'name': 'peta', 'value': 1e15, 'scientific': true},
    'exa': {'name': 'exa', 'value': 1e18, 'scientific': true},
    'zetta': {'name': 'zetta', 'value': 1e21, 'scientific': true},
    'yotta': {'name': 'yotta', 'value': 1e24, 'scientific': true},

    'deci': {'name': 'deci', 'value': 1e-1, 'scientific': false},
    'centi': {'name': 'centi', 'value': 1e-2, 'scientific': false},
    'milli': {'name': 'milli', 'value': 1e-3, 'scientific': true},
    'micro': {'name': 'micro', 'value': 1e-6, 'scientific': true},
    'nano': {'name': 'nano', 'value': 1e-9, 'scientific': true},
    'pico': {'name': 'pico', 'value': 1e-12, 'scientific': true},
    'femto': {'name': 'femto', 'value': 1e-15, 'scientific': true},
    'atto': {'name': 'atto', 'value': 1e-18, 'scientific': true},
    'zepto': {'name': 'zepto', 'value': 1e-21, 'scientific': true},
    'yocto': {'name': 'yocto', 'value': 1e-24, 'scientific': true}
  },
  'BINARY_SHORT': {
    '': {'name': '', 'value': 1, 'scientific': true},
    'k': {'name': 'k', 'value': 1024, 'scientific': true},
    'M': {'name': 'M', 'value': Math.pow(1024, 2), 'scientific': true},
    'G': {'name': 'G', 'value': Math.pow(1024, 3), 'scientific': true},
    'T': {'name': 'T', 'value': Math.pow(1024, 4), 'scientific': true},
    'P': {'name': 'P', 'value': Math.pow(1024, 5), 'scientific': true},
    'E': {'name': 'E', 'value': Math.pow(1024, 6), 'scientific': true},
    'Z': {'name': 'Z', 'value': Math.pow(1024, 7), 'scientific': true},
    'Y': {'name': 'Y', 'value': Math.pow(1024, 8), 'scientific': true},

    'Ki': {'name': 'Ki', 'value': 1024, 'scientific': true},
    'Mi': {'name': 'Mi', 'value': Math.pow(1024, 2), 'scientific': true},
    'Gi': {'name': 'Gi', 'value': Math.pow(1024, 3), 'scientific': true},
    'Ti': {'name': 'Ti', 'value': Math.pow(1024, 4), 'scientific': true},
    'Pi': {'name': 'Pi', 'value': Math.pow(1024, 5), 'scientific': true},
    'Ei': {'name': 'Ei', 'value': Math.pow(1024, 6), 'scientific': true},
    'Zi': {'name': 'Zi', 'value': Math.pow(1024, 7), 'scientific': true},
    'Yi': {'name': 'Yi', 'value': Math.pow(1024, 8), 'scientific': true}
  },
  'BINARY_LONG': {
    '': {'name': '', 'value': 1, 'scientific': true},
    'kilo': {'name': 'kilo', 'value': 1024, 'scientific': true},
    'mega': {'name': 'mega', 'value': Math.pow(1024, 2), 'scientific': true},
    'giga': {'name': 'giga', 'value': Math.pow(1024, 3), 'scientific': true},
    'tera': {'name': 'tera', 'value': Math.pow(1024, 4), 'scientific': true},
    'peta': {'name': 'peta', 'value': Math.pow(1024, 5), 'scientific': true},
    'exa': {'name': 'exa', 'value': Math.pow(1024, 6), 'scientific': true},
    'zetta': {'name': 'zetta', 'value': Math.pow(1024, 7), 'scientific': true},
    'yotta': {'name': 'yotta', 'value': Math.pow(1024, 8), 'scientific': true},

    'kibi': {'name': 'kibi', 'value': 1024, 'scientific': true},
    'mebi': {'name': 'mebi', 'value': Math.pow(1024, 2), 'scientific': true},
    'gibi': {'name': 'gibi', 'value': Math.pow(1024, 3), 'scientific': true},
    'tebi': {'name': 'tebi', 'value': Math.pow(1024, 4), 'scientific': true},
    'pebi': {'name': 'pebi', 'value': Math.pow(1024, 5), 'scientific': true},
    'exi': {'name': 'exi', 'value': Math.pow(1024, 6), 'scientific': true},
    'zebi': {'name': 'zebi', 'value': Math.pow(1024, 7), 'scientific': true},
    'yobi': {'name': 'yobi', 'value': Math.pow(1024, 8), 'scientific': true}
  }
};

var PREFIX_NONE = {'name': '', 'value': 1, 'scientific': true};

var BASE_UNITS = {
  'NONE': {},

  'LENGTH': {},               // meter
  'MASS': {},                 // kilogram
  'TIME': {},                 // second
  'CURRENT': {},              // ampere
  'TEMPERATURE': {},          // kelvin
  'LUMINOUS_INTENSITY': {},   // candela
  'AMOUNT_OF_SUBSTANCE': {},  // mole

  'FORCE': {},        // Newton
  'SURFACE': {},      // m2
  'VOLUME': {},       // m3
  'ANGLE': {},        // rad
  'BIT': {}           // bit (digital)
};

BASE_UNIT_NONE = {};

UNIT_NONE = {'name': '', 'base': BASE_UNIT_NONE, 'value': 1, 'offset': 0};

var UNITS = [
  // length
  {'name': 'meter', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},
  {'name': 'inch', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.0254, 'offset': 0},
  {'name': 'foot', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.3048, 'offset': 0},
  {'name': 'yard', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.9144, 'offset': 0},
  {'name': 'mile', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 1609.344, 'offset': 0},
  {'name': 'link', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.201168, 'offset': 0},
  {'name': 'rod', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 5.029210, 'offset': 0},
  {'name': 'chain', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 20.1168, 'offset': 0},
  {'name': 'angstrom', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 1e-10, 'offset': 0},

  {'name': 'm', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
  //{'name': 'in', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.0254, 'offset': 0}, not supported, In is an operator
  {'name': 'ft', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.3048, 'offset': 0},
  {'name': 'yd', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.9144, 'offset': 0},
  {'name': 'mi', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 1609.344, 'offset': 0},
  {'name': 'li', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.201168, 'offset': 0},
  {'name': 'rd', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 5.029210, 'offset': 0},
  {'name': 'ch', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 20.1168, 'offset': 0},
  {'name': 'mil', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.0000254, 'offset': 0}, // 1/1000 inch

  // Surface
  {'name': 'm2', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
  {'name': 'sqin', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 0.00064516, 'offset': 0}, // 645.16 mm2
  {'name': 'sqft', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 0.09290304, 'offset': 0}, // 0.09290304 m2
  {'name': 'sqyd', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 0.83612736, 'offset': 0}, // 0.83612736 m2
  {'name': 'sqmi', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 2589988.110336, 'offset': 0}, // 2.589988110336 km2
  {'name': 'sqrd', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 25.29295, 'offset': 0}, // 25.29295 m2
  {'name': 'sqch', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 404.6873, 'offset': 0}, // 404.6873 m2
  {'name': 'sqmil', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 6.4516e-10, 'offset': 0}, // 6.4516 * 10^-10 m2

  // Volume
  {'name': 'm3', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
  {'name': 'L', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.SHORT, 'value': 0.001, 'offset': 0}, // litre
  {'name': 'litre', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.LONG, 'value': 0.001, 'offset': 0},
  {'name': 'cuin', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 1.6387064e-5, 'offset': 0}, // 1.6387064e-5 m3
  {'name': 'cuft', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.028316846592, 'offset': 0}, // 28.316 846 592 L
  {'name': 'cuyd', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.764554857984, 'offset': 0}, // 764.554 857 984 L
  {'name': 'teaspoon', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.000005, 'offset': 0}, // 5 mL
  {'name': 'tablespoon', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.000015, 'offset': 0}, // 15 mL
  //{'name': 'cup', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.000240, 'offset': 0}, // 240 mL  // not possible, we have already another cup

  // Liquid volume
  {'name': 'minim', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.00000006161152, 'offset': 0}, // 0.06161152 mL
  {'name': 'fluiddram', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0000036966911, 'offset': 0},  // 3.696691 mL
  {'name': 'fluidounce', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.00002957353, 'offset': 0}, // 29.57353 mL
  {'name': 'gill', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0001182941, 'offset': 0}, // 118.2941 mL
  {'name': 'cup', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0002365882, 'offset': 0}, // 236.5882 mL
  {'name': 'pint', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0004731765, 'offset': 0}, // 473.1765 mL
  {'name': 'quart', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0009463529, 'offset': 0}, // 946.3529 mL
  {'name': 'gallon', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.003785412, 'offset': 0}, // 3.785412 L
  {'name': 'beerbarrel', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.1173478, 'offset': 0}, // 117.3478 L
  {'name': 'oilbarrel', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.1589873, 'offset': 0}, // 158.9873 L
  {'name': 'hogshead', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.2384810, 'offset': 0}, // 238.4810 L

  //{'name': 'min', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.00000006161152, 'offset': 0}, // 0.06161152 mL // min is already in use as minute
  {'name': 'fldr', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0000036966911, 'offset': 0},  // 3.696691 mL
  {'name': 'floz', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.00002957353, 'offset': 0}, // 29.57353 mL
  {'name': 'gi', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0001182941, 'offset': 0}, // 118.2941 mL
  {'name': 'cp', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0002365882, 'offset': 0}, // 236.5882 mL
  {'name': 'pt', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0004731765, 'offset': 0}, // 473.1765 mL
  {'name': 'qt', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0009463529, 'offset': 0}, // 946.3529 mL
  {'name': 'gal', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.003785412, 'offset': 0}, // 3.785412 L
  {'name': 'bbl', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.1173478, 'offset': 0}, // 117.3478 L
  {'name': 'obl', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.1589873, 'offset': 0}, // 158.9873 L
  //{'name': 'hogshead', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.2384810, 'offset': 0}, // 238.4810 L // TODO: hh?

  // Mass
  {'name': 'g', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.SHORT, 'value': 0.001, 'offset': 0},
  {'name': 'gram', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.LONG, 'value': 0.001, 'offset': 0},

  {'name': 'ton', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.SHORT, 'value': 907.18474, 'offset': 0},
  {'name': 'tonne', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.SHORT, 'value': 1000, 'offset': 0},

  {'name': 'grain', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 64.79891e-6, 'offset': 0},
  {'name': 'dram', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 1.7718451953125e-3, 'offset': 0},
  {'name': 'ounce', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 28.349523125e-3, 'offset': 0},
  {'name': 'poundmass', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 453.59237e-3, 'offset': 0},
  {'name': 'hundredweight', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 45.359237, 'offset': 0},
  {'name': 'stick', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 115e-3, 'offset': 0},

  {'name': 'gr', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 64.79891e-6, 'offset': 0},
  {'name': 'dr', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 1.7718451953125e-3, 'offset': 0},
  {'name': 'oz', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 28.349523125e-3, 'offset': 0},
  {'name': 'lbm', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 453.59237e-3, 'offset': 0},
  {'name': 'cwt', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 45.359237, 'offset': 0},

  // Time
  {'name': 's', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
  {'name': 'min', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 60, 'offset': 0},
  {'name': 'h', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 3600, 'offset': 0},
  {'name': 'seconds', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},
  {'name': 'second', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},
  {'name': 'sec', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},
  {'name': 'minutes', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 60, 'offset': 0},
  {'name': 'minute', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 60, 'offset': 0},
  {'name': 'hours', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 3600, 'offset': 0},
  {'name': 'hour', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 3600, 'offset': 0},
  {'name': 'day', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 86400, 'offset': 0},
  {'name': 'days', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 86400, 'offset': 0},

  // Angles
  {'name': 'rad', 'base': BASE_UNITS.ANGLE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
  {'name': 'deg', 'base': BASE_UNITS.ANGLE, 'prefixes': PREFIXES.NONE, 'value': 0.017453292519943295769236907684888, 'offset': 0},  // deg = rad / (2*pi) * 360 = rad / 0.017453292519943295769236907684888
  {'name': 'grad', 'base': BASE_UNITS.ANGLE, 'prefixes': PREFIXES.NONE, 'value': 0.015707963267948966192313216916399, 'offset': 0}, // grad = rad / (2*pi) * 400  = rad / 0.015707963267948966192313216916399
  {'name': 'cycle', 'base': BASE_UNITS.ANGLE, 'prefixes': PREFIXES.NONE, 'value': 6.2831853071795864769252867665793, 'offset': 0},  // cycle = rad / (2*pi) = rad / 6.2831853071795864769252867665793

  // Electric current
  {'name': 'A', 'base': BASE_UNITS.CURRENT, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
  {'name': 'ampere', 'base': BASE_UNITS.CURRENT, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},

  // Temperature
  // K(C) = °C + 273.15
  // K(F) = (°F + 459.67) / 1.8
  // K(R) = °R / 1.8
  {'name': 'K', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
  {'name': 'degC', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 273.15},
  {'name': 'degF', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1/1.8, 'offset': 459.67},
  {'name': 'degR', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1/1.8, 'offset': 0},
  {'name': 'kelvin', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
  {'name': 'celsius', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 273.15},
  {'name': 'fahrenheit', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1/1.8, 'offset': 459.67},
  {'name': 'rankine', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1/1.8, 'offset': 0},

  // amount of substance
  {'name': 'mol', 'base': BASE_UNITS.AMOUNT_OF_SUBSTANCE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
  {'name': 'mole', 'base': BASE_UNITS.AMOUNT_OF_SUBSTANCE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},

  // luminous intensity
  {'name': 'cd', 'base': BASE_UNITS.LUMINOUS_INTENSITY, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
  {'name': 'candela', 'base': BASE_UNITS.LUMINOUS_INTENSITY, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
  // TODO: units STERADIAN
  //{'name': 'sr', 'base': BASE_UNITS.STERADIAN, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
  //{'name': 'steradian', 'base': BASE_UNITS.STERADIAN, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},

  // Force
  {'name': 'N', 'base': BASE_UNITS.FORCE, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
  {'name': 'newton', 'base': BASE_UNITS.FORCE, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},
  {'name': 'lbf', 'base': BASE_UNITS.FORCE, 'prefixes': PREFIXES.NONE, 'value': 4.4482216152605, 'offset': 0},
  {'name': 'poundforce', 'base': BASE_UNITS.FORCE, 'prefixes': PREFIXES.NONE, 'value': 4.4482216152605, 'offset': 0},

  // Binary
  {'name': 'b', 'base': BASE_UNITS.BIT, 'prefixes': PREFIXES.BINARY_SHORT, 'value': 1, 'offset': 0},
  {'name': 'bits', 'base': BASE_UNITS.BIT, 'prefixes': PREFIXES.BINARY_LONG, 'value': 1, 'offset': 0},
  {'name': 'B', 'base': BASE_UNITS.BIT, 'prefixes': PREFIXES.BINARY_SHORT, 'value': 8, 'offset': 0},
  {'name': 'bytes', 'base': BASE_UNITS.BIT, 'prefixes': PREFIXES.BINARY_LONG, 'value': 8, 'offset': 0}
];

Unit.PREFIXES = PREFIXES;
Unit.BASE_UNITS = BASE_UNITS;
Unit.UNITS = UNITS;


// exports
module.exports = Unit;

// to trick my IDE which doesn't get it
exports.isUnit = Unit.isUnit;
exports.isPlainUnit = Unit.isPlainUnit;
exports.parse = Unit.parse;

util.types.addType('unit', Unit);
