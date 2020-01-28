/**
 * @typedef {Object} MiddlewareContext
 *
 * @property {Object<string, any>} msg
 * @property {number} chatId
 * @property {Object<string, any>} ctx - Added context property
 */

/**
 * Creates context middleware function.
 * @return {function(this: MiddlewareContext)} Context middleware function
 */
function createContextMiddleware() {
    const contextStore = new WeakMap()

    return function() {
        const key = this.msg

        Object.defineProperty(this, 'ctx', {
            get() {
                /** @type T */
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
                        obj[prop] = val
                        contextStore.set(key, obj)
                        return true
                    },
                }
                return new Proxy(ctx, ctxHandler)
            },
            set() {
                throw new Error(
                    "Value cannot be assigned directly to 'this.ctx'. Use custom properties to save data, e.g. 'this.ctx.myProperty = myValue'."
                )
            },
            enumerable: true,
        })
    }
}

module.export = createContextMiddleware
