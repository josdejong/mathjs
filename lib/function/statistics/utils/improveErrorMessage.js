'use strict';


function factory (type, config, load, typed) {
  var getType = load(require('../../utils/typeof'));

  /**
   * Improve error messages for statistics functions. Errors are typically
   * thrown in an internally used function like larger, causing the error
   * not to mention the function (like max) which is actually used by the user.
   *
   * @param {Error} err
   * @param {String} fnName
   * @param {*} [value]
   * @return {Error}
   */
  return function improveErrorMessage(err, fnName, value) {
    // TODO: add information with the index (also needs transform in expression parser)
    var details;

    if (String(err).indexOf('Unexpected type') !== -1) {
      details = arguments.length > 2
          ? ' (type: ' + getType(value) + ', value: ' + JSON.stringify(value) + ')'
          : ' (type: ' + err.data.actual + ')';

      return new TypeError('Cannot calculate ' + fnName + ', unexpected type of argument' + details);
    }

    if (String(err).indexOf('complex numbers') !== -1) {
      details = arguments.length > 2
          ? ' (type: ' + getType(value) + ', value: ' + JSON.stringify(value) + ')'
          : '';

      return new TypeError('Cannot calculate ' + fnName + ', no ordering relation is defined for complex numbers' + details);
    }

    return err;
  }
}

exports.factory = factory;
