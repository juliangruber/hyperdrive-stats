'use strict'

const Stats = require('.')
const hyperdrive = require('hyperdrive')
const memdb = require('memdb')

const db = memdb()
const drive = hyperdrive(db)

const archive = drive.createArchive()

const stats = new Stats({ archive, db })
stats.on('update', () => console.log(stats.get()))

let ws = archive.createFileWriteStream('file')
ws.on('finish', () => {
  ws = archive.createFileWriteStream('file')
  ws.on('finish', () => {
    archive.createFileWriteStream('file').end('beepboop')
  })
  ws.end('bar')
})
ws.end('foo')
archive.createFileWriteStream({
  name: 'directory',
  type: 'directory'
}).end()
