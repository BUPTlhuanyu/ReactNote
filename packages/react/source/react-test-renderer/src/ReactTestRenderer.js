/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {Fiber} from 'react-reconciler/src/ReactFiber';
import type {FiberRoot} from 'react-reconciler/src/ReactFiberRoot';
import type {Instance, TextInstance} from './ReactTestHostConfig';

import * as TestRenderer from 'react-reconciler/inline.test';
import {batchedUpdates} from 'events/ReactGenericBatching';
import {findCurrentFiberUsingSlowPath} from 'react-reconciler/reflection';
import {
  Fragment,
  FunctionComponent,
  ClassComponent,
  HostComponent,
  HostPortal,
  HostText,
  HostRoot,
  ContextConsumer,
  ContextProvider,
  Mode,
  ForwardRef,
  Profiler,
  MemoComponent,
  SimpleMemoComponent,
  IncompleteClassComponent,
} from 'shared/ReactWorkTags';
import invariant from 'shared/invariant';
import ReactVersion from 'shared/ReactVersion';

import * as ReactTestHostConfig from './ReactTestHostConfig';
import * as TestRendererScheduling from './ReactTestRendererScheduling';

type TestRendererOptions = {
  createNodeMock: (element: React$Element<any>) => any,
  unstable_isConcurrent: boolean,
};

type ReactTestRendererJSON = {|
  type: string,
  props: {[propName: string]: any},
  children: null | Array<ReactTestRendererNode>,
  $$typeof?: Symbol, // Optional because we add it with defineProperty().
|};
type ReactTestRendererNode = ReactTestRendererJSON | string;

type FindOptions = $Shape<{
  // performs a "greedy" search: if a matching node is found, will continue
  // to search within the matching node's children. (default: true)
  deep: boolean,
}>;

export type Predicate = (node: ReactTestInstance) => ?boolean;

const defaultTestOptions = {
  createNodeMock: function() {
    return null;
  },
};

function toJSON(inst: Instance | TextInstance): ReactTestRendererNode | null {
  if (inst.isHidden) {
    // Omit timed out children from output entirely. This seems like the least
    // surprising behavior. We could perhaps add a separate API that includes
    // them, if it turns out people need it.
    return null;
  }
  switch (inst.tag) {
    case 'TEXT':
      return inst.text;
    case 'INSTANCE': {
      /* eslint-disable no-unused-vars */
      // We don't include the `children` prop in JSON.
      // Instead, we will include the actual rendered children.
      const {children, ...props} = inst.props;
      /* eslint-enable */
      let renderedChildren = null;
      if (inst.children && inst.children.length) {
        for (let i = 0; i < inst.children.length; i++) {
          const renderedChild = toJSON(inst.children[i]);
          if (renderedChild !== null) {
            if (renderedChildren === null) {
              renderedChildren = [renderedChild];
            } else {
              renderedChildren.push(renderedChild);
            }
          }
        }
      }
      const json: ReactTestRendererJSON = {
        type: inst.type,
        props: props,
        children: renderedChildren,
      };
      Object.defineProperty(json, '$$typeof', {
        value: Symbol.for('react.test.json'),
      });
      return json;
    }
    default:
      throw new Error(`Unexpected node type in toJSON: ${inst.tag}`);
  }
}

function childrenToTree(node) {
  if (!node) {
    return null;
  }
  const children = nodeAndSiblingsArray(node);
  if (children.length === 0) {
    return null;
  } else if (children.length === 1) {
    return toTree(children[0]);
  }
  return flatten(children.map(toTree));
}

function nodeAndSiblingsArray(nodeWithSibling) {
  const array = [];
  let node = nodeWithSibling;
  while (node != null) {
    array.push(node);
    node = node.sibling;
  }
  return array;
}

function flatten(arr) {
  const result = [];
  const stack = [{i: 0, array: arr}];
  while (stack.length) {
    const n = stack.pop();
    while (n.i < n.array.length) {
      const el = n.array[n.i];
      n.i += 1;
      if (Array.isArray(el)) {
        stack.push(n);
        stack.push({i: 0, array: el});
        break;
      }
      result.push(el);
    }
  }
  return result;
}

function toTree(node: ?Fiber) {
  if (node == null) {
    return null;
  }
  switch (node.tag) {
    case HostRoot:
      return childrenToTree(node.child);
    case HostPortal:
      return childrenToTree(node.child);
    case ClassComponent:
      return {
        nodeType: 'component',
        type: node.type,
        props: {...node.memoizedProps},
        instance: node.stateNode,
        rendered: childrenToTree(node.child),
      };
    case FunctionComponent:
    case SimpleMemoComponent:
      return {
        nodeType: 'component',
        type: node.type,
        props: {...node.memoizedProps},
        instance: null,
        rendered: childrenToTree(node.child),
      };
    case HostComponent: {
      return {
        nodeType: 'host',
        type: node.type,
        props: {...node.memoizedProps},
        instance: null, // TODO: use createNodeMock here somehow?
        rendered: flatten(nodeAndSiblingsArray(node.child).map(toTree)),
      };
    }
    case HostText:
      return node.stateNode.text;
    case Fragment:
    case ContextProvider:
    case ContextConsumer:
    case Mode:
    case Profiler:
    case ForwardRef:
    case MemoComponent:
    case IncompleteClassComponent:
      return childrenToTree(node.child);
    default:
      invariant(
        false,
        'toTree() does not yet know how to handle nodes with tag=%s',
        node.tag,
      );
  }
}

