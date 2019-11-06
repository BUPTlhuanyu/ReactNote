> 由于requestWork中会调用performSyncWork立即进入调度阶段或者调用scheduleCallbackWithExpirationTime将performAsyncWork推入scheduler进行异步调度，这个异步调度会在浏览器有空余时间或者这个performAsyncWork函数过期（过期是通过这个函数对应的timeout来确定的）来进行自动的触发。上一节已经分析了scheduleCallbackWithExpirationTime，因此来看一下performAsyncWork与performSyncWork这两个函数的作用。

## 🌳performSyncWork
如果当前的更新任务优先级特别高需要立即同步更新，那么会调用performSyncWork来执行同步的performWork
```
// performSyncWork 同步方式
// 直接执行performWork
function performSyncWork() {
  performWork(Sync, false);
}
```

## 🌳performAsyncWork
判断当前帧是否有空余时间或者当前任务是否过期，如果没有过期或者没时间则将didYield设置为false，否则：计算当前时间距离里react应用开始时间的时长；然后遍历root双向链表，筛选出更新任务过期的root，并将当前时间赋值给root.nextExpirationTimeToWorkOn作为后续是否执行更新任务的判断依据；最后开始调度每个root树上的更新任务。
```
function performAsyncWork() {
  try {
    if (!shouldYieldToRenderer()) {
      // 判断当前帧是否有空余时间或者这个任务是否过期，有空余时间或者任务过期则需要立即执行
      if (firstScheduledRoot !== null) {
        // 计算出当前调度的异步任务的时间，这个时间保存在currentRendererTime变量中，表示现在执行该函数到最初执行该js模块的时长
        recomputeCurrentRendererTime();
        let root: FiberRoot = firstScheduledRoot;
        do {
          // 判断root双向链表中每个root的更新任务是否到期，如果到期，则将当前时间设置为root的nextExpirationTimeToWorkOn
          // 该时间决定哪些节点的更新要在当前周期中被执行
          didExpireAtExpirationTime(root, currentRendererTime);
          // The root schedule is circular, so this is never null.
          root = (root.nextScheduledRoot: any);
        } while (root !== firstScheduledRoot);
      }
    }
    performWork(NoWork, true);
  } finally {
    didYield = false;
  }
}
```

#### 0️⃣shouldYieldToRenderer：判断当前帧是否有空余时间或者当前任务是否过期
```
let didYield: boolean = false;
// 返回false表示scheduler返回的异步任务的过期了，需要立即执行，而不是将js线程yield给(让给)浏览器renderer。
function shouldYieldToRenderer() {
  if (didYield) {
    return true;
  }
  if (shouldYield()) {
    didYield = true;
    return true;
  }
  return false;
}
```

#### 1️⃣recomputeCurrentRendererTime：当前时间距离里react应用开始时间的时长

```
function recomputeCurrentRendererTime() {
  // 当前时间为当前document已经存在的时长-最初执行该js模块document存在的时长
  // 因此该当前时间表示为现在执行该函数到最初执行该js模块的时长
  const currentTimeMs = now() - originalStartTimeMs;
  // 将ms单位的当前时间转换成到期时间
  currentRendererTime = msToExpirationTime(currentTimeMs);
}
```

#### 2️⃣didExpireAtExpirationTime：在循环遍历root双向链表，并调用该函数判断遍历到的当前root的更新任务是否已经过期，如果过期并将当前时间赋值给root.nextExpirationTimeToWorkOn作为后续是否执行更新任务的判断依据。

```
/**
 * 将当前时间与root上的到期时间进行对比，如果root上的到期时间比当前时间大，说明这个root上的更新任务过期了，需要立即执行
 * 然后将当前时间设置为root上的nextExpirationTimeToWorkOn，该时间决定哪些节点的更新要在当前周期中被执行
 */
export function didExpireAtExpirationTime(
  root: FiberRoot,
  currentTime: ExpirationTime,
): void {
  const expirationTime = root.expirationTime;
  if (expirationTime !== NoWork && currentTime <= expirationTime) {
    // The root has expired. Flush all work up to the current time.
    root.nextExpirationTimeToWorkOn = currentTime;
  }
}
```

#### 3️⃣performWork：开始调度每个root树上的更新任务
这里下一节会分析