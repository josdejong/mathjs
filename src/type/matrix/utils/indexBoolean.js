export function booleansArrayToIndex (booleanArrayIndex) {
  // gets an array of booleans and returns an array of numbers
  const indexOfNumbers = []
  booleanArrayIndex.forEach((bool, idx) => {
    if (bool) indexOfNumbers.push(idx)
  })
  return indexOfNumbers
}

export function booleansMatrixToIndex (booleanMatrixIndex) {
  // gets a matrix of booleans and returns an array of numbers
  return booleansArrayToIndex(booleanMatrixIndex._data)
}
