const config = require('config');
const Joi = require('joi');
const express = require('express');
const app = express();
const morgan = require('morgan');

process.env.NODE_ENV

app.use(express.json()); // req.body
app.use(express.urlencoded({extended: true})); // parses incoming req with urlenc payloads
if (app.get('env') === "development") {
  app.use(morgan('tiny'));
}

const dogs = [
  { id: 1, name: 'dog1' },  
  { id: 2, name: 'dog2' },  
  { id: 3, name: 'dog3' },  
];


//GET all dogs
app.get('/api/dogs', (req, res) => {
  res.send(dogs);
});

//POST new dog
app.post('/api/dogs', (req, res) => {
  const { error } = validateDog(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const dog = {
    id: dogs.length + 1,
    name: req.body.name
  };
  dogs.push(dog);
  res.send(dog);
});

//PUT - update a dog
app.put('/api/dogs/:id', (req, res) => {
  const dog = dogs.find(c => c.id === parseInt(req.params.id));
  if (!dog) return res.status(404).send('The Dog with the given ID was not found.');

  const { error } = validateDog(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  dog.name = req.body.name; 
  res.send(dog);
});

//DELETE a dog
app.delete('/api/dogs/:id', (req, res) => {
  const dog = dogs.find(c => c.id === parseInt(req.params.id));
  if (!dog) return res.status(404).send('The Dog with the given ID was not found.');

  const index = dogs.indexOf(dog);
  dogs.splice(index, 1);

  res.send(dog);
});

//GET single dog
app.get('/api/dogs/:id', (req, res) => {
  const dog = dogs.find(c => c.id === parseInt(req.params.id));
  if (!dog) return res.status(404).send('The Dog with the given ID was not found.');
  res.send(dog);
});

//validate with Joi
function validateDog(dog) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });

  return schema.validate(dog);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));