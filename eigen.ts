type Vector = number[]
type Matrix = number[][]

// Vector and Matrix helper functions

function magnitude(vec: Vector) {
  return Math.sqrt(vec.reduce((acc, val) => acc + val ** 2, 0))
}

function normalizeVector(vec: Vector) {
  const mag = magnitude(vec)

  if (mag === 0) {
    console.warn('Cannot normalize a zero vector.')
    return vec
  }

  return vec.map((value) => value / mag)
}

// mathjs.diag
function createDiagonalMatrix(vec: Vector) {
  const matrix: Matrix = []
  const n = vec.length

  for (let i = 0; i < n; i++) {
    const row = new Array(n).fill(0)
    row[i] = vec[i]
    matrix.push(row)
  }

  return matrix
}

function matrixVectorMultiplication(matrix: Matrix, vector: Vector) {
  const N = matrix.length
  const resultVector: Vector = []

  for (let i = 0; i < N; i++) {
    let sum = 0
    for (let j = 0; j < N; j++) {
      sum += matrix[i][j] * vector[j]
    }
    resultVector.push(sum)
  }

  return resultVector
}

function matrixSubtraction(matrixA: Matrix, matrixB: Matrix) {
  const N = matrixA.length
  const resultMatrix: Matrix = []

  for (let i = 0; i < N; i++) {
    const row = []
    for (let j = 0; j < N; j++) {
      row.push(matrixA[i][j] - matrixB[i][j])
    }
    resultMatrix.push(row)
  }

  return resultMatrix
}

function matrixMultiplication(A: Matrix, B: Matrix) {
  const n = A.length
  const C: Matrix = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0))

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0
      for (let k = 0; k < n; k++) {
        sum += A[i][k] * B[k][j]
      }
      C[i][j] = sum
    }
  }

  return C
}

// mathjs.inv
function matrixInverse(matrix: Matrix) {
  const N = matrix.length
  const augmentedMatrix: Matrix = []

  // Create the augmented matrix [matrix | I]
  for (let i = 0; i < N; i++) {
    augmentedMatrix.push([...matrix[i], ...Array(N).fill(0)])
    augmentedMatrix[i][N + i] = 1
  }

  // Perform Gauss-Jordan elimination
  for (let i = 0; i < N; i++) {
    // Find pivot
    let pivotRow = i
    for (let j = i + 1; j < N; j++) {
      if (
        Math.abs(augmentedMatrix[j][i]) > Math.abs(augmentedMatrix[pivotRow][i])
      ) {
        pivotRow = j
      }
    }

    // Swap rows
    ;[augmentedMatrix[i], augmentedMatrix[pivotRow]] = [
      augmentedMatrix[pivotRow],
      augmentedMatrix[i],
    ]

    // Normalize pivot row
    const pivotValue = augmentedMatrix[i][i]
    for (let j = i; j < 2 * N; j++) {
      augmentedMatrix[i][j] /= pivotValue
    }

    // Eliminate other rows
    for (let j = 0; j < N; j++) {
      if (j !== i) {
        const factor = augmentedMatrix[j][i]
        for (let k = i; k < 2 * N; k++) {
          augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k]
        }
      }
    }
  }

  // Extract the right half of the augmented matrix (the inverted matrix)
  return augmentedMatrix.map((row) => row.slice(N))
}

function extractDiagonal(matrix: Matrix) {
  const N = matrix.length
  const diagonal: Vector = []

  for (let i = 0; i < N; i++) {
    diagonal.push(matrix[i][i])
  }

  return diagonal
}

function generateRandomVector(size: number, min: number, max: number) {
  return Array(size)
    .fill(0)
    .map((_) => Math.random() * (max - min) + min) as Vector
}

function getSubMatrix(matrix: Matrix, n: number) {
  const subMatrix: Matrix = []
  const numRows = matrix.length

  for (let i = numRows - n; i < numRows; i++) {
    subMatrix.push(matrix[i].slice(-n))
  }

  return subMatrix
}

function transpose(matrix: Matrix) {
  const N = matrix.length

  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const temp = matrix[i][j]
      matrix[i][j] = matrix[j][i]
      matrix[j][i] = temp
    }
  }

  return matrix
}

// QR

