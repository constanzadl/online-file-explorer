//Require node modules
const http = require('http');

//File imports
const respond = require('./lib/respond');

//Connection settings
const port = process.env.port || 3000;

//Create server
const server = http.createServer(respond);

//Listen to client rquests on the specific port, the port shoulbd be available
server.listen(port, () => {
    console.log(`listening on port :${port}`);
});