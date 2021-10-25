/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

let PropTypes;
let React;
let ReactDOM;
let ReactTestUtils;
let createReactClass;

describe('create-react-class-integration', () => {
  beforeEach(() => {
    jest.resetModules();
    PropTypes = require('prop-types');
    React = require('react');
    ReactDOM = require('react-dom');
    ReactTestUtils = require('react-dom/test-utils');
    createReactClass = require('create-react-class/factory')(
      React.Component,
      React.isValidElement,
      new React.Component().updater,
    );
  });

  it('should throw when `render` is not specified', () => {
    expect(function() {
      createReactClass({});
    }).toThrowError(
      'createClass(...): Class specification must implement a `render` method.',
    );
  });

  it('should copy prop types onto the Constructor', () => {
    const propValidator = jest.fn();
    const TestComponent = createReactClass({
      propTypes: {
        value: propValidator,
      },
      render: function() {
        return <div />;
      },
    });

    expect(TestComponent.propTypes).toBeDefined();
    expect(TestComponent.propTypes.value).toBe(propValidator);
  });

  it('should warn on invalid prop types', () => {
    expect(() =>
      createReactClass({
        displayName: 'Component',
        propTypes: {
          prop: null,
        },
        render: function() {
          return <span>{this.props.prop}</span>;
        },
      }),
    ).toWarnDev(
      'Warning: Component: prop type `prop` is invalid; ' +
        'it must be a function, usually from React.PropTypes.',
      {withoutStack: true},
    );
  });

  it('should warn on invalid context types', () => {
    expect(() =>
      createReactClass({
        displayName: 'Component',
        contextTypes: {
          prop: null,
        },
        render: function() {
          return <span>{this.props.prop}</span>;
        },
      }),
    ).toWarnDev(
      'Warning: Component: context type `prop` is invalid; ' +
        'it must be a function, usually from React.PropTypes.',
      {withoutStack: true},
    );
  });

  it('should throw on invalid child context types', () => {
    expect(() =>
      createReactClass({
        displayName: 'Component',
        childContextTypes: {
          prop: null,
        },
        render: function() {
          return <span>{this.props.prop}</span>;
        },
      }),
    ).toWarnDev(
      'Warning: Component: child context type `prop` is invalid; ' +
        'it must be a function, usually from React.PropTypes.',
      {withoutStack: true},
    );
  });

  it('should warn when misspelling shouldComponentUpdate', () => {
    expect(() =>
      createReactClass({
        componentShouldUpdate: function() {
          return false;
        },
        render: function() {
          return <div />;
        },
      }),
    ).toWarnDev(
      'Warning: A component has a method called componentShouldUpdate(). Did you ' +
        'mean shouldComponentUpdate()? The name is phrased as a question ' +
        'because the function is expected to return a value.',
      {withoutStack: true},
    );

    expect(() =>
      createReactClass({
        displayName: 'NamedComponent',
        componentShouldUpdate: function() {
          return false;
        },
        render: function() {
          return <div />;
        },
      }),
    ).toWarnDev(
      'Warning: NamedComponent has a method called componentShouldUpdate(). Did you ' +
        'mean shouldComponentUpdate()? The name is phrased as a question ' +
        'because the function is expected to return a value.',
      {withoutStack: true},
    );
  });

  it('should warn when misspelling componentWillReceiveProps', () => {
    expect(() =>
      createReactClass({
        componentWillRecieveProps: function() {
          return false;
        },
        render: function() {
          return <div />;
        },
      }),
    ).toWarnDev(
      'Warning: A component has a method called componentWillRecieveProps(). Did you ' +
        'mean componentWillReceiveProps()?',
      {withoutStack: true},
    );
  });

  it('should warn when misspelling UNSAFE_componentWillReceiveProps', () => {
    expect(() =>
      createReactClass({
        UNSAFE_componentWillRecieveProps: function() {
          return false;
        },
        render: function() {
          return <div />;
        },
      }),
    ).toWarnDev(
      'Warning: A component has a method called UNSAFE_componentWillRecieveProps(). ' +
        'Did you mean UNSAFE_componentWillReceiveProps()?',
      {withoutStack: true},
    );
  });

  it('should throw if a reserved property is in statics', () => {
    expect(function() {
      createReactClass({
        statics: {
          getDefaultProps: function() {
            return {
              foo: 0,
            };
          },
        },

        render: function() {
          return <span />;
        },
      });
    }).toThrowError(
      'ReactClass: You are attempting to define a reserved property, ' +
        '`getDefaultProps`, that shouldn\'t be on the "statics" key. Define ' +
        'it as an instance property instead; it will still be accessible on ' +
        'the constructor.',
    );
  });

  // TODO: Consider actually moving these to statics or drop this unit test.
  xit('should warn when using deprecated non-static spec keys', () => {
    expect(() =>
      createReactClass({
        mixins: [{}],
        propTypes: {
          foo: PropTypes.string,
        },
        contextTypes: {
          foo: PropTypes.string,
        },
        childContextTypes: {
          foo: PropTypes.string,
        },
        render: function() {
          return <div />;
        },
      }),
    ).toWarnDev([
      'createClass(...): `mixins` is now a static property and should ' +
        'be defined inside "statics".',
      'createClass(...): `propTypes` is now a static property and should ' +
        'be defined inside "statics".',
      'createClass(...): `contextTypes` is now a static property and ' +
        'should be defined inside "statics".',
      'createClass(...): `childContextTypes` is now a static property and ' +
        'should be defined inside "statics".',
    ]);
  });

  it('should support statics', () => {
    const Component = createReactClass({
      statics: {
        abc: 'def',
        def: 0,
        ghi: null,
        jkl: 'mno',
        pqr: function() {
          return this;
        },
      },

      render: function() {
        return <span />;
      },
    });
    let instance = <Component />;
    instance = ReactTestUtils.renderIntoDocument(instance);
    expect(instance.constructor.abc).toBe('def');
    expect(Component.abc).toBe('def');
    expect(instance.constructor.def).toBe(0);
    expect(Component.def).toBe(0);
    expect(instance.constructor.ghi).toBe(null);
    expect(Component.ghi).toBe(null);
    expect(instance.constructor.jkl).toBe('mno');
    expect(Component.jkl).toBe('mno');
    expect(instance.constructor.pqr()).toBe(Component);
    expect(Component.pqr()).toBe(Component);
  });

  it('should work with object getInitialState() return values', () => {
    const Component = createReactClass({
      getInitialState: function() {
        return {
          occupation: 'clown',
        };
      },
      render: function() {
        return <span />;
      },
    });
    let instance = <Component />;
    instance = ReactTestUtils.renderIntoDocument(instance);
    expect(instance.state.occupation).toEqual('clown');
  });

  it('should work with getDerivedStateFromProps() return values', () => {
    const Component = createReactClass({
      getInitialState() {
        return {};
      },
      render: function() {
        return <span />;
      },
    });
    Component.getDerivedStateFromProps = () => {
      return {occupation: 'clown'};
    };
    let instance = <Component />;
    instance = ReactTestUtils.renderIntoDocument(instance);
    expect(instance.state.occupation).toEqual('clown');
  });

  it('renders based on context getInitialState', () => {
    const Foo = createReactClass({
      contextTypes: {
        className: PropTypes.string,
      },
      getInitialState() {
        return {className: this.context.className};
      },
      render() {
        return <span className={this.state.className} />;
      },
    });

    const Outer = createReactClass({
      childContextTypes: {
        className: PropTypes.string,
      },
      getChildContext() {
        return {className: 'foo'};
      },
      render() {
        return <Foo />;
      },
    });

    const container = document.createElement('div');
    ReactDOM.render(<Outer />, container);
    expect(container.firstChild.className).toBe('foo');
  });

  it('should throw with non-object getInitialState() return values', () => {
    [['an array'], 'a string', 1234].forEach(function(state) {
      const Component = createReactClass({
        getInitialState: function() {
          return state;
        },
        render: function() {
          return <span />;
        },
      });
      let instance = <Component />;
      expect(function() {
        instance = ReactTestUtils.renderIntoDocument(instance);
      }).toThrowError(
        'Component.getInitialState(): must return an object or null',
      );
    });
  });

  it('should work with a null getInitialState() return value', () => {
    const Component = createReactClass({
      getInitialState: function() {
        return null;
      },
      render: function() {
        return <span />;
      },
    });
    expect(() =>
      ReactTestUtils.renderIntoDocument(<Component />),
    ).not.toThrow();
  });

  it('should throw when using legacy factories', () => {
    const Component = createReactClass({
      render() {
        return <div />;
      },
    });

    expect(() => expect(() => Component()).toThrow()).toWarnDev(
      'Warning: Something is calling a React component directly. Use a ' +
        'factory or JSX instead. See: https://fb.me/react-legacyfactory',
      {withoutStack: true},
    );
  });

  it('replaceState and callback works', () => {
    const ops = [];
    const Component = createReactClass({
      getInitialState() {
        return {step: 0};
      },
      render() {
        ops.push('Render: ' + this.state.step);
        return <div />;
      },
    });

    const instance = ReactTestUtils.renderIntoDocument(<Component />);
    instance.replaceState({step: 1}, () => {
      ops.push('Callback: ' + instance.state.step);
    });
    expect(ops).toEqual(['Render: 0', 'Render: 1', 'Callback: 1']);
  });

  it('getDerivedStateFromProps updates state when props change', () => {
    const Component = createReactClass({
      getInitialState() {
        return {
          count: 1,
        };
      },
      render() {
        return <div>count:{this.state.count}</div>;
      },
    });
    Component.getDerivedStateFromProps = (nextProps, prevState) => ({
      count: prevState.count + nextProps.incrementBy,
    });

    const container = document.createElement('div');
    const instance = ReactDOM.render(
      <div>
        <Component incrementBy={0} />
      </div>,
      container,
    );
    expect(instance.textContent).toEqual('count:1');
    ReactDOM.render(
      <div>
        <Component incrementBy={2} />
      </div>,
      container,
    );
    expect(instance.textContent).toEqual('count:3');
  });

  it('should support the new static getDerivedStateFromProps method', () => {
    let instance;
    const Component = createReactClass({
      statics: {
        getDerivedStateFromProps: function() {
          return {foo: 'bar'};
        },
      },

      getInitialState() {
        return {};
      },

      render: function() {
        instance = this;
        return null;
      },
    });
    ReactDOM.render(<Component />, document.createElement('div'));
    expect(instance.state.foo).toBe('bar');
  });

  it('warns if getDerivedStateFromProps is not static', () => {
    const Foo = createReactClass({
      getDerivedStateFromProps() {
        return {};
      },
      render() {
        return <div />;
      },
    });
    expect(() =>
      ReactDOM.render(<Foo foo="foo" />, document.createElement('div')),
    ).toWarnDev(
      'Component: getDerivedStateFromProps() is defined as an instance method ' +
        'and will be ignored. Instead, declare it as a static method.',
      {withoutStack: true},
    );
  });

  it('warns if getDerivedStateFromError is not static', () => {
    const Foo = createReactClass({
      getDerivedStateFromError() {
        return {};
      },
      render() {
        return <div />;
      },
    });
    expect(() =>
      ReactDOM.render(<Foo foo="foo" />, document.createElement('div')),
    ).toWarnDev(
      'Component: getDerivedStateFromError() is defined as an instance method ' +
        'and will be ignored. Instead, declare it as a static method.',
      {withoutStack: true},
    );
  });

  it('warns if getSnapshotBeforeUpdate is static', () => {
    const Foo = createReactClass({
      statics: {
        getSnapshotBeforeUpdate: function() {
          return null;
        },
      },
      render() {
        return <div />;
      },
    });
    expect(() =>
      ReactDOM.render(<Foo foo="foo" />, document.createElement('div')),
    ).toWarnDev(
      'Component: getSnapshotBeforeUpdate() is defined as a static method ' +
        'and will be ignored. Instead, declare it as an instance method.',
      {withoutStack: true},
    );
  });

  it('should warn if state is not properly initialized before getDerivedStateFromProps', () => {
    const Component = createReactClass({
      statics: {
        getDerivedStateFromProps: function() {
          return null;
        },
      },
      render: function() {
        return null;
      },
    });
    expect(() =>
      ReactDOM.render(<Component />, document.createElement('div')),
    ).toWarnDev(
      '`Component` uses `getDerivedStateFromProps` but its initial state is ' +
        'null. This is not recommended. Instead, define the initial state by ' +
        'assigning an object to `this.state` in the constructor of `Component`. ' +
        'This ensures that `getDerivedStateFromProps` arguments have a consistent shape.',
      {
        withoutStack: true,
      },
    );
  });

  it('should not invoke deprecated lifecycles (cWM/cWRP/cWU) if new static gDSFP is present', () => {
    const Component = createReactClass({
      statics: {
        getDerivedStateFromProps: function() {
          return null;
        },
      },
      componentWillMount: function() {
        throw Error('unexpected');
      },
      componentWillReceiveProps: function() {
        throw Error('unexpected');
      },
      componentWillUpdate: function() {
        throw Error('unexpected');
      },
      getInitialState: function() {
        return {};
      },
      render: function() {
        return null;
      },
    });

    expect(() => {
      ReactDOM.render(<Component />, document.createElement('div'));
    }).toWarnDev(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
        'Component uses getDerivedStateFromProps() but also contains the following legacy lifecycles:\n' +
        '  componentWillMount\n' +
        '  componentWillReceiveProps\n' +
        '  componentWillUpdate\n\n' +
        'The above lifecycles should be removed. Learn more about this warning here:\n' +
        'https://fb.me/react-async-component-lifecycle-hooks',
      {withoutStack: true},
    );
    ReactDOM.render(<Component foo={1} />, document.createElement('div'));
  });

  it('should not invoke deprecated lifecycles (cWM/cWRP/cWU) if new getSnapshotBeforeUpdate is present', () => {
    const Component = createReactClass({
      getSnapshotBeforeUpdate: function() {
        return null;
      },
      componentWillMount: function() {
        throw Error('unexpected');
      },
      componentWillReceiveProps: function() {
        throw Error('unexpected');
      },
      componentWillUpdate: function() {
        throw Error('unexpected');
      },
      componentDidUpdate: function() {},
      render: function() {
        return null;
      },
    });

    expect(() => {
      ReactDOM.render(<Component />, document.createElement('div'));
    }).toWarnDev(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
        'Component uses getSnapshotBeforeUpdate() but also contains the following legacy lifecycles:\n' +
        '  componentWillMount\n' +
        '  componentWillReceiveProps\n' +
        '  componentWillUpdate\n\n' +
        'The above lifecycles should be removed. Learn more about this warning here:\n' +
        'https://fb.me/react-async-component-lifecycle-hooks',
      {withoutStack: true},
    );
    ReactDOM.render(<Component foo={1} />, document.createElement('div'));
  });

  it('should invoke both deprecated and new lifecycles if both are present', () => {
    const log = [];

    const Component = createReactClass({
      mixins: [
        {
          componentWillMount: function() {
            log.push('componentWillMount');
          },
          componentWillReceiveProps: function() {
            log.push('componentWillReceiveProps');
          },
          componentWillUpdate: function() {
            log.push('componentWillUpdate');
          },
        },
      ],
      UNSAFE_componentWillMount: function() {
        log.push('UNSAFE_componentWillMount');
      },
      UNSAFE_componentWillReceiveProps: function() {
        log.push('UNSAFE_componentWillReceiveProps');
      },
      UNSAFE_componentWillUpdate: function() {
        log.push('UNSAFE_componentWillUpdate');
      },
      render: function() {
        return null;
      },
    });

    const div = document.createElement('div');
    ReactDOM.render(<Component foo="bar" />, div);
    expect(log).toEqual(['componentWillMount', 'UNSAFE_componentWillMount']);

    log.length = 0;

    ReactDOM.render(<Component foo="baz" />, div);
    expect(log).toEqual([
      'componentWillReceiveProps',
      'UNSAFE_componentWillReceiveProps',
      'componentWillUpdate',
      'UNSAFE_componentWillUpdate',
    ]);
  });
});
