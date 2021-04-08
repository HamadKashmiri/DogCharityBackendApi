const config = require('config');
const Joi = require('joi');
const express = require('express');
const app = express();
const morgan = require('morgan');
const dogs = require('./routes/dogs');
const favourites = require('./routes/favourites');
const shelters = require('./routes/shelters');
const mongoose = require('mongoose');

const uri = 'mongodb+srv://hkhammer2:Hkhammer2.@cluster0.wjxer.mongodb.net/Database?retryWrites=true&w=majority'
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

//mongoose.connect(dburi, { useNewUrlParser: true })
//  .then(() => console.log('MongoDB Connected...'))
 // .catch(err => console.error('MongoDB Connection Refused...', err.message))

app.use(express.json()); // req.body
app.use(express.urlencoded({extended: true})); // parses incoming req with urlenc payloads
if (app.get('env') === "development") {
  app.use(morgan('tiny'));
}

app.use('/api/dogs', dogs);
app.use('/api/favourites', favourites);
app.use('/api/shelters', shelters);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));