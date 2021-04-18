const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

//schema for favourite
const favouriteSchema = new mongoose.Schema({
  dogID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dogs'
  },
  //userID: {
  //  type: mongoose.Schema.Types.ObjectId,
  //  ref: 'Users'
  //},
  //userID
  date: { type: Date, 
          default: Date.now}
})
// Make Favourite model
const Favourite = mongoose.model("Favourites", favouriteSchema);

//validate with Joi
function validateFavourite(favourite) {
  const schema = Joi.object({
    dogID: Joi.objectId().required(),
    //userID: Joi.objectId().required(),
    date: Joi.date(),    
  });

  return schema.validate(favourite);
}

exports.Favourite = Favourite;
exports.validateFavourite = validateFavourite;