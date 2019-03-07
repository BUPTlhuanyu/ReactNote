订阅者对象相关定义，该js脚本用于定义__subscriberRef.current以及添加删除subscribers集合。

### subscribers初始化为空集合 ###

	subscribers = new Set();

### unstable_subscribe ###
添加subscriber到subscribers集合，如果subscribers集合只有刚添加的subscriber，则将__subscriberRef.current构建成一个对象，并添加一些方法。

	export function unstable_subscribe(subscriber: Subscriber): void {
	  if (enableSchedulerTracing) {
	    subscribers.add(subscriber);
	
	    if (subscribers.size === 1) {
	      __subscriberRef.current = {
	        onInteractionScheduledWorkCompleted,
	        onInteractionTraced,
	        onWorkCanceled,
	        onWorkScheduled,
	        onWorkStarted,
	        onWorkStopped,
	      };
	    }
	  }
	}

### unstable_unsubscribe ###
删除subscribers集合中指定的subscriber，如果集合为空，则__subscriberRef.current = null

	export function unstable_unsubscribe(subscriber: Subscriber): void {
	  if (enableSchedulerTracing) {
	    subscribers.delete(subscriber);
	
	    if (subscribers.size === 0) {
	      __subscriberRef.current = null;
	    }
	  }
	}

### __subscriberRef.current上定义的方法 ###

	onInteractionScheduledWorkCompleted,
	onInteractionTraced,
	onWorkCanceled,
	onWorkScheduled,
	onWorkStarted,
	onWorkStopped,

当执行__subscriberRef.current某个方法时，subscribers集合中所有的subscriber都会执行这个方法。如下：

	function onInteractionTraced(interaction: Interaction): void {
	  let didCatchError = false;
	  let caughtError = null;
	
	  //为了不打断forEach，设置didCatchError与caughtError
	  subscribers.forEach(subscriber => {
	    try {
	      subscriber.onInteractionTraced(interaction);
	    } catch (error) {
	      //记录第一个发生错误的信息
	      if (!didCatchError) {
	        didCatchError = true;
	        caughtError = error;
	      }
	    }
	  });
	
	  if (didCatchError) {
	    throw caughtError;
	  }
	}

注意：forEach中try...catch将第一个错误存储下来之后，不会直接throw，以免打断forEach导致其他subscriber不执行其相应的方法。