var app = require('./server-config.js');
var envConfig = require('./env-config.js');

console.log("Node ENV", process.env.NODE_ENV);
console.log("Process ENV", process.env);

var cfg = envConfig[process.env.NODE_ENV];

app.listen(cfg.port);

console.log('Server now listening on port ', cfg.port);
