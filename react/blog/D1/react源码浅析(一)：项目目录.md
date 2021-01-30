[TOC]

# React 源码随笔-项目结构

​		本文是 React 源码系列的开端，在此之前有必要说明一下背景，这个系列的部分初稿是本人在毕业（2019 年 6 月份）的前几个月完成的，React 的版本是当时最新的 16.6 版本（目前为 17.0.1），其实 fiber 的大体架构差不多，16.6 也有一部分 HOOK 相关的代码，16.6 的 HOOK 还是试验性的，因此本系列重点是 Fiber 相关的源码与实例解析，对于 HOOK 部分后续会跟进，不在本系列之中（立个 flag：下一个 electron 应用就用 hook 写），初稿可见 https://github.com/BUPTlhuanyu/ReactNote。

​		工作之后，在闲暇时间又梳理了一遍 react，并将之前对项目以及源码的理解绘制了一张全网最细节的 react 流程图。当然细节还不够完善，有些地方可能还有一些问题，欢迎拍砖。贴上一个链接，图址 https://pan.baidu.com/s/1EfTWzqC4psW8kq5kYP-v9A ，密码 8nqr。

## 目录结构

````````````````json
packages                                   
├─ react                 // React类以及API的定义
├─ react-art             // Renderer:提供组件用于绘制svg或者canvas
├─ react-dom             // Renderer:用于在web上渲染组件
├─ react-native-renderer // Renderer:用于在ios/android上渲染组件
├─ react-is              // React 元素类型判断
├─ react-reconciler      // 协调器:生成update对象，更新到期时间，异步更新给scheduler，同步更新直接调度
├─ scheduler             // 调度器:时间分片的执行异步更新函数，处理逻辑还是react-reconciler
├─ events                // react的事件系统
└─ shared                // 整个项目的通用代码
````````````````

## 各模块关系

`````javascript
import React from 'react';
import ReactDOM from 'react-dom';

class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 为了在回调中使用 `this`，这个绑定是必不可少的
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}
ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
`````



上面例子中，有两个地方需要注意

1. `ReactDOM.render`函数是利用`react-dom`模块提供的能力将`react`组件渲染到`web`页面。
2. 点击事件通过 `setState`修改组件的`state`，内部的机制是通过`react-reconciler`模块创建一个*更新对象*，并生成一个到期时间，然后遍历整个`fiber`树，更新每个fiber节点的到期时间，并找出最大的到期时间（优先级最高），根据这个时间判断是否是一个同步更新，如果是则直接开始调度；如果是一个异步更新，则生成一个*异步更新执行函数*丢给`scheduler`模块，该模块会根据浏览器每一帧是否有空闲时间来决定是否执行接收到的函数，并且接收到的每个函数都有一个到期时间，`scheduler`模块会根据到期时间来决定先执行哪个函数。需要注意的是*异步更新执行函数*的逻辑在`react-reconciler`模块中，`scheduler`模块是独立的不依赖 `react`,值得一提的是，`react-cache`也是基于`scheduler`模块实现的。

通过上面的例子，基本上涵盖了`react`中的各个模块，`event`模块后续会说到。

## 总结

​		本文简单介绍了一下项目的结构，并且通过一个例子，简单的介绍了各个模块之间如何协同工作，接下来的一章，我会先介绍 `react` 源码中 `share` 部分的代码，涉及到一些 `react` 的概念，以及一些基本的算法。