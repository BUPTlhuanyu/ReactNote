# 设计思想 #
1、为各个事件回调函数设置相应的优先级，然后根据自定义或者默认优先级确定到期时间，以此为基础，构建一个双向循环列表当做任务队列，每个节点存储了任务的回调函数以及到期时间，优先级，前一个节点后一个节点。

2、形成的任务链表的执行准则是：当前帧有空闲时间，则执行任务。即便没有空闲时间但是当前任务链表有任务到期了或者有立即执行任务，那么必须执行的时候就以丢失几帧的代价，执行任务链表中到期的任务。执行完的任务都会被从链表中删除。每次在执行任务链表中到期的任务的那段时间里，顺便把优先级最高需要立即执行的任务都执行。

总览图：flush*为任务执行模块，主要用于执行任务的回调函数，对任务链表进行操作。idleTick与animationTick为直接调度模块，根据当前帧的空闲时间与任务链表最小到期时间来控制是否在当前帧执行任务链表还是在下一帧继续处理。ensureHostCallbackIsScheduled与requestHostCallback组成任务执行模块与调度模块的枢纽，协调两者的工作，并且ensureHostCallbackIsScheduled为外部API提供入口。

![](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D5/scheduler.png)


# 例子 #
考虑一种比较简单的逻辑，任务链表的执行主要是通过idleTick函数调用flushWork实现的，因此分析idleTick函数处理的三种情况：

情况1：当前帧截止时间大于当前时间，说明当前帧还有时间执行任务链表节点中的回调函数，因此执行flushWork。

情况2：如果当前帧截止时间小于或者等于当前时间，说明当前帧过期了，没有剩余时间执行任务回调函数，但是如果任务链表的最小到期时间已经过期了或者有立即执行的任务，那么说明这个任务链表中的任务非得执行不可，那就直接阻塞渲染，将接下的几个渲染帧的时间用来执行当前过期的任务链表。

情况3：如果当前帧截止时间小于或者等于当前时间，说明当前帧过期了，没有剩余时间执行任务回调函数，并且任务链表的最小到期时间还没到，因此这个任务链表还不急着执行，可以放到下一帧（animation frame fire的时候调用animationTick触发Message事件调用idleTick）去处理，依然分三种情况进行处理。

给出一张图如下或许你会有一个更加清晰的理解：

![](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D5/scheduler%E5%9F%BA%E6%9C%AC%E6%B5%81%E7%A8%8B.png)


# 优先级以及对应的过期时间 #
### 五个优先级 ###

	var ImmediatePriority = 1;
	var UserBlockingPriority = 2;
	var NormalPriority = 3;
	var LowPriority = 4;
	var IdlePriority = 5;

### 五个优先级对应的过期时间 ###

	var maxSigned31BitInt = 1073741823;
	//	过期时间
	var IMMEDIATE_PRIORITY_TIMEOUT = -1;
	var USER_BLOCKING_PRIORITY = 250;
	var NORMAL_PRIORITY_TIMEOUT = 5000;
	var LOW_PRIORITY_TIMEOUT = 10000;
	var IDLE_PRIORITY = maxSigned31BitInt;

# 一些变量 #

	// 回调函数被存储双向循环链表中
	var firstCallbackNode = null;
	//当前事件开始时间
	var currentEventStartTime = -1;
	//当前事件到期时间
	var currentExpirationTime = -1;

# 预备知识 #
### 浏览器渲染帧与显示屏的刷新频率 ###
帧：通俗来说就是一张一张展示的画面（学过电视原理的应该不会陌生，本人本科学电子做硬件的。），
由于现在广泛使用的屏幕都有固定的刷新率（比如最新的一般在 60Hz）， 在两次硬件刷新之间浏览器进行两次重绘是没有意义的只会消耗性能。因此浏览器的渲染出一帧画面的间隔应该就是硬件的每一帧图像的时间间隔，即刷新频率的倒数。

那么在浏览器呈现两幅图像的空闲（idle）时间里，也就是16.7ms的时间里需要执行如下操作：

- 脚本执行（JavaScript）：脚本造成了需要重绘的改动，比如增删 DOM、请求动画等
- 样式计算（CSS Object Model）：级联地生成每个节点的生效样式。
- 布局（Layout）：计算布局，执行渲染算法
- 重绘（Paint）：各层分别进行绘制（比如 3D 动画）
- 合成（Composite）：合成各层的渲染结果

在这16.7ms中，包括了js脚本执行，需要js线程，而渲染需要的是gui渲染线程，而这两个线程是互斥的。由于GUI渲染线程与JavaScript执行线程是互斥的关系，当浏览器在执行JavaScript程序的时候，GUI渲染线程会被保存在一个队列中，直到JS程序执行完成，才会接着执行。因此如果JS执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞的感觉。

