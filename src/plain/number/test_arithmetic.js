import { modNumber } from './arithmetic.js';

function testModFunction() {
  const x = 0.15;
  const y = 0.05;
  
  const expected = 0;
  const result = modNumber(x, y);
  
  console.log(`Expected: ${expected}`);
  console.log(`Result: ${result}`);
  console.log(`Test Passed: ${expected === result}`);
}

testModFunction();