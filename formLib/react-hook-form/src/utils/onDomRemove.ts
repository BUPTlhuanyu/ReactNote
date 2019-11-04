import { Ref, MutationWatcher } from '../types';
import isDetached from './isDetached';

// 监听window.document的后代节点以及子节点，并返回这个observer监听器
export default function onDomRemove(
  element: Ref,
  onDetachCallback: VoidFunction,
): MutationWatcher {
  // 传入一个回调函数，每当被指定的节点或子树以及配置项有Dom变动时会被调用。回调函数拥有两个参数：一个是描述所有被触发改动的MutationRecord对象数组，另一个是调用该函数的MutationObserver 对象。
  const observer = new MutationObserver((): void => {
    // 判断元素是否已经从document上移除
    if (isDetached(element)) {
      // 阻止 MutationObserver 实例继续接收的通知，直到再次调用其observe()方法，该观察者对象包含的回调函数都不会再被调用。
      // 如果元素已经移除则这个observer的回调不再执行
      observer.disconnect();
      // 当被移除的时候执行传入onDomRemove的第二个参数函数
      onDetachCallback();
    }
  });
  // 观察的节点是 window.document
  observer.observe(window.document, {
    childList: true,// 观察目标子节点的变化，添加或者删除
    subtree: true,// 默认为 false，设置为 true 可以观察后代节点
  });

  return observer;
}
