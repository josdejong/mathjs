import { factory } from '../utils/factory.js'

const name = 'fromJSON'
const dependencies = [
  'classes'
]

export const createfromJSON = /* #__PURE__ */ factory(name, dependencies, ({ classes }) => {
  return function fromJSON (json) {
    const constructor = classes[json && json.mathjs]

    if (constructor && typeof constructor.fromJSON === 'function') {
      return constructor.fromJSON(json)
    }

    return json
  }
})
