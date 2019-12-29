const { create, all } = require('../..')
const math = create(all)

console.log(math.distance([10, 2, 5, 13, 6, 12, 0, 16, 8], [1, 11, 14, 4, 15, 3, 9, 7, 17]))
