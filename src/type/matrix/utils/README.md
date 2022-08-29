###Algorithms for the implementation of element wise operations between a Dense and Sparse matrices:

Note that brief mnemonics for the algorithm's operations are given after their
numbers, and are included in the JavaScript as a suffix, with a separator `x`
between the number and the suffix. (Linting rules would not alow `_` as the
separator, unfortunately.)

- **Algorithm 01 (DSid) `x(dense, sparse)`**
  * Algorithm should clone `DenseMatrix` and call the `x(d(i,j), s(i,j))` operation for the items in the Dense and Sparse matrices (iterating on the Sparse matrix nonzero items), updating the cloned matrix.
  * Output type is a `DenseMatrix` (the cloned matrix)
  * `x()` operation invoked NZ times (number of nonzero items in `SparseMatrix`)

    ````
    Cij = x(Dij, Sij);    Sij != 0
    Cij = Dij        ;    otherwise
    ````

- **Algorithm 02 (DS0) `x(dense, sparse)`**
  * Algorithm should iterate `SparseMatrix` (nonzero items) and call the `x(d(i,j),s(i,j))` operation for the items in the Sparse and Dense matrices (since zero & X == zero)
  * Output type is a `SparseMatrix` since the number of nonzero items will be less or equal the number of nonzero elements in the Sparse Matrix.
  * `x()` operation invoked NZ times (number of nonzero items in `SparseMatrix`)

    ````
    Cij = x(Dij, Sij);    Sij != 0
    Cij = 0          ;    otherwise
    ````

- **Algorithm 03 (DSf) `x(dense, sparse)`**
  * Algorithm should iterate `SparseMatrix` (nonzero and zero items) and call the `x(s(i,j),d(i,j))` operation for the items in the Dense and Sparse matrices
  * Output type is a `DenseMatrix`
  * `x()` operation invoked M*N times

    ````
    Cij = x(Dij, Sij);    Sij != 0
    Cij = x(Dij, 0)  ;    otherwise
    ````

- **Algorithm 04 (SidSid) `x(sparse, sparse)`**
  * Algorithm should iterate on the nonzero values of matrices A and B and call `x(Aij, Bij)` when both matrices contain value at (i,j)
  * Output type is a `SparseMatrix`
  * `x()` operation invoked NZ times (number of nonzero items at the same (i,j) for both matrices)

    ````
    Cij = x(Aij, Bij);    Aij != 0 && Bij != 0
    Cij = Aij        ;    Aij != 0
    Cij = Bij        ;    Bij != 0
    ````

###Algorithms for the implementation of element wise operations between a Sparse matrices:

- **Algorithm 05 (SfSf) `x(sparse, sparse)`**
  * Algorithm should iterate on the nonzero values of matrices A and B and call `x(Aij, Bij)` for every nonzero value.
  * Output type is a `SparseMatrix`
  * `x()` operation invoked NZ times (number of nonzero values in A only + number of nonzero values in B only + number of nonzero values in A and B)

    ````
    Cij = x(Aij, Bij);    Aij != 0 || Bij != 0
    Cij = 0          ;    otherwise
    ````

- **Algorithm 06 (S0S0) `x(sparse, sparse)`**
  * Algorithm should iterate on the nonzero values of matrices A and B and call `x(Aij, Bij)` when both matrices contain value at (i,j).
  * Output type is a `SparseMatrix`
  * `x()` operation invoked NZ times (number of nonzero items at the same (i,j) for both matrices)

    ````
    Cij = x(Aij, Bij);    Aij != 0 && Bij != 0
    Cij = 0          ;    otherwise
    ````

- **Algorithm 07 (SSf) `x(sparse, sparse)`**
  * Algorithm should iterate on all values of matrices A and B and call `x(Aij, Bij)`
  * Output type is a `DenseMatrix`
  * `x()` operation invoked MxN times

    ````
    Cij = x(Aij, Bij);
    ````

- **Algorithm 08 (S0Sid) `x(sparse, sparse)`**
  * Algorithm should iterate on the nonzero values of matrices A and B and call `x(Aij, Bij)` when both matrices contain value at (i,j). Use the value from Aij when Bij is zero.
  * Output type is a `SparseMatrix`
  * `x()` operation invoked NZ times (number of nonzero items at the same (i,j) for both matrices)

    ````
    Cij = x(Aij, Bij);    Aij != 0 && Bij != 0
    Cij = Aij        ;    Aij != 0
    Cij = 0          ;    otherwise
    ````

- **Algorithm 9 (S0Sf) `x(sparse, sparse)`**
  * Algorithm should iterate on the nonzero values of matrices A `x(Aij, Bij)`.
  * Output type is a `SparseMatrix`
  * `x()` operation invoked NZA times (number of nonzero items in A)

    ````
    Cij = x(Aij, Bij);    Aij != 0
    Cij = 0          ;    otherwise
    ````
  
###Algorithms for the implementation of element wise operations between a Sparse and Scalar Value:

- **Algorithm 10 (Sids) `x(sparse, scalar)`**
  * Algorithm should iterate on the nonzero values of matrix A and call `x(Aij, N)`.
  * Output type is a `DenseMatrix`
  * `x()` operation invoked NZ times (number of nonzero items)

    ````
    Cij = x(Aij, N);    Aij != 0
    Cij = N        ;    otherwise
    ````

- **Algorithm 11 (S0s) `x(sparse, scalar)`**
  * Algorithm should iterate on the nonzero values of matrix A and call `x(Aij, N)`.
  * Output type is a `SparseMatrix`
  * `x()` operation invoked NZ times (number of nonzero items)

    ````
    Cij = x(Aij, N);    Aij != 0**
    Cij = 0        ;    otherwise**
    ````

- **Algorithm 12 (Sfs) `x(sparse, scalar)`**
  * Algorithm should iterate on the zero and nonzero values of matrix A and call `x(Aij, N)`.
  * Output type is a `DenseMatrix`
  * `x()` operation invoked MxN times.

    ````
    Cij = x(Aij, N);    Aij != 0
    Cij = x(0, N)  ;    otherwise
    ````
  
###Algorithms for the implementation of element wise operations between a Dense and Dense matrices:

- **Algorithm 13 (DD) `x(dense, dense)`
  * Algorithm should iterate on the values of matrix A and B for all dimensions and call `x(Aij..z,Bij..z)`
  * Output type is a `DenseMatrix`
  * `x()` operation invoked Z times, where Z is the number of elements in the matrix last dimension. For two dimensional matrix Z = MxN

    ````
    Cij..z = x(Aij..z, Bij..z)**
    ````
  
###Algorithms for the implementation of element wise operations between a Dense Matrix and a Scalar Value:

- **Algorithm 14 (Ds) `x(dense, scalar)`**
  * Algorithm should iterate on the values of matrix A for all dimensions and call `x(Aij..z, N)`
  * Output type is a `DenseMatrix`
  * `x()` operation invoked Z times, where Z is the number of elements in the matrix last dimension. 

    ````
    Cij..z = x(Aij..z, N)**
    ````

