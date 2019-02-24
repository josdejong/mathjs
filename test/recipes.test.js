import assert from 'assert'
import { addRecipe, divideRecipe, piRecipe } from '../src/recipes'
import { create } from '../src/mainInstance'

describe('recipes', function () {
  it('should create functions from recipes', () => {
    const { add, divide, pi } = create({
      addRecipe,
      divideRecipe,
      piRecipe
    })

    assert.strictEqual(add(2, 3), 5)
    assert.strictEqual(divide(6, 3), 2)
    assert.strictEqual(pi, Math.PI)
  })

  it('should create functions from with config', () => {
    const config = { number: 'BigNumber' }
    const { pi } = create({
      piRecipe
    }, config)

    assert.strictEqual(pi.isBigNumber, true)
    assert.strictEqual(pi.toString(), '3.141592653589793238462643383279502884197169399375105820974944592')
  })
})
