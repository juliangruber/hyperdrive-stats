'use strict'

var EventEmitter = require('events')
var index = require('hypercore-index')
var encoding = require('hyperdrive-encoding')
var inherits = require('util').inherits

var _archive = Symbol()
var _stats = Symbol()

module.exports = Stats
inherits(Stats, EventEmitter)

function Stats (opts) {
  if (!(this instanceof Stats)) return new Stats(opts)
  EventEmitter.call(this)

  var archive = opts.archive
  var db = opts.db
  var self = this

  db.get('stats', function (err, stats) {
    if (err && !err.notFound) return self.emit('error', err)

    self[_archive] = archive
    self[_stats] = Object.assign({
      bytesTotal: 0,
      blocksProgress: 0,
      blocksTotal: 0,
      filesTotal: 0
    }, JSON.parse(stats || '{}'))

    archive.open(function (err) {
      if (err) return self.emit('error', err)

      if (!archive.owner) {
        var blocksProgress = 0
        for (var i = 0; i < archive.content.blocks; i++) {
          if (archive.content.has(i)) blocksProgress++
        }
        self.update({ blocksProgress: blocksProgress })
        archive.content.on('download', function () {
          self.update({ blocksProgress: self[_stats].blocksProgress + 1 })
        })
      }
    })

    index({
      feed: opts.archive.metadata,
      db: db
    }, function (buf, cb) {
      var entry = encoding.decode(buf)
      if (entry.type === 'file') {
        db.get('!entry!' + entry.name, function (err, last) {
          if (err && !err.notFound) return cb(err)
          var lastFound = !!last
          last = JSON.parse(last || '{}')

          var update = {
            bytesTotal: self[_stats].bytesTotal +
              entry.length -
              (last.length || 0),
            blocksTotal: self[_stats].blocksTotal +
              entry.blocks -
              (last.blocks || 0)
          }
          if (archive.owner) update.blocksProgress = update.blocksTotal
          if (!lastFound) update.filesTotal = self[_stats].filesTotal + 1

          self.update(update)
          db.batch()
            .put('!entry!' + entry.name, JSON.stringify(entry))
            .put('stats', JSON.stringify(self[_stats]))
            .write(cb)
        })
      } else {
        cb()
      }
    }, function (err) {
      self.emit('error', err)
    })
  })
}

Stats.prototype.update = function (data) {
  for (var key of Object.keys(data)) {
    this[_stats][key] = data[key]
    this.emit('update:' + key)
  }
  this.emit('update')
}

Stats.prototype.get = function () {
  return Object.assign({}, this[_stats])
}
