import { factory } from '../../utils/factory'
import { log10Number,floorNumber } from '../../plain/number'

const name = 'digits'
const dependencies = ['typed']

export const createDigits = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {

    /** 
     *  Calculate the number of digits in a number.
     *  
     *  Syntax:
     *    math.digits(x)
     * 
     *  Examples: 
     *     math.digits(100)        // returns 3
     *     math.digits(0)          // returns 1
     *     math.digits(50)         // returns 2
     *     math.digits(500000)     // returns 6
     *  
     *  @param {number | BigNumber} x
     *         Value for which to calculate the number of digits 
     *  @return {number | BigNumber} 
     *         Returns the Number of digits of x
     * 
    */

    return typed(name,{
        number: function (x) {
            return 1+floorNumber(log10Number(x));
        },
        BigNumber: function (x) {
            return 1+floorNumber(log10Number(x));
        }        
    })
})