// Copyright (c) 2006-2024, Timothy A. Davis, All Rights Reserved.
// SPDX-License-Identifier: LGPL-2.1+
// https://github.com/DrTimothyAldenDavis/SuiteSparse/tree/dev/CSparse/Source

/**
 * This function "flips" its input about the integer -1.
 *
 * @param {Number}  i               The value to flip
 */
export function csFlip (i) {
  // flip the value
  return -i - 2
}
