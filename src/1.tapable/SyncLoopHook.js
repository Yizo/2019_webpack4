//const { SyncLoopHook } = require('tapable')

/**
 * 不停的循环执行回调函数，直到函数结果等于undefined
 * 每次循环都是从头开始循环
*/
class SyncLoopHook{
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
            let fn = this.taps[i]
            let result
            do{
                result = fn(...args)
            }while(typeof result !== 'undefined')
        }
    }
}

let hook = new SyncLoopHook(['name','age']);
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
//不停的循环执行回调函数，直到函数结果等于undefined
hook.tap('1',(name,age)=>{
  console.log(1,name,age);
  if(++counter1==1){
      counter1 = 0
      return;
  }
  return true;
});
hook.tap('2',(name,age)=>{
  console.log(2,name,age);
  if(++counter2==2){
      counter2 = 0
      return;
  }
  return true;
});
hook.tap('3',(name,age)=>{
  console.log(3,name,age);
  if(++counter3==3){
      counter3 = 0
      return;
  }
  return true;
});

hook.call('zhufeng', 10)