如下图所示为渲染帧，代码在github中reactNote仓库中，这里展示一下：

	var start = null;
	var element = document.getElementById("move")
	element.style.position = 'absolute';
	
	function step(timestamp) {
	    console.log("timestamp",timestamp)
	    if (!start) start = timestamp;
	    var progress = timestamp - start;
	    element.style.left = Math.min(progress / 10, 200) + 'px';
	    if (progress < 400) {
	
	        window.requestAnimationFrame(step);
	        window.postMessage({},"*");
	    }
	}
	
	var idleTick = function(){
	    console.log("idleTick")
	}
	
	window.addEventListener('message', idleTick, false);
	
	window.requestAnimationFrame(step);

![](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D5/js%E6%B8%B2%E6%9F%93%E5%B8%A7.png)

#### 注意： ####

1、从图中可以看到布局重绘合成之后并不代表是帧的结束。本文的当前帧截止时间frameDeadLine是animation frame fired开始时间 + activeFrameTime，activeFrameTime这个值就是FPS，也就是浏览器当前的刷新频率，表示流畅程度，这个值随着系统的运行而变化。

2、从图中还可以看到postmessage在合成之后执行。

### [window.requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame) ###

当你准备更新动画时你应该调用此方法。这将使浏览器在下一次重绘之前调用你传入给该方法的动画函数(即你的回调函数)。回调函数执行次数通常是每秒60次，但在大多数遵循W3C建议的浏览器中，回调函数执行次数通常与浏览器屏幕刷新次数相匹配。为了提高性能和电池寿命，因此在大多数浏览器里，当`requestAnimationFrame()` 运行在后台标签页或者隐藏的`<iframe>` 里时，`requestAnimationFrame()` 会被暂停调用以提升性能和电池寿命。

**参数：**

对于传入的回调函数：下一次重绘之前更新动画帧所调用的函数。该回调函数会被传入`DOMHighResTimeStamp`参数，该参数与`performance.now()`的返回值相同，它表示`requestAnimationFrame() `开始去执行回调函数的时刻。

**返回值：**

一个 long 整数，请求 ID ，是回调列表中唯一的标识。是个非零值，没别的意义。你可以传这个值给 window.cancelAnimationFrame() 以取消回调函数。

注意：若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用`window.requestAnimationFrame()`

例如：

	var start = null;
	var element = document.getElementById('SomeElementYouWantToAnimate');
	element.style.position = 'absolute';
	
	function step(timestamp) {
	  if (!start) start = timestamp;
	  var progress = timestamp - start;
	  element.style.left = Math.min(progress / 10, 200) + 'px';
	  if (progress < 2000) {
	    window.requestAnimationFrame(step);
	  }
	}
	
	window.requestAnimationFrame(step);

这个例子中，第一次调用的时候当前的毫秒数赋值给timestamp并保存在start中，然后progress=0，元素保持不动，并调用`window.requestAnimationFrame(step)`在浏览器下次重绘之前继续更新下一帧动画。假设刷新频率为每秒60次，因此大约16.6ms之后刷新下一次，执行下一帧动画，此时传入step中的timestamp = performance.now() = 16.6，progress = 16.6，元素向左移动16.6px。这样循环下去，`progress > 2000`停止执行该动画。

### [window.cancelAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/cancelAnimationFrame) ###

取消一个先前通过调用window.requestAnimationFrame()方法添加到计划中的动画帧请求。


# 一些工具函数 #
### getCurrentTime ###
注意[window.performance.now()](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin)返回的是一个以毫秒为单位的数值，表示从打开当前文档到该命令执行的时候经历的毫秒数。Date.now()方法返回自1970年1月1日 00:00:00 UTC到当前时间的毫秒数。

	var getCurrentTime;	
	var localDate = Date;

	if (hasNativePerformanceNow) {
	  var Performance = performance;
	  getCurrentTime = function() {
	    return Performance.now();
	  };
	} else {
	  getCurrentTime = function() {
	    return localDate.now();
	  };
	}

### requestAnimationFrameWithTimeout ###
为了提高性能和电池寿命，在大多数浏览器里，当`requestAnimationFrame()` 运行在后台标签页或者隐藏的`<iframe>` 里时，`requestAnimationFrame()` 会被暂停调用以提升性能和电池寿命。但是react希望在后台运行的时候也能继续工作，所以封装了requestAnimationFrameWithTimeout来解决这个问题。

requestAnimationFrameWithTimeout的原理是运行在后台的时候，调用window.cancelAnimationFrame取消requestAnimationFrame()，利用定时器来执行callback；而在调用requestAnimationFrame的时候，清除定时器，执行callback

	var localRequestAnimationFrame =
	  	typeof requestAnimationFrame === 'function'
	    ? requestAnimationFrame
	    : undefined;
	var localCancelAnimationFrame =
	  	typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : undefined;
	var localSetTimeout = typeof setTimeout === 'function' ? setTimeout : 	undefined;
	var localClearTimeout =
	  	typeof clearTimeout === 'function' ? clearTimeout : undefined;
	

	var ANIMATION_FRAME_TIMEOUT = 100;
	var rAFID;
	var rAFTimeoutID;
	var requestAnimationFrameWithTimeout = function(callback) {
	  //在调用requestAnimationFrame的时候，清除定时器
	  rAFID = localRequestAnimationFrame(function(timestamp) {
	    // cancel the setTimeout
	    localClearTimeout(rAFTimeoutID);
	    callback(timestamp);
	  });
	  //在转到后台的时候，使用定时器执行回调函数
	  rAFTimeoutID = localSetTimeout(function() {
	    // cancel the requestAnimationFrame
	    localCancelAnimationFrame(rAFID);
	    callback(getCurrentTime());
	  }, ANIMATION_FRAME_TIMEOUT);
	};

