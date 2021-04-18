const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User, validateuser } = require('../models/user');

//object destructuring ^

//GET all 
router.get('/', async (req, res) => {
  const users = await User.find();
  console.log("All Favourites");
  res.send(favourites);
});
