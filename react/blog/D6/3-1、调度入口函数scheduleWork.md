##   调度入口scheduleWork    
```
scheduleWork：
    const root = scheduleWorkToRoot(fiber, expirationTime);
    判断是否需要中断已经推入scheduler的任务队列
    markPendingPriorityLevel(root, expirationTime);
    const rootExpirationTime = root.expirationTime;
    requestWork(root, rootExpirationTime);
```
上述主要分析了执行ReactDOM.render的调度阶段相关代码，更加详细的源码分析可见	ReactNote项目。

#### 🌳scheduleWorkToRoot：更新当前更新任务发生的fiber的expirationTime，从发生更新任务的fiber开始往上更新fiber树上每个节点的childExpirationTime，这个值对应这fiber树上优先级最高的更新任务。current-fiber与workinprogress-fiber都会进行同样的处理。  
需要特别指出的是：

```
fiber.return：存储着该fiber的父节点fiber
fiber.stateNode：存储着该fiber对应的root
传入的expirationTime：发生更新的那个节点对应的到期时间
fiber.expirationTime：表示的是fiber上是否有更新
fiber.childExpirationTime：保存着此次更新之前所有发生更新的子节点的最高优先级的到期时间
```
其中scheduleWorkToRoot的逻辑流程是：
- 如果传入的expirationTime比fiber上的大，即优先级更高，则更新fiber的到期时间，同样的逻辑处理fiber.alternate上的expirationTime。
- 通过传入的fiber.return向上遍历整个fiber树，直到树的顶端也就是hostroot，返回顶端根节点fiber的root。在遍历的过程中进行如下操作：
- 如果父节点链上的每个节点的childExpirationTime优先级都小于当前更新节点的到期时间优先级，则利用更新节点的到期时间设置父节点链上的每个节点的childExpirationTime，否则不设置。同样的逻辑处理父节点链上的每个节点对应的alternate上的childExpirationTime。


```
/**
 * 将发生的更新事件的到期时间更新到整个fiber树上，返回FiberRoot
 * @param {*} fiber 发生更新的当前fiber节点
 * @param {*} expirationTime 发生更新的到期时间
 */
function scheduleWorkToRoot(fiber: Fiber, expirationTime): FiberRoot | null {
  recordScheduleUpdate();

  // Update the source fiber's expiration time
  //  如果传入的expirationTime比原来fiber上的大，则更新原fiber的到期时间
  //  expirationTime越大，优先级越高
  if (fiber.expirationTime < expirationTime) {
    fiber.expirationTime = expirationTime;
  }
  //如上逻辑,更新fiber.alternate上的expirationTime
  let alternate = fiber.alternate;
  if (alternate !== null && alternate.expirationTime < expirationTime) {
    alternate.expirationTime = expirationTime;
  }
  // Walk the parent path to the root and update the child expiration time.
  //
  let node = fiber.return; //父节点fiber node
  let root = null;
  if (node === null && fiber.tag === HostRoot) {
      // 如果传入的fiber没有父fiber并且当前fiber是hostroot，则返回的root为当前fiber.stateNode
      // 也就是当前的fiber为rootFiber，而在调用reactDOM.render的时候rootFiber.stateNode保存的就是fiberRoot。
    root = fiber.stateNode;
  } else {
      // expirationTime为当前传入的fiber的到期时间，即发生更新的子节点的到期时间
      // 如果传入的fiber是fiber树中的非根节点，则用子节点的到期时间更新
      // 这里需要注意： 到期时间大的优先级会更高，fiber.childExpirationTime存储的是整个root树中优先级最高的更新事件对应的到期时间
    while (node !== null) {
      alternate = node.alternate;
      if (node.childExpirationTime < expirationTime) {
        // 如果当前发生的更新事件优先级高于整个root树中最高优先级的更新，那么将遍历到的fiber.childExpirationTime更新为当前更新的到期时间
        node.childExpirationTime = expirationTime;
        if (
          alternate !== null &&
          alternate.childExpirationTime < expirationTime
        ) {
          //以同样的逻辑处理当前遍的节点的副本alternate，在workinprogress世界中的副本
          alternate.childExpirationTime = expirationTime;
        }
      } else if (
        alternate !== null &&
        alternate.childExpirationTime < expirationTime
      ) {
          //保存着当前状态的fiber树的节点的更新时间不需要更新，但是workinprogress-fiber需要更新最高优先级更新事件的到期时间
        alternate.childExpirationTime = expirationTime;
      }
      if (node.return === null && node.tag === HostRoot) {
        //循环直到遍历到的父节点为根节点，不再有父节点了，就将当前遍历到的节点的fiberRoor作为root，并退出循环
        root = node.stateNode;
        break;
      }
      // 向上遍历父fiber
      node = node.return;
    }
  }
  ...
  //返回hostroot对应的root
  return root;
}
```
#### ❓判断是否需要中断已经推入scheduler的任务队列
在不处于调度阶段的时候，在scheduler执行任务的过程中，有更高优先级的更新任务发生，那么就会中断当前的任务队列的刷新，清空任务队列，
```
  //isWorking：代表是否正在工作，在开始renderRoot和commitRoot的时候会设置为 true，也就是在render和commit两个阶段都会为true
  //nextRenderExpirationTime：下一个要渲染的任务的到期时间
  //  expirationTime：当前更新的到期时间
  if (
    !isWorking &&
    nextRenderExpirationTime !== NoWork &&
    expirationTime > nextRenderExpirationTime
  ) {
    // This is an interruption. (Used for performance tracking.)
    // 如果当前更新的优先级比下一个要渲染的任务的优先级高，并且之前执行过任务(下一个要渲染的任务优先级不是0)，并且不处于render以及commit阶段（当前没有任务正在执行）
    // 则打断之前的任务，并且执行resetStack()将被中断的任务队列清空
    // 每一次更新都会有一个任务队列，当一个时间片有时间的时候才会执行，否则交给浏览器渲染页面
    // 在这个任务队列中，如果优先级更高的更新发生了，那么这个更新任务会打断当前的任务队列的执行，所以会调用resetStack清空这个任务队列
    interruptedBy = fiber;
    resetStack();
  }
```

