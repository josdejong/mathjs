'use strict'

import { createFilterTransform } from './filter.transform'
import { createConcatTransform } from './concat.transform'
import { createForEachTransform } from './forEach.transform'
import { createIndexTransform } from './index.transform'
import { createMapTransform } from './map.transform'
import { createMaxTransform } from './max.transform'
import { createMeanTransform } from './mean.transform'
import { createMinTransform } from './min.transform'
import { createRangeTransform } from './range.transform'
import { createSubsetTransform } from './subset.transform'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  createConcatTransform,
  createFilterTransform,
  createForEachTransform,
  createIndexTransform,
  createMapTransform,
  createMaxTransform,
  createMeanTransform,
  createMinTransform,
  createRangeTransform,
  createSubsetTransform
]
