class HookCodeFactory{
    setup(instance, options){
        this.options = options
        instance._x = options.taps.map(t=>t.fn) // {fn, name}
        // hook.x = [fn, name]
    }
    args(){
        return this.options.args.join(',')
    }
    header(){
        return `var _x = this._x`
    }
    content(){
        return this.options.taps.map((tap,i) => `
            var _fn1${i} = _x[${i}];\n
            _fn${i}(${this.args()});\n
        `).join('\n')
    }
    create(options){
        return new Function(
            this.args,
            this.header()+this.content()
        )
    }
}

module.exports = HookCodeFactory