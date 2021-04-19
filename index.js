//code layout inspired by https://github.com/mosh-hamedani/vidly-api-node
const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config');
require('./startup/api');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));