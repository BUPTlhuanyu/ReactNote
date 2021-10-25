/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

let ReactCache;
let createResource;
let React;
let ReactFeatureFlags;
let ReactTestRenderer;
let Suspense;
let TextResource;
let textResourceShouldFail;
let flushScheduledWork;
let evictLRU;

describe('ReactCache', () => {
  beforeEach(() => {
    jest.resetModules();

    jest.mock('scheduler', () => {
      let callbacks = [];
      return {
        unstable_scheduleCallback(callback) {
          const callbackIndex = callbacks.length;
          callbacks.push(callback);
          return {callbackIndex};
        },
        flushScheduledWork() {
          while (callbacks.length) {
            const callback = callbacks.pop();
            callback();
          }
        },
      };
    });

    ReactFeatureFlags = require('shared/ReactFeatureFlags');
    ReactFeatureFlags.debugRenderPhaseSideEffectsForStrictMode = false;
    ReactFeatureFlags.replayFailedUnitOfWorkWithInvokeGuardedCallback = false;
    React = require('react');
    Suspense = React.Suspense;
    ReactCache = require('react-cache');
    createResource = ReactCache.unstable_createResource;
    ReactTestRenderer = require('react-test-renderer');
    flushScheduledWork = require('scheduler').flushScheduledWork;
    evictLRU = flushScheduledWork;

    TextResource = createResource(([text, ms = 0]) => {
      let listeners = null;
      let status = 'pending';
      let value = null;
      return {
        then(resolve, reject) {
          switch (status) {
            case 'pending': {
              if (listeners === null) {
                listeners = [{resolve, reject}];
                setTimeout(() => {
                  if (textResourceShouldFail) {
                    ReactTestRenderer.unstable_yield(
                      `Promise rejected [${text}]`,
                    );
                    status = 'rejected';
                    value = new Error('Failed to load: ' + text);
                    listeners.forEach(listener => listener.reject(value));
                  } else {
                    ReactTestRenderer.unstable_yield(
                      `Promise resolved [${text}]`,
                    );
                    status = 'resolved';
                    value = text;
                    listeners.forEach(listener => listener.resolve(value));
                  }
                }, ms);
              } else {
                listeners.push({resolve, reject});
              }
              break;
            }
            case 'resolved': {
              resolve(value);
              break;
            }
            case 'rejected': {
              reject(value);
              break;
            }
          }
        },
      };
    }, ([text, ms]) => text);

    textResourceShouldFail = false;
  });

  function Text(props) {
    ReactTestRenderer.unstable_yield(props.text);
    return props.text;
  }

  function AsyncText(props) {
    const text = props.text;
    try {
      TextResource.read([props.text, props.ms]);
      ReactTestRenderer.unstable_yield(text);
      return text;
    } catch (promise) {
      if (typeof promise.then === 'function') {
        ReactTestRenderer.unstable_yield(`Suspend! [${text}]`);
      } else {
        ReactTestRenderer.unstable_yield(`Error! [${text}]`);
      }
      throw promise;
    }
  }

  it('throws a promise if the requested value is not in the cache', () => {
    function App() {
      return (
        <Suspense fallback={<Text text="Loading..." />}>
          <AsyncText ms={100} text="Hi" />
        </Suspense>
      );
    }

    const root = ReactTestRenderer.create(<App />, {
      unstable_isConcurrent: true,
    });

    expect(root).toFlushAndYield(['Suspend! [Hi]', 'Loading...']);

    jest.advanceTimersByTime(100);
    expect(ReactTestRenderer).toHaveYielded(['Promise resolved [Hi]']);
    expect(root).toFlushAndYield(['Hi']);
  });

  it('throws an error on the subsequent read if the promise is rejected', async () => {
    function App() {
      return (
        <Suspense fallback={<Text text="Loading..." />}>
          <AsyncText ms={100} text="Hi" />
        </Suspense>
      );
    }

    const root = ReactTestRenderer.create(<App />, {
      unstable_isConcurrent: true,
    });

    expect(root).toFlushAndYield(['Suspend! [Hi]', 'Loading...']);

    textResourceShouldFail = true;
    jest.advanceTimersByTime(100);
    expect(ReactTestRenderer).toHaveYielded(['Promise rejected [Hi]']);

    expect(root).toFlushAndThrow('Failed to load: Hi');
    expect(ReactTestRenderer).toHaveYielded(['Error! [Hi]', 'Error! [Hi]']);

    // Should throw again on a subsequent read
    root.update(<App />);
    expect(root).toFlushAndThrow('Failed to load: Hi');
    expect(ReactTestRenderer).toHaveYielded(['Error! [Hi]', 'Error! [Hi]']);
  });

  it('warns if non-primitive key is passed to a resource without a hash function', () => {
    const BadTextResource = createResource(([text, ms = 0]) => {
      return new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve(text);
        }, ms),
      );
    });

    function App() {
      ReactTestRenderer.unstable_yield('App');
      return BadTextResource.read(['Hi', 100]);
    }

    const root = ReactTestRenderer.create(
      <Suspense fallback={<Text text="Loading..." />}>
        <App />
      </Suspense>,
      {
        unstable_isConcurrent: true,
      },
    );

    if (__DEV__) {
      expect(() => {
        expect(root).toFlushAndYield(['App', 'Loading...']);
      }).toWarnDev(
        [
          'Invalid key type. Expected a string, number, symbol, or ' +
            'boolean, but instead received: Hi,100\n\n' +
            'To use non-primitive values as keys, you must pass a hash ' +
            'function as the second argument to createResource().',
        ],
        {withoutStack: true},
      );
    } else {
      expect(root).toFlushAndYield(['App', 'Loading...']);
    }
  });

  it('evicts least recently used values', async () => {
    ReactCache.unstable_setGlobalCacheLimit(3);

    // Render 1, 2, and 3
    const root = ReactTestRenderer.create(
      <Suspense fallback={<Text text="Loading..." />}>
        <AsyncText ms={100} text={1} />
        <AsyncText ms={100} text={2} />
        <AsyncText ms={100} text={3} />
      </Suspense>,
      {
        unstable_isConcurrent: true,
      },
    );
    expect(root).toFlushAndYield([
      'Suspend! [1]',
      'Suspend! [2]',
      'Suspend! [3]',
      'Loading...',
    ]);
    jest.advanceTimersByTime(100);
    expect(ReactTestRenderer).toHaveYielded([
      'Promise resolved [1]',
      'Promise resolved [2]',
      'Promise resolved [3]',
    ]);
    expect(root).toFlushAndYield([1, 2, 3]);
    expect(root).toMatchRenderedOutput('123');

    // Render 1, 4, 5
    root.update(
      <Suspense fallback={<Text text="Loading..." />}>
        <AsyncText ms={100} text={1} />
        <AsyncText ms={100} text={4} />
        <AsyncText ms={100} text={5} />
      </Suspense>,
    );

    expect(root).toFlushAndYield([
      1,
      'Suspend! [4]',
      'Suspend! [5]',
      'Loading...',
    ]);
    jest.advanceTimersByTime(100);
    expect(ReactTestRenderer).toHaveYielded([
      'Promise resolved [4]',
      'Promise resolved [5]',
    ]);
    expect(root).toFlushAndYield([1, 4, 5]);
    expect(root).toMatchRenderedOutput('145');

    // We've now rendered values 1, 2, 3, 4, 5, over our limit of 3. The least
    // recently used values are 2 and 3. They will be evicted during the
    // next sweep.
    evictLRU();

    root.update(
      <Suspense fallback={<Text text="Loading..." />}>
        <AsyncText ms={100} text={1} />
        <AsyncText ms={100} text={2} />
        <AsyncText ms={100} text={3} />
      </Suspense>,
    );

    expect(root).toFlushAndYield([
      // 1 is still cached
      1,
      // 2 and 3 suspend because they were evicted from the cache
      'Suspend! [2]',
      'Suspend! [3]',
      'Loading...',
    ]);
    jest.advanceTimersByTime(100);
    expect(ReactTestRenderer).toHaveYielded([
      'Promise resolved [2]',
      'Promise resolved [3]',
    ]);
    expect(root).toFlushAndYield([1, 2, 3]);
    expect(root).toMatchRenderedOutput('123');
  });

  it('preloads during the render phase', async () => {
    function App() {
      TextResource.preload(['B', 1000]);
      TextResource.read(['A', 1000]);
      TextResource.read(['B', 1000]);
      return <Text text="Result" />;
    }

    const root = ReactTestRenderer.create(
      <Suspense fallback={<Text text="Loading..." />}>
        <App />
      </Suspense>,
      {
        unstable_isConcurrent: true,
      },
    );

    expect(root).toFlushAndYield(['Loading...']);

    jest.advanceTimersByTime(1000);
    expect(ReactTestRenderer).toHaveYielded([
      'Promise resolved [B]',
      'Promise resolved [A]',
    ]);
    expect(root).toFlushAndYield(['Result']);
    expect(root).toMatchRenderedOutput('Result');
  });

  it('if a thenable resolves multiple times, does not update the first cached value', () => {
    let resolveThenable;
    const BadTextResource = createResource(([text, ms = 0]) => {
      let listeners = null;
      let value = null;
      return {
        then(resolve, reject) {
          if (value !== null) {
            resolve(value);
          } else {
            if (listeners === null) {
              listeners = [resolve];
              resolveThenable = v => {
                listeners.forEach(listener => listener(v));
              };
            } else {
              listeners.push(resolve);
            }
          }
        },
      };
    }, ([text, ms]) => text);

    function BadAsyncText(props) {
      const text = props.text;
      try {
        const actualText = BadTextResource.read([props.text, props.ms]);
        ReactTestRenderer.unstable_yield(actualText);
        return actualText;
      } catch (promise) {
        if (typeof promise.then === 'function') {
          ReactTestRenderer.unstable_yield(`Suspend! [${text}]`);
        } else {
          ReactTestRenderer.unstable_yield(`Error! [${text}]`);
        }
        throw promise;
      }
    }

    const root = ReactTestRenderer.create(
      <Suspense fallback={<Text text="Loading..." />}>
        <BadAsyncText text="Hi" />
      </Suspense>,
      {
        unstable_isConcurrent: true,
      },
    );

    expect(root).toFlushAndYield(['Suspend! [Hi]', 'Loading...']);

    resolveThenable('Hi');
    // This thenable improperly resolves twice. We should not update the
    // cached value.
    resolveThenable('Hi muahahaha I am different');

    root.update(
      <Suspense fallback={<Text text="Loading..." />}>
        <BadAsyncText text="Hi" />
      </Suspense>,
      {
        unstable_isConcurrent: true,
      },
    );

    expect(ReactTestRenderer).toHaveYielded([]);
    expect(root).toFlushAndYield(['Hi']);
    expect(root).toMatchRenderedOutput('Hi');
  });

  it('throws if read is called outside render', () => {
    expect(() => TextResource.read(['A', 1000])).toThrow(
      "read and preload may only be called from within a component's render",
    );
  });

  it('throws if preload is called outside render', () => {
    expect(() => TextResource.preload(['A', 1000])).toThrow(
      "read and preload may only be called from within a component's render",
    );
  });
});
