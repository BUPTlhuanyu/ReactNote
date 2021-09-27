import { Children, cloneElement, isValidElement } from 'react'

/**
 * Given `this.props.children`, return an object mapping key to child.
 *
 * @param {*} children `this.props.children`
 * @return {object} Mapping of key to child
 */
export function getChildMapping(children, mapFn) {
  let mapper = child => (mapFn && isValidElement(child) ? mapFn(child) : child)

  let result = Object.create(null)
  if (children)
    Children.map(children, c => c).forEach(child => {
      // run the map function here instead so that the key is the computed one
      result[child.key] = mapper(child)
    })
  return result
}

/**
 * When you're adding or removing children some may be added or removed in the
 * same render pass. We want to show *both* since we want to simultaneously
 * animate elements in and out. This function takes a previous set of keys
 * and a new set of keys and merges them with its best guess of the correct
 * ordering. In the future we may expose some of the utilities in
 * ReactMultiChild to make this easy, but for now React itself does not
 * directly have this concept of the union of prevChildren and nextChildren
 * so we implement it here.
 *
 * @param {object} prev prev children as returned from
 * `ReactTransitionChildMapping.getChildMapping()`.
 * @param {object} next next children as returned from
 * `ReactTransitionChildMapping.getChildMapping()`.
 * @return {object} a key set that contains all keys in `prev` and all keys
 * in `next` in a reasonable order.
 */
export function mergeChildMappings(prev, next) {
  prev = prev || {}
  next = next || {}

  function getValueForKey(key) {
    return key in next ? next[key] : prev[key]
  }

  // For each key of `next`, the list of keys to insert before that key in
  // the combined list
  let nextKeysPending = Object.create(null)

  let pendingKeys = []
  //  遍历prev对象
  for (let prevKey in prev) {
    if (prevKey in next) { //如果prevKey在next中
      if (pendingKeys.length) { //如果pendingKeys不为空，则将pendingKeys存入nextKeysPending[prevKey]，并置pendingKeys为空
        nextKeysPending[prevKey] = pendingKeys
        pendingKeys = []
      }
    } else { //如果不在next中将其push到pendingKeys中
      pendingKeys.push(prevKey)
    }
  }

    // var prev = {"a":1,"b":2,"c":3,"d":4,"e":5,"f":6,"g":7,"h":8};
    // var next = {"c":300,"d":400,"g":700};
    // let nextKeysPending = Object.create(null)
    //
    // let pendingKeys = []
    // //  遍历prev对象
    // for (let prevKey in prev) {
    //     if (prevKey in next) { //如果prevKey在next中
    //         if (pendingKeys.length) { //如果pendingKeys不为空，则将pendingKeys存入nextKeysPending[prevKey]，并置pendingKeys为空
    //             nextKeysPending[prevKey] = pendingKeys
    //             pendingKeys = []
    //         }
    //     } else { //如果不在next中将其push到pendingKeys中
    //         pendingKeys.push(prevKey)
    //     }
    // }

    // nextKeysPending = {
    //   c : ["a","b"],
    //   g : ["e","f"]
    // }

    // pendingKeys = ["h"]

    let i
  let childMapping = {}
  for (let nextKey in next) {
    if (nextKeysPending[nextKey]) {
      for (i = 0; i < nextKeysPending[nextKey].length; i++) {
        let pendingNextKey = nextKeysPending[nextKey][i]
        //  pendingNextKey存在于next，则取出存入childMapping[pendingNextKey]
        childMapping[nextKeysPending[nextKey][i]] = getValueForKey(
          pendingNextKey
        )
      }
    }
    //将例子中next.d的值赋值给合并之后的childMapping
    childMapping[nextKey] = getValueForKey(nextKey)
  }

  // 最后将pendingKeys保存的值赋值给childMapping
  // Finally, add the keys which didn't appear before any key in `next`
  for (i = 0; i < pendingKeys.length; i++) {
    childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i])
  }

  return childMapping
}

//如果props[prop]存在则返回props[prop]，否则返回child上的props[prop]
function getProp(child, prop, props) {
  return props[prop] != null ? props[prop] : child.props[prop]
}
//初始化childMap，克隆child并将child上的props覆盖
export function getInitialChildMapping(props, onExited) {
  return getChildMapping(props.children, child => {
    return cloneElement(child, {
      onExited: onExited.bind(null, child),
      in: true,
      appear: getProp(child, 'appear', props),
      enter: getProp(child, 'enter', props),
      exit: getProp(child, 'exit', props),
    })
  })
}

export function getNextChildMapping(nextProps, prevChildMapping, onExited) {
  let nextChildMapping = getChildMapping(nextProps.children)
  let children = mergeChildMappings(prevChildMapping, nextChildMapping)

  Object.keys(children).forEach(key => {
    let child = children[key]

    if (!isValidElement(child)) return

    const hasPrev = key in prevChildMapping
    const hasNext = key in nextChildMapping

    const prevChild = prevChildMapping[key]
    const isLeaving = isValidElement(prevChild) && !prevChild.props.in

    // item is new (entering)
    if (hasNext && (!hasPrev || isLeaving)) {
      // console.log('entering', key)
      children[key] = cloneElement(child, {
        onExited: onExited.bind(null, child),
        in: true,
        exit: getProp(child, 'exit', nextProps),
        enter: getProp(child, 'enter', nextProps),
      })
    } else if (!hasNext && hasPrev && !isLeaving) {
      // item is old (exiting)
      // console.log('leaving', key)
      children[key] = cloneElement(child, { in: false })
    } else if (hasNext && hasPrev && isValidElement(prevChild)) {
      // item hasn't changed transition states
      // copy over the last transition props;
      // console.log('unchanged', key)
      children[key] = cloneElement(child, {
        onExited: onExited.bind(null, child),
        in: prevChild.props.in,
        exit: getProp(child, 'exit', nextProps),
        enter: getProp(child, 'enter', nextProps),
      })
    }
  })

  return children
}
