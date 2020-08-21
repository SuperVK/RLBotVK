const watch = require('node-watch')
const fs = require('fs')
const port = Number(fs.readFileSync('./config/port.cfg').toString())

const Manager = require('rlbotjs').Manager

let Agent = require('./built/src/Agent').default
console.log(Agent)
let manager = new Manager(Agent, port, true);
manager.start()

watch('./built', { recursive: true, filter: f => !/\.yarn/.test(f)}, loadAgent)

function loadAgent() {
    Object.keys(require.cache).forEach(function(key) { delete require.cache[key] })
    console.log('[RLBotJS] Reloading...')
    manager.newBotClass(require('./built/src/Agent').default)
}
