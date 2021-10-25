/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import invariant from 'shared/invariant';

const instanceCache = {};
const instanceProps = {};

export function precacheFiberNode(hostInst, tag) {
  instanceCache[tag] = hostInst;
}

export function uncacheFiberNode(tag) {
  delete instanceCache[tag];
  delete instanceProps[tag];
}

function getInstanceFromTag(tag) {
  return instanceCache[tag] || null;
}

function getTagFromInstance(inst) {
  let tag = inst.stateNode._nativeTag;
  if (tag === undefined) {
    tag = inst.stateNode.canonical._nativeTag;
  }
  invariant(tag, 'All native instances should have a tag.');
  return tag;
}

export {
  getInstanceFromTag as getClosestInstanceFromNode,
  getInstanceFromTag as getInstanceFromNode,
  getTagFromInstance as getNodeFromInstance,
};

export function getFiberCurrentPropsFromNode(stateNode) {
  return instanceProps[stateNode._nativeTag] || null;
}

export function updateFiberProps(tag, props) {
  instanceProps[tag] = props;
}
