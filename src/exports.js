/**
 * Define namespace
 */
var math = {
    type: {},
    parser: {
        node: {}
    },
    options: {
        precision: 10  // number of decimals in formatted output
    }
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
