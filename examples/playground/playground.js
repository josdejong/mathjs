const { create, all } = require('../..')
const math = create(all)

console.log(math.evaluate('tan(pi)'))
