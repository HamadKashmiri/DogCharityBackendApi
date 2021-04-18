const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Favourite, validateFavourite } = require('../models/favourite');

//object destructuring ^

//GET all 
router.get('/', async (req, res) => {
  const favourites = await Favourite.find().populate('dogID').populate('userID');
  console.log("All Favourites");
  res.send(favourites);
});

// need to get all with the given userID

//POST new 
router.post('/', async (req, res) => {
  const { error } = validateFavourite(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  let favourite = new Favourite({
  dogID: req.body.dogID,
  userID: req.body.userID
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

});

//DELETE 
router.delete('/:id', async (req, res) => {
  const favourite = await Favourite.deleteOne({_id: req.params.id});
  if (!favourite) return res.status(404).send('The Favourite with the given ID was not found.');
  console.log("Deleted Favourite")
  res.send(favourite);
});

//GET single 
router.get('/:id', (req, res) => {
  res.send("get single");
});


module.exports = router;