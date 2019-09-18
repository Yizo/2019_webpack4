const { SyncHook } = require('tapable')

/**
 * 基本的监听与触发 
*/
//class SynHook{
//     constructor(args){
//         this._args = args
//         this.taps = []
//     }
//     tap(name, fn){
//         this.taps.push(fn)
//     }
//     call(){
//         let args = Array.from(arguments)
//         this.taps.forEach(fn=>fn(...args.slice(0, this._args.length)))
//     }
// }


// 构造函数:接受一个表示参数名的字符串数组
// 空数组(回调不接受参数)
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