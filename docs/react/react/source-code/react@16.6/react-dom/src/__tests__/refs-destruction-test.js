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
let ReactTestUtils;

let TestComponent;

describe('refs-destruction', () => {
  beforeEach(() => {
    jest.resetModules();

    React = require('react');
    ReactDOM = require('react-dom');
    ReactTestUtils = require('react-dom/test-utils');

    class ClassComponent extends React.Component {
      render() {
        return null;
      }
    }

    TestComponent = class extends React.Component {
      render() {
        if (this.props.destroy) {
          return <div />;
        } else if (this.props.removeRef) {
          return (
            <div>
              <div />
              <ClassComponent />
            </div>
          );
        } else {
          return (
            <div>
              <div ref="theInnerDiv" />
              <ClassComponent ref="theInnerClassComponent" />
            </div>
          );
        }
      }
    };
  });

  it('should remove refs when destroying the parent', () => {
    const container = document.createElement('div');
    const testInstance = ReactDOM.render(<TestComponent />, container);
    expect(ReactTestUtils.isDOMComponent(testInstance.refs.theInnerDiv)).toBe(
      true,
    );
    expect(
      Object.keys(testInstance.refs || {}).filter(key => testInstance.refs[key])
        .length,
    ).toEqual(2);
    ReactDOM.unmountComponentAtNode(container);
    expect(
      Object.keys(testInstance.refs || {}).filter(key => testInstance.refs[key])
        .length,
    ).toEqual(0);
  });

  it('should remove refs when destroying the child', () => {
    const container = document.createElement('div');
    const testInstance = ReactDOM.render(<TestComponent />, container);
    expect(ReactTestUtils.isDOMComponent(testInstance.refs.theInnerDiv)).toBe(
      true,
    );
    expect(
      Object.keys(testInstance.refs || {}).filter(key => testInstance.refs[key])
        .length,
    ).toEqual(2);
    ReactDOM.render(<TestComponent destroy={true} />, container);
    expect(
      Object.keys(testInstance.refs || {}).filter(key => testInstance.refs[key])
        .length,
    ).toEqual(0);
  });

  it('should remove refs when removing the child ref attribute', () => {
    const container = document.createElement('div');
    const testInstance = ReactDOM.render(<TestComponent />, container);
    expect(ReactTestUtils.isDOMComponent(testInstance.refs.theInnerDiv)).toBe(
      true,
    );
    expect(
      Object.keys(testInstance.refs || {}).filter(key => testInstance.refs[key])
        .length,
    ).toEqual(2);
    ReactDOM.render(<TestComponent removeRef={true} />, container);
    expect(
      Object.keys(testInstance.refs || {}).filter(key => testInstance.refs[key])
        .length,
    ).toEqual(0);
  });

  it('should not error when destroying child with ref asynchronously', () => {
    class Modal extends React.Component {
      componentDidMount() {
        this.div = document.createElement('div');
        document.body.appendChild(this.div);
        this.componentDidUpdate();
      }

      componentDidUpdate() {
        ReactDOM.render(<div>{this.props.children}</div>, this.div);
      }

      componentWillUnmount() {
        const self = this;
        // some async animation
        setTimeout(function() {
          expect(function() {
            ReactDOM.unmountComponentAtNode(self.div);
          }).not.toThrow();
          document.body.removeChild(self.div);
        }, 0);
      }

      render() {
        return null;
      }
    }

    class AppModal extends React.Component {
      render() {
        return (
          <Modal>
            <a ref="ref" />
          </Modal>
        );
      }
    }

    class App extends React.Component {
      render() {
        return this.props.hidden ? null : <AppModal onClose={this.close} />;
      }
    }

    const container = document.createElement('div');
    ReactDOM.render(<App />, container);
    ReactDOM.render(<App hidden={true} />, container);
    jest.runAllTimers();
  });
});
