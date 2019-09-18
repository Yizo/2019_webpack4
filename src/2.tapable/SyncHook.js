let Hook = require('./Hook')
let HookCodeFactory = require('./HookCodeFactory')
let factory = new HookCodeFactory()
class SyncHook extends Hook{
    compile(options){
        factory.setup(this, options)
        return factory.create(options)
    }
}

module.exports = SyncHook