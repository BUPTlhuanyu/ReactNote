##  概述，背景  
2-1、创建container对应的root分析了legacyRenderSubtreeIntoContainer的第一步：创建container对应的root。本文介绍第二步：创建root下的fiber树并开始初始调度。


```
legacyRenderSubtreeIntoContainer在创建完container对应的root(root.current为该container对应的fiber)之后,会执行如下代码:
DOMRenderer.unbatchedUpdates(() => {
  if (parentComponent != null) {
    root.legacy_renderSubtreeIntoContainer(
      parentComponent,
      children,
      callback,
    );
  } else {
    root.render(children, callback);
  }
});
```


此处DOMRenderer.unbatchedUpdates其实就是直接执行传入的函数，传入的函数会调用root.render(children, callback)，unbatchedUpdates代码如下：

```
//isBatchingUpdates: 正在批处理更新任务
//isUnbatchingUpdates: 正在解除批处理更新任务
function unbatchedUpdates<A, R>(fn: (a: A) => R, a: A): R {
  if (isBatchingUpdates && !isUnbatchingUpdates) {
    isUnbatchingUpdates = true;
    try {
      return fn(a);
    } finally {
      isUnbatchingUpdates = false;
    }
  }
  return fn(a);
}
```



这里的root.render其实就是ReactRoot.prototype.render， 因为

```
root = legacyCreateRootFromDOMContainer(
  container,
  forceHydrate,
);
```

legacyCreateRootFromDOMContainer返回ReactRoot实例赋值给root
因此root.render即ReactRoot原型对象上的render方法。

ReactRoot.prototype.render代码如下：

```
ReactRoot.prototype.render = function(
  children: ReactNodeList,
  callback: ?() => mixed,
): Work {
  const root = this._internalRoot;
  const work = new ReactWork();
  callback = callback === undefined ? null : callback;
  if (__DEV__) {
    warnOnInvalidCallback(callback, 'render');
  }
  if (callback !== null) {
    work.then(callback);
  }
  //开始构建fiber树
  DOMRenderer.updateContainer(children, root, null, work._onCommit);
  //最终返回实例work
  return work;
};
```


可见执行container对应的root上render函数会创建一个ReactWork实例，并调用DOMRenderer.updateContainer更新container并构建fiber树，最后返回一个work实例用于其他调度。

先给出ReactWork代码：

```
//给实例添加属性
function ReactWork() {
  this._callbacks = null;
  this._didCommit = false;
  // TODO: Avoid need to bind by replacing callbacks in the update queue with
  // list of Work objects.
  this._onCommit = this._onCommit.bind(this);
}
```
接下来分析，DOMRenderer.updateContainer如何构建子组件的fiber树。


##  构建子组件的fiber树   
通过container对应root元素的render方法，调用updateContainer开始构建fiber树。
DOMRenderer.updateContainer(children, root, null, work._onCommit);


给出updateContainer代码：

```
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): ExpirationTime {
  //  container.current为container对应的fiber对象
  const current = container.current;
  //通过当前时间计算出一个到期时间返回并存入currentTime
  const currentTime = requestCurrentTime();
  //为fiber计算到期时间
  const expirationTime = computeExpirationForFiber(currentTime, current);
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    callback,
  );
}
```


上述代码中，会调用computeExpirationForFiber计算container对应的fiber的到期时间，然后调用updateContainerAtExpirationTime，在updateContainerAtExpirationTime函数中会对debugTool、context进行处理以及调用scheduleRootUpdate开始更新container，构建fiber树。updateContainerAtExpirationTime代码如下：

```
export function updateContainerAtExpirationTime(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  expirationTime: ExpirationTime,
  callback: ?Function,
) {
  // TODO: If this is a nested container, this won't be the root.
  const current = container.current;

  if (__DEV__) {
    //开发环境下如果存在debugTool,根据条件执行onMountContainer，onUnmountContainer，onUpdateContainer
    if (ReactFiberInstrumentation.debugTool) {
      if (current.alternate === null) {
        ReactFiberInstrumentation.debugTool.onMountContainer(container);
      } else if (element === null) {
        ReactFiberInstrumentation.debugTool.onUnmountContainer(container);
      } else {
        ReactFiberInstrumentation.debugTool.onUpdateContainer(container);
      }
    }
  }

  const context = getContextForSubtree(parentComponent);
  //初始状态下，container.context = {}
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }
  //开始调度root的更新
  return scheduleRootUpdate(current, element, expirationTime, callback);
}
```


真正的开始调度root的更新的函数为scheduleRootUpdate，下面接着分析。





##  调度函数scheduleRootUpdate  

```
scheduleRootUpdate：
    const update = createUpdate(expirationTime);
    update.payload = {element};
    flushPassiveEffects()
    enqueueUpdate(current, update)
    scheduleWork(current, expirationTime)
    return expirationTime
```


#### step1：createUpdate：创建更新器

```
//传入一个到期时间，返回一个对象
export function createUpdate(expirationTime: ExpirationTime): Update<*> {
  return {
    expirationTime: expirationTime,//到期时间

    tag: UpdateState,//对于state的处理类型为更新state
    payload: null,//载荷，◔ ‸◔?
    callback: null,

    next: null,
    nextEffect: null,
  };
}
```


#### step2：将需要挂载到container上的element传入update对象的payload属性上：

```
update.payload = {element};
```


#### step3：flushPassiveEffects

```
// ◔ ‸◔?
function flushPassiveEffects() {
  if (passiveEffectCallback !== null) {
    Schedule_cancelCallback(passiveEffectCallbackHandle);
    // We call the scheduled callback instead of commitPassiveEffects directly
    // to ensure tracing works correctly.
    passiveEffectCallback();
  }
}
```


#### step4：enqueueUpdate

由于初始化过程中，只有一个container的fiber对象并且没有更新队列，所以首先需要调用createUpdateQueue创建更新队列。然后调用appendUpdateToQueue将update对象添加到刚创建的container的更新队列（一个双向循环链表）的末尾。

```
export function enqueueUpdate<State>(fiber: Fiber, update: Update<State>) {
  // Update queues are created lazily.
  const alternate = fiber.alternate;
  let queue1;
  queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
  appendUpdateToQueue(queue1, update);
}

createUpdateQueue为：
export function createUpdateQueue<State>(baseState: State): UpdateQueue<State> {
  const queue: UpdateQueue<State> = {
    baseState,
    firstUpdate: null,
    lastUpdate: null,
    firstCapturedUpdate: null,
    lastCapturedUpdate: null,
    firstEffect: null,
    lastEffect: null,
    firstCapturedEffect: null,
    lastCapturedEffect: null,
  };
  return queue;
}

appendUpdateToQueue为：
function appendUpdateToQueue<State>(
  queue: UpdateQueue<State>,
  update: Update<State>,
) {
  // Append the update to the end of the list.
  if (queue.lastUpdate === null) {
    // Queue is empty
    queue.firstUpdate = queue.lastUpdate = update;
  } else {
    queue.lastUpdate.next = update;
    queue.lastUpdate = update;
  }
}
```



#### step5：scheduleWork

初始状态下，对hostroot而言，只会更新fiber的到期时间，并返回root = fiber.stateNode，这里是开始了正式的调度阶段，scheduleWork是一个公用的调度入口，不管是更新还是初始化都需要该方法进行正式的调度。接下来的第三章将会分析该调度工具。
