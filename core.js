const create = require('./lib/mainInstance').create
const typedDependencies = require('./lib/dependenciesFull.generated').typedDependencies

console.log('The  file ./core.js is deprecated since v6.0.0. Please use index.js instead')

exports.create = function createLegacy (config) {
  // TODO: wrap the function create in a warnOnce message

  const factories = {
    createTyped: typedDependencies.createTyped
  }

  return create(factories, config)
}
