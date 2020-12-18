import { factory } from '../utils/factory.js'
import { embeddedDocs as defaultEmbeddedDocs } from './embeddedDocs/embeddedDocs.js'

const name = 'Docs'

export const createDocumentation = /* #__PURE__ */ factory(name, [], () => {
  return Object.assign({}, defaultEmbeddedDocs)
})
