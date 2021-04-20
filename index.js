//File layout inspired by https://github.com/mosh-hamedani/vidly-api-node (only layout design is only used, code  changed, expanded and unique)
const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config');
require('./startup/api')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;