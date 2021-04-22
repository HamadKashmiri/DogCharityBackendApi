const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User, validateUser } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const userAuth = require('../middleware/authMiddleware');
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
  // create user then salt password
  // can remove password from pick if dont want to send to client
  user = new User(_.pick(req.body, ['name', 'email', 'password', 'signUpCode']));
  
  if(user.signUpCode != "admin" && user.signUpCode != "worker" && user.signUpCode != "user"){
    console.log(user.signUpCode);
    return res.status(400).send('Incorrect Sign Up Code');
  };
  // salt of len 8
  const salt = await bcrypt.genSalt(8);
  // set pass to hashed pass
  user.password = await bcrypt.hash(user.password, salt);
  
  //set role
  if (user.signUpCode == "admin"){
    user.role = "admin";
  } else if (user.signUpCode == "worker"){
    user.role = "worker";
  } else if (user.signUpCode == "user"){
    user.role = "user";
  }
   try {
    user = await user.save();
    if (user) {
      console.log("New User");
      const jwToken = jwt.sign({_id: user._id, role: user.role }, config.get('jwtPrivateKey'));
      // send jwt as a header and send user in the body using lodash to not send the pass
      res.header('x-jwtoken', jwToken).send(_.pick(user, ['name', 'email']));
    }   
  }catch (err) {
    console.log(err.message);
  }
});

//GET logged in user( no id for security )
router.get('/user', userAuth, async (req, res) => {
  //id is available because its in payload from jwt in userAuth middleware so no id in params rather in req.user
  const user = await User.findById(req.user._id).select('-password').select('-signUpCode');
  // above line dont need sign up code or password to be returned, might need signUpcode later
  if (!user) return res.status(404).send('The user with the given ID was not found.');
  res.send(user);
});


module.exports = router