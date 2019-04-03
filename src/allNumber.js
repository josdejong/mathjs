// creating allDependencies here in a separate file is needed to get tree-shaking working
import * as allFactories from './factoriesNumber'

export const allDependencies = allFactories
