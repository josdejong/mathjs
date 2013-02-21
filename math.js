/**
 * math.js
 * An extended math library. Includes a parser, real and complex values, units,
 * matrices, strings, and a large set of functions and constants.
 * https://github.com/josdejong/mathjs
 *
 * @version @@version
 * @date    @@date
 *
 * @license
 * Copyright (C) 2013 Jos de Jong <wjosdejong@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

(function() {

/**
 * Define namespace
 */
var math = {
    type: {},
    parser: {}
};

/**
 * CommonJS module exports
 */
if ((typeof module !== 'undefined') && (typeof module.exports !== 'undefined')) {
    module.exports = math;
}
if (typeof exports !== 'undefined') {
    exports = math;
}

/**
 * AMD module exports
 */
if (typeof(require) != 'undefined' && typeof(define) != 'undefined') {
    define(function () {
        return math;
    });
}

/**
 * Browser exports
 */
if (typeof(window) != 'undefined') {
    window['math'] = math;
}

/**
 * Settings for math.js
 */

var options = {
    precision: 10  // number of decimals in formatted output
};

math.options = options;

var util = {};

/**
 * Convert a number to a formatted string representation
 * @param {Number} value            The value to be formatted
 * @param {Number} [digits]         number of digits
 * @return {String} formattedValue  The formatted value
 */
util.format = function (value, digits) {
    if (value === Infinity) {
        return 'Infinity';
    }
    else if (value === -Infinity) {
        return '-Infinity';
    }
    else if (value === NaN) {
        return 'NaN';
    }

    // TODO: what is a nice limit for non-scientific values?
    var abs = Math.abs(value);
    if ( (abs > 0.0001 && abs < 1000000) || abs == 0.0 ) {
        // round the func to a limited number of digits
        return String(roundNumber(value, digits));
    }
    else {
        // scientific notation
        var exp = Math.round(Math.log(abs) / Math.LN10);
        var v = value / (Math.pow(10.0, exp));
        return roundNumber(v, digits) + 'E' + exp;
    }
};

/**
 * Create a semi UUID
 * source: http://stackoverflow.com/a/105074/1262753
 * @return {String} uuid
 */
util.randomUUID = function () {
    var S4 = function () {
        return Math.floor(
            Math.random() * 0x10000 /* 65536 */
        ).toString(16);
    };

    return (
        S4() + S4() + '-' +
            S4() + '-' +
            S4() + '-' +
            S4() + '-' +
            S4() + S4() + S4()
        );
};

// Internet Explorer 8 and older does not support Array.indexOf,
// so we define it here in that case
// http://soledadpenades.com/2007/05/17/arrayindexof-in-internet-explorer/
if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj){
        for(var i = 0; i < this.length; i++){
            if(this[i] == obj){
                return i;
            }
        }
        return -1;
    };

    try {
        console.log("Warning: Ancient browser detected. Please update your browser");
    }
    catch (err) {
    }
}

// Internet Explorer 8 and older does not support Array.forEach,
// so we define it here in that case
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fn, scope) {
        for(var i = 0, len = this.length; i < len; ++i) {
            fn.call(scope || this, this[i], i, this);
        }
    }
}

/**
 * @constructor math.type.Unit
 *
 * @param {Number} [value]     A value for the unit, like 5.2
 * @param {String} [prefixUnit]  A unit like "cm" or "inch"
 */
function Unit(value, prefixUnit) {
    if (this.constructor != Unit) {
        throw new Error('Unit constructor must be called with the new operator');
    }

    this.value = 1;
    this.unit = Unit.UNIT_NONE;
    this.prefix = Unit.PREFIX_NONE;  // link to a list with supported prefixes

    this.hasUnit = false;
    this.hasValue = false;
    this.fixPrefix = false;  // is set true by the method "x In unit"s

    this._init(value, prefixUnit);
}

math.type.Unit = Unit;

/**
 * Test whether value is a Unit
 * @param {*} value
 * @return {Boolean} isUnit
 */
function isUnit(value) {
    return (value instanceof Unit);
}

/**
 * create a copy of this unit
 * @return {Unit} copy
 */
Unit.prototype.copy = function () {
    var clone = new Unit();

    for (var p in this) {
        if (this.hasOwnProperty(p)) {
            clone[p] = this[p];
        }
    }

    return clone;
};

/**
 * check if a text ends with a certain string
 * @param {String} text
 * @param {String} search
 */
    // TODO: put the endsWith method in another
Unit.endsWith = function(text, search) {
    var start = text.length - search.length;
    var end = text.length;
    return (text.substring(start, end) === search);
};

/**
 * Initialize a unit and value
 * @param {Number} [value]
 * @param {String} [unit]   A string containing unit (and prefix), like "cm"
 * @private
 */
