const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Dog, validateDog } = require('../models/dog')
//object destructuring ^

//GET all dogs
router.get('/', async (req, res) => {
  const dogs = await Dog.find().sort('date').populate('shelterID');
  console.log("All Dogs");
  res.send(dogs);
});

//POST new dog
router.post('/', async (req, res) => {
  const { error } = validateDog(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  let dog = new Dog({
  name: req.body.name,
  breed: req.body.breed,
  traits: req.body.traits,
  description: req.body.description,
  age: req.body.age,
  gender: req.body.gender,
  shelterID: req.body.shelterID
})
   try {
    dog = await dog.save();
    if (dog) {
      console.log("New dog");
      res.send(dog);
    }   
  }catch (err) {
    console.log(err.message);
  }
});

//PUT - update a dog
router.put('/:id', async (req, res) => {
  // validation with Joi first from client 
  const { error } = validateDog(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  const dog = await Dog.findByIdAndUpdate(req.params.id, { name: req.body.name, 
                                                          breed: req.body.breed, 
                                                          traits: req.body.traits, 
                                                          description: req.body.description, 
                                                          age: req.body.age }, { new: true});
  if (!dog) return res.status(404).send('The Dog with the given ID was not found.');
  res.send(dog);
  // use findbyID instead and one of the below
  //alternatively each propertly 1 by 1 dog.name: name, dog.traits: etc
  //dog.set({ name: req.body.name, breed: req.body.breed, traits: req.body.traits, description: req.body.description, age: req.body.age });

});

//DELETE a dog
router.delete('/:id', async (req, res) => {
  const dog = await Dog.deleteOne({_id: req.params.id});
  if (!dog) return res.status(404).send('The Dog with the given ID was not found.');
  console.log("Deleted Dog")
  console.log(dog)
  res.send(dog);
});

//GET single dog
router.get('/:id', async (req, res) => {
  const dog = await Dog.findById(req.params.id)
  if (!dog) return res.status(404).send('The Dog with the given ID was not found.');
  res.send(dog);
});


module.exports = router;

/*{
	"name":"bastard",
	"breed": "newdog",
	"description": "new desc",
	"imageURL": "new Url",
	"age": 69,
	"traits": ["trait1"],
	"gender": "M"
}*/