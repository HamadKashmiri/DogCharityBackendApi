const config = require('config');
const Joi = require('joi');
const express = require('express');
const app = express();
const morgan = require('morgan');
const dogs = require('./routes/dogs')
const mongoose = require('mongoose')

const uri = 'mongodb+srv://hkhammer2:Hkhammer2.@cluster0.wjxer.mongodb.net/Database?retryWrites=true&w=majority'
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

//mongoose.connect(dburi, { useNewUrlParser: true })
//  .then(() => console.log('MongoDB Connected...'))
 // .catch(err => console.error('MongoDB Connection Refused...', err.message))

//schema for dog
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

//create new dog in db
async function createDog(){
  
  const dog = new Dog({
  name: "Bonew2",
  breed: "Pitbull",
  traits: ["Loving", "Likes people"],
  description: "cba to type something long",
  imageURL: "URL here",
  age: 47,
  gender: "M",
  shelter: "London(replace with id)"
})

const result = await dog.save();
if (result) {
  console.log("fetched dog");
  console.log(result);
}
}

//get dogs
async function getDogs() {
  const dogs = await Dog.find()
  console.log("All Dogs")
  console.log(dogs)
}
createDog()
getDogs()

app.use(express.json()); // req.body
app.use(express.urlencoded({extended: true})); // parses incoming req with urlenc payloads
if (app.get('env') === "development") {
  app.use(morgan('tiny'));
}
app.use('/api/dogs', dogs);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));