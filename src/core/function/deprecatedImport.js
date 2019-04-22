
export function createDeprecatedImport () {
  return function deprecatedImport () {
    throw new Error('The global import function is not available anymore in v6.0.0. \n' +
      'Please create a mathjs instance if you want to import functions. \n' +
      'Example:\n' +
      '\n' +
      '  import { create, all } from \'mathjs\';\n' +
      '  const mathjs = create(all);\n' +
      '  mathjs.import(...);\n')
  }
}
