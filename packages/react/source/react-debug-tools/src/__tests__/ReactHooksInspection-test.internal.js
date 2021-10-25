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
let ReactDebugTools;

describe('ReactHooksInspection', () => {
  beforeEach(() => {
    jest.resetModules();
    let ReactFeatureFlags = require('shared/ReactFeatureFlags');
    // TODO: Switch this test to non-internal once the flag is on by default.
    ReactFeatureFlags.enableHooks = true;
    React = require('react');
    ReactDebugTools = require('react-debug-tools');
  });

  it('should inspect a simple useState hook', () => {
    function Foo(props) {
      let [state] = React.useState('hello world');
      return <div>{state}</div>;
    }
    let tree = ReactDebugTools.inspectHooks(Foo, {});
    expect(tree).toEqual([
      {
        name: 'State',
        value: 'hello world',
        subHooks: [],
      },
    ]);
  });

  it('should inspect a simple custom hook', () => {
    function useCustom(value) {
      let [state] = React.useState(value);
      return state;
    }
    function Foo(props) {
      let value = useCustom('hello world');
      return <div>{value}</div>;
    }
    let tree = ReactDebugTools.inspectHooks(Foo, {});
    expect(tree).toEqual([
      {
        name: 'Custom',
        value: undefined,
        subHooks: [
          {
            name: 'State',
            value: 'hello world',
            subHooks: [],
          },
        ],
      },
    ]);
  });

  it('should inspect a tree of multiple hooks', () => {
    function effect() {}
    function useCustom(value) {
      let [state] = React.useState(value);
      React.useEffect(effect);
      return state;
    }
    function Foo(props) {
      let value1 = useCustom('hello');
      let value2 = useCustom('world');
      return (
        <div>
          {value1} {value2}
        </div>
      );
    }
    let tree = ReactDebugTools.inspectHooks(Foo, {});
    expect(tree).toEqual([
      {
        name: 'Custom',
        value: undefined,
        subHooks: [
          {
            name: 'State',
            subHooks: [],
            value: 'hello',
          },
          {
            name: 'Effect',
            subHooks: [],
            value: effect,
          },
        ],
      },
      {
        name: 'Custom',
        value: undefined,
        subHooks: [
          {
            name: 'State',
            value: 'world',
            subHooks: [],
          },
          {
            name: 'Effect',
            value: effect,
            subHooks: [],
          },
        ],
      },
    ]);
  });

  it('should inspect a tree of multiple levels of hooks', () => {
    function effect() {}
    function useCustom(value) {
      let [state] = React.useReducer((s, a) => s, value);
      React.useEffect(effect);
      return state;
    }
    function useBar(value) {
      let result = useCustom(value);
      React.useLayoutEffect(effect);
      return result;
    }
    function useBaz(value) {
      React.useMutationEffect(effect);
      let result = useCustom(value);
      return result;
    }
    function Foo(props) {
      let value1 = useBar('hello');
      let value2 = useBaz('world');
      return (
        <div>
          {value1} {value2}
        </div>
      );
    }
    let tree = ReactDebugTools.inspectHooks(Foo, {});
    expect(tree).toEqual([
      {
        name: 'Bar',
        value: undefined,
        subHooks: [
          {
            name: 'Custom',
            value: undefined,
            subHooks: [
              {
                name: 'Reducer',
                value: 'hello',
                subHooks: [],
              },
              {
                name: 'Effect',
                value: effect,
                subHooks: [],
              },
            ],
          },
          {
            name: 'LayoutEffect',
            value: effect,
            subHooks: [],
          },
        ],
      },
      {
        name: 'Baz',
        value: undefined,
        subHooks: [
          {
            name: 'MutationEffect',
            value: effect,
            subHooks: [],
          },
          {
            name: 'Custom',
            subHooks: [
              {
                name: 'Reducer',
                subHooks: [],
                value: 'world',
              },
              {
                name: 'Effect',
                subHooks: [],
                value: effect,
              },
            ],
            value: undefined,
          },
        ],
      },
    ]);
  });

  it('should inspect the default value using the useContext hook', () => {
    let MyContext = React.createContext('default');
    function Foo(props) {
      let value = React.useContext(MyContext);
      return <div>{value}</div>;
    }
    let tree = ReactDebugTools.inspectHooks(Foo, {});
    expect(tree).toEqual([
      {
        name: 'Context',
        value: 'default',
        subHooks: [],
      },
    ]);
  });
});