# 主逻辑：利用Message事件与requestAnimationFrame进行调度 #
### 关键变量 ###

	  // scheduledHostCallback为任务队列执行器，存在表示有任务需要执行，不存在表示任务队列为空，
	  // 在requestHostCallback中设置为某个callback
	  var scheduledHostCallback = null;

	  var isMessageEventScheduled = false; //是否是否安排了Message事件的标记，animationTick中执行postMessage之前将其置为true，只有在执行了Message回调函数idleTick中以及用于取消任务的cancelHostCallback函数中中才会将其置为false。
	  var timeoutTime = -1; //代表最高优先级任务firstCallbackNode的过期时间
	
	  var isAnimationFrameScheduled = false;//用于标记是否已经执行了requestAnimationFrameWithTimeout
	
	  var isFlushingHostCallback = false;//标记正在执行任务执行器，该标记相当于一个锁。作用是isFlushingHostCallback参与决定是否允许postMessage
	
	  var frameDeadline = 0; //当前帧截止时间

	  var previousFrameTime = 33; // 用于保存上一帧的时间
	  var activeFrameTime = 33; // 一帧的渲染时间33ms，这里假设 1s 30帧
	  
	  //安全检查
	  var messageKey =
	    '__reactIdleCallback$' +
	    Math.random()
	      .toString(36)
	      .slice(2);

### 监听Message事件 ###
监听Message事件，传入回调函数，不允许捕获阶段触发。idleTick是用于在监听到Message事件触发的时候执行的回调函数。

	window.addEventListener('message', idleTick, false);

### 监听Message事件传入的回调函数idleTick ###
idleTick流程如下：

1、通过将当前帧截止时间与当前时间对比，判断当前帧是否有空余时间执行任务，如果有则到步骤3。

2、判断任务队列最小的到期时间小于当前时间，如果是，说明已经过期，将didTimeout标志置为true，执行第3步。如果还没有过期，并且没有调用requestAnimationFrameWithTimeout来设置在出现之后立马执行animationTick函数，则调用requestAnimationFrameWithTimeout。如果已经设置过了，就还原任务队列与到期时间并返回。

3、如果任务执行器存在，`isFlushingHostCallback = true`标记正在执行任务执行器，然后执行任务执行器中的逻辑prevScheduledCallback(didTimeout)，最后`isFlushingHostCallback = false`标记没有正在执行任务执行器。其中isFlushingHostCallback作用是参与决定是否允许postMessage。该标记在requestHostCallback中会见到，与该函数传入的absoluteTimeout一起决定是否window.postMessage(messageKey, '*');（此步骤如果第1步来的，didTimeout为false，第2步来的，则为true，表示任务队列的任务最小的到期时间对应的任务已经过期了。）


	  var idleTick = function(event) {
	    if (event.source !== window || event.data !== messageKey) {
	      return;
	    }
	
	    isMessageEventScheduled = false;  //animationTick中执行postMessage之前将其置为true，只有在执行了Message回调函数idleTick中才会将其置为false。
	
	    var prevScheduledCallback = scheduledHostCallback;
	    var prevTimeoutTime = timeoutTime;
	    //置空任务队列执行器以及队列中firstNode中的最小的到期时间
	    scheduledHostCallback = null;
	    timeoutTime = -1;
	
	    //获取当前时间
	    var currentTime = getCurrentTime();
	
	    //标记任务队列最小的到期时间的节点以及当前帧截止时间是否过期
	    var didTimeout = false;
	    if (frameDeadline - currentTime <= 0) {
	      // frameDeadline表示当前帧截止时间
	      // currentTime 表示当前时刻
	      // 如果当前时刻大于frameDeadline，说明发生了阻塞，已经丢失了一帧
	      //  如果小于，说明当前帧没有空闲时间，
	      // There's no time left in this idle period. Check if the callback has
	      // a timeout and whether it's been exceeded.
	      if (prevTimeoutTime !== -1 && prevTimeoutTime <= currentTime) {
	        //任务队列最小的到期时间小于当前时间，说明已经过期，将其标志置为true
	        // Exceeded the timeout. Invoke the callback even though there's no
	        // time left.
	        didTimeout = true;
	      } else {
	        //如果没有过期
	        // No timeout.
	        if (!isAnimationFrameScheduled) {
	          //没有设置requestAnimationFrameWithTimeout，将其标志isAnimationFrameScheduled置为true
	          //并调用requestAnimationFrameWithTimeout
	          // Schedule another animation callback so we retry later.
	          isAnimationFrameScheduled = true;
	          requestAnimationFrameWithTimeout(animationTick);
	        }
	        // Exit without invoking the callback.
	        //  恢复任务队列与到期时间并返回
	        scheduledHostCallback = prevScheduledCallback;
	        timeoutTime = prevTimeoutTime;
	        return;
	      }
	    }
	
	    //如果当前帧还有空闲时间，就执行执行器，此时执行器中的didTimeout=false，表示没有过期（此处有疑问，难道能确保最小到期时间小于当前时间？）
	    //如果当前队列中最小的到期时间已经过期了，就说明应该立即执行队列中的该任务
	    if (prevScheduledCallback !== null) {
	      //标记正在执行任务执行器，该标记相当于一个锁。作用是isFlushingHostCallback参与决定是否允许postMessage
	      isFlushingHostCallback = true;
	      try {
	        //执行任务执行器中的逻辑
	        prevScheduledCallback(didTimeout);
	      } finally {
	        //执行完之后置为false
	        isFlushingHostCallback = false;
	      }
	    }
	  };

