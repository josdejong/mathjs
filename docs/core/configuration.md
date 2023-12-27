import { create, all } from 'mathjs'

// Function to create a math instance with custom configurations
function createCustomMathInstance(config) {
  return create(all, config);
}

// Configuration options
const configArray = {
  matrix: 'Array' // Choose 'Matrix' (default) or 'Array'
};

const configMatrix = {
  matrix: 'Matrix' // Choose 'Matrix' (default) or 'Array'
};

const configBigNumber = {
  number: 'BigNumber', // Choose 'number' (default), 'BigNumber', or 'Fraction'
  precision: 32        // 64 by default, only applicable for BigNumbers
};

// Create math instances using the function with different configurations
const mathArray = createCustomMathInstance(configArray);
const mathMatrix = createCustomMathInstance(configMatrix);
const mathBigNumber = createCustomMathInstance(configBigNumber);

// Examples of using the created instances
console.log(mathArray.range(0, 4)); // Output: Array [0, 1, 2, 3]
console.log(mathMatrix.range(0, 4)); // Output: Matrix [0, 1, 2, 3]
console.log(mathBigNumber.evaluate('1 / 3')); // Output: BigNumber, 0.33333333333333333333333333333333
