
# hyperdrive-stats

Live & persistent stats module for hyperdrive.

[![build status](https://travis-ci.org/juliangruber/hyperdrive-stats.svg?branch=master)](http://travis-ci.org/juliangruber/hyperdrive-stats)

## Usage

```js
const Stats = require('hyperdrive-stats')
const stats = Stats({ archive, db })

stats.on('update', () => console.log(stats.get()))
```

## Stats

- `"uploadSpeed"`
- `"downloadSpeed"`
- `"bytesTotal"`
- `"bytesProgress"`
- `"blocksTotal"`
- `"filesTotal"`


## License

MIT