function _calculateMatrixP(n: Vector, N: number) {
  const I = createDiagonalMatrix(Array(N).fill(1))
  const nT = n.map((val) => [val]) // Convert vector n to matrix nT
  const nnT = n.map((val) => val * 2) // Calculate 2 * n
  const nnTMatrix = nnT.map((val) => nT.map((row) => val * row[0])) // Calculate 2 * n * nT

  // Calculate P = I - 2 * n * nT
  return matrixSubtraction(I, nnTMatrix)
}

function calculateP(arr: Matrix, N: number) {
  const a1 = arr.map((row) => row[0])

  const b1 = Array(N).fill(0)
  b1[0] = 1

  const a1Mag = magnitude(a1)
  const sgnA1 = Math.sign(a1[0])

  // u = a1 - (-sign(a1[0])) * ||a1|| * b1
  const u = a1.map((a, i) => a + sgnA1 * a1Mag * b1[i])

  const uMag = magnitude(u)

  const n = u.map((e) => e / uMag)

  return _calculateMatrixP(n, N)
}

function upscaleP(P: Matrix, N: number, n: number) {
  // Ex P 4 2
  // | 1 0 0 0
  // | 0 1 0 0
  // | 0 0 a b
  // | 0 0 c d
  const identityMatrix = createDiagonalMatrix(Array(N).fill(1))

  const upscaledMatrix: Matrix = identityMatrix.map((row, i) => {
    if (i >= N - n) {
      return row.slice(0, N - n).concat(P[i - (N - n)])
    }
    return row
  })

  return upscaledMatrix
}

function QRDecomposition(arr: Matrix, N: number): [Matrix, Matrix] {
  let resultP = createDiagonalMatrix(Array(N).fill(1))

  const arrClone = arr.map((e) => [...e])

  const PArray: Matrix[] = []

  for (let n = N; n >= 2; n--) {
    const subMatrix = getSubMatrix(arr, n)

    const P = calculateP(subMatrix, n)

    const upscaledP = upscaleP(P, N, n)

    resultP = matrixMultiplication(resultP, upscaledP)
    arr = matrixMultiplication(upscaledP, arr)
    PArray.push(upscaledP)
  }

  const Q = PArray.reduce(
    (prev, curr) => matrixMultiplication(prev, transpose(curr)),
    createDiagonalMatrix(Array(N).fill(1))
  )

  const R = matrixMultiplication(
    PArray.reverse().reduce(
      (prev, curr) => matrixMultiplication(prev, curr),
      createDiagonalMatrix(Array(N).fill(1))
    ),
    arrClone
  )

  return [Q, R]
}

function estimateEigenValues(arr: Matrix, N: number) {
  const MAX_ITERATIONS = 150

  let arrClone = arr.map((e) => [...e])

  for (let i = 0; i < MAX_ITERATIONS; ++i) {
    const [Q, R] = QRDecomposition(
      arrClone.map((e) => [...e]),
      N
    )
    arrClone = matrixMultiplication(R, Q)
  }

  return extractDiagonal(arrClone)
}

function _get_eigen_vectors(matrix: Matrix, eigenvalues: Vector) {
  const lambda1 = eigenvalues[0]
  const lambda2 = eigenvalues[1]

  const a11 = matrix[0][0]
  const a21 = matrix[1][0]

  const normalizedEigenvector1 = [a21 / (lambda1 - a11), 1]
  const normalizedEigenvector2 = [a21 / (lambda2 - a11), 1]

  return [
    [lambda1, ...normalizedEigenvector1],
    [lambda2, ...normalizedEigenvector2],
  ]
}

function estimateEigenVectors(arr: Matrix, N: number) {
  const MAX_ITERATIONS = 150

  const values = estimateEigenValues(arr, N)

  if (N === 2) {
    return _get_eigen_vectors(arr, values)
  }

  const vectors = []

  for (const value of values) {
    let vector = generateRandomVector(N, 1, 10)
    for (let i = 0; i < MAX_ITERATIONS; ++i) {
      const tempMatrix = matrixSubtraction(
        arr,
        createDiagonalMatrix(Array(N).fill(value))
      )
      vector = matrixVectorMultiplication(matrixInverse(tempMatrix), vector)
      vector = normalizeVector(vector)
    }
    vectors.push([value, ...vector])
  }

  return vectors
}

// test
console.log(
  estimateEigenVectors(
    [
      [0.5, 0.75, 0.5],
      [1.0, 0.5, 0.75],
      [0.25, 0.25, 0.25],
    ],
    3
  )
)

console.log(
  estimateEigenVectors(
    [
      [1, 2],
      [4, 3],
    ],
    2
  )
)
