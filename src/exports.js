// TODO: put "use strict"; here (but right now webstorms inspector starts
// complaining on this issue: http://youtrack.jetbrains.com/issue/WEB-7485)

/**
 * Define namespace
 */
var math = {
    type: {},
    expr: {
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
