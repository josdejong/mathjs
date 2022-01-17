import { factory } from '../../utils/factory.js'

const name = 'derivativeNum'
const dependencies = ['typed', 'parse']

export const createDerivativeNum = factory(name, dependencies, ({ typed, parse }) => {
  return typed(name, {
    /**
     * Compute the derivate numerically of a function.
     * The function considers the definition (f(x+dx)-f(x))/dx.
     * It gets the function whose derivative we want to calculate as a string
     * and it is parsed and evaluated by the library.
     *
     * Syntax:
     *
     * math.derivativeNum(string, number)
     *
     * Example:
     *
     * math.derivativeNum('cos(x)', 5)  // returns
     * math.derivativeNum('x*exp(x)', 3) // returns
     *
     * @param { string } funct The expression to differenciate.
     * @param { number } numb The value where the derivative is calculated.
     * @return { number } The derivative of a function at a specific point.
    */
    'string, number': function (funct, numb) {
      funct = parse(funct)
      const dx = 1e-10
      return (funct.evaluate({ x: numb + dx }) - funct.evaluate({ x: numb })) / dx
    }
  })
})
