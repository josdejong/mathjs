import { factory } from '../../utils/factory.js'
import { errorTransform } from './utils/errorTransform.js'
import {
  createSubset, dependencies as subsetDependencies
} from '../../function/matrix/subset.js'
import {
  createIndexTransform, dependencies as indexTransformDependencies
} from './index.transform.js'

const name = 'subset'
const dependencies = subsetDependencies.slice()
for (const indexDep of indexTransformDependencies) {
  if (!dependencies.includes(indexDep)) dependencies.push(indexDep)
}

export const createSubsetTransform = /* #__PURE__ */ factory(
  name,
  dependencies,
  provided => {
    const subset = createSubset(provided)
    const indexTransform = createIndexTransform(provided)

    /**
     * Attach a transform function to math.subset
     * Adds a property transform containing the transform function.
     *
     * This transform creates a range which includes the end value
     */
    return provided.typed('subset', {
      '...any': function (args) {
        try {
          if (args[1] && Array.isArray(args[1])) {
            // supplied an array instead of an index for the 2nd argument, so
            // have to turn that into an Index with indexTransform rather than
            // just plain index, as subset will if we just let it have at it.
            args[1] = indexTransform.apply(null, args[1])
          }
          return subset.apply(null, args)
        } catch (err) {
          throw errorTransform(err)
        }
      }
    })
  }, { isTransformFunction: true })
