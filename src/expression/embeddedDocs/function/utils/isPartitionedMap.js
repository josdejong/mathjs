/**
 * Test whether a value is a partitioned map.
 *
 * Syntax:
 *
 *     math.isPartitionedMap(x)
 *
 * Examples:
 *
 *    math.isPartitionedMap()
 *
 * See also:
 *  isMap
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a partitioned map, false otherwise.
 */
export const isPartitionedMapDocs = {
  name: 'isPartitionedMap',
  category: 'Type Checks',
  syntax: ['isPartitionedMap(x)'],
  description: 'Check if a value is a partitioned map.',
  examples: ['isPartitionedMap(/* example value */)'],
  seealso: ['isMap']
}
