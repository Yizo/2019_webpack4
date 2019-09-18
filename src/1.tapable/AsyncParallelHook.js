//const { AsyncParallelHook } = require('tapable')

/**
 * 异步并行
*/
class AsyncParallelHook{
    constructor(args){
        this._args = args
        this.taps = []
    }
    tapAsync(name, fn){
        this.taps.push(fn)
    }
    callAsync(){
        let args = Array.from(arguments).slice(0, this._args.length)
        let finalCallback = arguments[arguments.length - 1]
        let length = this.taps.length, i = 0
        function done(){
            if(++i === length) {
                finalCallback('null')
            }
        }
        this.taps.forEach(fn=>fn(...args, done))
    }
}

let hook = new AsyncParallelHook(['name', 'age'])

hook.tapAsync('1', (name, age, done) => {
    setTimeout(()=>{
        console.log(1, name, age);
        done()
    }, 1000)
})
hook.tapAsync('2', (name, age, done) => {
    setTimeout(()=>{
        console.log(2, name, age);
        done()
    }, 2000)
})
hook.tapAsync('3', (name, age, done) => {
    setTimeout(()=>{
        console.log(3, name, age);
        done()
    }, 3000)
})

hook.callAsync('zhufeng', 10, function(res){
    console.log('完成了', res)
})