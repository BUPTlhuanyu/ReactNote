/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */

import lowPriorityWarning from 'shared/lowPriorityWarning';
import isValidElementType from 'shared/isValidElementType';
import getComponentName from 'shared/getComponentName';
import {
  getIteratorFn,
  REACT_FORWARD_REF_TYPE,
  REACT_FRAGMENT_TYPE,
  REACT_ELEMENT_TYPE,
} from 'shared/ReactSymbols';
import checkPropTypes from 'prop-types/checkPropTypes';
import warning from 'shared/warning';
import warningWithoutStack from 'shared/warningWithoutStack';

import ReactCurrentOwner from './ReactCurrentOwner';
import {isValidElement, createElement, cloneElement} from './ReactElement';
import ReactDebugCurrentFrame, {
  setCurrentlyValidatingElement,
} from './ReactDebugCurrentFrame';

let propTypesMisspellWarningShown;

if (__DEV__) {
  propTypesMisspellWarningShown = false;
}

//返回字符串，内容为：检查ReactCurrentOwner.current.type上的render方法
function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    const name = getComponentName(ReactCurrentOwner.current.type);
    if (name) {
      return '\n\nCheck the render method of `' + name + '`.';
    }
  }
  return '';
}

//返回字符串，内容为：检查某个文件下的某一行代码
function getSourceInfoErrorAddendum(elementProps) {
  if (
    elementProps !== null &&
    elementProps !== undefined &&
    elementProps.__source !== undefined
  ) {
    const source = elementProps.__source;
    const fileName = source.fileName.replace(/^.*[\\\/]/, '');
    const lineNumber = source.lineNumber;
    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
  }
  return '';
}

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
const ownerHasKeyUseWarning = {};

// 错误提示，在ReactCurrentOwner.current不存在的时候，提示检查parentType上的render
function getCurrentComponentErrorInfo(parentType) {
  let info = getDeclarationErrorAddendum();

  if (!info) {
    const parentName =
      typeof parentType === 'string'
        ? parentType
        : parentType.displayName || parentType.name;
    if (parentName) {
      info = `\n\nCheck the top-level render call using <${parentName}>.`;
    }
  }
  return info;
}

/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */
  //对传入的组件是否具有key进行错误处理
function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }
  element._store.validated = true;

  const currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
    return;
  }
  ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  let childOwner = '';
  if (
    element &&
    element._owner &&
    element._owner !== ReactCurrentOwner.current
  ) {
    // Give the component that originally created this child.
    childOwner = ` It was passed a child from ${getComponentName(
      element._owner.type,
    )}.`;
  }

  setCurrentlyValidatingElement(element);
  if (__DEV__) {
    warning(
      false,
      'Each child in an array or iterator should have a unique "key" prop.' +
        '%s%s See https://fb.me/react-warning-keys for more information.',
      currentComponentErrorInfo,
      childOwner,
    );
  }
  setCurrentlyValidatingElement(null);
}

