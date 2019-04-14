### getParent ###
在react树中获取当前实例节点的父节点实例（该父节点只能是真实DOM对应的react节点实例，不能是text或者类组件或者函数组件等等）。
具体查看react\packages\shared\ReactWorkTags.js

	//HostComponent组件对应的DOM，比如App的tag=3, 表示为类组件，其child为tag=5对应div元素。
	function getParent(inst) {
	  do {
	    inst = inst.return;
	    // TODO: If this is a HostRoot we might want to bail out.
	    // That is depending on if we want nested subtrees (layers) to bubble
	    // events to their parent. We could also go through parentNode on the
	    // host node but that wouldn't work for React Native and doesn't let us
	    // do the portal feature.
	  } while (inst && inst.tag !== HostComponent);
	  if (inst) {
	    return inst;
	  }
	  return null;
	}

### getLowestCommonAncestor ###
获取节点A与B的最近的公共祖先节点

算法题：找到两个链表的公共节点

	export function getLowestCommonAncestor(instA, instB) {
	  //获取子节点A在树中的深度
	  let depthA = 0;
	  for (let tempA = instA; tempA; tempA = getParent(tempA)) {
	    depthA++;
	  }
	    //获取子节点B在树中的深度
	  let depthB = 0;
	  for (let tempB = instB; tempB; tempB = getParent(tempB)) {
	    depthB++;
	  }
	
	  // If A is deeper, crawl up.
	  // 如果A的高度高，那么A节点先往上走depthA - depthB个节点，最后同时走，直到父节点是同一个
	  while (depthA - depthB > 0) {
	    instA = getParent(instA);
	    depthA--;
	  }
	
	    // 如果B的高度高，那么B节点先往上走depthB - depthB个节点，最后同时走，直到父节点是同一个
	  // If B is deeper, crawl up.
	  while (depthB - depthA > 0) {
	    instB = getParent(instB);
	    depthB--;
	  }
	
	  // Walk in lockstep until we find a match.
	  // 现在，指针所处的位置的高度一致，可以同时往上查找，直到找到公共的节点
	  let depth = depthA;
	  while (depth--) {
	    if (instA === instB || instA === instB.alternate) {
	      return instA;
	    }
	    instA = getParent(instA);
	    instB = getParent(instB);
	  }
	  return null;
	}

### isAncestor ###
判断A节点是否是B节点的祖先节点

	export function isAncestor(instA, instB) {
	  while (instB) {
	    if (instA === instB || instA === instB.alternate) {
	      return true;
	    }
	    instB = getParent(instB);
	  }
	  return false;
	}

### getParentInstance ###
对getParent的export封装：

	export function getParentInstance(inst) {
	  return getParent(inst);
	}

### traverseTwoPhase ###
对inst及其以上的树执行冒泡捕获的操作，执行fn。类似事件的冒泡捕获

	export function traverseTwoPhase(inst, fn, arg) {
	  const path = [];
	  //将inst的父节点入栈，数组最后的为最远的祖先
	  while (inst) {
	    path.push(inst);
	    inst = getParent(inst);
	  }
	  let i;
	  //从最远的祖先开始向inst节点捕获执行fn
	  for (i = path.length; i-- > 0; ) {
	    fn(path[i], 'captured', arg);
	  }
	    //从inst节点开始向最远的祖先节点冒泡执行fn
	  for (i = 0; i < path.length; i++) {
	    fn(path[i], 'bubbled', arg);
	  }
	}

### traverseEnterLeave ###
当关注点从from节点移出然后移入to节点的时候,在from执行执行类似移入移出的操作

流程图如下：

```graph TD
    A((A)) --- |fn_B_| B((B))
    A --- |fn_C_| C((C))
    C --- D((D))
    C --- |fn_E_| E((E))
```

上述过程，当执行`traverseEnterLeave(E, B, fn, argFrom, argTo)`函数的时候，类似鼠标从节点from(即E节点)移入到节点to(即B节点)，这个时候会依次调用

    fn(E, 'bubbled', argFrom) --> fn(C, 'bubbled', argFrom) --> fn(B, 'captured', argTo)

这样的一个过程是从节点E冒泡到最低公共祖先节点A然后向下捕获直到节点B。过程中会依次调用fn。但是不会对最低公共祖先节点执行fn

	export function traverseEnterLeave(from, to, fn, argFrom, argTo) {
	  const common = from && to ? getLowestCommonAncestor(from, to) : null;
	  const pathFrom = [];
	  while (true) {
	    if (!from) {
	      break;
	    }
	    if (from === common) {
	      break;
	    }
	    const alternate = from.alternate;
	    if (alternate !== null && alternate === common) {
	      break;
	    }
	    pathFrom.push(from);
	    from = getParent(from);
	  }
	  const pathTo = [];
	  while (true) {
	    if (!to) {
	      break;
	    }
	    if (to === common) {
	      break;
	    }
	    const alternate = to.alternate;
	    if (alternate !== null && alternate === common) {
	      break;
	    }
	    pathTo.push(to);
	    to = getParent(to);
	  }
	  //以上代码将from节点到from与to节点的最近公共祖先节点（不包括公共祖先节点）push到pathFrom数组
	  //以上代码将to节点到from与to节点的最近公共祖先节点（不包括公共祖先节点）push到pathTo数组
	
	  // 以下代码用于对pathFrom冒泡，执行fn
	  for (let i = 0; i < pathFrom.length; i++) {
	    fn(pathFrom[i], 'bubbled', argFrom);
	  }
	    // 以下代码用于对pathTo捕获，执行fn
	  for (let i = pathTo.length; i-- > 0; ) {
	    fn(pathTo[i], 'captured', argTo);
	  }
	}