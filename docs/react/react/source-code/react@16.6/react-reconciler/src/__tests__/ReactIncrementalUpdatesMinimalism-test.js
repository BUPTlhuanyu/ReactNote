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
let ReactNoop;

describe('ReactIncrementalUpdatesMinimalism', () => {
  beforeEach(() => {
    jest.resetModules();
    React = require('react');
    ReactNoop = require('react-noop-renderer');
  });

  it('should render a simple component', () => {
    function Child() {
      return <div>Hello World</div>;
    }

    function Parent() {
      return <Child />;
    }

    ReactNoop.render(<Parent />);
    expect(ReactNoop.flushWithHostCounters()).toEqual({
      hostDiffCounter: 0,
      hostUpdateCounter: 0,
    });

    ReactNoop.render(<Parent />);
    expect(ReactNoop.flushWithHostCounters()).toEqual({
      hostDiffCounter: 1,
      hostUpdateCounter: 1,
    });
  });

  it('should not diff referentially equal host elements', () => {
    function Leaf(props) {
      return (
        <span>
          hello
          <b />
          {props.name}
        </span>
      );
    }

    const constEl = (
      <div>
        <Leaf name="world" />
      </div>
    );

    function Child() {
      return constEl;
    }

    function Parent() {
      return <Child />;
    }

    ReactNoop.render(<Parent />);
    expect(ReactNoop.flushWithHostCounters()).toEqual({
      hostDiffCounter: 0,
      hostUpdateCounter: 0,
    });

    ReactNoop.render(<Parent />);
    expect(ReactNoop.flushWithHostCounters()).toEqual({
      hostDiffCounter: 0,
      hostUpdateCounter: 0,
    });
  });

  it('should not diff parents of setState targets', () => {
    let childInst;

    function Leaf(props) {
      return (
        <span>
          hello
          <b />
          {props.name}
        </span>
      );
    }

    class Child extends React.Component {
      state = {name: 'Batman'};
      render() {
        childInst = this;
        return (
          <div>
            <Leaf name={this.state.name} />
          </div>
        );
      }
    }

    function Parent() {
      return (
        <section>
          <div>
            <Leaf name="world" />
            <Child />
            <hr />
            <Leaf name="world" />
          </div>
        </section>
      );
    }

    ReactNoop.render(<Parent />);
    expect(ReactNoop.flushWithHostCounters()).toEqual({
      hostDiffCounter: 0,
      hostUpdateCounter: 0,
    });

    childInst.setState({name: 'Robin'});
    expect(ReactNoop.flushWithHostCounters()).toEqual({
      // Child > div
      // Child > Leaf > span
      // Child > Leaf > span > b
      hostDiffCounter: 3,
      // Child > div
      // Child > Leaf > span
      // Child > Leaf > span > b
      // Child > Leaf > span > #text
      hostUpdateCounter: 4,
    });

    ReactNoop.render(<Parent />);
    expect(ReactNoop.flushWithHostCounters()).toEqual({
      // Parent > section
      // Parent > section > div
      // Parent > section > div > Leaf > span
      // Parent > section > div > Leaf > span > b
      // Parent > section > div > Child > div
      // Parent > section > div > Child > div > Leaf > span
      // Parent > section > div > Child > div > Leaf > span > b
      // Parent > section > div > hr
      // Parent > section > div > Leaf > span
      // Parent > section > div > Leaf > span > b
      hostDiffCounter: 10,
      hostUpdateCounter: 10,
    });
  });
});
