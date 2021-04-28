const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userAuth = require('../middleware/authMiddleware');

const { Favourite, validateFavourite } = require('../models/favourite');

/**
* @swagger
* components:
*   schemas:
*     Favourite:
*       type: object
*       properties:
*         dogID:
*           type: string
*           description: id for associated dog
*         userID:
*           type: string
*           description: id of authenticated user
*         date:
*           type: string
*           description: date a dog was favourited
*         _id:
*           type: string
*           description: main id for each favourite
*/

/**
* @swagger
* tags:
*   name: Favourites
*   description: The Favourite API
*/
 

/**
* @swagger
* /api/favourites:
*   get:
*     parameters:
*     - name: x-jwtoken
*       in: header
*       description: an authorization header
*       required: true
*       type: string     
*     tags: [Favourites]
*     description: get all favourites for the logged in user  
*     responses:
*       '200':
*         description: Success
*       '401':
*         description: unauthorized - no token 
*       '400':
*         description: Token Invalid 
*/

//object destructuring ^

//GET all 
router.get('/', userAuth, async (req, res) => {
  const favourites = await Favourite.find({userID: req.user._id}).populate('dogID').populate('userID');
  console.log("All Favourites");
  res.send(favourites);
});


/**
* @swagger
* /api/favourites:
*   post: 
*     tags: [Favourites]
*     description: post a new favourite
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
*             $ref: '#/components/Schemas/Favourite' 
*     responses:
*        200:
*         description: Success
*         content: 
*           application/json:
*             schema:
*               $ref: '#/components/Schemas/Favourite' 
*        401:
*         description: unauthorized - no token 
*        400:
*         description: Token Invalid 
*/

//POST new 
router.post('/', userAuth, async (req, res) => {
  const { error } = validateFavourite(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  let favourite = new Favourite({
  dogID: req.body.dogID,
  userID: req.user._id
});
   try {
    favourite = await favourite.save();
    if (favourite) {
      res.send(favourite);
    }   
  }catch (err) {
    console.log(err.message);
  }
});

/**
* @swagger
* /api/favourites/{id}:
*   delete:
*     parameters:
*     - name: id
*       in: path
*       description: the favourite id
*       required: true
*       type: string 
*     - name: x-jwtoken
*       in: header
*       description: an authorization header
*       required: true
*       type: string     
*     tags: [Favourites]
*     description: delete a favourite
*     responses:
*       '200':
*         description: Success
*       '404':
*         description: Favourite was not found
*       '401':
*         description: unauthorized - no token 
*       '400':
*         description: Token Invalid 
*/

//DELETE 
router.delete('/:id', userAuth, async (req, res) => {
  const favourite = await Favourite.deleteOne({_id: req.params.id});
  if (!favourite) return res.status(404).send('The Favourite with the given ID was not found.');
  console.log("Deleted Favourite")
  res.send(favourite);
});




module.exports = router;