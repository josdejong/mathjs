/**
 * Define math2 namespace
 */
var math2 = {
    type: {},
    parser: {}
};

/**
 * CommonJS module exports
 */
if ((typeof module !== 'undefined') && (typeof module.exports !== 'undefined')) {
    module.exports = math2;
}
if (typeof exports !== 'undefined') {
    exports = math2;
}

/**
 * AMD module exports
 */
if (typeof(require) != 'undefined' && typeof(define) != 'undefined') {
    define(function () {
        return math2;
    });
}

/**
 * Browser exports
 */
if (typeof(window) != 'undefined') {
    window['math2'] = math2;
}
