var app = require('./server-config.js');
var envConfig = require('./env-config.js');
var port = process.env.PORT || envConfig[process.env.NODE_ENV];
console.log("Node ENV", process.env.NODE_ENV);
console.log("Process ENV", process.env);


app.listen(port);


console.log('Server now listening on port ', port);
