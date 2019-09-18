//const { SyncBailHook } = require('tapable')

/**
 * 每次监听是否有返回值为undefined
 * 1. 是, 停止执行
 * 2. 不是, 继续走监听回调
*/
class SyncBailHook{
    constructor(args){
        this._args = args
        this.taps = []
    }
    tap(name, fn){
        this.taps.push(fn)
    }
    call(){
        let args = Array.from(arguments).slice(0, this._args.length)
        let length = this.taps.length
        for(let i = 0; i<length; i++){
            let result = this.taps[i](args)
            if(typeof result !== 'undefined'){
                return
            } 
        }
    }
}

let hook = new SyncBailHook(['name', 'age'])

hook.tap('1', (name, age) => {
    console.log(1, name, age);
})
hook.tap('2', (name, age) => {
    console.log(2, name, age);
    return '我错了'
})
hook.tap('3', (name, age) => {
    console.log(2, name, age);
})

hook.call('zhufeng', 10)