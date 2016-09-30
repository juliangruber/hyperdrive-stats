'use strict'

var Stats = require('.')
var hyperdrive = require('hyperdrive')
var memdb = require('memdb')

var db = memdb()
var drive = hyperdrive(db)

var archive = drive.createArchive()

var stats = new Stats({ archive, db })
stats.on('update', function () { console.log(stats.get()) })

var ws = archive.createFileWriteStream('file')
ws.on('finish', function () {
  ws = archive.createFileWriteStream('file')
  ws.on('finish', function () {
    archive.createFileWriteStream('file').end('beepboop')
  })
  ws.end('bar')
})
ws.end('foo')
archive.createFileWriteStream({
  name: 'directory',
  type: 'directory'
}).end()