Unit.prototype._init = function (value, unit)  {
    // find the unit and prefix from the string
    if (unit !== undefined) {
        var UNITS = Unit.UNITS;
        var found = false;
        for (var i = 0, iMax = UNITS.length; i < iMax; i++) {
            var UNIT = UNITS[i];

            if (Unit.endsWith(unit, UNIT.name) ) {
                var prefixLen = (unit.length - UNIT.name.length);
                var prefixName = unit.substring(0, prefixLen);
                var prefix = UNIT.prefixes[prefixName];
                if (prefix !== undefined) {
                    // store unit, prefix, and value
                    this.unit = UNIT;
                    this.prefix = prefix;
                    this.hasUnit = true;

                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            throw new Error('String "' + unit + '" is no unit');
        }
    }

    if (value !== undefined) {
        this.value = this._normalize(value);
        this.hasValue = true;
    }
    else {
        this.value = this._normalize(1);
    }
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
 * @param {Number} prefixValue    Optional prefixvalue to be used
 * @return {Number} unnormalized value
 * @private
 */
Unit.prototype._unnormalize = function (value, prefixValue) {
    if (prefixValue === undefined) {
        return value / this.unit.value / this.prefix.value -
            this.unit.offset;
    }
    else {
        return value / this.unit.value / prefixValue -
            this.unit.offset;
    }
};

/**
 * Test if the given expression is a unit
 * @param {String} unit   A unit with prefix, like "cm"
 * @return {Boolean}      true if the given string is a unit
 */
Unit.isUnit = function (unit) {
    var UNITS = Unit.UNITS;
    var num = UNITS.length;
    for (var i = 0; i < num; i++) {
        var UNIT = UNITS[i];

        if (Unit.endsWith(unit, UNIT.name) ) {
            var prefixLen = (unit.length - UNIT.name.length);
            if (prefixLen == 0) {
                return true;
            }

            var prefixName = unit.substring(0, prefixLen);
            var prefix = UNIT.prefixes[prefixName];
            if (prefix !== undefined) {
                return true;
            }
        }
    }

    return false;
};

/**
 * check if this unit has given base unit
 * @param {math.type.Unit.BASE_UNITS} base
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
 * Get string representation
 * @return {String}
 */
Unit.prototype.toString = function() {
    var value;
    if (!this.fixPrefix) {
        // find the best prefix value (resulting in the value of which
        // the absolute value of the log10 is closest to zero,
        // though with a little offset of 1.5 for nicer values: 999m
        // is still displayed as 999m, and 1000m as 1km)
        var bestPrefix = Unit.PREFIX_NONE;
        var bestDiff = Math.abs(
            Math.log(this.value / bestPrefix.value) / Math.LN10 - 1.5);

        // TODO: 1000m is still displayed as 1000m, 1001m correctly as 1.001km
        // TODO: working wrong with prefixes below zero, should do + 1.5 offset?
        var prefixes = this.unit.prefixes;
        for (var p in prefixes) {
            if (prefixes.hasOwnProperty(p)) {
                var prefix = prefixes[p];
                if (prefix.scientific) {
                    var diff = Math.abs(
                        Math.log(this.value / prefix.value) / Math.LN10 - 1.5);

                    if (diff < bestDiff) {
                        bestPrefix = prefix;
                        bestDiff = diff;
                    }
                }
            }
        }

        value = this._unnormalize(this.value, bestPrefix.value);
        return util.format(value) + ' ' + bestPrefix.name + this.unit.name;
    }
    else {
        value = this._unnormalize(this.value);
        return util.format(value) + ' ' + this.prefix.name + this.unit.name;
    }
};

Unit.PREFIXES = {
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

Unit.PREFIX_NONE = {'name': '', 'value': 1, 'scientific': true};

Unit.BASE_UNITS = {
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

var BASE_UNITS = Unit.BASE_UNITS;
var PREFIXES = Unit.PREFIXES;

Unit.BASE_UNIT_NONE = {};

Unit.UNIT_NONE = {'name': '', 'base': Unit.BASE_UNIT_NONE, 'value': 1, 'offset': 0};

Unit.UNITS = [
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

/**
 * The build in String object of Javascript is used.
 */

/**
 * Test whether value is a String
 * @param {*} value
 * @return {Boolean} isString
 */
function isString(value) {
    return (value instanceof String) || (typeof value == 'string');
}

/**
 * The build in Number object of Javascript is used.
 */


/**
 * Test whether value is a Number
 * @param {*} value
 * @return {Boolean} isNumber
 */
function isNumber(value) {
    return (value instanceof Number) || (typeof value == 'number');
}

/**
 * Check if a number is integer
 * @param {Number} value
 * @return {Boolean} isInteger
 */
function isInteger(value) {
    return (value == Math.round(value));
}

/**
 * @constructor math.type.Complex
 *
 * @param {Number} [re]
 * @param {Number} [im]
 */
function Complex(re, im) {
    if (this.constructor != Complex) {
        throw new Error('Complex constructor must be called with the new operator');
    }

    /**
     * @type {Number}
     */
    this.re = re || 0;

    /**
     * @type {Number}
     */
    this.im = im || 0;
}

math.type.Complex = Complex;

/**
 * Test whether value is a Complex value
 * @param {*} value
 * @return {Boolean} isComplex
 */
function isComplex(value) {
    return (value instanceof Complex);
}

/**
 * Create a copy of the complex value
 * @return {Complex} copy
 */
Complex.prototype.copy = function () {
    return new Complex(this.re, this.im);
};

/**
 * Get string representation of the Complex value
 * @return {String} str
 */
Complex.prototype.toString = function () {
    var str = '';

    if (this.im === 0) {
        // real value
        str = util.format(this.re);
    }
    else if (this.re === 0) {
        // purely complex value
        if (this.im === 1) {
            str = 'i';
        }
        else if (this.im === -1) {
            str = '-i';
        }
        else {
            str = util.format(this.im) + 'i';
        }
    }
    else {
        // complex value
        if (this.im > 0) {
            if (this.im == 1) {
                str = util.format(this.re) + ' + i';
            }
            else {
                str = util.format(this.re) + ' + ' + util.format(this.im) + 'i';
            }
        }
        else {
            if (this.im == -1) {
                str = util.format(this.re) + ' - i';
            }
            else {
                str = util.format(this.re) + ' - ' + util.format(Math.abs(this.im)) + 'i';
            }
        }
    }

    return str;
};

/**
 * Type documentation
 */
Complex.doc = {
    'name': 'Complex',
    'category': 'type',
    'syntax': [
        'a + bi',
        'a + b * i'
    ],
    'description':
        'A complex value a + bi, ' +
            'where a is the real part and b is the complex part, ' +
            'and i is the imaginary number defined as sqrt(-1).',
    'examples': [
        '2 + 3i',
        'sqrt(-4)',
        '(1.2 -5i) * 2'
    ],
    'seealso': [
        'abs',
        'arg',
        'conj',
        'im',
        're'
    ]
};


/**
 * mathjs constants
 */
math.E          = Math.E;
math.LN2        = Math.LN2;
math.LN10       = Math.LN10;
math.LOG2E      = Math.LOG2E;
math.LOG10E     = Math.LOG10E;
math.PI         = Math.PI;
math.SQRT1_2    = Math.SQRT1_2;
math.SQRT2      = Math.SQRT2;

math.I          = new Complex(0, -1);

// lower case constants
math.pi        = math.PI;
math.e         = math.E;
math.i         = math.I;

/**
 * Helper methods for functions
 */

/**
 * Create a TypeError with message:
 *      'Function <fn> does not support a parameter of type <type>';
 * @param {String} fn
 * @param {*} value1
 * @param {*} [value2]
 * @return {TypeError | Error} error
 */
function newUnsupportedTypeError(fn, value1, value2) {
    var msg = undefined;
    if (arguments.length == 2) {
        var t = _typeof(value1);
        msg = 'Function ' + fn + ' does not support a parameter of type ' + t;
    }
    else if (arguments.length > 2) {
        var types = [];
        for (var i = 1; i < arguments.length; i++) {
            types.push(_typeof(arguments[i]));
        }
        msg = 'Function ' + fn + ' does not support a parameters of type ' + types.join(', ');
    }
    else {
        msg = 'Unsupported parameter in function ' + fn;
    }

    return new TypeError(msg);
}

/**
 * Display documentation on a function or data type
 * @param {function | string | Object} subject
 * @return {String} documentation
 */
function help(subject) {
    if (subject.doc) {
        return generateDoc(subject.doc);
    }
    else if (subject.constructor.doc) {
        return generateDoc(subject.constructor.doc);
    }
    else if (isString(subject)) {
        // search the subject in the methods
        var obj = math[subject];
        if (obj && obj.doc) {
            return generateDoc(obj.doc);
        }

        // search the subject in the types
        for (var t in math.type) {
            if (math.type.hasOwnProperty(t)) {
                if (subject.toLowerCase() == t.toLowerCase() && math.type[t].doc) {
                    return generateDoc(math.type[t].doc);
                }
            }
        }
    }

    // TODO: generate documentation for constants, number and string

    if (subject instanceof Object && subject.name) {
        return 'No documentation found on subject "' + subject.name +'"';
    }
    else if (subject instanceof Object && subject.constructor.name) {
        return 'No documentation found on subject "' + subject.constructor.name +'"';
    }
    else {
        return 'No documentation found on subject "' + subject +'"';
    }
}

math.help = help;

/**
 * Generate readable documentation from a documentation object
 * @param {Object} doc
 * @return {String} readableDoc
 * @private
 */
function generateDoc (doc) {
    var desc = '';

    if (doc.name) {
        desc += 'NAME\n' + doc.name + '\n\n';
    }
    if (doc.category) {
        desc += 'CATEGORY\n' + doc.category + '\n\n';
    }
    if (doc.syntax) {
        desc += 'SYNTAX\n' + doc.syntax.join('\n') + '\n\n';
    }
    if (doc.examples) {
        desc += 'EXAMPLES\n';
        for (var i = 0; i < doc.examples.length; i++) {
            desc += doc.examples[i] + '\n';
            // TODO: evaluate the examples
        }
        desc += '\n';
    }
    if (doc.seealso) {
        desc += 'SEE ALSO\n' + doc.seealso.join(', ') + '\n';
    }

    return desc;
}

math.abs = abs;

/**
 * Function documentation
 */
help.doc = {
    'name': 'help',
    'category': 'Utils',
    'syntax': [
        'help(object)'
    ],
    'description': 'Display documentation on a function or data type.',
    'examples': [
        'help("sqrt")',
        'help("Complex")'
    ],
    'seealso': []
};

/**
 * Calculate the square root of a value
 * @param {*} x
 * @return {String} type  Lower case type, for example "number", "string",
 *                        "array".
 */
function _typeof(x) {
    var type = typeof x;

    if (type == 'object') {
        if (x == null) {
            return 'null';
        }
        if (x && x.constructor && x.constructor.name) {
            return x.constructor.name.toLowerCase();
        }
    }

    return type;
}

math['typeof'] = _typeof;

/**
 * Function documentation
 */
_typeof.doc = {
    'name': 'typeof',
    'category': 'Utils',
    'syntax': [
        'typeof(x)'
    ],
    'description': 'Get the type of a variable.',
    'examples': [
        'typeof(3.5)',
        'typeof(2 - 4i)',
        'typeof(45 deg)',
        'typeof("hello world")'
    ],
    'seealso': []
};

/**
 * Compute the minimum value of a list of values, min(a, b, c, ...)
 * @param {... *} args  one or multiple arguments
 * @return {*} res
 */
function min(args) {
    if (arguments.length == 0) {
        throw new Error('Function sum requires one or multiple parameters (0 provided)');
    }

    // TODO: implement array support
    // TODO: implement matrix support

    var min = arguments[0];
    for (var i = 1, iMax = arguments.length; i < iMax; i++) {
        var value = arguments[i];
        if (smaller(value, min)) {
            min = value;
        }
    }

    return max;
}

math.min = min;

/**
 * Function documentation
 */
min.doc = {
    'name': 'min',
    'category': 'Statistics',
    'syntax': [
        'min(a, b, c, ...)'
    ],
    'description': 'Compute the minimum value of a list of values.',
    'examples': [
        'max(2, 3, 4, 1)',
        'max(2.7, 7.1, -4.5, 2.0, 4.1)',
        'min(2.7, 7.1, -4.5, 2.0, 4.1)'
    ],
    'seealso': [
        'sum',
        'prod',
        'avg',
        'var',
        'std',
        'min',
        'median'
    ]
};

/**
 * Compute the maximum value of a list of values, max(a, b, c, ...)
 * @param {... *} args  one or multiple arguments
 * @return {*} res
 */
function max(args) {
    if (arguments.length == 0) {
        throw new Error('Function sum requires one or multiple parameters (0 provided)');
    }

    // TODO: implement array support
    // TODO: implement matrix support

    var max = arguments[0];
    for (var i = 1, iMax = arguments.length; i < iMax; i++) {
        var value = arguments[i];
        if (larger(value, max)) {
            max = value;
        }
    }

    return max;
}

math.max = max;

/**
 * Function documentation
 */
max.doc = {
    'name': 'max',
    'category': 'Statistics',
    'syntax': [
        'max(a, b, c, ...)'
    ],
    'description': 'Compute the maximum value of a list of values.',
    'examples': [
        'max(2, 3, 4, 1)',
        'max(2.7, 7.1, -4.5, 2.0, 4.1)',
        'min(2.7, 7.1, -4.5, 2.0, 4.1)'
    ],
    'seealso': [
        'sum',
        'prod',
        'avg',
        'var',
        'std',
        'min',
        'median'
    ]
};

/**
 * Change the unit of a value. x in unit or in(x, unit)
 * @param {Unit} x
 * @param {Unit} unit
 * @return {Unit} res
 */
function unit_in(x, unit) {
    if (x instanceof Unit) {
        // Test if unit has no value
        if (unit.hasValue) {
            throw new Error('Cannot convert to a unit with a value');
        }
        // Test if unit has a unit
        if (!unit.hasUnit) {
            throw new Error('Unit expected on the right hand side of function in');
        }

        var res = unit.copy();
        res.value = x.value;
        res.fixPrefix = true;

        return res;
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('in', x);
}

math['in'] = unit_in;

/**
 * Function documentation
 */
unit_in.doc ={
    'name': 'in',
    'category': 'Units',
    'syntax': [
        'x in unit',
        'in(x, unit)'
    ],
    'description': 'Change the unit of a value.',
    'examples': [
        '5 inch in cm',
        '3.2kg in g',
        '16 bytes in bits'
    ],
    'seealso': []
};

/**
 * Calculate the sine of a value, sin(x)
 * @param {Number | Complex | Unit} x
 * @return {Number | Complex} res
 */
function sin(x) {
    if (isNumber(x)) {
        return Math.sin(x);
    }

    if (x instanceof Complex) {
        return new Complex(
            0.5 * Math.sin(x.re) * (Math.exp(-x.im) + Math.exp( x.im)),
            0.5 * Math.cos(x.re) * (Math.exp( x.im) - Math.exp(-x.im))
        );
    }

    if (x instanceof Unit) {
        if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
            throw new TypeError ('Unit in function cos is no angle');
        }
        return Math.sin(x.value);
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('sin', x);
}

math.sin = sin;

/**
 * Function documentation
 */
sin.doc = {
    'name': 'sin',
    'category': 'Trigonometry',
    'syntax': [
        'sin(x)'
    ],
    'description': 'Compute the sine of x in radians.',
    'examples': [
        'sin(2)',
        'sin(pi / 4) ^ 2',
        'sin(90 deg)',
        'sin(30 deg)',
        'sin(0.2)^2 + cos(0.2)^2'
    ],
    'seealso': [
        'asin',
        'cos',
        'tan'
    ]
};

/**
 * Computes the principal value of the arc tangent of y/x in radians, atan2(y,x)
 * @param {Number | Complex} y
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function atan2(y, x) {
    if (isNumber(y)) {
        if (isNumber(x)) {
            return Math.atan2(y, x);
        }
        else if (x instanceof Complex) {
            return Math.atan2(y, x.re);
        }
    }
    else if (y instanceof Complex) {
        if (isNumber(x)) {
            return Math.atan2(y.re, x);
        }
        else if (x instanceof Complex) {
            return Math.atan2(y.re, x.re);
        }
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('atan2', y, x);
}

math.atan2 = atan2;

/**
 * Function documentation
 */
atan2.doc = {
    'name': 'atan2',
    'category': 'Trigonometry',
    'syntax': [
        'atan2(y, x)'
    ],
    'description':
        'Computes the principal value of the arc tangent of y/x in radians.',
    'examples': [
        'atan2(2, 2) / pi',
        'angle = 60 deg in rad',
        'x = cos(angle)',
        'y = sin(angle)',
        'atan2(y, x)'
    ],
    'seealso': [
        'sin',
        'cos',
        'tan'
    ]
};

/**
 * Calculate the inverse sine of a value, asin(x)
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function asin(x) {
    if (isNumber(x)) {
        if (x >= -1 && x <= 1) {
            return Math.asin(x);
        }
        else {
            return asin(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
        // asin(z) = -i*log(iz + sqrt(1-z^2))
        var re = x.re;
        var im = x.im;
        var temp1 = new Complex(
            im * im - re * re + 1.0,
            -2.0 * re * im
        );

        var temp2 = sqrt(temp1);
        var temp3 = new Complex(
            temp2.re - im,
            temp2.im + re
        );

        var temp4 = log(temp3);

        return new Complex(temp4.im, -temp4.re);
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('asin', x);
}

math.asin = asin;

/**
 * Function documentation
 */
asin.doc = {
    'name': 'asin',
    'category': 'Trigonometry',
    'syntax': [
        'asin(x)'
    ],
    'description': 'Compute the inverse sine of a value in radians.',
    'examples': [
        'asin(0.5)',
        'asin(sin(2.3))'
    ],
    'seealso': [
        'sin',
        'acos',
        'asin'
    ]
};

/**
 * Calculate the inverse tangent of a value, atan(x)
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function atan(x) {
    if (isNumber(x)) {
        return Math.atan(x);
    }

    if (x instanceof Complex) {
        // atan(z) = 1/2 * i * (ln(1-iz) - ln(1+iz))
        var re = x.re;
        var im = x.im;
        var den = re * re + (1.0 - im) * (1.0 - im);

        var temp1 = new Complex(
            (1.0 - im * im - re * re) / den,
            (-2.0 * re) / den
        );
        var temp2 = log(temp1);

        return new Complex(
            -0.5 * temp2.im,
            0.5 * temp2.re
        );
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('atan', x);
}

math.atan = atan;

/**
 * Function documentation
 */
atan.doc = {
    'name': 'atan',
    'category': 'Trigonometry',
    'syntax': [
        'atan(x)'
    ],
    'description': 'Compute the inverse tangent of a value in radians.',
    'examples': [
        'atan(0.5)',
        'atan(tan(2.3))'
    ],
    'seealso': [
        'tan',
        'acos',
        'asin'
    ]
};

/**
 * Calculate the cosine of a value, cos(x)
 * @param {Number | Complex | Unit} x
 * @return {Number | Complex} res
 */
function cos(x) {
    if (isNumber(x)) {
        return Math.cos(x);
    }

    if (x instanceof Complex) {
        // cos(z) = (exp(iz) + exp(-iz)) / 2
        return new Complex(
            0.5 * Math.cos(x.re) * (Math.exp(-x.im) + Math.exp(x.im)),
            0.5 * Math.sin(x.re) * (Math.exp(-x.im) - Math.exp(x.im))
        );
    }

    if (x instanceof Unit) {
        if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
            throw new TypeError ('Unit in function cos is no angle');
        }
        return Math.cos(x.value);
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('cos', x);
}

math.cos = cos;

/**
 * Function documentation
 */
cos.doc = {
    'name': 'cos',
    'category': 'Trigonometry',
    'syntax': [
        'cos(x)'
    ],
    'description': 'Compute the cosine of x in radians.',
    'examples': [
        'cos(2)',
        'cos(pi / 4) ^ 2',
        'cos(180 deg)',
        'cos(60 deg)',
        'sin(0.2)^2 + cos(0.2)^2'
    ],
    'seealso': [
        'acos',
        'sin',
        'tan'
    ]
};

/**
 * Calculate the tangent of a value, tan(x)
 * @param {Number | Complex | Unit} x
 * @return {Number | Complex} res
 */
function tan(x) {
    if (isNumber(x)) {
        return Math.tan(x);
    }

    if (x instanceof Complex) {
        var den = Math.exp(-4.0 * x.im) +
            2.0 * Math.exp(-2.0 * x.im) * Math.cos(2.0 * x.re) +
            1.0;

        return new Complex(
             2.0 * Math.exp(-2.0 * x.im) * Math.sin(2.0 * x.re) / den,
            (1.0 - Math.exp(-4.0 * x.im)) / den
        );
    }

    if (x instanceof Unit) {
        if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
            throw new TypeError ('Unit in function tan is no angle');
        }
        return Math.tan(x.value);
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('tan', x);
}

math.tan = tan;

/**
 * Function documentation
 */
tan.doc = {
    'name': 'tan',
    'category': 'Trigonometry',
    'syntax': [
        'tan(x)'
    ],
    'description': 'Compute the tangent of x in radians.',
    'examples': [
        'tan(0.5)',
        'sin(0.5) / cos(0.5)',
        'tan(pi / 4)',
        'tan(45 deg)'
    ],
    'seealso': [
        'atan',
        'sin',
        'cos'
    ]
};

/**
 * Calculate the inverse cosine of a value, acos(x)
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function acos(x) {
    if (isNumber(x)) {
        if (x >= -1 && x <= 1) {
            return Math.acos(x);
        }
        else {
            return acos(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
        // acos(z) = 0.5*pi + i*log(iz + sqrt(1-z^2))
        var temp1 = new Complex(
            x.im * x.im - x.re * x.re + 1.0,
            -2.0 * x.re * x.im
        );
        var temp2 = sqrt(temp1);
        var temp3 = new Complex(
            temp2.re - x.im,
            temp2.im + x.re
        );
        var temp4 = log(temp3);

        // 0.5*pi = 1.5707963267948966192313216916398
        return new Complex(
            1.57079632679489661923 - temp4.im,
            temp4.re
        );
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('acos', x);
}

math.acos = acos;

/**
 * Function documentation
 */
acos.doc = {
    'name': 'acos',
    'category': 'Trigonometry',
    'syntax': [
        'acos(x)'
    ],
    'description': 'Compute the inverse cosine of a value in radians.',
    'examples': [
        'acos(0.5)',
        'acos(cos(2.3))'
    ],
    'seealso': [
        'cos',
        'acos',
        'asin'
    ]
};

/**
 * Divide two values. x / y or divide(x, y)
 * @param  {Number | Complex | Unit} x
 * @param  {Number | Complex} y
 * @return {Number | Complex | Unit} res
 */
function divide(x, y) {
    if (isNumber(x)) {
        if (isNumber(y)) {
            // number / number
            return x / y;
        }
        else if (y instanceof Complex) {
            // number / complex
            return divideComplex(new Complex(x), y);
        }
    }
    else if (x instanceof Complex) {
        if (isNumber(y)) {
            // complex / number
            return divideComplex(x, new Complex(y));
        }
        else if (y instanceof Complex) {
            // complex / complex
            return divideComplex(x, y);
        }
    }
    else if (x instanceof Unit) {
        if (isNumber(y)) {
            var res = x.copy();
            res.value /= y;
            return res;
        }
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('divide', x, y);
}

/**
 * Divide two complex values. x / y or divide(x, y)
 * @param {Complex} x
 * @param {Complex} y
 * @return {Complex} res
 * @private
 */
function divideComplex (x, y) {
    var den = y.re * y.re + y.im * y.im;
    return new Complex(
        (x.re * y.re + x.im * y.im) / den,
        (x.im * y.re - x.re * y.im) / den
    );
}

math.divide = divide;

/**
 * Function documentation
 */
divide.doc = {
    'name': 'divide',
    'category': 'Operators',
    'syntax': [
        'x / y',
        'divide(x, y)'
    ],
    'description': 'Divide two values.',
    'examples': [
        '2 / 3',
        'ans * 3',
        '4.5 / 2',
        '3 + 4 / 2',
        '(3 + 4) / 2',
        '18 km / 4.5'
    ],
    'seealso': [
        'multiply'
    ]
};

/**
 * Round a value towards the nearest integer, round(x [, n])
 * @param {Number | Complex} x
 * @param {Number} [n] number of digits
 * @return {Number | Complex} res
 */
function round(x, n) {
    if (n == undefined) {
        // round (x)
        if (isNumber(x)) {
            return Math.round(x);
        }

        if (x instanceof Complex) {
            return new Complex (
                Math.round(x.re),
                Math.round(x.im)
            );
        }

        throw newUnsupportedTypeError('round', x);
    }
    else {
        // round (x, n)
        if (!isNumber(n)) {
            throw new TypeError('Number of digits in function round must be an integer');
        }
        if (n !== Math.round(n)) {
            throw new TypeError('Number of digits in function round must be integer');
        }
        if (n < 0 || n > 9) {
            throw new Error ('Number of digits in function round must be in te range of 0-9');
        }

        if (isNumber(x)) {
            return roundNumber(x, n);
        }

        if (x instanceof Complex) {
            return new Complex (
                roundNumber(x.re, n),
                roundNumber(x.im, n)
            );
        }

        throw newUnsupportedTypeError('round', x, n);
    }

    // TODO: implement array support
    // TODO: implement matrix support

}

math.round = round;

/**
 * round a number to the given number of digits, or to the default if
 * digits is not provided
 * @param {Number} value
 * @param {Number} [digits]  number of digits, between 0 and 15
 * @return {Number} roundedValue
 */
function roundNumber (value, digits) {
    var p = Math.pow(10, (digits != undefined) ? digits : options.precision);
    return Math.round(value * p) / p;
}

/**
 * Function documentation
 */
round.doc = {
    'name': 'round',
    'category': 'Arithmetic',
    'syntax': [
        'round(x)',
        'round(x, n)'
    ],
    'description':
        'round a value towards the nearest integer.' +
            'If x is complex, both real and imaginary part are rounded ' +
            'towards the nearest integer. ' +
            'When n is specified, the value is rounded to n decimals.',
    'examples': [
        'round(3.2)',
        'round(3.8)',
        'round(-4.2)',
        'round(-4.8)',
        'round(pi, 3)',
        'round(123.45678, 2)'
    ],
    'seealso': ['ceil', 'floor', 'fix']
};

/**
 * Round a value towards zero, fix(x)
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function fix(x) {
    if (isNumber(x)) {
        return (value > 0) ? Math.floor(x) : Math.ceil(x);
    }

    if (x instanceof Complex) {
        return new Complex(
            (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
            (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
        );
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('fix', x);
}

math.fix = fix;

/**
 * Function documentation
 */
fix.doc = {
    'name': 'fix',
    'category': 'Arithmetic',
    'syntax': [
        'fix(x)'
    ],
    'description':
        'Round a value towards zero.' +
            'If x is complex, both real and imaginary part are rounded ' +
            'towards zero.',
    'examples': [
        'fix(3.2)',
        'fix(3.8)',
        'fix(-4.2)',
        'fix(-4.8)'
    ],
    'seealso': ['ceil', 'floor', 'round']
};

/**
 * Add two values. x + y or add(x, y)
 * @param  {Number | Complex | Unit | String} x
 * @param  {Number | Complex | Unit | String} y
 * @return {Number | Complex | Unit | String} res
 */
function add(x, y) {
    if (isNumber(x)) {
        if (isNumber(y)) {
            // number + number
            return x + y;
        }
        else if (y instanceof Complex) {
            // number + complex
            return new Complex(
                x + y.re,
                    y.im
            )
        }
    }
    else if (x instanceof Complex) {
        if (isNumber(y)) {
            // complex + number
            return new Complex(
                x.re + y,
                x.im
            )
        }
        else if (y instanceof Complex) {
            // complex + complex
            return new Complex(
                x.re + y.re,
                x.im + y.im
            );
        }
    }
    else if (x instanceof Unit) {
        if (y instanceof Unit) {
            if (!x.equalBase(y)) {
                throw new Error('Units do not match');
            }

            if (!x.hasValue) {
                throw new Error('Unit on left hand side of operator + has no value');
            }

            if (!y.hasValue) {
                throw new Error('Unit on right hand side of operator + has no value');
            }

            var res = x.copy();
            res.value += y.value;
            res.fixPrefix = false;
            return res;
        }
    }

    if (isString(x) || isString(y)) {
        return x + y;
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('add', x, y);
}

math.add = add;

/**
 * Function documentation
 */
add.doc = {
    'name': 'add',
    'category': 'Operators',
    'syntax': [
        'x + y',
        'add(x, y)'
    ],
    'description': 'Add two values.',
    'examples': [
        '2.1 + 3.6',
        'ans - 3.6',
        '3 + 2i',
        '"hello" + " world"',
        '3 cm + 2 inch'
    ],
    'seealso': [
        'subtract'
    ]
};

/**
 * Calculate the exponent of a value, exp(x)
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function exp (x) {
    if (isNumber(x)) {
        return Math.exp(x);
    }
    if (x instanceof Complex) {
        var r = Math.exp(x.re);
        return new Complex(
            r * Math.cos(x.im),
            r * Math.sin(x.im)
        );
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('exp', x);
}

math.exp = exp;

/**
 * Function documentation
 */
exp.doc = {
    'name': 'exp',
    'category': 'Arithmetic',
    'syntax': [
        'exp(x)'
    ],
    'description': 'Calculate the exponent of a value.',
    'examples': [
        'exp(1.3)',
        'e ^ 1.3',
        'log(exp(1.3))',
        'x = 2.4',
        '(exp(i*x) == cos(x) + i*sin(x))   # Euler\'s formula'
    ],
    'seealso': [
        'square',
        'multiply',
        'log'
    ]
};
/**
 * Calculate the square root of a value
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function sqrt (x) {
    if (isNumber(x)) {
        if (x >= 0) {
            return Math.sqrt(x);
        }
        else {
            return sqrt(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
        var r = Math.sqrt(x.re * x.re + x.im * x.im);
        if (x.im >= 0.0) {
            return new Complex(
                0.5 * Math.sqrt(2.0 * (r + x.re)),
                0.5 * Math.sqrt(2.0 * (r - x.re))
            );
        }
        else {
            return new Complex(
                0.5 * Math.sqrt(2.0 * (r + x.re)),
                -0.5 * Math.sqrt(2.0 * (r - x.re))
            );
        }
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('sqrt', x);
}

math.sqrt = sqrt;

/**
 * Function documentation
 */
sqrt.doc = {
    'name': 'sqrt',
    'category': 'Arithmetic',
    'syntax': [
        'sqrt(x)'
    ],
    'description':
        'Compute the square root value. ' +
            'If x = y * y, then y is the square root of x.',
    'examples': [
        'sqrt(25)',
        '5 * 5',
        'sqrt(-1)'
    ],
    'seealso': [
        'square',
        'multiply'
    ]
};

/**
 * Check if value x is larger y, x > y
 * In case of complex values, the absolute values of a and b are compared.
 * @param  {Number | Complex | Unit | String} x
 * @param  {Number | Complex | Unit | String} y
 * @return {Boolean} res
 */
function larger(x, y) {
    if (isNumber(x)) {
        if (isNumber(y)) {
            return x > y;
        }
        else if (y instanceof Complex) {
            return x > abs(y);
        }
    }
    if (x instanceof Complex) {
        if (isNumber(y)) {
            return abs(x) > y;
        }
        else if (y instanceof Complex) {
            return abs(x) > abs(y);
        }
    }

    if ((x instanceof Unit) && (y instanceof Unit)) {
        if (!x.equalBase(y)) {
            throw new Error('Cannot compare units with different base');
        }
        return x.value > y.value;
    }

    if (isString(x) || isString(y)) {
        return x > y;
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('larger', x, y);
}

math.larger = larger;

/**
 * Function documentation
 */
larger.doc = {
    'name': 'larger',
    'category': 'Operators',
    'syntax': [
        'x > y',
        'larger(x, y)'
    ],
    'description':
        'Check if value x is larger y. ' +
        'Returns 1 if x is larger than y, and 0 if not.',
    'examples': [
        '2 > 3',
        '5 > 2*2',
        'a = 3.3',
        'b = 6-2.8',
        '(a > b)',
        '(b < a)',
        '5 cm > 2 inch'
    ],
    'seealso': [
        'equal', 'unequal', 'smaller', 'smallereq', 'largereq'
    ]
};

/**
 * Inverse the sign of a value. -x or unaryminus(x)
 * @param  {Number | Complex | Unit} x
 * @return {Number | Complex | Unit} res
 */
function unaryminus(x) {
    if (isNumber(x)) {
        return -x;
    }
    else if (x instanceof Complex) {
        return new Complex(
            -x.re,
            -x.im
        );
    }
    else if (x instanceof Unit) {
        var res = x.copy();
        res.value = -x.value;
        return res;
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('unaryminus', x);
}

math.unaryminus = unaryminus;

/**
 * Function documentation
 */
unaryminus.doc = {
    'name': 'unaryminus',
    'category': 'Operators',
    'syntax': [
        '-x',
        'unaryminus(x)'
    ],
    'description':
        'Inverse the sign of a value.',
    'examples': [
        '-4.5',
        '-(-5.6)'
    ],
    'seealso': [
        'add', 'subtract'
    ]
};
/**
 * Check if value a is smaller b, a < b
 * In case of complex values, the absolute values of a and b are compared.
 * @param  {Number | Complex | Unit | String} x
 * @param  {Number | Complex | Unit | String} y
 * @return {Boolean} res
 */
function smaller(x, y) {
    if (isNumber(x)) {
        if (isNumber(y)) {
            return x < y;
        }
        else if (y instanceof Complex) {
            return x < abs(y);
        }
    }
    if (x instanceof Complex) {
        if (isNumber(y)) {
            return abs(x) < y;
        }
        else if (y instanceof Complex) {
            return abs(x) < abs(y);
        }
    }

    if ((x instanceof Unit) && (y instanceof Unit)) {
        if (!x.equalBase(y)) {
            throw new Error('Cannot compare units with different base');
        }
        return x.value < y.value;
    }

    if (isString(x) || isString(y)) {
        return x < y;
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('smaller', x, y);
}

math.smaller = smaller;

/**
 * Function documentation
 */
smaller.doc = {
    'name': 'smaller',
    'category': 'Operators',
    'syntax': [
        'x < y',
        'smaller(x, y)'
    ],
    'description':
        'Check if value a is smaller value b. ' +
            'Returns 1 if x is smaller than y, and 0 if not.',
    'examples': [
        '2 < 3',
        '5 < 2*2',
        'a = 3.3',
        'b = 6-2.8',
        '(a < b)',
        '5 cm < 2 inch'
    ],
    'seealso': [
        'equal', 'unequal', 'larger', 'smallereq', 'largereq'
    ]
};

/**
 * Calculate the square root of a value
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function abs(x) {
    if (isNumber(x)) {
        return Math.abs(x);
    }

    if (x instanceof Complex) {
        return Math.sqrt(x.re * x.re + x.im * x.im);
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('abs', x);
}

math.abs = abs;

/**
 * Function documentation
 */
abs.doc = {
    'name': 'abs',
    'category': 'Arithmetic',
    'syntax': [
        'abs(x)'
    ],
    'description': 'Compute the absolute value.',
    'examples': [
        'abs(3.5)',
        'abs(-4.2)'
    ],
    'seealso': ['sign']
};

/**
 * Calculate the natural logarithm of a value, log(x)
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function log(x) {
    if (isNumber(x)) {
        if (x >= 0) {
            return Math.log(x);
        }
        else {
            // negative value -> complex value computation
            return log(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
        return new Complex (
            Math.log(Math.sqrt(x.re * x.re + x.im * x.im)),
            Math.atan2(x.im, x.re)
        );
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('log', x);
}

math.log = log;

/**
 * Function documentation
 */
log.doc = {
    'name': 'log',
    'category': 'Arithmetic',
    'syntax': [
        'log(x)'
    ],
    'description': 'Compute the natural logarithm of a value.',
    'examples': [
        'log(3.5)',
        'a = log(2.4)',
        'exp(a)',
        'log(1000) / log(10)'
    ],
    'seealso': [
        'exp',
        'logb',
        'log10'
    ]
};

/**
 * Calculates the power of x to y, x^y
 * @param  {Number | Complex} x
 * @param  {Number | Complex} y
 * @return {Number | Complex} res
 */
function pow(x, y) {
    if (isNumber(x)) {
        if (isNumber(y)) {
            if (isInteger(y) || x >= 0) {
                // real value computation
                return Math.pow(x, y);
            }
            else {
                return powComplex(new Complex(x), new Complex(y));
            }
        }
        else if (y instanceof Complex) {
            return powComplex(new Complex(x), y);
        }
    }
    else if (x instanceof Complex) {
        if (isNumber(y)) {
            return powComplex(x, new Complex(y));
        }
        else if (y instanceof Complex) {
            return powComplex(x, y);
        }
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('pow', x, y);
}

/**
 * Caculates the power of x to y, x^y, for two complex values.
 * @param {Complex} x
 * @param {Complex} y
 * @return {Complex} res
 * @private
 */
function powComplex (x, y) {
    // complex computation
    // x^y = exp(log(x)*y) = exp((abs(x)+i*arg(x))*y)
    var temp1 = log(x);
    var temp2 = multiply(temp1, y);
    return exp(temp2);
}

math.pow = pow;

/**
 * Function documentation
 */
pow.doc = {
    'name': 'pow',
    'category': 'Operators',
    'syntax': [
        'x ^ y',
        'pow(x, y)'
    ],
    'description':
        'Calculates the power of x to y, x^y.',
    'examples': [
        '2^3 = 8',
        '2*2*2',
        '1 + e ^ (pi * i)'
    ],
    'seealso': [
        'unequal', 'smaller', 'larger', 'smallereq', 'largereq'
    ]
};

/**
 * Round a value towards minus infinity, floor(x)
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function floor(x) {
    if (isNumber(x)) {
        return Math.floor(x);
    }

    if (x instanceof Complex) {
        return new Complex (
            Math.floor(x.re),
            Math.floor(x.im)
        );
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('floor', x);
}

math.floor = floor;

/**
 * Function documentation
 */
floor.doc = {
    'name': 'floor',
    'category': 'Arithmetic',
    'syntax': [
        'floor(x)'
    ],
    'description':
        'Round a value towards minus infinity.' +
            'If x is complex, both real and imaginary part are rounded ' +
            'towards minus infinity.',
    'examples': [
        'floor(3.2)',
        'floor(3.8)',
        'floor(-4.2)'
    ],
    'seealso': ['ceil', 'fix', 'round']
};

/**
 * Round a value towards plus infinity, ceil(x)
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function ceil(x) {
    if (isNumber(x)) {
        return Math.ceil(x);
    }

    if (x instanceof Complex) {
        return new Complex (
            Math.ceil(x.re),
            Math.ceil(x.im)
        );
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('ceil', x);
}

math.ceil = ceil;

/**
 * Function documentation
 */
ceil.doc = {
    'name': 'ceil',
    'category': 'Arithmetic',
    'syntax': [
        'ceil(x)'
    ],
    'description':
        'Round a value towards plus infinity.' +
            'If x is complex, both real and imaginary part are rounded ' +
            'towards plus infinity.',
    'examples': [
        'ceil(3.2)',
        'ceil(3.8)',
        'ceil(-4.2)'
    ],
    'seealso': ['floor', 'fix', 'round']
};

/**
 * Multiply two values. x + y or multiply(x, y)
 * @param  {Number | Complex | Unit} x
 * @param  {Number | Complex | Unit} y
 * @return {Number | Complex | Unit} res
 */
function multiply(x, y) {
    var res;

    if (isNumber(x)) {
        if (isNumber(y)) {
            // number * number
            return x * y;
        }
        else if (y instanceof Complex) {
            // number * complex
            return multiplyComplex(new Complex(x), y);
        }
        else if (y instanceof Unit) {
            res = y.copy();
            res.value *= x;
            return res;
        }
    }
    else if (x instanceof Complex) {
        if (isNumber(y)) {
            // complex * number
            return multiplyComplex(x, new Complex(y));
        }
        else if (y instanceof Complex) {
            // complex * complex
            return multiplyComplex(x, y);
        }
    }
    else if (x instanceof Unit) {
        if (isNumber(y)) {
            res = x.copy();
            res.value *= y;
            return res;
        }
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('multiply', x, y);
}

/**
 * Multiply two complex values. x * y or multiply(x, y)
 * @param {Complex} x
 * @param {Complex} y
 * @return {Complex} res
 * @private
 */
function multiplyComplex (x, y) {
    return new Complex(
        x.re * y.re - x.im * y.im,
        x.re * y.im + x.im * y.re
    );
}

math.multiply = multiply;

/**
 * Function documentation
 */
multiply.doc = {
    'name': 'multiply',
    'category': 'Operators',
    'syntax': [
        'x * y',
        'multiply(x, y)'
    ],
    'description': 'multiply two values.',
    'examples': [
        '2.1 * 3.6',
        'ans / 3.6',
        '2 * 3 + 4',
        '2 * (3 + 4)',
        '3 * 2.1 km'
    ],
    'seealso': [
        'divide'
    ]
};

/**
 * Subtract two values. x - y or subtract(x, y)
 * @param  {Number | Complex | Unit} x
 * @param  {Number | Complex | Unit} y
 * @return {Number | Complex | Unit} res
 */
function subtract(x, y) {
    if (isNumber(x)) {
        if (isNumber(y)) {
            // number - number
            return x - y;
        }
        else if (y instanceof Complex) {
            // number - complex
            return new Complex (
                x - y.re,
                    y.im
            );
        }
    }
    else if (x instanceof Complex) {
        if (isNumber(y)) {
            // complex - number
            return new Complex (
                x.re - y,
                x.im
            )
        }
        else if (y instanceof Complex) {
            // complex - complex
            return new Complex (
                x.re - y.re,
                x.im - y.im
            )
        }
    }
    else if (x instanceof Unit) {
        if (y instanceof Unit) {
            if (!x.equalBase(y)) {
                throw new Error('Units do not match');
            }

            if (!x.hasValue) {
                throw new Error('Unit on left hand side of operator - has no value');
            }

            if (!y.hasValue) {
                throw new Error('Unit on right hand side of operator - has no value');
            }

            var res = x.copy();
            res.value -= y.value;
            res.fixPrefix = false;

            return res;
        }
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('subtract', x, y);
}

math.subtract = subtract;

/**
 * Function documentation
 */
subtract.doc = {
    'name': 'subtract',
    'category': 'Operators',
    'syntax': [
        'x - y',
        'subtract(x, y)'
    ],
    'description': 'subtract two values.',
    'examples': [
        '5.3 - 2',
        'ans + 2',
        '2/3 - 1/6',
        '2 * 3 - 3',
        '2.1 km - 500m'
    ],
    'seealso': [
        'add'
    ]
};
/**
 * Return a random number between 0 and 1
 * @return {Number} res
 */
function random () {
    // TODO: implement parameter min and max
    return Math.random();
}

math.random = random;

/**
 * Function documentation
 */
random.doc = {
    'name': 'random',
    'category': 'Probability',
    'syntax': [
        'random()'
    ],
    'description':
        'Return a random number between 0 and 1.',
    'examples': [
        'random()',
        '100 * random()'
    ],
    'seealso': []
};


})();
