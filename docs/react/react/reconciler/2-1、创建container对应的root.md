---
id: container-root
sidebar_label: 创建container对应的root
slug: '/react/react/reconciler/container-root'
sidebar_position: 1
title: ''
---

#### 创建container对应的root流程简述
流程图具体的请看[2-0、ReactDOM.render流程概览](http://note.youdao.com/noteshare?id=5e12da11b23563c692013814b0054267&sub=F7BD738C7A944112855BD0F9B1AF5BD0)
```
--> 1. 调用legacyCreateRootFromDOMContainer 
--> 返回new ReactRoot(利用reconciler中的createContainer根据container创建root，并将root存储在new ReactRoot生产的实例_internalRoot属性上)
--> 2. 在ReactRoot中调用createContainer，将createContainer返回的root设置到ReactRoot实例_internalRoot属性上
--> 3. 在createContainer中调用createFiberRoot(将createHostRootFiber返回的fiber存储到root.current) 
--> 4. 在createFiberRoot中调用createHostRootFiber 
--> 5. 然后createHostRootFiber返回new FiberNode(该函数只会通过tag的不同，返回对应的fiber)
```

>  createFiberRoot 

createFiberRoot返回一个root

```
//执行一次ReactDOM.render，只会创建一个fiberTree，也就是createFiberRoot只会执行一次
//传入一个container节点如：<div id="root"></div>
//创建一个fiber节点uninitializedFiber
//返回一个root，其中root.current = uninitializedFiber
//uninitializedFiber.stateNode = root
//uninitializedFiber与root具有循环引用的关系
export function createFiberRoot(
  containerInfo: any,
  isConcurrent: boolean,
  hydrate: boolean,
): FiberRoot {
  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
  //  创建一个为hostroot类型的未初始化的fiber
  const uninitializedFiber = createHostRootFiber(isConcurrent);
  //利用传入的containerInfo即container对应的DOM元素初始化根节点root
  //  root.current ：DOM元素对应的fiber
  //  containerInfo ： container对应的DOM元素
  let root;
  if (enableSchedulerTracing) {
    root = ({
      current: uninitializedFiber,
      containerInfo: containerInfo,
      pendingChildren: null,

      earliestPendingTime: NoWork,
      latestPendingTime: NoWork,
      earliestSuspendedTime: NoWork,
      latestSuspendedTime: NoWork,
      latestPingedTime: NoWork,

      didError: false,

      pendingCommitExpirationTime: NoWork,
      finishedWork: null,
      timeoutHandle: noTimeout,
      context: null,
      pendingContext: null,
      hydrate,
      nextExpirationTimeToWorkOn: NoWork,
      expirationTime: NoWork,
      firstBatch: null,
      nextScheduledRoot: null,

      interactionThreadID: unstable_getThreadID(),
      memoizedInteractions: new Set(),
      pendingInteractionMap: new Map(),
    }: FiberRoot);
  } else {
    root = ({
      current: uninitializedFiber,
      containerInfo: containerInfo,
      pendingChildren: null,

      earliestPendingTime: NoWork,
      latestPendingTime: NoWork,
      earliestSuspendedTime: NoWork,
      latestSuspendedTime: NoWork,
      latestPingedTime: NoWork,

      didError: false,

      pendingCommitExpirationTime: NoWork,
      finishedWork: null,
      timeoutHandle: noTimeout,
      context: null,
      pendingContext: null,
      hydrate,
      nextExpirationTimeToWorkOn: NoWork,
      expirationTime: NoWork,
      firstBatch: null,
      nextScheduledRoot: null,
    }: BaseFiberRootProperties);
  }
  //利用创建的root初始化fiber，该fiber存储在root.current
  uninitializedFiber.stateNode = root;

  // The reason for the way the Flow types are structured in this file,
  // Is to avoid needing :any casts everywhere interaction tracing fields are used.
  // Unfortunately that requires an :any cast for non-interaction tracing capable builds.
  // $FlowFixMe Remove this :any cast and replace it with something better.
  return ((root: any): FiberRoot);
}
```