#### ❓利用expirationTime来更新fiberRoot上记录的所有子节点更新任务到期时间的区间[earliestPendingTime,latestPendingTime]：markPendingPriorityLevel

```
markPendingPriorityLevel(root, expirationTime);
```

#### ❓requestWork  

```
function requestWork(root: FiberRoot, expirationTime: ExpirationTime) {
  addRootToSchedule(root, expirationTime);
  // 由于需要更新的root是一个链表的形式，如果一旦进入调度阶段，会循环的更新每个root节点树上的任务，因此在addRootToSchedule将当前需要更新的root加入root更新链表之后，就会被更新，因此这里直接返回。而不会进入下面的开始调度的环节。
  if (isRendering) {
    // Prevent reentrancy. Remaining work will be scheduled at the end of
    // the currently rendering batch.
    return;
  }
  // 批处理，比如一个点击事件处理函数中同步调用多次setState的时候，会处于批处理状态，isBatchingUpdates为true，isUnbatchingUpdates为false，因此这里会直接返回。这里有很多函数都会将isBatchingUpdates设置为true。
  if (isBatchingUpdates) {
    // Flush work at the end of the batch.
    if (isUnbatchingUpdates) {
      // ...unless we're inside unbatchedUpdates, in which case we should
      // flush it now.
      nextFlushedRoot = root;
      nextFlushedExpirationTime = Sync;
      performWorkOnRoot(root, Sync, false);
    }
    return;
  }

  // TODO: Get rid of Sync and use current time?
  if (expirationTime === Sync) {
    performSyncWork();
  } else {
    scheduleCallbackWithExpirationTime(root, expirationTime);
  }
}
```

1、addRootToSchedule把 root 加入到调度队列，但是要注意一点，不会存在两个相同的 root 前后出现在队列中

2、❓ 根据isBatchingUpdates与isUnbatchingUpdates来判断是否是批处理更新任务，比如一个点击事件处理函数中同步调用多次setState的时候，会处于批处理状态，isBatchingUpdates为true，isUnbatchingUpdates为false，因此这里会直接返回。这里关于批处理setState的细节可以参见`多次执行setState的更新机制`

3、如果expirationTime是同步的，则调用performSyncWork，否则调用scheduleCallbackWithExpirationTime

performSyncWork函数会直接调用performWork，而scheduleCallbackWithExpirationTime会调用scheduler中的unstable_scheduleCallback(performAsyncWork, {timeout}),timeout是自定义的到期时间，根据到期时间过期或者当前animation frame的空闲时间来执行performAsyncWork函数，最终会调用performWork来执行当前节点的任务，实现将fiber渲染到页面上。
> scheduleCallbackWithExpirationTime

callbackExpirationTime是上一次调用该函数的时候，也就是上一次performasyncwork调度的异步更新任务的到期时间。expirationTime为当前需要调度的异步更新任务的到期时间。callbackExpirationTime!== NoWork则表示异步更新处于调度中（在调用performwork的时候会将callbackExpirationTime设置为NoWork），在此情况下，如果这次的到期时间大，也就是优先级更高，则调用cancelDeferredCallback取消之前的异步更新。如果优先级比较低，则直接返回，不会打断之前的异步更新。如果没有异步更新处于调度中，则计算一个以毫秒为单位的绝对到期时间，然后调用scheduleDeferredCallback将performAsyncWork推入调度器开始调度当前的异步更新任务。
```
//异步进行root任务调度就是通过这个方法来做的，这里最主要的就是调用了scheduler的scheduleDeferredCallback方法
// 传入的的是回调函数performAsyncWork，以及一个包含timeout超时事件的对象
function scheduleCallbackWithExpirationTime(
  root: FiberRoot,
  expirationTime: ExpirationTime,
) {
  if (callbackExpirationTime !== NoWork) {
    // A callback is already scheduled. Check its expiration time (timeout).
    if (expirationTime < callbackExpirationTime) {
      // Existing callback has sufficient timeout. Exit.
      return;
    } else {
      if (callbackID !== null) {
        // Existing callback has insufficient timeout. Cancel and schedule a
        // new one.
        cancelDeferredCallback(callbackID);
      }
    }
    // The request callback timer is already running. Don't start a new one.
  } else {
    startRequestCallbackTimer();
  }

  callbackExpirationTime = expirationTime;
  const currentMs = now() - originalStartTimeMs;
  const expirationTimeMs = expirationTimeToMs(expirationTime);
  const timeout = expirationTimeMs - currentMs;
  callbackID = scheduleDeferredCallback(performAsyncWork, {timeout});
}
```


下一节分析一下执行任务的工具performWork，看看如何一步步将fiber的变化渲染到页面。


