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
let PropTypes;

describe('ReactIncremental', () => {
  beforeEach(() => {
    jest.resetModules();
    ReactFeatureFlags = require('shared/ReactFeatureFlags');
    ReactFeatureFlags.debugRenderPhaseSideEffectsForStrictMode = false;
    React = require('react');
    ReactNoop = require('react-noop-renderer');
    PropTypes = require('prop-types');
  });

  it('should render a simple component', () => {
    function Bar() {
      return <div>Hello World</div>;
    }

    function Foo() {
      return <Bar isBar={true} />;
    }

    ReactNoop.render(<Foo />);
    ReactNoop.flush();
  });

  it('should render a simple component, in steps if needed', () => {
    let renderCallbackCalled = false;
    let barCalled = false;
    function Bar() {
      barCalled = true;
      return (
        <span>
          <div>Hello World</div>
        </span>
      );
    }

    let fooCalled = false;
    function Foo() {
      fooCalled = true;
      return [<Bar key="a" isBar={true} />, <Bar key="b" isBar={true} />];
    }

    ReactNoop.render(<Foo />, () => (renderCallbackCalled = true));
    expect(fooCalled).toBe(false);
    expect(barCalled).toBe(false);
    expect(renderCallbackCalled).toBe(false);
    // Do one step of work.
    ReactNoop.flushDeferredPri(7 + 5);
    expect(fooCalled).toBe(true);
    expect(barCalled).toBe(false);
    expect(renderCallbackCalled).toBe(false);
    // Do the rest of the work.
    ReactNoop.flushDeferredPri(50);
    expect(fooCalled).toBe(true);
    expect(barCalled).toBe(true);
    expect(renderCallbackCalled).toBe(true);
  });

  it('updates a previous render', () => {
    let ops = [];

    function Header() {
      ops.push('Header');
      return <h1>Hi</h1>;
    }

    function Content(props) {
      ops.push('Content');
      return <div>{props.children}</div>;
    }

    function Footer() {
      ops.push('Footer');
      return <footer>Bye</footer>;
    }

    const header = <Header />;
    const footer = <Footer />;

    function Foo(props) {
      ops.push('Foo');
      return (
        <div>
          {header}
          <Content>{props.text}</Content>
          {footer}
        </div>
      );
    }

    ReactNoop.render(<Foo text="foo" />, () =>
      ops.push('renderCallbackCalled'),
    );
    ReactNoop.flush();

    expect(ops).toEqual([
      'Foo',
      'Header',
      'Content',
      'Footer',
      'renderCallbackCalled',
    ]);

    ops = [];

    ReactNoop.render(<Foo text="bar" />, () =>
      ops.push('firstRenderCallbackCalled'),
    );
    ReactNoop.render(<Foo text="bar" />, () =>
      ops.push('secondRenderCallbackCalled'),
    );
    ReactNoop.flush();

    // TODO: Test bail out of host components. This is currently unobservable.

    // Since this is an update, it should bail out and reuse the work from
    // Header and Content.
    expect(ops).toEqual([
      'Foo',
      'Content',
      'firstRenderCallbackCalled',
      'secondRenderCallbackCalled',
    ]);
  });

  it('can cancel partially rendered work and restart', () => {
    let ops = [];

    function Bar(props) {
      ops.push('Bar');
      return <div>{props.children}</div>;
    }

    function Foo(props) {
      ops.push('Foo');
      return (
        <div>
          <Bar>{props.text}</Bar>
          <Bar>{props.text}</Bar>
        </div>
      );
    }

    // Init
    ReactNoop.render(<Foo text="foo" />);
    ReactNoop.flush();

    ops = [];

    ReactNoop.render(<Foo text="bar" />);
    // Flush part of the work
    ReactNoop.flushDeferredPri(20 + 5);

    expect(ops).toEqual(['Foo', 'Bar']);

    ops = [];

    // This will abort the previous work and restart
    ReactNoop.flushSync(() => ReactNoop.render(null));
    ReactNoop.render(<Foo text="baz" />);
    ReactNoop.clearYields();

    // Flush part of the new work
    ReactNoop.flushDeferredPri(20 + 5);

    expect(ops).toEqual(['Foo', 'Bar']);

    // Flush the rest of the work which now includes the low priority
    ReactNoop.flush(20);

    expect(ops).toEqual(['Foo', 'Bar', 'Bar']);
  });

  it('should call callbacks even if updates are aborted', () => {
    const ops = [];
    let inst;

    class Foo extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          text: 'foo',
          text2: 'foo',
        };
        inst = this;
      }
      render() {
        return (
          <div>
            <div>{this.state.text}</div>
            <div>{this.state.text2}</div>
          </div>
        );
      }
    }

    ReactNoop.render(<Foo />);
    ReactNoop.flush();

    inst.setState(
      () => {
        ops.push('setState1');
        return {text: 'bar'};
      },
      () => ops.push('callback1'),
    );

    // Flush part of the work
    ReactNoop.flushDeferredPri(20 + 5);

    expect(ops).toEqual(['setState1']);

    // This will abort the previous work and restart
    ReactNoop.flushSync(() => ReactNoop.render(<Foo />));
    inst.setState(
      () => {
        ops.push('setState2');
        return {text2: 'baz'};
      },
      () => ops.push('callback2'),
    );

    // Flush the rest of the work which now includes the low priority
    ReactNoop.flush();

    expect(ops).toEqual([
      'setState1',
      'setState1',
      'setState2',
      'callback1',
      'callback2',
    ]);
    expect(inst.state).toEqual({text: 'bar', text2: 'baz'});
  });

  it('can deprioritize unfinished work and resume it later', () => {
    let ops = [];

    function Bar(props) {
      ops.push('Bar');
      return <div>{props.children}</div>;
    }

    function Middle(props) {
      ops.push('Middle');
      return <span>{props.children}</span>;
    }

    function Foo(props) {
      ops.push('Foo');
      return (
        <div>
          <Bar>{props.text}</Bar>
          <section hidden={true}>
            <Middle>{props.text}</Middle>
          </section>
          <Bar>{props.text}</Bar>
          <footer hidden={true}>
            <Middle>Footer</Middle>
          </footer>
        </div>
      );
    }

    // Init
    ReactNoop.render(<Foo text="foo" />);
    ReactNoop.flush();

    expect(ops).toEqual(['Foo', 'Bar', 'Bar', 'Middle', 'Middle']);

    ops = [];

    // Render part of the work. This should be enough to flush everything except
    // the middle which has lower priority.
    ReactNoop.render(<Foo text="bar" />);
    ReactNoop.flushDeferredPri(40);

    expect(ops).toEqual(['Foo', 'Bar', 'Bar']);

    ops = [];

    // Flush only the remaining work
    ReactNoop.flush();

    expect(ops).toEqual(['Middle', 'Middle']);
  });

  it('can deprioritize a tree from without dropping work', () => {
    let ops = [];

    function Bar(props) {
      ops.push('Bar');
      return <div>{props.children}</div>;
    }

    function Middle(props) {
      ops.push('Middle');
      return <span>{props.children}</span>;
    }

    function Foo(props) {
      ops.push('Foo');
      return (
        <div>
          <Bar>{props.text}</Bar>
          <section hidden={true}>
            <Middle>{props.text}</Middle>
          </section>
          <Bar>{props.text}</Bar>
          <footer hidden={true}>
            <Middle>Footer</Middle>
          </footer>
        </div>
      );
    }

    // Init
    ReactNoop.flushSync(() => {
      ReactNoop.render(<Foo text="foo" />);
    });
    ReactNoop.flush();
    expect(ops).toEqual(['Foo', 'Bar', 'Bar', 'Middle', 'Middle']);

    ops = [];

    // Render the high priority work (everying except the hidden trees).
    ReactNoop.flushSync(() => {
      ReactNoop.render(<Foo text="foo" />);
    });
    expect(ops).toEqual(['Foo', 'Bar', 'Bar']);

    ops = [];

    // The hidden content was deprioritized from high to low priority. A low
    // priority callback should have been scheduled. Flush it now.
    ReactNoop.flush();
    expect(ops).toEqual(['Middle', 'Middle']);
  });

  xit('can resume work in a subtree even when a parent bails out', () => {
    let ops = [];

    function Bar(props) {
      ops.push('Bar');
      return <div>{props.children}</div>;
    }

    function Tester() {
      // This component is just here to ensure that the bail out is
      // in fact in effect in the expected place for this test.
      ops.push('Tester');
      return <div />;
    }

    function Middle(props) {
      ops.push('Middle');
      return <span>{props.children}</span>;
    }

    const middleContent = (
      <aaa>
        <Tester />
        <bbb hidden={true}>
          <ccc>
            <Middle>Hi</Middle>
          </ccc>
        </bbb>
      </aaa>
    );

    function Foo(props) {
      ops.push('Foo');
      return (
        <div>
          <Bar>{props.text}</Bar>
          {middleContent}
          <Bar>{props.text}</Bar>
        </div>
      );
    }

    // Init
    ReactNoop.render(<Foo text="foo" />);
    ReactNoop.flushDeferredPri(52);

    expect(ops).toEqual(['Foo', 'Bar', 'Tester', 'Bar']);

    ops = [];

    // We're now rendering an update that will bail out on updating middle.
    ReactNoop.render(<Foo text="bar" />);
    ReactNoop.flushDeferredPri(45 + 5);

    expect(ops).toEqual(['Foo', 'Bar', 'Bar']);

    ops = [];

    // Flush the rest to make sure that the bailout didn't blog this work.
    ReactNoop.flush();
    expect(ops).toEqual(['Middle']);
  });

  xit('can resume work in a bailed subtree within one pass', () => {
    let ops = [];

    function Bar(props) {
      ops.push('Bar');
      return <div>{props.children}</div>;
    }

    class Tester extends React.Component {
      shouldComponentUpdate() {
        return false;
      }
      render() {
        // This component is just here to ensure that the bail out is
        // in fact in effect in the expected place for this test.
        ops.push('Tester');
        return <div />;
      }
    }

    function Middle(props) {
      ops.push('Middle');
      return <span>{props.children}</span>;
    }

    // Should content not just bail out on current, not workInProgress?

    class Content extends React.Component {
      shouldComponentUpdate() {
        return false;
      }
      render() {
        return [
          <Tester key="a" unused={this.props.unused} />,
          <bbb key="b" hidden={true}>
            <ccc>
              <Middle>Hi</Middle>
            </ccc>
          </bbb>,
        ];
      }
    }

    function Foo(props) {
      ops.push('Foo');
      return (
        <div hidden={props.text === 'bar'}>
          <Bar>{props.text}</Bar>
          <Content unused={props.text} />
          <Bar>{props.text}</Bar>
        </div>
      );
    }

    // Init
    ReactNoop.render(<Foo text="foo" />);
    ReactNoop.flushDeferredPri(52 + 5);

    expect(ops).toEqual(['Foo', 'Bar', 'Tester', 'Bar']);

    ops = [];

    // Make a quick update which will create a low pri tree on top of the
    // already low pri tree.
    ReactNoop.render(<Foo text="bar" />);
    ReactNoop.flushDeferredPri(15);

    expect(ops).toEqual(['Foo']);

    ops = [];

    // At this point, middle will bail out but it has not yet fully rendered.
    // Since that is the same priority as its parent tree. This should render
    // as a single batch. Therefore, it is correct that Middle should be in the
    // middle. If it occurs after the two "Bar" components then it was flushed
    // after them which is not correct.
    ReactNoop.flush();
    expect(ops).toEqual(['Bar', 'Middle', 'Bar']);

    ops = [];

    // Let us try this again without fully finishing the first time. This will
    // create a hanging subtree that is reconciling at the normal priority.
    ReactNoop.render(<Foo text="foo" />);
    ReactNoop.flushDeferredPri(40);

    expect(ops).toEqual(['Foo', 'Bar']);

    ops = [];

    // This update will create a tree that aborts that work and down-prioritizes
    // it. If the priority levels aren't down-prioritized correctly this may
    // abort rendering of the down-prioritized content.
    ReactNoop.render(<Foo text="bar" />);
    ReactNoop.flush();
    expect(ops).toEqual(['Foo', 'Bar', 'Bar']);
  });

  xit('can resume mounting a class component', () => {
    let ops = [];
    let foo;
    class Parent extends React.Component {
      shouldComponentUpdate() {
        return false;
      }
      render() {
        return <Foo prop={this.props.prop} />;
      }
    }

    class Foo extends React.Component {
      constructor(props) {
        super(props);
        // Test based on a www bug where props was null on resume
        ops.push('Foo constructor: ' + props.prop);
      }
      render() {
        foo = this;
        ops.push('Foo');
        return <Bar />;
      }
    }

    function Bar() {
      ops.push('Bar');
      return <div />;
    }

    ReactNoop.render(<Parent prop="foo" />);
    ReactNoop.flushDeferredPri(20);
    expect(ops).toEqual(['Foo constructor: foo', 'Foo']);

    foo.setState({value: 'bar'});

    ops = [];
    ReactNoop.flush();
    expect(ops).toEqual(['Foo', 'Bar']);
  });

  xit('reuses the same instance when resuming a class instance', () => {
    let ops = [];
    let foo;
    class Parent extends React.Component {
      shouldComponentUpdate() {
        return false;
      }
      render() {
        return <Foo prop={this.props.prop} />;
      }
    }

    let constructorCount = 0;
    class Foo extends React.Component {
      constructor(props) {
        super(props);
        // Test based on a www bug where props was null on resume
        ops.push('constructor: ' + props.prop);
        constructorCount++;
      }
      UNSAFE_componentWillMount() {
        ops.push('componentWillMount: ' + this.props.prop);
      }
      UNSAFE_componentWillReceiveProps() {
        ops.push('componentWillReceiveProps: ' + this.props.prop);
      }
      componentDidMount() {
        ops.push('componentDidMount: ' + this.props.prop);
      }
      UNSAFE_componentWillUpdate() {
        ops.push('componentWillUpdate: ' + this.props.prop);
      }
      componentDidUpdate() {
        ops.push('componentDidUpdate: ' + this.props.prop);
      }
      render() {
        foo = this;
        ops.push('render: ' + this.props.prop);
        return <Bar />;
      }
    }

    function Bar() {
      ops.push('Foo did complete');
      return <div />;
    }

    ReactNoop.render(<Parent prop="foo" />);
    ReactNoop.flushDeferredPri(25);
    expect(ops).toEqual([
      'constructor: foo',
      'componentWillMount: foo',
      'render: foo',
      'Foo did complete',
    ]);

    foo.setState({value: 'bar'});

    ops = [];
    ReactNoop.flush();
    expect(constructorCount).toEqual(1);
    expect(ops).toEqual([
      'componentWillMount: foo',
      'render: foo',
      'Foo did complete',
      'componentDidMount: foo',
    ]);
  });

  xit('can reuse work done after being preempted', () => {
    let ops = [];

    function Bar(props) {
      ops.push('Bar');
      return <div>{props.children}</div>;
    }

    function Middle(props) {
      ops.push('Middle');
      return <span>{props.children}</span>;
    }

    const middleContent = (
      <div>
        <Middle>Hello</Middle>
        <Bar>-</Bar>
        <Middle>World</Middle>
      </div>
    );

    const step0 = (
      <div>
        <Middle>Hi</Middle>
        <Bar>{'Foo'}</Bar>
        <Middle>There</Middle>
      </div>
    );

    function Foo(props) {
      ops.push('Foo');
      return (
        <div>
          <Bar>{props.text2}</Bar>
          <div hidden={true}>{props.step === 0 ? step0 : middleContent}</div>
        </div>
      );
    }

    // Init
    ReactNoop.render(<Foo text="foo" text2="foo" step={0} />);
    ReactNoop.flushDeferredPri(55 + 25 + 5 + 5);

    // We only finish the higher priority work. So the low pri content
    // has not yet finished mounting.
    expect(ops).toEqual(['Foo', 'Bar', 'Middle', 'Bar']);

    ops = [];

    // Interrupt the rendering with a quick update. This should not touch the
    // middle content.
    ReactNoop.render(<Foo text="foo" text2="bar" step={0} />);
    ReactNoop.flush();

    // We've now rendered the entire tree but we didn't have to redo the work
    // done by the first Middle and Bar already.
    expect(ops).toEqual(['Foo', 'Bar', 'Middle']);

    ops = [];

    // Make a quick update which will schedule low priority work to
    // update the middle content.
    ReactNoop.render(<Foo text="bar" text2="bar" step={1} />);
    ReactNoop.flushDeferredPri(30 + 25 + 5);

    expect(ops).toEqual(['Foo', 'Bar']);

    ops = [];

    // The middle content is now pending rendering...
    ReactNoop.flushDeferredPri(30 + 5);
    expect(ops).toEqual(['Middle', 'Bar']);

    ops = [];

    // but we'll interrupt it to render some higher priority work.
    // The middle content will bailout so it remains untouched.
    ReactNoop.render(<Foo text="foo" text2="bar" step={1} />);
    ReactNoop.flushDeferredPri(30);

    expect(ops).toEqual(['Foo', 'Bar']);

    ops = [];

    // Since we did nothing to the middle subtree during the interruption,
    // we should be able to reuse the reconciliation work that we already did
    // without restarting.
    ReactNoop.flush();
    expect(ops).toEqual(['Middle']);
  });

  xit('can reuse work that began but did not complete, after being preempted', () => {
    let ops = [];
    let child;
    let sibling;

    function GreatGrandchild() {
      ops.push('GreatGrandchild');
      return <div />;
    }

    function Grandchild() {
      ops.push('Grandchild');
      return <GreatGrandchild />;
    }

    class Child extends React.Component {
      state = {step: 0};
      render() {
        child = this;
        ops.push('Child');
        return <Grandchild />;
      }
    }

    class Sibling extends React.Component {
      render() {
        ops.push('Sibling');
        sibling = this;
        return <div />;
      }
    }

    function Parent() {
      ops.push('Parent');
      return [
        // The extra div is necessary because when Parent bails out during the
        // high priority update, its progressedPriority is set to high.
        // So its direct children cannot be reused when we resume at
        // low priority. I think this would be fixed by changing
        // pendingWorkPriority and progressedPriority to be the priority of
        // the children only, not including the fiber itself.
        <div key="a">
          <Child />
        </div>,
        <Sibling key="b" />,
      ];
    }

    ReactNoop.render(<Parent />);
    ReactNoop.flush();
    ops = [];

    // Begin working on a low priority update to Child, but stop before
    // GreatGrandchild. Child and Grandchild begin but don't complete.
    child.setState({step: 1});
    ReactNoop.flushDeferredPri(30);
    expect(ops).toEqual(['Child', 'Grandchild']);

    // Interrupt the current low pri work with a high pri update elsewhere in
    // the tree.
    ops = [];
    ReactNoop.flushSync(() => {
      sibling.setState({});
    });
    expect(ops).toEqual(['Sibling']);

    // Continue the low pri work. The work on Child and GrandChild was memoized
    // so they should not be worked on again.
    ops = [];
    ReactNoop.flush();
    expect(ops).toEqual([
      // No Child
      // No Grandchild
      'GreatGrandchild',
    ]);
  });

  xit('can reuse work if shouldComponentUpdate is false, after being preempted', () => {
    let ops = [];

    function Bar(props) {
      ops.push('Bar');
      return <div>{props.children}</div>;
    }

    class Middle extends React.Component {
      shouldComponentUpdate(nextProps) {
        return this.props.children !== nextProps.children;
      }
      render() {
        ops.push('Middle');
        return <span>{this.props.children}</span>;
      }
    }

    class Content extends React.Component {
      shouldComponentUpdate(nextProps) {
        return this.props.step !== nextProps.step;
      }
      render() {
        ops.push('Content');
        return (
          <div>
            <Middle>{this.props.step === 0 ? 'Hi' : 'Hello'}</Middle>
            <Bar>{this.props.step === 0 ? this.props.text : '-'}</Bar>
            <Middle>{this.props.step === 0 ? 'There' : 'World'}</Middle>
          </div>
        );
      }
    }

    function Foo(props) {
      ops.push('Foo');
      return (
        <div>
          <Bar>{props.text}</Bar>
          <div hidden={true}>
            <Content step={props.step} text={props.text} />
          </div>
        </div>
      );
    }

    // Init
    ReactNoop.render(<Foo text="foo" step={0} />);
    ReactNoop.flush();

    expect(ops).toEqual(['Foo', 'Bar', 'Content', 'Middle', 'Bar', 'Middle']);

    ops = [];

    // Make a quick update which will schedule low priority work to
    // update the middle content.
    ReactNoop.render(<Foo text="bar" step={1} />);
    ReactNoop.flushDeferredPri(30 + 5);

    expect(ops).toEqual(['Foo', 'Bar']);

    ops = [];

    // The middle content is now pending rendering...
    ReactNoop.flushDeferredPri(30 + 25 + 5);
    expect(ops).toEqual(['Content', 'Middle', 'Bar']); // One more Middle left.

    ops = [];

    // but we'll interrupt it to render some higher priority work.
    // The middle content will bailout so it remains untouched.
    ReactNoop.render(<Foo text="foo" step={1} />);
    ReactNoop.flushDeferredPri(30);

    expect(ops).toEqual(['Foo', 'Bar']);

    ops = [];

    // Since we did nothing to the middle subtree during the interruption,
    // we should be able to reuse the reconciliation work that we already did
    // without restarting.
    ReactNoop.flush();
    expect(ops).toEqual(['Middle']);
  });

  it('memoizes work even if shouldComponentUpdate returns false', () => {
    let ops = [];
    class Foo extends React.Component {
      shouldComponentUpdate(nextProps) {
        // this.props is the memoized props. So this should return true for
        // every update except the first one.
        const shouldUpdate = this.props.step !== 1;
        ops.push('shouldComponentUpdate: ' + shouldUpdate);
        return shouldUpdate;
      }
      render() {
        ops.push('render');
        return <div />;
      }
    }

    ReactNoop.render(<Foo step={1} />);
    ReactNoop.flush();

    ops = [];
    ReactNoop.render(<Foo step={2} />);
    ReactNoop.flush();
    expect(ops).toEqual(['shouldComponentUpdate: false']);

    ops = [];
    ReactNoop.render(<Foo step={3} />);
    ReactNoop.flush();
    expect(ops).toEqual([
      // If the memoized props were not updated during last bail out, sCU will
      // keep returning false.
      'shouldComponentUpdate: true',
      'render',
    ]);
  });

  it('can update in the middle of a tree using setState', () => {
    let instance;
    class Bar extends React.Component {
      constructor() {
        super();
        this.state = {a: 'a'};
        instance = this;
      }
      render() {
        return <div>{this.props.children}</div>;
      }
    }

    function Foo() {
      return (
        <div>
          <Bar />
        </div>
      );
    }

    ReactNoop.render(<Foo />);
    ReactNoop.flush();
    expect(instance.state).toEqual({a: 'a'});
    instance.setState({b: 'b'});
    ReactNoop.flush();
    expect(instance.state).toEqual({a: 'a', b: 'b'});
  });

  it('can queue multiple state updates', () => {
    let instance;
    class Bar extends React.Component {
      constructor() {
        super();
        this.state = {a: 'a'};
        instance = this;
      }
      render() {
        return <div>{this.props.children}</div>;
      }
    }

    function Foo() {
      return (
        <div>
          <Bar />
        </div>
      );
    }

    ReactNoop.render(<Foo />);
    ReactNoop.flush();
    // Call setState multiple times before flushing
    instance.setState({b: 'b'});
    instance.setState({c: 'c'});
    instance.setState({d: 'd'});
    ReactNoop.flush();
    expect(instance.state).toEqual({a: 'a', b: 'b', c: 'c', d: 'd'});
  });

  it('can use updater form of setState', () => {
    let instance;
    class Bar extends React.Component {
      constructor() {
        super();
        this.state = {num: 1};
        instance = this;
      }
      render() {
        return <div>{this.props.children}</div>;
      }
    }

    function Foo({multiplier}) {
      return (
        <div>
          <Bar multiplier={multiplier} />
        </div>
      );
    }

    function updater(state, props) {
      return {num: state.num * props.multiplier};
    }

    ReactNoop.render(<Foo multiplier={2} />);
    ReactNoop.flush();
    expect(instance.state.num).toEqual(1);
    instance.setState(updater);
    ReactNoop.flush();
    expect(instance.state.num).toEqual(2);

    instance.setState(updater);
    ReactNoop.render(<Foo multiplier={3} />);
    ReactNoop.flush();
    expect(instance.state.num).toEqual(6);
  });

  it('can call setState inside update callback', () => {
    let instance;
    class Bar extends React.Component {
      constructor() {
        super();
        this.state = {num: 1};
        instance = this;
      }
      render() {
        return <div>{this.props.children}</div>;
      }
    }

    function Foo({multiplier}) {
      return (
        <div>
          <Bar multiplier={multiplier} />
        </div>
      );
    }

    function updater(state, props) {
      return {num: state.num * props.multiplier};
    }

    function callback() {
      this.setState({called: true});
    }

    ReactNoop.render(<Foo multiplier={2} />);
    ReactNoop.flush();
    instance.setState(updater);
    instance.setState(updater, callback);
    ReactNoop.flush();
    expect(instance.state.num).toEqual(4);
    expect(instance.state.called).toEqual(true);
  });

  it('can replaceState', () => {
    let instance;
    class Bar extends React.Component {
      state = {a: 'a'};
      render() {
        instance = this;
        return <div>{this.props.children}</div>;
      }
    }

    function Foo() {
      return (
        <div>
          <Bar />
        </div>
      );
    }

    ReactNoop.render(<Foo />);
    ReactNoop.flush();
    instance.setState({b: 'b'});
    instance.setState({c: 'c'});
    instance.updater.enqueueReplaceState(instance, {d: 'd'});
    ReactNoop.flush();
    expect(instance.state).toEqual({d: 'd'});
  });

  it('can forceUpdate', () => {
    const ops = [];

    function Baz() {
      ops.push('Baz');
      return <div />;
    }

    let instance;
    class Bar extends React.Component {
      constructor() {
        super();
        instance = this;
      }
      shouldComponentUpdate() {
        return false;
      }
      render() {
        ops.push('Bar');
        return <Baz />;
      }
    }

    function Foo() {
      ops.push('Foo');
      return (
        <div>
          <Bar />
        </div>
      );
    }

    ReactNoop.render(<Foo />);
    ReactNoop.flush();
    expect(ops).toEqual(['Foo', 'Bar', 'Baz']);
    instance.forceUpdate();
    ReactNoop.flush();
    expect(ops).toEqual(['Foo', 'Bar', 'Baz', 'Bar', 'Baz']);
  });

  it('should clear forceUpdate after update is flushed', () => {
    let a = 0;

    class Foo extends React.PureComponent {
      render() {
        const msg = `A: ${a}, B: ${this.props.b}`;
        ReactNoop.yield(msg);
        return msg;
      }
    }

    const foo = React.createRef(null);
    ReactNoop.render(<Foo ref={foo} b={0} />);
    expect(ReactNoop.flush()).toEqual(['A: 0, B: 0']);

    a = 1;
    foo.current.forceUpdate();
    expect(ReactNoop.flush()).toEqual(['A: 1, B: 0']);

    ReactNoop.render(<Foo ref={foo} b={0} />);
    expect(ReactNoop.flush()).toEqual([]);
  });

  xit('can call sCU while resuming a partly mounted component', () => {
    let ops = [];

    const instances = new Set();

    class Bar extends React.Component {
      state = {y: 'A'};
      constructor() {
        super();
        instances.add(this);
      }
      shouldComponentUpdate(newProps, newState) {
        return this.props.x !== newProps.x || this.state.y !== newState.y;
      }
      render() {
        ops.push('Bar:' + this.props.x);
        return <span prop={'' + (this.props.x === this.state.y)} />;
      }
    }

    function Foo(props) {
      ops.push('Foo');
      return [
        <Bar key="a" x="A" />,
        <Bar key="b" x={props.step === 0 ? 'B' : 'B2'} />,
        <Bar key="c" x="C" />,
        <Bar key="d" x="D" />,
      ];
    }

    ReactNoop.render(<Foo step={0} />);
    ReactNoop.flushDeferredPri(40);
    expect(ops).toEqual(['Foo', 'Bar:A', 'Bar:B', 'Bar:C']);

    expect(instances.size).toBe(3);

    ops = [];

    ReactNoop.render(<Foo step={1} />);
    ReactNoop.flushDeferredPri(50);
    // A was memoized and reused. B was memoized but couldn't be reused because
    // props differences. C was memoized and reused. D never even started so it
    // needed a new instance.
    expect(ops).toEqual(['Foo', 'Bar:B2', 'Bar:D']);

    // We expect each rerender to correspond to a new instance.
    expect(instances.size).toBe(4);
  });

  xit('gets new props when setting state on a partly updated component', () => {
    let ops = [];
    const instances = [];

    class Bar extends React.Component {
      state = {y: 'A'};
      constructor() {
        super();
        instances.push(this);
      }
      performAction() {
        this.setState({
          y: 'B',
        });
      }
      render() {
        ops.push('Bar:' + this.props.x + '-' + this.props.step);
        return <span prop={'' + (this.props.x === this.state.y)} />;
      }
    }

    function Baz() {
      // This component is used as a sibling to Foo so that we can fully
      // complete Foo, without committing.
      ops.push('Baz');
      return <div />;
    }

    function Foo(props) {
      ops.push('Foo');
      return [
        <Bar key="a" x="A" step={props.step} />,
        <Bar key="b" x="B" step={props.step} />,
      ];
    }

    ReactNoop.render(
      <div>
        <Foo step={0} />
        <Baz />
        <Baz />
      </div>,
    );
    ReactNoop.flush();

    ops = [];

    // Flush part way through with new props, fully completing the first Bar.
    // However, it doesn't commit yet.
    ReactNoop.render(
      <div>
        <Foo step={1} />
        <Baz />
        <Baz />
      </div>,
    );
    ReactNoop.flushDeferredPri(45);
    expect(ops).toEqual(['Foo', 'Bar:A-1', 'Bar:B-1', 'Baz']);

    // Make an update to the same Bar.
    instances[0].performAction();

    ops = [];

    ReactNoop.flush();
    expect(ops).toEqual(['Bar:A-1', 'Baz']);
  });

  xit('calls componentWillMount twice if the initial render is aborted', () => {
    let ops = [];

    class LifeCycle extends React.Component {
      state = {x: this.props.x};
      UNSAFE_componentWillReceiveProps(nextProps) {
        ops.push(
          'componentWillReceiveProps:' + this.state.x + '-' + nextProps.x,
        );
        this.setState({x: nextProps.x});
      }
      UNSAFE_componentWillMount() {
        ops.push('componentWillMount:' + this.state.x + '-' + this.props.x);
      }
      componentDidMount() {
        ops.push('componentDidMount:' + this.state.x + '-' + this.props.x);
      }
      render() {
        return <span />;
      }
    }

    function Trail() {
      ops.push('Trail');
      return null;
    }

    function App(props) {
      ops.push('App');
      return (
        <div>
          <LifeCycle x={props.x} />
          <Trail />
        </div>
      );
    }

    ReactNoop.render(<App x={0} />);
    ReactNoop.flushDeferredPri(30);

    expect(ops).toEqual(['App', 'componentWillMount:0-0']);

    ops = [];

    ReactNoop.render(<App x={1} />);
    ReactNoop.flush();

    expect(ops).toEqual([
      'App',
      'componentWillReceiveProps:0-1',
      'componentWillMount:1-1',
      'Trail',
      'componentDidMount:1-1',
    ]);
  });

  xit('uses state set in componentWillMount even if initial render was aborted', () => {
    let ops = [];

    class LifeCycle extends React.Component {
      constructor(props) {
        super(props);
        this.state = {x: this.props.x + '(ctor)'};
      }
      UNSAFE_componentWillMount() {
        ops.push('componentWillMount:' + this.state.x);
        this.setState({x: this.props.x + '(willMount)'});
      }
      componentDidMount() {
        ops.push('componentDidMount:' + this.state.x);
      }
      render() {
        ops.push('render:' + this.state.x);
        return <span />;
      }
    }

    function App(props) {
      ops.push('App');
      return <LifeCycle x={props.x} />;
    }

    ReactNoop.render(<App x={0} />);
    ReactNoop.flushDeferredPri(20);

    expect(ops).toEqual([
      'App',
      'componentWillMount:0(ctor)',
      'render:0(willMount)',
    ]);

    ops = [];
    ReactNoop.render(<App x={1} />);
    ReactNoop.flush();

    expect(ops).toEqual([
      'App',
      'componentWillMount:0(willMount)',
      'render:1(willMount)',
      'componentDidMount:1(willMount)',
    ]);
  });

  xit('calls componentWill* twice if an update render is aborted', () => {
    let ops = [];

    class LifeCycle extends React.Component {
      UNSAFE_componentWillMount() {
        ops.push('componentWillMount:' + this.props.x);
      }
      componentDidMount() {
        ops.push('componentDidMount:' + this.props.x);
      }
      UNSAFE_componentWillReceiveProps(nextProps) {
        ops.push(
          'componentWillReceiveProps:' + this.props.x + '-' + nextProps.x,
        );
      }
      shouldComponentUpdate(nextProps) {
        ops.push('shouldComponentUpdate:' + this.props.x + '-' + nextProps.x);
        return true;
      }
      UNSAFE_componentWillUpdate(nextProps) {
        ops.push('componentWillUpdate:' + this.props.x + '-' + nextProps.x);
      }
      componentDidUpdate(prevProps) {
        ops.push('componentDidUpdate:' + this.props.x + '-' + prevProps.x);
      }
      render() {
        ops.push('render:' + this.props.x);
        return <span />;
      }
    }

    function Sibling() {
      // The sibling is used to confirm that we've completed the first child,
      // but not yet flushed.
      ops.push('Sibling');
      return <span />;
    }

    function App(props) {
      ops.push('App');

      return [<LifeCycle key="a" x={props.x} />, <Sibling key="b" />];
    }

    ReactNoop.render(<App x={0} />);
    ReactNoop.flush();

    expect(ops).toEqual([
      'App',
      'componentWillMount:0',
      'render:0',
      'Sibling',
      'componentDidMount:0',
    ]);

    ops = [];

    ReactNoop.render(<App x={1} />);
    ReactNoop.flushDeferredPri(30);

    expect(ops).toEqual([
      'App',
      'componentWillReceiveProps:0-1',
      'shouldComponentUpdate:0-1',
      'componentWillUpdate:0-1',
      'render:1',
      'Sibling',
      // no componentDidUpdate
    ]);

    ops = [];

    ReactNoop.render(<App x={2} />);
    ReactNoop.flush();

    expect(ops).toEqual([
      'App',
      'componentWillReceiveProps:1-2',
      'shouldComponentUpdate:1-2',
      'componentWillUpdate:1-2',
      'render:2',
      'Sibling',
      // When componentDidUpdate finally gets called, it covers both updates.
      'componentDidUpdate:2-0',
    ]);
  });

  it('calls getDerivedStateFromProps even for state-only updates', () => {
    let ops = [];
    let instance;

    class LifeCycle extends React.Component {
      state = {};
      static getDerivedStateFromProps(props, prevState) {
        ops.push('getDerivedStateFromProps');
        return {foo: 'foo'};
      }
      changeState() {
        this.setState({foo: 'bar'});
      }
      componentDidUpdate() {
        ops.push('componentDidUpdate');
      }
      render() {
        ops.push('render');
        instance = this;
        return null;
      }
    }

    ReactNoop.render(<LifeCycle />);
    ReactNoop.flush();

    expect(ops).toEqual(['getDerivedStateFromProps', 'render']);
    expect(instance.state).toEqual({foo: 'foo'});

    ops = [];

    instance.changeState();
    ReactNoop.flush();

    expect(ops).toEqual([
      'getDerivedStateFromProps',
      'render',
      'componentDidUpdate',
    ]);
    expect(instance.state).toEqual({foo: 'foo'});
  });

  it('does not call getDerivedStateFromProps if neither state nor props have changed', () => {
    class Parent extends React.Component {
      state = {parentRenders: 0};
      static getDerivedStateFromProps(props, prevState) {
        ReactNoop.yield('getDerivedStateFromProps');
        return prevState.parentRenders + 1;
      }
      render() {
        ReactNoop.yield('Parent');
        return <Child parentRenders={this.state.parentRenders} ref={child} />;
      }
    }

    class Child extends React.Component {
      render() {
        ReactNoop.yield('Child');
        return this.props.parentRenders;
      }
    }

    const child = React.createRef(null);
    ReactNoop.render(<Parent />);
    expect(ReactNoop.flush()).toEqual([
      'getDerivedStateFromProps',
      'Parent',
      'Child',
    ]);

    // Schedule an update on the child. The parent should not re-render.
    child.current.setState({});
    expect(ReactNoop.flush()).toEqual(['Child']);
  });

  xit('does not call componentWillReceiveProps for state-only updates', () => {
    let ops = [];

    const instances = [];

    class LifeCycle extends React.Component {
      state = {x: 0};
      tick() {
        this.setState({
          x: this.state.x + 1,
        });
      }
      UNSAFE_componentWillMount() {
        instances.push(this);
        ops.push('componentWillMount:' + this.state.x);
      }
      componentDidMount() {
        ops.push('componentDidMount:' + this.state.x);
      }
      UNSAFE_componentWillReceiveProps(nextProps) {
        ops.push('componentWillReceiveProps');
      }
      shouldComponentUpdate(nextProps, nextState) {
        ops.push('shouldComponentUpdate:' + this.state.x + '-' + nextState.x);
        return true;
      }
      UNSAFE_componentWillUpdate(nextProps, nextState) {
        ops.push('componentWillUpdate:' + this.state.x + '-' + nextState.x);
      }
      componentDidUpdate(prevProps, prevState) {
        ops.push('componentDidUpdate:' + this.state.x + '-' + prevState.x);
      }
      render() {
        ops.push('render:' + this.state.x);
        return <span />;
      }
    }

    // This wrap is a bit contrived because we can't pause a completed root and
    // there is currently an issue where a component can't reuse its render
    // output unless it fully completed.
    class Wrap extends React.Component {
      state = {y: 0};
      UNSAFE_componentWillMount() {
        instances.push(this);
      }
      tick() {
        this.setState({
          y: this.state.y + 1,
        });
      }
      render() {
        ops.push('Wrap');
        return <LifeCycle y={this.state.y} />;
      }
    }

    function Sibling() {
      // The sibling is used to confirm that we've completed the first child,
      // but not yet flushed.
      ops.push('Sibling');
      return <span />;
    }

    function App(props) {
      ops.push('App');
      return [<Wrap key="a" />, <Sibling key="b" />];
    }

    ReactNoop.render(<App y={0} />);
    ReactNoop.flush();

    expect(ops).toEqual([
      'App',
      'Wrap',
      'componentWillMount:0',
      'render:0',
      'Sibling',
      'componentDidMount:0',
    ]);

    ops = [];

    // LifeCycle
    instances[1].tick();

    ReactNoop.flushDeferredPri(25);

    expect(ops).toEqual([
      // no componentWillReceiveProps
      'shouldComponentUpdate:0-1',
      'componentWillUpdate:0-1',
      'render:1',
      // no componentDidUpdate
    ]);

    ops = [];

    // LifeCycle
    instances[1].tick();

    ReactNoop.flush();

    expect(ops).toEqual([
      // no componentWillReceiveProps
      'shouldComponentUpdate:1-2',
      'componentWillUpdate:1-2',
      'render:2',
      // When componentDidUpdate finally gets called, it covers both updates.
      'componentDidUpdate:2-0',
    ]);

    ops = [];

    // Next we will update props of LifeCycle by updating its parent.

    instances[0].tick();

    ReactNoop.flushDeferredPri(30);

    expect(ops).toEqual([
      'Wrap',
      'componentWillReceiveProps',
      'shouldComponentUpdate:2-2',
      'componentWillUpdate:2-2',
      'render:2',
      // no componentDidUpdate
    ]);

    ops = [];

    // Next we will update LifeCycle directly but not with new props.
    instances[1].tick();

    ReactNoop.flush();

    expect(ops).toEqual([
      // This should not trigger another componentWillReceiveProps because
      // we never got new props.
      'shouldComponentUpdate:2-3',
      'componentWillUpdate:2-3',
      'render:3',
      'componentDidUpdate:3-2',
    ]);

    // TODO: Test that we get the expected values for the same scenario with
    // incomplete parents.
  });

  xit('skips will/DidUpdate when bailing unless an update was already in progress', () => {
    let ops = [];

    class LifeCycle extends React.Component {
      UNSAFE_componentWillMount() {
        ops.push('componentWillMount');
      }
      componentDidMount() {
        ops.push('componentDidMount');
      }
      UNSAFE_componentWillReceiveProps(nextProps) {
        ops.push('componentWillReceiveProps');
      }
      shouldComponentUpdate(nextProps) {
        ops.push('shouldComponentUpdate');
        // Bail
        return this.props.x !== nextProps.x;
      }
      UNSAFE_componentWillUpdate(nextProps) {
        ops.push('componentWillUpdate');
      }
      componentDidUpdate(prevProps) {
        ops.push('componentDidUpdate');
      }
      render() {
        ops.push('render');
        return <span />;
      }
    }

    function Sibling() {
      ops.push('render sibling');
      return <span />;
    }

    function App(props) {
      return [<LifeCycle key="a" x={props.x} />, <Sibling key="b" />];
    }

    ReactNoop.render(<App x={0} />);
    ReactNoop.flush();

    expect(ops).toEqual([
      'componentWillMount',
      'render',
      'render sibling',
      'componentDidMount',
    ]);

    ops = [];

    // Update to same props
    ReactNoop.render(<App x={0} />);
    ReactNoop.flush();

    expect(ops).toEqual([
      'componentWillReceiveProps',
      'shouldComponentUpdate',
      // no componentWillUpdate
      // no render
      'render sibling',
      // no componentDidUpdate
    ]);

    ops = [];

    // Begin updating to new props...
    ReactNoop.render(<App x={1} />);
    ReactNoop.flushDeferredPri(30);

    expect(ops).toEqual([
      'componentWillReceiveProps',
      'shouldComponentUpdate',
      'componentWillUpdate',
      'render',
      'render sibling',
      // no componentDidUpdate yet
    ]);

    ops = [];

    // ...but we'll interrupt it to rerender the same props.
    ReactNoop.render(<App x={1} />);
    ReactNoop.flush();

    // We can bail out this time, but we must call componentDidUpdate.
    expect(ops).toEqual([
      'componentWillReceiveProps',
      'shouldComponentUpdate',
      // no componentWillUpdate
      // no render
      'render sibling',
      'componentDidUpdate',
    ]);
  });

  it('can nest batchedUpdates', () => {
    let ops = [];
    let instance;

    class Foo extends React.Component {
      state = {n: 0};
      render() {
        instance = this;
        return <div />;
      }
    }

    ReactNoop.render(<Foo />);
    ReactNoop.flush();
    ops = [];

    ReactNoop.flushSync(() => {
      ReactNoop.batchedUpdates(() => {
        instance.setState({n: 1}, () => ops.push('setState 1'));
        instance.setState({n: 2}, () => ops.push('setState 2'));
        ReactNoop.batchedUpdates(() => {
          instance.setState({n: 3}, () => ops.push('setState 3'));
          instance.setState({n: 4}, () => ops.push('setState 4'));
          ops.push('end inner batchedUpdates');
        });
        ops.push('end outer batchedUpdates');
      });
    });

    // ReactNoop.flush() not needed because updates are synchronous

    expect(ops).toEqual([
      'end inner batchedUpdates',
      'end outer batchedUpdates',
      'setState 1',
      'setState 2',
      'setState 3',
      'setState 4',
    ]);
    expect(instance.state.n).toEqual(4);
  });

  it('can handle if setState callback throws', () => {
    let ops = [];
    let instance;

    class Foo extends React.Component {
      state = {n: 0};
      render() {
        instance = this;
        return <div />;
      }
    }

    ReactNoop.render(<Foo />);
    ReactNoop.flush();
    ops = [];

    function updater({n}) {
      return {n: n + 1};
    }

    instance.setState(updater, () => ops.push('first callback'));
    instance.setState(updater, () => {
      ops.push('second callback');
      throw new Error('callback error');
    });
    instance.setState(updater, () => ops.push('third callback'));

    expect(() => {
      ReactNoop.flush();
    }).toThrow('callback error');

    // The third callback isn't called because the second one throws
    expect(ops).toEqual(['first callback', 'second callback']);
    expect(instance.state.n).toEqual(3);
  });

  it('merges and masks context', () => {
    const ops = [];

    class Intl extends React.Component {
      static childContextTypes = {
        locale: PropTypes.string,
      };
      getChildContext() {
        return {
          locale: this.props.locale,
        };
      }
      render() {
        ops.push('Intl ' + JSON.stringify(this.context));
        return this.props.children;
      }
    }

    class Router extends React.Component {
      static childContextTypes = {
        route: PropTypes.string,
      };
      getChildContext() {
        return {
          route: this.props.route,
        };
      }
      render() {
        ops.push('Router ' + JSON.stringify(this.context));
        return this.props.children;
      }
    }

    class ShowLocale extends React.Component {
      static contextTypes = {
        locale: PropTypes.string,
      };
      render() {
        ops.push('ShowLocale ' + JSON.stringify(this.context));
        return this.context.locale;
      }
    }

    class ShowRoute extends React.Component {
      static contextTypes = {
        route: PropTypes.string,
      };
      render() {
        ops.push('ShowRoute ' + JSON.stringify(this.context));
        return this.context.route;
      }
    }

    function ShowBoth(props, context) {
      ops.push('ShowBoth ' + JSON.stringify(context));
      return `${context.route} in ${context.locale}`;
    }
    ShowBoth.contextTypes = {
      locale: PropTypes.string,
      route: PropTypes.string,
    };

    class ShowNeither extends React.Component {
      render() {
        ops.push('ShowNeither ' + JSON.stringify(this.context));
        return null;
      }
    }

    class Indirection extends React.Component {
      render() {
        ops.push('Indirection ' + JSON.stringify(this.context));
        return [
          <ShowLocale key="a" />,
          <ShowRoute key="b" />,
          <ShowNeither key="c" />,
          <Intl key="d" locale="ru">
            <ShowBoth />
          </Intl>,
          <ShowBoth key="e" />,
        ];
      }
    }

    ops.length = 0;
    ReactNoop.render(
      <Intl locale="fr">
        <ShowLocale />
        <div>
          <ShowBoth />
        </div>
      </Intl>,
    );
    expect(ReactNoop.flush).toWarnDev(
      'Legacy context API has been detected within a strict-mode tree: \n\n' +
        'Please update the following components: Intl, ShowBoth, ShowLocale',
      {withoutStack: true},
    );
    expect(ops).toEqual([
      'Intl {}',
      'ShowLocale {"locale":"fr"}',
      'ShowBoth {"locale":"fr"}',
    ]);

    ops.length = 0;
    ReactNoop.render(
      <Intl locale="de">
        <ShowLocale />
        <div>
          <ShowBoth />
        </div>
      </Intl>,
    );
    ReactNoop.flush();
    expect(ops).toEqual([
      'Intl {}',
      'ShowLocale {"locale":"de"}',
      'ShowBoth {"locale":"de"}',
    ]);

    ops.length = 0;
    ReactNoop.render(
      <Intl locale="sv">
        <ShowLocale />
        <div>
          <ShowBoth />
        </div>
      </Intl>,
    );
    ReactNoop.flushDeferredPri(15);
    expect(ops).toEqual(['Intl {}']);

    ops.length = 0;
    ReactNoop.render(
      <Intl locale="en">
        <ShowLocale />
        <Router route="/about">
          <Indirection />
        </Router>
        <ShowBoth />
      </Intl>,
    );
    expect(ReactNoop.flush).toWarnDev(
      'Legacy context API has been detected within a strict-mode tree: \n\n' +
        'Please update the following components: Router, ShowRoute',
      {withoutStack: true},
    );
    expect(ops).toEqual([
      'ShowLocale {"locale":"sv"}',
      'ShowBoth {"locale":"sv"}',
      'Intl {}',
      'ShowLocale {"locale":"en"}',
      'Router {}',
      'Indirection {}',
      'ShowLocale {"locale":"en"}',
      'ShowRoute {"route":"/about"}',
      'ShowNeither {}',
      'Intl {}',
      'ShowBoth {"locale":"ru","route":"/about"}',
      'ShowBoth {"locale":"en","route":"/about"}',
      'ShowBoth {"locale":"en"}',
    ]);
  });

  it('does not leak own context into context provider', () => {
    const ops = [];
    class Recurse extends React.Component {
      static contextTypes = {
        n: PropTypes.number,
      };
      static childContextTypes = {
        n: PropTypes.number,
      };
      getChildContext() {
        return {n: (this.context.n || 3) - 1};
      }
      render() {
        ops.push('Recurse ' + JSON.stringify(this.context));
        if (this.context.n === 0) {
          return null;
        }
        return <Recurse />;
      }
    }

    ReactNoop.render(<Recurse />);
    expect(ReactNoop.flush).toWarnDev(
      'Legacy context API has been detected within a strict-mode tree: \n\n' +
        'Please update the following components: Recurse',
      {withoutStack: true},
    );
    expect(ops).toEqual([
      'Recurse {}',
      'Recurse {"n":2}',
      'Recurse {"n":1}',
      'Recurse {"n":0}',
    ]);
  });

  it('does not leak own context into context provider (factory components)', () => {
    const ops = [];
    function Recurse(props, context) {
      return {
        getChildContext() {
          return {n: (context.n || 3) - 1};
        },
        render() {
          ops.push('Recurse ' + JSON.stringify(context));
          if (context.n === 0) {
            return null;
          }
          return <Recurse />;
        },
      };
    }
    Recurse.contextTypes = {
      n: PropTypes.number,
    };
    Recurse.childContextTypes = {
      n: PropTypes.number,
    };

    ReactNoop.render(<Recurse />);
    expect(ReactNoop.flush).toWarnDev(
      'Legacy context API has been detected within a strict-mode tree: \n\n' +
        'Please update the following components: Recurse',
      {withoutStack: true},
    );
    expect(ops).toEqual([
      'Recurse {}',
      'Recurse {"n":2}',
      'Recurse {"n":1}',
      'Recurse {"n":0}',
    ]);
  });

  it('provides context when reusing work', () => {
    const ops = [];

    class Intl extends React.Component {
      static childContextTypes = {
        locale: PropTypes.string,
      };
      getChildContext() {
        return {
          locale: this.props.locale,
        };
      }
      render() {
        ops.push('Intl ' + JSON.stringify(this.context));
        return this.props.children;
      }
    }

    class ShowLocale extends React.Component {
      static contextTypes = {
        locale: PropTypes.string,
      };
      render() {
        ops.push('ShowLocale ' + JSON.stringify(this.context));
        return this.context.locale;
      }
    }

    ops.length = 0;
    ReactNoop.render(
      <Intl locale="fr">
        <ShowLocale />
        <div hidden="true">
          <ShowLocale />
          <Intl locale="ru">
            <ShowLocale />
          </Intl>
        </div>
        <ShowLocale />
      </Intl>,
    );
    ReactNoop.flushDeferredPri(40);
    expect(ops).toEqual([
      'Intl {}',
      'ShowLocale {"locale":"fr"}',
      'ShowLocale {"locale":"fr"}',
    ]);

    ops.length = 0;
    expect(ReactNoop.flush).toWarnDev(
      'Legacy context API has been detected within a strict-mode tree: \n\n' +
        'Please update the following components: Intl, ShowLocale',
      {withoutStack: true},
    );
    expect(ops).toEqual([
      'ShowLocale {"locale":"fr"}',
      'Intl {}',
      'ShowLocale {"locale":"ru"}',
    ]);
  });

  it('reads context when setState is below the provider', () => {
    const ops = [];
    let statefulInst;

    class Intl extends React.Component {
      static childContextTypes = {
        locale: PropTypes.string,
      };
      getChildContext() {
        const childContext = {
          locale: this.props.locale,
        };
        ops.push('Intl:provide ' + JSON.stringify(childContext));
        return childContext;
      }
      render() {
        ops.push('Intl:read ' + JSON.stringify(this.context));
        return this.props.children;
      }
    }

    class ShowLocaleClass extends React.Component {
      static contextTypes = {
        locale: PropTypes.string,
      };
      render() {
        ops.push('ShowLocaleClass:read ' + JSON.stringify(this.context));
        return this.context.locale;
      }
    }

    function ShowLocaleFn(props, context) {
      ops.push('ShowLocaleFn:read ' + JSON.stringify(context));
      return context.locale;
    }
    ShowLocaleFn.contextTypes = {
      locale: PropTypes.string,
    };

    class Stateful extends React.Component {
      state = {x: 0};
      render() {
        statefulInst = this;
        return this.props.children;
      }
    }

    function IndirectionFn(props, context) {
      ops.push('IndirectionFn ' + JSON.stringify(context));
      return props.children;
    }

    class IndirectionClass extends React.Component {
      render() {
        ops.push('IndirectionClass ' + JSON.stringify(this.context));
        return this.props.children;
      }
    }

    ops.length = 0;
    ReactNoop.render(
      <Intl locale="fr">
        <IndirectionFn>
          <IndirectionClass>
            <Stateful>
              <ShowLocaleClass />
              <ShowLocaleFn />
            </Stateful>
          </IndirectionClass>
        </IndirectionFn>
      </Intl>,
    );
    expect(ReactNoop.flush).toWarnDev(
      'Legacy context API has been detected within a strict-mode tree: \n\n' +
        'Please update the following components: Intl, ShowLocaleClass, ShowLocaleFn',
      {withoutStack: true},
    );
    expect(ops).toEqual([
      'Intl:read {}',
      'Intl:provide {"locale":"fr"}',
      'IndirectionFn {}',
      'IndirectionClass {}',
      'ShowLocaleClass:read {"locale":"fr"}',
      'ShowLocaleFn:read {"locale":"fr"}',
    ]);

    ops.length = 0;
    statefulInst.setState({x: 1});
    ReactNoop.flush();
    // All work has been memoized because setState()
    // happened below the context and could not have affected it.
    expect(ops).toEqual([]);
  });

  it('reads context when setState is above the provider', () => {
    const ops = [];
    let statefulInst;

    class Intl extends React.Component {
      static childContextTypes = {
        locale: PropTypes.string,
      };
      getChildContext() {
        const childContext = {
          locale: this.props.locale,
        };
        ops.push('Intl:provide ' + JSON.stringify(childContext));
        return childContext;
      }
      render() {
        ops.push('Intl:read ' + JSON.stringify(this.context));
        return this.props.children;
      }
    }

    class ShowLocaleClass extends React.Component {
      static contextTypes = {
        locale: PropTypes.string,
      };
      render() {
        ops.push('ShowLocaleClass:read ' + JSON.stringify(this.context));
        return this.context.locale;
      }
    }

    function ShowLocaleFn(props, context) {
      ops.push('ShowLocaleFn:read ' + JSON.stringify(context));
      return context.locale;
    }
    ShowLocaleFn.contextTypes = {
      locale: PropTypes.string,
    };

    function IndirectionFn(props, context) {
      ops.push('IndirectionFn ' + JSON.stringify(context));
      return props.children;
    }

    class IndirectionClass extends React.Component {
      render() {
        ops.push('IndirectionClass ' + JSON.stringify(this.context));
        return this.props.children;
      }
    }

    class Stateful extends React.Component {
      state = {locale: 'fr'};
      render() {
        statefulInst = this;
        return <Intl locale={this.state.locale}>{this.props.children}</Intl>;
      }
    }

    ops.length = 0;
    ReactNoop.render(
      <Stateful>
        <IndirectionFn>
          <IndirectionClass>
            <ShowLocaleClass />
            <ShowLocaleFn />
          </IndirectionClass>
        </IndirectionFn>
      </Stateful>,
    );
    expect(ReactNoop.flush).toWarnDev(
      'Legacy context API has been detected within a strict-mode tree: \n\n' +
        'Please update the following components: Intl, ShowLocaleClass, ShowLocaleFn',
      {withoutStack: true},
    );
    expect(ops).toEqual([
      'Intl:read {}',
      'Intl:provide {"locale":"fr"}',
      'IndirectionFn {}',
      'IndirectionClass {}',
      'ShowLocaleClass:read {"locale":"fr"}',
      'ShowLocaleFn:read {"locale":"fr"}',
    ]);

    ops.length = 0;
    statefulInst.setState({locale: 'gr'});
    ReactNoop.flush();
    expect(ops).toEqual([
      // Intl is below setState() so it might have been
      // affected by it. Therefore we re-render and recompute
      // its child context.
      'Intl:read {}',
      'Intl:provide {"locale":"gr"}',
      // TODO: it's unfortunate that we can't reuse work on
      // these components even though they don't depend on context.
      'IndirectionFn {}',
      'IndirectionClass {}',
      // These components depend on context:
      'ShowLocaleClass:read {"locale":"gr"}',
      'ShowLocaleFn:read {"locale":"gr"}',
    ]);
  });

  it('maintains the correct context when providers bail out due to low priority', () => {
    class Root extends React.Component {
      render() {
        return <Middle {...this.props} />;
      }
    }

    let instance;

    class Middle extends React.Component {
      constructor(props, context) {
        super(props, context);
        instance = this;
      }
      shouldComponentUpdate() {
        // Return false so that our child will get a NoWork priority (and get bailed out)
        return false;
      }
      render() {
        return <Child />;
      }
    }

    // Child must be a context provider to trigger the bug
    class Child extends React.Component {
      static childContextTypes = {};
      getChildContext() {
        return {};
      }
      render() {
        return <div />;
      }
    }

    // Init
    ReactNoop.render(<Root />);
    expect(ReactNoop.flush).toWarnDev(
      'Legacy context API has been detected within a strict-mode tree: \n\n' +
        'Please update the following components: Child',
      {withoutStack: true},
    );

    // Trigger an update in the middle of the tree
    instance.setState({});
    ReactNoop.flush();
  });

  it('maintains the correct context when unwinding due to an error in render', () => {
    class Root extends React.Component {
      componentDidCatch(error) {
        // If context is pushed/popped correctly,
        // This method will be used to handle the intentionally-thrown Error.
      }
      render() {
        return <ContextProvider depth={1} />;
      }
    }

    let instance;

    class ContextProvider extends React.Component {
      constructor(props, context) {
        super(props, context);
        this.state = {};
        if (props.depth === 1) {
          instance = this;
        }
      }
      static childContextTypes = {};
      getChildContext() {
        return {};
      }
      render() {
        if (this.state.throwError) {
          throw Error();
        }
        return this.props.depth < 4 ? (
          <ContextProvider depth={this.props.depth + 1} />
        ) : (
          <div />
        );
      }
    }

    // Init
    ReactNoop.render(<Root />);
    expect(ReactNoop.flush).toWarnDev(
      'Legacy context API has been detected within a strict-mode tree: \n\n' +
        'Please update the following components: ContextProvider',
      {withoutStack: true},
    );

    // Trigger an update in the middle of the tree
    // This is necessary to reproduce the error as it currently exists.
    instance.setState({
      throwError: true,
    });
    expect(ReactNoop.flush).toWarnDev(
      'Error boundaries should implement getDerivedStateFromError()',
      {withoutStack: true},
    );
  });

  it('should not recreate masked context unless inputs have changed', () => {
    const ops = [];

    let scuCounter = 0;

    class MyComponent extends React.Component {
      static contextTypes = {};
      componentDidMount(prevProps, prevState) {
        ops.push('componentDidMount');
        this.setState({setStateInCDU: true});
      }
      componentDidUpdate(prevProps, prevState) {
        ops.push('componentDidUpdate');
        if (this.state.setStateInCDU) {
          this.setState({setStateInCDU: false});
        }
      }
      UNSAFE_componentWillReceiveProps(nextProps) {
        ops.push('componentWillReceiveProps');
        this.setState({setStateInCDU: true});
      }
      render() {
        ops.push('render');
        return null;
      }
      shouldComponentUpdate(nextProps, nextState) {
        ops.push('shouldComponentUpdate');
        return scuCounter++ < 5; // Don't let test hang
      }
    }

    ReactNoop.render(<MyComponent />);
    expect(ReactNoop.flush).toWarnDev(
      [
        'componentWillReceiveProps: Please update the following components ' +
          'to use static getDerivedStateFromProps instead: MyComponent',
        'Legacy context API has been detected within a strict-mode tree: \n\n' +
          'Please update the following components: MyComponent',
      ],
      {withoutStack: true},
    );

    expect(ops).toEqual([
      'render',
      'componentDidMount',
      'shouldComponentUpdate',
      'render',
      'componentDidUpdate',
      'shouldComponentUpdate',
      'render',
      'componentDidUpdate',
    ]);
  });

  xit('should reuse memoized work if pointers are updated before calling lifecycles', () => {
    let cduNextProps = [];
    let cduPrevProps = [];
    let scuNextProps = [];
    let scuPrevProps = [];
    let renderCounter = 0;

    function SecondChild(props) {
      return <span>{props.children}</span>;
    }

    class FirstChild extends React.Component {
      componentDidUpdate(prevProps, prevState) {
        cduNextProps.push(this.props);
        cduPrevProps.push(prevProps);
      }
      shouldComponentUpdate(nextProps, nextState) {
        scuNextProps.push(nextProps);
        scuPrevProps.push(this.props);
        return this.props.children !== nextProps.children;
      }
      render() {
        renderCounter++;
        return <span>{this.props.children}</span>;
      }
    }

    class Middle extends React.Component {
      render() {
        return (
          <div>
            <FirstChild>{this.props.children}</FirstChild>
            <SecondChild>{this.props.children}</SecondChild>
          </div>
        );
      }
    }

    function Root(props) {
      return (
        <div hidden={true}>
          <Middle {...props} />
        </div>
      );
    }

    // Initial render of the entire tree.
    // Renders: Root, Middle, FirstChild, SecondChild
    ReactNoop.render(<Root>A</Root>);
    ReactNoop.flush();

    expect(renderCounter).toBe(1);

    // Schedule low priority work to update children.
    // Give it enough time to partially render.
    // Renders: Root, Middle, FirstChild
    ReactNoop.render(<Root>B</Root>);
    ReactNoop.flushDeferredPri(20 + 30 + 5);

    // At this point our FirstChild component has rendered a second time,
    // But since the render is not completed cDU should not be called yet.
    expect(renderCounter).toBe(2);
    expect(scuPrevProps).toEqual([{children: 'A'}]);
    expect(scuNextProps).toEqual([{children: 'B'}]);
    expect(cduPrevProps).toEqual([]);
    expect(cduNextProps).toEqual([]);

    // Next interrupt the partial render with higher priority work.
    // The in-progress child content will bailout.
    // Renders: Root, Middle, FirstChild, SecondChild
    ReactNoop.render(<Root>B</Root>);
    ReactNoop.flush();

    // At this point the higher priority render has completed.
    // Since FirstChild props didn't change, sCU returned false.
    // The previous memoized copy should be used.
    expect(renderCounter).toBe(2);
    expect(scuPrevProps).toEqual([{children: 'A'}, {children: 'B'}]);
    expect(scuNextProps).toEqual([{children: 'B'}, {children: 'B'}]);
    expect(cduPrevProps).toEqual([{children: 'A'}]);
    expect(cduNextProps).toEqual([{children: 'B'}]);
  });

  it('updates descendants with new context values', () => {
    let rendered = [];
    let instance;

    class TopContextProvider extends React.Component {
      static childContextTypes = {
        count: PropTypes.number,
      };
      constructor() {
        super();
        this.state = {count: 0};
        instance = this;
      }
      getChildContext = () => ({
        count: this.state.count,
      });
      render = () => this.props.children;
      updateCount = () =>
        this.setState(state => ({
          count: state.count + 1,
        }));
    }

    class Middle extends React.Component {
      render = () => this.props.children;
    }

    class Child extends React.Component {
      static contextTypes = {
        count: PropTypes.number,
      };
      render = () => {
        rendered.push(`count:${this.context.count}`);
        return null;
      };
    }

    ReactNoop.render(
      <TopContextProvider>
        <Middle>
          <Child />
        </Middle>
      </TopContextProvider>,
    );

    expect(ReactNoop.flush).toWarnDev(
      'Legacy context API has been detected within a strict-mode tree: \n\n' +
        'Please update the following components: Child, TopContextProvider',
      {withoutStack: true},
    );
    expect(rendered).toEqual(['count:0']);
    instance.updateCount();
    ReactNoop.flush();
    expect(rendered).toEqual(['count:0', 'count:1']);
  });

  it('updates descendants with multiple context-providing ancestors with new context values', () => {
    let rendered = [];
    let instance;

    class TopContextProvider extends React.Component {
      static childContextTypes = {
        count: PropTypes.number,
      };
      constructor() {
        super();
        this.state = {count: 0};
        instance = this;
      }
      getChildContext = () => ({
        count: this.state.count,
      });
      render = () => this.props.children;
      updateCount = () =>
        this.setState(state => ({
          count: state.count + 1,
        }));
    }

    class MiddleContextProvider extends React.Component {
      static childContextTypes = {
        name: PropTypes.string,
      };
      getChildContext = () => ({
        name: 'brian',
      });
      render = () => this.props.children;
    }

    class Child extends React.Component {
      static contextTypes = {
        count: PropTypes.number,
      };
      render = () => {
        rendered.push(`count:${this.context.count}`);
        return null;
      };
    }

    ReactNoop.render(
      <TopContextProvider>
        <MiddleContextProvider>
          <Child />
        </MiddleContextProvider>
      </TopContextProvider>,
    );

    expect(ReactNoop.flush).toWarnDev(
      'Legacy context API has been detected within a strict-mode tree: \n\n' +
        'Please update the following components: Child, MiddleContextProvider, TopContextProvider',
      {withoutStack: true},
    );
    expect(rendered).toEqual(['count:0']);
    instance.updateCount();
    ReactNoop.flush();
    expect(rendered).toEqual(['count:0', 'count:1']);
  });

  it('should not update descendants with new context values if shouldComponentUpdate returns false', () => {
    let rendered = [];
    let instance;

    class TopContextProvider extends React.Component {
      static childContextTypes = {
        count: PropTypes.number,
      };
      constructor() {
        super();
        this.state = {count: 0};
        instance = this;
      }
      getChildContext = () => ({
        count: this.state.count,
      });
      render = () => this.props.children;
      updateCount = () =>
        this.setState(state => ({
          count: state.count + 1,
        }));
    }

    class MiddleScu extends React.Component {
      shouldComponentUpdate() {
        return false;
      }
      render = () => this.props.children;
    }

    class MiddleContextProvider extends React.Component {
      static childContextTypes = {
        name: PropTypes.string,
      };
      getChildContext = () => ({
        name: 'brian',
      });
      render = () => this.props.children;
    }

    class Child extends React.Component {
      static contextTypes = {
        count: PropTypes.number,
      };
      render = () => {
        rendered.push(`count:${this.context.count}`);
        return null;
      };
    }

    ReactNoop.render(
      <TopContextProvider>
        <MiddleScu>
          <MiddleContextProvider>
            <Child />
          </MiddleContextProvider>
        </MiddleScu>
      </TopContextProvider>,
    );

    expect(ReactNoop.flush).toWarnDev(
      'Legacy context API has been detected within a strict-mode tree: \n\n' +
        'Please update the following components: Child, MiddleContextProvider, TopContextProvider',
      {withoutStack: true},
    );
    expect(rendered).toEqual(['count:0']);
    instance.updateCount();
    ReactNoop.flush();
    expect(rendered).toEqual(['count:0']);
  });

  it('should update descendants with new context values if setState() is called in the middle of the tree', () => {
    let rendered = [];
    let middleInstance;
    let topInstance;

    class TopContextProvider extends React.Component {
      static childContextTypes = {
        count: PropTypes.number,
      };
      constructor() {
        super();
        this.state = {count: 0};
        topInstance = this;
      }
      getChildContext = () => ({
        count: this.state.count,
      });
      render = () => this.props.children;
      updateCount = () =>
        this.setState(state => ({
          count: state.count + 1,
        }));
    }

    class MiddleScu extends React.Component {
      shouldComponentUpdate() {
        return false;
      }
      render = () => this.props.children;
    }

    class MiddleContextProvider extends React.Component {
      static childContextTypes = {
        name: PropTypes.string,
      };
      constructor() {
        super();
        this.state = {name: 'brian'};
        middleInstance = this;
      }
      getChildContext = () => ({
        name: this.state.name,
      });
      updateName = name => {
        this.setState({name});
      };
      render = () => this.props.children;
    }

    class Child extends React.Component {
      static contextTypes = {
        count: PropTypes.number,
        name: PropTypes.string,
      };
      render = () => {
        rendered.push(`count:${this.context.count}, name:${this.context.name}`);
        return null;
      };
    }

    ReactNoop.render(
      <TopContextProvider>
        <MiddleScu>
          <MiddleContextProvider>
            <Child />
          </MiddleContextProvider>
        </MiddleScu>
      </TopContextProvider>,
    );

    expect(ReactNoop.flush).toWarnDev(
      'Legacy context API has been detected within a strict-mode tree: \n\n' +
        'Please update the following components: Child, MiddleContextProvider, TopContextProvider',
      {withoutStack: true},
    );
    expect(rendered).toEqual(['count:0, name:brian']);
    topInstance.updateCount();
    ReactNoop.flush();
    expect(rendered).toEqual(['count:0, name:brian']);
    middleInstance.updateName('not brian');
    ReactNoop.flush();
    expect(rendered).toEqual([
      'count:0, name:brian',
      'count:1, name:not brian',
    ]);
  });

  it('does not interrupt for update at same priority', () => {
    function Parent(props) {
      ReactNoop.yield('Parent: ' + props.step);
      return <Child step={props.step} />;
    }

    function Child(props) {
      ReactNoop.yield('Child: ' + props.step);
      return null;
    }

    ReactNoop.render(<Parent step={1} />);
    ReactNoop.flushThrough(['Parent: 1']);

    // Interrupt at same priority
    ReactNoop.render(<Parent step={2} />);

    expect(ReactNoop.flush()).toEqual(['Child: 1', 'Parent: 2', 'Child: 2']);
  });

  it('does not interrupt for update at lower priority', () => {
    function Parent(props) {
      ReactNoop.yield('Parent: ' + props.step);
      return <Child step={props.step} />;
    }

    function Child(props) {
      ReactNoop.yield('Child: ' + props.step);
      return null;
    }

    ReactNoop.render(<Parent step={1} />);
    ReactNoop.flushThrough(['Parent: 1']);

    // Interrupt at lower priority
    ReactNoop.expire(2000);
    ReactNoop.render(<Parent step={2} />);

    expect(ReactNoop.flush()).toEqual(['Child: 1', 'Parent: 2', 'Child: 2']);
  });

  it('does interrupt for update at higher priority', () => {
    function Parent(props) {
      ReactNoop.yield('Parent: ' + props.step);
      return <Child step={props.step} />;
    }

    function Child(props) {
      ReactNoop.yield('Child: ' + props.step);
      return null;
    }

    ReactNoop.render(<Parent step={1} />);
    ReactNoop.flushThrough(['Parent: 1']);

    // Interrupt at higher priority
    expect(
      ReactNoop.flushSync(() => ReactNoop.render(<Parent step={2} />)),
    ).toEqual(['Parent: 2', 'Child: 2']);
    ReactNoop.clearYields();

    expect(ReactNoop.flush()).toEqual([]);
  });

  // We don't currently use fibers as keys. Re-enable this test if we
  // ever do again.
  it('does not break with a bad Map polyfill', () => {
    const realMapSet = Map.prototype.set;

    function triggerCodePathThatUsesFibersAsMapKeys() {
      function Thing() {
        throw new Error('No.');
      }
      class Boundary extends React.Component {
        state = {didError: false};
        componentDidCatch() {
          this.setState({didError: true});
        }
        render() {
          return this.state.didError ? null : <Thing />;
        }
      }
      ReactNoop.render(<Boundary />);
      ReactNoop.flush();
    }

    // First, verify that this code path normally receives Fibers as keys,
    // and that they're not extensible.
    jest.resetModules();
    let receivedNonExtensibleObjects;
    // eslint-disable-next-line no-extend-native
    Map.prototype.set = function(key) {
      if (typeof key === 'object' && key !== null) {
        if (!Object.isExtensible(key)) {
          receivedNonExtensibleObjects = true;
        }
      }
      return realMapSet.apply(this, arguments);
    };
    React = require('react');
    ReactNoop = require('react-noop-renderer');
    try {
      receivedNonExtensibleObjects = false;
      triggerCodePathThatUsesFibersAsMapKeys();
    } finally {
      // eslint-disable-next-line no-extend-native
      Map.prototype.set = realMapSet;
    }
    // If this fails, find another code path in Fiber
    // that passes Fibers as keys to Maps.
    // Note that we only expect them to be non-extensible
    // in development.
    expect(receivedNonExtensibleObjects).toBe(__DEV__);

    // Next, verify that a Map polyfill that "writes" to keys
    // doesn't cause a failure.
    jest.resetModules();
    // eslint-disable-next-line no-extend-native
    Map.prototype.set = function(key, value) {
      if (typeof key === 'object' && key !== null) {
        // A polyfill could do something like this.
        // It would throw if an object is not extensible.
        key.__internalValueSlot = value;
      }
      return realMapSet.apply(this, arguments);
    };
    React = require('react');
    ReactNoop = require('react-noop-renderer');
    try {
      triggerCodePathThatUsesFibersAsMapKeys();
    } finally {
      // eslint-disable-next-line no-extend-native
      Map.prototype.set = realMapSet;
    }
    // If we got this far, our feature detection worked.
    // We knew that Map#set() throws for non-extensible objects,
    // so we didn't set them as non-extensible for that reason.
  });
});
