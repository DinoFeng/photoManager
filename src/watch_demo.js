const chokidar = require('chokidar')
const log = console.log.bind(console)
  ;
(async () => {
  const watcher = chokidar.watch('d:/ttt', { persistent: true })
  watcher
    .on('add', path => log(`File ${path} has been added`))
    .on('error', error => log(`Watcher error: ${error}`))
})()
