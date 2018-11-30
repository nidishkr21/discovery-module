// init babel
require("babel-register");
require("babel-polyfill");
const { main } = require('./src/discover');

main();
