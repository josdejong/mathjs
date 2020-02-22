import { clone } from '../../../utils/object'

export function createComplex({addScalar, subtract, multiply, sqrt, abs, bignumber, diag, inv, qr, usolve}) {
    /**
     * @param {number[][]} arr the matrix to find eigenvalues of
     * @param {number} N size of the matrix
     * @param {number|BigNumber} prec precision, anything lower will be considered zero
     * @param {'number'|'BigNumber'|'Complex'} type
     * @param {boolean} findVectors should we find eigenvectors?
     */
    function main(arr, N, prec, type, findVectors)
    {
        if (findVectors === undefined) findVectors = true

        // TODO implement QR for complex matrices
        if (type === 'Complex')
            throw new TypeError('Complex matrices not yet supported')


        // TODO check if any row/col are zero except the diagonal

        // make sure corresponding rows and columns have similar magnitude
        // important because of numerical stability
        let R = balance(arr, N, prec, type, findVectors)

        // R is the row transformation matrix
        // A' = R A R⁻¹, A is the original matrix
        // (if findVectors is false, R is undefined)

        // TODO if magnitudes of elements vary over many orders,
        // move greatest elements to the top left corner

        // using similarity transformations, reduce the matrix
        // to Hessenberg form (upper triangular plus one subdiagonal row)
        // updates the transformation matrix R with new row operationsq
        reduceToHessenberg(arr, N, prec, type, findVectors, R)

        // find eigenvalues
        let { values, C } = iterateUntilTriangular(arr, N, prec, type, findVectors)

        // values is the list of eigenvalues, C is the column
        // transformation matrix that transforms the hessenberg
        // matrix to upper triangular

        // compose transformations A → hess. and hess. → triang.
        C = multiply( inv(R), C )


        let vectors

        if (findVectors)
            vectors = findEigenvectors(arr, N, C, values)

        return { values, vectors }
    }

    /**
     * @param {number[][]} arr
     * @param {number} N
     * @param {number} prec
     * @param {'number'|'BigNumber'|'Complex'} type
     * @returns {number[][]}
     */
    function balance(arr, N, prec, type, findVectors)
    {
        const big  = type === 'BigNumber'
        const cplx = type === 'Complex'

        const bigZero = bignumber(0)
        const bigOne  = bignumber(1)

        // base of the floating-point arithmetic
        const radix = big ? bignumber(10) : 2
        const radixSq = multiply(radix, radix)

        // the diagonal transformation matrix R
        let Rdiag
        if (findVectors)
            Rdiag = Array(N).fill(big ? bigOne : 1)

        // this isn't the only time we loop thru the matrix...
        let last = false

        while (!last)
        {
            // ...haha I'm joking! unless...
            last = true

            for (let i = 0; i < N; i++)
            {

                // compute the taxicab norm of i-th column and row
                // TODO optimize for complex numbers
                let colNorm = big ? bigZero : 0
                let rowNorm = big ? bigZero : 0

                for (let j = 0; j < N; j++)
                {
                    if (i === j) continue;
                    let c = big||cplx ? arr[i][j].abs() : Math.abs(arr[i][j])
                    let r = big||cplx ? arr[j][i].abs() : Math.abs(arr[j][i])
                    colNorm = big ? colNorm.add(c) : colNorm + c
                    rowNorm = big ? rowNorm.add(c) : rowNorm + r
                }


                if (!big ? (colNorm !== 0 && rowNorm !== 0) : (!colNorm.equals(0) && !rowNorm.equals(0)) )
                {
                    // find integer power closest to balancing the matrix
                    // (we want to scale only by integer powers of radix,
                    // so that we don't lose any precision due to round-off)


                    let f = big ? bigOne : 1
                    let c = colNorm

                    const rowDivRadix = big ? rowNorm.div(radix) : rowNorm/radix
                    const rowMulRadix = big ? rowNorm.mul(radix) : rowNorm*radix

                    if (!big) {
                        while (c < rowDivRadix) {
                            c *= radixSq
                            f *= radix
                        }
                        while (c > rowMulRadix) {
                            c /= radixSq
                            f /= radix
                        }
                    } else {
                        while (c.lessThan(rowDivRadix)) {
                            c = c.mul(radixSq)
                            f = f.mul(radix)
                        }
                        while (c.greaterThan(rowMulRadix)) {
                            c = c.div(radixSq)
                            f = f.div(radix)
                        }
                    }


                    // check whether balancing is needed
                    const condition = !big
                        ? (c + rowNorm)/f < 0.95*(colNorm + rowNorm)
                        : c.add(rowNorm).div(f).lessThan(colNorm.add(rowNorm).mul(0.95))


                    // apply balancing similarity transformation
                    if (condition)
                    {
                        // we should loop once again to check whether
                        // another rebalancing is needed
                        last = false

                        let g = big ? bigOne.div(f) : 1/f

                        for (let j = 0; j < N; j++)
                        {
                            if (i === j) continue;
                            arr[i][j] = multiply(arr[i][j], f)
                            arr[j][i] = multiply(arr[j][i], g)
                        }

                        // keep track of transformations
                        if (findVectors)
                            Rdiag[i] = big ? R[i].mul(f) : Rdiag[i]*f
                    }

                }
            }
        }

        // return the diagonal row transformation matrix
        return diag(Rdiag)
    }


    /**
     * @param {number[][]} arr
     * @param {number} N
     * @param {number} prec
     * @param {'number'|'BigNumber'|'Complex'} type
     * @param {boolean} findVectors
     * @param {number[][]} R the row transformation matrix that will be modified
     */
    function reduceToHessenberg(arr, N, prec, type, findVectors, R)
    {
        const big  = type === 'BigNumber'
        const cplx = type === 'Complex'
        const num = !big && !cplx

        const bigZero = bignumber(0)

        for (let i = 0; i < N-2; i++)
        {
            // Find the largest subdiag element in the i-th col

            let maxIndex = 0
            let max = big ? bigZero : 0

            for (let j = i + 1; j < N; j++)
            {
                let el = arr[j][i]
                if (big ? abs(max).lessThan(abs(el)) : abs(max) < abs(el)) {
                    max = el
                    maxIndex = j
                }
            }

            // This col is pivoted, no need to do anything
            if (big ? abs(max).lessThan(prec) : abs(max) < prec)
                continue

            if (maxIndex !== i+1)
            {
                // Interchange maxIndex-th and (i+1)-th row
                const tmp1 = arr[maxIndex]
                arr[maxIndex] = arr[i+1]
                arr[i+1] = tmp1

                // Interchange maxIndex-th and (i+1)-th column
                for (let j = 0; j < N; j++)
                {
                    const tmp2 = arr[j][maxIndex]
                    arr[j][maxIndex] = arr[j][i+1]
                    arr[j][i+1] = tmp2
                }

                // keep track of transformations
                if (findVectors) {
                    const tmp3 = R[maxIndex]
                    R[maxIndex] = R[i+1]
                    R[i+1] = tmp3
                }
            }

            // Reduce following rows and columns
            for (let j = i + 2; j < N; j++)
            {
                let n = num ? arr[j][i] / max : arr[j][i].div(max)

                if (n == 0) continue;

                // from j-th row subtract n-times (i+1)th row
                for (let k = 0; k < N; k++)
                    arr[j][k] = num ? arr[j][k] - n*arr[i+1][k] : arr[j][k].sub(n.mul(arr[i+1][k]))

                // to (i+1)th column add n-times j-th column
                for (let k = 0; k < N; k++)
                    arr[k][i+1] = num ? arr[k][i+1] + n*arr[k][j] : arr[k][i+1].add(n.mul(arr[k][j]))

                // keep track of transformations
                if (findVectors)
                    for (let k = 0; k < N; k++)
                        R[j][k] = num ? R[j][k] - n*R[i+1][k] : subtract(R[j][k], n.mul(R[i+1][k]))
            }
        }

        return R
    }

    /**
     * @returns {{values: values, C: Matrix}}
     * @see Press, Wiliams: Numerical recipes in Fortran 77
     * @see https://en.wikipedia.org/wiki/QR_algorithm
     */
    function iterateUntilTriangular(A, N, prec, type, findVectors)
    {
        const big = type === 'BigNumber'

        // The Francis Algorithm
        // The core idea of this algorithm is that doing successive
        // A' = Q⁺AQ transformations will eventually converge to block-
        // upper-triangular with diagonal blocks either 1x1 or 2x2.
        // The Q here is the one from the QR decomposition, A = QR.
        // Since the eigenvalues of a block-upper-triangular matrix are
        // the eigenvalues of its diagonal blocks and we know how to find
        // eigenvalues of a 2x2 matrix, we know the eigenvalues of A.


        let arr = clone(A)

        // the list of converged eigenvalues
        const lambdas = []

        // size of arr, which will get smaller as eigenvalues converge
        let n = N;

        // the diagonal of the block-diagonal matrix that turns
        // converged 2x2 matrices into upper triangular matrices
        const Sdiag = []

        // N×N matrix describing the overall transformation done during the QR algorithm
        let Qtotal = findVectors ? diag(Array(N).fill(1)) : undefined

        // n×n matrix describing the QR transformations done since last convergence
        let Qpartial = findVectors ? diag(Array(n).fill(1)) : undefined

        // last eigenvalue converged before this many steps
        let lastConvergenceBefore = 0;


        while (lastConvergenceBefore <= 30)
        {
            lastConvergenceBefore += 1

            // TODO if the convergence is slow, do something clever

            // Perform the factorization

            let k = 0; // TODO set close to an eigenvalue

            for (let i = 0; i < n; i++)
                arr[i][i] -= k

            // TODO do an implicit QR transformation
            let {Q, R} = qr(arr)
            arr = multiply(R, Q)

            for (let i = 0; i < n; i++)
                arr[i][i] += k


            // keep track of transformations
            if (findVectors)
                Qpartial = multiply(Qpartial, Q)


            // The rightmost diagonal element converged to an eigenvalue
            if (n == 1 || (big ? abs(arr[n-1][n-2]).lessThan(prec) : abs(arr[n-1][n-2]) < prec))
            {
                lastConvergenceBefore = 0
                lambdas.push(arr[n-1][n-1])

                // keep track of transformations
                if (findVectors) {
                    Sdiag.unshift( [[1]] )
                    inflateMatrix(Qpartial, N)
                    Qtotal = multiply(Qtotal, Qpartial)

                    if (n > 1)
                        Qpartial = diag( Array(n-1).fill(1) )
                }

                // reduce the matrix size
                n -= 1
                arr.pop()
                for (let i = 0; i < n; i++)
                    arr[i].pop()
            }

            // The rightmost diagonal 2x2 block converged
            else if (n == 2 || (big ? abs(arr[n-2][n-3]).lessThan(prec) : abs(arr[n-2][n-3]) < prec))
            {
                lastConvergenceBefore = 0
                let ll = eigenvalues2x2(
                    arr[n-2][n-2], arr[n-2][n-1],
                    arr[n-1][n-2], arr[n-1][n-1]
                )
                lambdas.push(...ll)

                // keep track of transformations
                if (findVectors) {
                    Sdiag.unshift(jordanBase2x2(
                        arr[n-2][n-2], arr[n-2][n-1],
                        arr[n-1][n-2], arr[n-1][n-1],
                        ll[0], ll[1], prec, type
                    ))
                    inflateMatrix(Qpartial, N)
                    Qtotal = multiply(Qtotal, Qpartial)

                    if (n > 2)
                        Qpartial = diag( Array(n-2).fill(1) )
                }

                // reduce the matrix size
                n -= 2
                arr.pop()
                arr.pop()
                for (let i = 0; i < n; i++) {
                    arr[i].pop()
                    arr[i].pop()
                }
            }

            if (n == 0) break;
        }

        // the algorithm didn't converge
        if (lastConvergenceBefore > 30)
            throw Error('The eigenvalues failed to converge. Only found these eigenvalues: '+values.join(', '))

        // combine the overall QR transformation Qtotal with the subsequent
        // transformation S that turns the diagonal 2x2 blocks to upper triangular
        let C = findVectors ? multiply( Qtotal, blockDiag(Sdiag, N) ) : undefined

        return { values: lambdas, C }
    }


    /**
     * @param {Matrix} A original matrix
     * @param {number} N size of A
     * @param {Matrix} C column transformation matrix that turns A into upper triangular
     * @param {number[]} values array of eigenvalues of A
     * @returns {Matrix[]} eigenvalues
     */
    function findEigenvectors(A, N, C, values)
    {
        const Cinv = inv(C)
        const U = multiply( Cinv, A, C )

        const b = Array(N).fill(0)
        const E = diag(Array(N).fill(1))

        let vectors = []

        for (const l of values) {
            // !FIXME this is a mock implementation
            const v = usolve( subtract(U, multiply(l, E)), b )
            vectors.push( multiply(C, v) )
        }

        return vectors
    }


    /**
     * Compute the eigenvalues of an 2x2 matrix
     * @return {[number,number]}
     */
    function eigenvalues2x2(a,b,c,d)
    {
        // λ± = ½ trA ± ½ √( tr²A - 4 detA )
        const trA = addScalar(a, d)
        const detA = subtract(multiply(a, d), multiply(b, c))
        const x = multiply(trA, 0.5)
        const y = multiply(sqrt( subtract(multiply(trA, trA), multiply(4, detA)) ), 0.5)

        return [addScalar(x, y), subtract(x, y)]
    }


    /**
     * For an 2x2 matrix compute the transformation matrix S,
     * so that SAS⁻¹ is an upper triangular matrix
     * @return {[[number,number],[number,number]]}
     * @see https://math.berkeley.edu/~ogus/old/Math_54-05/webfoils/jordan.pdf
     * @see http://people.math.harvard.edu/~knill/teaching/math21b2004/exhibits/2dmatrices/index.html
     */
    function jordanBase2x2(a,b,c,d,l1,l2,prec,type)
    {
        const big = type === 'BigNumber'

        const b0 = big ? 0 : bignumber(0)
        const b1 = big ? 1 : bignumber(1)


        // matrix is already upper triangular
        // return an identity matrix
        if (big ? abs(c).lessThan(prec) : abs(c) < prec)
            return [ [b1, b0], [b0, b1] ]

        // matrix is diagonalizable
        // return its eigenvectors as columns
        if (big ? abs(l1.sub(l2)).greaterThan(prec) : abs(subtract(l1, l2)) > prec)
            return [ [ subtract(l1, d), subtract(l2, d) ], [ c, c ] ]


        // matrix is not diagonalizable
        // compute off-diagonal elements of N = A - λI
        // N₁₂ = 0 ⇒ S = ( N⃗₁, I⃗₁ )
        // N₁₂ ≠ 0 ⇒ S = ( N⃗₂, I⃗₂ )

        let na = subtract(a, l1)
        let nb = subtract(b, l1)
        let nc = subtract(c, l1)
        let nd = subtract(d, l1)

        if (big ? abs(nb).lessThan(prec) : abs(nb) < prec)
            return [ [na, b1], [nc, b0] ]
        else
            return [ [nb, b0], [nd, b1] ]
    }


    /**
     * Enlarge the matrix from n×n to N×N, setting the new
     * elements to 1 on diagonal and 0 elsewhere
     */
    function inflateMatrix(arr, N)
    {
        // add columns
        for (let i = 0; i < arr.length; i++)
            arr[i].push( ...Array(N-arr[i].length).fill(0) )

        // add rows
        for (let i = arr.length; i < N; i++) {
            arr.push( Array(N).fill(0) )
            arr[i][i] = 1
        }

        return arr
    }


    /**
     * Create a block-diagonal matrix with the given square matrices on the diagonal
     * @param {Matrix[] | number[][][]} arr array of matrices to be placed on the diagonal
     * @param {number} N the size of the resulting matrix
     */
    function blockDiag(arr, N)
    {
        const M = []
        for (let i = 0; i < N; i++)
            M[i] = Array(N).fill(0)

        let I = 0;
        for (const sub of arr)
        {
            const n = sub.length

            for (let i = 0; i < n; i++)
            for (let j = 0; j < n; j++)
                M[I+i][I+j] = sub[i][j]

            I += n
        }

        return M
    }


    return main;
}