/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */
//对传入的node中的每个element判断是否存在key
function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const child = node[i];
      if (isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    const iteratorFn = getIteratorFn(node);
    if (typeof iteratorFn === 'function') {
      // Entry iterators used to provide implicit keys,
      // but now we print a separate warning for them later.
      if (iteratorFn !== node.entries) {
        const iterator = iteratorFn.call(node);
        let step;
        while (!(step = iterator.next()).done) {
          if (isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}

/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */

//检查propTypes的否大小写正确，类组件或者函数组件设置默认prop只能用defaultProps
// getDefaultProps只能用于React.createClass中
function validatePropTypes(element) {
  const type = element.type;
  let name, propTypes;
  if (typeof type === 'function') {
    // Class or function component
    name = type.displayName || type.name;
    propTypes = type.propTypes;
  } else if (
    typeof type === 'object' &&
    type !== null &&
    type.$$typeof === REACT_FORWARD_REF_TYPE
  ) {
    // ForwardRef
    const functionName = type.render.displayName || type.render.name || '';
    name =
      type.displayName ||
      (functionName !== '' ? `ForwardRef(${functionName})` : 'ForwardRef');
    propTypes = type.propTypes;
  } else {
    return;
  }
  if (propTypes) {
    setCurrentlyValidatingElement(element);
    checkPropTypes(
      propTypes,
      element.props,
      'prop',
      name,
      ReactDebugCurrentFrame.getStackAddendum,
    );
    setCurrentlyValidatingElement(null);
  } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
    propTypesMisspellWarningShown = true;
    warningWithoutStack(
      false,
      'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?',
      name || 'Unknown',
    );
  }
  if (typeof type.getDefaultProps === 'function') {
    warningWithoutStack(
      type.getDefaultProps.isReactClassApproved,
      'getDefaultProps is only used on classic React.createClass ' +
        'definitions. Use a static property named `defaultProps` instead.',
    );
  }
}

/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */
// React.Fragment 也是通过createElement创建的
// React.Fragment 只能有key和children作为其属性
// React.Fragment 特别注意不能传入ref作为其属性，因为React.Fragment不会渲染成一个真实的DOM，自然不会允许有ref
// <React.Fragment key111="Fragment 只能有key和children作为其props属性"
//
// children111="Fragment 只能有key和children作为其props属性"
// ref={{"some":"Fragment 也不能使用ref获取引用"}}
// key="允许的"
// children="允许的,貌似没什么用，根本用不了，真实的children就是React.Fragment包裹的内容"
//     >
//     Some text.
// <h2>A heading</h2>
// </React.Fragment>
function validateFragmentProps(fragment) {
  setCurrentlyValidatingElement(fragment);

  const keys = Object.keys(fragment.props);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    //由于在开发环境下，React.Fragment的props中存在key与ref，但是获取到得值为undefined
    if (key !== 'children' && key !== 'key') {
      warning(
        false,
        'Invalid prop `%s` supplied to `React.Fragment`. ' +
          'React.Fragment can only have `key` and `children` props.',
        key,
      );
      break;
    }
  }

  if (fragment.ref !== null) {
    warning(false, 'Invalid attribute `ref` supplied to `React.Fragment`.');
  }

  setCurrentlyValidatingElement(null);
}

// 先检查传入的type是否是合法的element类型，见isValidElementType，如果不是抛出错误
// 如果是则将type, props, children等参数传入createElement生成对应的react元素
// 然后调用validateChildKeys对参数children的每个element判断是否存在key
// 接着，如果type类型是REACT_FRAGMENT_TYPE，调用validateFragmentProps检查Fragment上的属性（这里函数名为props不妥，key与ref
// 不算是props中的，attributes比较好）
// 其他type类型的元素的props的规则一致。
export function createElementWithValidation(type, props, children) {
  const validType = isValidElementType(type);

  // We warn in this case but don't throw. We expect the element creation to
  // succeed and there will likely be errors in render.
  if (!validType) {
    let info = '';
    if (
      type === undefined ||
      (typeof type === 'object' &&
        type !== null &&
        Object.keys(type).length === 0)
    ) {
      info +=
        ' You likely forgot to export your component from the file ' +
        "it's defined in, or you might have mixed up default and named imports.";
    }

    const sourceInfo = getSourceInfoErrorAddendum(props);
    if (sourceInfo) {
      info += sourceInfo;
    } else {
      info += getDeclarationErrorAddendum();
    }

    let typeString;
    if (type === null) {
      typeString = 'null';
    } else if (Array.isArray(type)) {
      typeString = 'array';
    } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
      typeString = `<${getComponentName(type.type) || 'Unknown'} />`;
      info =
        ' Did you accidentally export a JSX literal instead of a component?';
    } else {
      typeString = typeof type;
    }

    warning(
      false,
      'React.createElement: type is invalid -- expected a string (for ' +
        'built-in components) or a class/function (for composite ' +
        'components) but got: %s.%s',
      typeString,
      info,
    );
  }

  const element = createElement.apply(this, arguments);

  // The result can be nullish if a mock or a custom function is used.
  // TODO: Drop this when these are no longer allowed as the type argument.
  if (element == null) {
    return element;
  }

  // Skip key warning if the type isn't valid since our key validation logic
  // doesn't expect a non-string/function type and can throw confusing errors.
  // We don't want exception behavior to differ between dev and prod.
  // (Rendering will throw with a helpful message and as soon as the type is
  // fixed, the key warnings will appear.)
  if (validType) {
    for (let i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }
  }

  if (type === REACT_FRAGMENT_TYPE) {
    validateFragmentProps(element);
  } else {
    validatePropTypes(element);
  }

  return element;
}

export function createFactoryWithValidation(type) {
  const validatedFactory = createElementWithValidation.bind(null, type);
  validatedFactory.type = type;
  // Legacy hook: remove it
  if (__DEV__) {
    Object.defineProperty(validatedFactory, 'type', {
      enumerable: false,
      get: function() {
        lowPriorityWarning(
          false,
          'Factory.type is deprecated. Access the class directly ' +
            'before passing it to createFactory.',
        );
        Object.defineProperty(this, 'type', {
          value: type,
        });
        return type;
      },
    });
  }

  return validatedFactory;
}

//返回一个REACT_ELEMENT_TYPE类型的元素，其type属性值为传入的element
export function cloneElementWithValidation(element, props, children) {
  const newElement = cloneElement.apply(this, arguments);
  for (let i = 2; i < arguments.length; i++) {
    validateChildKeys(arguments[i], newElement.type);
  }
  //newElement为REACT_ELEMENT_TYPE类型，所以不许要判断是否是REACT_FRAGMENT_TYPE类型
  validatePropTypes(newElement);
  return newElement;
}
