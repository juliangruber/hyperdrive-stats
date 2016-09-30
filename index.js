'use strict'

const EventEmitter = require('events')
const index = require('hypercore-index')
const encoding = require('hyperdrive-encoding')

const _archive = Symbol()
const _stats = Symbol()

module.exports = class Stats extends EventEmitter {
  constructor (opts) {
    super()

    const archive = opts.archive
    const db = opts.db

    db.get('stats', (err, stats) => {
      if (err && !err.notFound) return this.emit('error', err)

      this[_archive] = archive
      this[_stats] = Object.assign({
        bytesTotal: 0,
        blocksTotal: 0,
        filesTotal: 0
      }, JSON.parse(stats || '{}'))

      index({
        feed: opts.archive.metadata,
        db: db
      }, (buf, cb) => {
        const entry = encoding.decode(buf)
        if (entry.type === 'file') {
          db.get(entry.name, (err, last) => {
            if (err && !err.notFound) return cb(err)
            const lastFound = !!last
            last = JSON.parse(last || '{}')

            this.update({
              bytesTotal: this[_stats].bytesTotal
                + entry.length
                - (last.length || 0),
              blocksTotal: this[_stats].blocksTotal
                + entry.blocks
                - (last.blocks || 0)
            })

            if (!lastFound) {
              this.update({ filesTotal: this[_stats].filesTotal + 1 })
            }
            db.batch()
              .put(entry.name, JSON.stringify(entry))
              .put('stats', JSON.stringify(this[_stats]))
              .write(cb)
          })
        } else {
          cb()
        }
      }, err => {
        this.emit('error', err)
      })
    })
  }
  update (data) {
    for (let key of Object.keys(data)) {
      this[_stats][key] = data[key]
      this.emit(`update:${key}`, data[key])
    }
    this.emit('update', Object.assign({}, this[_stats]))
  }
}
