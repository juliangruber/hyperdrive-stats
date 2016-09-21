'use strict'

const Stats = require('.')
const test = require('tap').test
const hyperdrive = require('hyperdrive')
const memdb = require('memdb')

const drive = hyperdrive(memdb())

test(t => {
  const archive = drive.createArchive({ live: false })
  archive.createFileWriteStream('file').end('content')
  archive.finalize(() => {
    const stats = new Stats(archive)
    stats.on('update', s => {
      t.equal(s.filesProgress, 1)
      t.equal(s.filesTotal, 1)
      t.end()
    })
  })
})
