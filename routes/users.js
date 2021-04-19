const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User, validateUser } = require('../models/user');
const _ = require('lodash');


//object destructuring ^

//GET all 
router.get('/', async (req, res) => {
  const users = await User.find();
  console.log("All Users");
  res.send(users);
});

//POST new user
router.post('/', async (req, res) => {
  const { error } = validateUser(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  // first validate then check dup email
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exists");
  user = new User(_.pick(req.body, ['name', 'email', 'password', 'signUpCode']));
   try {
    user = await user.save();
    if (user) {
      console.log("New User");
      res.send(user);
    }   
  }catch (err) {
    console.log(err.message);
  }
});

module.exports = router