/**
 * Assert that all dependencies of a list with dependencies are available in the provided object `math`.
 *
 * Will throw an exception when there are dependencies missing.
 *
 * @param {Object} math
 * @param {string[]} dependencies
 * @param {string} name   Name for the function to be created. Used to generate a useful error message
 */
export default function assertDependencies (math, dependencies, name) {
  if (!dependencies.every(dependency => dependency in math)) {
    const missingDependencies = dependencies.filter(dependency => !(dependency in math))

    // TODO: create a custom error class for this, a MathjsError or something like that
    throw new Error(`Cannot create function ${name}, ` +
      `some dependencies are missing: ${missingDependencies.join(', ')}.`)
  }
}
