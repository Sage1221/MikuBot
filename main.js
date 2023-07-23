"use strict";
const { default: makeWASocket, DisconnectReason, useSingleFileAuthState, makeInMemoryStore, downloadContentFromMessage, jidDecode, generateForwardMessageContent, generateWAMessageFromContent } = require("@adiwajshing/baileys")
const fs = require("fs");
const chalk = require('chalk')
const logg = require('pino')
const { serialize, fetchJson, sleep, getBuffer } = require("./lib/myfunc");
const { nocache, uncache } = require('./lib/chache.js');
const { groupResponse_Welcome, groupResponse_Remove, groupResponse_Promote, groupResponse_Demote } = require('./lib/group.js')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/Upload_Url')

let setting = JSON.parse(fs.readFileSync('./setting.json'));
let session = `./${setting.sessionName}.json`
const { state, saveState } = useSingleFileAuthState(session)

const memory = makeInMemoryStore({ logger: logg().child({ level: 'fatal', stream: 'store' }) })

const connectToWhatsApp = async () => {
const kaje = makeWASocket({
printQRInTerminal: true,
logger: logg({ level: 'fatal' }),
browser: ['Casper','Safari','1.0.0'],
auth: state
})
memory.bind(kaje.ev)

kaje.ev.on('messages.upsert', async m => {
var msg = m.messages[0]
if (!m.messages) return;
if (msg.key && msg.key.remoteJid == "status@broadcast") return
msg = serialize(kaje, msg)
msg.isBaileys = msg.key.id.startsWith('BAE5') || msg.key.id.startsWith('3EB0')
require('./index')(kaje, msg, m, setting, memory)
})

kaje.ev.on('creds.update', () => saveState)

console.log(chalk.yellow(`${chalk.red('[ Made By Casper ]')}\n\n${chalk.italic.magenta(`SCRIPT BUAT PRIBADI`)}\n\n\n${chalk.red(`JOIN t.me/imwhatsappinfo`)}`))
 

kaje.reply = (from, content, msg) => kaje.sendMessage(from, { text: content }, { quoted: msg })

kaje.ev.on('connection.update', (update) => {
console.log('Connection update:', update)
if (update.connection === 'open') 
console.log("Connected with " + kaje.user.id)
else if (update.connection === 'close')
connectToWhatsApp()
})

kaje.ev.on('group-participants.update', async (update) =>{
groupResponse_Demote(kaje, update)
groupResponse_Promote(kaje, update)
groupResponse_Welcome(kaje, update)
groupResponse_Remove(kaje, update)
console.log(update)
})

kaje.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await kaje.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
}

kaje.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

kaje.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await kaje.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
.then( response => {
fs.unlinkSync(buffer)
return response
})
}

kaje.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
await kaje.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
.then( response => {
fs.unlinkSync(buffer)
return response
})
}

return kaje
}
connectToWhatsApp()
.catch(err => console.log(err))
