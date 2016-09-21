'use strict'

const Stats = require('.')
const test = require('tap').test
const hyperdrive = require('hyperdrive')
const memdb = require('memdb')

const drive = hyperdrive(memdb())

test('.filesProgress', t => {
  t.plan(1)

  const archive = drive.createArchive({ live: false })
  archive.createFileWriteStream('file').end('content')
  archive.finalize(() => {
    const stats = new Stats(archive)
    stats.on('update', s => {
      t.equal(s.filesProgress, 1)
    })
  })
})
