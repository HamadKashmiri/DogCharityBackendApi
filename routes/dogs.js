const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/authMiddleware');
const workerAuth = require('../middleware/workerAuth');
const mongoose = require('mongoose');
const { Dog, validateDog } = require('../models/dog');

// should probably move this to its own module and put the vars to environment vars
var Twit = require('twit')
 
var T = new Twit({
  consumer_key:         '8lccxlmM5D0bu5OIVhFmnLDCN',
  consumer_secret:      '9SCAraNMjCy94pxQdJ0SK7RtcUgUeyU2ZuqgVLwlAKBM3oXyBm',
  access_token:         '1384619180415143943-wAF2U6yQ5DjnNu2IwjaDeF6OfCCdDK',
  access_token_secret:  '479VXvVOdCqPW92saZ4ZR1tGKDvz5h4UfEytsozOhwyy7',

})
 
//object destructuring ^
const _ = require('lodash');

//GET all dogs
router.get('/', async (req, res) => {
  const dogs = await Dog.find().sort('date').populate('shelterID');
  console.log("All Dogs");
  res.send(dogs);
});

//get all dogs from a specific shelter

//POST new dog
router.post('/', [userAuth, workerAuth], async (req, res) => {
  
  const { error } = validateDog(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  // lodash saves 6 lines of code
  dog = new Dog(_.pick(req.body, ['name', 'breed', 'traits', 'description', 'age', 'gender', 'shelterID']));
   try {
    dog = await dog.save();
    if (dog) {
      console.log("New dog");
      T.post('statuses/update', { status: 'Check out our new Dog: ' + dog.name }, function(err, data, response) {});
      res.send(dog);
    }   
  }catch (err) {
    console.log(err.message);
  }
});

//PUT - update a dog
router.put('/:id', [userAuth, workerAuth], async (req, res) => {
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
router.delete('/:id', [userAuth, workerAuth], async (req, res) => {
  const dog = await Dog.deleteOne({_id: req.params.id});
  if (!dog) return res.status(404).send('The Dog with the given ID was not found.');
  console.log("Deleted Dog")
  console.log(dog)
  res.send(dog);
});

//GET single dog
router.get('/:id', userAuth, async (req, res) => {
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