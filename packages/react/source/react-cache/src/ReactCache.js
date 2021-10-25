/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import React from 'react';
import warningWithoutStack from 'shared/warningWithoutStack';

import {createLRU} from './LRU';

type Thenable<T> = {
  then(resolve: (T) => mixed, reject: (mixed) => mixed): mixed,
};

type Suspender = {
  then(resolve: () => mixed, reject: () => mixed): mixed,
};

type PendingResult = {|
  status: 0,
  value: Suspender,
|};

type ResolvedResult<V> = {|
  status: 1,
  value: V,
|};

type RejectedResult = {|
  status: 2,
  value: mixed,
|};

type Result<V> = PendingResult | ResolvedResult<V> | RejectedResult;

type Resource<I, V> = {
  read(I): V,
  preload(I): void,
};

const Pending = 0;
const Resolved = 1;
const Rejected = 2;

const currentOwner =
  React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner;

function readContext(Context, observedBits) {
  const dispatcher = currentOwner.currentDispatcher;
  if (dispatcher === null) {
    throw new Error(
      'react-cache: read and preload may only be called from within a ' +
        "component's render. They are not supported in event handlers or " +
        'lifecycle methods.',
    );
  }
  return dispatcher.readContext(Context, observedBits);
}

function identityHashFn(input) {
  if (__DEV__) {
    warningWithoutStack(
      typeof input === 'string' ||
        typeof input === 'number' ||
        typeof input === 'boolean' ||
        input === undefined ||
        input === null,
      'Invalid key type. Expected a string, number, symbol, or boolean, ' +
        'but instead received: %s' +
        '\n\nTo use non-primitive values as keys, you must pass a hash ' +
        'function as the second argument to createResource().',
      input,
    );
  }
  return input;
}

const CACHE_LIMIT = 500;
const lru = createLRU(CACHE_LIMIT);

const entries: Map<Resource<any, any>, Map<any, any>> = new Map();

const CacheContext = React.createContext(null);

function accessResult<I, K, V>(
  resource: any,
  fetch: I => Thenable<V>,
  input: I,
  key: K,
): Result<V> {
  let entriesForResource = entries.get(resource);
  if (entriesForResource === undefined) {
    entriesForResource = new Map();
    entries.set(resource, entriesForResource);
  }
  let entry = entriesForResource.get(key);
  if (entry === undefined) {
    const thenable = fetch(input);
    thenable.then(
      value => {
        if (newResult.status === Pending) {
          const resolvedResult: ResolvedResult<V> = (newResult: any);
          resolvedResult.status = Resolved;
          resolvedResult.value = value;
        }
      },
      error => {
        if (newResult.status === Pending) {
          const rejectedResult: RejectedResult = (newResult: any);
          rejectedResult.status = Rejected;
          rejectedResult.value = error;
        }
      },
    );
    const newResult: PendingResult = {
      status: Pending,
      value: thenable,
    };
    const newEntry = lru.add(newResult, deleteEntry.bind(null, resource, key));
    entriesForResource.set(key, newEntry);
    return newResult;
  } else {
    return (lru.access(entry): any);
  }
}

function deleteEntry(resource, key) {
  const entriesForResource = entries.get(resource);
  if (entriesForResource !== undefined) {
    entriesForResource.delete(key);
    if (entriesForResource.size === 0) {
      entries.delete(resource);
    }
  }
}

export function unstable_createResource<I, K: string | number, V>(
  fetch: I => Thenable<V>,
  maybeHashInput?: I => K,
): Resource<I, V> {
  const hashInput: I => K =
    maybeHashInput !== undefined ? maybeHashInput : (identityHashFn: any);

  const resource = {
    read(input: I): V {
      // react-cache currently doesn't rely on context, but it may in the
      // future, so we read anyway to prevent access outside of render.
      readContext(CacheContext);
      const key = hashInput(input);
      const result: Result<V> = accessResult(resource, fetch, input, key);
      switch (result.status) {
        case Pending: {
          const suspender = result.value;
          throw suspender;
        }
        case Resolved: {
          const value = result.value;
          return value;
        }
        case Rejected: {
          const error = result.value;
          throw error;
        }
        default:
          // Should be unreachable
          return (undefined: any);
      }
    },

    preload(input: I): void {
      // react-cache currently doesn't rely on context, but it may in the
      // future, so we read anyway to prevent access outside of render.
      readContext(CacheContext);
      const key = hashInput(input);
      accessResult(resource, fetch, input, key);
    },
  };
  return resource;
}

export function unstable_setGlobalCacheLimit(limit: number) {
  lru.setLimit(limit);
}
