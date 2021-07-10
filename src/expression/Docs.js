import { factory } from '../utils/factory.js'
import { embeddedDocs as defaultEmbeddedDocs } from './embeddedDocs/embeddedDocs.js'

const name = 'Docs'

export const createDocsClass = /* #__PURE__ */ factory(name, [], () => {
  const docsInstance = Object.assign({}, defaultEmbeddedDocs)
  function Docs () {
    if (!(this instanceof Docs)) {
      throw new SyntaxError('Constructor must be called with the new operator')
    }
  }

  Docs.prototype.type = 'Docs'
  Docs.getDocs = function () {
    return docsInstance
  }

  return Docs
}, { isClass: true })
