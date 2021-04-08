const mongoose = require('mongoose');
const Joi = require('joi');

//schema for favourite
const favouriteSchema = new mongoose.Schema({
  //dogID
  //userID
  date: { type: Date, 
          default: Date.now}
})
// Make Favourite model
const Favourite = mongoose.model("Favourites", favouriteSchema);

//validate with Joi
function validateFavourite(favourite) {
  const schema = Joi.object({
      //dogID
      //userID
    date: Joi.date(),    
  });

  return schema.validate(favourite);
}

exports.Favourite = Favourite;
exports.validateFavourite = validateFavourite;