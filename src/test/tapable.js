const { SyncHook } = require('../2.tapable')

let hook = new SyncHook(['name', 'age'])

// 监听函数
hook.tap('1', (name, age) => {
    console.log(1, name, age);
})
hook.tap('2', (name, age) => {
    console.log(2, name, age);
})

// 触发监听
// 必须要与定义的参数个数一致
hook.call('zhufeng', 10)