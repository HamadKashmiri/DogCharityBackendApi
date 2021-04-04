const config = require('config');
const Joi = require('joi');
const express = require('express');
const app = express();
const morgan = require('morgan');
const dogs = require('./routes/dogs')

app.use(express.json()); // req.body
app.use(express.urlencoded({extended: true})); // parses incoming req with urlenc payloads
if (app.get('env') === "development") {
  app.use(morgan('tiny'));
}
app.use('/api/dogs', dogs);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));