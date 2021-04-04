const config = require('config');
const Joi = require('joi');
const express = require('express');
const app = express();
const morgan = require('morgan');
const dogs = require('./routes/dogs')
const mongoose = require('mongoose')

mongoose.connect('mongodb://africa-spider/dogsanctuary', { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('MongoDB Connection Refused...'))

const dogSchema = new mongoose.Schema({
    name: String,
    breed: String,
    traits: [ String ],
    description: String,
    imageURL: String,
    age: Number,
    date: { type: Date, default: Date.now },
    gender: String,
    shelter: String
})

const Dog = mongoose.model("Dogs", dogSchema);

async function createDog(){
  
  const dog = new Dog({
  name: "Bo",
  breed: "Pitbull",
  traits: ["Loving", "Likes people"],
  description: "cba to type something long",
  imageURL: "URL here",
  age: 47,
  gender: "M",
  shelter: "London(replace with id)"
})

const result = await dog.save();
console.log(result);
}

createDog()


app.use(express.json()); // req.body
app.use(express.urlencoded({extended: true})); // parses incoming req with urlenc payloads
if (app.get('env') === "development") {
  app.use(morgan('tiny'));
}
app.use('/api/dogs', dogs);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));