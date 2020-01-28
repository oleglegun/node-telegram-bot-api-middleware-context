module.exports = function createContextMiddleware() {
    const contextStore = new WeakMap()

    return function() {
        const key = this.msg

        Object.defineProperty(this, 'ctx', {
            get() {
                let ctx = contextStore.get(key)

                if (!ctx) {
                    ctx = new Object(null)
                    contextStore.set(key, ctx)
                }

                const ctxHandler = {
                    get: function(obj, prop) {
                        return obj[prop]
                    },
                    set: function(obj, prop, val) {
                        contextStore.set(key, obj)
                        return true
                    },
                }
                return new Proxy(ctx, ctxHandler)
            },
            set() {
                throw new Error(
                    "Values cannot be assigned directly to 'this.ctx'. Use custom properties to save data, e.g. 'this.ctx.myProperty = myValue'."
                )
            },
            enumerable: true,
        })
    }
}