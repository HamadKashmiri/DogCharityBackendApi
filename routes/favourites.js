const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Favourite, validateFavourite } = require('../models/favourite');

//object destructuring ^

//GET all 
router.get('/', async (req, res) => {
  const favourites = await Favourite.find().populate('dogID');
  console.log("All Favourites");
  res.send(favourites);
});

//POST new 
router.post('/', async (req, res) => {
  const { error } = validateFavourite(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  let favourite = new Favourite({
  dogID: req.body.dogID
  //userID: req.body.dogID
   //userID
})
   try {
    favourite = await favourite.save();
    if (favourite) {
      console.log("Favourite has been added");
      res.send(favourite);
    }   
  }catch (err) {
    console.log(err.message);
  }
});

//PUT - update 
router.put('/:id', (req, res) => {
  res.send("update");
});

//DELETE 
router.delete('/:id', (req, res) => {
  res.send("delete");
});

//GET single 
router.get('/:id', (req, res) => {
  res.send("get single");
});


module.exports = router;