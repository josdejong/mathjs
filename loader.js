var isFactory = require('./lib/util/object').isFactory;

/**
 * Math.js loader. Creates a new, empty math.js instance
 * @returns {Object} Returns a math.js instance containing
 *                   a function `import` to add new functions
 */
// TODO: support passing config here
exports.create = function create () {
  // simple test for ES5 support
  if (typeof Object.create !== 'function') {
    throw new Error('ES5 not supported by this JavaScript engine. ' +
    'Please load the es5-shim and es5-sham library for compatibility.');
  }

  // cached factories and instances
  var factories = [];
  var instances = [];

  // create a namespace for the mathjs instance
  var math = {
    type: {}
  };

  // create a new typed instance
  var typed = require('./lib/util/typed').create(math);

  // create configuration options. These are private
  var _config = {
    // type of default matrix output. Choose 'matrix' (default) or 'array'
    matrix: 'matrix',

    // type of default number output. Choose 'number' (default) or 'bignumber'
    number: 'number',

    // number of significant digits in BigNumbers
    precision: 64,

    // minimum relative difference between two compared values,
    // used by all comparison functions
    epsilon: 1e-14
  };

  /**
   * Load a function or data type from a factory.
   * If the function or data type already exists, the existing instance is
   * returned.
   * @param {{type: string, name: string, factory: function}} factory
   * @returns {*}
   */
  function load (factory) {
    if (!isFactory(factory)) {
      throw new Error('Factory object with properties `type`, `name`, and `factory` expected');
    }

    var index = factories.indexOf(factory);
    var instance;
    if (index === -1) {
      // doesn't yet exist
      if (factory.math) {
        // pass with math namespace
        instance = factory.factory(math.type, _config, load, typed, math);
      }
      else {
        instance = factory.factory(math.type, _config, load, typed);
      }

      // append to the cache
      factories.push(factory);
      instances.push(instance);
    }
    else {
      // already existing function, return the cached instance
      instance = instances[index];
    }

    return instance;
  }

  // load the import function, which can be used to load all other functions,
  // constants, and types
  math['import'] = load(require('./lib/function/utils/import'));
  // TODO: automatically load config method too? Like import?

  // errors
  math.error = require('./lib/error');

  return math;
};