const validWrapperTypes = new Set([
  FunctionComponent,
  ClassComponent,
  HostComponent,
  ForwardRef,
  MemoComponent,
  SimpleMemoComponent,
  // Normally skipped, but used when there's more than one root child.
  HostRoot,
]);

function getChildren(parent: Fiber) {
  const children = [];
  const startingNode = parent;
  let node: Fiber = startingNode;
  if (node.child === null) {
    return children;
  }
  node.child.return = node;
  node = node.child;
  outer: while (true) {
    let descend = false;
    if (validWrapperTypes.has(node.tag)) {
      children.push(wrapFiber(node));
    } else if (node.tag === HostText) {
      children.push('' + node.memoizedProps);
    } else {
      descend = true;
    }
    if (descend && node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }
    while (node.sibling === null) {
      if (node.return === startingNode) {
        break outer;
      }
      node = (node.return: any);
    }
    (node.sibling: any).return = node.return;
    node = (node.sibling: any);
  }
  return children;
}

class ReactTestInstance {
  _fiber: Fiber;

  _currentFiber(): Fiber {
    // Throws if this component has been unmounted.
    const fiber = findCurrentFiberUsingSlowPath(this._fiber);
    invariant(
      fiber !== null,
      "Can't read from currently-mounting component. This error is likely " +
        'caused by a bug in React. Please file an issue.',
    );
    return fiber;
  }

  constructor(fiber: Fiber) {
    invariant(
      validWrapperTypes.has(fiber.tag),
      'Unexpected object passed to ReactTestInstance constructor (tag: %s). ' +
        'This is probably a bug in React.',
      fiber.tag,
    );
    this._fiber = fiber;
  }

  get instance() {
    if (this._fiber.tag === HostComponent) {
      return ReactTestHostConfig.getPublicInstance(this._fiber.stateNode);
    } else {
      return this._fiber.stateNode;
    }
  }

  get type() {
    return this._fiber.type;
  }

  get props(): Object {
    return this._currentFiber().memoizedProps;
  }

  get parent(): ?ReactTestInstance {
    let parent = this._fiber.return;
    while (parent !== null) {
      if (validWrapperTypes.has(parent.tag)) {
        if (parent.tag === HostRoot) {
          // Special case: we only "materialize" instances for roots
          // if they have more than a single child. So we'll check that now.
          if (getChildren(parent).length < 2) {
            return null;
          }
        }
        return wrapFiber(parent);
      }
      parent = parent.return;
    }
    return null;
  }

  get children(): Array<ReactTestInstance | string> {
    return getChildren(this._currentFiber());
  }

  // Custom search functions
  find(predicate: Predicate): ReactTestInstance {
    return expectOne(
      this.findAll(predicate, {deep: false}),
      `matching custom predicate: ${predicate.toString()}`,
    );
  }

  findByType(type: any): ReactTestInstance {
    return expectOne(
      this.findAllByType(type, {deep: false}),
      `with node type: "${type.displayName || type.name}"`,
    );
  }

  findByProps(props: Object): ReactTestInstance {
    return expectOne(
      this.findAllByProps(props, {deep: false}),
      `with props: ${JSON.stringify(props)}`,
    );
  }

  findAll(
    predicate: Predicate,
    options: ?FindOptions = null,
  ): Array<ReactTestInstance> {
    return findAll(this, predicate, options);
  }

  findAllByType(
    type: any,
    options: ?FindOptions = null,
  ): Array<ReactTestInstance> {
    return findAll(this, node => node.type === type, options);
  }

  findAllByProps(
    props: Object,
    options: ?FindOptions = null,
  ): Array<ReactTestInstance> {
    return findAll(
      this,
      node => node.props && propsMatch(node.props, props),
      options,
    );
  }
}

function findAll(
  root: ReactTestInstance,
  predicate: Predicate,
  options: ?FindOptions,
): Array<ReactTestInstance> {
  const deep = options ? options.deep : true;
  const results = [];

  if (predicate(root)) {
    results.push(root);
    if (!deep) {
      return results;
    }
  }

  root.children.forEach(child => {
    if (typeof child === 'string') {
      return;
    }
    results.push(...findAll(child, predicate, options));
  });

  return results;
}