### animation frame fired的回调函数animationTick ###
回调函数idleTick中在不立即执行任务执行器的时候，并且没有设置animationTick回调，则会执行requestAnimationFrameWithTimeout(animationTick)并退出，其中animationTick的作用如下：

1、如果任务执行器不为空，则在下一帧继续执行animationTick回调函数，并到第2步。如果任务执行器为空，表明没有任务需要在空闲时间里执行了，将isAnimationFrameScheduled标志置为false，表示没有设置animationTick，然后直接返回。
2、动态调整渲染一帧的时间，并计算出当前帧截止时间为当前时间 + 调整后的时间间隔
3、根据isMessageEventScheduled判断是否执行postMessage，避免打断之前安排的Message时间。


	var animationTick = function(rafTime) {
	    if (scheduledHostCallback !== null) {
	      //如果任务执行器不为空，则在下一帧继续执行animationTick回调函数
	      requestAnimationFrameWithTimeout(animationTick);
	    } else {
	      // 如果没有任务需要执行，直接返回，
	      isAnimationFrameScheduled = false; //代表没有任务需要AnimationFrame执行
	      return;
	    }
	
	    //经过几次屏幕刷新之后，动态计算出正确的刷新频率
	    //  下一帧的时间 = 当前时间 - 当前帧截止时间 + 时间间隔
	    //  如果浏览器刷新频率刚好是30hz，则nextFrameTime为0
	    //  如果刷新频率高于30hz，
	    var nextFrameTime = rafTime - frameDeadline + activeFrameTime;
	    if (
	      nextFrameTime < activeFrameTime &&
	      previousFrameTime < activeFrameTime
	    ) {
	      if (nextFrameTime < 8) {
	        nextFrameTime = 8;
	      }
	      activeFrameTime =
	        nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime;
	    } else {
	      previousFrameTime = nextFrameTime;
	    }
	    //当前帧截止时间 = 当前时间 + 调整后的时间间隔
	    frameDeadline = rafTime + activeFrameTime;
	        if (!isMessageEventScheduled) {
	      isMessageEventScheduled = true;//标记已经执行了postMessage
	      window.postMessage(messageKey, '*');
	    }
	  };

## 任务执行器对postMessage与requestAnimationFrameWithTimeout行为调度的关键函数 ##
任务执行器在某些条件下会调用一下三个函数来发起postMessage或者requestAnimationFrameWithTimeout对空闲时间内任务执行器的执行进行调度与控制。其中任务执行器会通过调用ensureHostCallbackIsScheduled函数来决定是调用否调用cancelHostCallback来清空执行器，到期时间以及是否是否安排了Message事件的标记；最后会调用requestHostCallback来重新设置任务执行器，并立即执行任务或者稍后执行任务。
### 被任务执行器调用以获取当前帧是否过期的函数：shouldYieldToHost ###
shouldYieldToHost返回当前帧是否过期，如果当前帧截止时间小于当前时间说明当前帧过期了，没有空闲时间了。

		var frameDeadline = 0;
		shouldYieldToHost = function() {
			return frameDeadline <= getCurrentTime();
		};

### 被任务执行器调用以控制postMessage行为的函数：cancelHostCallback ###

	  //清除执行器，到期时间以及是否是否安排了Message事件的标记
	  cancelHostCallback = function() {
	    scheduledHostCallback = null;
	    isMessageEventScheduled = false;
	    timeoutTime = -1;
	  };

### 被任务执行器调用以重新设置执行器控制postMessage与requestAnimationFrameWithTimeout行为的函数：requestHostCallback ###

