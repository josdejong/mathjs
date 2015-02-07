'use strict';

var util = require('../util/index'),

    number = util.number,
    string = util.string,
    isNumber = util.number.isNumber,
    isString = util.string.isString;

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
 *
 * @param {Number} [value]  A value like 5.2
 * @param {String} [name]   A unit name like "cm" or "inch". Can include a prefix
 */
function Unit(value, name) {
  if (!(this instanceof Unit)) {
    throw new Error('Constructor must be called with the new operator');
  }

  if (value != undefined && !isNumber(value)) {
    throw new TypeError('First parameter in Unit constructor must be a number');
  }
  if (name != undefined && (!isString(name) || name == '')) {
    throw new TypeError('Second parameter in Unit constructor must be a string');
  }

  if (name != undefined) {
    // find the unit and prefix from the string
    var res = _findUnit(name);
    if (!res) {
      throw new SyntaxError('Unknown unit "' + name + '"');
    }
    this.unit = res.unit;
    this.prefix = res.prefix;
  }
  else {
    this.unit = UNIT_NONE;
    this.prefix = PREFIX_NONE;  // link to a list with supported prefixes
  }

  this.value = (value != undefined) ? this._normalize(value) : null;
  this.fixPrefix = false; // if true, function format will not search for the
                          // best prefix but leave it as initially provided.
                          // fixPrefix is set true by the method Unit.to
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

  // check for exponential notation like "2.3e-4" or "1.23e50"
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
  var unitName = '';

  skipWhitespace();
  while (c && c != ' ' && c != '\t') {
    unitName += c;
    next();
  }

  return unitName || null;
}

/**
 * Parse a string into a unit. Returns null if the provided string does not
 * contain a valid unit.
 * @param {String} str        A string like "5.2 inch", "4e2 kg"
 * @return {Unit | null} unit
 */
Unit.parse = function(str) {
  text = str;
  index = -1;
  c = '';

  if (!isString(text)) {
    return null;
  }

  next();
  skipWhitespace();
  var value = parseNumber();
  var name;
  if (value) {
    name = parseUnit();

    next();
    skipWhitespace();
    if (c) {
      // garbage at the end. not good.
      return null;
    }

    if (value && name) {
      try {
        // constructor will throw an error when unit is not found
        return new Unit(Number(value), name);
      }
      catch (err) {}
    }
  }
  else {
    name = parseUnit();

    next();
    skipWhitespace();
    if (c) {
      // garbage at the end. not good.
      return null;
    }

    if (name) {
      try {
        // constructor will throw an error when unit is not found
        return new Unit(null, name);
      }
      catch (err) {}
    }
  }

  return null;
};

/**
 * Test whether value is of type Unit
 * @param {*} value
 * @return {Boolean} isUnit
 */
