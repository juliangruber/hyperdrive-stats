'use strict'

const Stats = require('.')
const test = require('tap').test
const hyperdrive = require('hyperdrive')
const db = require('memdb')

const drive = hyperdrive(db())

const replicate = (a, b) => {
  const ar = a.replicate()
  const br = b.replicate()
  ar.pipe(br).pipe(ar)
}

test('.filesProgress', t => {
  t.test('live: true', t => {
    t.plan(1)

    const a = drive.createArchive({ live: true })
    const b = drive.createArchive({ live: true })
    const stats = new Stats(a)

    stats.on('update', s => {
      t.equal(s.filesProgress, 1)
    })

    replicate(a, b)
    b.createFileWriteStream('file').end('content')
  })
  t.test('live: false', t => {
    t.plan(1)

    const a = drive.createArchive({ live: false })
    a.createFileWriteStream('file').end('content')
    a.finalize(() => {
      const stats = new Stats(a)
      stats.on('update', s => {
        t.equal(s.filesProgress, 1)
      })
    })
  })
  t.end()
})
