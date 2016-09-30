
# hyperdrive-stats

[WIP] Stats module for hyperdrive

## Usage

```js
const Stats = require('hyperdrive-stats')
const stats = Stats(archive)

stats.on('update', () => console.log(stats.get()))
```
