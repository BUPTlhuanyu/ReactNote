# 🔥🔥🔥对react相关代码库以及框架的源码进行了一定的分析
[react核心流程图](https://juejin.im/post/5e1873c0e51d451c883618f0)
高清大图： 
- 在线链接: http://note.youdao.com/noteshare?id=cd7d8aa028e19e78dda0cec4cdc39384
- 永久地址： https://github.com/BUPTlhuanyu/ReactNote/tree/master/react/ReactDOM_render.png

这个源码阅读计划是从毕业的前几个月开始的，花了将近一个月的时间逐行阅读到react调度更新部分之后，虽然有所收获，
但是还有很多地方有点不理解与模糊，并没有带着问题阅读源码，因此就停下来了。

最近把官网的hook文章都仔细过了一遍，也仔细研究了`前端精读`公众号上所有关于hook的文章，并且用hook写了一个表单组件库，感受到了react的牛逼之处，最近这几天通过`react status`这个订阅号，发现目前一个新的表单库，用hook写的，叫做react-hook-form，只能说文档是非常完善的，等我把源码研究透彻之后，可能会放到这个仓库，稍微提一下，这个库的特点是：自动或者手动收集表单组件的字段并整合到一个对象里，非常不可思议的是不用useState来保存字段状态以及更新状态渲染组件，所有的字段都被存放在useRef中，然后利用一个useState返回的set进行手动强制渲染，因此减少了很多的重新渲染的操作。

另一个有意思的事情是，之前看react源码，中间多次出现concurrent这个模式，一直没明白同步到底是干啥，现在react16.11.1版本的已经给出了文档，不过这个模式还是一个试验性的功能，该功能能够打断渲染，这个渲染不是说浏览器的渲染，而是react的调度阶段的一些操作。

总之，是时候把之前的源码捡起来，好好梳理总结一下。在这个过程中，我也会结合当前慕课网上的react源码解析教程来对原来写下来的文章进行总结与梳理，希望能够有更深的理解。

PS： 真心给react粉丝们一个非常好的订阅号，react status，这个周刊会一直推送给你最新的react进展与相关的代码库。
非常希望大家能和我一起讨论，不管是react源码还是react status中有趣的文章，欢迎在issue中留言。等react源码总结完了，我也会陆陆续续在issue中发一些关于react的文章的读书笔记与实践的思考。如果感兴趣，可以点个star关注一下这个仓库的更新。
### ToDo 深入分析
- [ ] react
    - [x] shared  整个项目通用代码
    - [x] react   核心代码，react定义、reactElement类型对象的构建过程、ReactChildren对react树的操作原理等等
    - [x] react-is  梳理react框架中两大类型：ReactElement以及Portal类型。梳理React.memo，Ref等类型的构建成ReactElementd的过程
    - [x] scheduler 规划 React 初始化，更新等等
    - [x] react-reconciler  React调度器
        - [x] 到期时间是如何确定的
        - [ ] context的实现机制
        - [ ] ...
    - [x] events 合成事件系统
    - [x] react的错误处理机制
        - [x] 从invokeGuardedCallbackAndCatchFirstError，invokeGuardedCallback，invokeGuardedCallbackImpl看是如何对错误进行处理的
        - [ ] ...
    - [x] react-dom  DOM渲染
    - [ ] 各类型组件的运行机制
    - [ ] 总结
- [x] react-router4各个API的使用与源码分析
- [ ] react-transition-group
    - [x] 基本组件：Transition组件分析，结合生命周期详细分析该组件实现动画的原理
    - [ ] TransitionGroup组件：对children中Transition或者CSSTransition组件的动画的管理
- [ ] redux-saga：管理react副作用，尽可能使组件为纯函数

## 📖react16.6

###### <i>源码实例分析：可见[runlogic文件夹](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/runlogic/index.js)下的代码，断点分析(console.log不是一快照的方式打印结果，对引用对象的调试会不和预期)react对不同组件的处理逻辑等等运行机制</i>

<details>
<summary>🍺D1 项目目录</summary>

* [1、react源码浅析(一)：项目目录](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D1/react%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90(%E4%B8%80)%EF%BC%9A%E9%A1%B9%E7%9B%AE%E7%9B%AE%E5%BD%95.md)
</details>

<details>
<summary>🍺D2 shared</summary>

- [1、react源码浅析(二)：shared文件夹](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D2/react%e6%ba%90%e7%a0%81%e6%b5%85%e6%9e%90(%e4%ba%8c)%ef%bc%9ashared%e6%96%87%e4%bb%b6%e5%a4%b9.md)
- [2、react源码浅析(二)：shared文件夹之ReactTreeTraversal](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D2/react%e6%ba%90%e7%a0%81%e6%b5%85%e6%9e%90(%e4%ba%8c)%ef%bc%9ashared%e6%96%87%e4%bb%b6%e5%a4%b9%e4%b9%8bReactTreeTraversal.md)
</details>

<details>
<summary>🍺D3 react</summary>

- [1、react源码浅析(三)：react文件夹-源码入口](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D3/react%e6%ba%90%e7%a0%81%e6%b5%85%e6%9e%90(%e4%b8%89)%ef%bc%9areact%e6%96%87%e4%bb%b6%e5%a4%b9-%e6%ba%90%e7%a0%81%e5%85%a5%e5%8f%a3.md)
- [2、react源码浅析(三)：ReactNoopUpdateQueue](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D3/react%e6%ba%90%e7%a0%81%e6%b5%85%e6%9e%90(%e4%b8%89)%ef%bc%9aReactNoopUpdateQueue.md)
- [3、react源码浅析(三)：ReactBaseClasses](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D3/react%e6%ba%90%e7%a0%81%e6%b5%85%e6%9e%90(%e4%b8%89)%ef%bc%9aReactBaseClasses.md)
- [4、react源码浅析(三)：Ref-Context-Lazy-forwardRef-memo](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D3/react%e6%ba%90%e7%a0%81%e6%b5%85%e6%9e%90(%e4%b8%89)%ef%bc%9aRef-Context-Lazy-forwardRef-memo.md)
- [5、react源码浅析(三)：ReactElement](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D3/react%e6%ba%90%e7%a0%81%e6%b5%85%e6%9e%90(%e4%b8%89)%ef%bc%9aReactElement.md)
- [6、react源码浅析(三)：ReactDebugCurrentFrame](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D3/react%e6%ba%90%e7%a0%81%e6%b5%85%e6%9e%90(%e4%b8%89)%ef%bc%9aReactDebugCurrentFrame.md)
- [7、react源码浅析(三)：ReactChildren](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D3/react%e6%ba%90%e7%a0%81%e6%b5%85%e6%9e%90(%e4%b8%89)%ef%bc%9aReactChildren.md)
- [ ]   8、react源码浅析(三)：Hook
- [9、react源码浅析(三)：ReactElementValidator](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D3/react%e6%ba%90%e7%a0%81%e6%b5%85%e6%9e%90(%e4%b8%89)%ef%bc%9aReactElementValidator.md)
</details>


<details>
<summary>🍺D4 react-is</summary>

###### <i>梳理react中的类型，两大类型的构建过程</i>

- [react源码浅析(四)：react-is](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D4/react%e6%ba%90%e7%a0%81%e6%b5%85%e6%9e%90(%e5%9b%9b)%ef%bc%9areact-is.md)
</details>


<details>
<summary>🍺D5 scheduler</summary>

###### <i>scheduler调度器原理，大致基本流程已给出图示，以后再给出更详细具体的调度解析，其实知道了设计思想，往后的内容都基本没问题了。</i>

###### <i>tracing及其TracingSubscriptions实现的是一个订阅监听者设计模式，暂时不对其总结</i>

- [react源码浅析(五)：scheduler](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D5/react%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90(%E4%BA%94)%EF%BC%9Ascheduler.md)
- [react源码浅析(五)：scheduler之Tracing.js](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D5/react%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90(%E4%BA%94)%EF%BC%9Ascheduler%E4%B9%8BTracing.js.md)
- [react源码浅析(五)：scheduler之TracingSubscriptions.js](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D5/react%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90(%E4%BA%94)%EF%BC%9Ascheduler%E4%B9%8BTracingSubscriptions.js.md)
</details>



<details>
<summary>🍺D6 react-reconciler</summary>

###### <i>react-reconciler源码分析，直接记在我的有道云笔记中，之后会整理成md文件</i>

- [1、react源码浅析(六)：react的fiber树与页面节点树的关系](http://note.youdao.com/noteshare?id=f7dd4b24a921544728a001b9b02b3b38)
- [2-0、react源码浅析(六)：ReactDOM.render流程概览](http://note.youdao.com/noteshare?id=eb7d384912d170e1af6716c2df47a24a)
- [2-1、react源码浅析(六)：创建container对应的root](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D6/2-1%e3%80%81%e5%88%9b%e5%bb%bacontainer%e5%af%b9%e5%ba%94%e7%9a%84root.md)
- [2-2、react源码浅析(六)：创建root下的fiber树并开始初始调度](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D6/2-2%e3%80%81%e5%88%9b%e5%bb%baroot%e4%b8%8b%e7%9a%84fiber%e6%a0%91%e5%b9%b6%e5%bc%80%e5%a7%8b%e5%88%9d%e5%a7%8b%e8%b0%83%e5%ba%a6.md)
- [3-1、react源码浅析(六)：调度入口函数scheduleWork](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D6/3-1%e3%80%81%e8%b0%83%e5%ba%a6%e5%85%a5%e5%8f%a3%e5%87%bd%e6%95%b0scheduleWork.md)
- [3-2、react源码浅析(六)：performAsyncWork与performSyncWork](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D6/3-2%e3%80%81performAsyncWork%e4%b8%8eperformSyncWork.md)
- [3-3、react源码浅析(六)：performWork调度root双向循环链表](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D6/3-3%e3%80%81performWork%e8%b0%83%e5%ba%a6root%e5%8f%8c%e5%90%91%e5%be%aa%e7%8e%af%e9%93%be%e8%a1%a8.md)
- [3-4、react源码浅析(六)：performWorkOnRoot调度某个root的fiber树](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D6/3-4%e3%80%81performWorkOnRoot%e8%b0%83%e5%ba%a6%e6%9f%90%e4%b8%aaroot%e7%9a%84fiber%e6%a0%91.md)
- [3-6-0、react源码浅析(六)：root渲染阶段renderRoot](http://note.youdao.com/noteshare?id=478f1a3b421050d8f1b72e3b221cca59&sub=169BA6CA7850481BBA68BC53379E26D1)
- [3-6-1、react源码浅析(六)：对root执行updateHostRoot](http://note.youdao.com/noteshare?id=84df98e9c1e5cb9d1a66864b34268a7f&sub=1E16F316E66348EB945206AE4746119A)
- [3-6-2、react源码浅析(六)：对类组件执行updateClassComponent](http://note.youdao.com/noteshare?id=5b0d48c78467fea260ff1a3197584903&sub=53E81F5FF24146C785B2C34F3D048146)
- [3-6-last、react源码浅析(六)：completeUnitOfWork完成当前节点的调度](http://note.youdao.com/noteshare?id=c8a66711270ae3eb5eb6f23a109172b5&sub=C7C28307C12E4FA3949637F01CF39CEC)
- [3-7-0、react源码浅析(六)：root提交阶段completeRoot](http://note.youdao.com/noteshare?id=825ff368c0ecd1d1b8526d5d6c3048b5&sub=B99E2F7CE96F4FC495F009DD212DF07C)
- [3-7-1、react源码浅析(六)：提交阶段执行getSnapshotBeforeUpdate生命周期函数](http://note.youdao.com/noteshare?id=ad1926f61ab12c474298a160cd92d4fa&sub=EFC96133F0CF4F67AE228D41B555B9F3)
- [3-7-2、react源码浅析(六)：提交HostComponent原生HTML标签上的effect](http://note.youdao.com/noteshare?id=58e52744ed8dda929ae070b3952d688b&sub=81C6EC81F70B4EF0AC4109F3BB2A7CB7)
- [3-7-3、react源码浅析(六)：最后提交阶段，执行剩余生命周期钩子](http://note.youdao.com/noteshare?id=1401779d0c87c389ae95e1b1c4570e72&sub=5E9DF42F619B4269ADEB473A02A8604F)
- [3-8-1、react源码浅析(六)：多次执行setState的更新机制](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D6/react%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90(%E5%85%AD)%EF%BC%9A%E5%A4%9A%E6%AC%A1%E6%89%A7%E8%A1%8CsetState%E7%9A%84%E6%9B%B4%E6%96%B0%E6%9C%BA%E5%88%B6.md)
- [3-8-2、react源码浅析(六)：到期时间的计算规则](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react/blog/D6/react%e6%ba%90%e7%a0%81%e6%b5%85%e6%9e%90(%e5%85%ad)%ef%bc%9a%e5%88%b0%e6%9c%9f%e6%97%b6%e9%97%b4%e7%9a%84%e8%ae%a1%e7%ae%97%e8%a7%84%e5%88%99.md)
</details>

<details>
<summary>🍺D7 events</summary>

###### <i>react事件系统是一个非常值得深入分析的部分,猜想跨平台开发框架对不同平台的事件的兼容方案莫过于此吧</i>

- [事件绑定](https://juejin.im/post/5d0af976e51d454fbf540a0f)
- [事件触发](https://juejin.im/post/5d0afbd2e51d4510bf1d6690)
</details>

<details>
<summary>🍺D8 错误处理机制</summary>

- [react中的错误处理](https://juejin.im/post/5d0c8f34e51d45590a445b4c)
</details>


## 📖react-router


<details>
<summary>🍺D1</summary>

- [react-router4源码浅析总结](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react-router/packages/react-router/blog/D1/react-router4%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90%E6%80%BB%E7%BB%93%20.md)
- [react-router4源码浅析(一) ：matchPath](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react-router/packages/react-router/blog/D1/react-router4%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90(%E4%B8%80)%20%EF%BC%9AmatchPath.md)
- [react-router4源码浅析(二) ：Route](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react-router/packages/react-router/blog/D1/react-router4%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90(%E4%BA%8C)%20%EF%BC%9ARoute.md)
- [react-router4源码浅析(三) ：BrowserRouter&&HashRouter](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react-router/packages/react-router/blog/D1/react-router4%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90(%E4%B8%89)%20%EF%BC%9ABrowserRouter%26%26HashRouter.md)
- [react-router4源码浅析(四) ：Router](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react-router/packages/react-router/blog/D1/react-router4%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90(%E5%9B%9B)%20%EF%BC%9ARouter.md)
- [react-router4源码浅析(五) ：generatePath](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react-router/packages/react-router/blog/D1/react-router4%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90(%E4%BA%94)%20%EF%BC%9AgeneratePath.md)
- [react-router4源码浅析(六) ：Redirect](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react-router/packages/react-router/blog/D1/react-router4%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90(%E5%85%AD)%20%EF%BC%9ARedirect.md)
- [react-router4源码浅析(七) ：Switch](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react-router/packages/react-router/blog/D1/react-router4%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90(%E4%B8%83)%20%EF%BC%9ASwitch.md)
- [react-router4源码浅析(八) ：withRouter](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react-router/packages/react-router/blog/D1/react-router4%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90(%E5%85%AB)%20%EF%BC%9AwithRouter.md)
- [react-router4源码浅析(九) ：Link](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react-router/packages/react-router/blog/D1/react-router4%E6%BA%90%E7%A0%81(%E4%B9%9D)%20%EF%BC%9ALink.md)
</details>

## 📖react-transition-group

<details>
<summary>🍺D1</summary>

- [react-transition-group源码浅析(一)：Transition](https://github.com/BUPTlhuanyu/ReactNote/blob/master/react-transition-group/blog/D1/react-transition-group%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90(%E4%B8%80)%EF%BC%9ATransition.md)
</details>

## 📖表单

<details>
<summary>🍺react-hook-form</summary>

- [react-hook-form官方文档](https://react-hook-form.com)
- [utils](https://github.com/BUPTlhuanyu/ReactNote/blob/master/formLib/react-hook-form/blog/utils.md)
- [源码梳理](https://github.com/BUPTlhuanyu/ReactNote/blob/master/formLib/react-hook-form/blog/%e6%ba%90%e7%a0%81%e6%a2%b3%e7%90%86.md)
</details>