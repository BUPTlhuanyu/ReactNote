/**
 * Created by liaohuanyu on 2019/3/7.
 */
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable no-var */

// // TODO: Use symbols?
// // 优先级
// var ImmediatePriority = 1;
// var UserBlockingPriority = 2;
// var NormalPriority = 3;
// var LowPriority = 4;
// var IdlePriority = 5;
//
// // Max 31 bit integer. The max integer size in V8 for 32-bit systems.
// // Math.pow(2, 30) - 1
// // 0b111111111111111111111111111111
// var maxSigned31BitInt = 1073741823;
//
// //各个优先级对应的过期时间
// // Times out immediately
// var IMMEDIATE_PRIORITY_TIMEOUT = -1;
// // Eventually times out
// var USER_BLOCKING_PRIORITY = 250;
// var NORMAL_PRIORITY_TIMEOUT = 5000;
// var LOW_PRIORITY_TIMEOUT = 10000;
// // Never times out 空闲优先级，在1073741823后将回调函数加入任务队列的定时器
// var IDLE_PRIORITY = maxSigned31BitInt;
//
// // Callbacks are stored as a circular, doubly linked list.
// // 回调函数被存储双向循环链表中
// var firstCallbackNode = null;
// //当前的过期标志
// var currentDidTimeout = false;
// //当前优先级
// var currentPriorityLevel = NormalPriority;
// //当前事件开始时间？？？
// var currentEventStartTime = -1;
// //当前事件到期时间
// var currentExpirationTime = -1;
//
// // This is set when a callback is being executed, to prevent re-entrancy.
// // 是否正在执行最高优先级的回调函数的标记
// var isExecutingCallback = false;
//
// //是否已经安排回调
// var isHostCallbackScheduled = false;
//
// var hasNativePerformanceNow =
//     typeof performance === 'object' && typeof performance.now === 'function';
//
// function ensureHostCallbackIsScheduled() {
//     //是否正在执行最高优先级的回调函数
//     if (isExecutingCallback) {
//         // Don't schedule work yet; wait until the next time we yield.
//         return;
//     }
//     // Schedule the host callback using the earliest expiration in the list.
//     //  获取最小的到期时间
//     var expirationTime = firstCallbackNode.expirationTime;
//     //当前空闲时间还没有安排回调
//     if (!isHostCallbackScheduled) {
//         //将标志置为true
//         isHostCallbackScheduled = true;
//     } else {
//         //如果已经安排回调，则清除任务执行器，到期时间以及是否是否安排了Message事件的标记
//         // Cancel the existing host callback.
//         cancelHostCallback();
//     }
//     //传入第一个节点的到期时间，重新设置任务执行器，并在requestHostCallback函数中调用postMessage触发Message事件
//     // 在回调函数idleTick中立即执行任务执行器或者执行requestAnimationFrameWithTimeout将任务执行器的执行与否放到下一帧来判断
//     requestHostCallback(flushWork, expirationTime);
// }
//
// // 执行第一个节点的回调函数，并从链表中删除当前的第一个节点，
// // 如果回调函数返回的是一个函数，则利用这个函数创建一个新节点，
// // 由于新节点的到期时间与原第一个节点的到期时间一样，所以新节点将会替代原第一个节点的位置。
// function flushFirstCallback() {
//     //将firstCallbackNode赋值给flushedNode，作为当前需要被执行的任务节点
//     var flushedNode = firstCallbackNode;
//
//     // Remove the node from the list before calling the callback. That way the
//     // list is in a consistent state even if the callback throws.
//     //  从链表中删除第一个节点firstCallbackNode，原firstCallbackNode的后一个节点作为第一个节点
//     var next = firstCallbackNode.next;
//     if (firstCallbackNode === next) {
//         // This is the last callback in the list.
//         firstCallbackNode = null;
//         next = null;
//     } else {
//         var lastCallbackNode = firstCallbackNode.previous;
//         firstCallbackNode = lastCallbackNode.next = next;
//         next.previous = lastCallbackNode;
//     }
//     //将当前需要被执行的任务节点的next与previous置null，断开与链表的链接
//     flushedNode.next = flushedNode.previous = null;
//
//     // Now it's safe to call the callback.
//     var callback = flushedNode.callback;//该任务的回调函数
//     var expirationTime = flushedNode.expirationTime;//该任务的到期时间
//     var priorityLevel = flushedNode.priorityLevel;//该任务的优先级
//     var previousPriorityLevel = currentPriorityLevel;//保存当前优先级
//     var previousExpirationTime = currentExpirationTime;//保存当前到期时间
//     currentPriorityLevel = priorityLevel;//利用该任务的优先级刷新当前优先级
//     currentExpirationTime = expirationTime;//利用该任务的到期时间刷新当前到期时间
//     var continuationCallback;
//     try {
//         continuationCallback = callback();//执行该任务的回调函数，返回值保存在continuationCallback
//     } finally {
//         //注意如果callback是异步的，这里finally的子句不会等callback执行完在执行
//         //  try...finally是同步的
//         //  调用了回调函数之后恢复原有的当前优先级与当前到期时间
//         currentPriorityLevel = previousPriorityLevel;
//         currentExpirationTime = previousExpirationTime;
//     }
//
//     // A callback may return a continuation. The continuation should be scheduled
//     // with the same priority and expiration as the just-finished callback.
//     //  如果回调函数返回的是一个函数，则再创建一个任务节点
//     if (typeof continuationCallback === 'function') {
//         var continuationNode = {
//             callback: continuationCallback,
//             priorityLevel,
//             expirationTime,
//             next: null,
//             previous: null,
//         };
//
//         // Insert the new callback into the list, sorted by its expiration. This is
//         // almost the same as the code in `scheduleCallback`, except the callback
//         // is inserted into the list *before* callbacks of equal expiration instead
//         // of after.
//         //  将新生成的节点依照到期时间插入到链表中，与scheduleCallback函数中的区别是，
//         //  如果遇到相同的到期时间，则插入到其前面而不是后面
//         if (firstCallbackNode === null) {
//             // This is the first callback in the list.
//             //  如果此时任务队列为空，则该新节点为链表唯一的节点
//             firstCallbackNode = continuationNode.next = continuationNode.previous = continuationNode;
//         } else {
//
//             var nextAfterContinuation = null;
//             var node = firstCallbackNode;
//             do {
//                 if (node.expirationTime >= expirationTime) {
//                     // This callback expires at or after the continuation. We will insert
//                     // the continuation *before* this callback.
//                     nextAfterContinuation = node;
//                     break;
//                 }
//                 node = node.next;
//             } while (node !== firstCallbackNode);
//
//             if (nextAfterContinuation === null) {
//                 // No equal or lower priority callback was found, which means the new
//                 // callback is the lowest priority callback in the list.
//                 nextAfterContinuation = firstCallbackNode;
//             } else if (nextAfterContinuation === firstCallbackNode) {
//                 // The new callback is the highest priority callback in the list.
//                 //  如果返回的函数构成的节点优先级是最高的，那么需要将该节点单独设置为一个任务队列
//                 // 调用ensureHostCallbackIsScheduled重新设置任务执行器，并立即执行任务或者稍后执行任务
//                 firstCallbackNode = continuationNode;
//                 ensureHostCallbackIsScheduled();
//             }
//
//             var previous = nextAfterContinuation.previous;
//             previous.next = nextAfterContinuation.previous = continuationNode;
//             continuationNode.next = nextAfterContinuation;
//             continuationNode.previous = previous;
//         }
//     }
// }
//
// //执行任务队列中所有立即执行任务(最高优先级)的回调函数
// function flushImmediateWork() {
//     if (
//         // Confirm we've exited the outer most event handler
//     //  currentEventStartTime表示当前事件触发的开始时间
//     //如果firstCallbackNode任务具备最高优先级，则执行回调函数
//     currentEventStartTime === -1 &&
//     firstCallbackNode !== null &&
//     firstCallbackNode.priorityLevel === ImmediatePriority
//     ) {
//         //一个锁，用于标记是否正在执行最高优先级的任务
//         isExecutingCallback = true;
//         try {
//             //执行第一个节点的回调函数，直到第一个节点的优先级不是最高优先级（立即执行）
//             //  由于链表是按照到期时间排序，而最高优先级对应的到期时间最小，所以都会被安排在链表前面
//             //  因此这里就是执行队列中所有的立即执行任务的回调函数
//             do {
//                 flushFirstCallback();
//             } while (
//                 // Keep flushing until there are no more immediate callbacks
//             firstCallbackNode !== null &&
//             firstCallbackNode.priorityLevel === ImmediatePriority
//                 );
//         } finally {
//             //调用完所有的最高优先级节点的回调函数之后，将isExecutingCallback设置为false，表示现在没有执行最高优先级任务
//             isExecutingCallback = false;
//             if (firstCallbackNode !== null) {
//                 // There's still work remaining. Request another callback.
//                 // 重新设置任务执行器
//                 ensureHostCallbackIsScheduled();
//             } else {
//                 //队列为空，空闲时间没有安排任务
//                 isHostCallbackScheduled = false;
//             }
//         }
//     }
// }
//
// //传入的参数didTimeout为false，表示Message事件的回调函数执行的时候（执行的时候表明什么，什么时候postMessage），已经丢失了下一帧
// //为true，表示任务队列最小到期时间对应的任务已经过期了
// function flushWork(didTimeout) {
//     isExecutingCallback = true;//表示正在执行回调
//     const previousDidTimeout = currentDidTimeout;//保存当前的过期标志到previousDidTimeout
//     currentDidTimeout = didTimeout;//重新设置当前的过期标志
//     try {
//         if (didTimeout) {
//             // Flush all the expired callbacks without yielding.
//             //如果过期了
//             while (firstCallbackNode !== null) {
//                 // 第一个节点不为空，并且第一个节点过期了，则一直循环，直到第一个节点为空或者没有过期。
//                 // Read the current time. Flush all the callbacks that expire at or
//                 // earlier than that time. Then read the current time again and repeat.
//                 // This optimizes for as few performance.now calls as possible.
//                 //  刷新当前时间
//                 var currentTime = getCurrentTime();
//                 if (firstCallbackNode.expirationTime <= currentTime) {
//                     //如果第一个节点的到期时间小于当前时间，过期了
//                     do {
//                         //flushFirstCallback()：执行第一个节点的回调函数，并从链表中删除当前的第一个节点
//                         flushFirstCallback();
//                     } while (
//                         //  直到第一个节点为空或者第一个节点没有过期
//                     firstCallbackNode !== null &&
//                     firstCallbackNode.expirationTime <= currentTime
//                         );
//                     //第一个节点为空或者第一个节点没有过期
//                     continue;
//                 }
//                 //第一个节点为不为空但是第一个节点没有过期，则退出while(firstCallbackNode !== null)
//                 break;
//             }
//         } else {
//             // Keep flushing callbacks until we run out of time in the frame.
//             // 第一个节点不为空
//             if (firstCallbackNode !== null) {
//                 //一直循环flushFirstCallback();
//                 // 直到到下一帧过期，也就是到了计划的下一帧的时间了，代表着没有空闲时间给js执行代码了
//                 // 或者第一个节点为空，即任务队列为空，则停止刷新第一个节点
//                 do {
//                     flushFirstCallback();
//                 } while (firstCallbackNode !== null && !shouldYieldToHost());
//             }
//         }
//     } finally {
//         //最终将回调正在执行的标记置为false
//         isExecutingCallback = false;
//         //恢复之前的过期标志
//         currentDidTimeout = previousDidTimeout;
//         if (firstCallbackNode !== null) {
//             //如果第一个节点不为空，表示是因为下一帧的时间到了，而停止了回调的执行
//             //  这个时候请求下一次的回调，继续执行剩下的任务队列
//             // There's still work remaining. Request another callback.
//             ensureHostCallbackIsScheduled();
//         } else {
//             //如果都已经执行完了，任务队列为空的情况，则设置标记isHostCallbackScheduled为false，
//             // 空闲时间的使用权可以交给其他的任务队列
//             isHostCallbackScheduled = false;
//         }
//         // Before exiting, flush all the immediate work that was scheduled.
//         // 最后刷新所有的立即执行任务
//         flushImmediateWork();
//     }
// }
//
// //传入优先级priorityLevel与事件处理函数eventHandler
// //返回值为eventHandler()的值
// function unstable_runWithPriority(priorityLevel, eventHandler) {
//     switch (priorityLevel) {
//         case ImmediatePriority:
//         case UserBlockingPriority:
//         case NormalPriority:
//         case LowPriority:
//         case IdlePriority:
//             break;
//         default:
//             priorityLevel = NormalPriority;
//     }
//
//     //保护现场：保存当前优先级currentPriorityLevel与当前事件开始时间currentEventStartTime
//     var previousPriorityLevel = currentPriorityLevel;
//     var previousEventStartTime = currentEventStartTime;
//     //设置当前优先级
//     currentPriorityLevel = priorityLevel;
//     //将currentEventStartTime设置为当前时间
//     currentEventStartTime = getCurrentTime();
//
//     //执行传入的事件处理函数，恢复现场，并调用flushImmediateWork刷新被安排的所有的立即执行任务
//     try {
//         return eventHandler();
//     } finally {
//         currentPriorityLevel = previousPriorityLevel;
//         currentEventStartTime = previousEventStartTime;
//
//         // Before exiting, flush all the immediate work that was scheduled.
//         //   执行任务队列中所有立即执行任务(最高优先级)的回调函数
//         flushImmediateWork();
//     }
// }
//
// function unstable_wrapCallback(callback) {
//     //闭包中的内部变量，不gc，用于存储当前优先级
//     var parentPriorityLevel = currentPriorityLevel;
//     //返回一个被包裹的回调函数，执行该函数会执行回调函数
//     return function() {
//         //与runWithPriority逻辑一样，都是保护现场，执行回调然后恢复现场。
//         // This is a fork of runWithPriority, inlined for performance.
//         var previousPriorityLevel = currentPriorityLevel;
//         var previousEventStartTime = currentEventStartTime;
//         currentPriorityLevel = parentPriorityLevel;
//         currentEventStartTime = getCurrentTime();
//
//         try {
//             return callback.apply(this, arguments);
//         } finally {
//             currentPriorityLevel = previousPriorityLevel;
//             currentEventStartTime = previousEventStartTime;
//             flushImmediateWork();
//         }
//     };
// }
//
// //传入的参数deprecated_options.timeout可以用来指定callback执行的优先级
// //也就是可以影响插入到已有的任务链表的位置
// function unstable_scheduleCallback(callback, deprecated_options) {
//     //只有unstable_wrapCallback和unstable_runWithPriority会改变currentEventStartTime
//     // 因此在初始状态，currentEventStartTime=-1，所以startTime = getCurrentTime()
//     var startTime =
//         currentEventStartTime !== -1 ? currentEventStartTime : getCurrentTime();
//
//     //计算到期时间 = 开始时间 + 传入的参数options中的timeout
//     //deprecated_options.timeout表示多少毫秒之后过期
//     var expirationTime;
//     if (
//         typeof deprecated_options === 'object' &&
//         deprecated_options !== null &&
//         typeof deprecated_options.timeout === 'number'
//     ) {
//         // FIXME: Remove this branch once we lift expiration times out of React.
//         expirationTime = startTime + deprecated_options.timeout;
//     } else {
//         //根据当前优先级确定过期时间
//         //   初始状态下为currentPriorityLevel为NormalPriority,
//         switch (currentPriorityLevel) {
//             case ImmediatePriority:
//                 expirationTime = startTime + IMMEDIATE_PRIORITY_TIMEOUT;
//                 break;
//             case UserBlockingPriority:
//                 expirationTime = startTime + USER_BLOCKING_PRIORITY;
//                 break;
//             case IdlePriority:
//                 expirationTime = startTime + IDLE_PRIORITY;
//                 break;
//             case LowPriority:
//                 expirationTime = startTime + LOW_PRIORITY_TIMEOUT;
//                 break;
//             case NormalPriority:
//             default:
//                 expirationTime = startTime + NORMAL_PRIORITY_TIMEOUT;
//         }
//     }
//
//     //新节点：保存了传入的回调函数，优先级，到期时间
//     var newNode = {
//         callback,
//         priorityLevel: currentPriorityLevel,
//         expirationTime,
//         next: null,//链表后一个节点
//         previous: null,//链表前一个节点
//     };
//
//     // Insert the new callback into the list, ordered first by expiration, then
//     // by insertion. So the new callback is inserted any other callback with
//     // equal expiration.
//     // 将当前包含回调函数的节点按照到期时间从firstNode开始以小到大的顺序插入到双向循环链表中，
//     if (firstCallbackNode === null) {
//         //如果任务队列为空，则将新节点组成一个双向循环链表，并执行ensureHostCallbackIsScheduled，开始调度
//         // This is the first callback in the list.
//         firstCallbackNode = newNode.next = newNode.previous = newNode;
//         ensureHostCallbackIsScheduled();
//     } else {
//         //如果任务队列不为空，将新节点插入循环链表，
//         var next = null;
//         var node = firstCallbackNode;
//         do {
//             if (node.expirationTime > expirationTime) {
//                 // The new callback expires before this one.
//                 next = node;
//                 break;
//             }
//             node = node.next;
//         } while (node !== firstCallbackNode);
//
//         if (next === null) {
//             //如果新节点的到期时间是最大的，则应该处于链表的末端
//             //对于双向循环链表而言，新节点的next为链表的第一个节点。
//             // No callback with a later expiration was found, which means the new
//             // callback has the latest expiration in the list.
//             next = firstCallbackNode;
//         } else if (next === firstCallbackNode) {
//             // The new callback has the earliest expiration in the entire list.
//             //  如果新节点的到期时间最小，则新节点就应该是链表的第一个节点
//             //  在插入之前，先执行ensureHostCallbackIsScheduled()进行调度
//             //  由于ensureHostCallbackIsScheduled的函数作用域链中最终是通过回调函数来调用flushWork函数来执行任务链表中的回调函数的，
//             //  属于异步事件，因此if外部的代码先于ensureHostCallbackIsScheduled()执行
//             firstCallbackNode = newNode;
//             ensureHostCallbackIsScheduled();
//         }
//
//         var previous = next.previous;
//         previous.next = next.previous = newNode;
//         newNode.next = next;
//         newNode.previous = previous;
//     }
//
//     return newNode;
// }
//
// //传入一个需要取消执行的节点，该节点是双向循环链表firstCallbackNode中的某一个节点
// //即传入的节点的回调函数将被取消不会被执行。
// //流程
// function unstable_cancelCallback(callbackNode) {
//     var next = callbackNode.next;
//     if (next === null) {
//         //因为双向循环链表只有一个节点的时候，其next指向自己，
//         //当这个双向循环链表中的某个节点的next为nul，说明该双向循环链表为空
//         //即任务队列已经取消了，直接返回
//         // Already cancelled.
//         return;
//     }
//
//     if (next === callbackNode) {
//         //如果双向链表只有传入的节点，直接清除双向链表firstCallbackNode即可
//         // This is the only scheduled callback. Clear the list.
//         firstCallbackNode = null;
//     } else {
//         // Remove the callback from its position in the list.
//         //  如果传入的需要取消回调的节点是第一个节点，那么直接将该节点的next当做链表的第一个节点
//         //  该节点还存在于该链表，没有删除
//         if (callbackNode === firstCallbackNode) {
//             firstCallbackNode = next;
//         }
//         //如果传入的不是第一个节点，则将该节点从链表中删除。
//         var previous = callbackNode.previous;
//         previous.next = next;
//         next.previous = previous;
//     }
//
//     //将该节点next与previous清除，但是该节点还是存在于链表中，只是不能通过该节点访问链表其他节点
//     //  其他节点可以访问到该节点
//     callbackNode.next = callbackNode.previous = null;
// }
//
// //获取当前的优先级currentPriorityLevel
// function unstable_getCurrentPriorityLevel() {
//     return currentPriorityLevel;
// }
//
// // 返回的boolean为false用于表示以下情况：
// // 1、帧截止时间过期并且任务最小到期时间过期、
// // 2、当前帧截止时间没有过期并且任务为空
// // 3、当前帧截止时间没有过期并且任务最小到期时间小于当前执行的任务节点的到期时间
// function unstable_shouldYield() {
//     return (
//         !currentDidTimeout &&
//         ((firstCallbackNode !== null &&
//         firstCallbackNode.expirationTime < currentExpirationTime) ||
//         shouldYieldToHost())
//     );
// }
//
// // The remaining code is essentially a polyfill for requestIdleCallback. It
// // works by scheduling a requestAnimationFrame, storing the time for the start
// // of the frame, then scheduling a postMessage which gets scheduled after paint.
// // Within the postMessage handler do as much work as possible until time + frame
// // rate. By separating the idle call into a separate event tick we ensure that
// // layout, paint and other browser work is counted against the available time.
// // The frame rate is dynamically adjusted.
//
// // We capture a local reference to any global, in case it gets polyfilled after
// // this module is initially evaluated. We want to be using a
// // consistent implementation.
// var localDate = Date;
//
// // This initialization code may run even on server environments if a component
// // just imports ReactDOM (e.g. for findDOMNode). Some environments might not
// // have setTimeout or clearTimeout. However, we always expect them to be defined
// // on the client. https://github.com/facebook/react/pull/13088
// var localSetTimeout = typeof setTimeout === 'function' ? setTimeout : undefined;
// var localClearTimeout =
//     typeof clearTimeout === 'function' ? clearTimeout : undefined;
//
// // We don't expect either of these to necessarily be defined, but we will error
// // later if they are missing on the client.
// var localRequestAnimationFrame =
//     typeof requestAnimationFrame === 'function'
//         ? requestAnimationFrame
//         : undefined;
// var localCancelAnimationFrame =
//     typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : undefined;
//
// var getCurrentTime;
//
// // requestAnimationFrame does not run when the tab is in the background. If
// // we're backgrounded we prefer for that work to happen so that the page
// // continues to load in the background. So we also schedule a 'setTimeout' as
// // a fallback.
// // TODO: Need a better heuristic for backgrounded work.
// var ANIMATION_FRAME_TIMEOUT = 100;
// var rAFID;
// var rAFTimeoutID;
// var requestAnimationFrameWithTimeout = function(callback) {
//     // schedule rAF and also a setTimeout
//     //  在调用requestAnimationFrame的时候，清除定时器
//     rAFID = localRequestAnimationFrame(function(timestamp) {
//         // cancel the setTimeout
//         localClearTimeout(rAFTimeoutID);
//         callback(timestamp);
//     });
//     //在转到后台的时候，使用定时器执行回调函数
//     rAFTimeoutID = localSetTimeout(function() {
//         // cancel the requestAnimationFrame
//         localCancelAnimationFrame(rAFID);
//         callback(getCurrentTime());
//     }, ANIMATION_FRAME_TIMEOUT);
// };
//
// if (hasNativePerformanceNow) {
//     var Performance = performance;
//     getCurrentTime = function() {
//         return Performance.now();
//     };
// } else {
//     getCurrentTime = function() {
//         return localDate.now();
//     };
// }
//
// var requestHostCallback;
// var cancelHostCallback;
// var shouldYieldToHost;
//
// if (typeof window !== 'undefined' && window._schedMock) {
//     // Dynamic injection, only for testing purposes.
//     // 动态注入，用于测试
//     var impl = window._schedMock;
//     requestHostCallback = impl[0];
//     cancelHostCallback = impl[1];
//     shouldYieldToHost = impl[2];
// } else if (
//     // If Scheduler runs in a non-DOM environment, it falls back to a naive
// // implementation using setTimeout.
// typeof window === 'undefined' ||
// // "addEventListener" might not be available on the window object
// // if this is a mocked "window" object. So we need to validate that too.
// typeof window.addEventListener !== 'function'
// ) {
//     //在non-DOM环境下
//     var _callback = null;
//     var _currentTime = -1;
//     var _flushCallback = function(didTimeout, ms) {
//         if (_callback !== null) {
//             var cb = _callback;
//             _callback = null;
//             try {
//                 _currentTime = ms;
//                 cb(didTimeout);
//             } finally {
//                 _currentTime = -1;
//             }
//         }
//     };
//     requestHostCallback = function(cb, ms) {
//         if (_currentTime !== -1) {
//             // Protect against re-entrancy.
//             setTimeout(requestHostCallback, 0, cb, ms);
//         } else {
//             _callback = cb;
//             setTimeout(_flushCallback, ms, true, ms);
//             setTimeout(_flushCallback, maxSigned31BitInt, false, maxSigned31BitInt);
//         }
//     };
//     cancelHostCallback = function() {
//         _callback = null;
//     };
//     shouldYieldToHost = function() {
//         return false;
//     };
//     getCurrentTime = function() {
//         return _currentTime === -1 ? 0 : _currentTime;
//     };
// } else {
//     if (typeof console !== 'undefined') {
//         // TODO: Remove fb.me link
//         if (typeof localRequestAnimationFrame !== 'function') {
//             console.error(
//                 "This browser doesn't support requestAnimationFrame. " +
//                 'Make sure that you load a ' +
//                 'polyfill in older browsers. https://fb.me/react-polyfills',
//             );
//         }
//         if (typeof localCancelAnimationFrame !== 'function') {
//             console.error(
//                 "This browser doesn't support cancelAnimationFrame. " +
//                 'Make sure that you load a ' +
//                 'polyfill in older browsers. https://fb.me/react-polyfills',
//             );
//         }
//     }
//
//     // scheduledHostCallback为任务队列执行器，存在表示有任务需要执行，不存在表示任务队列为空，
//     // 在requestHostCallback中设置为某个callback
//     var scheduledHostCallback = null;
//     var isMessageEventScheduled = false; //是否已经postMessage的标记
//     var timeoutTime = -1; //代表最高优先级任务firstCallbackNode的过期时间
//
//     var isAnimationFrameScheduled = false;//用于标记是否已经执行了requestAnimationFrameWithTimeout
//
//     var isFlushingHostCallback = false;//标记正在执行任务执行器，该标记相当于一个锁。
//
//     var frameDeadline = 0;
//     // We start out assuming that we run at 30fps but then the heuristic tracking
//     // will adjust this value to a faster fps if we get more frequent animation
//     // frames.
//     var previousFrameTime = 33; // ？
//     var activeFrameTime = 33; // 一帧的渲染时间33ms，这里假设 1s 30帧
//
//     shouldYieldToHost = function() {
//         return frameDeadline <= getCurrentTime();
//     };
//
//     // We use the postMessage trick to defer idle work until after the repaint.
//     //安全检查
//     var messageKey =
//         '__reactIdleCallback$' +
//         Math.random()
//             .toString(36)
//             .slice(2);
//     // window.addEventListener('message', idleTick, false);中的回调函数
//     var idleTick = function(event) {
//         if (event.source !== window || event.data !== messageKey) {
//             return;
//         }
//
//         isMessageEventScheduled = false;  //animationTick中执行postMessage之前将其置为true，只有在执行了Message回调函数idleTick中才会将其置为false。
//
//         var prevScheduledCallback = scheduledHostCallback;
//         var prevTimeoutTime = timeoutTime;
//         //置空任务队列执行器以及队列中firstNode中的最小的到期时间
//         scheduledHostCallback = null;
//         timeoutTime = -1;
//
//         //获取当前时间
//         var currentTime = getCurrentTime();
//
//         //标记任务队列最小的到期时间的节点以及当前帧截止时间是否过期
//         var didTimeout = false;
//         console.log("\nmessage event fired",getCurrentTime(),"frameDeadline",frameDeadline,"prevTimeoutTime",prevTimeoutTime)
//         if (frameDeadline - currentTime <= 0) {
//             // frameDeadline表示下一帧应该被渲染的时刻
//             // currentTime 表示当前时刻,由于会有其他js执行导致帧丢失，所以这个时间会大于
//             // 如果当前时刻大于frameDeadline，说明发生了阻塞，已经丢失了一帧
//             //  如果小于，说明下一帧还没有丢失，
//             // There's no time left in this idle period. Check if the callback has
//             // a timeout and whether it's been exceeded.
//             if (prevTimeoutTime !== -1 && prevTimeoutTime <= currentTime) {
//                 //任务队列最小的到期时间小于当前时间，说明已经过期，将其标志置为true
//                 // Exceeded the timeout. Invoke the callback even though there's no
//                 // time left.
//                 didTimeout = true;
//             } else {
//                 //如果没有过期
//                 // No timeout.
//                 if (!isAnimationFrameScheduled) {
//                     //没有设置requestAnimationFrameWithTimeout，将其标志isAnimationFrameScheduled置为true
//                     //并调用requestAnimationFrameWithTimeout，下一帧屏幕刷新之前执行animationTick
//                     // Schedule another animation callback so we retry later.
//                     isAnimationFrameScheduled = true;
//                     requestAnimationFrameWithTimeout(animationTick);
//                 }
//                 // Exit without invoking the callback.
//                 //  恢复任务队列与到期时间并返回
//                 scheduledHostCallback = prevScheduledCallback;
//                 timeoutTime = prevTimeoutTime;
//                 return;
//             }
//         }
//
//         //如果计划的下一帧没有丢失，就执行执行器，此时执行器中的didTimeout=false，表示没有过期（此处有疑问，难道能确保最小到期时间小于当前时间？）
//         //如果当前队列中最小的到期时间已经过期了，就说明应该立即执行队列中的该任务
//         if (prevScheduledCallback !== null) {
//             //标记正在执行任务执行器，该标记相当于一个锁。作用是isFlushingHostCallback参与决定是否允许postMessage
//             isFlushingHostCallback = true;
//             try {
//                 //执行任务执行器中的逻辑
//                 console.log("执行任务执行器中的逻辑")
//                 prevScheduledCallback(didTimeout);
//             } finally {
//                 //执行完之后置为false
//                 isFlushingHostCallback = false;
//             }
//         }
//     };
//     // Assumes that we have addEventListener in this environment. Might need
//     // something better for old IE.
//     // 监听message事件，idleTick回调函数接收一个event事件，
//     // 其中event.data是window.postMessage(data, '*');中传入的data
//     // event.source对发送消息的窗口对象的引用;
//     window.addEventListener('message', idleTick, false);
//
//     var animationTick = function(rafTime) {
//         if (scheduledHostCallback !== null) {
//             //如果任务执行器不为空，则在下一帧继续执行animationTick回调函数
//             // Eagerly schedule the next animation callback at the beginning of the
//             // frame. If the scheduler queue is not empty at the end of the frame, it
//             // will continue flushing inside that callback. If the queue *is* empty,
//             // then it will exit immediately. Posting the callback at the start of the
//             // frame ensures it's fired within the earliest possible frame. If we
//             // waited until the end of the frame to post the callback, we risk the
//             // browser skipping a frame and not firing the callback until the frame
//             // after that.
//             requestAnimationFrameWithTimeout(animationTick);
//         } else {
//             // 如果没有任务需要执行，直接返回，
//             // No pending work. Exit.
//             isAnimationFrameScheduled = false; //代表没有任务需要AnimationFrame执行
//             return;
//         }
//
//         //经过几次屏幕刷新之后，动态计算出正确的刷新频率
//         //  下一帧的时间 = 当前时间 - 先前的计划的下一帧的时间 + 时间间隔
//         //  如果浏览器刷新频率刚好是30hz，则nextFrameTime为0
//         //  如果刷新频率高于30hz，
//         var nextFrameTime = rafTime - frameDeadline + activeFrameTime;
//         if (
//             nextFrameTime < activeFrameTime &&
//             previousFrameTime < activeFrameTime
//         ) {
//             if (nextFrameTime < 8) {
//                 // Defensive coding. We don't support higher frame rates than 120hz.
//                 // If the calculated frame time gets lower than 8, it is probably a bug.
//                 // 不支持
//                 nextFrameTime = 8;
//             }
//             // If one frame goes long, then the next one can be short to catch up.
//             // If two frames are short in a row, then that's an indication that we
//             // actually have a higher frame rate than what we're currently optimizing.
//             // We adjust our heuristic dynamically accordingly. For example, if we're
//             // running on 120hz display or 90hz VR display.
//             // Take the max of the two in case one of them was an anomaly due to
//             // missed frame deadlines.
//             activeFrameTime =
//                 nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime;
//         } else {
//             previousFrameTime = nextFrameTime;
//         }
//         //计划的下一帧的时间 = 当前时间 + 调整后的时间间隔
//         console.log("\nanimation frame fired",getCurrentTime())
//         frameDeadline = rafTime + activeFrameTime;
//         console.log("rafTime",rafTime,"activeFrameTime",activeFrameTime,"frameDeadline",frameDeadline)
//         if (!isMessageEventScheduled) {
//             isMessageEventScheduled = true;//标记已经执行了postMessage
//             console.log("window.postMessage animationTick",getCurrentTime());
//             window.postMessage(messageKey, '*');
//         }
//     };
//
//     //用于设置任务执行器，与到期时间，该函数可以打断任务执行器的执行，重新运行新的任务执行器
//     requestHostCallback = function(callback, absoluteTimeout) {
//         console.log("requestHostCallback",getCurrentTime())
//         //给scheduledHostCallback任务执行器设置相应的执行逻辑
//         scheduledHostCallback = callback;
//         //设定到期时间
//         timeoutTime = absoluteTimeout;
//         if (isFlushingHostCallback || absoluteTimeout < 0) {
//             //立即执行，通过postMessage触发Message事件，在idleTick中执行执行器中的逻辑即callback
//             // Don't wait for the next frame. Continue working ASAP, in a new event.
//             window.postMessage(messageKey, '*');
//         } else if (!isAnimationFrameScheduled) {
//             //如果不是立即执行，并且还没有执行requestAnimationFrameWithTimeout设置下一帧刷新时的动作
//             //那么设置isAnimationFrameScheduled标记，并requestAnimationFrameWithTimeout
//             // If rAF didn't already schedule one, we need to schedule a frame.
//             // TODO: If this rAF doesn't materialize because the browser throttles, we
//             // might want to still have setTimeout trigger rIC as a backup to ensure
//             // that we keep performing work.
//             isAnimationFrameScheduled = true;
//             requestAnimationFrameWithTimeout(animationTick);
//         }
//     };
//
//     //清空执行器，到期时间以及是否是否安排了Message事件的标记
//     cancelHostCallback = function() {
//         scheduledHostCallback = null;
//         isMessageEventScheduled = false;
//         timeoutTime = -1;
//     };
// }
//
// var callbackTest = function(){
//     console.log("unstable_scheduleCallback callbackTest",getCurrentTime())
// }
//
// unstable_scheduleCallback(callbackTest,{})


//=============== message事件与requestAnimationFrame ================//
var start = null;
var element = document.getElementById("move")
element.style.position = 'absolute';

function step(timestamp) {
    if (!start) {
        console.log("postMessage",timestamp)
        window.postMessage({},"*");
        start = timestamp;
    }
    var progress = timestamp - start;
    element.style.left = Math.min(progress / 10, 200) + 'px';
    if (progress < 400) {
        window.requestAnimationFrame(step);
    }
}

var idleTick = function(){
    console.log("idleTick",performance.now())
}

window.addEventListener('message', idleTick, false);

window.requestAnimationFrame(step);

