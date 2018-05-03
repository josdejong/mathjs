// test expm
var assert = require('assert'),
    approx = require('../../../tools/approx');
    math = require('../../../index'),
    expm = math.expm;

describe('expm', function() {

  it('should only accept a square matrix', function() {
    assert.throws(function() { expm(5); }, /Unexpected type/);
    assert.throws(function() { expm([1,2]); }, /Matrix must be square/);
    assert.throws(function() { expm([[1,2]]); }, /Matrix must be square/);
    assert.throws(function() { expm([[1,2,3],[4,5,6]]); }, /Matrix must be square/);
  });

  it('should compute the exponential of a matrix', function() {
    
    // Trivial example
    approx.deepEqual(expm(
      [[1,0],
       [0,1]]
     ),
     math.matrix(
      [[2.718281828, 0          ],
       [0,           2.718281828]]
     ));
     
    // Example given in the Moler and Van Loan paper
    approx.deepEqual(expm(
      [[-49, 24],
       [-64, 31]]
     ),
     math.matrix(
      [[-0.735759,0.551819],
       [-1.471518,1.103638]]
     ));
     
    // Another example from the same paper
    approx.deepEqual(expm(
      [[0, 6, 0, 0],
       [0, 0, 6, 0],
       [0, 0, 0, 6],
       [0, 0, 0, 0]]
     ),
     math.matrix(
      [[1, 6, 18, 36],
       [0, 1,  6, 18],
       [0, 0,  1,  6],
       [0, 0,  0,  1]]
     ));
     
    // And another
    approx.deepEqual(expm(
      [[1,1],
       [0,1]]
     ),
     math.matrix(
      [[2.718282, 2.718282 ],
       [0,        2.718282]]
     ));
      
    // And another
    approx.deepEqual(expm(
      [[1+1e-5, 1],
       [0,      1-1e-5]]
     ),
     math.matrix(
      [[2.718309, 2.718282 ],
       [0,        2.718255]]
     ));
  });

  it('should work on SparseMatrix', function() {
    approx.deepEqual(expm(
      math.sparse(
        [[0, 6, 0, 0],
        [0, 0, 6, 0],
        [0, 0, 0, 6],
        [0, 0, 0, 0]]
      )
     ),
     math.sparse(
      [[1, 6, 18, 36],
       [0, 1,  6, 18],
       [0, 0,  1,  6],
       [0, 0,  0,  1]]
     ));

  });

  it('should LaTeX transpose', function () {
    var expression = math.parse('expm([[1,2],[3,4]])');
    assert.equal(expression.toTex(), '\\exp\\left(\\begin{bmatrix}1&2\\\\3&4\\\\\\end{bmatrix}\\right)');
  });
});
