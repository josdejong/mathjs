import { IndexError } from '../../../error/IndexError'

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

  return err
}
