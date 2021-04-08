const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Shelter, validateShelter } = require('../models/shelter')
//object destructuring ^

//GET all 
router.get('/', (req, res) => {
  res.send("get all");
});

//POST new 
router.post('/', (req, res) => {
  res.send("post");
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