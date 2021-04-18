const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Shelter, validateShelter } = require('../models/shelter')
//object destructuring ^

//GET all 
router.get('/', async (req, res) => {
  const shelters = await Shelter.find();
  console.log("All Shelters");
  res.send(shelters);
});

//POST new 
router.post('/', async (req, res) => {
  const { error } = validateShelter(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  let shelter = new Shelter({
  name: req.body.name,
  address: req.body.address,
  contactNo: req.body.contactNo})
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

// //PUT - update 
// router.put('/:id', (req, res) => {
//   res.send("update");
// });

//DELETE 
router.delete('/:id', async (req, res) => {
  const shelter = await Shelter.deleteOne({_id: req.params.id});
  if (!shelter) return res.status(404).send('The Shelter with the given ID was not found.');
  console.log("Deleted Shelter")
  res.send(shelter);
});

// //GET single 
// router.get('/:id', (req, res) => {
//   res.send("get single");
// });


module.exports = router;