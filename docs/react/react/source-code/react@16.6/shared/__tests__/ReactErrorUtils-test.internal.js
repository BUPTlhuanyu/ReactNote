/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

let ReactErrorUtils;

describe('ReactErrorUtils', () => {
  beforeEach(() => {
    // TODO: can we express this test with only public API?
    ReactErrorUtils = require('shared/ReactErrorUtils');
  });

  it(`it should rethrow caught errors`, () => {
    const err = new Error('foo');
    const callback = function() {
      throw err;
    };
    ReactErrorUtils.invokeGuardedCallbackAndCatchFirstError(
      'foo',
      callback,
      null,
    );
    expect(ReactErrorUtils.hasCaughtError()).toBe(false);
    expect(() => ReactErrorUtils.rethrowCaughtError()).toThrow(err);
  });

  it(`should call the callback the passed arguments`, () => {
    const callback = jest.fn();
    ReactErrorUtils.invokeGuardedCallback(
      'foo',
      callback,
      null,
      'arg1',
      'arg2',
    );
    expect(callback).toBeCalledWith('arg1', 'arg2');
  });

  it(`should call the callback with the provided context`, () => {
    const context = {didCall: false};
    ReactErrorUtils.invokeGuardedCallback(
      'foo',
      function() {
        this.didCall = true;
      },
      context,
    );
    expect(context.didCall).toBe(true);
  });

  it(`should catch errors`, () => {
    const error = new Error();
    const returnValue = ReactErrorUtils.invokeGuardedCallback(
      'foo',
      function() {
        throw error;
      },
      null,
      'arg1',
      'arg2',
    );
    expect(returnValue).toBe(undefined);
    expect(ReactErrorUtils.hasCaughtError()).toBe(true);
    expect(ReactErrorUtils.clearCaughtError()).toBe(error);
  });

  it(`should return false from clearCaughtError if no error was thrown`, () => {
    const callback = jest.fn();
    ReactErrorUtils.invokeGuardedCallback('foo', callback, null);
    expect(ReactErrorUtils.hasCaughtError()).toBe(false);
    expect(ReactErrorUtils.clearCaughtError).toThrow('no error was captured');
  });

  it(`can nest with same debug name`, () => {
    const err1 = new Error();
    let err2;
    const err3 = new Error();
    let err4;
    ReactErrorUtils.invokeGuardedCallback(
      'foo',
      function() {
        ReactErrorUtils.invokeGuardedCallback(
          'foo',
          function() {
            throw err1;
          },
          null,
        );
        err2 = ReactErrorUtils.clearCaughtError();
        throw err3;
      },
      null,
    );
    err4 = ReactErrorUtils.clearCaughtError();

    expect(err2).toBe(err1);
    expect(err4).toBe(err3);
  });

  it(`handles nested errors`, () => {
    const err1 = new Error();
    let err2;
    ReactErrorUtils.invokeGuardedCallback(
      'foo',
      function() {
        ReactErrorUtils.invokeGuardedCallback(
          'foo',
          function() {
            throw err1;
          },
          null,
        );
        err2 = ReactErrorUtils.clearCaughtError();
      },
      null,
    );
    // Returns null because inner error was already captured
    expect(ReactErrorUtils.hasCaughtError()).toBe(false);

    expect(err2).toBe(err1);
  });

  it('handles nested errors in separate renderers', () => {
    const ReactErrorUtils1 = require('shared/ReactErrorUtils');
    jest.resetModules();
    const ReactErrorUtils2 = require('shared/ReactErrorUtils');
    expect(ReactErrorUtils1).not.toEqual(ReactErrorUtils2);

    let ops = [];

    ReactErrorUtils1.invokeGuardedCallback(
      null,
      () => {
        ReactErrorUtils2.invokeGuardedCallback(
          null,
          () => {
            throw new Error('nested error');
          },
          null,
        );
        // ReactErrorUtils2 should catch the error
        ops.push(ReactErrorUtils2.hasCaughtError());
        ops.push(ReactErrorUtils2.clearCaughtError().message);
      },
      null,
    );

    // ReactErrorUtils1 should not catch the error
    ops.push(ReactErrorUtils1.hasCaughtError());

    expect(ops).toEqual([true, 'nested error', false]);
  });

  if (!__DEV__) {
    // jsdom doesn't handle this properly, but Chrome and Firefox should. Test
    // this with a fixture.
    it('catches null values', () => {
      ReactErrorUtils.invokeGuardedCallback(
        null,
        function() {
          throw null; // eslint-disable-line no-throw-literal
        },
        null,
      );
      expect(ReactErrorUtils.hasCaughtError()).toBe(true);
      expect(ReactErrorUtils.clearCaughtError()).toBe(null);
    });
  }

  it(`can be shimmed`, () => {
    const ops = [];
    jest.resetModules();
    jest.mock(
      'shared/invokeGuardedCallbackImpl',
      () =>
        function invokeGuardedCallback(name, func, context, a) {
          ops.push(a);
          try {
            func.call(context, a);
          } catch (error) {
            this.onError(error);
          }
        },
    );
    ReactErrorUtils = require('shared/ReactErrorUtils');

    try {
      const err = new Error('foo');
      const callback = function() {
        throw err;
      };
      ReactErrorUtils.invokeGuardedCallbackAndCatchFirstError(
        'foo',
        callback,
        null,
        'somearg',
      );
      expect(() => ReactErrorUtils.rethrowCaughtError()).toThrow(err);
      expect(ops).toEqual(['somearg']);
    } finally {
      jest.unmock('shared/invokeGuardedCallbackImpl');
    }
  });
});
