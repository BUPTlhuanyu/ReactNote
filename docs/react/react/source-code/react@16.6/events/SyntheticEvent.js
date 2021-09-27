/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint valid-typeof: 0 */

import invariant from 'shared/invariant';
import warningWithoutStack from 'shared/warningWithoutStack';

const EVENT_POOL_SIZE = 10;

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
const EventInterface = {
  type: null,
  target: null,
  // currentTarget is set when dispatching; no use in copying it here
  currentTarget: function() {
    return null;
  },
  eventPhase: null,
  bubbles: null,
  cancelable: null,
  timeStamp: function(event) {
    return event.timeStamp || Date.now();
  },
  defaultPrevented: null,
  isTrusted: null,
};

function functionThatReturnsTrue() {
  return true;
}

function functionThatReturnsFalse() {
  return false;
}

/**
 * Synthetic events are dispatched by event plugins, typically in response to a
 * top-level event delegation handler.
 *
 * These systems should generally use pooling to reduce the frequency of garbage
 * collection. The system should check `isPersistent` to determine whether the
 * event should be released into the pool after being dispatched. Users that
 * need a persisted event should invoke `persist`.
 *
 * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
 * normalizing browser quirks. Subclasses do not necessarily have to implement a
 * DOM interface; custom application-specific events can also subclass this.
 *
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {*} targetInst Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @param {DOMEventTarget} nativeEventTarget Target node.
 */
function SyntheticEvent(
  dispatchConfig,
  targetInst,
  nativeEvent,
  nativeEventTarget,
) {
  if (__DEV__) {
    // these have a getter/setter for warnings
    delete this.nativeEvent;
    delete this.preventDefault;
    delete this.stopPropagation;
    delete this.isDefaultPrevented;
    delete this.isPropagationStopped;
  }

  this.dispatchConfig = dispatchConfig;
  this._targetInst = targetInst;
  this.nativeEvent = nativeEvent;

  // 1. 将原生对象的一些属性值放置到SyntheticEvent实例对象上相同属性名称上；
  // 2. 将原生对象通过自定义的一些函数处理之后将结果保存到SyntheticEvent实例对象上的某些属性上，比如做一些兼容处理，降级处理等等
  const Interface = this.constructor.Interface;
  for (const propName in Interface) {
    if (!Interface.hasOwnProperty(propName)) {
      continue;
    }
    if (__DEV__) {
      delete this[propName]; // this has a getter/setter for warnings
    }
    // normalize为EventInterface对象上自身的属性值
    const normalize = Interface[propName];
    if (normalize) {
      //如果这个自身属性值不是null则是一个函数，因此将原生事件作为参数传入，并返回结果给对应属性
      //  用于设置curreTarget与相关的时间
      this[propName] = normalize(nativeEvent);
    } else {
      if (propName === 'target') {
        //如果自身属性是'target',则将原生事件对应的DOM存储在合成事件的target属性上
        this.target = nativeEventTarget;
      } else {
        // 将原生事件的一些属性值设置到实例对象上相同名称的属性上
        this[propName] = nativeEvent[propName];
      }
    }
  }

  const defaultPrevented =
    nativeEvent.defaultPrevented != null
      ? nativeEvent.defaultPrevented
      : nativeEvent.returnValue === false;
  if (defaultPrevented) {
    this.isDefaultPrevented = functionThatReturnsTrue;
  } else {
    this.isDefaultPrevented = functionThatReturnsFalse;
  }
  this.isPropagationStopped = functionThatReturnsFalse;
  return this;
}

Object.assign(SyntheticEvent.prototype, {
  preventDefault: function() {
    this.defaultPrevented = true;
    const event = this.nativeEvent;
    if (!event) {
      return;
    }

    if (event.preventDefault) {
      event.preventDefault();
    } else if (typeof event.returnValue !== 'unknown') {
      event.returnValue = false;
    }
    this.isDefaultPrevented = functionThatReturnsTrue;
  },

  stopPropagation: function() {
    const event = this.nativeEvent;
    if (!event) {
      return;
    }

    if (event.stopPropagation) {
      event.stopPropagation();
    } else if (typeof event.cancelBubble !== 'unknown') {
      // The ChangeEventPlugin registers a "propertychange" event for
      // IE. This event does not support bubbling or cancelling, and
      // any references to cancelBubble throw "Member not found".  A
      // typeof check of "unknown" circumvents this issue (and is also
      // IE specific).
      event.cancelBubble = true;
    }

    this.isPropagationStopped = functionThatReturnsTrue;
  },

  /**
   * We release all dispatched `SyntheticEvent`s after each event loop, adding
   * them back into the pool. This allows a way to hold onto a reference that
   * won't be added back into the pool.
   */
  persist: function() {
    this.isPersistent = functionThatReturnsTrue;
  },

  /**
   * Checks if this event should be released back into the pool.
   *
   * @return {boolean} True if this should not be released, false otherwise.
   */
  isPersistent: functionThatReturnsFalse,

  /**
   * `PooledClass` looks for `destructor` on each instance it releases.
   */
  // 清除该合成事件对象上的所有属性
  destructor: function() {
    const Interface = this.constructor.Interface;
    for (const propName in Interface) {
      if (__DEV__) {
        Object.defineProperty(
          this,
          propName,
          getPooledWarningPropertyDefinition(propName, Interface[propName]),
        );
      } else {
        this[propName] = null;
      }
    }
    this.dispatchConfig = null;
    this._targetInst = null;
    this.nativeEvent = null;
    this.isDefaultPrevented = functionThatReturnsFalse;
    this.isPropagationStopped = functionThatReturnsFalse;
    this._dispatchListeners = null;
    this._dispatchInstances = null;
    if (__DEV__) {
      Object.defineProperty(
        this,
        'nativeEvent',
        getPooledWarningPropertyDefinition('nativeEvent', null),
      );
      Object.defineProperty(
        this,
        'isDefaultPrevented',
        getPooledWarningPropertyDefinition(
          'isDefaultPrevented',
          functionThatReturnsFalse,
        ),
      );
      Object.defineProperty(
        this,
        'isPropagationStopped',
        getPooledWarningPropertyDefinition(
          'isPropagationStopped',
          functionThatReturnsFalse,
        ),
      );
      Object.defineProperty(
        this,
        'preventDefault',
        getPooledWarningPropertyDefinition('preventDefault', () => {}),
      );
      Object.defineProperty(
        this,
        'stopPropagation',
        getPooledWarningPropertyDefinition('stopPropagation', () => {}),
      );
    }
  },
});

