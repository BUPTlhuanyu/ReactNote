/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 * @jest-environment node
 */

'use strict';

let React;
let ReactFeatureFlags;
let ReactNoop;

describe('ReactIncrementalReflection', () => {
  beforeEach(() => {
    jest.resetModules();
    ReactFeatureFlags = require('shared/ReactFeatureFlags');
    ReactFeatureFlags.debugRenderPhaseSideEffectsForStrictMode = false;
    React = require('react');
    ReactNoop = require('react-noop-renderer');
  });

  it('handles isMounted even when the initial render is deferred', () => {
    let ops = [];

    const instances = [];

    class Component extends React.Component {
      _isMounted() {
        // No longer a public API, but we can test that it works internally by
        // reaching into the updater.
        return this.updater.isMounted(this);
      }
      UNSAFE_componentWillMount() {
        instances.push(this);
        ops.push('componentWillMount', this._isMounted());
      }
      componentDidMount() {
        ops.push('componentDidMount', this._isMounted());
      }
      render() {
        return <span />;
      }
    }

    function Foo() {
      return <Component />;
    }

    ReactNoop.render(<Foo />);

    // Render part way through but don't yet commit the updates.
    ReactNoop.flushDeferredPri(20);

    expect(ops).toEqual(['componentWillMount', false]);

    expect(instances[0]._isMounted()).toBe(false);

    ops = [];

    // Render the rest and commit the updates.
    expect(ReactNoop.flush).toWarnDev(
      'componentWillMount: Please update the following components ' +
        'to use componentDidMount instead: Component',
      {withoutStack: true},
    );

    expect(ops).toEqual(['componentDidMount', true]);

    expect(instances[0]._isMounted()).toBe(true);
  });

  it('handles isMounted when an unmount is deferred', () => {
    let ops = [];

    const instances = [];

    class Component extends React.Component {
      _isMounted() {
        return this.updater.isMounted(this);
      }
      UNSAFE_componentWillMount() {
        instances.push(this);
      }
      componentWillUnmount() {
        ops.push('componentWillUnmount', this._isMounted());
      }
      render() {
        ops.push('Component');
        return <span />;
      }
    }

    function Other() {
      ops.push('Other');
      return <span />;
    }

    function Foo(props) {
      return props.mount ? <Component /> : <Other />;
    }

    ReactNoop.render(<Foo mount={true} />);
    expect(ReactNoop.flush).toWarnDev(
      'componentWillMount: Please update the following components ' +
        'to use componentDidMount instead: Component',
      {withoutStack: true},
    );

    expect(ops).toEqual(['Component']);
    ops = [];

    expect(instances[0]._isMounted()).toBe(true);

    ReactNoop.render(<Foo mount={false} />);
    // Render part way through but don't yet commit the updates so it is not
    // fully unmounted yet.
    ReactNoop.flushDeferredPri(20);

    expect(ops).toEqual(['Other']);
    ops = [];

    expect(instances[0]._isMounted()).toBe(true);

    // Finish flushing the unmount.
    ReactNoop.flush();

    expect(ops).toEqual(['componentWillUnmount', true]);

    expect(instances[0]._isMounted()).toBe(false);
  });

  it('finds no node before insertion and correct node before deletion', () => {
    let ops = [];

    let classInstance = null;

    function findInstance(inst) {
      // We ignore warnings fired by findInstance because we are testing
      // that the actual behavior still works as expected even though it
      // is deprecated.
      let oldConsoleError = console.error;
      console.error = jest.fn();
      try {
        return ReactNoop.findInstance(inst);
      } finally {
        console.error = oldConsoleError;
      }
    }

    class Component extends React.Component {
      UNSAFE_componentWillMount() {
        classInstance = this;
        ops.push('componentWillMount', findInstance(this));
      }
      componentDidMount() {
        ops.push('componentDidMount', findInstance(this));
      }
      UNSAFE_componentWillUpdate() {
        ops.push('componentWillUpdate', findInstance(this));
      }
      componentDidUpdate() {
        ops.push('componentDidUpdate', findInstance(this));
      }
      componentWillUnmount() {
        ops.push('componentWillUnmount', findInstance(this));
      }
      render() {
        ops.push('render');
        return this.props.step < 2 ? (
          <span ref={ref => (this.span = ref)} />
        ) : this.props.step === 2 ? (
          <div ref={ref => (this.div = ref)} />
        ) : this.props.step === 3 ? null : this.props.step === 4 ? (
          <div ref={ref => (this.span = ref)} />
        ) : null;
      }
    }

    function Sibling() {
      // Sibling is used to assert that we've rendered past the first component.
      ops.push('render sibling');
      return <span />;
    }

    function Foo(props) {
      return [<Component key="a" step={props.step} />, <Sibling key="b" />];
    }

    ReactNoop.render(<Foo step={0} />);
    // Flush past Component but don't complete rendering everything yet.
    ReactNoop.flushDeferredPri(30);

    expect(ops).toEqual([
      'componentWillMount',
      null,
      'render',
      'render sibling',
    ]);

    ops = [];

    expect(classInstance).toBeDefined();
    // The instance has been complete but is still not committed so it should
    // not find any host nodes in it.
    expect(findInstance(classInstance)).toBe(null);

    expect(ReactNoop.flush).toWarnDev(
      'componentWillMount: Please update the following components ' +
        'to use componentDidMount instead: Component' +
        '\n\ncomponentWillUpdate: Please update the following components ' +
        'to use componentDidUpdate instead: Component',
      {withoutStack: true},
    );

    const hostSpan = classInstance.span;
    expect(hostSpan).toBeDefined();

    expect(findInstance(classInstance)).toBe(hostSpan);

    expect(ops).toEqual(['componentDidMount', hostSpan]);

    ops = [];

    // Flush next step which will cause an update but not yet render a new host
    // node.
    ReactNoop.render(<Foo step={1} />);
    ReactNoop.flush();

    expect(ops).toEqual([
      'componentWillUpdate',
      hostSpan,
      'render',
      'render sibling',
      'componentDidUpdate',
      hostSpan,
    ]);

    expect(ReactNoop.findInstance(classInstance)).toBe(hostSpan);

    ops = [];

    // The next step will render a new host node but won't get committed yet.
    // We expect this to mutate the original Fiber.
    ReactNoop.render(<Foo step={2} />);
    ReactNoop.flushDeferredPri(30);

    expect(ops).toEqual([
      'componentWillUpdate',
      hostSpan,
      'render',
      'render sibling',
    ]);

    ops = [];

    // This should still be the host span.
    expect(ReactNoop.findInstance(classInstance)).toBe(hostSpan);

    // When we finally flush the tree it will get committed.
    ReactNoop.flush();

    const hostDiv = classInstance.div;

    expect(hostDiv).toBeDefined();
    expect(hostSpan).not.toBe(hostDiv);

    expect(ops).toEqual(['componentDidUpdate', hostDiv]);

    ops = [];

    // We should now find the new host node.
    expect(ReactNoop.findInstance(classInstance)).toBe(hostDiv);

    // Render to null but don't commit it yet.
    ReactNoop.render(<Foo step={3} />);
    ReactNoop.flushDeferredPri(25);

    expect(ops).toEqual([
      'componentWillUpdate',
      hostDiv,
      'render',
      'render sibling',
    ]);

    ops = [];

    // This should still be the host div since the deletion is not committed.
    expect(ReactNoop.findInstance(classInstance)).toBe(hostDiv);

    ReactNoop.flush();

    expect(ops).toEqual(['componentDidUpdate', null]);

    // This should still be the host div since the deletion is not committed.
    expect(ReactNoop.findInstance(classInstance)).toBe(null);

    // Render a div again
    ReactNoop.render(<Foo step={4} />);
    ReactNoop.flush();

    ops = [];

    // Unmount the component.
    ReactNoop.render([]);
    ReactNoop.flush();
    expect(ops).toEqual(['componentWillUnmount', hostDiv]);
  });
});
