[TOC]

#### 概述，背景

```
state初始值为{a:1}
问题1：最终state会是多少
clickHandler(){
    this.setState({
        a : 2
    })
    this.setState({
        a : 3
    })
    this.setState({
        a : 4
    })
    this.setState({
        a : 5
    })
}

问题2：最终state会是多少
clickHandler(){
    this.setState((prevState, nextProps) => {
      return {a:prevState.a + 1};
    })
    this.setState((prevState, nextProps) => {
      return {a:prevState.a + 1};
    })
    this.setState((prevState, nextProps) => {
      return {a:prevState.a + 1};
    })
    this.setState((prevState, nextProps) => {
      return {a:prevState.a + 1};
    })
}
```
注意本文将与之前的文章[2-6-2、对类组件执行updateClassComponent](http://note.youdao.com/noteshare?id=84df98e9c1e5cb9d1a66864b34268a7f&sub=1E16F316E66348EB945206AE4746119A)紧密相关。

**阅读本文需要特别关注的是**：
1. 如下多个setState同步的执行的时候，更新任务的到期时间是相同的

```
原因：同一事件中多次同步执行setState的到期时间都是相同的
There's already pending work. We might be in the middle of a browser
event. If we were to read the current time, it could cause multiple updates
within the same event to receive different expiration times, leading to
tearing. Return the last read time. During the next idle callback, the
time will be updated
```

2. 当前fiber的到期时间expirationTime会被设置为与类组件setState产生的更新任务相同的到期时间

#### 必要的回顾与准备
回顾类组件的实例化，给出一些setState相关的准备工作。
> 在执行ReactDOM.render构建fiber树的时候，遇到类类型的组件，会调用updateClassComponent，该函数会在组件挂载生命周期中调用constructClassInstance实例化类类型组件。

updateClassComponent所在路径：react\packages\react-reconciler\src\ReactFiberBeginWork.js

> constructClassInstance构建类组件的实例然后调用adoptClassInstance(workInProgress, instance)给传入的instance添加更新器updater属性值为classComponentUpdater，这个classComponentUpdater在该文件中是一个包含多个属性的 对象，主要用于存放更新任务相关逻辑

constructClassInstance函数所在路径：react\packages\react-reconciler\src\ReactFiberClassComponent.js
。

```
const classComponentUpdater = {
  isMounted,
  enqueueSetState(inst, payload, callback) {
      ...
  },
  enqueueReplaceState(inst, payload, callback) {
      ...
  },
  enqueueForceUpdate(inst, callback) {
     ...
};
```
setState是依赖enqueueSetState来执行更新的,enqueueSetState代码在下面的分析中会给出。

#### 从setState方法切入
setState方法：

```
Component.prototype.setState = function(partialState, callback) {
    ...
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
```
在上述方法中，必须要介绍一下参数代表的意义：

```
partialState：传入setState方法的新的state对象
callback：state更新之后的回调函数
```
在类组价中调用setState会直接调用实例上updater的enqueueSetState方法，其代码如下：

```
enqueueSetState(inst, payload, callback) {
  //获取实例对应的fiber
  const fiber = ReactInstanceMap.get(inst);
  //计算当前时间:react确保了在同一个时间中所有的更新都是相同的到期时间
  const currentTime = requestCurrentTime();
  //根据当前时间与fiber计算到期时间
  const expirationTime = computeExpirationForFiber(currentTime, fiber);
  //传入一个到期时间，返回一个对象，见packages\react-reconciler\src\ReactUpdateQueue.js
  const update = createUpdate(expirationTime);
  //利用新的state修改update.payload
  update.payload = payload;
  //利用callback修改update.callback
  if (callback !== undefined && callback !== null) {
    if (__DEV__) {
      warnOnInvalidCallback(callback, 'setState');
    }
    update.callback = callback;
  }
  //？？？存疑，调用scheduler删除当前某个任务，这里先不讨论
  flushPassiveEffects();
  //开始调度setState带来的更新
  enqueueUpdate(fiber, update);
  //开始调度新的当前fiber子树，设置相关的到期时间等等,这里关键是会给当前fiber设置expirationTime为setState的更新任务相同的值
  scheduleWork(fiber, expirationTime);
}
```

#### enqueueUpdate
> enqueueUpdate为fiber构建updateQueue队列，多个setState的效果是多个具备相同到期时间的update都被添加到队列中

依赖的函数：
- createUpdateQueue返回一个UpdateQueue类型的对象（该对象是由update组成的队列），传入的state存放到baseState属性上。
- appendUpdateToQueue将传入的update添加到传入的update队列即queue的最后。
- cloneUpdateQueue返回传入的update队列的克隆版，返回的队列与传入的队列的firstUpdate指向同一个对象，lastUpdate也指向同一个对象。

```
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

function cloneUpdateQueue<State>(
  currentQueue: UpdateQueue<State>,
): UpdateQueue<State> {
  const queue: UpdateQueue<State> = {
    baseState: currentQueue.baseState,
    firstUpdate: currentQueue.firstUpdate,
    lastUpdate: currentQueue.lastUpdate,

    // TODO: With resuming, if we bail out and resuse the child tree, we should
    // keep these effects.
    firstCapturedUpdate: null,
    lastCapturedUpdate: null,

    firstEffect: null,
    lastEffect: null,

    firstCapturedEffect: null,
    lastCapturedEffect: null,
  };
  return queue;
}
```
enqueueUpdate的作用是将传入的更新任务（包含新state以及到期时间的对象）添加到更新队列。

```
export function enqueueUpdate<State>(fiber: Fiber, update: Update<State>) {
  // Update queues are created lazily.
  // 使用alternate属性双向连接一个当前fiber和其work-in-progress，当前fiber实例的alternate属性指向其work-in-progress，work-in-progress的alternate属性指向当前稳定fiber。
  const alternate = fiber.alternate;
  let queue1;
  let queue2;
  if (alternate === null) {
    // There's only one fiber.
    queue1 = fiber.updateQueue;
    queue2 = null;
    if (queue1 === null) {
      //如果当前组件没有等待setState的队列则创建一个，
        // 利用fiber当前已经记录并需要整合的state存储到queue1与fiber.updateQueue
      queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
    }
  } else {
    // There are two owners.
    // 如果fiber树以及workinprogress树都存在，下面的逻辑则会同步两个树的update队列
    queue1 = fiber.updateQueue;
    queue2 = alternate.updateQueue;
    // 当两个树的队列至少有一个不存在的时候执行队列创建或者复制操作
    if (queue1 === null) {
      if (queue2 === null) {
        // Neither fiber has an update queue. Create new ones.
        //  两个队列都没有则根据各自的memoizedState创建update队列
        queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
        queue2 = alternate.updateQueue = createUpdateQueue(
          alternate.memoizedState,
        );
      } else {
        // 如果有一个没有则复制另一个队列给它
        // Only one fiber has an update queue. Clone to create a new one.
        queue1 = fiber.updateQueue = cloneUpdateQueue(queue2);
      }
    } else {
      if (queue2 === null) {
        // 如果有一个没有则复制另一个队列给它
        // Only one fiber has an update queue. Clone to create a new one.
        queue2 = alternate.updateQueue = cloneUpdateQueue(queue1);
      } else {
        // Both owners have an update queue.
      }
    }
  }

  if (queue2 === null || queue1 === queue2) {
    // There's only a single queue.
    // 如果只有一个树，或者两棵树队列是同一个，则将传入的更新对象添加到第一个队列中
    appendUpdateToQueue(queue1, update);
  } else {
    // There are two queues. We need to append the update to both queues,
    // while accounting for the persistent structure of the list — we don't
    // want the same update to be added multiple times.
    //  如果两个队列存在，则将更新任务加入两个队列中，并避免被添加多次
    if (queue1.lastUpdate === null || queue2.lastUpdate === null) {
      // One of the queues is not empty. We must add the update to both queues.
      //  有一个队列不为空，将update添加到两个队列
      appendUpdateToQueue(queue1, update);
      appendUpdateToQueue(queue2, update);
    } else {
      // Both queues are non-empty. The last update is the same in both lists,
      // because of structural sharing. So, only append to one of the lists.
      appendUpdateToQueue(queue1, update);
      // But we still need to update the `lastUpdate` pointer of queue2.
      queue2.lastUpdate = update;
    }
  }
}
```

#### processUpdateQueue
通过多个同步执行的setState函数的作用，为fiber生成了对应的updateQueue，并且updateQueue中的每个update的到期时间是相同的。最终在调度更新树的时候会调用performWork，其中会调用updateClassInstance，其中会调用processUpdateQueue函数来处理之前构建的updateQueue。只考虑updateQueue中的update，省略CapturedUpdate相关逻辑之后processUpdateQueue部分代码如下：

```
export function processUpdateQueue<State>(
  workInProgress: Fiber,
  queue: UpdateQueue<State>,
  props: any,
  instance: any,
  renderExpirationTime: ExpirationTime,
): void {
  hasForceUpdate = false;

  queue = ensureWorkInProgressQueueIsAClone(workInProgress, queue);

  // These values may change as we process the queue.
  let newBaseState = queue.baseState;
  let newFirstUpdate = null;
  let newExpirationTime = NoWork;

  // Iterate through the list of updates to compute the result.
  let update = queue.firstUpdate;
  let resultState = newBaseState;
  while (update !== null) {
    const updateExpirationTime = update.expirationTime;
    if (updateExpirationTime < renderExpirationTime) {
      // This update does not have sufficient priority. Skip it.
      if (newFirstUpdate === null) {
        // This is the first skipped update. It will be the first update in
        // the new list.
        newFirstUpdate = update;
        // Since this is the first update that was skipped, the current result
        // is the new base state.
        newBaseState = resultState;
      }
      // Since this update will remain in the list, update the remaining
      // expiration time.
      if (newExpirationTime < updateExpirationTime) {
        newExpirationTime = updateExpirationTime;
      }
    } else {
      // This update does have sufficient priority. Process it and compute
      // a new result.
      resultState = getStateFromUpdate(
        workInProgress,
        queue,
        update,
        resultState,
        props,
        instance,
      );
      const callback = update.callback;
      if (callback !== null) {
        workInProgress.effectTag |= Callback;
        // Set this to null, in case it was mutated during an aborted render.
        update.nextEffect = null;
        if (queue.lastEffect === null) {
          queue.firstEffect = queue.lastEffect = update;
        } else {
          queue.lastEffect.nextEffect = update;
          queue.lastEffect = update;
        }
      }
    }
    // Continue to the next update.
    update = update.next;
  }

  if (newFirstUpdate === null) {
    queue.lastUpdate = null;
  }

  if (newFirstUpdate === null && newFirstCapturedUpdate === null) {
    // We processed every update, without skipping. That means the new base
    // state is the same as the result state.
    newBaseState = resultState;
  }

  queue.baseState = newBaseState;
  queue.firstUpdate = newFirstUpdate;

  workInProgress.expirationTime = newExpirationTime;
  workInProgress.memoizedState = resultState;
}
```
在同步多次执行setState的情况下，循环中的 if 判断条件newExpirationTime始终会等于renderExpirationTime，因此会循环遍历updateQueue队列中的update，并调用getStateFromUpdate不断修改合并state，得到最终的state即resultState。processUpdateQueue的最后会将得到的新的state存储到queue.baseState，将queue.firstUpdate置为null。

接下来通过getStateFromUpdate看如何合并state：

```
function getStateFromUpdate<State>(
  workInProgress: Fiber,
  queue: UpdateQueue<State>,
  update: Update<State>,
  prevState: State,
  nextProps: any,
  instance: any,
): any {
  switch (update.tag) {
     ...
    // Intentional fallthrough
    case UpdateState: {
      const payload = update.payload;
      let partialState;
      //两种不同的setState方式：第一个参数是一个对象或者一个函数
      if (typeof payload === 'function') {
        // Updater function
        partialState = payload.call(instance, prevState, nextProps);
      } else {
        // Partial state object
        partialState = payload;
      }
      if (partialState === null || partialState === undefined) {
        // Null and undefined are treated as no-ops.
        // 如果合并后的state为null或者undefined则返回之前的state
        return prevState;
      }
      // Merge the partial state and the previous state.
      // 合并state，并返回，Object.assign这里是第一层深拷贝，如果state比较复杂，就会存在深层属性浅拷贝的现象
      return Object.assign({}, prevState, partialState);
    }
    ...
  }
  return prevState;
}
```
由于这里只看setState，因此省略了部分代码。这里可以很清晰的看到state的合并机制，setState的第一个参数有两种方式：

```
1、对象形式
2、函数形式
    (prevState, nextProps) => {
      return {...};
    }
```
- 对象形式：会直接将当前的setState中的新的state作为partialState，然后利用Object.assign({}, prevState, partialState)将上一次setState之后的state与当前的新的state合并到一个新的对象上。
- 函数形式：利用该函数对上一次setState之后的state与下一次的props进行计算后返回的对象作为当前新的state，并存储在partialState，最后与prevState合并到新的对象上。

#### 下面代码state最终会是5：

```
state初始值为{a:1}
clickHandler(){
    this.setState((prevState, nextProps) => {
      return {a:prevState.a + 1};
    })
    this.setState((prevState, nextProps) => {
      return {a:prevState.a + 1};
    })
    this.setState((prevState, nextProps) => {
      return {a:prevState.a + 1};
    })
    this.setState((prevState, nextProps) => {
      return {a:prevState.a + 1};
    })
}
```
