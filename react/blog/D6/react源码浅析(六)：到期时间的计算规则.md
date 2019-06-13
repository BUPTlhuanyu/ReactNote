[TOC]
#### 到期时间的计算方法
到期时间算法源码位置：
```
react\packages\react-reconciler\src\ReactFiberExpirationTime.js
```
**摘要：**
react主要把到期时间分为两种：异步任务到期时间与交互动作的到期时间。在这之前需要了解一下一些重要的函数，react的到期时间与系统的时间ms不是1：1的关系，低优先级异步任务的两个时间间隔相差不到250ms（相当于25个单位的 到期时间）的任务会被设置为同一个到期时间，交互 异步任务间隔为100ms（10个单位到期时间），因此减少了一些不必要的组件渲染，并且保证交互可以及时的响应。

###### precision 单位的步进的到期时间

```
//向上取整，间隔在precision内的两个num最终得到的相同的值
function ceiling(num: number, precision: number): number {
  return (((num / precision) | 0) + 1) * precision;
}

//根据到期时间与单位为ms的时间之间的转换关系，定制ceiling来得到到期时间
const UNIT_SIZE = 10;// 过期时间单元（ms）
const MAGIC_NUMBER_OFFSET = MAX_SIGNED_31_BIT_INT - 1;// 到期时间偏移量
function computeExpirationBucket(
  currentTime,
  expirationInMs,
  bucketSizeMs,
): ExpirationTime {
  return (
    MAGIC_NUMBER_OFFSET -
    ceiling(
      MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE,
      bucketSizeMs / UNIT_SIZE,
    )
  );
}
```

ceiling的作用：向上取整，间隔在precision内的两个num最终得到的相同的值。
如果precision为25，则50和66转换后的到期时间都是75

computeExpirationBucket的作用：第一参数是需要转换的当前时间（单位：单位到期时间 = UNIT_SIZE ms），第二个参数是不同优先级的异步任务对应的偏移时间（单位：ms），第三个参数是步进时间（单位：ms）。该函数通过定制ceiling得到特定单位（10ms一个单位）的到期时间，这个时间对应不同优先级的异步任务到期时间。比如：如果是低优先级的异步任务，则第二个参数传入`LOW_PRIORITY_EXPIRATION = 5000`。

```
由于到期时间越大，优先级越高，因此第二个参数的巧妙之处是，避免在一个当前
时间左右的不同优先级任务的到期时间相差无几，失去了到期时间的意义。
```


> 低优先级异步任务到期时间：computeAsyncExpiration

```
//异步任务的到期时间
export const LOW_PRIORITY_EXPIRATION = 5000;
export const LOW_PRIORITY_BATCH_SIZE = 250;
//计算异步到期时间
export function computeAsyncExpiration(
  currentTime: ExpirationTime,
): ExpirationTime {
  return computeExpirationBucket(
    currentTime,
    LOW_PRIORITY_EXPIRATION,
    LOW_PRIORITY_BATCH_SIZE,
  );
}
```
上面`currentTime`为`50`和`58`转换后的到期时间都是`1073742275`:
```
50: ((1073741822-50+500)/25|0+1)*25 = 1073742275
58: ((1073741822-58+500)/25|0+1)*25 = 1073742275
```

> 交互动作的到期时间：computeInteractiveExpiration

```
export const HIGH_PRIORITY_EXPIRATION = __DEV__ ? 500 : 150;
export const HIGH_PRIORITY_BATCH_SIZE = 100;

export function computeInteractiveExpiration(currentTime: ExpirationTime) {
  return computeExpirationBucket(
    currentTime,
    HIGH_PRIORITY_EXPIRATION,
    HIGH_PRIORITY_BATCH_SIZE,
  );
}
```
上面`currentTime`为`50`和`58`转换后的到期时间相等，交互任务在开发环境得到的到期时间大于生产环境：
```
开发环境：
50: ((1073741822-50+50)/10|0+1)*10 = 1073741830
58: ((1073741822-58+50)/10|0+1)*10 = 1073741830

生产环境：
50: ((1073741822-50+15)/10|0+1)*10 = 1073741790
58: ((1073741822-58+15)/10|0+1)*10 = 1073741790
```

#### 获取当前时间currentTime：requestCurrentTime
```
function requestCurrentTime() {
      if (isRendering) {
        return currentSchedulerTime;
      }
      findHighestPriorityRoot();
      if (
        nextFlushedExpirationTime === NoWork ||
        nextFlushedExpirationTime === Never
      ) {
        recomputeCurrentRendererTime();
        currentSchedulerTime = currentRendererTime;
        return currentSchedulerTime;
      }
      return currentSchedulerTime;
}
```
> 在 React 中我们计算expirationTime要基于当前得时钟时间，一般来说我们只需要获取Date.now或者performance.now就可以了，但是每次获取一下呢比较消耗性能，所以 React 设置了currentRendererTime来记录这个值，用于一些不需要重新计算得场景。

