## webpack的插件机制
- webpack实现插件机制的大体方式是: 
    - 创建 - webpack在其内部对象上创建各种钩子
    - 注册 - 插件将自己的方法注册在对应钩子上, 交给webpack
    - 调用 - webpack编译过程中，会适时的触发钩子,因此也就调用了钩子
- webpack的本质就是一种事件流的机制，它的工作就是将各种插件串联起来，而实现这一切的核心就是`Tapable`。webpack中最核心的负责编译的`Complier`和负责创建bundle的`Compliation`都是Tapable的实例
- 通过事件、注册、监听, 触发webpack生命周期的函数方法
```js
const {
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook
} = require('tapable');

```

## tapable分类
### 按同步/异步
1. `同步Sync`
2. `异步Async`
    - 并行(Parallel)
    - 串行(Series)
### 按类型
| 类型 | 使用要点 |
| :--- | :--- |
| Basic | 不关心监听函数的返回值 |
| Bail | 保险式: 只要监听函数中有返回值(不为undefined),则跳过之后的监听函数 |
| Waterfall | 瀑布式: 上一步的返回值交给下一步使用 |
| Loop | 循环类型: 如果该监听函数返回true，则这个监听函数反复执行，如果返回undefined，则退出循环 |



[toc]