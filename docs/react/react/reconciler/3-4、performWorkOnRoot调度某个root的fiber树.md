---
id: performwork-on-root
sidebar_label: 从根节点开始调度
slug: '/react/react/reconciler/performwork-on-root'
sidebar_position: 5
title: ''
---

## 🌳 performWorkOnRoot   
经过performWork对root双向循环链表的调度的时候会对链表中每个root调用performWorkOnRoot来调度该root下的fiber树。

#### 🌿 传入的参数为:

```
root: 当前正在调度的root
expirationTime: 该root的到期时间
isYieldy: true表示是异步的，false表示是同步的
```


#### 🌿 在performWorkOnRoot中需要注意：
> isRendering ：

处于正在渲染阶段的标记，该标记可用于控制其他操作的执行与否，这里需要回头看一下之前的isRendering相关的判断，总结如下：(❓待总结...)。

> root.finishedWork：

标志该root上的任务是否完成，不为null表示为完成

#### 🌿 performWorkOnRoot的作用
performWorkOnRoot函数首先设置isRendering为true，然后根据isYieldy判断异步与同步，分别进行相应的逻辑；最后将isRendering设置为false，表示渲染阶段结束。

1、在isYieldy为false即同步状态下，如果root.finishedWork不为null即任务已经经过第一阶段的renderRoot，但是由于在第二阶段completeRoot的时候被打断了或者已经没有空余时间了，因此还没有完成第二阶段的completeRoot，则会调用completeRoot进入root的提交阶段。如果root.finishedWork为null则表示任务还没有经过renderRoot阶段，react会调用renderRoot渲染一次这个root，renderRoot结束后再判断root的任务是否完成，如果完成就进入提交阶段，否则啥都不干。(❓这里需要弄清楚：renderRoot渲染的是虚拟DOM还是会将虚拟DOM渲染出来还是只是会根据虚拟DOM创建对应的DOM节点但是还没append)

2、在isYieldy为true即异步状态下，与同步状态唯一的区别是，重新渲染之后，如果任务完成了，不会立马提交，而是判断当前animation frame是否存在空闲时间，如果存在空闲时间，则进入root提交阶段，如果不存在空闲时间，则将finishedWork保存到root.finishedWork上，在下一次更新进行调度的过程中执行到performWorkOnRoot这个函数的时候，对这个root.finishedWork进行第二阶段的工作。


🍊 经过上述分析，某个root会有两个阶段：renderRoot的渲染阶段，completeRoot的提交阶段。接下来就分析这两个阶段具体干了什么。


## 🌳 performWorkOnRoot 源码   

```
function performWorkOnRoot(
  root: FiberRoot,
  expirationTime: ExpirationTime,
  isYieldy: boolean,
) {
  invariant(
    !isRendering,
    'performWorkOnRoot was called recursively. This error is likely caused ' +
      'by a bug in React. Please file an issue.',
  );
  //处于正在渲染阶段的标记
  isRendering = true;

  // Check if this is async work or sync/expired work.
  if (!isYieldy) {
    // Flush work without yielding.
    // TODO: Non-yieldy work does not necessarily imply expired work. A renderer
    // may want to perform some work without yielding, but also without
    // requiring the root to complete (by triggering placeholders).
    // 该root上的任务是同步的，不允许被中断
    // root.finishedWork：已经完成的任务的FiberRoot对象，如果你只有一个Root，那他永远只可能是这个Root对应的Fiber，或者是null，在commit阶段只会处理这个值对应的任务
    let finishedWork = root.finishedWork;
    if (finishedWork !== null) {
      // This root is already complete. We can commit it.
      //  如果该root上的finishedWork不是null，说明该root的任务已经完成了，可以直接commit这个root
      completeRoot(root, finishedWork, expirationTime);
    } else {
      //如果等于null，确保root.finishedWork = null;
      root.finishedWork = null;
      // If this root previously suspended, clear its existing timeout, since
      // we're about to try rendering again.
      //  如果这个root之前被挂起了，清除现有的timout标记，因为将会再次尝试渲染。
      const timeoutHandle = root.timeoutHandle;
      if (timeoutHandle !== noTimeout) {
        root.timeoutHandle = noTimeout;
        // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above
        cancelTimeout(timeoutHandle);
      }
      //再次渲染
      renderRoot(root, isYieldy);
      //判断是否完成，如果渲染阶段该节点任务完成了，进入提交阶段
      finishedWork = root.finishedWork;
      if (finishedWork !== null) {
        // We've completed the root. Commit it.
        completeRoot(root, finishedWork, expirationTime);
      }
    }
  } else {
    // Flush async work.
    let finishedWork = root.finishedWork;
    if (finishedWork !== null) {
      // This root is already complete. We can commit it.
      completeRoot(root, finishedWork, expirationTime);
    } else {
      //该root为异步任务
      //与上面if的逻辑基本一致，不同的是在任务完成之后，需要判断animation frame是否还有空闲时间，
        // 如果还有就提交，没有就中断，并标记这个root已经完成了任务，等下一次animation frame提交。
      root.finishedWork = null;
      // If this root previously suspended, clear its existing timeout, since
      // we're about to try rendering again.
      const timeoutHandle = root.timeoutHandle;
      if (timeoutHandle !== noTimeout) {
        root.timeoutHandle = noTimeout;
        // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above
        cancelTimeout(timeoutHandle);
      }
      renderRoot(root, isYieldy);
      finishedWork = root.finishedWork;
      if (finishedWork !== null) {
        // We've completed the root. Check the if we should yield one more time
        // before committing.
        if (!shouldYieldToRenderer()) {
          // Still time left. Commit the root.
          completeRoot(root, finishedWork, expirationTime);
        } else {
          // There's no time left. Mark this root as complete. We'll come
          // back and commit it later.
          root.finishedWork = finishedWork;
        }
      }
    }
  }

  isRendering = false;
}
```
