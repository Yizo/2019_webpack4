class Hook{
    constructor(args){
        if(!Array.isArray(args)){
            args = []
        }
        this._args = args
        this.taps = []
        this._x
    }
    tap(options, fn){
        if(typeof options === 'string'){
            options = { name: options }
        }
        options.fn = fn
        this._insert(options)
    }
    _insert(options){
        this.taps.push(options)
    }
    call(...args){
        let callMethod = this._createCall()
        callMethod.apply(this, args)
    }
    _createCall(){
        return this.complie({
            taps: this.taps,
            args: this._args
        })
    }
}

module.exports = Hook