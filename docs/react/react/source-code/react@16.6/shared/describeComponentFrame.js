/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
//输出文件的位置，以及log的信息发生在文件中的行数

//用于匹配路径(linux或者windows路径)：字符串中"\"或者"/"之前的所有字符（除换行\n,\r）部分
const BEFORE_SLASH_RE = /^(.*)[\\\/]/;


export default function(
  name: null | string,
  source: any,
  ownerName: null | string,
) {
  let sourceInfo = '';
  if (source) {
    let path = source.fileName;
    //获取路径path中最后文件名字：如获取"./home/index.js"中的index.js
    let fileName = path.replace(BEFORE_SLASH_RE, '');
    if (__DEV__) {
      // In DEV, include code for a common special case:
      // prefer "folder/index.js" instead of just "index.js".
      if (/^index\./.test(fileName)) {
        const match = path.match(BEFORE_SLASH_RE);
        if (match) {
          //match[1]被第一个子表达式捕获的字符串及"\"或者"/"之前的字符（除换行\n,\r）部分
          const pathBeforeSlash = match[1];
          if (pathBeforeSlash) {
            //获取文件的父文件夹名称
            const folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
            //拼接文件夹与文件名
            fileName = folderName + '/' + fileName;
          }
        }
      }
    }
    // 输出在文件的某个文件某行
    sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
  } else if (ownerName) {
    sourceInfo = ' (created by ' + ownerName + ')';
  }
  return '\n    in ' + (name || 'Unknown') + sourceInfo;
}
