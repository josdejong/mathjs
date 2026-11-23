import { IndexError } from '../../../error/IndexError.js'
import { BROADCAST_ERROR_DATA, formatBroadcastErrorMessage } from '../../../utils/array.js'

/**
 * Transform zero-based dimension index in a broadcasting shape mismatch error
 * to a one-based dimension index.
 * @param {Error} err
 * @returns {Error} Returns the transformed error (or original error if not a zero-based broadcast error)
 */
export function transformBroadcastError (err) {
  if (err && err[BROADCAST_ERROR_DATA]) {
    const { size, dimension, fromSize, toSize } = err[BROADCAST_ERROR_DATA]
    return new Error(formatBroadcastErrorMessage(size, dimension + 1, fromSize, toSize))
  }

  return err
}

/**
 * Transform zero-based indices to one-based indices in errors
 * @param {Error} err
 * @returns {Error | IndexError} Returns the transformed error
 */
export function errorTransform (err) {
  if (err && err.isIndexError) {
    return new IndexError(
      err.index + 1,
      err.min + 1,
      err.max !== undefined ? err.max + 1 : undefined)
  }

  return transformBroadcastError(err)
}
