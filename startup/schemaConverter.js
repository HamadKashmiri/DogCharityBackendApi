const mongoose = require('mongoose');
const m2s = require('mongoose-to-swagger');
const { Dog } =  require('../models/dog');
const { Favourite } =  require('../models/favourite');
const { User } =  require('../models/user');
const { Shelter } =  require('../models/shelter');

const swaggerDogSchema = m2s(Dog);
console.log(swaggerDogSchema);
const swaggerFavouriteSchema = m2s(Favourite);
console.log(swaggerFavouriteSchema);
const swaggerUserSchema = m2s(User);
console.log(swaggerUserSchema);
const swaggerShelterSchema = m2s(Shelter);
console.log(swaggerShelterSchema);