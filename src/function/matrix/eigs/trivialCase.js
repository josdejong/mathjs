export function createTrivial ({ addScalar, subtract, multiplyScalar, sqrt, divideScalar }) {
  function main (arr) {
    const a = arr[0][0]
    const b = arr[0][1]
    const c = arr[1][0]
    const d = arr[1][1]
    const values = eigenvalues2x2(a, b, c, d)

    if (values[0] === values[1]) {
      return {
        values: [values[0], values[0]],
        vectors: [[0, 1], [0, 1]]
      }
    }

    const eigenvector1 = [divideScalar(c, subtract(values[0], a)), 1]
    const eigenvector2 = [divideScalar(c, subtract(values[1], a)), 1]

    return {
      values,
      vectors: [eigenvector1, eigenvector2]
    }
  }

  function eigenvalues2x2 (a, b, c, d) {
    // λ± = ½ trA ± ½ √( tr²A - 4 detA )
    const trA = addScalar(a, d)
    const detA = subtract(multiplyScalar(a, d), multiplyScalar(b, c))
    const x = multiplyScalar(trA, 0.5)
    const y = multiplyScalar(sqrt(subtract(multiplyScalar(trA, trA), multiplyScalar(4, detA))), 0.5)

    return [subtract(x, y), addScalar(x, y)]
  }

  return main
}
