
export function deprecatedIndexFileError (filename) {
  const message = `The index file ${filename} is deprecated since v6.0.0. ` +
    'Please import and load individual files from the main index file instead, like: \n' +
    ' \n' +
    '  import { create, addDependencies, multiplyDependencies } from \'mathjs\' \n' +
    '  const math = create({ addDependencies, multiplyDependencies }) \n'

  throw new Error(message)
}
