export const partitionSelectDocs = {
  name: 'partitionSelect',
  category: 'Matrix',
  syntax: [
    'partitionSelect(x, k)',
    'partitionSelect(x, k, compare)'
  ],
  description: 'Partition-based selection of an array or 1D matrix. Will find the kth smallest value, and mutates the input array. Uses Quickselect.',
  examples: [
    'partitionSelect([5, 10, 1], 2)',
    'partitionSelect(["C", "B", "A", "D"], 1, compareText)',
    'arr = [5, 2, 1]',
    'partitionSelect(arr, 0) # returns 1, arr is now: [1, 2, 5]',
    'arr',
    'partitionSelect(arr, 1, \'desc\') # returns 2, arr is now: [5, 2, 1]',
    'arr'
  ],
  seealso: ['sort']
}