Unit.isUnit = function(value) {
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
  return (value + this.unit.offset) * this.unit.value * this.prefix.value;
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
    return value / this.unit.value / this.prefix.value - this.unit.offset;
  }
  else {
    return value / this.unit.value / prefixValue - this.unit.offset;
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
  for (var name in UNITS) {
    if (UNITS.hasOwnProperty(name)) {
      if (string.endsWith(str, name) ) {
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
 * @param {String} name   A string to be tested whether it is a value less unit.
 *                        The unit can have prefix, like "cm"
 * @return {Boolean}      true if the given string is a unit
 */
Unit.isValuelessUnit = function (name) {
  return (_findUnit(name) != null);
};

/**
 * check if this unit has given base unit
 * @param {BASE_UNITS | undefined} base
 */
Unit.prototype.hasBase = function(base) {
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
 * @param {String | Unit} valuelessUnit   A unit without value. Can have prefix, like "cm"
 * @returns {Unit} unit having fixed, specified unit
 */
Unit.prototype.to = function (valuelessUnit) {
  var other;
  var value = this.value == null ? this._normalize(1) : this.value;
  if (isString(valuelessUnit)) {
    other = new Unit(null, valuelessUnit);

    if (!this.equalBase(other)) {
      throw new Error('Units do not match');
    }

    other.value = value;
    other.fixPrefix = true;
    return other;
  }
  else if (valuelessUnit instanceof Unit) {
    if (!this.equalBase(valuelessUnit)) {
      throw new Error('Units do not match');
    }
    if (valuelessUnit.value !== null) {
      throw new Error('Cannot convert to a unit with a value');
    }

    other = valuelessUnit.clone();
    other.value = value;
    other.fixPrefix = true;
    return other;
  }
  else {
    throw new Error('String or Unit expected as parameter');
  }
};

/**
 * Return the value of the unit when represented with given valueless unit
 * @param {String | Unit} valuelessUnit    For example 'cm' or 'inch'
 * @return {Number} value
 */
Unit.prototype.toNumber = function (valuelessUnit) {
  var other = this.to(valuelessUnit);
  return other._unnormalize(other.value, other.prefix.value);
};


/**
 * Get a string representation of the unit.
 * @return {String}
 */
Unit.prototype.toString = function() {
  return this.format();
};

/**
 * Returns the string representation of the unit.
 * @return {String}
 */
Unit.prototype.valueOf = Unit.prototype.toString;

/**
 * Get a string representation of the Unit, with optional formatting options.
 * @param {Object | Number | Function} [options]  Formatting options. See
 *                                                lib/util/number:format for a
 *                                                description of the available
 *                                                options.
 * @return {String}
 */
Unit.prototype.format = function(options) {
  var value,
      str;

  if (this.value !== null && !this.fixPrefix) {
    var bestPrefix = this._bestPrefix();
    value = this._unnormalize(this.value, bestPrefix.value);
    str = number.format(value, options) + ' ';
    str += bestPrefix.name + this.unit.name;
  }
  else {
    value = this._unnormalize(this.value);
    str = (this.value !== null) ? (number.format(value, options) + ' ') : '';
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
    'y': {name: 'y', value: 1e-42, scientific: true}
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
    'k': {name: 'k', value: 1024, scientific: true},
    'M': {name: 'M', value: Math.pow(1024, 2), scientific: true},
    'G': {name: 'G', value: Math.pow(1024, 3), scientific: true},
    'T': {name: 'T', value: Math.pow(1024, 4), scientific: true},
    'P': {name: 'P', value: Math.pow(1024, 5), scientific: true},
    'E': {name: 'E', value: Math.pow(1024, 6), scientific: true},
    'Z': {name: 'Z', value: Math.pow(1024, 7), scientific: true},
    'Y': {name: 'Y', value: Math.pow(1024, 8), scientific: true},

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
    'kilo': {name: 'kilo', value: 1024, scientific: true},
    'mega': {name: 'mega', value: Math.pow(1024, 2), scientific: true},
    'giga': {name: 'giga', value: Math.pow(1024, 3), scientific: true},
    'tera': {name: 'tera', value: Math.pow(1024, 4), scientific: true},
    'peta': {name: 'peta', value: Math.pow(1024, 5), scientific: true},
    'exa': {name: 'exa', value: Math.pow(1024, 6), scientific: true},
    'zetta': {name: 'zetta', value: Math.pow(1024, 7), scientific: true},
    'yotta': {name: 'yotta', value: Math.pow(1024, 8), scientific: true},

    'kibi': {name: 'kibi', value: 1024, scientific: true},
    'mebi': {name: 'mebi', value: Math.pow(1024, 2), scientific: true},
    'gibi': {name: 'gibi', value: Math.pow(1024, 3), scientific: true},
    'tebi': {name: 'tebi', value: Math.pow(1024, 4), scientific: true},
    'pebi': {name: 'pebi', value: Math.pow(1024, 5), scientific: true},
    'exi': {name: 'exi', value: Math.pow(1024, 6), scientific: true},
    'zebi': {name: 'zebi', value: Math.pow(1024, 7), scientific: true},
    'yobi': {name: 'yobi', value: Math.pow(1024, 8), scientific: true}
  }
};

var PREFIX_NONE = {name: '', value: 1, scientific: true};

var BASE_UNITS = {
  NONE: {},

  LENGTH: {},               // meter
  MASS: {},                 // kilogram
  TIME: {},                 // second
  CURRENT: {},              // ampere
  TEMPERATURE: {},          // kelvin
  LUMINOUS_INTENSITY: {},   // candela
  AMOUNT_OF_SUBSTANCE: {},  // mole

  FORCE: {},                // Newton
  SURFACE: {},              // m2
  VOLUME: {},               // m3
  ANGLE: {},                // rad
  BIT: {}                   // bit (digital)
};

var BASE_UNIT_NONE = {};

var UNIT_NONE = {name: '', base: BASE_UNIT_NONE, value: 1, offset: 0};

var UNITS = {
  // length
  meter: {name: 'meter', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.LONG, value: 1, offset: 0},
  inch: {name: 'inch', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.0254, offset: 0},
  foot: {name: 'foot', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.3048, offset: 0},
  yard: {name: 'yard', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.9144, offset: 0},
  mile: {name: 'mile', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 1609.344, offset: 0},
  link: {name: 'link', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.201168, offset: 0},
  rod: {name: 'rod', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 5.029210, offset: 0},
  chain: {name: 'chain', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 20.1168, offset: 0},
  angstrom: {name: 'angstrom', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 1e-10, offset: 0},

  m: {name: 'm', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.SHORT, value: 1, offset: 0},
  'in': {name: 'in', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.0254, offset: 0},
  ft: {name: 'ft', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.3048, offset: 0},
  yd: {name: 'yd', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.9144, offset: 0},
  mi: {name: 'mi', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 1609.344, offset: 0},
  li: {name: 'li', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.201168, offset: 0},
  rd: {name: 'rd', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 5.029210, offset: 0},
  ch: {name: 'ch', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 20.1168, offset: 0},
  mil: {name: 'mil', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.0000254, offset: 0}, // 1/1000 inch

  // Surface
  m2: {name: 'm2', base: BASE_UNITS.SURFACE, prefixes: PREFIXES.SQUARED, value: 1, offset: 0},
  sqin: {name: 'sqin', base: BASE_UNITS.SURFACE, prefixes: PREFIXES.NONE, value: 0.00064516, offset: 0}, // 645.16 mm2
  sqft: {name: 'sqft', base: BASE_UNITS.SURFACE, prefixes: PREFIXES.NONE, value: 0.09290304, offset: 0}, // 0.09290304 m2
  sqyd: {name: 'sqyd', base: BASE_UNITS.SURFACE, prefixes: PREFIXES.NONE, value: 0.83612736, offset: 0}, // 0.83612736 m2
  sqmi: {name: 'sqmi', base: BASE_UNITS.SURFACE, prefixes: PREFIXES.NONE, value: 2589988.110336, offset: 0}, // 2.589988110336 km2
  sqrd: {name: 'sqrd', base: BASE_UNITS.SURFACE, prefixes: PREFIXES.NONE, value: 25.29295, offset: 0}, // 25.29295 m2
  sqch: {name: 'sqch', base: BASE_UNITS.SURFACE, prefixes: PREFIXES.NONE, value: 404.6873, offset: 0}, // 404.6873 m2
  sqmil: {name: 'sqmil', base: BASE_UNITS.SURFACE, prefixes: PREFIXES.NONE, value: 6.4516e-10, offset: 0}, // 6.4516 * 10^-10 m2

  // Volume
  m3: {name: 'm3', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.CUBIC, value: 1, offset: 0},
  L: {name: 'L', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.SHORT, value: 0.001, offset: 0}, // litre
  l: {name: 'l', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.SHORT, value: 0.001, offset: 0}, // litre
  litre: {name: 'litre', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.LONG, value: 0.001, offset: 0},
  cuin: {name: 'cuin', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 1.6387064e-5, offset: 0}, // 1.6387064e-5 m3
  cuft: {name: 'cuft', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.028316846592, offset: 0}, // 28.316 846 592 L
  cuyd: {name: 'cuyd', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.764554857984, offset: 0}, // 764.554 857 984 L
  teaspoon: {name: 'teaspoon', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.000005, offset: 0}, // 5 mL
  tablespoon: {name: 'tablespoon', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.000015, offset: 0}, // 15 mL
  //{name: 'cup', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.000240, offset: 0}, // 240 mL  // not possible, we have already another cup
  drop: {name: 'drop', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 5e-8, offset: 0},  // 0.05 mL = 5e-8 m3
  gtt: {name: 'gtt', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 5e-8, offset: 0},  // 0.05 mL = 5e-8 m3

  // Liquid volume
  minim: {name: 'minim', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.00000006161152, offset: 0}, // 0.06161152 mL
  fluiddram: {name: 'fluiddram', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0000036966911, offset: 0},  // 3.696691 mL
  fluidounce: {name: 'fluidounce', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.00002957353, offset: 0}, // 29.57353 mL
  gill: {name: 'gill', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0001182941, offset: 0}, // 118.2941 mL
  cc: {name: 'cc', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 1e-6, offset: 0}, // 1e-6 L
  cup: {name: 'cup', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0002365882, offset: 0}, // 236.5882 mL
  pint: {name: 'pint', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0004731765, offset: 0}, // 473.1765 mL
  quart: {name: 'quart', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0009463529, offset: 0}, // 946.3529 mL
  gallon: {name: 'gallon', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.003785412, offset: 0}, // 3.785412 L
  beerbarrel: {name: 'beerbarrel', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.1173478, offset: 0}, // 117.3478 L
  oilbarrel: {name: 'oilbarrel', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.1589873, offset: 0}, // 158.9873 L
  hogshead: {name: 'hogshead', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.2384810, offset: 0}, // 238.4810 L

  //{name: 'min', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.00000006161152, offset: 0}, // 0.06161152 mL // min is already in use as minute
  fldr: {name: 'fldr', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0000036966911, offset: 0},  // 3.696691 mL
  floz: {name: 'floz', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.00002957353, offset: 0}, // 29.57353 mL
  gi: {name: 'gi', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0001182941, offset: 0}, // 118.2941 mL
  cp: {name: 'cp', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0002365882, offset: 0}, // 236.5882 mL
  pt: {name: 'pt', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0004731765, offset: 0}, // 473.1765 mL
  qt: {name: 'qt', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0009463529, offset: 0}, // 946.3529 mL
  gal: {name: 'gal', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.003785412, offset: 0}, // 3.785412 L
  bbl: {name: 'bbl', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.1173478, offset: 0}, // 117.3478 L
  obl: {name: 'obl', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.1589873, offset: 0}, // 158.9873 L
  //{name: 'hogshead', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.2384810, offset: 0}, // 238.4810 L // TODO: hh?

  // Mass
  g: {name: 'g', base: BASE_UNITS.MASS, prefixes: PREFIXES.SHORT, value: 0.001, offset: 0},
  gram: {name: 'gram', base: BASE_UNITS.MASS, prefixes: PREFIXES.LONG, value: 0.001, offset: 0},

  ton: {name: 'ton', base: BASE_UNITS.MASS, prefixes: PREFIXES.SHORT, value: 907.18474, offset: 0},
  tonne: {name: 'tonne', base: BASE_UNITS.MASS, prefixes: PREFIXES.SHORT, value: 1000, offset: 0},

  grain: {name: 'grain', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 64.79891e-6, offset: 0},
  dram: {name: 'dram', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 1.7718451953125e-3, offset: 0},
  ounce: {name: 'ounce', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 28.349523125e-3, offset: 0},
  poundmass: {name: 'poundmass', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 453.59237e-3, offset: 0},
  hundredweight: {name: 'hundredweight', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 45.359237, offset: 0},
  stick: {name: 'stick', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 115e-3, offset: 0},

  gr: {name: 'gr', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 64.79891e-6, offset: 0},
  dr: {name: 'dr', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 1.7718451953125e-3, offset: 0},
  oz: {name: 'oz', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 28.349523125e-3, offset: 0},
  lbm: {name: 'lbm', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 453.59237e-3, offset: 0},
  cwt: {name: 'cwt', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 45.359237, offset: 0},

  // Time
  s: {name: 's', base: BASE_UNITS.TIME, prefixes: PREFIXES.SHORT, value: 1, offset: 0},
  min: {name: 'min', base: BASE_UNITS.TIME, prefixes: PREFIXES.NONE, value: 60, offset: 0},
  h: {name: 'h', base: BASE_UNITS.TIME, prefixes: PREFIXES.NONE, value: 3600, offset: 0},
  second: {name: 'second', base: BASE_UNITS.TIME, prefixes: PREFIXES.LONG, value: 1, offset: 0},
  sec: {name: 'sec', base: BASE_UNITS.TIME, prefixes: PREFIXES.LONG, value: 1, offset: 0},
  minute: {name: 'minute', base: BASE_UNITS.TIME, prefixes: PREFIXES.NONE, value: 60, offset: 0},
  hour: {name: 'hour', base: BASE_UNITS.TIME, prefixes: PREFIXES.NONE, value: 3600, offset: 0},
  day: {name: 'day', base: BASE_UNITS.TIME, prefixes: PREFIXES.NONE, value: 86400, offset: 0},

  // Angle
  rad: {name: 'rad', base: BASE_UNITS.ANGLE, prefixes: PREFIXES.NONE, value: 1, offset: 0},
  // deg = rad / (2*pi) * 360 = rad / 0.017453292519943295769236907684888
  deg: {name: 'deg', base: BASE_UNITS.ANGLE, prefixes: PREFIXES.NONE, value: 0.017453292519943295769236907684888, offset: 0},
  // grad = rad / (2*pi) * 400  = rad / 0.015707963267948966192313216916399
  grad: {name: 'grad', base: BASE_UNITS.ANGLE, prefixes: PREFIXES.NONE, value: 0.015707963267948966192313216916399, offset: 0},
  // cycle = rad / (2*pi) = rad / 6.2831853071795864769252867665793
  cycle: {name: 'cycle', base: BASE_UNITS.ANGLE, prefixes: PREFIXES.NONE, value: 6.2831853071795864769252867665793, offset: 0},

  // Electric current
  A: {name: 'A', base: BASE_UNITS.CURRENT, prefixes: PREFIXES.SHORT, value: 1, offset: 0},
  ampere: {name: 'ampere', base: BASE_UNITS.CURRENT, prefixes: PREFIXES.LONG, value: 1, offset: 0},

  // Temperature
  // K(C) = °C + 273.15
  // K(F) = (°F + 459.67) / 1.8
  // K(R) = °R / 1.8
  K: {name: 'K', base: BASE_UNITS.TEMPERATURE, prefixes: PREFIXES.NONE, value: 1, offset: 0},
  degC: {name: 'degC', base: BASE_UNITS.TEMPERATURE, prefixes: PREFIXES.NONE, value: 1, offset: 273.15},
  degF: {name: 'degF', base: BASE_UNITS.TEMPERATURE, prefixes: PREFIXES.NONE, value: 1/1.8, offset: 459.67},
  degR: {name: 'degR', base: BASE_UNITS.TEMPERATURE, prefixes: PREFIXES.NONE, value: 1/1.8, offset: 0},
  kelvin: {name: 'kelvin', base: BASE_UNITS.TEMPERATURE, prefixes: PREFIXES.NONE, value: 1, offset: 0},
  celsius: {name: 'celsius', base: BASE_UNITS.TEMPERATURE, prefixes: PREFIXES.NONE, value: 1, offset: 273.15},
  fahrenheit: {name: 'fahrenheit', base: BASE_UNITS.TEMPERATURE, prefixes: PREFIXES.NONE, value: 1/1.8, offset: 459.67},
  rankine: {name: 'rankine', base: BASE_UNITS.TEMPERATURE, prefixes: PREFIXES.NONE, value: 1/1.8, offset: 0},

  // amount of substance
  mol: {name: 'mol', base: BASE_UNITS.AMOUNT_OF_SUBSTANCE, prefixes: PREFIXES.NONE, value: 1, offset: 0},
  mole: {name: 'mole', base: BASE_UNITS.AMOUNT_OF_SUBSTANCE, prefixes: PREFIXES.NONE, value: 1, offset: 0},

  // luminous intensity
  cd: {name: 'cd', base: BASE_UNITS.LUMINOUS_INTENSITY, prefixes: PREFIXES.NONE, value: 1, offset: 0},
  candela: {name: 'candela', base: BASE_UNITS.LUMINOUS_INTENSITY, prefixes: PREFIXES.NONE, value: 1, offset: 0},
  // TODO: units STERADIAN
  //{name: 'sr', base: BASE_UNITS.STERADIAN, prefixes: PREFIXES.NONE, value: 1, offset: 0},
  //{name: 'steradian', base: BASE_UNITS.STERADIAN, prefixes: PREFIXES.NONE, value: 1, offset: 0},

  // Force
  N: {name: 'N', base: BASE_UNITS.FORCE, prefixes: PREFIXES.SHORT, value: 1, offset: 0},
  newton: {name: 'newton', base: BASE_UNITS.FORCE, prefixes: PREFIXES.LONG, value: 1, offset: 0},
  lbf: {name: 'lbf', base: BASE_UNITS.FORCE, prefixes: PREFIXES.NONE, value: 4.4482216152605, offset: 0},
  poundforce: {name: 'poundforce', base: BASE_UNITS.FORCE, prefixes: PREFIXES.NONE, value: 4.4482216152605, offset: 0},

  // Binary
  b: {name: 'b', base: BASE_UNITS.BIT, prefixes: PREFIXES.BINARY_SHORT, value: 1, offset: 0},
  bits: {name: 'bits', base: BASE_UNITS.BIT, prefixes: PREFIXES.BINARY_LONG, value: 1, offset: 0},
  B: {name: 'B', base: BASE_UNITS.BIT, prefixes: PREFIXES.BINARY_SHORT, value: 8, offset: 0},
  bytes: {name: 'bytes', base: BASE_UNITS.BIT, prefixes: PREFIXES.BINARY_LONG, value: 8, offset: 0}
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

  amperes: 'ampere',
  moles: 'mole'
};

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

// end of unit aliases


// exports
module.exports = Unit;
