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
      bytesProgress: 0,
      bytesTotal: 0,
      blocksProgress: 0,
      blocksTotal: 0
    }
    const list = archive.list({ live: false })
    this.filesProgress(list)
    this.filesTotal(list)
    this.bytesProgress()
    this.bytesTotal()
    this.blocksProgress(list)
    this.blocksTotal()
  }
  filesProgress (list) {
    list.on('data', entry => {
      this.update({ filesProgress: this[_stats].filesProgress + 1 })
    })
  }
  filesTotal (list) {
    list.on('data', () => {
      this.update({ filesTotal: this[_stats].filesTotal + 1 })
    })
  }
  bytesProgress () {
    this[_archive].on('download', buf => {
      this.update({ bytesProgress: this[_stats].bytesProgress += buf.length })
    })
  }
  bytesTotal () {
    const update = () => this.update({
      bytesTotal: this[_archive].content.bytes
    })
    this[_archive].on('download', update)
    this[_archive].metadata.on('update', update)
  }
  blocksProgress (list) {
    list.on('data', entry => {
      this.update({
        blocksProgress:
          this[_stats].blocksProgress +
          this[_archive].countDownloadedBlocks(entry)
      })
    })
    this[_archive].on('download', () => {
      this.update({
        blocksProgress: this[_stats].blocksProgress + 1
      })
    })
  }
  blocksTotal () {
    const update = () => this.update({
      blocksTotal: this[_archive].content.blocks
    })
    if (archive.closed) archive.open(update)
    else setImmediate(update)
  }
  update (data) {
    for (let key of Object.keys(data)) {
      this[_stats][key] = data[key]
      this.emit(`update:${key}`, data[key])
    }
    this.emit('update', Object.assign({}, this[_stats]))
  }
}
