/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import {
  REACT_CONCURRENT_MODE_TYPE,
  REACT_CONTEXT_TYPE,
  REACT_FORWARD_REF_TYPE,
  REACT_FRAGMENT_TYPE,
  REACT_PROFILER_TYPE,
  REACT_PROVIDER_TYPE,
  REACT_STRICT_MODE_TYPE,
  REACT_SUSPENSE_TYPE,
  REACT_MEMO_TYPE,
  REACT_LAZY_TYPE,
} from 'shared/ReactSymbols';

export default function isValidElementType(type: mixed) {
  return (
    typeof type === 'string' ||
    typeof type === 'function' ||
    // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
    type === REACT_FRAGMENT_TYPE ||
    type === REACT_CONCURRENT_MODE_TYPE ||
    type === REACT_PROFILER_TYPE ||
    type === REACT_STRICT_MODE_TYPE ||
    type === REACT_SUSPENSE_TYPE ||
    (typeof type === 'object' &&
      type !== null &&
      (type.$$typeof === REACT_LAZY_TYPE ||
        type.$$typeof === REACT_MEMO_TYPE ||
        type.$$typeof === REACT_PROVIDER_TYPE ||
        type.$$typeof === REACT_CONTEXT_TYPE ||
        type.$$typeof === REACT_FORWARD_REF_TYPE))
  );
}