requestHostCallback函数用于设置任务执行器，与到期时间，该函数可以重新运行一个新的任务执行器。其逻辑是：如果通过该函数设置了任务执行器，并设定了新的到期时间，根据isFlushingHostCallback表示的是否有任务执行器正在执行的标记以及到期时间，处理任务执行器是立即执行还是在下一帧进行调度。


	  requestHostCallback = function(callback, absoluteTimeout) {
	    //给scheduledHostCallback任务执行器设置相应的执行逻辑
	    scheduledHostCallback = callback;
	    //设定到期时间
	    timeoutTime = absoluteTimeout;
	    if (isFlushingHostCallback || absoluteTimeout < 0) {
	      //立即执行，通过postMessage触发Message事件，在idleTick中执行执行器中的逻辑即callback
	      // Don't wait for the next frame. Continue working ASAP, in a new event.
	      window.postMessage(messageKey, '*');
	    } else if (!isAnimationFrameScheduled) {
	      //如果不是立即执行，并且还没有执行requestAnimationFrameWithTimeout设置下一帧刷新时的动作
	      //那么设置isAnimationFrameScheduled标记，并requestAnimationFrameWithTimeout
	      // If rAF didn't already schedule one, we need to schedule a frame.
	      // TODO: If this rAF doesn't materialize because the browser throttles, we
	      // might want to still have setTimeout trigger rIC as a backup to ensure
	      // that we keep performing work.
	      isAnimationFrameScheduled = true;
	      requestAnimationFrameWithTimeout(animationTick);
	    }
	  };


# 任务执行器flushWork #
### 工具函数ensureHostCallbackIsScheduled ###
如果当前正在执行最高优先级的回调函数，则返回。否则，清空当前空闲时间安排的任务队列，重新设置任务执行器，并在requestHostCallback函数中调用postMessage触发Message事件
，在回调函数idleTick中立即执行任务执行器或者执行requestAnimationFrameWithTimeout将任务执行器的执行与否放到下一帧来判断

流程：

1、通过isExecutingCallback标记判断是否正在执行最高优先级的回调函数，如果是的，直接返回。如果不是继续执行第2步

2、获取最小的到期时间，即双向链表第一个节点的到期时间。根据isHostCallbackScheduled标记来判断帧与帧之间的时间间隔即空闲时间是否安排了回调函数（fasle表示没有安排回调函数），如果安排了回调函数，那么需要调用cancelHostCallback函数来清除任务执行器，到期时间以及是否是否安排了Message事件的标记。否则将isHostCallbackScheduled标记设置为true

3、执行requestHostCallback(flushWork, expirationTime)，传入第一个节点的到期时间，重新设置任务执行器，并立即执行任务或者稍后执行任务

	function ensureHostCallbackIsScheduled() {
	  //是否正在执行最高优先级的回调函数
	  if (isExecutingCallback) {
	    // Don't schedule work yet; wait until the next time we yield.
	    return;
	  }
	  // Schedule the host callback using the earliest expiration in the list.
	  //  获取最小的到期时间
	  var expirationTime = firstCallbackNode.expirationTime;
	  //当前空闲时间还没有安排回调
	  if (!isHostCallbackScheduled) {
	    //将标志置为true
	    isHostCallbackScheduled = true;
	  } else {
	    //如果已经安排回调，则清除任务执行器，到期时间以及是否是否安排了Message事件的标记
	    // Cancel the existing host callback.
	    cancelHostCallback();
	  }
	  //传入第一个节点的到期时间，重新设置任务执行器，并在requestHostCallback函数中调用postMessage触发Message事件
	  // 在回调函数idleTick中立即执行任务执行器或者执行requestAnimationFrameWithTimeout将任务执行器的执行与否放到下一帧来判断
	  requestHostCallback(flushWork, expirationTime);
	}

### 任务执行器flushWork ###
传入的参数didTimeout为true，表示任务队列最小到期时间对应的任务已经过期了，需要立即执行
为false，表示当前帧有空余时间

流程：

1、将正在执行回调的标记isExecutingCallback置为true，保存当前的过期标志，重新设置当前的过期标志，如果过期了，执行第2步；如果没有过期，执行第3步。

2、依次执行firstCallbackNode任务队列第一个节点的回调函数，然后从firstCallbackNode任务队列中删除第一个节点。直到第一个节点还没有过期或者任务队列都执行了回调函数。判断节点是否过期，根据当前时间与节点存储的到期时间比较来判断。

3、依次执行firstCallbackNode任务队列第一个节点的回调函数，然后从firstCallbackNode任务队列中删除第一个节点。直到任务队列为空或者当前时间大于当前帧截止时间。

4、将回调正在执行的标记isExecutingCallback置为false，并恢复过期标志。最后判断，任务队列是否为空，如果为空则标记`isHostCallbackScheduled = false`，表示空闲时间没有安排任务队列。如果不为空，则执行ensureHostCallbackIsScheduled，将剩下的任务队列安排到在下一空闲时间段。

