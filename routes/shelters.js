const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userAuth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuth');
const { Shelter, validateShelter } = require('../models/shelter')
//object destructuring ^
const _ = require('lodash');

/**
* @swagger
* components:
*   schemas:
*     Shelter:
*       type: object
*       required:
*         - name
*         - address
*         - contactNo
*       properties:
*         name:
*           type: string
*           description: name of the user
*         address:
*           type: string
*           description: email of the user
*         contactNo:
*           type: number
*           description: password for the user
*         _id:
*           type: string
*           description: main id for each shelter
*/

/**
* @swagger
* tags:
*   name: Shelters
*   description: The Shelters API
*/
 

/**
* @swagger
* /api/shelters:
*   get:
*     tags: [Shelters]
*     description: get all shelters 
*     responses:
*       '200':
*         description: Success
*       '401':
*         description: unauthorized - no token 
*       '400':
*         description: Token Invalid 
*/

//GET all 
router.get('/', async (req, res) => {
  const shelters = await Shelter.find();
  console.log("All Shelters");
  res.send(shelters);
});

/**
* @swagger
* /api/shelters:
*   post: 
*     tags: [Shelters]
*     description: post a new shelter
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
*             $ref: '#/components/Schemas/Shelter' 
*     responses:
*        200:
*         description: Success
*         content: 
*           application/json:
*             schema:
*               $ref: '#/components/Schemas/Shelter' 
*        404:
*         description: Shelter was not found
*        401:
*         description: unauthorized - no token 
*        400:
*         description: Token Invalid 
*/

//POST new 
router.post('/', [userAuth, adminAuth], async (req, res) => {
  const { error } = validateShelter(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  let shelter = new Shelter({
  name: req.body.name,
  address: req.body.address,
  contactNo: req.body.contactNo})
  shelter = new Shelter(_.pick(req.body, ['name', 'address', 'contactNo']));
  try {
    shelter = await shelter.save();
    if (shelter) {
      console.log("Shelter has been added");
      res.send(shelter);
    }   
  }catch (err) {
    console.log(err.message);
  }
});

/**
* @swagger
* /api/shelters/{id}:
*   delete:
*     parameters:
*     - name: id
*       in: path
*       description: the shelter id
*       required: true
*       type: string 
*     - name: x-jwtoken
*       in: header
*       description: an authorization header
*       required: true
*       type: string     
*     tags: [Shelters]
*     description: delete a shelter
*     responses:
*       '200':
*         description: Success
*       '404':
*         description: Shelter was not found
*       '401':
*         description: unauthorized - no token 
*       '400':
*         description: Token Invalid 
*/

//DELETE 
router.delete('/:id', [userAuth, adminAuth], async (req, res) => {
  const shelter = await Shelter.deleteOne({_id: req.params.id});
  if (!shelter) return res.status(404).send('The Shelter with the given ID was not found.');
  console.log("Deleted Shelter")
  res.send(shelter);
});



module.exports = router;