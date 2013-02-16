
var PRECISION = 1E10;

/**
 * Convert a number to a formatted string representation
 * @param {Number} value            The value to be formatted
 * @param {Number} [digits]         number of digits
 * @return {String} formattedValue  The formatted value
 * @private
 */
var format = function (value, digits) {
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
        return String(round(value, digits));
    }
    else {
        // scientific notation
        var exp = Math.round(Math.log(abs) / Math.LN10);
        var v = value / (Math.pow(10.0, exp));
        return round(v, digits) + 'E' + exp;
    }
};

/**
 * round a number to the given number of digits, or to the default if
 * digits is not provided
 * @param {Number} value
 * @param {Number} [digits]
 * @return {Number} roundedValue
 * @private
 */
var round = function (value, digits) {
    digits = (digits != undefined) ? Math.pow(10, digits) : PRECISION;

    return Math.round(value * digits) / digits;
};

/**
 * Create a semi UUID
 * source: http://stackoverflow.com/a/105074/1262753
 * @return {String} uuid
 * @private
 */
var createUUID = function () {
    var S4 = function () {
        return Math.floor(
            Math.random() * 0x10000 /* 65536 */
        ).toString(16);
    };

    return (
        S4() + S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + "-" +
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
