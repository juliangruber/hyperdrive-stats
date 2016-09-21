'use strict'

const Stats = require('.')
const test = require('tap').test
const hyperdrive = require('hyperdrive')
const memdb = require('memdb')

const drive = hyperdrive(memdb())

test(t => {
  t.plan(5)
  const archive = drive.createArchive({ live: false })
  archive.createFileWriteStream('file').end('content')
  archive.finalize(() => {
    const stats = new Stats(archive)
    stats.on('update:filesProgress', v => t.equal(v, 1, 'filesProgress'))
    stats.on('update:filesTotal', v => t.equal(v, 1, 'filesTotal'))
    stats.on('update:bytesTotal', v => t.equal(v, 7, 'bytesTotal'))
    stats.on('update', s => t.ok(s, 'update'))
  })
})