5、最后执行flushImmediateWork，执行任务队列中所有立即执行任务(最高优先级)的回调函数。

	function flushWork(didTimeout) {
	  isExecutingCallback = true;//表示正在执行回调
	  const previousDidTimeout = currentDidTimeout;//保存当前的过期标志到previousDidTimeout
	  currentDidTimeout = didTimeout;//重新设置当前的过期标志
	  try {
	    if (didTimeout) {
	      // Flush all the expired callbacks without yielding.
	        //如果过期了
	      while (firstCallbackNode !== null) {
	          // 第一个节点不为空，并且第一个节点过期了，则一直循环，直到第一个节点为空或者没有过期。
	        // Read the current time. Flush all the callbacks that expire at or
	        // earlier than that time. Then read the current time again and repeat.
	        // This optimizes for as few performance.now calls as possible.
	        //  刷新当前时间
	        var currentTime = getCurrentTime();
	        if (firstCallbackNode.expirationTime <= currentTime) {
	          //如果第一个节点的到期时间小于当前时间，过期了
	          do {
	            //flushFirstCallback()：执行第一个节点的回调函数，并从链表中删除当前的第一个节点
	            flushFirstCallback();
	          } while (
	            //  直到第一个节点为空或者第一个节点没有过期
	            firstCallbackNode !== null &&
	            firstCallbackNode.expirationTime <= currentTime
	          );
	          //第一个节点为空或者第一个节点没有过期
	          continue;
	        }
	          //第一个节点为不为空但是第一个节点没有过期，则退出while(firstCallbackNode !== null)
	        break;
	      }
	    } else {
	      // Keep flushing callbacks until we run out of time in the frame.
	        // 第一个节点不为空
	      if (firstCallbackNode !== null) {
	        //一直循环flushFirstCallback();
	          // 直到当前帧没有空余时间可用
	          // 或者第一个节点为空，即任务队列为空，则停止刷新第一个节点
	        do {
	          flushFirstCallback();
	        } while (firstCallbackNode !== null && !shouldYieldToHost());
	      }
	    }
	  } finally {
	    //最终将回调正在执行的标记置为false
	    isExecutingCallback = false;
	    //恢复之前的过期标志
	    currentDidTimeout = previousDidTimeout;
	    if (firstCallbackNode !== null) {
	      // 如果第一个节点不为空，表示是因为当前帧没有空余时间了，而停止了回调的执行
	      //  这个时候请求下一次的回调，继续执行剩下的任务队列
	      // There's still work remaining. Request another callback.
	      ensureHostCallbackIsScheduled();
	    } else {
	      //如果都已经执行完了，任务队列为空的情况，则设置标记isHostCallbackScheduled为false，
	      // 空闲时间的使用权可以交给其他的任务队列
	      isHostCallbackScheduled = false;
	    }
	    // Before exiting, flush all the immediate work that was scheduled.
	    // 最后刷新所有的立即执行任务
	    flushImmediateWork();
	  }
	}

### flushFirstCallback ###
流程：

1、执行第一个节点的回调函数，并从链表中删除当前的第一个节点，如果回调函数返回的是一个函数，则利用这个函数创建一个新节点`continuationNode`

2、如果新节点的优先级最高，则执行`firstCallbackNode = continuationNode`，并调用`ensureHostCallbackIsScheduled`。否则，到第3步。

3、最后，由于新节点的到期时间与原第一个节点的到期时间一样，所以新节点将会替代原第一个节点的位置。

在上述过程中，由于第2步设计到异步事件，所以第三步会在第二步之前改变任务链表。

	function flushFirstCallback() {
	  //将firstCallbackNode赋值给flushedNode，作为当前需要被执行的任务节点
	  var flushedNode = firstCallbackNode;
	
	  // Remove the node from the list before calling the callback. That way the
	  // list is in a consistent state even if the callback throws.
	  //  从链表中删除第一个节点firstCallbackNode，原firstCallbackNode的后一个节点作为第一个节点
	  var next = firstCallbackNode.next;
	  if (firstCallbackNode === next) {
	    // This is the last callback in the list.
	    firstCallbackNode = null;
	    next = null;
	  } else {
	    var lastCallbackNode = firstCallbackNode.previous;
	    firstCallbackNode = lastCallbackNode.next = next;
	    next.previous = lastCallbackNode;
	  }
	  //将当前需要被执行的任务节点的next与previous置null，断开与链表的链接
	  flushedNode.next = flushedNode.previous = null;
	
	  // Now it's safe to call the callback.
	  var callback = flushedNode.callback;//该任务的回调函数
	  var expirationTime = flushedNode.expirationTime;//该任务的到期时间
	  var priorityLevel = flushedNode.priorityLevel;//该任务的优先级
	  var previousPriorityLevel = currentPriorityLevel;//保存当前优先级
	  var previousExpirationTime = currentExpirationTime;//保存当前到期时间
	  currentPriorityLevel = priorityLevel;//利用该任务的优先级刷新当前优先级
	  currentExpirationTime = expirationTime;//利用该任务的到期时间刷新当前到期时间
	  var continuationCallback;
	  try {
	    continuationCallback = callback();//执行该任务的回调函数，返回值保存在continuationCallback
	  } finally {
	    //注意如果callback是异步的，这里finally的子句不会等callback执行完在执行
	    //  try...finally是同步的
	    //  调用了回调函数之后恢复原有的当前优先级与当前到期时间
	    currentPriorityLevel = previousPriorityLevel;
	    currentExpirationTime = previousExpirationTime;
	  }
	
	  // A callback may return a continuation. The continuation should be scheduled
	  // with the same priority and expiration as the just-finished callback.
	  //  如果回调函数返回的是一个函数，则再创建一个任务节点
	  if (typeof continuationCallback === 'function') {
	    var continuationNode: CallbackNode = {
	      callback: continuationCallback,
	      priorityLevel,
	      expirationTime,
	      next: null,
	      previous: null,
	    };
	
	    // Insert the new callback into the list, sorted by its expiration. This is
	    // almost the same as the code in `scheduleCallback`, except the callback
	    // is inserted into the list *before* callbacks of equal expiration instead
	    // of after.
	    //  将新生成的节点依照到期时间插入到链表中，与scheduleCallback函数中的区别是，
	    //  如果遇到相同的到期时间，则插入到其前面而不是后面
	    if (firstCallbackNode === null) {
	      // This is the first callback in the list.
	      //  如果此时任务队列为空，则该新节点为链表唯一的节点
	      firstCallbackNode = continuationNode.next = continuationNode.previous = continuationNode;
	    } else {
	
	      var nextAfterContinuation = null;
	      var node = firstCallbackNode;
	      do {
	        if (node.expirationTime >= expirationTime) {
	          // This callback expires at or after the continuation. We will insert
	          // the continuation *before* this callback.
	          nextAfterContinuation = node;
	          break;
	        }
	        node = node.next;
	      } while (node !== firstCallbackNode);
	
	      if (nextAfterContinuation === null) {
	        // No equal or lower priority callback was found, which means the new
	        // callback is the lowest priority callback in the list.
	        nextAfterContinuation = firstCallbackNode;
	      } else if (nextAfterContinuation === firstCallbackNode) {
	        // The new callback is the highest priority callback in the list.
	        //  如果返回的函数构成的节点优先级是最高的，那么需要将该节点单独设置为一个任务队列
	          // 调用ensureHostCallbackIsScheduled重新设置任务执行器，并立即执行任务或者稍后执行任务
	        firstCallbackNode = continuationNode;
	        ensureHostCallbackIsScheduled();
	      }
	
	      var previous = nextAfterContinuation.previous;
	      previous.next = nextAfterContinuation.previous = continuationNode;
	      continuationNode.next = nextAfterContinuation;
	      continuationNode.previous = previous;
	    }
	  }
	}


