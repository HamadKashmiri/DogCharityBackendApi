//File layout inspired by https://github.com/mosh-hamedani/vidly-api-node (only layout design is only used, code  changed, expanded and unique)
const express = require('express');
const app = express();
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Dogs API",
      version: "1.0.0",
      description: "Documenation for Dogs Express API",
      contact: {
        name: "Hamad Kashmiri"
      },
      servers: ["https://africa-spider-3000.codio-box.uk/"],   
    }
  },
  apis: ['./routes/*.js']
}

const specs = swaggerJsDoc(options)


require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config');
require('./startup/api')();
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(specs));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;