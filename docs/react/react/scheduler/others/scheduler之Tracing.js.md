---
id: scheduler-tracing
sidebar_label: scheduler-tracing
slug: '/react/react/scheduler/others/scheduler-tracing'
sidebar_position: 2
title: ''
---

该文件用于定义interactions（交互事件集合），

# 变量 #

### enableSchedulerTracing变量 ###

	// packages\shared\ReactFeatureFlags.js中enableSchedulerTracing = __PROFILE__
	// 而在react-master\scripts\rollup\build.js中找到如下代码，表示构建过程中全局__PROFILE__的取值
	// isProfiling表明处于profile状态，isProduction表示在生产环境
	// __PROFILE__: isProfiling || !isProduction ? 'true' : 'false'
	// __PROFILE__为true，因此这里认为enableSchedulerTracing = true
	
	enableSchedulerTracing = true

### 初始化变量 ###
	默认线程id：DEFAULT_THREAD_ID
	交互事件数量：interactionIDCounter
	线程数量：threadIDCounter
	当前交互事件引用：interactionsRef
	当前订阅者引用：subscriberRef

	const DEFAULT_THREAD_ID = 0; 
	let interactionIDCounter = 0;
	let threadIDCounter = 0;
	let interactionsRef = {
            current: new Set()
        };
	let subscriberRef = {
            current: null
        };

# 交互事件集合方法 #

### unstable_clear ###
在执行callback()之前，清除interactionsRef.current集合，执行callback()之后，还原interactionsRef.current的值

	export function unstable_clear(callback: Function): any {
	  if (!enableSchedulerTracing) {
	    return callback();
	  }
	
	  const prevInteractions = interactionsRef.current;
	  interactionsRef.current = new Set();
	
	  try {
	    return callback();
	  } finally {
	    interactionsRef.current = prevInteractions;
	  }
	}

### unstable_getCurrent ###
获取interactionsRef.current

### unstable_getThreadID ###
增加线程数量threadIDCounter，并返回递增后的值

### unstable_trace ###
输入参数：

	  name: string,
	  timestamp: number,
	  callback: Function,
	  threadID: number = DEFAULT_THREAD_ID,

流程：

1. 根据传入的参数name、timestamp，以及当前交互事件数量interactionIDCounter构建一个interaction
	
		  const interaction: Interaction = {
		    __count: 1,
		    id: interactionIDCounter++,
		    name,
		    timestamp,
		  };

2. 保存当前interactionsRef.current为prevInteractions，将构建的interaction添加至interactionsRef.current集合中 
 
    	const prevInteractions = interactionsRef.current;
    	const interactions = new Set(prevInteractions);
		interactions.add(interaction);
		interactionsRef.current = interactions;

3. 获取当前订阅者

		const subscriber = subscriberRef.current;

4. 用try...finally保证依次执行当前订阅者的下列方法

	scheduler\src\TracingSubscriptions.js中subscribers订阅者集合所有的subscriber都会执行其subscriber.onInteractionTraced(interaction)

		subscriber.onInteractionTraced(interaction);
		subscriber.onWorkStarted(interactions, threadID);

5. 执行传入的回调函数callback，得到返回值returnValue

		returnValue = callback();

6. 恢复interactionsRef.current

		interactionsRef.current = prevInteractions;

7. 执行订阅者onWorkStopped方法

		subscriber.onWorkStopped(interactions, threadID);

8. 将interaction.__count减少，执行subscriber.onInteractionScheduledWorkCompleted

		interaction.__count--;

9. 返回returnValue	
		


### unstable_wrap ###
参数：

	  callback: Function,
	  threadID: number = DEFAULT_THREAD_ID,

流程：

1. const wrappedInteractions = interactionsRef.current;
	
		const wrappedInteractions = interactionsRef.current;

2. 执行subscriberRef.current上的onWorkScheduled，使scheduler\src\TracingSubscriptions.js中subscribers订阅者集合所有的subscriber执行onWorkScheduled函数 
 
		  let subscriber = subscriberRef.current;
		  if (subscriber !== null) {
		    subscriber.onWorkScheduled(wrappedInteractions, threadID);
		  }

3. 每个interaction.__count加一

		  wrappedInteractions.forEach(interaction => {
		    interaction.__count++;
		  });

4. 返回一个wrapped函数，用于执行subscriber上的函数、执行传入的回调函数callback，返回returnValue，最后执行subscriber.onInteractionScheduledWorkCompleted。其中wrapped.cancel用于执行subscriberRef.current.onWorkCanceled，以及onInteractionScheduledWorkCompleted

			function wrapped() {
		    const prevInteractions = interactionsRef.current;
		    interactionsRef.current = wrappedInteractions;
		
		    subscriber = subscriberRef.current;
		
		    try {
		      let returnValue;
		
		      try {
		        if (subscriber !== null) {
		          subscriber.onWorkStarted(wrappedInteractions, threadID);
		        }
		      } finally {
		        try {
		          returnValue = callback.apply(undefined, arguments);
		        } finally {
		          interactionsRef.current = prevInteractions;
		
		          if (subscriber !== null) {
		            subscriber.onWorkStopped(wrappedInteractions, threadID);
		          }
		        }
		      }
		
		      return returnValue;
		    } finally {
		      if (!hasRun) {
		        // We only expect a wrapped function to be executed once,
		        // But in the event that it's executed more than once–
		        // Only decrement the outstanding interaction counts once.
		        hasRun = true;
		
		        // Update pending async counts for all wrapped interactions.
		        // If this was the last scheduled async work for any of them,
		        // Mark them as completed.
		        wrappedInteractions.forEach(interaction => {
		          interaction.__count--;
		
		          if (subscriber !== null && interaction.__count === 0) {
		            subscriber.onInteractionScheduledWorkCompleted(interaction);
		          }
		        });
		      }
		    }
		  }
		
		  //  用于取消subscriber上订阅的wrappedInteractions
		  //  每个interaction.__count减一
		  wrapped.cancel = function cancel() {
		    subscriber = subscriberRef.current;
		
		    try {
		      if (subscriber !== null) {
		        subscriber.onWorkCanceled(wrappedInteractions, threadID);
		      }
		    } finally {
		      // Update pending async counts for all wrapped interactions.
		      // If this was the last scheduled async work for any of them,
		      // Mark them as completed.
		      wrappedInteractions.forEach(interaction => {
		        interaction.__count--;
		
		        if (subscriber && interaction.__count === 0) {
		          subscriber.onInteractionScheduledWorkCompleted(interaction);
		        }
		      });
		    }
		  };







