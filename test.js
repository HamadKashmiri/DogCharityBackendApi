const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test')
  .then(()=> console.log('Connected to MongoDB'))
  .catch(err => console.error('Connected to MongoDB failed', err))