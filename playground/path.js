const path = require('path');

//joins paths
console.log(path.join('Node', 'Projects1'));

//converts to shortest path that leads to the same destination
console.log(path.normalize('../../Node/../Built in Modules fs'));

//full path from root
console.log(path.resolve('../../Node/../Built in Modules fs'));