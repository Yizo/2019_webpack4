//const { SyncWaterfallHook } = require('tapable')

/**
 *  监听回调是否有返回值
 *  1. 有返回值, 将返回值作为下次回调的第一个参数
 *  2. 有返回值但返回值为undefined 或 没有返回值; 继续往下走默认
 *  
*/
class SyncWaterfallHook{
    constructor(args){
        this._args = args
        this.taps = []
    }
    tap(name, fn){
        this.taps.push(fn)
    }
    call(){
        // 取得和构造函数中一致的参数
        let args = Array.from(arguments).slice(0, this._args.length)
        let length = this.taps.length
        let result
        let last
        for(let i = 0; i<length; i++){
            // 最开始没有返回值，取默认第一个参数
            result = this.taps[i](last||args[0], ...args.slice(1))
            // 第一次如果有返回值, 那么赋值给last
            if(result)last = result
        }
    }
}

let hook = new SyncWaterfallHook(['name', 'age'])

// 第一个返回值,作为下一个回调函数的参数
hook.tap('1', (name, age) => {
    console.log(1, name, age);
    return 'result1'
})
hook.tap('2', (name, age) => {
    console.log(2, name, age);
    return 'result2'
})
hook.tap('3', (name, age) => {
    console.log(2, name, age);
    return 'result3'
})

hook.call('zhufeng', 10)