'use strict'

const EventEmitter = require('events')

const _archive = Symbol()
const _stats = Symbol()

module.exports = class Stats extends EventEmitter {
  constructor (archive) {
    super()
    this[_archive] = archive
    this[_stats] = {
      filesProgress: 0,
      filesTotal: 0,
      bytesTotal: 0
    }
    archive.list({ live: false }).on('data', entry => this.onentry(entry))
    if (archive.closed) archive.open(() => this.onopen())
    else setImmediate(() => this.onopen())
  }
  onentry (entry) {
    this.update({
      filesProgress: this[_stats].filesProgress + 1,
      filesTotal: this[_stats].filesTotal + 1
    })
  }
  onopen () {
    this.update({
      bytesTotal: this[_archive].content.bytes
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
