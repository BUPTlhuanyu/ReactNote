##  🌳概述，背景  
在一个页面调用多次ReactDOM.render的时候会存在多个root，这些root会被编成一个双向循环队列。performWork会根据是否是需要异步还是同步执行root双向循环链表中各个root树的任务来调用performWorkOnRoot。

传入performWork的参数为：
```
minExpirationTime：NoWork或者Sync，最小的到期时间
isYieldy：true表示是异步的，false表示是同步的
```

该函数主要的作用是遍历fiber树，根据优先级从高到低执行performWorkOnRoot，并且删除fiber树中没有任务需要执行的节点。下一节将会分析performWorkOnRoot


## 🌳performWork源码  
<details>
<summary>展开performWork代码</summary>

```
function performWork(minExpirationTime: ExpirationTime, isYieldy: boolean) {
  // Keep working on roots until there's no more work, or until there's a higher
  // priority event.
  //在一个页面调用多次ReactDOM.render的时候会存在多个root，这些root会被编成一个双向循环队列
    //获取调度队列中最高优先级的root节点，同时从双向循环调度队列中删除没有任务需要执行的节点。
  findHighestPriorityRoot();

  //isYieldy为true表示异步performWork
  if (isYieldy) {
    recomputeCurrentRendererTime();
    currentSchedulerTime = currentRendererTime;

    if (enableUserTimingAPI) {
      const didExpire = nextFlushedExpirationTime > currentRendererTime;
      const timeout = expirationTimeToMs(nextFlushedExpirationTime);
      stopRequestCallbackTimer(didExpire, timeout);
    }

    //循环停止的条件是：所有root都perform完成，或者没有空闲时间并且下一个任务没有过期。
    while (
      nextFlushedRoot !== null &&
      nextFlushedExpirationTime !== NoWork &&
      minExpirationTime <= nextFlushedExpirationTime &&
      !(didYield && currentRendererTime > nextFlushedExpirationTime)
    ) {
      //  下一个需要执行任务的root存在，并且其过期时间不是NoWork（说明当前节点有任务需要执行）
      //  同时下一个需要执行任务的root的到期时间（优先级）大于（高于）传入的到期时间（优先级），
      //  另外!(didYield && currentRendererTime > nextFlushedExpirationTime)表示有空闲时间或者下一个节点的任务已经过期
      //  上述三个条件满足则继续while循环，执行performWorkOnRoot。
        // currentRendererTime > nextFlushedExpirationTime表示当前渲染时间大于下一个节点的任务的到期时间，说明下一个节点的任务还没有过期了
        // didYield表示当前animation frame 是否有空闲时间，true表示有空闲时间，false表示没有空余时间
      performWorkOnRoot(
        nextFlushedRoot,
        nextFlushedExpirationTime,
        currentRendererTime > nextFlushedExpirationTime,//为true表示还没有过期，说明是异步的。即performWorkOnRoot(root,expirationTime,isYieldy)中isYieldy为true
      );
      //在一个页面调用多次ReactDOM.render的时候会存在多个root，这些root会被编成一个双向循环队列
        //获取调度队列中最高优先级的root节点，同时从双向循环调度队列中删除没有任务需要执行的节点。
      //  利用优先级最高节点的到期时间设置nextFlushedExpirationTime
      findHighestPriorityRoot();
      recomputeCurrentRendererTime();
      currentSchedulerTime = currentRendererTime;
    }
  } else {
    while (
      nextFlushedRoot !== null &&
      nextFlushedExpirationTime !== NoWork &&
      minExpirationTime <= nextFlushedExpirationTime
    ) {
      performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime, false);
      findHighestPriorityRoot();
    }
  }

  // We're done flushing work. Either we ran out of time in this callback,
  // or there's no more work left with sufficient priority.

  // If we're inside a callback, set this to false since we just completed it.
  //  如果在一个回调中，则将刚才完成的设置为false
  if (isYieldy) {
    callbackExpirationTime = NoWork;
    callbackID = null;
  }
  // If there's work left over, schedule a new callback.
  //  对于没有空闲时间并且下一个任务没有过期的情况，需要重新进行一次异步调度，在下一次animation frame中执行节点的任务。
  if (nextFlushedExpirationTime !== NoWork) {
    //scheduleCallbackWithExpirationTime为scheduler中的unstable-scheduleCallback
    scheduleCallbackWithExpirationTime(
      ((nextFlushedRoot: any): FiberRoot),
      nextFlushedExpirationTime,
    );
  }

  // Clean-up.
  finishRendering();
}
```
</details>

#### 0️⃣findHighestPriorityRoot：获取root调度链表中最高优先级的root节点，同时从root调度链表中删除优先级最低也就是没有任务需要执行的root;最后将全局变量nextFlushedRoot设置为优先级最高的root，将全局变量nextFlushedExpirationTime设置为最高优先级root的到期时间。

