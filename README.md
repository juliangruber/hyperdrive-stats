
# hyperdrive-stats

Live & persistent stats module for hyperdrive.

[![build status](https://travis-ci.org/juliangruber/hyperdrive-stats.svg?branch=master)](http://travis-ci.org/juliangruber/hyperdrive-stats)

## Usage

```js
var Stats = require('hyperdrive-stats')
var stats = Stats({
  archive: archive,
  db: db
})

stats.on('update', function () {
  console.log(stats.get())
})
```

## Stats

- `"bytesTotal"`
- `"bytesProgress"`
- `"blocksTotal"`
- `"filesTotal"`


## License

MIT
