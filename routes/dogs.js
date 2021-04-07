const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');

//schema for dog
const dogSchema = new mongoose.Schema({
    name: { type: String, 
           required: true,
           minlength: 3,
           maxlength: 18
          },
  
    breed: { type: String, 
            required: true },
  
    traits: { type: [ String ],
            validate: {
              validator: function(value) {
                return value.length > 0;
                //ensures at least 1 trait
              },
              message: 'Dog requires a trait'
            }},
  
    description: { type: String, 
                  required: true },
  
    imageURL: { type: String },
  
    age: { type: Number, 
          required: true },
  
    date: { type: Date, 
           default: Date.now,
          required: false},
  
    gender: { type: String, 
             required: true },
  
    shelter: { type: String }
})
// Make Dog model
const Dog = mongoose.model("Dogs", dogSchema);

//GET all dogs
router.get('/', async (req, res) => {
  const dogs = await Dog.find().sort('date');
  console.log("All Dogs");
  console.log(dogs);
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
  //shelter: req.body.shelter
})
   try {
    dog = await dog.save();
    if (dog) {
      console.log("New dog");
      console.log(dog);
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

//validate with Joi
function validateDog(dog) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(18).required(),
    breed: Joi.string().required(),
    description: Joi.string().required(),
    imageURL: Joi.string().required(),
    age: Joi.number().required(),
    traits: Joi.array().items(Joi.string()),
    date: Joi.date(),
    gender: Joi.string().required()
  });

  return schema.validate(dog);
}

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