'use strict'

const EventEmitter = require('events')

const _archive = Symbol()
const _stats = Symbol()

module.exports = class Stats extends EventEmitter {
  constructor (archive) {
    super()
    this[_archive] = archive
    this[_stats] = {
      filesProgress: 0
    }
    archive.list({ live: false }).on('data', entry => this.onentry(entry))
    archive.on('download', entry => this.ondownload(entry))
  }
  onentry (entry) {
    this[_stats].filesProgress++
    this.update()
  }
  ondownload (entry) {
    console.log('onDownload', entry)
    if (this[_archive].isEntryDownloaded(entry)) this[_stats].filesProgress++
    this.update()
  }
  update () {
    this.emit('update', Object.assign({}, this[_stats]))
  }
}
