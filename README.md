
# hyperdrive-stats

[WIP] Stats module for hyperdrive

[![build status](https://travis-ci.org/juliangruber/hyperdrive-stats.svg?branch=master)](http://travis-ci.org/juliangruber/hyperdrive-stats)

## Usage

```js
const Stats = require('hyperdrive-stats')
const stats = Stats(archive)

stats.on('update', () => console.log(stats.get()))
```