在`\react\packages\react-reconciler\src\ReactFiberScheduler.js`中可以发现如下代码是同时出现的，先获取到当前时间赋值给`currentRendererTime`，然后`currentRendererTime`赋值给`currentSchedulerTime`：
```
    recomputeCurrentRendererTime();
    currentSchedulerTime = currentRendererTime;
```

###### 在上述requestCurrentTime函数中，首先看第一个判断：

```
      if (isRendering) {
        return currentSchedulerTime;
      }
```
`isRendering`会在`performWorkOnRoot`的开始设置为true，在结束设置为false，都是同步的。`performWorkOnRoot`的先进入渲染阶段然后进入提交阶段，react所有的生命周期钩子都是在此执行的。

在一个事件回调函数中调用多次`setState`的时候，`isRendering`总是`false`，如果是在生命周期钩子函数`componentDidMount`中调用setState的时候，`isRendering`为`true`，因为该钩子触发的时机就是在`performWorkOnRoot`中。

###### 再看findHighestPriorityRoot();
`findHighestPriorityRoot`会找到root双向链表（React.render会创建一个root并添加到这个双向链表中）中有任务需要执行并且到期时间最大即优先级最高的任务，然后将这个需要更新的root以及最大到期时间赋值给`nextFlushedRoot`以及`nextFlushedExpirationTime`。当没有任务的时候`nextFlushedExpirationTime`为`NoWork`。

###### 接着看第二个判断
```
if (
        nextFlushedExpirationTime === NoWork ||
        nextFlushedExpirationTime === Never
      ) {
        recomputeCurrentRendererTime();
        currentSchedulerTime = currentRendererTime;
        return currentSchedulerTime;
      }
```
如果没有任务需要执行，那么重新计算当前时间，并返回，在事件处理函数中第一个`setState`会重新计算当前时间，但是第二个`setState`的时候，由于已经有更新任务在队列中了，所以这里直接跳过判断，最后返回上一次`setState`时的记录的当前时间。

注意：这里调用的`recomputeCurrentRendererTime`是通过调用performance.now()或者Date.now()获取的时间。

###### 最后
```
return currentSchedulerTime;
```
返回`currentSchedulerTime`。

#### 计算到期时间：computeExpirationForFiber
通过一些标志来判断当前fiber发生的更新是处于什么阶段，来计算相应的到期时间。

```
function computeExpirationForFiber(currentTime: ExpirationTime, fiber: Fiber) {
  let expirationTime;
  if (expirationContext !== NoWork) {
    expirationTime = expirationContext;
  } else if (isWorking) {
    //在renderRoot与commitRoot阶段isWorking = true，结束之后都会是false
    //  下面就判断是哪个阶段
    if (isCommitting) {
      expirationTime = Sync;
    } else {
      expirationTime = nextRenderExpirationTime;
    }
  } else {
    if (fiber.mode & ConcurrentMode) {
      if (isBatchingInteractiveUpdates) {
        expirationTime = computeInteractiveExpiration(currentTime);
      } else {
        expirationTime = computeAsyncExpiration(currentTime);
      }
      if (nextRoot !== null && expirationTime === nextRenderExpirationTime) {
        expirationTime -= 1;
      }
    } else {
      expirationTime = Sync;
    }
  }
  if (isBatchingInteractiveUpdates) {
    if (
      lowestPriorityPendingInteractiveExpirationTime === NoWork ||
      expirationTime < lowestPriorityPendingInteractiveExpirationTime
    ) {
      lowestPriorityPendingInteractiveExpirationTime = expirationTime;
    }
  }
  return expirationTime;
}
```
主要判断的流程如下：

```
注意：同步Sync优先级最高

如果context有更新任务需要执行
    expirationTime设置为context上的到期时间
如果处于renderRoot渲染阶段或者commitRoot提交阶段
    如果处于commitRoot
        expirationTime设置为同步Sync
    否则（处于renderRoot）
        expirationTime设置为当前的到期时间nextRenderExpirationTime
否则
    如果不是Concurrent模式
        如果正在批处理交互式更新
            利用computeInteractiveExpiration计算expirationTime
        否则
            利用computeAsyncExpiration计算expirationTime
        如果有下一root树需要更新，并且到期时间与该树到期时间相等
            expirationTime减一，表示让下一个root先更新
    否则
        expirationTime设置为同步Sync

如果正在批处理交互式更新
    如果最低优先级的交互式更新优先级大于到期时间expirationTime或者没有交互式更新任务
        将最低优先级的交互式更新任务到期时间设置为到期时间expirationTime

最后返回expirationTime
```

#### 总结
同一个事件，同一个生命周期中的setState具备相同的到期时间，因此也存在了多个setState合并的结果。