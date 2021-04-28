const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/authMiddleware');
const workerAuth = require('../middleware/workerAuth');
const mongoose = require('mongoose');
const { Dog, validateDog } = require('../models/dog');

/**
* @swagger
* components:
*   schemas:
*     Dog:
*       type: object
*       required:
*         - name
*         - breed
*         - description
*         - imageURL
*         - age
*         - gender
*       properties:
*         name:
*           type: string
*           description: name of the dog
*         breed:
*           type: string
*           description: breed of the dog
*         traits: 
*           type: array
*           items: [Object]
*           description: traits of the dog in a list
*         description:
*           type: string
*           description: description of the dog
*         imageURL: 
*           type: string
*           description: url link for image
*         age:
*           type: number
*           description: numeric age for the dog
*         date:
*           type: string
*           required: false
*           format: date-time
*           description: date dog was created or updated
*         gender: 
*           type: string
*           description: gender of the dog
*         shelterID:
*           type: string
*           description: shelterID of the dog
*         _id:
*           type: string
*           description: main id for each dog
*/




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

/**
* @swagger
* tags:
*   name: Dogs
*   description: The Dog API
*/
 
/**
* @swagger
* /api/dogs:
*   get:
*     tags: [Dogs]
*     description: get all dogs  
*     responses:
*       '200':
*         description: Success
*/

//GET all dogs
router.get('/', async (req, res) => {
  const dogs = await Dog.find().sort('date').populate('shelterID');
  res.send(dogs);
});

/**
* @swagger
* /api/dogs/search:
*   get:
*     parameters:
*     - name: breed
*       in: query
*       description: search by breed - try golden retriever
*       required: true
*       type: string     
*     tags: [Dogs]
*     description: get all dogs by searched breed
*     responses:
*       '200':
*         description: Success
*/

//GET all by search
router.get('/search', async (req, res) => {
  const query = req.query.breed;
  let dogs = await Dog.find({breed:{$regex: query, $options: '$i'}});
  res.send(dogs)                        



});

/**
* @swagger
* /api/dogs:
*   post: 
*     tags: [Dogs]
*     description: post a new dog
*     parameters:
*     - name: x-jwtoken
*       in: header
*       description: an authorization header
*       required: true
*       type: string 
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/Schemas/Dog' 
*     responses:
*        200:
*         description: Success
*         content: 
*           application/json:
*             schema:
*               $ref: '#/components/Schemas/Dog' 
*        401:
*         description: unauthorized - no token 
*        400:
*         description: Token Invalid 
*/

//POST new dog
router.post('/', [userAuth, workerAuth], async (req, res) => {
  
  const { error } = validateDog(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  // lodash saves 6 lines of code
  dog = new Dog(_.pick(req.body, ['name', 'breed', 'description', 'imageURL', 'age', 'gender']));
   try {
    dog = await dog.save();
    if (dog) {
      T.post('statuses/update', { status: 'Check out our new Dog: ' + dog.name }, function(err, data, response) {});
      res.send(dog);
    }   
  }catch (err) {
    console.log(err.message);
  }
});

/**
* @swagger
* /api/dogs/{id}:
*   put:
*     parameters:
*     - name: id
*       in: path
*       description: the dog id
*       required: true
*       type: string 
*     - name: x-jwtoken
*       in: header
*       description: an authorization header
*       required: true
*       type: string     
*     tags: [Dogs]
*     description: update a dog
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/Schemas/Dog' 
*     responses:
*       '200':
*         description: Success
*       '404':
*         description: Dog was not found
*       '401':
*         description: unauthorized - no token 
*       '400':
*         description: Token Invalid 
*/

//PUT - update a dog
router.put('/:id', [userAuth, workerAuth], async (req, res) => {
  // validation with Joi first from client 
  const { error } = validateDog(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  const dog = await Dog.findByIdAndUpdate(req.params.id, { name: req.body.name, 
                                                          breed: req.body.breed, 
                                                          gender: req.body.gender,
                                                          imageURL: req.body.imageURL,
                                                          description: req.body.description, 
                                                          age: req.body.age }, { new: true});
  if (!dog) return res.status(404).send('The Dog with the given ID was not found.');
  res.send(dog);


});

/**
* @swagger
* /api/dogs/{id}:
*   delete:
*     parameters:
*     - name: id
*       in: path
*       description: the dog id
*       required: true
*       type: string 
*     - name: x-jwtoken
*       in: header
*       description: an authorization header
*       required: true
*       type: string     
*     tags: [Dogs]
*     description: delete a dog
*     responses:
*       '200':
*         description: Success
*       '404':
*         description: Dog was not found
*       '401':
*         description: unauthorized - no token 
*       '400':
*         description: Token Invalid 
*/

//DELETE a dog
router.delete('/:id', [userAuth, workerAuth], async (req, res) => {
  const dog = await Dog.deleteOne({_id: req.params.id});
  if (!dog) return res.status(404).send('The Dog with the given ID was not found.');
  res.send(dog);
});

/**
* @swagger
* /api/dogs/{id}:
*   get:
*     parameters:
*     - name: id
*       in: path
*       description: the dog id
*       required: true
*       type: string 
*     - name: x-jwtoken
*       in: header
*       description: an authorization header
*       required: true
*       type: string     
*     tags: [Dogs]
*     description: get single dog
*     responses:
*       '200':
*         description: Success
*       '404':
*         description: Dog was not found
*       '401':
*         description: unauthorized - no token 
*       '400':
*         description: Token Invalid 
*/

//GET single dog
router.get('/:id', userAuth, async (req, res) => {
  const dog = await Dog.findById(req.params.id)
  if (!dog) return res.status(404).send('The Dog with the given ID was not found.');
  res.send(dog);
});


module.exports = router;

/*{
	"name":"asds",
	"breed": "newdog",
	"description": "new desc",
	"imageURL": "new Url",
	"age": 69,
	"traits": ["trait1"],
	"gender": "M"
}*/