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
if (typeof(require) !== 'undefined' && typeof(define) !== 'undefined') {
  define(function () {
    return math;
  });
}

/**
 * Browser exports
 */
if (typeof(window) !== 'undefined') {
  if (window['math']) {
    object.deepExtend(window['math'], math);
  }
  else {
    window['math'] = math;
  }
}