### flushImmediateWork ###
执行任务队列中所有立即执行任务(最高优先级)的回调函数，这些回调函数的是不能被打断的，因为在重新执行其他任务队列的时候，会先判断isExecutingCallback这个标记，如果为true，说明在执行最高优先级的回调，直接返回。

流程：

1、如果firstCallbackNode任务具备最高优先级，并且currentEventStartTime === -1（？），则标记处于正在执行最高优先级的任务的节点。

2、执行第一个节点的回调函数，直到第一个节点的优先级不是最高优先级（立即执行），由于链表是按照到期时间排序，而最高优先级对应的到期时间最小，所以都会被安排在链表前面。因此这里就是执行队列中所有的立即执行任务的回调函数

3、调用完所有的最高优先级节点的回调函数之后，将isExecutingCallback设置为false，表示现在没有执行最高优先级任务。如果还有任务没执行完，那么重新设置任务执行器，否则设置`isHostCallbackScheduled = false`表示队列为空，空闲时间没有安排任务。

	function flushImmediateWork() {
	  if (
	    // Confirm we've exited the outer most event handler
	    //  currentEventStartTime表示当前事件触发的开始时间
	    //如果firstCallbackNode任务具备最高优先级，则执行回调函数
	    currentEventStartTime === -1 &&
	    firstCallbackNode !== null &&
	    firstCallbackNode.priorityLevel === ImmediatePriority
	  ) {
	    //一个锁，用于标记是否正在执行最高优先级的任务
	    isExecutingCallback = true;
	    try {
	        //执行第一个节点的回调函数，直到第一个节点的优先级不是最高优先级（立即执行）
	      //  由于链表是按照到期时间排序，而最高优先级对应的到期时间最小，所以都会被安排在链表前面
	      //  因此这里就是执行队列中所有的立即执行任务的回调函数
	      do {
	        flushFirstCallback();
	      } while (
	        // Keep flushing until there are no more immediate callbacks
	        firstCallbackNode !== null &&
	        firstCallbackNode.priorityLevel === ImmediatePriority
	      );
	    } finally {
	      //调用完所有的最高优先级节点的回调函数之后，将isExecutingCallback设置为false，表示现在没有执行最高优先级任务
	      isExecutingCallback = false;
	      if (firstCallbackNode !== null) {
	        // There's still work remaining. Request another callback.
	        // 重新设置任务执行器
	        ensureHostCallbackIsScheduled();
	      } else {
	        //队列为空，空闲时间没有安排任务
	        isHostCallbackScheduled = false;
	      }
	    }
	  }
	}


# API #
这只贴unstable_scheduleCallback代码以及注释，具体的注释与解析请关注[reactNote](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/packages/scheduler/src/Scheduler.js)，scheduler测试代码具体可以关注[reactNote](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/runlogic/scheduler.html)

	unstable_runWithPriority
	unstable_wrapCallback
	unstable_scheduleCallback
	unstable_cancelCallback
	unstable_getCurrentPriorityLevel
	unstable_shouldYield




