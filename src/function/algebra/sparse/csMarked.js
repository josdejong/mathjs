// Copyright (c) 2006-2024, Timothy A. Davis, All Rights Reserved.
// SPDX-License-Identifier: LGPL-2.1+
// https://github.com/DrTimothyAldenDavis/SuiteSparse/tree/dev/CSparse/Source

/**
 * Checks if the node at w[j] is marked
 *
 * @param {Array}   w               The array
 * @param {Number}  j               The array index
 */
export function csMarked (w, j) {
  // check node is marked
  return w[j] < 0
}
