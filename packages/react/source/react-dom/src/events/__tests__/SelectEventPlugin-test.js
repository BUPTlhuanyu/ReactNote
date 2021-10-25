/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

let React;
let ReactDOM;

describe('SelectEventPlugin', () => {
  let container;

  beforeEach(() => {
    React = require('react');
    ReactDOM = require('react-dom');

    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  // See https://github.com/facebook/react/pull/3639 for details.
  it('does not get confused when dependent events are registered independently', () => {
    const select = jest.fn();
    const onSelect = event => {
      expect(typeof event).toBe('object');
      expect(event.type).toBe('select');
      expect(event.target).toBe(node);
      select(event.currentTarget);
    };

    // Pass `onMouseDown` so React registers a top-level listener.
    const node = ReactDOM.render(
      <input type="text" onMouseDown={function() {}} />,
      container,
    );
    node.focus();

    // Trigger `mousedown` and `mouseup`. Note that
    // React is not currently listening to `mouseup`.
    node.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      }),
    );
    node.dispatchEvent(
      new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
      }),
    );

    // Now subscribe to `onSelect`.
    ReactDOM.render(<input type="text" onSelect={onSelect} />, container);
    node.focus();

    // This triggers a `select` event in our polyfill.
    node.dispatchEvent(
      new KeyboardEvent('keydown', {bubbles: true, cancelable: true}),
    );

    // Verify that it doesn't get "stuck" waiting for
    // a `mouseup` event that it has "missed" because
    // a top-level listener didn't exist yet.
    expect(select).toHaveBeenCalledTimes(1);
  });

  it('should fire `onSelect` when a listener is present', () => {
    const select = jest.fn();
    const onSelect = event => {
      expect(typeof event).toBe('object');
      expect(event.type).toBe('select');
      expect(event.target).toBe(node);
      select(event.currentTarget);
    };

    const node = ReactDOM.render(
      <input type="text" onSelect={onSelect} />,
      container,
    );
    node.focus();

    let nativeEvent = new MouseEvent('focus', {
      bubbles: true,
      cancelable: true,
    });
    node.dispatchEvent(nativeEvent);
    expect(select).toHaveBeenCalledTimes(0);

    nativeEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    node.dispatchEvent(nativeEvent);
    expect(select).toHaveBeenCalledTimes(0);

    nativeEvent = new MouseEvent('mouseup', {bubbles: true, cancelable: true});
    node.dispatchEvent(nativeEvent);
    expect(select).toHaveBeenCalledTimes(1);
  });

  // Regression test for https://github.com/facebook/react/issues/11379
  it('should not wait for `mouseup` after receiving `dragend`', () => {
    const select = jest.fn();
    const onSelect = event => {
      expect(typeof event).toBe('object');
      expect(event.type).toBe('select');
      expect(event.target).toBe(node);
      select(event.currentTarget);
    };

    const node = ReactDOM.render(
      <input type="text" onSelect={onSelect} />,
      container,
    );
    node.focus();

    let nativeEvent = new MouseEvent('focus', {
      bubbles: true,
      cancelable: true,
    });
    node.dispatchEvent(nativeEvent);
    expect(select).toHaveBeenCalledTimes(0);

    nativeEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    node.dispatchEvent(nativeEvent);
    expect(select).toHaveBeenCalledTimes(0);

    nativeEvent = new MouseEvent('dragend', {bubbles: true, cancelable: true});
    node.dispatchEvent(nativeEvent);
    expect(select).toHaveBeenCalledTimes(1);
  });
});