### unstable_scheduleCallback ###
传入参数：

	callback，//任务的回调函数
	deprecated_options //包含自定义的到期时长timeout，可以用来指定callback执行的到时间，
						 也就是可以影响插入到已有的任务链表的位置，可以使传入的callback回调函数在当前帧paint之前执行，即立即执行。

功能：
计算开始时间，然后根据传入的参数deprecated\_options.timeout计算到期时间 = 开始时间 + 传入的参数options中的timeout，如果deprecated\_options.timeout不存在，根据默认优先级计算到期时间。封装成一个节点，如下；

	  //新节点：保存了传入的回调函数，优先级，到期时间
	  var newNode = {
	    callback,
	    priorityLevel: currentPriorityLevel,
	    expirationTime,
	    next: null,//链表后一个节点
	    previous: null,//链表前一个节点
	  };

最后按照到期时间的大小，从firstNode开始以小到大的顺序插入到双向循环链表中firstCallbackNode中，返回一个新的链表。 

源码：

	function unstable_scheduleCallback(callback, deprecated_options) {
	    //只有unstable_wrapCallback和unstable_runWithPriority会改变currentEventStartTime
	    // 因此在初始状态，currentEventStartTime=-1，所以startTime = getCurrentTime()
	    var startTime =
	        currentEventStartTime !== -1 ? currentEventStartTime : getCurrentTime();
	
	    //计算到期时间 = 开始时间 + 传入的参数options中的timeout
	    //deprecated_options.timeout表示多少毫秒之后过期
	    var expirationTime;
	    if (
	        typeof deprecated_options === 'object' &&
	        deprecated_options !== null &&
	        typeof deprecated_options.timeout === 'number'
	    ) {
	        // FIXME: Remove this branch once we lift expiration times out of React.
	        expirationTime = startTime + deprecated_options.timeout;
	    } else {
	        //根据当前优先级确定过期时间
	        //   初始状态下为currentPriorityLevel为NormalPriority,
	        switch (currentPriorityLevel) {
	            case ImmediatePriority:
	                expirationTime = startTime + IMMEDIATE_PRIORITY_TIMEOUT;
	                break;
	            case UserBlockingPriority:
	                expirationTime = startTime + USER_BLOCKING_PRIORITY;
	                break;
	            case IdlePriority:
	                expirationTime = startTime + IDLE_PRIORITY;
	                break;
	            case LowPriority:
	                expirationTime = startTime + LOW_PRIORITY_TIMEOUT;
	                break;
	            case NormalPriority:
	            default:
	                expirationTime = startTime + NORMAL_PRIORITY_TIMEOUT;
	        }
	    }
	
	    //新节点：保存了传入的回调函数，优先级，到期时间
	    var newNode = {
	        callback,
	        priorityLevel: currentPriorityLevel,
	        expirationTime,
	        next: null,//链表后一个节点
	        previous: null,//链表前一个节点
	    };
	
	    // Insert the new callback into the list, ordered first by expiration, then
	    // by insertion. So the new callback is inserted any other callback with
	    // equal expiration.
	    // 将当前包含回调函数的节点按照到期时间从firstNode开始以小到大的顺序插入到双向循环链表中，
	    if (firstCallbackNode === null) {
	        //如果任务队列为空，则将新节点组成一个双向循环链表，并执行ensureHostCallbackIsScheduled，开始调度
	        // This is the first callback in the list.
	        firstCallbackNode = newNode.next = newNode.previous = newNode;
	        ensureHostCallbackIsScheduled();
	    } else {
	        //如果任务队列不为空，将新节点插入循环链表，
	        var next = null;
	        var node = firstCallbackNode;
	        do {
	            if (node.expirationTime > expirationTime) {
	                // The new callback expires before this one.
	                next = node;
	                break;
	            }
	            node = node.next;
	        } while (node !== firstCallbackNode);
	
	        if (next === null) {
	            //如果新节点的到期时间是最大的，则应该处于链表的末端
	            //对于双向循环链表而言，新节点的next为链表的第一个节点。
	            // No callback with a later expiration was found, which means the new
	            // callback has the latest expiration in the list.
	            next = firstCallbackNode;
	        } else if (next === firstCallbackNode) {
	            // The new callback has the earliest expiration in the entire list.
	            //  如果新节点的到期时间最小，则新节点就应该是链表的第一个节点
	            //  在插入之前，先执行ensureHostCallbackIsScheduled()进行调度
	            //  由于ensureHostCallbackIsScheduled的函数作用域链中最终是通过回调函数来调用flushWork函数来执行任务链表中的回调函数的，
	            //  属于异步事件，因此if外部的代码先于ensureHostCallbackIsScheduled()执行
	            firstCallbackNode = newNode;
	            ensureHostCallbackIsScheduled();
	        }
	
	        var previous = next.previous;
	        previous.next = next.previous = newNode;
	        newNode.next = next;
	        newNode.previous = previous;
	    }
	
	    return newNode;
	}






	