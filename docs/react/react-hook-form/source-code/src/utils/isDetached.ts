import { Ref } from '../types';
/**
 * 判断传入的元素所在的节点树是否是孤立的，也就是说树的根节点不是document
 * 返回值： true表示元素在document上，false表示元素不再document上
 */
export default function isDetached(element: Ref): boolean {
  if (!element) return true;

  if (
    !(element instanceof HTMLElement) ||
    element.nodeType === Node.DOCUMENT_NODE
  )
    return false;

  return isDetached(element.parentNode);
}