function expectOne(
  all: Array<ReactTestInstance>,
  message: string,
): ReactTestInstance {
  if (all.length === 1) {
    return all[0];
  }

  const prefix =
    all.length === 0
      ? 'No instances found '
      : `Expected 1 but found ${all.length} instances `;

  throw new Error(prefix + message);
}

function propsMatch(props: Object, filter: Object): boolean {
  for (const key in filter) {
    if (props[key] !== filter[key]) {
      return false;
    }
  }
  return true;
}

const ReactTestRendererFiber = {
  create(element: React$Element<any>, options: TestRendererOptions) {
    let createNodeMock = defaultTestOptions.createNodeMock;
    let isConcurrent = false;
    if (typeof options === 'object' && options !== null) {
      if (typeof options.createNodeMock === 'function') {
        createNodeMock = options.createNodeMock;
      }
      if (options.unstable_isConcurrent === true) {
        isConcurrent = true;
      }
    }
    let container = {
      children: [],
      createNodeMock,
      tag: 'CONTAINER',
    };
    let root: FiberRoot | null = TestRenderer.createContainer(
      container,
      isConcurrent,
      false,
    );
    invariant(root != null, 'something went wrong');
    TestRenderer.updateContainer(element, root, null, null);

    const entry = {
      root: undefined, // makes flow happy
      // we define a 'getter' for 'root' below using 'Object.defineProperty'
      toJSON(): Array<ReactTestRendererNode> | ReactTestRendererNode | null {
        if (root == null || root.current == null || container == null) {
          return null;
        }
        if (container.children.length === 0) {
          return null;
        }
        if (container.children.length === 1) {
          return toJSON(container.children[0]);
        }

        let renderedChildren = null;
        if (container.children && container.children.length) {
          for (let i = 0; i < container.children.length; i++) {
            const renderedChild = toJSON(container.children[i]);
            if (renderedChild !== null) {
              if (renderedChildren === null) {
                renderedChildren = [renderedChild];
              } else {
                renderedChildren.push(renderedChild);
              }
            }
          }
        }
        return renderedChildren;
      },
      toTree() {
        if (root == null || root.current == null) {
          return null;
        }
        return toTree(root.current);
      },
      update(newElement: React$Element<any>) {
        if (root == null || root.current == null) {
          return;
        }
        TestRenderer.updateContainer(newElement, root, null, null);
      },
      unmount() {
        if (root == null || root.current == null) {
          return;
        }
        TestRenderer.updateContainer(null, root, null, null);
        container = null;
        root = null;
      },
      getInstance() {
        if (root == null || root.current == null) {
          return null;
        }
        return TestRenderer.getPublicRootInstance(root);
      },

      unstable_flushAll: TestRendererScheduling.flushAll,
      unstable_flushSync<T>(fn: () => T): T {
        TestRendererScheduling.clearYields();
        return TestRenderer.flushSync(fn);
      },
      unstable_flushNumberOfYields: TestRendererScheduling.flushNumberOfYields,
      unstable_clearYields: TestRendererScheduling.clearYields,
    };

    Object.defineProperty(
      entry,
      'root',
      ({
        configurable: true,
        enumerable: true,
        get: function() {
          if (root === null) {
            throw new Error("Can't access .root on unmounted test renderer");
          }
          const children = getChildren(root.current);
          if (children.length === 0) {
            throw new Error("Can't access .root on unmounted test renderer");
          } else if (children.length === 1) {
            // Normally, we skip the root and just give you the child.
            return children[0];
          } else {
            // However, we give you the root if there's more than one root child.
            // We could make this the behavior for all cases but it would be a breaking change.
            return wrapFiber(root.current);
          }
        },
      }: Object),
    );

    return entry;
  },

  unstable_yield: TestRendererScheduling.yieldValue,
  unstable_clearYields: TestRendererScheduling.clearYields,

  /* eslint-disable camelcase */
  unstable_batchedUpdates: batchedUpdates,
  /* eslint-enable camelcase */

  unstable_setNowImplementation: TestRendererScheduling.setNowImplementation,
};

const fiberToWrapper = new WeakMap();
function wrapFiber(fiber: Fiber): ReactTestInstance {
  let wrapper = fiberToWrapper.get(fiber);
  if (wrapper === undefined && fiber.alternate !== null) {
    wrapper = fiberToWrapper.get(fiber.alternate);
  }
  if (wrapper === undefined) {
    wrapper = new ReactTestInstance(fiber);
    fiberToWrapper.set(fiber, wrapper);
  }
  return wrapper;
}

// Enable ReactTestRenderer to be used to test DevTools integration.
TestRenderer.injectIntoDevTools({
  findFiberByHostInstance: (() => {
    throw new Error('TestRenderer does not support findFiberByHostInstance()');
  }: any),
  bundleType: __DEV__ ? 1 : 0,
  version: ReactVersion,
  rendererPackageName: 'react-test-renderer',
});

export default ReactTestRendererFiber;