SyntheticEvent.Interface = EventInterface;

/**
 * Helper to reduce boilerplate when creating subclasses.
 */
SyntheticEvent.extend = function(Interface) {
  // SyntheticEvent.extend() 执行的时候 Super 就是这个 SyntheticEvent
  const Super = this;

  // 构造子类的原型对象
  const E = function() {};
  E.prototype = Super.prototype;
  const prototype = new E();

  // 设置原型对象以及设置构造函数
  function Class() {
    return Super.apply(this, arguments);
  }
  Object.assign(prototype, Class.prototype);
  Class.prototype = prototype;
  Class.prototype.constructor = Class;

  // 添加静态方法，扩展Interface属性
  Class.Interface = Object.assign({}, Super.Interface, Interface);
  Class.extend = Super.extend;
  addEventPoolingTo(Class);

  return Class;
};

addEventPoolingTo(SyntheticEvent);

/**
 * Helper to nullify syntheticEvent instance properties when destructing
 *
 * @param {String} propName
 * @param {?object} getVal
 * @return {object} defineProperty object
 */
function getPooledWarningPropertyDefinition(propName, getVal) {
  const isFunction = typeof getVal === 'function';
  return {
    configurable: true,
    set: set,
    get: get,
  };

  function set(val) {
    const action = isFunction ? 'setting the method' : 'setting the property';
    warn(action, 'This is effectively a no-op');
    return val;
  }

  function get() {
    const action = isFunction
      ? 'accessing the method'
      : 'accessing the property';
    const result = isFunction
      ? 'This is a no-op function'
      : 'This is set to null';
    warn(action, result);
    return getVal;
  }

  function warn(action, result) {
    const warningCondition = false;
    warningWithoutStack(
      warningCondition,
      "This synthetic event is reused for performance reasons. If you're seeing this, " +
        "you're %s `%s` on a released/nullified synthetic event. %s. " +
        'If you must keep the original synthetic event around, use event.persist(). ' +
        'See https://fb.me/react-event-pooling for more information.',
      action,
      propName,
      result,
    );
  }
}
/**
 * 从事件池中获取一个空的合成事件对象，并设将入参设置到事件对象对应的属性上
 * 如果事件池为空则利用入参创建一个新的合成事件对象
 * @param {*} dispatchConfig 
 * @param {*} targetInst 
 * @param {*} nativeEvent 
 * @param {*} nativeInst 
 */
function getPooledEvent(dispatchConfig, targetInst, nativeEvent, nativeInst) {
  const EventConstructor = this;
  if (EventConstructor.eventPool.length) {
    const instance = EventConstructor.eventPool.pop();
    EventConstructor.call(
      instance,
      dispatchConfig,
      targetInst,
      nativeEvent,
      nativeInst,
    );
    return instance;
  }
  return new EventConstructor(
    dispatchConfig,
    targetInst,
    nativeEvent,
    nativeInst,
  );
}
/**
 * 重置event上的属性值，并添加到事件对象池的空余位置
 * @param {*} event 
 */
function releasePooledEvent(event) {
  const EventConstructor = this;
  invariant(
    event instanceof EventConstructor,
    'Trying to release an event instance into a pool of a different type.',
  );
  //重置合成事件对象实例
  event.destructor();
  //如果对象池还有空闲位置，添加到其中
  if (EventConstructor.eventPool.length < EVENT_POOL_SIZE) {
    EventConstructor.eventPool.push(event);
  }
}

function addEventPoolingTo(EventConstructor) {
  EventConstructor.eventPool = [];
  EventConstructor.getPooled = getPooledEvent;
  EventConstructor.release = releasePooledEvent;
}

export default SyntheticEvent;