```
function findHighestPriorityRoot() {
  let highestPriorityWork = NoWork;
  let highestPriorityRoot = null;
  if (lastScheduledRoot !== null) { ... }
  //将获取到的最高优先级root(一个fiber节点)以及最高优先级work（一个到期时间）
    // 分别保存到nextFlushedRoot以及nextFlushedExpirationTime。
  nextFlushedRoot = highestPriorityRoot;
  nextFlushedExpirationTime = highestPriorityWork;
}
```

#### 1️⃣isYieldy为true，对应performAsyncWork
循环执行root链表中优先级最高的root的更新任务，直到所有的具有更新任务root的最高优先级任务没有过期或者时间片没有空余时间,执行某个root更新任务的函数为performWorkOnRoot,这个下一节会分析

```
  if (isYieldy) {
    // 重新计算当前渲染的时间，保存在currentRendererTime中，然后将currentRendererTime赋值给currentSchedulerTime
    recomputeCurrentRendererTime();
    currentSchedulerTime = currentRendererTime;

    //循环停止的条件是：所有root都perform完成，或者没有空闲时间并且下一个任务没有过期。
    while (
      // 有需要更新任务的root
      nextFlushedRoot !== null &&
      nextFlushedExpirationTime !== NoWork &&
      // 可以被中断的异步更新任务在这里处理，因为传入的minExpirationTime为NoWork，为0
      minExpirationTime <= nextFlushedExpirationTime &&
      // 当前的时间片有空闲时间即didYield为false，或者该root已经过期了，即nextFlushedExpirationTime大于等于currentRendererTime
      !(didYield && currentRendererTime > nextFlushedExpirationTime)
    ) {
      performWorkOnRoot(
        nextFlushedRoot,
        nextFlushedExpirationTime,
        currentRendererTime > nextFlushedExpirationTime,//为true表示还没有过期。即performWorkOnRoot(root,expirationTime,isYieldy)中isYieldy为true
      );
      // 由于通过performWorkOnRoot的调度之后会执行一些生命周期函数，导致每个root上的更新任务会变化，即最高的优先级会变化
      // 因此需要调用findHighestPriorityRoot来更新nextFlushedExpirationTime
      // 在root存在新的更新任务之后，自然就需要重新获取当前渲染时间，在while中通过比较优先级最高的到期时间与当前时间来判断是否过期，也就是是否需要再次调用performWorkOnRoot来执行更新任务
      findHighestPriorityRoot();
      recomputeCurrentRendererTime();
      currentSchedulerTime = currentRendererTime;
    }
  }
```

#### 2️⃣isYieldy为false，对应performsyncWork
这里不需要判断任务过期，因为是一个同步的任务，无法被打断，在同步更新任务执行完的过程中，有可能会产生异步的更新，这些新的异步更新如果过期则会在当前周期执行掉，如果没有空闲时间或者还没有到期则会被放在下一个周期进行调度与执行。如果同步更新任务中产生了一个同步更新任务，那么这个新的同步任务也会被同步执行。

```
else {
    // isYieldy为false表示是同步的，不可以被中断
    // 这里不需要判断任务过期，因为是一个同步的任务，无法被打断，在同步更新任务执行完的过程中，有可能会产生异步的更新，因此过期或者没空闲时间的异步的更新推入调度器中，过期的直接在当前周期执行。
    while (
      // 有需要更新任务的root，不需要判断任务是否过期
      nextFlushedRoot !== null &&
      nextFlushedExpirationTime !== NoWork &&
      // 不可被中断的同步调度任务，因为传入的minExpirationTime为Sync，为最大number值。
      // 下面的判断在同步的情况下会成立的原因是，对于最高优先级的同步任务的过期时间会是Sync，因此下面判断成立只能是相等
      minExpirationTime <= nextFlushedExpirationTime
    ) {
      // 开始调度渲染，并且标记了这个root上的任务不可以被中断
      performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime, false);
      findHighestPriorityRoot();
    }
  }
```

#### 3️⃣一个performAsyncWork算作一个调度周期，在执行完当前周期的任务之后，需要将当前调度对应的callbackID以及当前performAsyncWork对应的到期时间重置

```
if (isYieldy) {
callbackExpirationTime = NoWork;
callbackID = null;
}
```

#### 4️⃣通过上述的while循环执行完同步的更新任务以及过期的异步更新任务之后，可能还会存在一些没有过期的异步任务，因此需要将这些任务存到新的一轮调度中。


```
  if (nextFlushedExpirationTime !== NoWork) {
    //scheduleCallbackWithExpirationTime为scheduler中的unstable-scheduleCallback
    scheduleCallbackWithExpirationTime(
      ((nextFlushedRoot: any): FiberRoot),
      nextFlushedExpirationTime,
    );
  }
```

下一节分析performWorkOnRoot











