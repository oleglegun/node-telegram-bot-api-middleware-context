# Context Middleware

> This middleware is designed to be used with [`node-telegram-bot-api-middleware`](https://github.com/idchlife/node-telegram-bot-api-middleware).

For each incoming message this middleware adds a custom context object `this.ctx` that is shared between all handlers.

Useful for designing complex request processing logic involving custom handler interoperation.

Context can be used to create **generic handler** that:

-   displays help information if there is no any **specific handler** for the request
-   processes arbitrary user text input that is not meant for any **specific handler** to process. In this case it is best to also use [state machines](https://github.com/davidkpiano/xstate) to fully control the bot's logic.

## Intallation

```shell
npm i node-telegram-bot-api-middleware-context
```

## Usage

```js
const TelegramBot = require('node-telegram-bot-api')
const use = require('node-telegram-bot-api-middleware').use
const createContextMiddleware = require('node-telegram-bot-api-middleware-context')

const bot = new TelegramBot('YOUR_TELEGRAM_BOT_TOKEN', { polling: true })

let response = use(createContextMiddleware()) /* .use(otherMiddleware) */

/*
 * Handlers are called in the order of their creation:
 * 1. /start (specific handler)
 * 2. .+ (generic handler)
 */

bot.onText(
    new RegExp('/start'),
    response(function(msg, match) {
        this.ctx.messageHandled = true // set custom flag to indicate that the message was handled
        this.ctx.arbitraryProp = 'value' // add any property to the context

        bot.sendMessage(this.chatId, `Message '${msg.text}' was handled by a specific handler`)
    })
)

bot.onText(
    /.+/,
    response(function(msg, match) {
        if (this.ctx.messageHandled) {
            // do nothing if the message has already been handled
            return
        }

        // otherwise process the unhandled message using generic handler
        bot.sendMessage(this.chatId, `Message '${msg.text}' was handled by a generic handler`)
    })
)
```
