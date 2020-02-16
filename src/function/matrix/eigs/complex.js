export function createComplex({add, multiply, abs, bignumber, diag}) {
    /**
     * @param {number[][]} arr
     * @param {number} N
     * @param {number|BigNumber} prec
     * @param {'number'|'BigNumber'|'Complex'} type
     */
    function main(arr, N, prec, type)
    {
        // TODO check if any row/col are zero except the diagonal

        let R = balance(arr, N, prec, type)

        // TODO if magnitudes of elements vary over many orders,
        // move greatest elements to the top left corner

        reduceToHessenberg(arr, N, prec, type, R)
        console.log(arr, R)

        throw new Error('Not implemented yet.')
    }

    /**
     * @param {number[][]} arr
     * @param {number} N
     * @param {number} prec
     * @param {'number'|'BigNumber'|'Complex'} type
     * @returns {number[][]}
     */
    function balance(arr, N, prec, type)
    {
        const big  = type === 'BigNumber'
        const cplx = type === 'Complex'

        const bigZero = bignumber(0)
        const bigOne  = bignumber(1)

        // base of the floating-point arithmetic
        const radix = big ? bignumber(10) : 2
        const radixSq = multiply(radix, radix)

        // the diagonal transformation matrix R
        const Rdiag = Array(+N).fill(big ? bigOne : 1)

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


                if (big ? !colNorm.equals(0) && !rowNorm.equals(0) : colNorm !== 0 && rowNorm !== 0)
                {
                    // find integer power closest to balancing the matrix
                    let f = big ? bignumber(1) : 1
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
                        // okay bro we should definitely loop once again
                        last = false

                        let g = big ? bigOne.div(f) : 1/f
                        Rdiag[i] = big ? R[i].mul(f) : Rdiag[i]*f

                        for (let j = 0; j < N; j++)
                        {
                            if (i === j) continue;
                            arr[i][j] = multiply(arr[i][j], f)
                            arr[j][i] = multiply(arr[j][i], g)
                        }
                    }

                }
            }
        }

        // return the diagonal transformation matrix
        return diag(Rdiag)
    }


    /**
     * @param {number[][]} arr
     * @param {number} N
     * @param {number} prec
     * @param {'number'|'BigNumber'|'Complex'} type
     * @param {number[][]} R
     */
    function reduceToHessenberg(arr, N, prec, type, R)
    {
        const big  = type === 'BigNumber'
        const cplx = type === 'Complex'

        const bigZero = bignumber(0)
        const bigOne  = bignumber(1)

        for (let i = 0; i < N-2; i++)
        {
            // Find the largest subdiag element in the i-th col

            let maxIndex = 0
            let max = big ? bigZero : 0

            for (let j = i + 1; j < N; j++)
            {
                let el = abs(arr[j][i])
                if (big ? max.abs().lessThan(el) : Math.abs(max) < el) {
                    max = el
                    maxIndex = j
                }
            }

            // This col is pivoted, no need to do anything
            if (big ? max.equals(bigZero) : max === 0)
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
                const tmp3 = R[maxIndex]
                R[maxIndex] = R[i+1]
                R[i+1] = tmp3
            }

            // Reduce following rows and columns
            for (let j = i + 2; j < N; j++)
            {
                let n = !big ? arr[j][i] / max : arr[j][i].div(max)

                if (n == 0) continue;

                // from j-th row subtract n-times (i+1)th row
                for (let k = 0; k < N; k++)
                    arr[j][k] = !big ? arr[j][k] - n*arr[i+1][k] : arr[j][k].sub(n.mul(arr[i+1][k]))

                // to (i+1)th column add n-times j-th column
                for (let k = 0; k < N; k++)
                    arr[k][i+1] = !big ? arr[k][i+1] + n*arr[k][j] : arr[k][i+1].add(n.mul(arr[k][j]))

                // keep track of transformations
                for (let k = 0; k < N; k++)
                    R[j][k] = !big ? R[j][k] - n*R[i+1][k] : R[j][k].sub(n.mul(R[i+1][k]))
            }
        }

        return R
    }


    return main;
}